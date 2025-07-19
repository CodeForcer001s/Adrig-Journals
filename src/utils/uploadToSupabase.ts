import { createClient } from './supabase/client';

export async function uploadImageToSupabase(file: File): Promise<string> {
  try {
    // Create a unique filename using timestamp and original filename
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `journal-images/${fileName}`;
    
    // Initialize Supabase client
    const supabase = createClient();
    
    // Upload file to the 'adrig' bucket
    const { data, error } = await supabase.storage
      .from('adrig')
      .upload(filePath, file, {
        contentType: file.type, // Explicitly set content type based on file
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('Upload error details:', error);
      throw error;
    }
    
    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('adrig')
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}