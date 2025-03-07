import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import toast, { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <main className="min-h-[94vh]">
        <Header />
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  );
}

export default App;
