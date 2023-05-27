const submitButton = document.getElementById('saveScoreButton');
const usernameText = document.getElementById('username');

usernameText.addEventListener('keyup', (e) =>{
    console.log(e.key);
    submitButton.disabled  = !usernameText.value;
});

saveHighScore = e => {
    e.preventDefault();
}

