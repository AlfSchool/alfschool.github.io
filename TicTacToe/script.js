"use strict"

window.addEventListener('load', () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const height = canvas.height;
    const width = canvas.width;

    //x and y on the fact that we row-major the board and have i and j
    const drawX = (x, y) => {
        const cellHeight = height/3;
        const cellWidth = width/3;
        const offset = 17;
        ctx.beginPath();
        ctx.moveTo(y*cellWidth + offset, x*cellHeight + offset); 
        ctx.lineTo((y+1)*cellWidth - offset, (x+1)*cellHeight - offset);
        ctx.moveTo((y+1)*cellWidth - offset, x*cellHeight + offset);
        ctx.lineTo(y*cellWidth + offset, (x+1)*cellHeight - offset);
        ctx.strokeStyle = "red" 
        ctx.lineWidth = 3;
        ctx.stroke(); 
        ctx.closePath();
    }

    //x and y on the fact that we row-major the board and have i and j
    const drawO = (x, y) => {
        const cellHeight = height/3;
        const cellWidth = width/3;
        const centerWidth = y*cellWidth + cellWidth/2;
        const centerHeight = x*cellHeight + cellHeight/2;
        const radius = Math.min(cellWidth, cellHeight)/2;
        const offset = 10;
        ctx.beginPath();
        ctx.arc(centerWidth, centerHeight, radius - offset, 0, 360);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "blue";
        ctx.stroke(); 
        ctx.closePath();
    }

    function isFinished() {
        return isFull() || isWon();
    }

    function isFull() {
        for (let i = 0; i < board.length; i++) {
            if (board[i].includes(0)) {
                return false;
            }
        }
        return true;
    }

    function isWon() {
        //checking rows
        for (let i = 0; i < board.length; i++) {
            if (board[i].includes(0)) {
                continue;
            }
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                return true;
            }
        }
        //checking colums
        for (let i = 0; i < board.length; i++) {
            if (board[0][i] == board[1][i] && board[1][i] === board[2][i]
                && board[0][i] !== 0
            ) {
                return true;
            }
        }
        //diagonals
        if (board[0][0] === board[1][1] && board[1][1] === board[2][2]
            && board[0][0] !== 0
        ) {
            return true;
        }
        if (board[0][2] === board[1][1] && board[1][1] === board[2][0]
            && board[0][2] !== 0
        ) {
            return true;
        }
        return false;
    }

    //lines of the board
    const LINE_THICKNESS = 1;
    ctx.fillRect(width/3, 0, LINE_THICKNESS, height);
    ctx.fillRect(width/3*2, 0, LINE_THICKNESS, height);
    ctx.fillRect(0, height/3, width, LINE_THICKNESS);
    ctx.fillRect(0, height/3*2, width, LINE_THICKNESS);
    //borders
    const BORD_THICKNESS = 2; 
    ctx.fillRect(0, 0, width, BORD_THICKNESS);
    ctx.fillRect(0, height-BORD_THICKNESS, width, BORD_THICKNESS)
    ctx.fillRect(0, 0, BORD_THICKNESS, height);
    ctx.fillRect(width-BORD_THICKNESS, 0, BORD_THICKNESS, height);

    const board = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ]

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 1) {
                drawO(i, j);
            }
            if (board[i][j] === 2) {
                drawX(i, j);
            }
        }
    }

    let myTurn = true;
    let player = 2;

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        //they are also inverted
        let x = Math.floor((event.clientY - rect.top));
        let y = Math.floor((event.clientX - rect.left));
        x = Math.floor(x/100);
        y = Math.floor(y/100);
        if (!isFinished()) {
            console.log("okk");
            if (board[x][y] === 0) {
                console.log("okkk");
                player = myTurn ? 2 : 1;
                board[x][y] = player;
                myTurn = !myTurn;
            }    
        }
        //redraw the board
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === 1) {
                    drawO(i, j);
                }
                if (board[i][j] === 2) {
                    drawX(i, j);
                }
            }    
        }
    });
});