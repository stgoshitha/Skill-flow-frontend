import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">About Skill-Flow</h1>
          
          <section className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Skill-Flow is a platform dedicated to helping users develop and share their skills through
              collaborative learning. We believe that learning is most effective when it's personalized,
              structured, and shared with others. Our mission is to create an ecosystem where knowledge
              flows freely and skills are developed systematically.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you're looking to learn a new programming language, master a creative skill,
              or develop professional expertise, Skill-Flow provides the tools and community to help
              you succeed on your learning journey.
            </p>
          </section>
          
          <section className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-medium text-lg text-gray-800 mb-2">Learning Plans</h3>
                <p className="text-gray-600">
                  Create structured learning paths with clear goals, resources, 
                  and timelines to keep your skill development on track.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-medium text-lg text-gray-800 mb-2">Knowledge Sharing</h3>
                <p className="text-gray-600">
                  Share your insights, discoveries, and projects through posts 
                  that can inspire and help others on similar paths.
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-medium text-lg text-gray-800 mb-2">Help Desk</h3>
                <p className="text-gray-600">
                  Get assistance when you're stuck with our community-driven 
                  help desk where experts can guide you through challenges.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium text-lg text-gray-800 mb-2">Community Connections</h3>
                <p className="text-gray-600">
                  Connect with like-minded learners to share resources,
                  collaborate on projects, and motivate each other.
                </p>
              </div>
            </div>
          </section>
          
          <section className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Team</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Skill-Flow was created by a team of passionate developers and educators who believe 
              in the power of structured learning and knowledge sharing. We're constantly working
              to improve the platform based on user feedback and emerging best practices in
              education technology.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Join Our Team</h3>
              <p className="text-blue-700">
                We're always looking for talented individuals who share our passion for learning and 
                technology. If you're interested in contributing to Skill-Flow, please contact us at 
                <a href="mailto:team@skill-flow.com" className="underline ml-1">team@skill-flow.com</a>.
              </p>
            </div>
          </section>
          
          <section className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We value your feedback and are always looking to improve. If you have questions, 
              suggestions, or concerns, please don't hesitate to reach out to us.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Email</h3>
                  <a href="mailto:support@skill-flow.com" className="text-blue-600 hover:underline">support@skill-flow.com</a>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Phone</h3>
                  <p className="text-gray-600">+94 76 123 4567</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About; 