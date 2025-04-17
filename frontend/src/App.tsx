import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Registration from './pages/registration';
import Login from './pages/login';
import Profile from './pages/profile/profile';
import EditProfile from './pages/profile/editProfile';
import Dashboard from './pages/dashboard';
import Projects from './pages/project/projects';
import AddProject from './pages/project/addProjects';
import ProjectDetails from './pages/project/projectDetails';
import TokenExp from './components/tokenExpirationWarning';


function App() {
  return (
    <Router>
      <TokenExp />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projekty" element={<Projects />} />
          <Route path="/projekty/nowy" element={<AddProject />} />
          <Route path="/projekt/:projectId" element={<ProjectDetails />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
