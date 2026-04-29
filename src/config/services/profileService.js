import { supabase } from "../supabaseClient";

export const profileService = {
  async getMyProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return { profile: data, error: null };
    } catch (err) {
      console.error("Error fetching profile:", err);
      return { profile: null, error: err.message };
    }
  },

  async updateMyProfile(userId, payload) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: payload.full_name,
          email: payload.email,
          phone: payload.phone,
          avatar_url: payload.avatar_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return { profile: data, error: null };
    } catch (err) {
      console.error("Error updating profile:", err);
      return { profile: null, error: err.message };
    }
  },
};
