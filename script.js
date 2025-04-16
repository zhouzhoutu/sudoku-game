document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const newGameBtn = document.getElementById('new-game');
    const checkBtn = document.getElementById('check');
    const solveBtn = document.getElementById('solve');
    const difficultySelect = document.getElementById('difficulty');
    const timerDisplay = document.getElementById('timer');
    const messageDisplay = document.getElementById('message');
    
    let selectedCell = null;
    let gameBoard = [];
    let solution = [];
    let startTime = null;
    let timerInterval = null;
    
    // 初始化游戏
    initGame();
    
    // 事件监听
    newGameBtn.addEventListener('click', initGame);
    checkBtn.addEventListener('click', checkSolution);
    solveBtn.addEventListener('click', showSolution);
    
    // 键盘输入
    // 移除document级别的键盘事件监听，防止重复输入
    // document.addEventListener('keydown', handleKeyPress);
    
    // 初始化游戏
    function initGame() {
        clearInterval(timerInterval);
        messageDisplay.textContent = '';
        board.innerHTML = '';
        
        // 生成新的数独
        const difficulty = difficultySelect.value;
        generateSudoku(difficulty);
        
        // 创建游戏板
        createBoard();
        
        // 开始计时
        startTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);
        updateTimer();
    }
    
    // 生成数独
    function generateSudoku(difficulty) {
        // 生成完整解
        solution = generateSolution();
        
        // 根据难度移除数字
        let cellsToRemove;
        switch(difficulty) {
            case 'easy':
                cellsToRemove = 30;
                break;
            case 'medium':
                cellsToRemove = 45;
                break;
            case 'hard':
                cellsToRemove = 55;
                break;
            default:
                cellsToRemove = 30;
        }
        
        // 复制解决方案作为游戏板
        gameBoard = JSON.parse(JSON.stringify(solution));
        
        // 随机移除数字
        let removedCells = 0;
        while (removedCells < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            
            if (gameBoard[row][col] !== 0) {
                gameBoard[row][col] = 0;
                removedCells++;
            }
        }
    }
    
    // 生成完整的数独解决方案
    function generateSolution() {
        // 创建一个空的9x9网格
        const grid = Array(9).fill().map(() => Array(9).fill(0));
        
        // 填充对角线上的3x3方块
        fillDiagonalBoxes(grid);
        
        // 解决剩余的格子
        solveSudoku(grid);
        
        return grid;
    }
    
    // 填充对角线上的3x3方块
    function fillDiagonalBoxes(grid) {
        for (let box = 0; box < 9; box += 3) {
            fillBox(grid, box, box);
        }
    }
    
    // 填充一个3x3方块
    function fillBox(grid, row, col) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffleArray(nums);
        
        let index = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                grid[row + i][col + j] = nums[index++];
            }
        }
    }
    
    // 随机打乱数组
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    // 解决数独
    function solveSudoku(grid) {
        const emptyCell = findEmptyCell(grid);
        if (!emptyCell) return true; // 没有空格，解决完成
        
        const [row, col] = emptyCell;
        
        for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
                grid[row][col] = num;
                
                if (solveSudoku(grid)) {
                    return true;
                }
                
                grid[row][col] = 0; // 回溯
            }
        }
        
        return false; // 触发回溯
    }
    
    // 查找空格
    function findEmptyCell(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null;
    }
    
    // 检查数字是否有效
    function isValid(grid, row, col, num) {
        // 检查行
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) return false;
        }
        
        // 检查列
        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) return false;
        }
        
        // 检查3x3方块
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[boxRow + i][boxCol + j] === num) return false;
            }
        }
        
        return true;
    }
    
    // 创建游戏板
    function createBoard() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // 添加边框样式
                if (col % 3 === 2 && col !== 8) {
                    cell.classList.add('border-right');
                }
                if (row % 3 === 2 && row !== 8) {
                    cell.classList.add('border-bottom');
                }
                
                // 设置初始值
                const value = gameBoard[row][col];
                if (value !== 0) {
                    cell.textContent = value;
                    cell.classList.add('fixed');
                } else {
                    cell.addEventListener('click', () => selectCell(cell));
                    cell.addEventListener('keydown', handleKeyPress); // 添加键盘事件
                    cell.setAttribute('contenteditable', 'true'); // 使单元格可编辑
                }
                
                board.appendChild(cell);
            }
        }
    }
    
    // 选择单元格
    function selectCell(cell) {
        // 取消之前选择的单元格
        if (selectedCell) {
            selectedCell.classList.remove('selected');
            highlightRelatedCells(selectedCell, false);
        }
        
        // 选择新单元格
        selectedCell = cell;
        cell.classList.add('selected');
        highlightRelatedCells(cell, true);
    }
    
    // 高亮相关单元格
    function highlightRelatedCells(cell, highlight) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        // 高亮行和列
        for (let i = 0; i < 9; i++) {
            const rowCell = document.querySelector(`.cell[data-row="${row}"][data-col="${i}"]`);
            const colCell = document.querySelector(`.cell[data-row="${i}"][data-col="${col}"]`);
            
            if (highlight) {
                rowCell.classList.add('highlighted');
                colCell.classList.add('highlighted');
            } else {
                rowCell.classList.remove('highlighted');
                colCell.classList.remove('highlighted');
            }
        }
        
        // 高亮3x3方块
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const boxCell = document.querySelector(`.cell[data-row="${boxRow + i}"][data-col="${boxCol + j}"]`);
                if (highlight) {
                    boxCell.classList.add('highlighted');
                } else {
                    boxCell.classList.remove('highlighted');
                }
            }
        }
    }
    
    // 处理键盘输入
    function handleKeyPress(e) {
        if (!selectedCell || selectedCell.classList.contains('fixed')) return;
        
        // 清除错误标记
        selectedCell.classList.remove('error');
        
        if (e.key >= '1' && e.key <= '9') {
            // 输入数字
            selectedCell.textContent = e.key;
            
            // 更新游戏板
            const row = parseInt(selectedCell.dataset.row);
            const col = parseInt(selectedCell.dataset.col);
            gameBoard[row][col] = parseInt(e.key);
            
            // 检查是否正确
            if (gameBoard[row][col] !== solution[row][col]) {
                selectedCell.classList.add('error');
            }
        } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
            // 清除单元格
            selectedCell.textContent = '';
            
            // 更新游戏板
            const row = parseInt(selectedCell.dataset.row);
            const col = parseInt(selectedCell.dataset.col);
            gameBoard[row][col] = 0;
        }
    }
    
    // 检查解决方案
    function checkSolution() {
        let isCorrect = true;
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                
                if (!cell.classList.contains('fixed')) {
                    if (gameBoard[row][col] !== solution[row][col]) {
                        cell.classList.add('error');
                        isCorrect = false;
                    } else {
                        cell.classList.remove('error');
                    }
                }
            }
        }
        
        if (isCorrect) {
            messageDisplay.textContent = '恭喜！答案正确！';
            messageDisplay.style.color = '#27ae60';
            clearInterval(timerInterval);
        } else {
            messageDisplay.textContent = '答案有误，请检查标红的格子';
            messageDisplay.style.color = '#e74c3c';
        }
    }
    
    // 显示解决方案
    function showSolution() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                cell.textContent = solution[row][col];
                gameBoard[row][col] = solution[row][col];
                cell.classList.remove('error');
            }
        }
        
        messageDisplay.textContent = '已显示完整答案';
        messageDisplay.style.color = '#3498db';
        clearInterval(timerInterval);
    }
    
    // 更新计时器
    function updateTimer() {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        
        const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
        const seconds = (elapsedTime % 60).toString().padStart(2, '0');
        
        timerDisplay.textContent = `时间: ${minutes}:${seconds}`;
    }
    
    // 添加数字面板点击事件
    const numberButtons = document.querySelectorAll('.number-btn');
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (selectedCell && !selectedCell.classList.contains('fixed')) {
                const number = button.getAttribute('data-number');
                selectedCell.textContent = number;
                
                // 更新游戏板
                const row = parseInt(selectedCell.dataset.row);
                const col = parseInt(selectedCell.dataset.col);
                gameBoard[row][col] = parseInt(number);
                
                // 检查是否正确
                if (gameBoard[row][col] !== solution[row][col]) {
                    selectedCell.classList.add('error');
                } else {
                    selectedCell.classList.remove('error');
                }
            }
        });
    });
});