import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "";
const redis = new Redis(redisUrl);

redis.on("connect", () => {
  console.info("Connected to redis");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redis;