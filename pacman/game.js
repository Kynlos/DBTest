class PacmanGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        
        // Grid settings
        this.gridSize = 20;
        this.rows = this.canvas.height / this.gridSize;
        this.cols = this.canvas.width / this.gridSize;
        
        // Player
        this.pacman = {
            x: 1,
            y: 1,
            direction: 'right',
            nextDirection: 'right'
        };
        
        // Ghosts
        this.ghosts = [
            { x: 14, y: 14, direction: 'up', color: '#ff0000' },
            { x: 15, y: 14, direction: 'down', color: '#ffb8ff' },
            { x: 13, y: 15, direction: 'left', color: '#00ffff' },
            { x: 16, y: 15, direction: 'right', color: '#ffb852' }
        ];
        
        // Simple maze layout (1 = wall, 0 = empty, 2 = dot, 3 = power pellet)
        this.maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,3,1,1,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,2,1,1,1,1,3,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,2,1,1,2,1,1,1,1,1,1,1,2,1,1,2,2,1,1,1,1,2,2,1],
            [1,2,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,2,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,2,1,1,1,1,1,1],
            [0,0,0,0,0,1,2,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,2,1,0,0,0,0,0],
            [1,1,1,1,1,1,2,2,1,1,0,1,1,0,0,0,0,1,1,0,1,1,2,2,1,1,1,1,1,1],
            [0,0,0,0,0,0,2,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,2,0,0,0,0,0,0],
            [1,1,1,1,1,1,2,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,2,1,1,1,1,1,1],
            [0,0,0,0,0,1,2,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,2,1,0,0,0,0,0],
            [1,1,1,1,1,1,2,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,2,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,3,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,3,1],
            [1,1,1,2,1,1,2,2,1,1,2,1,1,1,1,1,1,1,2,1,1,2,2,1,1,2,1,1,1,1],
            [1,2,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        this.totalDots = this.countDots();
        this.dotsEaten = 0;
        
        this.setupEventListeners();
        this.setupTouchControls();
        this.draw();
    }
    
    countDots() {
        let count = 0;
        for (let row of this.maze) {
            for (let cell of row) {
                if (cell === 2 || cell === 3) count++;
            }
        }
        return count;
    }
    
    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    setupTouchControls() {
        let startX, startY;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!startX || !startY) return;
            
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 30;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > minSwipeDistance) {
                    this.pacman.nextDirection = deltaX > 0 ? 'right' : 'left';
                }
            } else {
                if (Math.abs(deltaY) > minSwipeDistance) {
                    this.pacman.nextDirection = deltaY > 0 ? 'down' : 'up';
                }
            }
            
            startX = null;
            startY = null;
        });
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning) return;
        
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down', 
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };
        
        if (keyMap[e.key]) {
            e.preventDefault();
            this.pacman.nextDirection = keyMap[e.key];
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-flex';
        this.gameLoop();
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        const pauseBtn = document.getElementById('pauseBtn');
        if (this.gamePaused) {
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        } else {
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            this.gameLoop();
        }
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.dotsEaten = 0;
        
        // Reset pacman position
        this.pacman.x = 1;
        this.pacman.y = 1;
        this.pacman.direction = 'right';
        this.pacman.nextDirection = 'right';
        
        // Reset ghosts
        this.ghosts = [
            { x: 14, y: 14, direction: 'up', color: '#ff0000' },
            { x: 15, y: 14, direction: 'down', color: '#ffb8ff' },
            { x: 13, y: 15, direction: 'left', color: '#00ffff' },
            { x: 16, y: 15, direction: 'right', color: '#ffb852' }
        ];
        
        // Reset maze dots
        this.maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,3,1,1,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,2,1,1,1,1,3,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,2,1,1,2,1,1,1,1,1,1,1,2,1,1,2,2,1,1,1,1,2,2,1],
            [1,2,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,2,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,2,1,1,1,1,1,1],
            [0,0,0,0,0,1,2,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,2,1,0,0,0,0,0],
            [1,1,1,1,1,1,2,2,1,1,0,1,1,0,0,0,0,1,1,0,1,1,2,2,1,1,1,1,1,1],
            [0,0,0,0,0,0,2,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,2,0,0,0,0,0,0],
            [1,1,1,1,1,1,2,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,2,1,1,1,1,1,1],
            [0,0,0,0,0,1,2,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,2,1,0,0,0,0,0],
            [1,1,1,1,1,1,2,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,2,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,3,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,3,1],
            [1,1,1,2,1,1,2,2,1,1,2,1,1,1,1,1,1,1,2,1,1,2,2,1,1,2,1,1,1,1],
            [1,2,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        this.totalDots = this.countDots();
        this.updateUI();
        
        document.getElementById('startBtn').style.display = 'inline-flex';
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause"></i> Pause';
        
        this.draw();
    }
    
    canMoveTo(x, y) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) {
            return false;
        }
        return this.maze[y][x] !== 1;
    }
    
    movePacman() {
        // Try to change direction if possible
        const directions = {
            'up': { x: 0, y: -1 },
            'down': { x: 0, y: 1 },
            'left': { x: -1, y: 0 },
            'right': { x: 1, y: 0 }
        };
        
        const nextDir = directions[this.pacman.nextDirection];
        const nextX = this.pacman.x + nextDir.x;
        const nextY = this.pacman.y + nextDir.y;
        
        if (this.canMoveTo(nextX, nextY)) {
            this.pacman.direction = this.pacman.nextDirection;
        }
        
        // Move in current direction
        const currentDir = directions[this.pacman.direction];
        const newX = this.pacman.x + currentDir.x;
        const newY = this.pacman.y + currentDir.y;
        
        if (this.canMoveTo(newX, newY)) {
            this.pacman.x = newX;
            this.pacman.y = newY;
            
            // Handle tunnel effect (wrap around)
            if (this.pacman.x < 0) this.pacman.x = this.cols - 1;
            if (this.pacman.x >= this.cols) this.pacman.x = 0;
            
            // Eat dots
            const cell = this.maze[this.pacman.y][this.pacman.x];
            if (cell === 2) {
                this.maze[this.pacman.y][this.pacman.x] = 0;
                this.score += 10;
                this.dotsEaten++;
            } else if (cell === 3) {
                this.maze[this.pacman.y][this.pacman.x] = 0;
                this.score += 50;
                this.dotsEaten++;
            }
        }
    }
    
    moveGhosts() {
        const directions = ['up', 'down', 'left', 'right'];
        const directionMap = {
            'up': { x: 0, y: -1 },
            'down': { x: 0, y: 1 },
            'left': { x: -1, y: 0 },
            'right': { x: 1, y: 0 }
        };
        
        this.ghosts.forEach(ghost => {
            // Simple AI: try to move toward pacman, but also random movement
            const possibleMoves = [];
            
            directions.forEach(dir => {
                const move = directionMap[dir];
                const newX = ghost.x + move.x;
                const newY = ghost.y + move.y;
                
                if (this.canMoveTo(newX, newY)) {
                    possibleMoves.push(dir);
                }
            });
            
            if (possibleMoves.length > 0) {
                // 30% chance to move toward pacman, 70% random
                if (Math.random() < 0.3) {
                    // Move toward pacman
                    const dx = this.pacman.x - ghost.x;
                    const dy = this.pacman.y - ghost.y;
                    
                    let preferredDirection;
                    if (Math.abs(dx) > Math.abs(dy)) {
                        preferredDirection = dx > 0 ? 'right' : 'left';
                    } else {
                        preferredDirection = dy > 0 ? 'down' : 'up';
                    }
                    
                    if (possibleMoves.includes(preferredDirection)) {
                        ghost.direction = preferredDirection;
                    } else {
                        ghost.direction = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                    }
                } else {
                    // Random movement
                    ghost.direction = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                }
                
                const move = directionMap[ghost.direction];
                ghost.x += move.x;
                ghost.y += move.y;
                
                // Handle tunnel effect
                if (ghost.x < 0) ghost.x = this.cols - 1;
                if (ghost.x >= this.cols) ghost.x = 0;
            }
        });
    }
    
    checkCollisions() {
        // Check ghost collisions
        for (let ghost of this.ghosts) {
            if (ghost.x === this.pacman.x && ghost.y === this.pacman.y) {
                this.lives--;
                if (this.lives <= 0) {
                    this.gameOver();
                } else {
                    this.resetPositions();
                }
                break;
            }
        }
        
        // Check win condition
        if (this.dotsEaten >= this.totalDots) {
            this.levelComplete();
        }
    }
    
    resetPositions() {
        this.pacman.x = 1;
        this.pacman.y = 1;
        this.pacman.direction = 'right';
        this.pacman.nextDirection = 'right';
        
        this.ghosts[0] = { x: 14, y: 14, direction: 'up', color: '#ff0000' };
        this.ghosts[1] = { x: 15, y: 14, direction: 'down', color: '#ffb8ff' };
        this.ghosts[2] = { x: 13, y: 15, direction: 'left', color: '#00ffff' };
        this.ghosts[3] = { x: 16, y: 15, direction: 'right', color: '#ffb852' };
    }
    
    gameOver() {
        this.gameRunning = false;
        alert(`Game Over! Final Score: ${this.score}`);
        this.resetGame();
    }
    
    levelComplete() {
        this.gameRunning = false;
        alert(`Level Complete! Score: ${this.score}`);
        this.resetGame();
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cell = this.maze[y][x];
                const pixelX = x * this.gridSize;
                const pixelY = y * this.gridSize;
                
                if (cell === 1) {
                    // Wall
                    this.ctx.fillStyle = '#0000ff';
                    this.ctx.fillRect(pixelX, pixelY, this.gridSize, this.gridSize);
                } else if (cell === 2) {
                    // Dot
                    this.ctx.fillStyle = '#ffff00';
                    this.ctx.beginPath();
                    this.ctx.arc(pixelX + this.gridSize/2, pixelY + this.gridSize/2, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (cell === 3) {
                    // Power pellet
                    this.ctx.fillStyle = '#ffff00';
                    this.ctx.beginPath();
                    this.ctx.arc(pixelX + this.gridSize/2, pixelY + this.gridSize/2, 6, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
        
        // Draw Pacman using FontAwesome-style circle
        const pacX = this.pacman.x * this.gridSize + this.gridSize/2;
        const pacY = this.pacman.y * this.gridSize + this.gridSize/2;
        
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        
        // Draw pacman with mouth opening based on direction
        let startAngle, endAngle;
        switch(this.pacman.direction) {
            case 'right':
                startAngle = 0.2 * Math.PI;
                endAngle = 1.8 * Math.PI;
                break;
            case 'down':
                startAngle = 0.7 * Math.PI;
                endAngle = 2.3 * Math.PI;
                break;
            case 'left':
                startAngle = 1.2 * Math.PI;
                endAngle = 0.8 * Math.PI;
                break;
            case 'up':
                startAngle = 1.7 * Math.PI;
                endAngle = 1.3 * Math.PI;
                break;
        }
        
        this.ctx.arc(pacX, pacY, this.gridSize/2 - 2, startAngle, endAngle);
        this.ctx.lineTo(pacX, pacY);
        this.ctx.fill();
        
        // Draw ghosts
        this.ghosts.forEach(ghost => {
            const ghostX = ghost.x * this.gridSize + this.gridSize/2;
            const ghostY = ghost.y * this.gridSize + this.gridSize/2;
            
            this.ctx.fillStyle = ghost.color;
            this.ctx.beginPath();
            this.ctx.arc(ghostX, ghostY, this.gridSize/2 - 2, Math.PI, 0);
            this.ctx.rect(ghostX - (this.gridSize/2 - 2), ghostY, (this.gridSize - 4), this.gridSize/2 - 2);
            this.ctx.fill();
            
            // Ghost eyes
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(ghostX - 4, ghostY - 2, 2, 0, Math.PI * 2);
            this.ctx.arc(ghostX + 4, ghostY - 2, 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#000';
            this.ctx.beginPath();
            this.ctx.arc(ghostX - 4, ghostY - 2, 1, 0, Math.PI * 2);
            this.ctx.arc(ghostX + 4, ghostY - 2, 1, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.movePacman();
        this.moveGhosts();
        this.checkCollisions();
        this.updateUI();
        this.draw();
        
        setTimeout(() => this.gameLoop(), 200); // Game speed
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PacmanGame();
});
