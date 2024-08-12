import { NavLink, useNavigate } from "react-router-dom";
import "../css/Quizzes.css"
function QuizzesPage() {
    return (
        <article className="quizzes-container">
            <section className="quizzes">
                <QuizPanel title="Flags" path="/Quiz/Flags">
                    Can you guess the country of any flags.
                </QuizPanel>
                <QuizPanel title="Reverse Flags" path="/Quiz/ReverseFlags">
                    Can you guess the flag of any country.
                </QuizPanel>
                <QuizPanel title="Capitals" path="/Quiz/Capitals">
                    Can you guess the capital of any country.
                </QuizPanel>
                <QuizPanel title="Currencies" path="/Quiz/Currencies">
                    Can you guess the currency of any country.
                </QuizPanel>
            </section>

        </article>
    );
}
interface QuizPanelProps {title:string,children?:string,path:string}
function QuizPanel({ title, children, path }: QuizPanelProps) {
    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate(path);
    };

    return (
        <section onClick={handleNavigation} className="quiz">
            <h3>{title}</h3>
            <p>{children}</p>
            <NavLink to={path }>Start</NavLink>
        </section>
    );
}
export default QuizzesPage;