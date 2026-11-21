
import { supabase } from "../config/supabase.js";

export const getSkills = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("skill")
      .select("*")
      .order("skill_name");

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      skills: data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
