"use client";
import { useState } from "react";

interface ProfileTabsProps {
  activeTab: string;
  onSelect: (tab: string) => void;
}

export default function ProfileTabs({ activeTab, onSelect }: ProfileTabsProps) {
  const tabs = ["General", "Activity"];

  return (
    <div className="flex overflow-x-auto rounded-lg text-sm divide-x divide-gray-700/30">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`flex-1 py-2 px-4 transition-all border border-gray-700/30
            ${activeTab === tab
              ? "bg-gradient-to-r from-gray-700/40 to-gray-800/40 text-white font-semibold"
              : "hover:bg-gray-800/30 text-gray-300"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
