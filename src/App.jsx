import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import Wrapper from './container/Wrapper';
import Home from './pages/home';
import Weather from './pages/weather';
import Calculator from './pages/calculator';
import Lorem from './pages/lorem';
import Gradiant from './pages/gradiant';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/weather" element={<Weather />} />
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/lorem" element={<Lorem />} />
                    <Route path="/gradiant" element={<Gradiant />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
