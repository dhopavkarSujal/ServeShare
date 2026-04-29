import { supabase } from "../supabaseClient";

export const supportService = {
  async getMyTickets(userId) {
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Tickets loaded:", data?.length || 0);
      return { tickets: data, error: null };
    } catch (err) {
      console.error("Error fetching tickets:", err);
      return { tickets: [], error: err.message };
    }
  },

  async createTicket(ticket) {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .insert([ticket]);

      if (error) throw error;

      console.log("Ticket created:", ticket.subject);
      return { success: true, error: null };
    } catch (err) {
      console.error("Error creating ticket:", err);
      return { success: false, error: err.message };
    }
  },

  async getFAQs() {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;

      console.log("FAQs loaded:", data?.length || 0);
      return { faqs: data, error: null };
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      return { faqs: [], error: err.message };
    }
  },

  async getSupportInfo() {
    try {
      const { data, error } = await supabase
        .from("support_settings")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      console.log("Support info loaded");
      return { contact: data || {}, error: null };
    } catch (err) {
      console.error("Error fetching support info:", err);
      return { contact: {}, error: null };
    }
  },
};
