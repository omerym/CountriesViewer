import './css/App.css'
import Navbar from './Navbar';
import HomePage from './HomePage';
function App() {
    setTheme();
    return (
        <>
            <header>
                <Navbar />
            </header>
            <HomePage />
        </>
    );
}
function setTheme() {
    const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
    document.documentElement.setAttribute("data-theme", defaultTheme);
}
export default App
