import express, { json } from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
configDotenv();
import mongoose from "mongoose";

import { postLogin, postSignup } from "./controllers/user.js";
import { authenticateToken, authorizeRole } from "./middleware/auth.js";
import {
  getInventory,
  postInventory,
  putInventory,
} from "./controllers/inventory.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

const mongoDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URL);
  if (!conn) {
    throw new Error("Error connecting to MongoDB");
  }
  console.log("MongoDB Connect Successfully✅");
};
mongoDB();

app.get("/health", (req, res) => {
  res.json({ message: "Server is running", success: true });
});

// user api`s
app.post("/signup", postSignup);
app.post("/login", postLogin);

// Inventory Api`s
app.get("/inventories", authenticateToken, getInventory);
app.post(
  "/inventories",
  authenticateToken,
  authorizeRole(["admin", "manager"]),
  postInventory
);
app.put(
  "/inventories/:id",
  authenticateToken,
  authorizeRole(["admin", "manager"]),
  putInventory
);
app.delete("/inventories/:id", authenticateToken, authorizeRole(["admin"]));

app.listen(port, () => {
  console.log(`Server is running on ${port}✈️`);
});
