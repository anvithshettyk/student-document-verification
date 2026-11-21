
import express from "express";

import {
  uploadCertificate,
  getMyDocuments,
} from "../controllers/document.controller.js";

import { authenticateUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Upload a certificate
router.post(
  "/upload",
  authenticateUser,
  upload.single("certificate"),
  uploadCertificate
);

// Get logged-in student's documents
router.get(
  "/my-documents",
  authenticateUser,
  getMyDocuments
);

export default router;
