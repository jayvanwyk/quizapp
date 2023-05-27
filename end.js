const submitButton = document.getElementById('saveScoreButton');
const usernameText = document.getElementById('username');
const finalScoreElement = document.getElementById('finalScore');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const latestScore = localStorage.getItem('mostRecentScore');
if(latestScore){
    finalScoreElement.innerText = latestScore;
}else{
    finalScoreElement.innerText = '-'
}

usernameText.addEventListener('keyup', (e) =>{
    submitButton.disabled  = !usernameText.value;
});

saveHighScore = e => {
    e.preventDefault();
    const score = {
        score: latestScore,
        name: usernameText.value
    }
    highScores.push(score);
    highScores.sort((a, b)=>  b.score - a.score);
    highScores.splice(5);
    localStorage.setItem('highScores', JSON.stringify(highScores));

}

