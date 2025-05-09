import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AuthTest = () => {
  const { currentUser, isAuthenticated, login, logout } = useAuth();

  const handleTestLogin = () => {
    // Create a test user with ID 1
    const testUser = { id: 1, username: 'testuser' };
    login(testUser);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
      
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        <p className="mb-2">
          <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
        </p>
        <p className="mb-2">
          <strong>Current User:</strong>
        </p>
        <pre className="bg-gray-100 p-4 rounded overflow-auto mb-4">
          {JSON.stringify(currentUser, null, 2) || 'null'}
        </pre>
        
        <div className="flex gap-4">
          <button
            onClick={handleTestLogin}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Set Test User
          </button>
          
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="mb-2">Navigate to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          </li>
          <li>
            <Link to="/api-test" className="text-blue-600 hover:underline">API Test</Link>
          </li>
          <li>
            <Link to="/learning-plans" className="text-blue-600 hover:underline">Learning Plans</Link>
          </li>
          <li>
            <Link to="/learning-plans/create" className="text-blue-600 hover:underline">Create Learning Plan</Link>
          </li>
          <li>
            <Link to="/test-create-plan" className="text-blue-600 hover:underline font-bold">Test Create Plan (Unprotected)</Link>
          </li>
          <li>
            <Link to="/simple-form" className="text-blue-600 hover:underline font-bold">Simple Test Form</Link>
          </li>
          <li>
            <Link to="/basic-plan-form" className="text-blue-600 hover:underline font-bold">Basic Learning Plan Form</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AuthTest; 