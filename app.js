window.onload = () => {

	let canvasWidth = 900;
	let canvasHeight = 600;
	let blocSize = 30;
	let context;
	let delay = 100;
	let snakee;
	let applee;
	let newDirection;
	let widthInBlocs = canvasWidth/blocSize;
	let heightInBlocs = canvasHeight/blocSize;
	let score;
	let timeout;

	class Snake {
		constructor(body, direction) {
			this.body = body;
			this.direction = direction;
			this.ateApple = false;
			this.draw = () => {
				// context.save();
				context.fillStyle = "red";

				for(let i = 0; i < this.body.length; i++) {
					drawBloc(context, this.body[i]);
				}
				// context.restore();
			}

			this.advance = () => {
				let nextPosition = this.body[0].slice();
				switch(this.direction) {
					case "left":
						nextPosition[0]--;
						break;
					case "right":
						nextPosition[0]++;
						break;
					case "up":
						nextPosition[1]--;
						break;
					case "down":
						nextPosition[1]++;
						break;
					default:
						throw("Invalid direction");
				}
				this.body.unshift(nextPosition);

				if (!this.ateApple) {
					this.body.pop();
				}
				else {
					this.ateApple = false;
				}	
			}
			this.setDirection = function(newDirection) {
				let allowedDirection;

				switch(this.direction) {
					case "left":
					case "right":
						allowedDirection = ["up", "down"];
						break;
					case "up":
					case "down":
						allowedDirection = ["left", "right"];
						break;
					default: 
						throw("Invalid direction");
				}
				if (allowedDirection.indexOf(newDirection) > -1) {
					this.direction = newDirection;
				}
			}
			this.checkCollision = () => {
				let wallCollision = false;
				let snakeCollision = false;
				let head = this.body[0];
				let resteDuCorps = this.body.slice(1);
				let snakeX = head[0];
				let snakeY = head[1];
				let minX = 0;
				let minY = 0;
				let maxX = widthInBlocs -1;
				let maxY = heightInBlocs -1;
				let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
				let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

				if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
					wallCollision = true;
				}

				for (let i = 0; i < resteDuCorps.length; i++) {
					if (snakeX === resteDuCorps[i][0] && snakeY === resteDuCorps[i][1]) {
						snakeCollision = true;
					}
				}

			 	if (wallCollision === true || snakeCollision === true) {
			 		console.log("Collision");
			 	}
				return wallCollision || snakeCollision;
			}

			this.isEatingApple = (appleToEat) => {
				let head = this.body[0];

				if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
					return true;
				}
				else {
					return false;
				}
			}
		}
	}

	class Apple {
		constructor(position) {
			this.position = position;
			this.draw = () => {
				// context.save();
				context.fillStyle = "green";
				context.beginPath();
				let radius = blocSize/2;
				let x = this.position[0]* blocSize + radius;
				let y = this.position[1]* blocSize + radius;
				context.arc(x, y, radius, 0, Math.PI*2, true);
				context.fill();
				// context.restore();
			}
			this.setNewPosition = () => {
				let newX = Math.round(Math.random() * (widthInBlocs -1));
				let newY = Math.round(Math.random() * (heightInBlocs -1));
				this.position = [newX, newY];
			}
			this.isOnSnake = (snakeToCheck) => {
				let isOnSnakee = false;

				for (let i = 0; i < snakeToCheck.body.length; i++) {
					if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
						isOnSnakee = true;
					}
				}
				return isOnSnakee;
			}
		}
	}

	function init() {
		let canvas = document.createElement('canvas');
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.style.border = "30px solid gray";
		canvas.style.backgroundColor = "#ddd";
		canvas.style.margin = "20px auto";
		canvas.style.display = "block";
		document.body.appendChild(canvas);
		context = canvas.getContext('2d');
		snakee = new Snake([ [6,4], [5,4], [4,4] ], "right");
		applee = new Apple([10, 10]);
		score = 0;
		refreshCanvas();
	}

	init();

	function refreshCanvas() {
		snakee.advance();
		if (snakee.checkCollision()) {
			gameOver();
		}
		else {
			if (snakee.isEatingApple(applee)) {

				score++;
				snakee.ateApple = true;
				do {
					applee.setNewPosition();
				}
				while(applee.isOnSnake(snakee));
			}
			context.clearRect(0, 0, canvasWidth, canvasHeight)
			drawScore();
			applee.draw();
			snakee.draw();
			timeout = setTimeout(refreshCanvas, delay);
		}
	}

	function drawBloc(context, position) {
		let x = position[0] * blocSize;
		let y = position[1] * blocSize;
		context.fillRect(x, y, blocSize, blocSize)
	}

	function gameOver() {
		// context.save();
		context.font = "bold 70px sans-serif";
		context.fillStyle = "black";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.strokeStyle = "white";
		context.lineWidth = 5;
		let centreX = canvasWidth/2;
		let centreY = canvasHeight/2;
		context.strokeText('Game over', centreX, centreY - 180);
		context.fillText('Game over', centreX, centreY - 180);

		context.font = "bold 30px sans-serif";
		context.strokeText('Appuyer sur la touche Espace pour rejouer', centreX, centreY - 120);
		context.fillText('Appuyer sur la touche Espace pour rejouer', centreX, centreY - 120);
		// context.restore();
	}
	function restart() {
		snakee = new Snake([ [6,4], [5,4], [4,4] ], "right");
		applee = new Apple([10, 10]);
		score = 0;
		clearTimeout(timeout);
		refreshCanvas();
	}
	function drawScore() {
		// context.save();
		context.font = "bold 200px sans-serif";
		context.fillStyle ="gray";
		context.textAlign = "center";
		context.textBaseline = "middle";
		let centreX = canvasWidth/2;
		let centreY = canvasHeight/2;
		context.fillText(score.toString(), centreX, centreY);
		// context.restore();
	}

	document.addEventListener("keydown", handleKeyDown);

	function handleKeyDown(e) {
		let key = e.code;
		
		switch(key) {
			case 'ArrowLeft':
				newDirection = "left";
				break;
			case 'ArrowUp':
				newDirection = "up";
				break;
			case 'ArrowRight':
				newDirection = "right";
				break;
			case 'ArrowDown':
				newDirection = "down";
				break;
			case 'Space': 
				restart();
				return;
			default:
				return;
		}
		snakee.setDirection(newDirection);
	}

}