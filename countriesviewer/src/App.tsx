import './css/App.css'
import Navbar from './Navbar';
import HomePage from './HomePage';
import useTheme, { getOppisite } from './useTheme';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
function App() {
    const [theme, toggleTheme] = useTheme();
    return (
        <>
            <BrowserRouter basename="/CountriesViewer">
                <header>
                    <Navbar>
                        <button className="theme-button" onClick={toggleTheme}>{getOppisite(theme)} theme</button>
                    </Navbar>
                </header>
                <Routes>
                    <Route path="/" index element={<HomePage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
export default App
