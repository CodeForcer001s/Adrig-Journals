"use client";
import GeneralInfoForm from "@/components/profile/GeneralInfoForm";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import UserActivity from "@/components/profile/UserActivity";
import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 bg-gray-800/30 border border-gray-800/30 rounded-2xl shadow-lg">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <p className="text-sm text-gray-400">Manage your account settings and preferences.</p>
        </div>

        {/* Profile Info */}
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-gray-600/30 transition">
          <ProfileHeader />
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/30 p-2 rounded-xl border border-gray-700/30">
          <ProfileTabs activeTab={activeTab} onSelect={setActiveTab} />
        </div>

        {/* Tab Content */}
        <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-700/50 transition text-gray-300">
          {activeTab === "General" && <GeneralInfoForm />}
          {activeTab === "Activity" && <UserActivity />}
        </div>
      </div>
    </div>
  );
}
