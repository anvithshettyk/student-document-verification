
import { supabase } from "../config/supabase.js";

export const getDocumentTypes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("document_type")
      .select("*")
      .order("type_name");

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      documentTypes: data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
