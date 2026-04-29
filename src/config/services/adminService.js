import { supabase } from "../supabaseClient";

export const adminService = {
  // 🔹 DASHBOARD STATS
  async getDashboardStats() {
    try {
      const [usersRes, ngosRes, donationsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("ngos").select("id", { count: "exact", head: true }),
        supabase.from("donations").select("id, status"),
      ]);

      const totalUsers = usersRes.count || 0;
      const totalNGOs = ngosRes.count || 0;
      const allDonations = donationsRes.data || [];
      const totalDonations = allDonations.length;
      const completed = allDonations.filter((d) => d.status === "completed").length;
      const pending = allDonations.filter((d) => d.status === "pending").length;

      console.log("Dashboard stats loaded:", {
        totalUsers,
        totalNGOs,
        totalDonations,
        completed,
        pending,
      });

      return {
        users: totalUsers,
        ngos: totalNGOs,
        donations: totalDonations,
        completed,
        pending,
      };
    } catch (err) {
      console.error("Error fetching dashboard stats:", err.message);
      return { users: 0, ngos: 0, donations: 0, completed: 0, pending: 0 };
    }
  },

  // 🔹 ALL DONATIONS
  async getAllDonations() {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select(
          `
        id,
        item_name,
        quantity,
        category,
        status,
        created_at,
        donor:donor_id(full_name, email),
        ngo:ngo_id(name)
      `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("All donations loaded:", data?.length);
      return { data, error: null };
    } catch (err) {
      console.error("Error fetching donations:", err.message);
      return { data: [], error: err.message };
    }
  },

  // 🔹 UPDATE DONATION STATUS
  async updateDonationStatus(id, status) {
    try {
      const { error } = await supabase
        .from("donations")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      console.log("Donation status updated:", id, status);
      return { success: true, error: null };
    } catch (err) {
      console.error("Error updating donation status:", err.message);
      return { success: false, error: err.message };
    }
  },

  // 🔹 ALL NGOs
  async getAllNGOs() {
    try {
      const { data, error } = await supabase
        .from("ngos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("All NGOs loaded:", data?.length);
      return { data, error: null };
    } catch (err) {
      console.error("Error fetching NGOs:", err.message);
      return { data: [], error: err.message };
    }
  },

  // 🔹 APPROVE / REJECT NGO
  async updateNGOStatus(id, status) {
    try {
      const { error } = await supabase
        .from("ngos")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      console.log("NGO status updated:", id, status);
      return { success: true, error: null };
    } catch (err) {
      console.error("Error updating NGO status:", err.message);
      return { success: false, error: err.message };
    }
  },

  // 🔹 ALL USERS (WITH PAGINATION & FILTERING)
  async getAllUsers(page = 1, limit = 10, search = "", role = "all", status = "all") {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (search.trim()) {
        query = query.or(
          `full_name.ilike.%${search}%,email.ilike.%${search}%`
        );
      }

      if (role !== "all") {
        query = query.eq("role", role);
      }

      if (status !== "all") {
        query = query.eq("status", status);
      }

      const { data, count, error } = await query;
      if (error) throw error;

      console.log("Users loaded:", data?.length, "Total:", count);
      return { data: data || [], count: count || 0, error: null };
    } catch (err) {
      console.error("Error fetching users:", err.message);
      return { data: [], count: 0, error: err.message };
    }
  },

  // 🔹 LOG ACTIVITY
  async logActivity(userId, action, details) {
    try {
      const { error } = await supabase.from("activity_logs").insert([
        {
          user_id: userId,
          action,
          details,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      console.log("Activity logged:", action);
      return { success: true, error: null };
    } catch (err) {
      console.error("Error logging activity:", err.message);
      return { success: false, error: err.message };
    }
  },

  // 🔹 SUSPEND USER
  async suspendUser(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ status: "suspended", updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      console.log("User suspended:", userId);
      return { user: data, error: null };
    } catch (err) {
      console.error("Error suspending user:", err.message);
      return { user: null, error: err.message };
    }
  },

  // 🔹 ACTIVATE USER
  async activateUser(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ status: "active", updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      console.log("User activated:", userId);
      return { user: data, error: null };
    } catch (err) {
      console.error("Error activating user:", err.message);
      return { user: null, error: err.message };
    }
  },

  // 🔹 UPDATE USER ROLE
  async updateUserRole(userId, role) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ role, updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      console.log("User role updated:", userId, "to", role);
      return { user: data, error: null };
    } catch (err) {
      console.error("Error updating user role:", err.message);
      return { user: null, error: err.message };
    }
  },

  // 🔹 CREATE AUDIT LOG
  async createAuditLog({ admin_id, target_user_id, action, details }) {
    try {
      const { error } = await supabase.from("admin_audit_logs").insert({
        admin_id,
        target_user_id,
        action,
        details,
      });

      if (error) throw error;

      console.log("Audit log created:", action);
      return { error: null };
    } catch (err) {
      console.error("Error creating audit log:", err.message);
      return { error: err.message };
    }
  },
};
