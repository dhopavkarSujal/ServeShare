import { supabase } from "../supabaseClient";

export const notificationService = {
  async getMyNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Notifications loaded:", data?.length || 0, "items");
      return { notifications: data, error: null };
    } catch (err) {
      console.error("Error fetching notifications:", err);
      return { notifications: [], error: err.message };
    }
  },

  async markAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;

      console.log("Notification marked as read:", notificationId);
      return { success: true, error: null };
    } catch (err) {
      console.error("Error marking as read:", err);
      return { success: false, error: err.message };
    }
  },

  async markAllAsRead(userId) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;

      console.log("All notifications marked as read");
      return { success: true, error: null };
    } catch (err) {
      console.error("Error marking all as read:", err);
      return { success: false, error: err.message };
    }
  },

  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      console.log("Notification deleted:", notificationId);
      return { success: true, error: null };
    } catch (err) {
      console.error("Error deleting notification:", err);
      return { success: false, error: err.message };
    }
  },

  async getUnreadCount(userId) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;

      return { count: data?.length || 0, error: null };
    } catch (err) {
      console.error("Error fetching unread count:", err);
      return { count: 0, error: err.message };
    }
  },

  async getAllNotifications() {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return { notifications: data || [], error: null };
    } catch (err) {
      console.error("Error fetching all notifications:", err);
      return { notifications: [], error: err.message };
    }
  },

  async markAllSystemRead() {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false);

      if (error) throw error;

      return { success: true, error: null };
    } catch (err) {
      console.error("Error marking all as read:", err);
      return { success: false, error: err.message };
    }
  },

  async createNotification(title, message, type = "info", userId = null) {
    try {
      // 🔥 GUARD: Validate userId is provided and not null
      if (!userId) {
        console.error("Notification creation failed: userId is required");
        return { success: false, error: "User ID is required" };
      }

      console.log("Creating notification for user:", userId, "title:", title);

      const { error } = await supabase.from("notifications").insert({
        user_id: userId,
        title,
        message,
        type,
        is_read: false,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      console.log("Notification created successfully");
      return { success: true, error: null };
    } catch (err) {
      console.error("Error creating notification:", err.message || err);
      return { success: false, error: err.message };
    }
  },
};
