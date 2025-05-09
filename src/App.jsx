import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import LearningPlans from './pages/LearningPlans'
import LearningPlanDetail from './pages/LearningPlanDetail'
import { LearningPlanFormWithErrorBoundary } from './pages/LearningPlanForm'
import SimpleLearningPlanForm from './pages/SimpleLearningPlanForm'
import BasicLearningPlanForm from './pages/BasicLearningPlanForm'
import ApiTest from './pages/ApiTest'
import AuthTest from './pages/AuthTest'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/api-test" element={<ApiTest />} />
            <Route path="/auth-test" element={<AuthTest />} />
            
            {/* Test routes */}
            <Route path="/test-create-plan" element={<LearningPlanFormWithErrorBoundary />} />
            <Route path="/simple-form" element={<SimpleLearningPlanForm />} />
            <Route path="/basic-plan-form" element={<BasicLearningPlanForm />} />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/learning-plans" element={
              <ProtectedRoute>
                <LearningPlans />
              </ProtectedRoute>
            } />
            <Route path="/learning-plans/create" element={
              <ProtectedRoute>
                <LearningPlanFormWithErrorBoundary />
              </ProtectedRoute>
            } />
            <Route path="/learning-plans/edit/:planId" element={
              <ProtectedRoute>
                <LearningPlanFormWithErrorBoundary />
              </ProtectedRoute>
            } />
            <Route path="/learning-plans/:planId" element={
              <ProtectedRoute>
                <LearningPlanDetail />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App
