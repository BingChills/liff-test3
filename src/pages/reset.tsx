// Reset page for LINE LIFF permissions
import { useEffect } from 'react';
import { resetLiffPermissions } from '../LiffWrapper';

const ResetPage = () => {
  useEffect(() => {
    // Show brief message to user
    alert('Resetting LINE permissions and clearing app data...');
    
    // Execute reset
    setTimeout(() => {
      resetLiffPermissions();
      
      // Redirect to home after reset (the reload in resetLiffPermissions will take precedence)
      window.location.href = '/';
    }, 500);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Resetting Permissions</h1>
        <p className="mb-4">Clearing all app data and LINE permissions...</p>
        <div className="animate-pulse w-8 h-8 mx-auto bg-blue-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default ResetPage;
