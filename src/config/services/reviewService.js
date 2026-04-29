import { supabase } from "../supabaseClient";

export const reviewService = {
  async getAllReviews(status = null) {
    let query = supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        status,
        created_at,
        user:user_id(full_name, role),
        ngo:ngo_id(name)
      `)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Reviews fetch error:", error);
      return [];
    }

    return data || [];
  },

  async getStats() {
    const { data, error } = await supabase.from("reviews").select("rating, status");

    if (error || !data) {
      return { avg: 0, total: 0, positivePercent: 0, pending: 0 };
    }

    const total = data.length;
    const avg = total
      ? (data.reduce((a, b) => a + b.rating, 0) / total).toFixed(1)
      : 0;

    const positive = data.filter(r => r.rating >= 4).length;
    const pending = data.filter(r => r.status === "pending").length;

    return {
      avg,
      total,
      positivePercent: total ? Math.round((positive / total) * 100) : 0,
      pending
    };
  },

  async updateStatus(id, status) {
    const { error } = await supabase
      .from("reviews")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
      return { error };
    }

    return { success: true };
  },

  async deleteReview(id) {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      return { error };
    }

    return { success: true };
  }
};
