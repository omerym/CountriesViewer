import './css/App.css'
import Navbar from './Navbar';
import useTheme, { getOpposite } from './useTheme';
import { HashRouter, Outlet, Route, Routes } from 'react-router-dom';
import CapitalsQuizPage from './Quizzes/CapitalsQuizPage';
import CurrenciesQuizPage from './Quizzes/CurrenciesQuizPage';
import FlagsQuizPage from './Quizzes/FlagsQuizPage';
import ReverseFlagsQuizPage from './Quizzes/ReverseFlagsQuizPage';
import HomePage from './Pages/HomePage';
import QuizzesPage from './Pages/QuizzesPage';
import QuizPage from './Pages/QuizPage';
function App() {
    const [theme, toggleTheme] = useTheme();
    return (
        <>
            <HashRouter>
                <header>
                    <Navbar>
                        <button className="theme-button" onClick={toggleTheme}>{getOpposite(theme)} theme</button>
                    </Navbar>
                </header>
                <Routes>
                    <Route path="/" index element={<HomePage />} />
                    <Route path="/QuizSelection" element={<Outlet />}>
                        <Route index element={<QuizzesPage />} />
                    </Route>
                    <Route path="Quiz" element={<QuizPage />}>
                        <Route path="Capitals" Component={CapitalsQuizPage} />
                        <Route path="Currencies" Component={CurrenciesQuizPage} />
                        <Route path="Flags" Component={FlagsQuizPage} />
                        <Route path="ReverseFlags" Component={ReverseFlagsQuizPage} />
                    </Route>
                </Routes>
            </HashRouter>
        </>
    );
}
export default App
