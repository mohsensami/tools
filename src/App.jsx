import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import Wrapper from './container/Wrapper';
import Home from './pages/Home';
import Weather from './pages/Weather';
import Calculator from './pages/Calculator';
import Lorem from './pages/Lorem';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/weather" element={<Weather />} />
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/lorem" element={<Lorem />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
