import Footer from "../components/Footer";

export default function Resources() {
  return (
    <>
      <section className="px-8 py-16 max-w-7xl mx-auto">
        <h1 className="text-[56px] font-bold font-sans text-[#4b6b3c] mb-2">
          CCHeritage Resources
        </h1>
        <div className="text-xl font-semibold text-[#c14641] mb-4">
          Explore. Learn. Connect. Preserve Culture.
        </div>
        <div className="text-2xl font-normal text-black mb-10">
          CCHeritage provides curated resources to help you engage with Chinese
          intangible cultural heritage. Our content highlights traditions,
          stories, and cultural entrepreneurs making an impact today.
        </div>
        <div className="flex flex-col md:flex-row gap-12 mb-8">
          <div className="w-full md:w-1/2 h-[300px] flex items-center justify-center mb-6 md:mb-0">
            <img
              src="https://via.placeholder.com/400x300?text=Upload+Image"
              alt="Newsletter preview placeholder"
              className="w-full h-full object-cover rounded-lg border border-dashed border-gray-300"
            />
          </div>

          <div className="w-full md:w-1/2 h-[300px] flex items-center justify-center">
            <img
              src="https://via.placeholder.com/400x300?text=Upload+Image"
              alt="Podcast preview placeholder"
              className="w-full h-full object-cover rounded-lg border border-dashed border-gray-300"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2 w-full flex flex-col items-center">
            <div className="w-full">
              <div className="text-xl mb-2 text-left">
                Stay inspired with our{" "}
                <span className="font-bold">biweekly newsletter</span>,
                featuring:
              </div>
              <ul className="list-disc ml-6 text-lg mb-4 text-left">
                <li>
                  <span className="font-bold">
                    Spotlights on Chinese Intangible Cultural Heritage
                  </span>{" "}
                  – Learn about different cultural traditions, from tea
                  ceremonies to traditional crafts, storytelling, performing
                  arts, and more.
                </li>
                <li>
                  <span className="font-bold">Heritage Brand Journals</span> –
                  Read real-life stories of entrepreneurs building businesses
                  rooted in cultural heritage.
                </li>
              </ul>
            </div>
            <a
              href="mailto:newsletter@ccheritage.org"
              className="mt-4 px-8 py-3 rounded-full bg-[#c14641] text-white text-lg font-semibold shadow text-center inline-block"
            >
              Subscribe
            </a>
          </div>
          <div className="md:w-1/2 w-full flex flex-col items-center">
            <div className="w-full">
              <div className="text-xl mb-2 text-left">
                Our podcast features interviews with heritage brands and Chinese
                businesses that integrate cultural elements into their work.
                Each episode explores:
              </div>
              <ul className="list-disc ml-6 text-lg mb-4 text-left">
                <li>The founder’s journey and motivations</li>
                <li>Preserving and reviving cultural traditions</li>
                <li>Lessons learned in building heritage-focused brands</li>
              </ul>
            </div>
            <a
              href="https://podcast.ccheritage.org"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-8 py-3 rounded-full bg-[#c14641] text-white text-lg font-semibold shadow text-center inline-block"
            >
              Listen
            </a>
          </div>
        </div>
      </section>

      <section className="px-8 py-16 max-w-7xl mx-auto">
        <h2 className="text-[48px] font-bold font-sans text-[#c14641] mb-4">
          Follow Us on Social Media
        </h2>
        <div className="text-xl font-normal text-black mb-6">
          Stay connected with CCHeritage for{" "}
          <span className="font-bold">
            short videos, behind-the-scenes content, and cultural highlights
          </span>
          . Our social media accounts feature:
        </div>
        <ul className="list-disc ml-6 text-lg mb-8">
          <li>Quick tutorials on traditional crafts and techniques</li>
          <li>Snapshots from CCHeritage workshops and events</li>
          <li>Stories of heritage brands and cultural entrepreneurs</li>
          <li>
            Fun, educational clips to learn about Chinese intangible cultural
            heritage
          </li>
        </ul>
        <div className="text-xl font-bold mb-2">Follow Us:</div>
        <ul className="list-none ml-0 text-lg">
          <li>
            <span className="font-bold">Instagram:</span>{" "}
            <a
              href="https://instagram.com/ICHheritage"
              className="text-[#c14641] underline"
            >
              @ICHheritage
            </a>
          </li>
          <li>
            <span className="font-bold">TikTok:</span>{" "}
            <a
              href="https://tiktok.com/@ICHheritage"
              className="text-[#c14641] underline"
            >
              @ICHheritage
            </a>
          </li>
          <li>
            <span className="font-bold">YouTube:</span>{" "}
            <a
              href="https://youtube.com/ICHheritage"
              className="text-[#c14641] underline"
            >
              ICHheritage
            </a>
          </li>
          <li>
            <span className="font-bold">Rednote:</span>{" "}
            <a href="#" className="text-[#c14641] underline">
              @ICHheritage
            </a>
          </li>
        </ul>
      </section>
      <Footer />
    </>
  );
}
