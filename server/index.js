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

import { postSales , getSales} from "./controllers/sales.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());
import cors from "cors";  // Import cors

const corsOptions = {
  origin: "https://smart-inventory-ysnz.onrender.com" || "localhost://5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions)); // Use CORS middleware

// app.use(cors());
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*'); // or specify origin
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // include Authorization
//   if (req.method === 'OPTIONS') {
//       res.sendStatus(200); // Important: Respond to preflight requests
//   } else {
//       next(); // Continue to other routes
//   }
// });

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

// Sale API`s
app.get("/sales", authenticateToken, getSales);
app.post('/sales' , authenticateToken , postSales)

app.listen(port, () => {
  console.log(`Server is running on ${port}✈️`);
});
