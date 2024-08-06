import './css/App.css'
import Navbar from './Navbar';
import HomePage from './HomePage';
import useTheme, { getOppisite } from './useTheme';
function App() {
    const [theme, toggleTheme] = useTheme();
    return (
        <>
            <header>
                <Navbar>
                    <button className="theme-button" onClick={toggleTheme}>{getOppisite(theme)} theme</button>
                </Navbar>
            </header>
            <HomePage />
        </>
    );
}
export default App
