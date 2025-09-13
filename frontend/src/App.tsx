import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./page/Home";
import Workshops from "./page/Workshops";
import Game from "./page/Game";
import Login from "./page/Login";
import Signup from "./page/Signup";
import Layout from "./Layout";
import Donate from "./page/Donate";
import Shop from "./page/Shop";
import Resources from "./page/Resources";
import Chapter from "./page/Chapter";
import FormPage from "./page/Form";
import Volunteer from "./page/Volunteer";
import Brands from "./page/Brands";
import AboutUs from "./page/AboutUs";
import AdminDashboard from "./page/AdminDashboard";
import { YouTubePlayer } from "./components/Video";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Routes with Navbar*/}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/games" element={<Game />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/resources" element={<Resources />} />
    <Route path="/chapter" element={<Chapter />} />
    <Route path="/volunteer" element={<Volunteer />} />

          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Routes without Navbar*/}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
  <Route path="/form" element={<FormPage />} />
  
      </Routes>
    </Router>
  );
}

export default App;
