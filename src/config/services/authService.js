import { supabase } from "../supabaseClient";

/**
 * Get user profile by ID from database - SAFE VERSION
 * Never throws, always returns data or null
 */
async function getProfileById(userId) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("getProfileById error:", error.message);
      return null;
    }

    console.log("Profile loaded for user:", userId);
    return data || null;
  } catch (err) {
    console.error("getProfileById exception:", err.message);
    return null;
  }
}

export const authService = {
  // 🔹 SIGN UP
  async signUp({ email, password, fullName, role }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) return { error: error.message };

    return { user: data.user };
  },

  // 🔹 SIGN IN
  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error: error.message };

    const user = data.user;
    const profile = await getProfileById(user.id);

    if (!profile) {
      console.warn("Profile not found for user:", user.id);
    }

    return { user, profile };
  },

  // 🔹 GET PROFILE BY ID
  async getProfileById(userId) {
    return getProfileById(userId);
  },

  // 🔹 GET CURRENT USER
  async getCurrentProfile() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return { profile: null };
      }

      const profile = await getProfileById(user.id);

      if (!profile) {
        console.warn("Profile not found for user:", user.id);
        return { profile: null };
      }

      return { profile };
    } catch (err) {
      console.error("Auth error in getCurrentProfile:", err.message);
      return { profile: null };
    }
  },

  // 🔹 SIGN OUT
  async signOut() {
    await supabase.auth.signOut();
  },

  // 🔹 AUTH LISTENER
  onAuthChange(callback) {
    const { data } = supabase.auth.onAuthStateChange(callback);
    return () => data.subscription.unsubscribe();
  },
};