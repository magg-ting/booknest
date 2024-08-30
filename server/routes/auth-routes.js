import express from "express";
import { checkAdmin } from "../firebase-admin";

const authRouter = express.Router();

// Protect this route with admin check
authRouter.get("/inventory", checkAdmin, (req, res) => {
  // Handle the request for admin users
  res.send("This is the inventory page, accessible only by admins.");
});

export default authRouter;
