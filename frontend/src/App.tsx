import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Registration from './pages/registration';
import Login from './pages/login';
import Profile from './pages/profile/profile';
import EditProfile from './pages/profile/editProfile';
import Dashboard from './pages/dashboard';
import Projects from './pages/projects';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projekty" element={<Projects />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
