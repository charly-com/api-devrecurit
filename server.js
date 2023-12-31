import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToMongoose from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: "*" }));



app.use("/api/users", userRoutes);

// Connect to MongoDB
connectToMongoose()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("Welcome to your Express server!");
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
