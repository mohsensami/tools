import { Routes, Route } from 'react-router-dom';

import './App.css';
import PageLayout from './components/hoc/PageLayout';
import Home from './page/Home';
import Movies from './page/Movies';
import NotFound from './page/NotFound';
import PowerSupply from './page/PowerSupply';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route element={<PageLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/power-supply-calculator" element={<PowerSupply />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
