
import express from "express";
import { getDocumentTypes } from "../controllers/documentType.controller.js";

const router = express.Router();

router.get("/", getDocumentTypes);

export default router;
