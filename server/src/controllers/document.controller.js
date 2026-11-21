
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export const uploadCertificate = async (req, res) => {
  try {
    const { document_type_id } = req.body;

    if (!req.file || !document_type_id) {
      return res.status(400).json({
        success: false,
        message: "Certificate file and document type are required",
      });
    }

    // Authenticate database and storage operations as this student
    const userSupabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${req.accessToken}`,
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // Find the student's database profile
    const { data: student, error: studentError } = await userSupabase
      .from("student")
      .select("student_id")
      .eq("auth_user_id", req.user.id)
      .single();

    if (studentError || !student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Generate a unique file path
    const fileExtension = req.file.originalname.split(".").pop();
    const fileName = `${randomUUID()}.${fileExtension}`;
    const filePath = `${req.user.id}/${fileName}`;

    // Upload certificate to Supabase Storage
    const { error: uploadError } = await userSupabase.storage
      .from("certificates")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({
        success: false,
        message: uploadError.message,
      });
    }

    // Create document request
    const { data: request, error: requestError } = await userSupabase
      .from("document_request")
      .insert({
        student_id: student.student_id,
        document_type_id,
      })
      .select("request_id")
      .single();

    if (requestError) {
      console.error("Request creation error:", requestError);

      return res.status(500).json({
        success: false,
        message: requestError.message,
      });
    }

    // Create first submission record
    const { data: submission, error: submissionError } =
      await userSupabase
        .from("document_submission")
        .insert({
          request_id: request.request_id,
          version_number: 1,
          file_path: filePath,
        })
        .select("submission_id, version_number, file_path")
        .single();

    if (submissionError) {
      console.error("Submission creation error:", submissionError);

      return res.status(500).json({
        success: false,
        message: submissionError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Certificate uploaded and saved successfully",
      request_id: request.request_id,
      submission,
    });

  } catch (error) {
    console.error("Certificate upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMyDocuments = async (req, res) => {
  try {
    const userSupabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${req.accessToken}`,
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // Find the logged-in student's profile
    const { data: student, error: studentError } = await userSupabase
      .from("student")
      .select("student_id")
      .eq("auth_user_id", req.user.id)
      .single();

    if (studentError || !student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Fetch the student's document requests and submissions
    const { data, error } = await userSupabase
      .from("document_request")
      
.select(`
  request_id,
  status,
  created_at,
  document_type (
    type_name
  ),
  document_submission (
    submission_id,
    version_number,
    file_path,
    submitted_at,
    verification_history (
      decision,
      rejection_reason,
      comments,
      verified_at
    )
  )
`)

      .eq("student_id", student.student_id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      documents: data,
    });

  } catch (error) {
    console.error("Fetch documents error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

