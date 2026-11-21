
import { createClient } from "@supabase/supabase-js";

export const getMyReviewerProfile = async (req, res) => {
  try {
    const reviewerSupabase = createClient(
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

    const { data, error } = await reviewerSupabase
      .from("reviewer")
      .select(`
        reviewer_id,
        full_name,
        email,
        department_id
      `)
      .eq("auth_user_id", req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Reviewer profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      reviewer: data,
    });

  } catch (error) {
    console.error("Reviewer profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getAssignedDocuments = async (req, res) => {
  try {
    const reviewerSupabase = createClient(
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

    // Find the logged-in reviewer's profile
    const { data: reviewer, error: reviewerError } =
      await reviewerSupabase
        .from("reviewer")
        .select("reviewer_id")
        .eq("auth_user_id", req.user.id)
        .single();

    if (reviewerError || !reviewer) {
      return res.status(404).json({
        success: false,
        message: "Reviewer profile not found",
      });
    }

    // Fetch documents assigned to this reviewer
    const { data, error } = await reviewerSupabase
      .from("reviewer_assignment")
      .select(`
        assignment_id,
        assigned_at,
        assignment_status,
        document_request (
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
            submitted_at
          )
        )
      `)
      .eq("reviewer_id", reviewer.reviewer_id)
      .eq("assignment_status", "Active")
      .order("assigned_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      assignedDocuments: data,
    });

  } catch (error) {
    console.error("Assigned documents error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

