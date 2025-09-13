import { useState, useEffect } from "react";
import { isAdmin } from "../utils/auth";
import Footer from "../components/Footer";
import type { Event, EventInput } from "../types/event";
import CSVDropZone from "../components/CSVDropZone";

function AdminDashboard() {
  useEffect(() => {
    if (!isAdmin()) {
      window.location.href = "/login";
    }
  }, []);
  const [events, setEvents] = useState<Event[] | null>(null);

  const [form, setForm] = useState<EventInput>({ name: "", date: "", location: "", description: "", link: "", expires_at: undefined });
  const [csvEvents, setCsvEvents] = useState<EventInput[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from backend
  useEffect(() => {
    fetch("/api/events")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then((data) => setEvents(data ?? []))
      .catch((err) => setError(err.message));
  }, []);
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
  setForm({ ...form, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    if (csvEvents.length === 0) return;
    // Upload CSV events to backend
    const uploadCsvEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const jwt = localStorage.getItem("heritage_jwt") || "";
        const res = await fetch("http://localhost:8080/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": jwt
          },
          body: JSON.stringify(csvEvents),
        });
        if (!res.ok) throw new Error("Failed to upload some events from CSV");
        // Fetch latest events
        const eventsRes = await fetch("http://localhost:8080/api/events");
        if (!eventsRes.ok) throw new Error("Failed to fetch events");
        setEvents(await eventsRes.json());
        setCsvEvents([]); // clear after upload
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    uploadCsvEvents();
  }, [csvEvents]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const jwt = localStorage.getItem("heritage_jwt") || "";
      const res = await fetch("http://localhost:8080/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": jwt
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          date: form.date, // send as 'YYYY-MM-DD'
          location: form.location,
          expires_at: form.expires_at ? form.expires_at : null,
          link: form.link
        }),
      });
      if (!res.ok) throw new Error("Failed to upload event");

      setForm({ name: "", date: "", location: "", description: "", link: "", expires_at: undefined });
      // Fetch latest events
      const eventsRes = await fetch("http://localhost:8080/api/events");
      if (!eventsRes.ok) throw new Error("Failed to fetch events");
      setEvents(await eventsRes.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#F5E9D6] min-h-screen w-full flex flex-col">
      <section className="max-w-6xl mx-auto py-16">
        <h1 className="text-5xl font-bold text-[#A94442] mb-8">Admin Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <form className="flex-1 bg-white p-8 rounded-xl shadow mb-8 grid gap-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Event Name"
              className="border rounded px-4 py-2"
              required
            />
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              placeholder="Date (YYYY-MM-DD)"
              className="border rounded px-4 py-2"
              required
            />
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="border rounded px-4 py-2"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="border rounded px-4 py-2"
              required
            />
            <input
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="Event Link (optional)"
              className="border rounded px-4 py-2"
            />
            <input
              name="expires_at"
              type="date"
              value={form.expires_at || ""}
              onChange={handleChange}
              placeholder="Expires At (optional)"
              className="border rounded px-4 py-2"
            />
            <button type="submit" className="bg-[#A94442] text-white px-6 py-3 rounded font-bold" disabled={loading}>
              {loading ? "Uploading..." : "Upload Event"}
            </button>
          </form>
          {/* csv drop zone */}
          <div className="flex-1">
            <CSVDropZone setEvents={setCsvEvents}/>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Uploaded Events</h2>
          <ul className="space-y-4">
            {events && events.map(event => (
              <li key={event.id} className="bg-[#FBF2DA] p-4 rounded shadow relative">
                <button
                  onClick={async () => {
                    try {
                      const jwt = localStorage.getItem("heritage_jwt") || "";
                      const res = await fetch(`/api/events/${event.id}`, {
                        method: "DELETE",
                        headers: {
                          "Authorization": jwt
                        }
                      });
                      if (!res.ok) throw new Error("Failed to delete event");
                      setEvents(events.filter(e => e.id !== event.id));
                    } catch (err) {
                      setError("Failed to delete event");
                    }
                  }}
                  className="absolute top-2 right-2 text-red-600 text-2xl font-bold bg-transparent border-none cursor-pointer"
                  title="Delete Event"
                  aria-label="Delete Event"
                >
                  &times;
                </button>
                <div className="font-bold text-lg">{event.name}</div>
                <div>{event.date} | {event.location}</div>
                <div>{event.description}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default AdminDashboard;