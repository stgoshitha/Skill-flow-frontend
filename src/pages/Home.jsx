import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    
    // If there's no session ID, we'll just fetch a new one
    axios.get('http://localhost:8080/users/session-id', {
      withCredentials: true
    })
    .then(response => {
      const sessionId = response.data;
  
      // Check if sessionId is valid (non-null, non-empty string)
      if (sessionId && typeof sessionId === 'string' && sessionId.trim() !== '') {
        localStorage.setItem('sessionId', sessionId);
        setIsLoggedIn(true);
      } else {
        console.warn('No valid session ID returned.');
        localStorage.removeItem('sessionId');
      }
    })
    .catch(error => {
      console.error('Error fetching session ID:', error.message);
      if (error.response) {
        if (error.response.status === 401) {
          console.warn('Unauthorized: User is not logged in.');
        } else if (error.response.status === 500) {
          console.warn('Server error while fetching session ID.');
        }
      }
    });
  }, []);

  // Sample features
  const features = [
    {
      id: 1,
      title: 'Create Learning Plans',
      description: 'Design and follow structured learning paths to achieve your goals',
      icon: (
        <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-700',
    },
    {
      id: 2,
      title: 'Share Knowledge',
      description: 'Post your insights and discoveries to help others in their learning journey',
      icon: (
        <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      color: 'from-green-500 to-green-700',
    },
    {
      id: 3,
      title: 'Get Help',
      description: 'Ask questions and receive guidance from the community through our Help Desk',
      icon: (
        <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      id: 4,
      title: 'Connect with Others',
      description: 'Build a network of like-minded learners to collaborate and grow together',
      icon: (
        <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-700',
    },
  ];

  const testimonials = [
    {
      id: 1,
      content: "Skill-Flow has transformed how I approach learning new technologies. The structured plans and community support make all the difference.",
      author: "Jane D.",
      role: "Software Developer",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg"
    },
    {
      id: 2,
      content: "I love how I can track my progress with learning plans. It keeps me accountable and motivated to continue growing my skills.",
      author: "Mark T.",
      role: "UX Designer",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      content: "The help desk feature saved me countless hours of frustration when I was stuck on a complex problem. Highly recommended!",
      author: "Samantha L.",
      role: "Data Scientist",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section - Modern Design with Animated Elements */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-blue-500 bg-opacity-20 blur-3xl"></div>
          <div className="absolute -left-40 top-20 w-80 h-80 rounded-full bg-indigo-500 bg-opacity-20 blur-3xl"></div>
          <div className="absolute right-20 bottom-0 w-64 h-64 rounded-full bg-purple-500 bg-opacity-20 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-28 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 md:pr-10">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                  Skill-<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-indigo-200">Flow</span>
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed max-w-xl">
                The smart platform to organize your learning journey and track your progress, designed for modern learners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isLoggedIn ? (
                  <Link to="/learning-plans" className="group bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-4 rounded-xl text-center shadow-lg transition-all hover:shadow-xl">
                    <span className="flex items-center justify-center">
                      My Learning Plans
                      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </Link>
                ) : (
                  <Link to="/signup" className="group bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-4 rounded-xl text-center shadow-lg transition-all hover:shadow-xl">
                    <span className="flex items-center justify-center">
                      Get Started
                      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </Link>
                )}
                <Link to="/about" className="group border-2 border-white/30 hover:border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-center transition-all">
                  Learn More
                  <svg className="ml-2 w-5 h-5 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <div className="relative">
                <div className="absolute -top-6 -right-6 -bottom-6 -left-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative border-8 border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                    alt="People collaborating on learning" 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white text-xl font-medium">Collaborative learning environment designed for success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#f9fafb" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section with Hover Effects */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Everything you need to succeed</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Skill-Flow provides the tools and community support to help you on your learning journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.id}
                to={
                  feature.id === 1 
                    ? "/create-learning-plan" // Create Learning Plans
                    : feature.id === 2 
                      ? "/create-post" // Share Knowledge
                      : "/helpdesk" // Get Help
                }
                className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className={`p-8 text-center`}>
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern Design */}
      <section className="py-24 bg-gradient-to-r from-indigo-700 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to accelerate your learning?</h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of learners who are using Skill-Flow to structure their learning, 
              connect with others, and achieve their goals faster.
            </p>
            {isLoggedIn ? (
              <Link to="/create-learning-plan" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-10 py-4 rounded-xl inline-block shadow-lg transition-all hover:shadow-xl">
                Create Your First Plan
              </Link>
            ) : (
              <Link to="/signup" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-10 py-4 rounded-xl inline-block shadow-lg transition-all hover:shadow-xl">
                Sign Up Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Modern Cards */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from people who have transformed their learning experience with Skill-Flow
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-lg relative">
                <div className="absolute -top-5 right-8">
                  <svg className="h-10 w-10 text-blue-600 opacity-20" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-4.4 0-8 3.6-8 8s3.6 8 8 8h.5c.3 0 .5-.2.5-.5v-3c0-.3-.2-.5-.5-.5H10c-2.2 0-4-1.8-4-4s1.8-4 4-4h2c.3 0 .5.2.5.5V16c0 2.2-1.8 4-4 4V7.5c0 .3.2.5.5.5H16c0-3.9-2.7-7.1-6-7.9V8zm14 0c-4.4 0-8 3.6-8 8s3.6 8 8 8h.5c.3 0 .5-.2.5-.5v-3c0-.3-.2-.5-.5-.5H24c-2.2 0-4-1.8-4-4s1.8-4 4-4h2c.3 0 .5.2.5.5V16c0 2.2-1.8 4-4 4V7.5c0 .3.2.5.5.5H30c0-3.9-2.7-7.1-6-7.9V8z" />
                  </svg>
                </div>
                <div className="flex items-center mb-6">
                  <img src={testimonial.avatar} alt={testimonial.author} className="h-14 w-14 rounded-full object-cover mr-4" />
                  <div>
                    <p className="font-bold text-gray-800">{testimonial.author}</p>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Add animation keyframes to style */}
      <style jsx="true">{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Home;
