import {  useState } from "react";
import Loading from "../Loading";
import Error from "../Error";
import useAnswers from "./useAnswers";
import Quiz from "./Quiz";
import useScore from "./useScore";
import { useCurrencies } from "../QuizzesData";
function CurrenciesQuizPage() {
    const [currencies, loading, error, retry] = useCurrencies();
    const [questionsCount, correctAnswersCount, addQuesitonScore] = useScore();
    let element: JSX.Element;
    if (loading || currencies.length === 0) {
        element = <Loading />
    }
    if (error) {
        element = <Error retry={retry} >An error has occured.<br />check your connection</Error>
    }
    else {
        element = <CurrenciesQuiz currencies={currencies} addQuesitonScore={addQuesitonScore} />
    }
    return <div>
        <p className="score">You have answered {correctAnswersCount}  questions correctly and {questionsCount - correctAnswersCount}  questions incorrectly.</p>
        {element}
    </div>;
}
interface CurrenciesQuizProps { currencies: [string, string][], addQuesitonScore: (correct: boolean) => void, answerCount?: number }
function CurrenciesQuiz({ currencies, addQuesitonScore, answerCount = 4 }: CurrenciesQuizProps) {
    const [userAnswer, setUserAnswer] = useState('');
    const [country, correctAnswer, answers, _loadNextQuestion] = useAnswers(currencies, answerCount);
    const loadNextQuestion = () => {
        _loadNextQuestion();
        setUserAnswer('');
    }
    const question = (
        <div>
            <p>What is the currency of:</p>
            <p className="country-name">{country}</p>
        </div>
    );
    const getClass = (answer: string) => {
        if (userAnswer === '') {
            return '';
        }
        let className = answer === correctAnswer ? "correct-answer " : '';
        if (answer === userAnswer) {
            const _class = answer === correctAnswer ? "correct-user-answer" : 'wrong-user-answer';
            className += _class;
        }
        return className;
    }
    const answersButtons = answers.map((answer, index) =>
        <button key={index} className={getClass(answer)}
            disabled={userAnswer !== ''}
            onClick={() => {
                addQuesitonScore(answer === correctAnswer);
                setUserAnswer(answer);
            }}>{answer}
        </button>
    );
    const nextButton = (
        <button onClick={loadNextQuestion} className="next-button">next</button>
    )
    return (
        <Quiz question={question} nextButton={userAnswer !== '' && nextButton}>
            {answersButtons}
        </Quiz>
    );
}

export default CurrenciesQuizPage;