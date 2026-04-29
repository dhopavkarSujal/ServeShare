import { supabase } from "../supabaseClient";

export const donationService = {
  /**
   * Get donation stats for a donor
   */
  async getDonorStats(userId) {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("status")
        .eq("donor_id", userId);

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter((d) => d.status === "pending").length,
        completed: data.filter((d) => d.status === "completed").length,
      };

      return { stats };
    } catch (err) {
      console.error("Error fetching donor stats:", err);
      return { stats: { total: 0, pending: 0, completed: 0 } };
    }
  },

  /**
   * Get donations for current user
   */
  async getMyDonations(userId, options = {}) {
    try {
      const { pageSize = 10 } = options;

      const { data, error } = await supabase
        .from("donations")
        .select(`
          id,
          item_name,
          category,
          quantity,
          status,
          description,
          pickup_date,
          created_at,
          ngo:ngos(id, name, location, city)
        `)
        .eq("donor_id", userId)
        .order("created_at", { ascending: false })
        .limit(pageSize);

      if (error) {
        console.error("Donations query error:", error);
        return { donations: [], error: error.message };
      }

      console.log("Donations fetched:", data);
      return { donations: data || [], error: null };
    } catch (err) {
      console.error("Error fetching donations:", err);
      return { donations: [], error: err.message };
    }
  },

  /**
   * Get all donations (for admin)
   */
  async getAllDonations(options = {}) {
    try {
      const { pageSize = 10, status = null } = options;

      let query = supabase
        .from("donations")
        .select(
          `
          id,
          item_name,
          item_description,
          status,
          created_at,
          donor:profiles(id, full_name, email),
          ngo:ngos(id, name, location)
        `
        )
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query.limit(pageSize);

      if (error) throw error;

      return { donations: data || [] };
    } catch (err) {
      console.error("Error fetching all donations:", err);
      return { donations: [] };
    }
  },

  /**
   * Create a new donation (simplified version for donors)
   */
  async addDonation({ donor_id, ngo_id, item_name, category, quantity }) {
    try {
      const { data, error } = await supabase
        .from("donations")
        .insert({
          donor_id,
          ngo_id,
          item_name,
          category,
          quantity,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      return { donation: data, error: null };
    } catch (err) {
      console.error("Error adding donation:", err);
      return { donation: null, error: err.message };
    }
  },

  /**
   * Create a new donation
   */
  async createDonation(donationData) {
    try {
      const { data, error } = await supabase
        .from("donations")
        .insert([donationData])
        .select()
        .single();

      if (error) throw error;

      return { success: true, donation: data };
    } catch (err) {
      console.error("Error creating donation:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Update donation status
   */
  async updateDonationStatus(donationId, status) {
    try {
      const { data, error } = await supabase
        .from("donations")
        .update({ status })
        .eq("id", donationId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, donation: data };
    } catch (err) {
      console.error("Error updating donation:", err);
      return { success: false, error: err.message };
    }
  },
};
