import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllJobs, getAllLabourProfiles, getAllUsers } from '../services/dataService';

export const DebugPanel: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setJobs(getAllJobs());
      setProfiles(getAllLabourProfiles());
      setUsers(getAllUsers());
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 z-50"
        title="Open Debug Panel"
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">🐛 Debug Panel</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Current User */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="font-bold text-lg mb-2">👤 Current User</h3>
            <pre className="text-xs bg-white p-2 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          {/* Jobs */}
          <div className="border rounded-lg p-4 bg-green-50">
            <h3 className="font-bold text-lg mb-2">💼 All Jobs ({jobs.length})</h3>
            {jobs.length === 0 ? (
              <p className="text-gray-500">No jobs found</p>
            ) : (
              <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-60">
                {JSON.stringify(jobs, null, 2)}
              </pre>
            )}
          </div>

          {/* Labour Profiles */}
          <div className="border rounded-lg p-4 bg-yellow-50">
            <h3 className="font-bold text-lg mb-2">👷 Labour Profiles ({profiles.length})</h3>
            {profiles.length === 0 ? (
              <p className="text-gray-500">No labour profiles found</p>
            ) : (
              <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-60">
                {JSON.stringify(profiles, null, 2)}
              </pre>
            )}
          </div>

          {/* Users */}
          <div className="border rounded-lg p-4 bg-purple-50">
            <h3 className="font-bold text-lg mb-2">📋 Users ({users.length})</h3>
            {users.length === 0 ? (
              <p className="text-gray-500">No users found</p>
            ) : (
              <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-60">
                {JSON.stringify(users, null, 2)}
              </pre>
            )}
          </div>

          {/* Quick Actions */}
          <div className="border rounded-lg p-4 bg-red-50">
            <h3 className="font-bold text-lg mb-2">🗑️ Quick Actions</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (window.confirm('Clear ALL data? This cannot be undone!')) {
                    localStorage.clear();
                    window.location.href = '/';
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Clear All Data
              </button>
              <button
                onClick={() => {
                  setJobs(getAllJobs());
                  setProfiles(getAllLabourProfiles());
                  setUsers(getAllUsers());
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
