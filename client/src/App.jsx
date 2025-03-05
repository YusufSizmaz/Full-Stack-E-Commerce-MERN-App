import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <main className="min-h-[94vh]">
        <Header />
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
