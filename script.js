let canvas = document.getElementById("snake");
let context = canvas.getContext("2d");
let box = 32;
let snake = [];
snake[0] = {
    x: 8 * box,
    y: 8 * box
};
let direction = "right";
let food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
};
let score = 0;

function criarBG() {
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, 16 * box, 16 * box);
}

function criarCobrinha() {
    for (i = 0; i < snake.length; i++) {
        context.fillStyle = "green";
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function drawFood() {
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, box, box);
}

function drawScore() {
    context.fillStyle = "black";
    context.font = "24px Arial";
    context.fillText("Score: " + score, box, box);
}

document.addEventListener('keydown', update);

function update(event) {
    if (event.keyCode == 37 && direction != 'right') direction = 'left';
    if (event.keyCode == 38 && direction != 'down') direction = 'up';
    if (event.keyCode == 39 && direction != 'left') direction = 'right';
    if (event.keyCode == 40 && direction != 'up') direction = 'down';
}



function iniciarJogo() {
    if (snake[0].x > 15 * box && direction == "right") snake[0].x = 0;
    if (snake[0].x < 0 && direction == 'left') snake[0].x = 16 * box;
    if (snake[0].y > 15 * box && direction == "down") snake[0].y = 0;
    if (snake[0].y < 0 && direction == 'up') snake[0].y = 16 * box;

    for (i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            clearInterval(jogo);
            alert('Game Over:(');
        }
    }

    criarBG();
    criarCobrinha();
    drawFood();
    drawScore();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "right") snakeX += box;
    if (direction == "left") snakeX -= box;
    if (direction == "up") snakeY -= box;
    if (direction == "down") snakeY += box;

    if (snakeX != food.x || snakeY != food.y) {
        snake.pop();
    } else {
        food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;
        score += 10;
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    snake.unshift(newHead);
}

let jogo = setInterval(iniciarJogo, 100);


//abaixo coloquei script para score(placar)
function drawScore() {
    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, canvas.height - 10); // Ajuste as coordenadas X e Y conforme necessário
}

//abaixo script-function para salvar scores
let playerNick;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

function startGame() {
    playerNick = document.getElementById('player-nick').value;
    if (playerNick) {
        // Esconder o modal e iniciar o jogo
        document.getElementById('nick-modal').style.display = 'none';
        jogo = setInterval(iniciarJogo, 100);
    }
}

function saveScore() {
    const playerName = document.getElementById('player-name').value;
    if (playerName && score > 0) {
        const playerScore = { name: playerName, score: score };
        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push(playerScore);
        highScores.sort((a, b) => b.score - a.score);
        highScores = highScores.slice(0, 5); // Manter apenas os 5 melhores scores

        localStorage.setItem('highScores', JSON.stringify(highScores));
        displayHighScores();
    }
}

function displayHighScores() {
    const highScoresList = document.getElementById('high-scores-list');
    highScoresList.innerHTML = '';
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.forEach(score => {
        const listItem = document.createElement('li');
        listItem.textContent = `${score.name}: ${score.score}`;
        highScoresList.appendChild(listItem);
    });
}

//abaixo function restart com condicão atrelada 
function restartGame() {
    // Esconder o modal de game over
    document.getElementById('game-over-modal').style.display = 'none';
    
    // Reinicialize as variáveis do jogo
    snake = [];
    snake[0] = {
        x: 8 * box,
        y: 8 * box
    };
    direction = "right";
    score = 0;
    food.x = Math.floor(Math.random() * 15 + 1) * box;
    food.y = Math.floor(Math.random() * 15 + 1) * box;

    // Inicie o loop do jogo novamente
    jogo = setInterval(iniciarJogo, 100);
}

//abaixo script do controle pra mobile (touch)
// ... (seu código existente)

const gameContainer = document.getElementById('game-container');
let touchStartX, touchStartY;

gameContainer.addEventListener('touchstart', handleTouchStart, false);
gameContainer.addEventListener('touchmove', handleTouchMove, false);

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Movimento horizontal
        if (deltaX > 0 && direction !== 'left') {
            direction = 'right';
        } else if (deltaX < 0 && direction !== 'right') {
            direction = 'left';
        }
    } else {
        // Movimento vertical
        if (deltaY > 0 && direction !== 'up') {
            direction = 'down';
        } else if (deltaY < 0 && direction !== 'down') {
            direction = 'up';
        }
    }

    touchStartX = null;
    touchStartY = null;
}


