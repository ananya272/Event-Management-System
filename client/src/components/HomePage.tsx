import React from 'react';
import Layout from './Layout';
import { CalendarHeart, Users, Star, ShieldCheck, BellRing } from 'lucide-react';

const features = [
  {
    icon: <CalendarHeart className="w-10 h-10 text-blue-600 mb-3" />, 
    title: 'Easy Event Creation',
    desc: 'Organizers can create, edit, and manage events with just a few clicks.'
  },
  {
    icon: <Users className="w-10 h-10 text-purple-500 mb-3" />,
    title: 'Role-based Access',
    desc: 'Admins, organizers, and attendees each have their own powerful dashboard.'
  },
  {
    icon: <Star className="w-10 h-10 text-yellow-500 mb-3" />,
    title: 'Ratings & Feedback',
    desc: 'Attendees can rate events and share feedback instantly.'
  },
  {
    icon: <BellRing className="w-10 h-10 text-pink-500 mb-3" />,
    title: 'Real-time Notifications',
    desc: 'Stay updated with instant notifications for bookings and updates.'
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-green-600 mb-3" />,
    title: 'Secure & Reliable',
    desc: 'Your data is protected with secure authentication and best practices.'
  }
];

const HomePage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] text-center relative dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Gradient animated background, no image */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-60 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-br from-blue-400 via-purple-200 to-blue-100 dark:from-blue-900 dark:via-purple-900 dark:to-gray-900 rounded-full blur-3xl opacity-40"></div>
        </div>
        <div className="z-10 flex flex-col items-center">
          <span className="text-5xl animate-bounce mb-2">🎉</span>
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg pb-2 animate-bounce-slow dark:from-blue-300 dark:via-purple-300 dark:to-blue-500" style={{lineHeight: 1.25}}>
            Welcome to <span className="whitespace-nowrap">Event Manager</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-blue-800 dark:text-blue-200 mt-2 animate-fade-in delay-75">Plan, Organize & Celebrate Seamlessly</h2>
          <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-700 dark:text-gray-200 mb-6 animate-fade-in delay-100 mt-3" style={{lineHeight: 1.3}}>
            The easiest way to create, manage, and attend events. Whether you’re an organizer or a guest, our platform makes every event a success.
          </p>
          <a href="/signup" className="mt-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in delay-150 text-lg">
            🚀 Get Started
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div key={i} className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-blue-100 flex flex-col items-center p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300 ${i === 0 ? 'highlight' : ''}`}>
            {f.icon}
            <h3 className="text-xl font-bold text-blue-900 mb-2">{f.title}</h3>
            <p className="text-gray-600 text-base">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* How it works stepper */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-4">How it works</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <div className="bg-blue-100 rounded-xl p-6 shadow-md w-full md:w-1/3 animate-fade-in delay-100 flex flex-col items-center">
            <span className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-2xl mb-2">1️⃣</span>
            <p className="text-blue-900 font-semibold text-lg text-center">Create an event</p>
            <p className="text-gray-600 text-base">Organizers can create events with just a few clicks.</p>
          </div>
          <div className="bg-purple-100 rounded-xl p-6 shadow-md w-full md:w-1/3 animate-fade-in delay-150 flex flex-col items-center">
            <span className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-2xl mb-2">2️⃣</span>
            <p className="text-purple-900 font-semibold text-lg text-center">Invite attendees</p>
            <p className="text-gray-600 text-base">Organizers can invite attendees and track RSVPs.</p>
          </div>
          <div className="bg-green-100 rounded-xl p-6 shadow-md w-full md:w-1/3 animate-fade-in delay-200 flex flex-col items-center">
            <span className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-2xl mb-2">3️⃣</span>
            <p className="text-green-900 font-semibold text-lg text-center">Attend the event</p>
            <p className="text-gray-600 text-base">Attendees can attend events and provide feedback.</p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="max-w-4xl mx-auto my-16 p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-blue-100 text-center">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-4">About Us</h2>
        <p className="text-gray-700 mb-4 text-lg">
          <strong>Event Manager</strong> is dedicated to making event management simple and enjoyable for everyone. Our platform offers:
        </p>
        <ul className="list-disc text-left text-gray-600 ml-8 mb-4 text-base">
          <li>Easy event creation and management for organizers</li>
          <li>Powerful admin controls and analytics</li>
          <li>Effortless event discovery and booking for attendees</li>
          <li>Real-time notifications and updates</li>
          <li>Secure authentication and user roles</li>
        </ul>
        <p className="text-gray-700 text-base">Join us and make your next event a success!</p>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-gradient-to-r from-blue-100 via-white to-purple-100 text-center rounded-t-2xl border-t border-blue-200 flex flex-col items-center gap-2">
        <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Event Manager. All rights reserved.</p>
        <div className="flex gap-4 justify-center mt-2">
          <a href="#" className="text-blue-600 hover:text-blue-800 text-xl" title="Twitter" aria-label="Twitter"><i className="fab fa-twitter"></i>🐦</a>
          <a href="#" className="text-blue-900 hover:text-blue-700 text-xl" title="Facebook" aria-label="Facebook"><i className="fab fa-facebook"></i>📘</a>
          <a href="#" className="text-pink-600 hover:text-pink-800 text-xl" title="Instagram" aria-label="Instagram"><i className="fab fa-instagram"></i>📸</a>
          <a href="mailto:support@eventmanager.com" className="text-green-700 hover:text-green-900 text-xl" title="Contact" aria-label="Contact">✉️</a>
        </div>
      </footer>
      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 bg-blue-500 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300"
        aria-label="Scroll to top"
      >
        ⬆️
      </button>
    </Layout>
  );
};

export default HomePage;
