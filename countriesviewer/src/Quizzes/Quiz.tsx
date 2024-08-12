import "../css/Quiz.css"
interface QuizProps { question: JSX.Element,nextButton?:false|JSX.Element, children: JSX.Element[],optionsClassName?:string }
/**
 * put the options for the question as children of this element.
 * @param props: quesion:an element indicating the question.
 * @returns
 */
export function Quiz({ question, nextButton = false, children,optionsClassName = "options" }: QuizProps) {
    return (
        <section className="question-container">
            <div className="question">
                {question}
            </div>
            <div className="options-container">
                <div className={optionsClassName}>
                    {children}
                </div>
                {nextButton}
            </div>
        </section>
    );
}


export default Quiz;