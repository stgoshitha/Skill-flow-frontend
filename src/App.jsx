import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import CreateHelpDeskForm from './pages/helpDeskPages/CreateHelpDeskForm'
import MyHelpDesk from './pages/helpDeskPages/MyHelpDesk'
import HelpDesk from './pages/helpDeskPages/HelpDesk'
import Signup from './pages/Signup'
import LearningPlans from './pages/LearningPlans'
import LearningPlanDetail from './pages/LearningPlanDetail'
import LearningPlanForm from './pages/LearningPlanForm'
import About from './pages/About'
import Posts from './pages/Posts'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'

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
            <Route path="/about" element={<About />} />
            
            {/* Learning Plan Routes */}
            <Route path="/learning-plans" element={<LearningPlans />} />
            <Route path="/learningplans" element={<Navigate to="/learning-plans" replace />} />
            <Route path="/learning-plan/:id" element={<LearningPlanDetail />} />
            <Route path="/create-learning-plan" element={<LearningPlanForm />} />
            <Route path="/edit-learning-plan/:id" element={<LearningPlanForm />} />
            
            {/* Post Routes */}
            <Route path="/posts" element={<Posts />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/edit-post/:id" element={<CreatePost />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
