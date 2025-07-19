
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ProfileHeader() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return console.error(userError);

      const { data, error } = await supabase
        .from("profiles")
        .select("username, email")
        .eq("id", user.id)
        .single();

      if (error) console.error("Profile fetch error:", error.message);
      else setProfile({ ...data, id: user.id });
    };

    fetchProfile();
  }, []);

  if (!profile) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex items-center justify-between bg-gray-800/50 p-6 rounded-lg shadow-sm flex-wrap gap-4">
      <div>
        <h2 className="font-bold text-xl text-white">{profile.username}</h2>
        <p className="text-gray-400 text-sm">{profile.email}</p>
      </div>
    </div>
  );
}