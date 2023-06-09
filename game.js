const question = document.getElementById('question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressTextElement = document.getElementById('progressText');
const scoreElement = document.getElementById('score');
const progressBarElement = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');


let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=20&category=9&difficulty=medium&type=multiple").then(res=>{
    return res.json()    
}).then(loadedQuestions=>{
    questions = loadedQuestions.results.map(q=>{
        return {question: q.question, answers: [...q.incorrect_answers, q.correct_answer], correct: q.correct_answer}
    }).map(rq=>{
        let options = [...rq.answers];
        options.forEach((opt, idx, arr)=>{
            lo = arr.length-idx;
            newIdx = Math.floor(Math.random()*lo);
            rep = arr[newIdx];
            arr[newIdx] = opt;
            arr[idx] = rep;
        });

        let ca = options.indexOf(rq.correct);
        return {
            question: rq.question,
            choice1: options[0],
            choice2: options[1],
            choice3: options[2],
            choice4: options[3],
            answer: ca+1
        }
    })
    startGame();
}).catch(err=>{
    console.error(err);
});

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 20;

startGame = () =>{
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
}

getNewQuestion = () =>{
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('/end.html');
    }
    questionCounter++;

    progressTextElement.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarElement.style.width = `${questionCounter/MAX_QUESTIONS*100}%`;

    const questionIndex = Math.floor(Math.random()*availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;
    choices.forEach(choice=>{
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice'+number];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
}

incrementScore = num =>{
    score += num;
    scoreElement.innerText = score;
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        const isCorrect = (selectedAnswer == currentQuestion.answer);
        const classToApply = isCorrect?'correct':'incorrect';
        selectedChoice.parentElement.classList.add(classToApply);
        if(isCorrect){
            incrementScore(CORRECT_BONUS);
        }
        setTimeout(()=>{
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 500);
        
    });
})

