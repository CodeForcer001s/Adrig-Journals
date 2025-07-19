import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Extract ID from URL via `request.nextUrl.pathname`
export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // last segment is [id]

  if (!id) {
    return NextResponse.json({ error: 'Missing entry ID in URL' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, tags, date, media_base64 } = body;

  const { error } = await supabase
    .from('journal_entries')
    .update({ title, content, tags, date, media_base64 })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Entry updated successfully.' });
}