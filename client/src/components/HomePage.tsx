import React from 'react';
import Layout from './Layout';
import { CalendarHeart, Users, Star, ShieldCheck, BellRing } from 'lucide-react';
import eventBg from '../assets/event-bg.jpg';

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
      <section className="flex flex-col items-center justify-center min-h-[70vh] text-center relative">
        {/* Gradient animated background, no image */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-60 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-br from-blue-400 via-purple-200 to-blue-100 rounded-full blur-3xl opacity-40"></div>
        </div>
        <div className="z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg pb-2 animate-bounce-slow" style={{lineHeight: 1.25}}>
            Welcome to <span className="whitespace-nowrap">Event Manager</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-2xl text-gray-700 mb-10 animate-fade-in delay-100 mt-3" style={{lineHeight: 1.2}}>
            Manage, organize, and attend events with ease. All-in-one platform for admins, organizers, and attendees.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-blue-100 flex flex-col items-center p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300">
            {f.icon}
            <h3 className="text-xl font-bold text-blue-900 mb-2">{f.title}</h3>
            <p className="text-gray-600 text-base">{f.desc}</p>
          </div>
        ))}
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
      <footer className="w-full py-8 bg-gradient-to-r from-blue-100 via-white to-purple-100 text-center rounded-t-2xl border-t border-blue-200">
        <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Event Manager. All rights reserved.</p>
      </footer>
    </Layout>
  );
};

export default HomePage;
