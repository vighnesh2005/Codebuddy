import express from 'express';
import connectDB from './utils/database.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import cors from "cors";
import problemRoutes from './routes/problem.route.js';
import addRoutes from './routes/addproblem.route.js';
import submitRoutes from './routes/submitproblem.route.js';
import discussionRoutes from './routes/discussions.route.js';

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/p",problemRoutes)
app.use("/api/addproblem",addRoutes)
app.use("/api/submit",submitRoutes);
app.use("/api/discussions",discussionRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
})



app.listen(4000,()=>{
  console.log('Server is running on http://localhost:4000');
  connectDB();
}); 