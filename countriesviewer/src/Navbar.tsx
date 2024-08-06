import './css/Navbar.css'
interface NavbarProps { children?: React.ReactNode }
function Navbar({children }:NavbarProps) {
    return (
        <nav className="navbar-container">
            <ul className="navbar">
                <li>Home</li>
                <li>Quizes</li>
            </ul>
            {children }
        </nav>
    );
}
export default Navbar