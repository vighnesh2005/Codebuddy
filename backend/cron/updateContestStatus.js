import cron from "node-cron";
import { Contest, ContestRanking } from "../models/contest.model.js";
import { redis } from "../utils/redis.js";
import User from "../models/user.model.js";
import { Problem } from "../models/problem.model.js";

cron.schedule("* * * * *", async () => {
  try {
    const time = new Date();

    // --- Upcoming → Running ---
    const contests = await Contest.find({
      status: "Upcoming",
      start_time: { $lte: time },
      end_time: { $gt: time },
    });

    for (const contest of contests) {
      contest.status = "Running";
      await contest.save();

      const rankings = await ContestRanking.find({ contest: contest._id })
        .populate("user", "username profile _id")
        .sort({ _id: 1 });

      const redisData = [];

      for (let i = 0; i < rankings.length; i++) {
        rankings[i].rank = i + 1;
        rankings[i].lastScoreUpdate = time;
        await rankings[i].save();

        redisData.push({
          _id: rankings[i]._id,
          rank: i + 1,
          user: rankings[i].user._id,
          username: rankings[i].user.username,
          profile: rankings[i].user.profile,
          score: rankings[i].score,
          penalty: rankings[i].penalty,
          lastScoreUpdate: rankings[i].lastScoreUpdate,
        });
      }

      await redis.set(`rankings-${contest._id}`, redisData);
      console.log(`Contest "${contest.name}" is now Running`);
    }

    // --- Running → Ended ---
    const endingContests = await Contest.find({
      status: "Running",
      end_time: { $lte: time },
    });

    for (const contest of endingContests) {
      contest.status = "Ended";
      await contest.save();

      // Make problems public
      for (const prob of contest.problems) {
        await Problem.updateOne({ _id: prob.problem }, { $set: { isPublic: true } });
      }

      const rankings = await redis.get(`rankings-${contest._id}`);
      if (!rankings) continue;

      const baseRating = 1500;
      const k = 50;
      const total = rankings.length;

      // Update contest rankings in DB
      for (const r of rankings) {
        await ContestRanking.findByIdAndUpdate(r._id, {
          $set: {
            rank: r.rank,
            lastScoreUpdate: r.lastScoreUpdate,
            score: r.score,
            penalty: r.penalty,
          },
        });
      }

      // Update each user's rating
      for (const r of rankings) {
        const user = await User.findById(r.user);
        if (!user) continue;

        const performance = (r.rank - 1) / Math.max(1, (total - 1));

        if (!Array.isArray(user.ratingHistory)) {
          user.ratingHistory = [user.rating ?? baseRating];
        }

        const currentRating = user.ratingHistory[user.ratingHistory.length - 1] || baseRating;
        const newRating = currentRating + k * (performance - 0.5);

        user.rating = newRating;
        user.ratingHistory.push(newRating);
        user.contestsParticipated += 1;

        await user.save();
      }

      await redis.del(`rankings-${contest._id}`);
      console.log(`Finalized rankings for "${contest.name}"`);
    }

    console.log(`✅ Contest cron ran at ${time.toLocaleTimeString()}`);
  } catch (err) {
    console.error("❌ Cron error:", err.message);
  }
});
