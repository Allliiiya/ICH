import React from "react";

const Form = () => (
  <section className="bg-[#FBF2DA] w-screen py-20 px-0 flex flex-col items-center">
    <h2 className="text-5xl font-serif font-bold text-[#4b6b3c] mb-2 text-center w-full" style={{ letterSpacing: '0.01em' }}>Let's work together.</h2>
    <div className="text-lg text-black mb-10 text-center w-full">Interested in working together? Fill out some info and we will be in touch shortly! We can't wait to hear from you!</div>
    <form className="w-full max-w-4xl mx-auto grid grid-cols-1 gap-6 px-8 md:px-0">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col w-full">
          <label className="text-sm text-[#4b6b3c] mb-1">Name <span className="text-xs text-gray-500">(required)</span></label>
          <div className="flex gap-4">
            <input type="text" placeholder="First Name" className="flex-1 px-4 py-3 rounded border border-gray-300 bg-[#FBF2DA]" />
            <input type="text" placeholder="Last Name" className="flex-1 px-4 py-3 rounded border border-gray-300 bg-[#FBF2DA]" />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <label className="text-sm text-[#4b6b3c] mb-1">Email <span className="text-xs text-gray-500">(required)</span></label>
        <input type="email" placeholder="Email (required)" className="px-4 py-3 rounded border border-gray-300 bg-[#FBF2DA]" />
        <label className="flex items-center gap-2 mt-2 text-sm text-[#4b6b3c]">
          <input type="checkbox" /> Sign up for news and updates
        </label>
      </div>
      <div className="flex flex-col w-full">
        <label className="text-sm text-[#4b6b3c] mb-1">Location</label>
        <select className="px-4 py-3 rounded border border-gray-300 bg-[#FBF2DA]">
          <option>Select an option</option>
        </select>
      </div>
      <div className="flex flex-col w-full">
        <label className="text-sm text-[#4b6b3c] mb-1">Why do you want to start a CCHeritage chapter? <span className="text-xs text-gray-500">(required)</span></label>
        <span className="text-xs text-gray-500 mb-1">Explain in 3-5 sentences</span>
        <textarea placeholder="" className="px-4 py-3 rounded border border-gray-300 bg-[#FBF2DA]" rows={3}></textarea>
      </div>
      <div className="flex flex-col w-full">
        <label className="text-sm text-[#4b6b3c] mb-1">University <span className="text-xs text-gray-500">(required)</span></label>
        <span className="text-xs text-gray-500 mb-1">Select your University</span>
        <select className="px-4 py-3 rounded border border-gray-300 bg-[#FBF2DA]">
          <option>Select an option</option>
        </select>
      </div>
      <div className="flex flex-col w-full">
        <label className="text-sm text-[#4b6b3c] mb-1">Phone</label>
        <input type="text" placeholder="Phone" className="px-4 py-3 rounded border border-gray-300 bg-[#FBF2DA]" />
      </div>
      <div className="flex flex-col w-full">
        <label className="text-sm text-[#4b6b3c] mb-1">How did you hear about us?</label>
        <select className="px-4 py-3 rounded border border-gray-300 bg-[#FBF2DA]">
          <option>Select an option</option>
        </select>
      </div>
      <div className="flex flex-col w-full">
        <label className="text-sm text-[#4b6b3c] mb-1">Do you have prior leadership or event experience? <span className="text-xs text-gray-500">(required)</span></label>
        <textarea placeholder="" className="px-4 py-3 rounded border border-gray-300 bg-[#FBF2DA]" rows={3}></textarea>
      </div>
      <div className="flex flex-col w-full">
        <label className="text-sm text-[#4b6b3c] mb-1">File Upload</label>
        <span className="text-xs text-gray-500 mb-1">Upload resume (Optional)</span>
        <div className="border border-dashed border-gray-400 rounded-lg py-8 flex flex-col items-center justify-center">
          <span className="text-3xl text-gray-400 mb-2">+</span>
          <span className="text-lg text-gray-600">Add a File</span>
        </div>
      </div>
      <button type="submit" className="mt-4 px-8 py-3 rounded-full bg-[#5c7a7a] text-white text-lg font-semibold shadow text-center">Send</button>
    </form>
  </section>
);

export default Form;
