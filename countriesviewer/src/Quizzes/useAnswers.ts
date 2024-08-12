import { useState } from "react";

function getRandomElement<T>(array: T[]) {
    const index = Math.floor(Math.random() * (array.length));
    return array[index];
}
function getAnswers(countries: [string, string][], answerCount: number): [string, string, string[]] {
    let _countries = [...countries];
    const removeCountry = (country: [string, string]) => {
        _countries = _countries.filter(x => x[0] !== country[0]);
        _countries = _countries.filter(x => x[1] !== country[1]);
    }
    const [country, correctAnswer] = getRandomElement(_countries);
    removeCountry([country, correctAnswer]);
    const answers: string[] = [correctAnswer];
    while (answers.length < answerCount && _countries.length !== 0) {
        const [country, value] = getRandomElement(_countries);
        removeCountry([country, value]);
        answers.push(value);
    }
    return [country, correctAnswer, answers];
}
export function useAnswers(countries: [string, string][], answerCount: number):
[string,string,string[],() => void]    {
    const [country, setCountry] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [answers, setAnswers] = useState<string[]>([]);
    const loadNextQuestion = () => {
        const [_country, _correctAnswer, _answers] = getAnswers(countries, answerCount);
        setCountry(_country);
        setCorrectAnswer(_correctAnswer);
        setAnswers(shuffleArray(_answers));
    }
    if (country === '' && countries.length!==0) {
        loadNextQuestion();
    }
    return [country, correctAnswer, answers, loadNextQuestion];
}
function shuffleArray<T>(array: T[]) {
    for (let i = 0; i < array.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}
export default useAnswers;