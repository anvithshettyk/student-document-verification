
import { createClient } from "@supabase/supabase-js";

export const getMyProfile = async (req, res) => {
  try {
    // Create a Supabase client using the current user's JWT
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

    const { data, error } = await userSupabase
      .from("student")
      .select(`
        student_id,
        full_name,
        usn,
        email,
        department_id,
        department (
          department_name
        )
      `)
      .eq("auth_user_id", req.user.id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      profile: data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
