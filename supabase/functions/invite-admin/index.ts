import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, full_name, role } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 🔐 Check admin
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser(token);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    // ✅ CHECK DUPLICATE EMAIL
    const { data: existing } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 🔹 CREATE USER (trigger handles profile insert)
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: "Temp@1234",
        email_confirm: true,
        user_metadata: {
          full_name,
          role,
        },
      });

    if (userError) {
      console.log("CREATE USER ERROR:", userError);
      return new Response(JSON.stringify({ error: userError.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    if (!userData?.user) {
      return new Response(JSON.stringify({ error: "User creation failed" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    console.log("FUNCTION ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
