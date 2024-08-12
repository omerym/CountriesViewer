import { useState } from "react";
import Quiz from "./Quiz"
import useScore from "./useScore";
import Loading from "../Loading";
import Error from "../Error";
import useAnswers from "./useAnswers";
import { useFlags } from "../QuizzesData";
function FlagsQuizPage() {
    const [flags,alt, loading, error, retry] = useFlags();
    const [questionsCount, correctAnswersCount, addQuesitonScore] = useScore();
    let element: JSX.Element;
    if (loading || flags.length === 0) {
        element = <Loading />
    }
    if (error) {
        element = <Error retry={retry} >An error has occured.<br />check your connection</Error>
    }
    else {
        element = <FlagsQuiz flags={flags} flagAlts={alt} addQuesitonScore={addQuesitonScore} />
    }
    return <div>
        <p className="score">Answered <strong>{correctAnswersCount}</strong> out of <strong>{questionsCount}</strong> questions correctly.</p>
        {element}
    </div>;
}
interface FlagsQuizProps { flags: [string, string][],flagAlts:Map<string,string>, addQuesitonScore: (correct: boolean) => void, answerCount?: number }
function FlagsQuiz({ flags, flagAlts, addQuesitonScore, answerCount = 4 }: FlagsQuizProps) {
    const [userAnswer, setUserAnswer] = useState('');
    const _flags : [string,string][] = flags.map(([name, flag]) => [flag, name]);
    const [country, correctAnswer, answers, _loadNextQuestion] = useAnswers(_flags, answerCount);
    const loadNextQuestion = () => {
        _loadNextQuestion();
        setUserAnswer('');
    }
    const _country = flags.find(([, flag]) => flag === country) ?? '';
    const question = (
        <div>
            <p>Which is the country of this flag:</p>
            <img src={_country[1]} alt={flagAlts.get(_country[1]) } />
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


export default FlagsQuizPage;