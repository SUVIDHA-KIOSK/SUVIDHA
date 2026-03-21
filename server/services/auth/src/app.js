const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

const localhostOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || localhostOriginPattern.test(origin)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    error: {
      code: "CORS_FORBIDDEN",
      message: "Only localhost origins are allowed",
      details: { origin },
    },
  });
});

const corsOptions = {
  origin(origin, callback) {
    // Allow requests without an Origin (curl/Postman/server-to-server).
    if (!origin) {
      return callback(null, true);
    }

    if (localhostOriginPattern.test(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ service: "auth", status: "running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRoutes);
app.use("/auth", authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
