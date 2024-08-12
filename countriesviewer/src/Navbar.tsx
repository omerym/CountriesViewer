import { NavLink } from 'react-router-dom';
import './css/Navbar.css'
interface NavbarProps { children?: React.ReactNode }
function Navbar({children }:NavbarProps) {
    return (
        <nav className="navbar-container">
            <ul className="navbar">
                <li><NavLink className={({ isActive }) => isActive ? "active" : ""} to ="/">Home</NavLink></li>
                <li><NavLink className={({ isActive }) => isActive ? "active" : ""} to="/QuizSelection">Quizes</NavLink></li>
            </ul>
            {children }
        </nav>
    );
}
export default Navbar