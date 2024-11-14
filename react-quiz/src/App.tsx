import React, { useState} from 'react';
import { fetchQuizQuestions } from './API';
//components
import QuestionCard from './components/QuestionCard';

//Types
import { QuestionState, Difficulty } from './API';
//Styles
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
  }

const TOTAL_QUESTIONS = 10;


const App = () => {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameover, setGameover] = useState(true);

  

const startTrivia = async () => {
  setLoading(true);
  setGameover(false);

  const newQuestions = await fetchQuizQuestions(
    TOTAL_QUESTIONS,
    Difficulty.EASY
  );

  setQuestions(newQuestions);
  setScore(0);
  setUserAnswers([]);
  setNumber(0);
  setLoading(false);

};

const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
  if (!gameover) {
    //Users answers
    const answer = e.currentTarget.value;
    //check answer against correct answer
    const correct = questions[number].correct_answer === answer;
    //add score if answer is correct
    if (correct) setScore(prev => prev + 1);
    //Save answer in the array for user answers
    const AnswerObject = {
      question: questions[number].question,
      answer,
      correct,
      correctAnswer: questions[number].correct_answer,

    };
    setUserAnswers((prev) => [...prev, AnswerObject]);
  }
};

const nextQuestion = () => {
  //move on to the next question if not the last question
  const nextQuestion = number + 1;

  if (nextQuestion === TOTAL_QUESTIONS) {
    setGameover(true);
  } else {
    setNumber(nextQuestion);
  }

};
  
  return (
    <>
    <GlobalStyle />
  <Wrapper> 
    <h1> REACT QUIZ </h1>
    {gameover || userAnswers.length === TOTAL_QUESTIONS ? 
    (
    <button className="start" onClick={startTrivia}> 
    Start
    </button> 
    ): null}


    {!gameover ? <p className= "score"> Score: {score} </p> : null}
    {loading ? <p> Loading Questions ... </p> : null}
    {!loading && !gameover && (

    <QuestionCard
      questionNr={number + 1}
      totalQuestions={TOTAL_QUESTIONS}
      question={questions[number].question}
      answers={questions[number].answers}   
      userAnswer={userAnswers ? userAnswers[number] : undefined} 
      callback={checkAnswer}
    /> 
    )}
    {!gameover && !loading && userAnswers.length === number +1 && number !== TOTAL_QUESTIONS -1 ? (
    <button className="next" onClick={nextQuestion}> 
    Next Question
    </button> 
    ): null }
    </Wrapper>
    </>
  
  );
}

export default App;
