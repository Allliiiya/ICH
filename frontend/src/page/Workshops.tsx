import Footer from "../components/Footer";
import LeafletMap from "../components/LeafletMap";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Event, EventResponse } from "../types/event";

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

	const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
	const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	
	// Filter states
	const [selectedState, setSelectedState] = useState<string>("");
	const [selectedTimeInterval, setSelectedTimeInterval] = useState<string>("");

	// State options
	const stateOptions = [
		{ value: "", label: "All States" },
		{ value: "New York", label: "NY" },
		{ value: "Connecticut", label: "CT" },
		{ value: "New Jersey", label: "NJ" },
		{ value: "Massachusetts", label: "MA" }
	];

	// Time interval options
	const timeIntervalOptions = [
		{ value: "", label: "All Time" },
		{ value: "day", label: "Day" },
		{ value: "week", label: "Week" },
		{ value: "month", label: "Month" },
		{ value: "year", label: "Year" }
	];

	// Fetch all events for featured section
	useEffect(() => {
		fetch("/api/events")
			.then((res) => {
				console.log(res.status, res.headers.get("content-type"));
				return res.json();	
			})
			.then((data) => {
				data = data || [];
				setFeaturedEvents(topKFeature(data, K, compareByUpcomingDate));
			})
			.catch((err) => console.error("Error fetching events:", err));
	}, []);

	// Fetch filtered events
	const fetchFilteredEvents = async (page: number = 1) => {
		setIsLoading(true);
		try {
			const params = new URLSearchParams();
			if (selectedState) params.append("state", selectedState);
			if (selectedTimeInterval) params.append("time_interval", selectedTimeInterval);
			params.append("page", page.toString());
			params.append("page_size", "4"); // Show 4 events per page

			const response = await fetch(`/api/events/filter?${params}`);
			if (!response.ok) {
				throw new Error('Failed to fetch filtered events');
			}
			
			const data: EventResponse = await response.json();
			setFilteredEvents(data.events);
			setCurrentPage(data.page);
			setTotalPages(data.total_pages);
		} catch (err) {
			console.error("Error fetching filtered events:", err);
			setFilteredEvents([]);
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch filtered events when filters change
	useEffect(() => {
		fetchFilteredEvents(1);
	}, [selectedState, selectedTimeInterval]);

	// Handle pagination
	const handlePreviousPage = () => {
		if (currentPage > 1) {
			fetchFilteredEvents(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			fetchFilteredEvents(currentPage + 1);
		}
	};

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
				<section className="w-full flex justify-center py-10">
					<div className="w-[90%] md:w-[80%] lg:w-[70%] flex flex-col rounded-2xl shadow-lg bg-[#f5ecd7] p-4">
						<h2 className="text-2xl font-serif font-semibold mb-4 text-green-800 text-center">
						{t("Event Locations")}
						</h2>

						{/* Fixed height map container */}
						<div className="w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden">
						<LeafletMap 
							events={filteredEvents} 
							className="w-full h-full rounded-xl"
						/>
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
						<div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-auto p-8">
							<div className="flex justify-between items-center mb-5">
								<span className="text-sm font-semibold">
									<span className="inline-block align-middle mr-2">&#128197;</span>
									{t("Select Appointment")}
								</span>
								<div className="space-x-2">
									<button className="text-xs font-semibold text-gray-700 hover:underline">
										{t("Sign Up")}
									</button>
									<button className="text-xs font-semibold text-gray-700 hover:underline">
										{t("Login")}
									</button>
								</div>
							</div>

							{/* Filter Tabs */}
							<div className="mb-3">
								<div className="flex flex-wrap gap-1 mb-1">
									<div className="flex items-center space-x-1">
										<span className="text-xs font-medium text-gray-700">Location:</span>
										{stateOptions.map((option) => (
											<button
												key={option.value}
												onClick={() => setSelectedState(option.value)}
												className={`px-1.5 py-0.5 rounded-full text-xs font-medium transition ${
													selectedState === option.value
														? 'bg-[#c14641] text-white'
														: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
												}`}
											>
												{option.label}
											</button>
										))}
									</div>
								</div>
								<div className="flex flex-wrap gap-1">
									<div className="flex items-center space-x-1">
										<span className="text-xs font-medium text-gray-700">Time:</span>
										{timeIntervalOptions.map((option) => (
											<button
												key={option.value}
												onClick={() => setSelectedTimeInterval(option.value)}
												className={`px-1.5 py-0.5 rounded-full text-xs font-medium transition ${
													selectedTimeInterval === option.value
														? 'bg-[#c14641] text-white'
														: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
												}`}
											>
												{option.label}
											</button>
										))}
									</div>
								</div>
							</div>

							{/* Events List */}
							<div className="divide-y divide-gray-200">
								{isLoading ? (
									<div className="flex justify-center items-center py-5">
										<div className="text-gray-500 text-sm">Loading events...</div>
									</div>
								) : filteredEvents && filteredEvents.length > 0 ? (
									filteredEvents.map((event, idx) => (
										<div
											key={event.id || idx}
											className="flex justify-between items-center py-5"
										>
											<div>
												<div className="font-semibold text-sm">{event.name}</div>
												<div className="text-gray-500 text-xs">
													{event.date} @ {event.location}
												</div>
												<div className="text-gray-500 text-xs">
													{event.description}
												</div>
											</div>
											<button className="bg-black text-white px-5 py-2 rounded font-semibold text-xs">
												{t("BOOK")}
											</button>
										</div>
									))
								) : (
									<div className="flex justify-center items-center py-5">
										<div className="text-gray-500 text-sm">No events found matching your criteria.</div>
									</div>
								)}
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex justify-center items-center mt-3 space-x-2">
									<button
										onClick={handlePreviousPage}
										disabled={currentPage === 1}
										className={`px-2 py-1 rounded font-medium text-xs ${
											currentPage === 1
												? 'bg-gray-200 text-gray-400 cursor-not-allowed'
												: 'bg-[#c14641] text-white hover:bg-[#a13e2e]'
										}`}
									>
										← Previous
									</button>
									<span className="text-gray-700 text-xs">
										Page {currentPage} of {totalPages}
									</span>
									<button
										onClick={handleNextPage}
										disabled={currentPage === totalPages}
										className={`px-2 py-1 rounded font-medium text-xs ${
											currentPage === totalPages
												? 'bg-gray-200 text-gray-400 cursor-not-allowed'
												: 'bg-[#c14641] text-white hover:bg-[#a13e2e]'
										}`}
									>
										Next →
									</button>
								</div>
							)}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}