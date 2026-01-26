const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { id } = JSON.parse(event.body || "{}");
    if (!id) {
      return { statusCode: 400, body: "Missing option id" };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: row, error } = await supabase
      .from("sequoia_options")
      .select("available, clicks, click_limit")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!row.available) {
      return { statusCode: 200, body: JSON.stringify({ soldOut: true }) };
    }

    const nextClicks = row.clicks + 1;
    const soldOut =
      row.click_limit !== null && nextClicks >= row.click_limit;

    await supabase
      .from("sequoia_options")
      .update({
        clicks: nextClicks,
        available: soldOut ? false : true
      })
      .eq("id", id);

    return {
      statusCode: 200,
      body: JSON.stringify({ soldOut })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
