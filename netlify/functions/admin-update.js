const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const token = event.headers["x-admin-token"];
  if (token !== process.env.ADMIN_TOKEN) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  try {
    const { id, available, click_limit } = JSON.parse(event.body || "{}");

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    await supabase
      .from("sequoia_options")
      .update({ available, click_limit })
      .eq("id", id);

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
