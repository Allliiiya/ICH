import Footer from "../components/Footer";
import logoImg from "../assets/images/logo.png";

export default function AboutUs() {
  return (
    <div className="bg-[#F5E9D6] min-h-screen w-full flex flex-col">
      <section className="flex flex-row items-start justify-between min-h-[80vh] px-6 md:px-16 lg:px-24 py-8 md:py-12 lg:py-16 bg-[#F5E9D6] gap-8 md:gap-16 lg:gap-[60px]">
        <div className="w-full md:w-[70%] lg:w-[75%] flex flex-col justify-start">
          <h1
            className="text-[100px] font-bold text-[#A94442] mb-8"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Who we are?
          </h1>
          <p className="text-2xl text-[#444] mb-10 max-w-6xl">
            We are a nonprofit digital platform dedicated to preserving and
            revitalizing Chinese intangible cultural heritage for a global
            audience. Our mission is to bridge tradition and modern life by
            making cultural knowledge accessible, engaging, and inspiring.
          </p>
          <h2
            className="text-5xl font-bold text-[#222] mb-4"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Our Mission
          </h2>
          <p className="text-2xl text-[#222] mb-10 max-w-6xl">
            Through{" "}
            <span className="font-bold">
              educational workshops, curated showcases of cultural brands, and
              engaging learning experiences
            </span>
            , we bring centuries-old traditions into today’s world. In an{" "}
            <span className="font-bold">AI-dominated generation</span>, where
            much understanding of culture has been lost, we focus on{" "}
            <span className="font-bold">
              teaching and inspiring the next generation
            </span>{" "}
            to appreciate, explore, and carry forward these legacies. By doing
            so, we spark curiosity, foster cross-cultural understanding, and
            ensure these traditions continue to thrive for generations to come..
          </p>
          <h2
            className="text-5xl font-bold text-[#222] mb-4"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Our Values
          </h2>
          <p className="text-2xl text-[#222] max-w-6xl">
            Whether you are deeply connected to Chinese culture or just
            beginning to explore, our platform invites you to discover Chinese
            heritage in a new and meaningful way—
            <span className="font-bold">
              understanding China from different perspectives and experiencing
              the richness of its living traditions.
            </span>
          </p>
        </div>
        <div className="w-full md:w-[30%] lg:w-[25%] flex flex-col items-center justify-center h-full lg:-ml-8">
          <img
            src={logoImg}
            alt="CCHeritage Logo"
            className="w-64 h-64 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem] object-contain mb-2"
          />
          <span className="text-5xl font-serif text-[#222]">ICHeritage</span>
        </div>
      </section>
      <Footer />
    </div>
  );
}
