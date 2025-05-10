import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import CreateHelpDeskForm from './pages/helpDeskPages/CreateHelpDeskForm'
import MyHelpDesk from './pages/helpDeskPages/MyHelpDesk'
import HelpDesk from './pages/helpDeskPages/HelpDesk'
import Signup from './pages/Signup'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/helps" element={<CreateHelpDeskForm />} />
            <Route path="/myHelpDesk" element={<MyHelpDesk />} />
            <Route path="/helpDesk" element={<HelpDesk />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
