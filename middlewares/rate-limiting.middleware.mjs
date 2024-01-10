import rateLimit from "express-rate-limit";

const rateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    res.status(429).json({
      error: "Too many requests from this IP, please try again later.",
    });
  },
};

const RateLimiter = rateLimit(rateLimitOptions);

export const rateLimiting = (req, res, next) => {
  RateLimiter(req, res, next);
};
