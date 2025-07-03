import express from 'express';
import connectDB from './utils/database.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import cors from "cors";
import problemRoutes from './routes/problem.route.js';
import addRoutes from './routes/addproblem.route.js';
import submitRoutes from './routes/submitproblem.route.js';
import discussionRoutes from './routes/discussions.route.js';
import contestRoutes from './routes/contest.route.js';
import "./cron/updateContestStatus.js";
import profileRoutes from './routes/profile.route.js';

const app = express();


app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://codebuddy-1wcn.vercel.app"
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true , limit: "50mb" }));
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/p",problemRoutes)
app.use("/api/addproblem",addRoutes)
app.use("/api/submit",submitRoutes);
app.use("/api/discussions",discussionRoutes);
app.use("/api/contest",contestRoutes);
app.use("/api/profile",profileRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
})

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
  console.log('Server is running on http://localhost:4000');
  connectDB();
}); 