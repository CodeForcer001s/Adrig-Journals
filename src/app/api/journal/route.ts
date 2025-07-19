import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";


export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Unauthorized:', userError);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content, tags, date, media_base64 } = await req.json();

  // Use media_base64 field to store the URL
  const { data, error } = await supabase.from("journal_entries").insert({
    user_id: user.id,
    title,
    content,
    tags,
    date,
    media_base64, // Use existing column instead of image_url
  }).select();

  if (error) {
    console.error('Supabase insert error:', error, 'Payload:', {
      title, content, tags, date, media_base64: media_base64 ? 'URL exists' : 'No URL'
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log('Insert result:', data);
  return NextResponse.json({ message: "Journal entry created successfully.", entry: data[0] });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}