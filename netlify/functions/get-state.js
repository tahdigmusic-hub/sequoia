const { createClient } = require("@supabase/supabase-js");

exports.handler = async () => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("sequoia_options")
      .select("*")
      .order("amount", { ascending: true });

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ options: data })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
