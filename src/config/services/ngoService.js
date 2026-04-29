import { supabase } from "../supabaseClient";

export const ngoService = {
  /**
   * Get approved NGOs with optional filtering
   */
  async getApprovedNGOs(options = {}) {
    try {
      const { city = null, limit = 50 } = options;

      let query = supabase
        .from("ngos")
        .select("id, name, location, city, description, logo_url, rating, categories")
        .eq("verified_status", "approved")
        .order("rating", { ascending: false });

      if (city) {
        query = query.eq("city", city);
      }

      const { data, error } = await query.limit(limit);

      if (error) throw error;

      return { ngos: data || [] };
    } catch (err) {
      console.error("Error fetching approved NGOs:", err);
      return { ngos: [] };
    }
  },

  /**
   * Get NGO by ID
   */
  async getNGOById(ngoId) {
    try {
      const { data, error } = await supabase
        .from("ngos")
        .select("*")
        .eq("id", ngoId)
        .single();

      if (error) throw error;

      return { ngo: data };
    } catch (err) {
      console.error("Error fetching NGO:", err);
      return { ngo: null };
    }
  },

  /**
   * Get all NGOs (for admin)
   */
  async getAllNGOs(options = {}) {
    try {
      const { status = null, limit = 50 } = options;

      let query = supabase
        .from("ngos")
        .select("id, name, location, city, status, created_at, rating")
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("verified_status", status);
      }

      const { data, error } = await query.limit(limit);

      if (error) throw error;

      return { ngos: data || [] };
    } catch (err) {
      console.error("Error fetching NGOs:", err);
      return { ngos: [] };
    }
  },

  /**
   * Update NGO status (for admin)
   */
  async updateNGOStatus(ngoId, status) {
    try {
      const { data, error } = await supabase
        .from("ngos")
        .update({ status })
        .eq("id", ngoId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, ngo: data };
    } catch (err) {
      console.error("Error updating NGO status:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Get NGO stats (for NGO dashboard)
   */
  async getNGOStats(ngoId) {
    try {
      // Get total donations received
      const { data: donations, error: donError } = await supabase
        .from("donations")
        .select("id, status")
        .eq("ngo_id", ngoId);

      if (donError) throw donError;

      const stats = {
        totalDonations: donations.length,
        pendingPickups: donations.filter((d) => d.status === "pending").length,
        completed: donations.filter((d) => d.status === "completed").length,
      };

      return { stats };
    } catch (err) {
      console.error("Error fetching NGO stats:", err);
      return { stats: { totalDonations: 0, pendingPickups: 0, completed: 0 } };
    }
  },
};
