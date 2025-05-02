"use strict";

// ---- Configuración ----
const canvasWidth = 800;
const canvasHeight = 600;
const paddleWidth = 100; // Ancho del paddle
const paddleHeight = 20; // Alto del paddle
const paddleY = canvasHeight - paddleHeight - 10;
const paddleSpeed = 1.2; // Velocidad del paddle

const blockRows = 5; // Número de filas de bloques
const blockCols = 10; // Número de columnas de bloques
const blockGap = 4; // Espacio entre bloques
const blockWidth = (canvasWidth - (blockCols + 1) * blockGap) / blockCols;
const blockHeight = 20;

const initialLives = 3; // Número de vidas iniciales
const ballSize = 16; // Tamaño de la bola
const ballSpeed = 0.3; // Velocidad de la bola

// ---- Sonido de bloques ----
const soundBlock = new Audio('sounds/block.wav');
soundBlock.volume = 0.05;

// ---- Clase Ball ----
class Ball extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "ball");
        this.velocity = new Vec(0, 0);
        this.inPlay = false;
    }

    reset() {
        this.position = new Vec(
            canvasWidth / 2 - this.width / 2,
            canvasHeight / 2 - this.height / 2
        );
        this.velocity = new Vec(0, 0);
        this.inPlay = false;
    }

    initVelocity() {
        const minAngle = (90 - 30) * Math.PI / 180;
        const maxAngle = (90 + 30) * Math.PI / 180;
        const angle = Math.random() * (maxAngle - minAngle) + minAngle;
        this.velocity = new Vec(
            Math.cos(angle) * ballSpeed,
            Math.sin(angle) * ballSpeed
        );
        this.inPlay = true;
    }

    update(dt) {
        if (!this.inPlay) return;
        this.position = this.position.plus(this.velocity.times(dt));
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// ---- Clase Paddle ----
class Paddle extends GameObject {
    constructor() {
        super(
            new Vec((canvasWidth - paddleWidth) / 2, paddleY),
            paddleWidth, paddleHeight, "white", "paddle"
        );
        this.velocity = new Vec(0, 0);
    }

    update(dt) {
        this.position = this.position.plus(this.velocity.times(dt));
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > canvasWidth)
            this.position.x = canvasWidth - this.width;
    }
}

// ---- Clase Block ----
class Block extends GameObject {
    constructor(x, y, color) {
        super(new Vec(x, y), blockWidth, blockHeight, color, "block");
        this.destroyed = false;
    }
}

// ---- Clase BreakoutGame ----
class BreakoutGame {
    constructor() {
        this.ball = new Ball(
            new Vec(canvasWidth / 2 - ballSize / 2, canvasHeight / 2 - ballSize / 2),
            ballSize, ballSize, "red"
        );
        this.paddle = new Paddle();
        this.blocks = [];
        this.score = 0;
        this.lives = initialLives;
        this.gameOver = false;
        this.win = false;

        // Flags de input
        this.leftPressed = false;
        this.rightPressed = false;
        this.started = false; // Indica si el usuario presionó ESPACIO

        this._createBlocks();
        this._setupInput();
        this.ball.reset();
        // No se lanza hasta que el usuario presione ESPACIO
    }

    _createBlocks() {
        const colors = ["#f55", "#f95", "#ff5", "#5f5", "#5ff", "#55f"]; // Colores de los bloques
        // Crear bloques en una cuadrícula
        for (let row = 0; row < blockRows; row++) {
            for (let col = 0; col < blockCols; col++) {
                let x = blockGap + col * (blockWidth + blockGap);
                let y = 40 + row * (blockHeight + blockGap);
                let color = colors[row % colors.length];
                this.blocks.push(new Block(x, y, color));
            }
        }
    }

