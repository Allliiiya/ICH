// ...existing code...
import Footer from "../components/Footer";
import logoImg from "../assets/images/logo.png";

export default function Chapter() {
  return (
    <div className="bg-[#c14641] min-h-screen w-full pt-20">
    {/* NavBar removed; now rendered via Layout.tsx */}
  <section className="flex flex-col md:flex-row items-center justify-center px-10 py-16 max-w-7xl mx-auto" style={{ height: '80vh' }}>
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center md:items-start h-full">
          <div className="flex flex-col items-center md:items-start justify-center h-full">
            <div
              className="bg-[#FBF2DA] flex flex-col items-center justify-center mb-4"
              style={{ width: 280, height: 340, borderRadius: '50% / 45%', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}
            >
              <img src={logoImg} alt="CCHeritage Logo" className="w-36 h-36 object-contain mb-2" />
              <div className="text-3xl font-serif text-black text-center">CCHeritage</div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 w-full flex flex-col items-center md:items-start mt-8 md:mt-0">
          <h1 className="text-6xl font-serif font-bold text-[#FBF2DA] mb-6 text-left">What is a Chapter?</h1>
          <p className="text-lg text-[#FBF2DA] mb-6 text-left">
            <em>CCHeritage</em> is a student-led chapter program powered by <em>ICHheritage</em>, dedicated to preserving and promoting intangible cultural heritage on school and university campuses. Our chapters act as cultural hubs, where students can organize events, host workshops, and create educational experiences that celebrate traditions from around the world.
          </p>
          <a href="#learn-more" className="mt-4 px-8 py-4 rounded-full bg-[#FBF2DA] text-[#5c7a7a] text-xl font-semibold shadow text-center inline-block">Learn more</a>
        </div>
      </section>
  <section className="bg-[#FBF2DA] w-screen flex flex-col md:flex-row items-center justify-center px-0 py-0" style={{ height: '80vh', backgroundColor: '#FBF2DA' }}>
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center h-full">
          <img src="/src/assets/images/Chinese-Dragon.jpg" alt="Start a Chapter" className="w-full h-full object-cover rounded-xl shadow-lg" style={{ maxWidth: '700px', maxHeight: '40vh' }} />
        </div>
        <div className="md:w-1/2 w-full flex flex-col items-center md:items-start justify-center h-full">
          <h2 className="text-5xl font-serif font-bold text-[#c14641] mb-4 text-left" style={{ maxWidth: '80%' }}>Start a Chapter. Share Culture. Inspire Your Community</h2>
          <p className="text-lg text-black mb-4 text-left max-w-xl">
            Bring Chinese cultural heritage to your campus and inspire your community! When you start a chapter of ICHeritage, you’re not alone—we provide <span className="font-bold">full guidance, resources, and ongoing support</span> to help you succeed.
          </p>
          <p className="text-lg text-black mb-6 text-left max-w-xl">
            Please complete the form below to tell us about your interest and ideas. Our team will review your application and reach out within 5–7 business days with next steps.
          </p>
          <a href="/form" target="_blank" rel="noopener noreferrer" className="mt-4 px-8 py-4 rounded-full bg-[#c14641] text-white text-xl font-semibold shadow text-center inline-block">Sign up</a>
        </div>
      </section>
  <section className="bg-[#c14641] w-screen py-20 px-0 flex flex-col md:flex-row items-start justify-center gap-0" style={{ height: '80vh', backgroundColor: '#C14641' }}>
  <div className="md:w-1/3 w-full flex flex-col items-start px-20 mt-20">
      <div style={{ width: '72%' }}>
  <h2 className="text-5xl font-serif font-bold text-[#FBF2DA] mb-12 text-left" style={{ minHeight: '56px' }}>Our Mission</h2>
  <p className="text-xl text-[#FBF2DA] mb-4 text-left">
          We believe that culture connects people. By launching CCheritage chapters, we aim to:
        </p>
  <ul className="list-disc pl-15 text-xl text-[#FBF2DA] mb-2 text-left space-y-8">
          <li><span className="font-bold">Celebrate Heritage</span> – Showcase diverse cultural practices through <span className="font-bold">interactive events</span> like fashion showcases, language sessions, and traditional art classes.</li>
          <li><span className="font-bold">Foster Leadership</span> – Equip students with <span className="font-bold">real-world skills</span> in event planning, community building, and cultural advocacy.</li>
          <li><span className="font-bold">Build Inclusive Communities</span> – Create spaces where students from <span className="font-bold">all backgrounds</span> can learn, share, and experience traditions together.</li>
        </ul>
      </div>
    </div>
  <div className="md:w-1/3 w-full flex flex-col items-start px-20 mt-20">
      <div style={{ width: '76%' }}>
  <h2 className="text-5xl font-serif font-bold text-[#FBF2DA] mb-12 text-left" style={{ minHeight: '56px' }}>What Chapters Do</h2>
  <p className="text-xl text-[#FBF2DA] mb-4 text-left">
          Every CCHeritage chapter runs <span className="font-bold">three main types of activities</span>:
        </p>
  <ul className="list-disc pl-15 text-xl text-[#FBF2DA] mb-2 text-left space-y-8">
          <li><span className="font-bold">Cultural Events</span> – Festivals, showcases, and heritage nights that bring communities together.</li>
          <li><span className="font-bold">Workshops & Learning Sessions</span> – Hands-on experiences in traditional crafts, clothing, music, or cuisine.</li>
          <li><span className="font-bold">Educational Programs</span> – Networking, panels, and discussions on heritage preservation and cross-cultural understanding.</li>
        </ul>
      </div>
    </div>
  <div className="md:w-1/3 w-full flex flex-col items-start px-20 mt-20">
      <div style={{ width: '72%' }}>
  <h2 className="text-5xl font-serif font-bold text-[#FBF2DA] mb-12 text-left" style={{ minHeight: '56px' }}>What Support You’ll Get</h2>
  <p className="text-xl text-[#FBF2DA]  mb-4 text-left">
          When you join the CCHeritage network, you’ll receive:
        </p>
  <ul className="list-disc pl-15 text-xl text-[#FBF2DA] mb-2 text-left space-y-8">
          <li><span className="font-bold">Chapter Starter Kit</span> (branding, social media templates, first event guide)</li>
          <li><span className="font-bold">Training & Onboarding</span> (how to host events, recruit members, and fundraise)</li>
          <li><span className="font-bold">Exclusive Resources</span> (access to cultural content, activity ideas, and partnerships)</li>
          <li><span className="font-bold">Ongoing Mentorship</span> from the ICHeritage team</li>
        </ul>
      </div>
    </div>
      </section>
  <section className="bg-[#FBF2DA] w-screen py-20 px-0 flex flex-col items-center" style={{ minHeight: '80vh' }}>
  <h2 className="text-5xl font-serif font-bold text-[#c14641] mb-12 w-full px-40 text-left" style={{ letterSpacing: '0.02em' }}>Chapter Requirements & Process</h2>
  <div className="text-xl text-black mb-16 w-full px-40 text-left">To ensure each CCHeritage Chapter is successful and aligned with our mission, applicants must meet the following requirements and follow the process below:</div>
  <div className="flex flex-col gap-20 mb-20 w-full px-40 text-left">
          <div className="flex flex-col items-start text-left w-full">
            <h3 className="font-bold text-3xl mb-6 text-[#c14641] text-left">Eligibility:</h3>
            <ul className="list-disc pl-10 text-xl mb-8 text-left space-y-6">
              <li>Must be a <span className="font-bold">current student</span> at a high school, college, or university.</li>
              <li>In <span className="font-bold">good academic standing</span> at their institution.</li>
            </ul>
            <h3 className="font-bold text-3xl mb-6 text-[#c14641] text-left">Commitment:</h3>
            <ul className="list-disc pl-10 text-xl mb-8 text-left space-y-6">
              <li>Ability to dedicate <span className="font-bold">3–5 hours per week</span> to chapter activities.</li>
              <li>Organize <span className="font-bold">at least two cultural event or workshop per semester</span>.</li>
              <li>Maintain regular communication with the <span className="font-bold">CCHeritage team</span>.</li>
            </ul>
          </div>
          <div className="flex flex-col items-start">
            <h3 className="font-bold text-3xl mb-6 text-[#c14641] text-left">Leadership & Skills:</h3>
            <ul className="list-disc pl-10 text-xl mb-8 text-left space-y-6">
              <li>Strong interest in <span className="font-bold">Chinese cultural heritage, community engagement, and leadership</span>.</li>
              <li>Ability to <span className="font-bold">recruit members and promote events</span> on campus.</li>
              <li>Responsible for upholding <span className="font-bold">CCHeritage’s mission, values, and code of conduct</span>.</li>
            </ul>
            <h3 className="font-bold text-3xl mb-6 text-[#c14641] text-left">Team:</h3>
            <ul className="list-disc pl-10 text-xl mb-8 text-left space-y-6">
              <li>Ideally, <span className="font-bold">3–5 founding members</span> to help run the chapter.</li>
              <li>Identify a <span className="font-bold">faculty or staff advisor</span> to provide guidance and school recognition.</li>
            </ul>
          </div>
        </div>
  <div className="space-y-16 w-full px-40 text-left">
          <div className="flex flex-col items-start text-left w-full">
            <h3 className="text-3xl font-serif font-bold text-[#c14641] mb-6 text-left">Step 1: Submit an Application</h3>
            <ul className="list-disc pl-10 text-xl mb-8 text-left space-y-6">
              <li>Complete the <span className="font-bold">online Chapter Application Form</span>, providing your personal details, school information, and your vision for the chapter.</li>
              <li>Include potential team members and faculty advisor if possible.</li>
            </ul>
          </div>
          <div className="flex flex-col items-start text-left w-full">
            <h3 className="text-3xl font-serif font-bold text-[#c14641] mb-6 text-left">Step 2: Application Review</h3>
            <ul className="list-disc pl-10 text-xl mb-8 text-left space-y-6">
              <li>The CCHeritage team reviews your submission within <span className="font-bold">7–10 business days</span>.</li>
              <li>We may schedule a short call or email follow-up to clarify goals and expectations.</li>
            </ul>
          </div>
          <div className="flex flex-col items-start text-left w-full">
            <h3 className="text-3xl font-serif font-bold text-[#c14641] mb-6 text-left">Step 3: Approval & Onboarding</h3>
            <ul className="list-disc pl-10 text-xl mb-8 text-left space-y-6">
              <li>Once approved, your chapter will be officially recognized as a <span className="font-bold">CCHeritage Chapter</span>.</li>
              <li>Receive a <span className="font-bold">Chapter Starter Kit</span> with branding, templates, and event guides.</li>
              <li>Participate in a <span className="font-bold">training session</span> covering leadership, event planning, and outreach strategies.</li>
            </ul>
          </div>
          <div className="flex flex-col items-start text-left w-full">
            <h3 className="text-3xl font-serif font-bold text-[#c14641] mb-6 text-left">Step 4: Plan Your First Event</h3>
            <ul className="list-disc pl-10 text-xl mb-8 text-left space-y-6">
              <li>With guidance from the CCHeritage team, select and plan a <span className="font-bold">workshop, cultural showcase, or educational event</span>.</li>
              <li>Develop a schedule, recruit members, and prepare materials using our <span className="font-bold">provided resources</span>.</li>
            </ul>
          </div>
          <div className="flex flex-col items-start text-left w-full">
            <h3 className="text-3xl font-serif font-bold text-[#c14641] mb-6 text-left">Step 5: Launch & Grow Your Chapter</h3>
            <ul className="list-disc pl-10 text-xl mb-8 text-left space-y-6">
              <li>Host your first event and share the success with the CCHeritage network.</li>
              <li>Maintain communication with the CCHeritage team to receive <span className="font-bold">ongoing support</span>.</li>
              <li>Recruit new members, organize additional events, and report quarterly on chapter activities.</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
