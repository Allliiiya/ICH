// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// ...existing code...
import Footer from "../components/Footer";
// import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Event } from "../types/event";

const K = 3; //  number of featured events to show

// topKFeature function
// TODO: move to utils file if reused elsewhere, and use heap for efficiency if needed
export function topKFeature(
  events: Event[],
  k: number,
  comparator: (a: Event, b: Event) => number
): Event[] {
  if (events.length <= k) return events;
  const sorted = [...events].sort(comparator);
  console.log("Sorted events:", sorted);
  return sorted.slice(0, k);
}

const compareByUpcomingDate = (a: Event, b: Event) => {
  const now = new Date().getTime();
  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();

  // If event is in the past, treat as Infinity to push to end
  const diffA = dateA > now ? dateA - now : Infinity;
  const diffB = dateB > now ? dateB - now : Infinity;

  return diffA - diffB; // smaller difference first
};



function featuredEventCard(event: Event) {
	return (
		<div className="bg-[#FBF2DA] rounded-xl shadow-xl p-10 w-1/4 min-w-[280px] flex flex-col items-center" style={{ minHeight: '65vh', justifyContent: 'center' }}>
			<div className="text-2xl font-serif font-semibold mb-4 text-[#c14641] text-center">{event.name}</div>
			<div className="text-base mb-2 text-[#c14641] text-center">{event.name}</div>
			<div className="text-base mb-8 text-[#c14641] text-center">{event.description}</div>
			<button className="bg-[#c14641] text-[#FBF2DA] px-8 py-2 rounded-full font-semibold text-base hover:bg-[#a13e2e] transition">RSVP</button>
		</div>
	)
}
export default function Workshops() {
	const { t } = useTranslation();

	const [events, setEvents] = useState<Event[]>([]);
	const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);

	useEffect(() => {
		fetch("/api/events")
			.then((res) => {
				console.log(res.status, res.headers.get("content-type"));
				return res.json();	
			})
			.then((data) => {
				data = data || [];
				setEvents(data)
				setFeaturedEvents(topKFeature(data, K, compareByUpcomingDate));
			})
			.catch((err) => console.error("Error fetching events:", err));
	}, []);

	return (
		<div className="bg-[#f5ecd7] min-h-screen flex flex-col">
			{/* NavBar removed; now rendered via Layout.tsx */}
			<main className="flex-1 flex flex-col items-center justify-start">
				{/* Upcoming Events Section */}
				<section className="bg-[#b44d3c] w-screen py-20 px-0 flex flex-col items-center" style={{ height: '80vh', backgroundColor: '#b44d3c', marginTop: '5rem' }}>
					<h2 className="text-4xl font-serif font-bold mb-12 text-[#FBF2DA] text-center">Upcoming events</h2>
					<div className="flex flex-row items-start justify-center gap-8 w-full h-full">
						{
							(featuredEvents.length > 0) ? (
								featuredEvents.map((event) => (
									featuredEventCard(event)
								))
							) : (
								<p className="text-white">No upcoming events.</p>
							)	
						}
					</div>
				</section>

				{/* Workshop Map Section */}
				<section className="w-full h-screen flex items-center justify-center">
					<div className="w-[80vw] h-[80vh] flex items-center justify-center rounded-2xl shadow-lg bg-[#f5ecd7]">
						<div className="w-full h-full flex items-center justify-center text-xl text-gray-600">
							Map Component Temporarily Disabled for Build
						</div>
					</div>
				</section>

				{/* Book an Appointment Section */}
				<section className="w-full h-screen flex items-center justify-center">
					<div className="w-[80vw] h-[130vh] flex flex-col items-center justify-center rounded-2xl shadow-lg bg-[#f5ecd7]">
						<h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6 text-green-800 pt-4">
							{t("Book an appointment")}
						</h2>
						<p className="text-base md:text-lg text-gray-700 mb-8 max-w-2xl text-center">
							{t(
								"It all begins with an idea. Maybe you want to launch a business. Maybe you want to turn a hobby into something more. Or maybe you have a creative project to share with the world. Whatever it is, the way you tell your story online can make all the difference."
							)}
						</p>
						<div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl mx-auto p-12">
							<div className="flex justify-between items-center mb-8">
								<span className="text-lg font-semibold">
									<span className="inline-block align-middle mr-2">&#128197;</span>
									{t("Select Appointment")}
								</span>
								<div className="space-x-4">
									<button className="text-xs font-semibold text-gray-700 hover:underline">
										{t("Sign Up")}
									</button>
									<button className="text-xs font-semibold text-gray-700 hover:underline">
										{t("Login")}
									</button>
								</div>
							</div>
							<div className="divide-y divide-gray-200">

								{events.map((service, idx) => (
									<div
										key={idx}
										className="flex justify-between items-center py-8"
									>
										<div>
											<div className="font-semibold text-xl">{service.name}</div>
											<div className="text-gray-500 text-lg">
												{service.date} @ {service.location}
											</div>
											<div className="text-gray-500 text-lg">
												{service.description}
											</div>
										</div>
										<button className="bg-black text-white px-8 py-4 rounded font-semibold text-lg">
											{t("BOOK")}
										</button>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}