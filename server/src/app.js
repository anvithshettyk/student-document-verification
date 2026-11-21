import departmentRoutes from "./routes/department.routes.js";
import documentTypeRoutes from "./routes/documentType.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import documentRoutes from "./routes/document.routes.js";
import reviewerRoutes from "./routes/reviewer.routes.js";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Document Verification API is running",
  });
});
app.use("/api/departments", departmentRoutes);
app.use("/api/document-types", documentTypeRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/reviewers", reviewerRoutes);
export default app;