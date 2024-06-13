import redis from "redis";

const REDIS_URL = "redis://sequence-redis:6379";

// Create redis client
const client = redis.createClient({ url: REDIS_URL });

client
  .connect()
  .then(() => {
    console.log("Redis Client Connected");
  })
  .catch((err) => console.error("Redis Client Error:", err));

export default client;
