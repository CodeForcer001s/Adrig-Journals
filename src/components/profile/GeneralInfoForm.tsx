'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function GeneralInfoForm() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const [profile, setProfile] = useState({
    username: '',
    phone: '',
    dob: '',
    location: '',
    bio: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('User fetch error:', userError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('username, phone, dob, location, bio')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error.message);
        if (error.code === 'PGRST116') {
          setIsNewUser(true);
        }
      } else {
        setProfile({
          username: data.username || '',
          phone: data.phone || '',
          dob: data.dob || '',
          location: data.location || '',
          bio: data.bio || '',
        });
        setIsNewUser(false);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user found');
      setSaving(false);
      return;
    }

    let error;

    if (isNewUser) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            ...profile,
            created_at: new Date().toISOString(),
          },
        ]);
      error = insertError;
    } else {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);
      error = updateError;
    }

    setSaving(false);

    if (!error) {
      setSuccess(true);
      setIsNewUser(false);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      console.error('Profile operation error:', error.message);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-400">Loading profile...</p>;
  }

  return (
    <>
      {isNewUser && (
        <div className="mb-6 p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
          <p className="text-blue-300 font-medium">Enter details for first time</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-700/50 rounded-md focus:outline-none focus:border-gray-600/30"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-700/50 rounded-md focus:outline-none focus:border-gray-600/30"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={profile.dob}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-700/50 rounded-md focus:outline-none focus:border-gray-600/30"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-700/50 rounded-md focus:outline-none focus:border-gray-600/30"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-700/50 rounded-md focus:outline-none focus:border-gray-600/30"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className={`bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={saving}
          >
            {saving ? 'Saving...' : isNewUser ? 'Create Profile' : 'Save Changes'}
          </button>
          {success && (
            <span className="text-green-500 text-sm">
              {isNewUser ? 'Profile created!' : 'Profile updated!'}
            </span>
          )}
        </div>
      </form>
    </>
  );
}
