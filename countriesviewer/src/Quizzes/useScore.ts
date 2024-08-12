import { useState } from "react";

function useScore(): [number, number, (correct: boolean) => void] {
    const [questionsCount, setQuestionCount] = useState(0);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const addQuesiton = (correct: boolean) => {
        setQuestionCount(questionsCount + 1);
        if (correct) {
            setCorrectAnswersCount(correctAnswersCount + 1);
        }
    }
    return [questionsCount, correctAnswersCount, addQuesiton];
}
export default useScore;