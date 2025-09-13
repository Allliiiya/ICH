// import Course from "../components/homeui/Course";
// import FAQ from "../components/homeui/FAQ";
// import AboutTheArtist from "../components/homeui/AboutTheArtist";
import Ahri from "../assets/images/workshop_5.jpg";
import Footer from "../components/Footer";
import { useRef, useEffect, useState } from "react";

function ImpactSection() {
  const numbers = [150, 10, 5, 2];
  const labels = ["Members", "Mentors", "Partnership", "Campus"];
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [visible, setVisible] = useState([false, false, false, false]);
  const [barWidths, setBarWidths] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    function updateBarWidths() {
      const widths = numberRefs.current.map(ref => ref ? ref.offsetWidth : 0);
      setBarWidths(widths);
    }
    updateBarWidths();
    window.addEventListener("resize", updateBarWidths);
    return () => window.removeEventListener("resize", updateBarWidths);
  }, []);

  useEffect(() => {
    function handleScroll() {
      numberRefs.current.forEach((ref, i) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
            setVisible(prev => {
              if (!prev[i]) {
                const updated = [...prev];
                updated[i] = true;
                return updated;
              }
              return prev;
            });
          }
        }
      });
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
  <section className="bg-[#FBF2DA] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
      <h2 className="text-6xl font-serif font-bold text-[#c14641] mb-10 text-left w-full max-w-5xl">Our Impact</h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-5xl mx-auto h-full">
        <img src="/src/assets/images/classroom.jpg" alt="Classroom" className="w-full md:w-1/2 h-[60vh] md:h-[80vh] rounded-xl shadow-lg object-cover" />
        <div className="flex flex-col gap-8 md:w-1/2">
          {numbers.map((num, i) => (
            <div className="flex flex-row items-center" key={labels[i]}>
              <div className="flex flex-col items-start" style={{ minWidth: '120px' }}>
                <span
                  ref={el => { numberRefs.current[i] = el; }}
                  className="text-green-700 font-bold text-6xl md:text-7xl text-left"
                >
                  {num}
                </span>
                <span
                  className="block h-2 mt-2 bg-[#c14641] rounded-full"
                  style={{
                    width: visible[i] ? `${barWidths[i]}px` : '0px',
                    transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                    transitionDelay: visible[i] ? `${i * 0.5}s` : '0s',
                    maxWidth: 120
                  }}
                ></span>
              </div>
              <span className="ml-8 text-[#c14641] font-bold text-4xl md:text-5xl text-right">{labels[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyItMattersSection() {
  return (
    <section className="bg-[#c14641] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
  <h1 className="text-6xl font-serif font-bold text-[#FBF2DA] mb-10 text-center">Why it Matters?</h1>
      <div className="max-w-3xl mx-auto text-center text-white">
        <h2 className="font-bold mb-6">Bridging the Cultural Gap</h2>
        <ul className="text-lg space-y-4 mb-8">
          <li>While there are over <span className="underline">5 million Chinese Americans</span> in the U.S., many younger generations have limited exposure to Chinese traditional arts, crafts, and cultural practices.</li>
          <li>Beyond the Chinese-American community, <span className="font-bold">most Americans know little about Chinese intangible cultural heritage</span>, leading to missed opportunities for cross-cultural understanding.</li>
          <li>Public perception of China is often shaped by politics or media rather than cultural knowledge—<span className="font-bold">77% of Americans are holding negative views of China</span>, while many are unaware of its rich traditions.</li>
        </ul>
      </div>
      <div className="max-w-5xl mx-auto text-center mt-12">
  <h2 className="text-4xl font-serif font-bold text-[#FBF2DA] mb-6">Impact Goal:</h2>
  <p className="text-3xl font-serif text-[#FBF2DA] font-semibold leading-snug">
          To empower a generation of Americans to experience, understand, and celebrate Chinese intangible cultural heritage. We aim to build connections across communities, inspire curiosity, and encourage everyone to see China through a fresh cultural lens, beyond politics or stereotypes.
        </p>
      </div>
    </section>
  );
}

function OurInitiativesSection() {
  return (
    <section className="bg-[#c14641] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
  <h2 className="text-6xl font-serif font-bold text-[#FBF2DA] mb-10 text-left w-full max-w-5xl">Our Initiatives</h2>
      <div className="max-w-5xl mx-auto text-white text-lg">
        <ol className="space-y-6">
          <li><span className="font-bold">1. CCHeritage Campus Chapters</span><br />We launch student-led chapters across the U.S. that host workshops, cultural events, and community activities to celebrate and share Chinese intangible heritage.</li>
          <li><span className="font-bold">2. Heritage Artist Program</span><br />We support heritage artists and cultural practitioners by providing mentorship and resources, helping them fundraise for their projects, and promoting their work through our platform, events, and social media to reach wider audiences.</li>
          <li><span className="font-bold">3. Educational Resources & Digital Content</span><br />We create biweekly newsletters, podcasts, and short-form videos that highlight traditions, cultural stories, and heritage-inspired entrepreneurship to engage and educate a broad audience.</li>
          <li><span className="font-bold">4. Workshops & Events</span><br />We collaborate with cultural workshops and also host our own events to connect communities with heritage practitioners, providing interactive experiences to explore and celebrate traditions.</li>
          <li><span className="font-bold">5. Social Media Engagement</span><br />We share short videos, highlights, and stories on Instagram, TikTok, Rednotes, and YouTube to make heritage content fun, accessible, and widely shareable.</li>
        </ol>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div>
      <div
        className="bg-cover h-100 w-full p-6 text-white"
        style={{ backgroundImage: `url(${Ahri})` }}
      ></div>
  <section className="bg-[#FBF2DA] w-full py-20 px-8 flex flex-col md:flex-row items-center justify-center">
        <div className="md:w-1/2 w-full flex items-center justify-center">
          <h1 className="text-[#5c7a7a] font-bold italic font-sans text-5xl md:text-6xl text-left leading-tight">Preserving Chinese Heritage<br />for the Next Generation</h1>
        </div>
        <div className="md:w-1/2 w-full flex items-center justify-center mt-8 md:mt-0">
          <p className="text-lg md:text-xl text-black max-w-md text-left">
            Preserving Chinese traditions through education, storytelling, and creativity, and inspiring the next generation to explore cultural heritage in an AI-dominated era.
          </p>
        </div>
      </section>
      <WhyItMattersSection />
      <ImpactSection />
      <OurInitiativesSection />
      <Footer />
    </div>
  );
}

export default Home;

