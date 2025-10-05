import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import SharedPage from './components/SharedPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/shared/:token" element={<SharedPage />} />
            <Route path="/" element={<Signin />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;