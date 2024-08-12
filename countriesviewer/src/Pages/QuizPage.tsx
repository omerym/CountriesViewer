import { Outlet } from "react-router-dom";
import '../css/QuizPage.css'

function QuizPage() {
    return (
            <div className="quiz-container">
            <Outlet />
            </div>
    );
}
export default QuizPage;