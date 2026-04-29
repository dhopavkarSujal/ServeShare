import { supabase } from "../supabaseClient";

export const settingsService = {
  async getMySettings(userId) {
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return { settings: data, error: null };
    } catch (err) {
      console.error("Error fetching settings:", err);
      return { settings: null, error: err.message };
    }
  },

  async upsertMySettings(userId, payload) {
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: userId,
          email_notifications: payload.email_notifications,
          donation_updates: payload.donation_updates,
          ngo_messages: payload.ngo_messages,
          privacy_profile_public: payload.privacy_profile_public,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return { settings: data, error: null };
    } catch (err) {
      console.error("Error updating settings:", err);
      return { settings: null, error: err.message };
    }
  },

  // 🔹 ADMIN APP SETTINGS
  async getAppSettings() {
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("*")
        .limit(1)
        .single();

      if (error) {
        console.error("App settings fetch error:", error);
        return null;
      }

      return data;
    } catch (err) {
      console.error("App settings error:", err);
      return null;
    }
  },

  async updateAppSettings(id, updates) {
    try {
      const { error } = await supabase
        .from("app_settings")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        console.error("Update error:", error);
        return { error };
      }

      return { success: true };
    } catch (err) {
      console.error("Update error:", err);
      return { error: err.message };
    }
  },

  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error("Password update error:", err);
      return { error: err.message };
    }
  },
};
