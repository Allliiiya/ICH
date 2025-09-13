import { useEffect, useState } from "react";
import Footer from "../components/Footer";

export default function Volunteer() {
  type Event = {
    id: number;
    name: string;
    date: string;
    location: string;
    description?: string;
  };

  const [events, setEvents] = useState<Event[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then((data) => {
        setEvents(data ?? []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  return (
    <div className="bg-[#FBF2DA] min-h-screen w-full pt-20">
      <section className="w-screen min-h-screen flex flex-col items-center justify-center px-8 py-24">
        <h1 className="text-8xl font-serif font-bold text-[#b23c35] mb-16 text-center">Keep it Alive, Help it Thrive</h1>
        <p className="text-3xl text-[#4b6b3c] mb-12 text-center max-w-3xl">
          At Heritage, volunteers bring our mission to life. Whether you’re helping at a single workshop or joining our team long-term, your contributions make a direct impact in preserving Chinese intangible cultural heritage and sharing it with broader audiences.
        </p>
        <p className="text-3xl text-[#4b6b3c] mb-12 text-center max-w-3xl">By volunteering, you’ll:</p>
        <ul className="text-3xl text-[#4b6b3c] mb-12 text-left max-w-3xl mx-auto list-none space-y-8">
          <li><span className="font-bold">Support Culture</span> – Help keep traditions alive through meaningful programs.</li>
          <li><span className="font-bold">Gain Experience</span> – Build skills in event coordination, cultural education, and community engagement.</li>
          <li><span className="font-bold">Join a Community</span> – Connect with others who share your passion for heritage and cross-cultural understanding!</li>
        </ul>
      </section>

      <section className="w-screen min-h-screen flex flex-col items-center justify-center px-20 py-24">
    <h2 className="text-6xl font-serif font-bold text-[#b23c35] mb-10 text-left w-full leading-tight" style={{ lineHeight: '1.2' }}>At Heritage, we offer two ways to get involved:</h2>
  <div className="flex flex-col md:flex-row w-full gap-24 justify-center items-end md:space-x-24 md:space-y-0 space-y-10 md:items-end" style={{ alignItems: 'flex-end' }}>
          
          <div className="md:w-2/5 w-full max-w-xl bg-transparent flex flex-col h-full justify-between">
            <h3 className="text-5xl font-serif font-bold text-[#4b6b3c]  mt-22 mb-6" >Organization Volunteers (Ongoing)</h3>
            <p className="text-2xl text-[#4b6b3c] mb-6">Join our core volunteer network and support our nonprofit’s mission year-round.</p>
            <ul className="text-xl text-[#4b6b3c] mb-8 list-disc pl-6 space-y-6">
              <li>Help with projects like research, content creation, outreach, and chapter support.</li>
              <li>Stay connected with opportunities across events, workshops, and leadership roles.</li>
              <li>Perfect for those who want a deeper commitment and long-term involvement.</li>
            </ul>
            <a href="/form" target="_blank" rel="noopener noreferrer" className="px-10 py-4 rounded-full bg-[#b23c35] text-white text-xl font-semibold shadow text-center inline-block">Sign up</a>
          </div>
          <div className="md:w-2/5 w-full max-w-xl bg-transparent flex flex-col h-full justify-between">
            <h3 className="text-5xl font-serif font-bold text-[#4b6b3c] mt-22 mb-6">Workshop/Event Volunteers (One-Time)</h3>
            <p className="text-2xl text-[#4b6b3c] mb-6">Support a single workshop, cultural fair, or community event.</p>
            <ul className="text-xl text-[#4b6b3c] mb-8 list-disc pl-6 space-y-6">
              <li>Roles may include event setup, registration, assisting participants, or running activities.</li>
              <li>Great option if you want to contribute but have limited availability.</li>
              <li>No long-term commitment required.</li>
            </ul>
            <button className="px-10 py-4 rounded-full bg-[#b23c35] text-white text-xl font-semibold shadow text-center">Sign up</button>
          </div>
        </div>
      </section>
      <section className="w-screen min-h-screen bg-[#5c7a5c] flex flex-col items-center py-16">
        <h2 className="text-6xl font-serif font-bold text-[#FBF2DA] mb-16 text-center">Events Avilable For Volunteer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-24 gap-x-8 w-full max-w-7xl mx-auto">
          {loading ? (
            <div className="text-white text-2xl">Loading events...</div>
          ) : error ? (
            <div className="text-red-300 text-2xl">{error}</div>
          ) : !events || events.length === 0 ? (
            <div className="text-white text-2xl col-span-3">No events available.</div>
          ) : (
            events.map((event, idx) => (
              <div key={event.id || idx} className="flex flex-col items-center justify-start text-center text-[#FBF2DA]">
                <h3 className="text-3xl font-bold mb-4 text-[#FBF2DA]">{event.name}</h3>
                <div className="text-xl font-medium mb-2 text-[#FBF2DA]">
                  {(() => {
                    if (!event.date) return "Date not set";
                    const d = new Date(event.date.length === 10 ? event.date + "T00:00:00Z" : event.date);
                    return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                  })()}
                </div>
                <div className="text-lg mb-2 text-[#FBF2DA]">{event.location}</div>
                {event.description && <div className="text-lg mb-2 text-[#FBF2DA]">{event.description}</div>}
                <a href="#" className="mt-4 underline text-[#FBF2DA] text-xl">Get Tickets</a>
              </div>
            ))
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
