import { useState } from "react";
import Quiz from "./Quiz"
import useScore from "./useScore";
import Loading from "../Loading";
import Error from "../Error";
import useAnswers from "./useAnswers";
import { useFlags } from "../QuizzesData";
function ReverseFlagsQuizPage() {
    const [flags, alt, loading, error, retry] = useFlags();
    const [questionsCount, correctAnswersCount, addQuesitonScore] = useScore();
    let element: JSX.Element;
    if (loading || flags.length === 0) {
        element = <Loading />
    }
    if (error) {
        element = <Error retry={retry} >An error has occured.<br />check your connection</Error>
    }
    else {
        element = <ReverseFlagsQuiz flags={flags} flagAlts={alt} addQuesitonScore={addQuesitonScore} />
    }
    return <div>
        <p className="score">You have answered {correctAnswersCount} questions correctly and {questionsCount - correctAnswersCount} questions incorrectly.</p>
        {element}
    </div>;
}
interface ReverseFlagsQuizProps { flags: [string, string][], flagAlts: Map<string, string>, addQuesitonScore: (correct: boolean) => void, answerCount?: number }
function ReverseFlagsQuiz({ flags, flagAlts, addQuesitonScore, answerCount = 4 }: ReverseFlagsQuizProps) {
    const [userAnswer, setUserAnswer] = useState('');
    const [country, correctAnswer, answers, _loadNextQuestion] = useAnswers(flags, answerCount);
    const loadNextQuestion = () => {
        _loadNextQuestion();
        setUserAnswer('');
    }
    const question = (
        <div>
            <p>Which is the flag of:</p>
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
    const handleClick = (answer: string) => {
        if (userAnswer === '') {
            addQuesitonScore(answer === correctAnswer);
            setUserAnswer(answer);
        }
    };
    const answersButtons = answers.map((answer, index) =>
        <button disabled={userAnswer !== ''} className="wraper-button"
            tabIndex={0} role="button" key={index} onClick={() => handleClick(answer)}>
            <img className={getClass(answer)} src={answer} alt={flagAlts.get(answer)}
                onClick={() => handleClick(answer)} />
        </button>
    );
    const nextButton = (
        <button onClick={loadNextQuestion} className="next-button">next</button>
    )
    return (
        <Quiz question={question} nextButton={userAnswer !== '' && nextButton} optionsClassName="image-options">
            {answersButtons}
        </Quiz>
    );
}


export default ReverseFlagsQuizPage;