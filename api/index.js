import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// utiles
import connectDB from "../config/dbConfig.js";
import serverConfig from "../config/serverConfig.js";
import userRoutes from "../routes/userRoutes.js";
import assignmentRoutes from "../routes/assignmentRoutes.js";
import classRoutes from "../routes/classRoutes.js";

const port = serverConfig.PORT || 5000;

const app = express();

connectDB()
  .then(() => console.log("Successfully connected to database"))
  .catch((err) => {
    console.error("Error connecting to database", err);
    process.exit(1); // Exit the process with an error code
  });

// List of allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://submit-hub.vercel.app"
];

// CORS configuration
const corsOptions = {
/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Checks if the request origin is in the allowed origins list
   * If the origin is in the list or if there is no origin (i.e., a same-origin request),
   * the callback is called with null as the first argument and true as the second argument.
   * Otherwise, the callback is called with an error as the first argument and false as the second argument.
   * @param {string} origin - The origin of the request
   * @param {function} callback - The callback function to call with the result
   */
/*******  cc49330f-3138-45f2-b75f-9fec245abda2  *******/  origin: (origin, callback) => {
    // Check if the request origin is in the allowed origins list
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200, // Allow credentials such as cookies
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/classes", classRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => console.log(`Server listening on ${port}`));

export default app;
