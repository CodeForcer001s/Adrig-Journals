import React from 'react'
import { useAuth } from '@/utils/context/AuthContext';

const DashboardHeader = () => {
  const { user } = useAuth();
  const currentTime = new Date();
  const hour = currentTime.getHours();
  
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
  } else if (hour >= 17) {
    greeting = "Good evening";
  }

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white">
        {greeting}, {user?.email?.split('@')[0] || 'Writer'}
      </h1>
      <p className="text-gray-300 mt-2">
        Welcome to your personal journal dashboard. Track your writing progress and continue your journey.
      </p>
      <div className="flex items-center mt-4 text-sm text-gray-400">
        <span className="mr-4">
          <span className="font-medium">Today:</span> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>
    </div>
  )
}

export default DashboardHeader