    _setupInput() {
        // Teclado
        window.addEventListener("keydown", e => {
            if (e.key === "ArrowLeft") this.leftPressed = true;
            if (e.key === "ArrowRight") this.rightPressed = true;
            if (e.key === " " && !this.started && !this.gameOver) {
                this.started = true;
                this.ball.initVelocity();
                // desbloquear audio
                soundBlock.play().then(() => soundBlock.pause()).catch(() => { });
            }
            this._updatePaddleVelocity();
        });
        window.addEventListener("keyup", e => {
            if (e.key === "ArrowLeft") this.leftPressed = false;
            if (e.key === "ArrowRight") this.rightPressed = false;
            this._updatePaddleVelocity();
        });

        // Mouse
        const canvas = document.getElementById("canvas");
        canvas.addEventListener("mousemove", e => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            this.paddle.position.x = mouseX - this.paddle.width / 2;
            if (this.paddle.position.x < 0) this.paddle.position.x = 0;
            if (this.paddle.position.x + this.paddle.width > canvasWidth)
                this.paddle.position.x = canvasWidth - this.paddle.width;
        });
    }

    _updatePaddleVelocity() {
        if (this.leftPressed && !this.rightPressed) {
            this.paddle.velocity.x = -paddleSpeed;
        } else if (this.rightPressed && !this.leftPressed) {
            this.paddle.velocity.x = paddleSpeed;
        } else {
            this.paddle.velocity.x = 0;
        }
    }

    update(dt) {
        if (this.gameOver || this.win) return;
        if (this.started) this.ball.update(dt);
        this.paddle.update(dt);

        // Rebotes en bordes
        if (
            this.ball.position.x < 0 ||
            this.ball.position.x + this.ball.width > canvasWidth
        ) {
            this.ball.velocity.x *= -1;
        }
        if (this.ball.position.y < 0) this.ball.velocity.y *= -1;

        // Rebote con paddle
        if (boxOverlap(this.ball, this.paddle)) {
            this.ball.velocity.y *= -1;
            const diff =
                this.ball.position.x + this.ball.width / 2 -
                (this.paddle.position.x + this.paddle.width / 2);
            this.ball.velocity.x = diff * 0.01;
        }

        // Pierde vida si cae abajo
        if (this.ball.position.y > canvasHeight) {
            this.lives--;
            document.getElementById("lives").textContent = `Vidas: ${this.lives}`;
            if (this.lives <= 0) {
                this.gameOver = true;
            } else {
                this.ball.reset();
                this.started = false;
            }
        }

        // Colisión con bloques
        for (let block of this.blocks) {
            if (!block.destroyed && boxOverlap(this.ball, block)) {
                block.destroyed = true;
                soundBlock.currentTime = 0;
                soundBlock.play().catch(() => { });
                this.ball.velocity.y *= -1;
                this.score++;
                document.getElementById("score").textContent = `Bloques destruidos: ${this.score}`;
                break;
            }
        }

        if (this.score === this.blocks.length) this.win = true;
    }

    draw(ctx) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.blocks.forEach(b => { if (!b.destroyed) b.draw(ctx); });
        this.paddle.draw(ctx);
        if (this.started) this.ball.draw(ctx);

        // Mensaje de inicio
        if (!this.started && !this.gameOver) {
            ctx.fillStyle = "white";
            ctx.font = "24px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Presione ESPACIO para empezar", canvasWidth / 2, canvasHeight / 2);
        }

        if (this.gameOver) {
            ctx.fillStyle = "white";
            ctx.font = "48px sans-serif";
            ctx.fillText("GAME OVER", canvasWidth / 2 - 150, canvasHeight / 2);
        } else if (this.win) {
            ctx.fillStyle = "white";
            ctx.font = "48px sans-serif";
            ctx.fillText("¡GANASTE!", canvasWidth / 2 - 130, canvasHeight / 2);
        }
    }
}

// ---- Inicialización ----
let ctx, game, lastTime;
function main() {
    const canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");

    game = new BreakoutGame();
    lastTime = performance.now();
    requestAnimationFrame(loop);
}

function loop(now) {
    const dt = now - lastTime;
    game.update(dt);
    game.draw(ctx);
    lastTime = now;
    requestAnimationFrame(loop);
}

window.onload = main;
