import express from 'express';
import connectDB from './utils/database.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth",authRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
})

app.listen(4000,()=>{
  console.log('Server is running on http://localhost:4000');
  connectDB();
}); 