import { supabase } from "../supabaseClient";

export const activityService = {
  /**
   * Get activity logs for a specific user
   */
  async getMyActivity(userId, options = {}) {
    try {
      const { limit = 50 } = options;

      const { data, error } = await supabase
        .from("activity_logs")
        .select("id, user_id, action, description, entity_type, entity_id, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { logs: data || [] };
    } catch (err) {
      console.error("Error fetching activity logs:", err);
      return { logs: [] };
    }
  },

  /**
   * Get all activity logs (for admin)
   */
  async getAllActivity(options = {}) {
    try {
      const { limit = 100, entityType = null } = options;

      let query = supabase
        .from("activity_logs")
        .select(
          `
          id,
          user_id,
          action,
          description,
          entity_type,
          entity_id,
          created_at,
          user:profiles(full_name, email)
        `
        )
        .order("created_at", { ascending: false });

      if (entityType) {
        query = query.eq("entity_type", entityType);
      }

      const { data, error } = await query.limit(limit);

      if (error) throw error;

      return { logs: data || [] };
    } catch (err) {
      console.error("Error fetching all activity:", err);
      return { logs: [] };
    }
  },

  /**
   * Log an activity
   */
  async logActivity(userId, action, description, entityType = null, entityId = null) {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .insert([
          {
            user_id: userId,
            action,
            description,
            entity_type: entityType,
            entity_id: entityId,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return { success: true, log: data };
    } catch (err) {
      console.error("Error logging activity:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Get admin logs with details (for AdminLogsPage)
   */
  async getLogs(limit = 50) {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select(`
          id,
          action,
          description,
          status,
          created_at,
          user:user_id(full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Logs fetch error:", error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error("Activity logs error:", err);
      return [];
    }
  },

  /**
   * Create admin log entry
   */
  async createLog(logData) {
    try {
      const { error } = await supabase.from("activity_logs").insert({
        ...logData,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Create log error:", error);
        return { error };
      }

      return { success: true };
    } catch (err) {
      console.error("Create log error:", err);
      return { error: err.message };
    }
  },

  /**
   * Get logs by action type
   */
  async getLogsByAction(action, limit = 20) {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select(`
          id,
          action,
          description,
          status,
          created_at,
          user:user_id(full_name)
        `)
        .eq("action", action)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Filtered logs error:", error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error("Filtered logs error:", err);
      return [];
    }
  },
};
