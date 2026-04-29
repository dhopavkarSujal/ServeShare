import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // 🔹 STEP 1: Restore session from storage
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        const sessionUser = data.session?.user || null;

        if (!sessionUser) {
          if (isMounted) {
            setUser(null);
            setProfile(null);
          }
          return;
        }

        // 🔹 STEP 2: Fetch profile
        const profileData = await authService.getProfileById(sessionUser.id);

        if (isMounted) {
          setUser(sessionUser);
          setProfile(profileData);
        }
      } catch (err) {
        console.error("Auth init error:", err.message);

        if (isMounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        // ✅ ALWAYS end loading
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // 🔹 STEP 3: Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log("Auth Event:", event);

        // ✅ SIGNED_IN handled by login() method - don't duplicate here
        if (event === "SIGNED_IN" && session?.user) {
          console.log("✓ Session active, login() already handled profile fetch");
        }

        // ✅ SIGNED_OUT - clear everything
        if (event === "SIGNED_OUT") {
          console.log("✓ User signed out");
          if (isMounted) {
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async ({ email, password, selectedRole }) => {
    setError(null);

    try {
      const { user: authUser, profile: authProfile, error: signInError } = await authService.signIn({
        email,
        password,
      });

      if (signInError) {
        setError(signInError);
        return { success: false, error: signInError };
      }

      if (!authProfile) {
        console.error("❌ LOGIN FAILED: profile missing for user:", authUser?.id);
        const msg = "Profile not found. Please contact support.";
        setError(msg);
        return { success: false, error: msg };
      }

      console.log("✅ LOGIN SUCCESS: profile loaded for", authUser?.id);

      setUser(authUser);
      setProfile(authProfile);

      // Determine redirect URL based on role
      const redirectMap = {
        admin: "/admin",
        ngo: "/ngo",
        donor: "/user",
      };

      const redirectTo = redirectMap[authProfile.role] || "/user";

      return { success: true, profile: authProfile, redirectTo };
    } catch (err) {
      console.error("❌ LOGIN ERROR:", err?.message);
      const errorMsg = err?.message || "Login failed";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const register = async ({ email, password, fullName, role, phone }) => {
    setError(null);

    try {
      const { user: newUser, error: signUpError } = await authService.signUp({
        email,
        password,
        fullName,
        role,
        phone,
      });

      if (signUpError) {
        setError(signUpError);
        return { success: false, error: signUpError };
      }

      return { success: true, user: newUser };
    } catch (err) {
      const errorMsg = err?.message || "Registration failed";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        login,
        register,
        logout,
        isAdmin: profile?.role === "admin",
        isNGO: profile?.role === "ngo",
        isDonor: profile?.role === "donor",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);