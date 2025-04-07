// src/pages/debug.tsx
// Simple debug page to monitor MongoDB connection and player data

import React, { useState, useEffect } from 'react';
import apiClient from '../config/api';
import { useLiff } from '../context/LiffContext';

const Debug = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useLiff();
  const [playerData, setPlayerData] = useState<any>(null);

  // Fetch health data
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/debug/health');
        setHealthData(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch health data:', err);
        setError(err.message || 'Failed to fetch health data');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
    // Refresh every 10 seconds
    const interval = setInterval(fetchHealthData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch player data if user is logged in
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!userProfile?.userId) return;
      
      try {
        const response = await apiClient.get(`/api/players/${userProfile.userId}`);
        setPlayerData(response.data);
      } catch (err) {
        console.error('Failed to fetch player data:', err);
      }
    };

    fetchPlayerData();
  }, [userProfile]);

  // Create a test player
  const createTestPlayer = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post('/api/debug/create-test-player');
      alert('Test player created successfully!');
      // Refresh health data to see the new player count
      const healthUpdate = await apiClient.get('/api/debug/health');
      setHealthData(healthUpdate.data);
    } catch (err: any) {
      setError(err.message || 'Failed to create test player');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">System Status</h1>
      
      {loading && <p className="text-gray-500">Loading health data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {healthData && (
        <div className="mb-6">
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold mb-2">MongoDB Status</h2>
            <div className="flex items-center mb-2">
              <div 
                className={`w-3 h-3 rounded-full mr-2 ${
                  healthData.mongodb.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span>{healthData.mongodb.status}</span>
            </div>
            <p>Host: {healthData.mongodb.connectionDetails.host}</p>
            <p>Database: {healthData.mongodb.connectionDetails.name}</p>
            <p>Player Count: {healthData.mongodb.playerCount}</p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Server Info</h2>
            <p>Environment: {healthData.environment}</p>
            <p>Server Time: {healthData.serverTime}</p>
            <p>Memory Usage: {Math.round(healthData.memory.heapUsed / 1024 / 1024)}MB / {Math.round(healthData.memory.heapTotal / 1024 / 1024)}MB</p>
          </div>
        </div>
      )}
      
      <button 
        onClick={createTestPlayer}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        Create Test Player
      </button>
      
      {userProfile && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Current User</h2>
          <p>User ID: {userProfile.userId}</p>
          <p>Display Name: {userProfile.displayName}</p>
          {userProfile.pictureUrl && (
            <img src={userProfile.pictureUrl} alt="Profile" className="w-16 h-16 rounded-full mt-2" />
          )}
        </div>
      )}
      
      {playerData && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Player Data</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p>Score: {playerData.score}</p>
            <h3 className="font-medium mt-2">Stores:</h3>
            <ul className="list-disc pl-5">
              {playerData.stores?.map((store: any, index: number) => (
                <li key={index}>
                  {store.name}: {store.point} points
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Debug;
