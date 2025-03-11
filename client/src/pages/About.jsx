import React from 'react'

export default function About() {
  return (
    <div className="bg-[#F1F5F1] min-h-screen flex flex-col items-center p-4">
      
      <main className="flex flex-col md:flex-row w-full max-w-6xl mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* About Section */}
        <div className="w-full md:w-1/2 p-8 bg-[#F1F5F1]">
          <h1 className="text-[#6B7D90] text-3xl font-semibold">Welcome to Nest Market</h1>
          <p className="mt-4 text-lg text-gray-700">
            At <strong>Nest Market</strong>, our mission is to create a trusted and thriving local marketplace where anyone can buy, sell, and connect with ease.
            We believe in the power of community-driven commerce, making it simple for people to find what they need while supporting local businesses and individuals.
          </p>
          <h2 className="mt-6 text-[#6B7D90] text-2xl font-semibold">Why Choose Nest Market?</h2>
          <ul className="mt-4 text-lg text-gray-700 list-disc pl-6">
            <li className="ml-4"><strong>Post & Browse Ads Instantly</strong> – List your products or services with ease and find amazing deals nearby.</li>
            <li className="ml-4"><strong>Built-in Chat System 💬</strong> – Communicate directly with buyers and sellers using our secure in-app messaging feature.</li>
            <li className="ml-4"><strong>Safe & User-Friendly</strong> – We prioritize trust, security, and a seamless experience for all users.</li>
            <li className="ml-4"><strong>Support Local Commerce</strong> – Whether you’re an individual seller or a small business owner, Nest Market helps you grow and reach the right audience.</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="w-full md:w-1/2 p-8 bg-[#C1F0E7]">
          <h2 className="text-[#6B7D90] text-2xl font-semibold">Contact Us</h2>
          <form className="mt-6 space-y-4">
            <div>
              <label className="block text-[#6B7D90] font-medium">Name</label>
              <input 
                type="text" 
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DD0B1]" 
                placeholder="Your Name" 
              />
            </div>
            <div>
              <label className="block text-[#6B7D90] font-medium">Email</label>
              <input 
                type="email" 
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DD0B1]" 
                placeholder="Your Email" 
              />
            </div>
            <div>
              <label className="block text-[#6B7D90] font-medium">Message</label>
              <textarea 
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DD0B1]" 
                placeholder="Your Message" 
                rows={4}
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#44D1B7] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#3DD0B1] transition">
              Send Message
            </button>
          </form>
        </div>
      </main>      
    </div>
  );
}
