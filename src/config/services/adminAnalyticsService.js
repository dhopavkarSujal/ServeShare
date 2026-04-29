import { supabase } from "../supabaseClient";

export const adminAnalyticsService = {
  async getDashboardStats() {
    const now = new Date();
    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 7);

    // Donations this week
    const { data: donations } = await supabase
      .from("donations")
      .select("status, created_at")
      .gte("created_at", last7Days.toISOString());

    // Users this week
    const { data: users } = await supabase
      .from("profiles")
      .select("created_at")
      .gte("created_at", last7Days.toISOString());

    // NGOs approved
    const { data: ngos } = await supabase
      .from("ngos")
      .select("status");

    const completed = donations?.filter(d => d.status === "completed").length || 0;

    return {
      donationsCount: donations?.length || 0,
      usersCount: users?.length || 0,
      ngosApproved: ngos?.filter(n => n.status === "approved").length || 0,
      completionRate: donations?.length
        ? Math.round((completed / donations.length) * 100)
        : 0,
    };
  },

  async getWeeklyChart() {
    const { data } = await supabase
      .from("donations")
      .select("created_at");

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = {};

    days.forEach(d => result[d] = { date: d, donations: 0 });

    data?.forEach(d => {
      const day = new Date(d.created_at).getDay();
      const label = days[day];
      result[label].donations++;
    });

    return Object.values(result);
  },

  async getMonthlyReports() {
    const stats = await this.getDashboardStats();
    
    return [
      { name: "Donations Growth", value: `${stats.donationsCount}`, status: "Positive" },
      { name: "Active Users", value: `${stats.usersCount}`, status: "Healthy" },
      { name: "Approved NGOs", value: `${stats.ngosApproved}`, status: "Stable" },
      { name: "Completion Rate", value: `${stats.completionRate}%`, status: "Improving" },
    ];
  },
};
