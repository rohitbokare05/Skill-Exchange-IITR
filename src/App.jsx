import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Login from './pages/Login';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import MyProfile from './pages/MyProfile';
import EditSkills from './pages/EditSkills';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
      <Route path="/home" element={user ? <><Navbar /><Home /></> : <Navigate to="/" />} />
      <Route path="/user/:uid" element={user ? <><Navbar /><UserProfile /></> : <Navigate to="/" />} />
      <Route path="/my-profile" element={user ? <><Navbar /><MyProfile /></> : <Navigate to="/" />} />
      <Route path="/edit-skills" element={user ? <><Navbar /><EditSkills /></> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to={user ? "/home" : "/"} />} />
    </Routes>
  );
}

export default App;