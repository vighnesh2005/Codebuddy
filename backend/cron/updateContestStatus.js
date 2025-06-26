import cron from "node-cron";
import { Contest, ContestSubmission } from "../models/contest.model.js";
import { Submission } from "../models/submission.model.js";
import { Problem } from "../models/problem.model.js";

cron.schedule("* * * * *", async () => {
  try {
    const time = new Date();

    //  Upcoming → Running
    await Contest.updateMany(
      {
        status: "Upcoming",
        start_time: { $lte: time },
        end_time: { $gt: time }
      },
      { $set: { status: "Running" } }
    );

    //  Running contests that should now end
    const endingContests = await Contest.find({
      status: "Running",
      end_time: { $lte: time }
    });

    for (const contest of endingContests) {
      //  Copy contest submissions
      const contestSubmissions = await ContestSubmission.find(
        { contest: contest._id },
        {
          user: 1,
          problem: 1,
          code: 1,
          result: 1,
          language: 1,
          date: 1,
          noofpassed: 1,
          total: 1
        }
      );

      if (contestSubmissions.length > 0) {
        await Submission.insertMany(contestSubmissions);
      }

      //  Make problems public
      const problemIds = contest.problems.map(p => p.problem);
      await Problem.updateMany(
        { _id: { $in: problemIds }, isPublic: false },
        { $set: { isPublic: true } }
      );
    }

    //  Running → Ended
    await Contest.updateMany(
      {
        status: "Running",
        end_time: { $lte: time }
      },
      { $set: { status: "Ended" } }
    );

    console.log(`Contest cron ran at ${time.toLocaleTimeString()}`);
  } catch (err) {
    console.error("Cron error:", err.message);
  }
});
