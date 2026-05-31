import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import BlogList from "./pages/BlogList";
import BlogForm from "./pages/BlogForm";
import BlogView from "./pages/BlogView";

const Navbar = () => (
  <nav className="navbar navbar-expand-lg bg-navy shadow-sm py-3 mb-4">
    <div className="container">
      <Link className="navbar-brand text-gold fw-bold fs-3" to="/">
        BLOG MANAGER
      </Link>
    </div>
  </nav>
);

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <div className="container pb-5">
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/view/:slug" element={<BlogView />} />
            <Route path="/add" element={<BlogForm />} />
            <Route path="/edit/:id" element={<BlogForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
