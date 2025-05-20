import { Routes, Route } from "react-router-dom";

import "./App.css";
import PageLayout from "./components/hoc/PageLayout";
import Home from "./page/Home";
import Movies from "./page/movies/Movies";
import NotFound from "./page/NotFound";
import PowerSupply from "./page/PowerSupply";
import Weather from "./page/Weather";
import Dictionary from "./page/Dictionary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WorldTimes from "./page/WorldTimes";
import Movie from "./page/movies/Movie";
import { QrCode } from "./page/QrCode";
import News from "./page/News";
import Crypto from "./page/Crypto";
import Unsplash from "./page/Unsplash";
import Lorem from "./page/Lorem";
import Photoshop from "./page/Photoshop";
import Paint from "./page/Paint";
import Player from "./page/Player";

function App() {
  const queryClient = new QueryClient();
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route element={<PageLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movie/:id" element={<Movie />} />
            <Route path="/power-supply-calculator" element={<PowerSupply />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/times" element={<WorldTimes />} />
            <Route path="/qr-code" element={<QrCode />} />
            <Route path="/news" element={<News />} />
            <Route path="/crypto" element={<Crypto />} />
            <Route path="/unsplash" element={<Unsplash />} />
            <Route path="/lorem" element={<Lorem />} />
            <Route path="/photoshop" element={<Photoshop />} />
            <Route path="/paint" element={<Paint />} />
            <Route path="/player" element={<Player />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
