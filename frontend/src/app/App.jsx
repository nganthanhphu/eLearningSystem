import Footer from "../components/Footer";
import Header from "../components/Header";
import AppRouter from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(135deg, #add4fd, #dfc1ff)",
          }}
        >
          <Header />
          <main className="container my-5">
            <AppRouter />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
