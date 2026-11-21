
import express from "express";

import {
  getMyReviewerProfile,
  getAssignedDocuments,
} from "../controllers/reviewer.controller.js";

import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get reviewer profile
router.get("/me", authenticateUser, getMyReviewerProfile);

// Get documents assigned to reviewer
router.get(
  "/assigned-documents",
  authenticateUser,
  getAssignedDocuments
);

export default router;
