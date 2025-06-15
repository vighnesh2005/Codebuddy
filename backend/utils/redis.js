import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
  url: 'https://communal-pug-49145.upstash.io',
  token: process.env.REDIS_TOKEN,
})
 
export default redis;
