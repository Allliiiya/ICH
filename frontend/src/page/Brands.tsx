import Footer from "../components/Footer";

const brands = [
  {
    name: "Brand Name",
    category: "e.g., fashion, craft, food, lifestyle",
    description:
      "A 2–3 sentence overview highlighting their heritage focus, story, or unique offerings.",
    image: (
      <div className="bg-[#F5E9D6] flex items-center justify-center h-full">
        <img
          src="/brand-pottery.jpg"
          alt="Brand Pottery"
          className="w-[500px] h-[500px] object-cover rounded-xl shadow-lg"
        />
      </div>
    ),
    link: "#",
  },
];

export default function Brands() {
  return (
    <div className="bg-[#F5E9D6] min-h-screen w-full flex flex-col p-12">
      {/* Section 1: Hero */}
      <section className="flex flex-col items-center justify-center min-h-[110vh] text-center bg-[#F5E9D6]">
        <h1
          className="text-6xl font-bold text-[#A94442] mb-6"
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          Discover Heritage-Inspired Brands
        </h1>
        <p className="text-lg text-[#444] max-w-2xl mb-8">
          Explore brands that celebrate Chinese intangible cultural heritage
          through craft, design, and innovation. Learn their stories and connect
          directly with their official websites.
        </p>
        <div className="w-[1700px] h-[850px] mx-auto rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
          <img
            src="/brands-hero.jpg"
            alt="Heritage Inspired Brands Hero"
            className="object-cover w-full h-full"
          />
        </div>
      </section>
      {/* Section 2: Brand Card */}
      <section className="flex flex-row items-center justify-center h-screen bg-[#F5E9D6]">
        <div className="flex-1 flex items-center justify-center">
          {brands[0].image}
        </div>
        <div className="flex-1 flex flex-col justify-center items-start px-12">
          <h2
            className="text-5xl font-bold text-[#A94442] mb-6"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            {brands[0].name}
          </h2>
          <p className="text-lg mb-2">
            <span className="font-semibold">Category:</span>{" "}
            {brands[0].category}
          </p>
          <ol className="mb-6">
            <li>
              <span className="font-semibold">Short Description:</span>{" "}
              {brands[0].description}
            </li>
          </ol>
          <a
            href={brands[0].link}
            className="bg-[#A94442] text-white px-8 py-4 rounded-full text-xl font-semibold shadow hover:bg-[#922d2d] transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Official Site
          </a>
        </div>
      </section>
      {/* Section 3: Contact Form */}
      <section className="flex flex-row min-h-[80vh] bg-[#A94442] text-white">
        <div className="flex-1 flex flex-col justify-center px-16">
          <h2
            className="text-7xl font-bold mb-6"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Contact us
          </h2>
          <p className="text-2xl mb-8 font-medium">
            Interested in working together? Fill out some info and we will be in
            touch shortly.
            <br />
            We can’t wait to hear from you!
          </p>
        </div>
        <div className="flex-1 flex flex-col justify-center px-16">
          <form className="w-full max-w-5xl mx-auto grid grid-cols-1 gap-10">
            <div className="flex flex-col w-full">
              <label className="text-sm mb-1">
                Brand Name <span className="text-xs">(required)</span>
              </label>
              <input
                className="w-full rounded-full px-4 py-2 text-black border-2 border-white focus:border-yellow-400"
                type="text"
                required
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm mb-1">
                Business Categories <span className="text-xs">(required)</span>
              </label>
              <select
                className="w-full rounded-full px-4 py-2 text-black border-2 border-white focus:border-yellow-400"
                required
              >
                <option value="">Select an option</option>
                <option value="fashion">Fashion</option>
                <option value="craft">Craft</option>
                <option value="food">Food</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>
            <div className="flex gap-4 w-full">
              <div className="flex-1 flex flex-col">
                <label className="text-sm mb-1">First Name</label>
                <input
                  className="w-full rounded-full px-4 py-2 text-black border-2 border-white focus:border-yellow-400"
                  type="text"
                  required
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-sm mb-1">Last Name</label>
                <input
                  className="w-full rounded-full px-4 py-2 text-black border-2 border-white focus:border-yellow-400"
                  type="text"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm mb-1">
                Email <span className="text-xs">(required)</span>
              </label>
              <input
                className="w-full rounded-full px-4 py-2 text-black border-2 border-white focus:border-yellow-400"
                type="email"
                required
              />
              <label className="flex items-center gap-2 mt-2 text-sm">
                <input type="checkbox" />{" "}
                <span>Sign up for news and updates</span>
              </label>
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm mb-1">
                Message <span className="text-xs">(required)</span>
              </label>
              <textarea
                className="w-full rounded-2xl px-4 py-2 text-black border-2 border-white focus:border-yellow-400"
                rows={4}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-white text-[#A94442] px-8 py-3 rounded-full text-xl font-semibold shadow hover:bg-[#F5E9D6] transition"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}
