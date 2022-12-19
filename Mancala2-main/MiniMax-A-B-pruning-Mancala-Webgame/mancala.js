

// Creates the board state, 2D array with two rows and 6 coumns
function createBoard() {
    const board = Array.from(Array(2), () => new Array(6).fill(4));
    return board;
}

function askForMove(board,player) { 
while(true) {
        const prompt = require("prompt-sync")();

        var input = prompt(`Player ${player + 1} pick a move: `);

        if (input < 1 || input > 6 || (board[player][input - 1]) == 0) {
            console.log("Not a possible move. Try again.")
        } 
        else {
            break
        }
    }
    return input - 1
}

function displayPlayerLine(board,player,top) { // Shows the board display
    let string = ""
    if (top == true) {
        string += String(player) + " "
        for (var i = 0; i < board[0].length; i++) {
            string += board[0][i] + " ";
        }
    } else {
        string += "  "
        for (var i = 0; i < board[1].length; i++) {
            string += board[1][i] + " ";
        }
        string += String(player)
    }
    console.log(string);
}

function checkEnd(board, player) { // if done with game, if atleast one side is empty.
    let count = 0
    for (i = 0; i < 6; i++) {
        count += board[player][i]
    }
    if (count == 0) {
        return true
    }
    else {
        return false
    }
}

function displayBoard(board, p1, p2) {
    displayPlayerLine(board,p1,true);
    displayPlayerLine(board,p2,false);
}

function getScore(tempBoard,player,tempScore) { //sum up the scores for each pot and accumulator.
    if (player == 0) {
        for (i=0;i<6;i++) {
            tempScore[1] += tempBoard[1][i]
            tempBoard[1][i] = 0
        }
    } else {
        for (i=0;i<6;i++) {
            tempScore[0] += tempBoard[0][i]
            tempBoard[0][i] = 0
        }
    }
}

function winner() { //compare score in mancala accumulators and decides the Winner
    if (score[0] > score[1]) {
        win = 0
    } 
    else if (score[1] > score[0]) {
        win = 1
    } else {
        win = 2
    }
}
// Our board is a 2d array wih row0 player 1 and row 1 is player 2 
function takeTurn(tempBoard, player, pos, tempScore) {
    let end = 0
    //displayBoard(board,score[0],score[1])
    row = player
    //pos = askForMove(board,player)
    if (row == 0) {
        opRow = 1
        let num = tempBoard[row][pos]
        tempBoard[row][pos] = 0
        for (var i = 1; i < num + 1; i++) {
            if (pos - i == -1 && i < 12) {
                row += 1
                tempScore[0] += 1
                pos -= i * 2
                currentPlayer = 0
            } else if (pos + i == 6 && i >= 6){
                row -= 1
                pos += i * 2 - 1
                tempBoard[row][pos - i] += 1
                currentPlayer = 1
            } else if (row == 1) {
                tempBoard[row][pos + i] += 1
                currentPlayer = 1
            } else {
                tempBoard[row][pos - i] += 1
                currentPlayer = 1
            }
            end = pos - i
        }
    } else {
        let num = tempBoard[row][pos]
        tempBoard[row][pos] = 0
        opRow = 0
        for (var i = 1; i < num + 1; i++) {
            if (pos - i == -1 && i >= 6) {
                row += 1
                pos -= (i * 2) - 1
                tempBoard[row][pos + i] += 1
                currentPlayer = 0
            } else if (pos + i == 6 && i < 6){
                row -= 1
                tempScore[1] += 1
                pos += i * 2 - 1
                currentPlayer = 1
            } else if (row == 0) {
                tempBoard[row][pos - i] += 1
                currentPlayer = 0
            } else {
                tempBoard[row][pos + i] += 1
                currentPlayer = 0
            }
            end = pos + i
        }
    }
    
    if (row == player && tempBoard[row][end] == 1 && tempBoard[opRow][end] > 0) {
        if (player == 0) {
            tempScore[0] += tempBoard[0][end] + tempBoard[1][end]
        }
        else {
            tempScore[1] += tempBoard[0][end] + tempBoard[1][end]
        }
        tempBoard[0][end] = 0
        tempBoard[1][end] = 0
    }
    if (checkEnd(tempBoard,player)){
        getScore(tempBoard,player,tempScore)
    }
    //return score
}

let sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
    };

 function Validate(board,player,pos,score) { // Detects the moves and interacts with the board.
    if (currentPlayer == player && board[player][pos] != 0) { //appropriate move.
        takeTurn(board,player,pos,score)
        if (checkEnd(board,player)){
            winner()
        }
        if (AI == true && currentPlayer == 1 && win == null) {
            
            //setTimeout(AIMove(board,1,score), 1000)
           AIMove(board,1,score)
            currentPlayer = 0
        }
        if (checkEnd(board,player)){
            winner()
        }
        updateList()
        //updateimage()
    } 
    else{
        if (currentPlayer != player){
            alert("This is not your board/turn!");}
        else if (board[player][pos] == 0){
            alert("This is not an appropriate pot, it is empty!");
        
        }
    } //Closes else
    return false
}

function findPossibleMoves(tempBoard,player) {
    moves = []
    for (i=0;i<6;i++) {
        if (tempBoard[player][i] != 0) { // if the pit is zero not legal move.
            moves.push(i)
        }
    }
    return moves
}

function miniMax(tempBoard,player,tempScore,maxPlayer,depth, alpha, beta) { // Our AI move cofiguration
    let possibleMoves = findPossibleMoves(tempBoard,player)

    if (player == 0) { // if first player, human then its opponent is player 1, AI.
        anti = 1
    } else {
        anti = 0
    }

    boardCopy2 = JSON.parse(JSON.stringify(tempBoard))
    scoreCopy2 = JSON.parse(JSON.stringify(tempScore))

    if (checkEnd(boardCopy2,player) == true) {
        getScore(boardCopy2,player,scoreCopy2)
        eva = scoreCopy2[player] - scoreCopy2[anti]
        return {score: eva}
    }

    if (depth == 0) {
        eva = scoreCopy2[player] - scoreCopy2[anti]
        return {score: eva}
    }

    let moves = []

    for (let i = 0; i < possibleMoves.length; i++) {
        let currentTestScore = {}
        currentTestScore.index = possibleMoves[i]
        boardCopy2 = JSON.parse(JSON.stringify(tempBoard))
        scoreCopy2 = JSON.parse(JSON.stringify(tempScore))
        takeTurn(boardCopy2,player,possibleMoves[i],scoreCopy2)

        if (currentPlayer == player) {
            if (maxPlayer == true) {
                eva = miniMax(boardCopy2,player,scoreCopy2,true,depth,alpha,beta)
                currentTestScore.score = eva.score
                alpha = Math.max(alpha,eva.score)
            } 
            else { // minimizer
                eva = miniMax(boardCopy2,anti,scoreCopy2,false,depth,alpha,beta)
                currentTestScore.score = eva.score
                beta = Math.min(beta,eva.score)
            }
        } else {

            if (maxPlayer == true) {
                eva = miniMax(boardCopy2,anti,scoreCopy2,false,depth - 1,alpha,beta)
                currentTestScore.score = eva.score
                alpha = Math.max(alpha,eva.score)
            } 
            else {
                eva = miniMax(boardCopy2,player,scoreCopy2,true,depth - 1,alpha,beta)
                currentTestScore.score = eva.score
                beta = Math.min(beta,eva.score)
            }
        }
        boardCopy2 = JSON.parse(JSON.stringify(tempBoard))
        scoreCopy2 = JSON.parse(JSON.stringify(tempScore))

        moves.push(currentTestScore)   

        if (alpha >= beta) { // we are done. No need to search further
            break
        }
    }   

    let bestPlay = null

    if (maxPlayer == true) {
        let maxEva = -Infinity
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > maxEva) {
                maxEva = moves[i].score;
                bestPlay = i;
            }
        }
    } 
    else {
        let minEva = Infinity
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < minEva) {
                minEva = moves[i].score;
                bestPlay = i;
            }
        }
    }
    return moves[bestPlay]
}

//function sleep(milliseconds) {
  //  return new Promise(resolve => setTimeout(resolve, milliseconds));
 //}



function AIMove(board,player,score) { //gets the move, value fromt he minimax search of the game tree.
    bestMove = miniMax(board,player,score,true,7,-Infinity,Infinity)
    //await sleep(2000)
    takeTurn(board,player,bestMove.index,score)
}

function updateList() { //Updates the captions, numbers of stones display in each pot.
    //$("#img10").attr("src","2.png");
    document.getElementById("00").innerHTML = board[0][0];
   
   // document.getElementsByClassName(img10).innerHTML="board[0][0].png";
    document.getElementById("01").innerHTML = board[0][1];
    document.getElementById("02").innerHTML = board[0][2];
    document.getElementById("03").innerHTML = board[0][3];
    document.getElementById("04").innerHTML = board[0][4];
    document.getElementById("05").innerHTML = board[0][5]; // end of player 1 pots, the first row.
    document.getElementById("1s").innerHTML = score[0]; // Accumulator 1
    document.getElementById("10").innerHTML = board[1][0]; // start of the next row, player 2.
    document.getElementById("11").innerHTML = board[1][1];
    document.getElementById("12").innerHTML = board[1][2];
    document.getElementById("13").innerHTML = board[1][3];
    document.getElementById("14").innerHTML = board[1][4];
    document.getElementById("15").innerHTML = board[1][5];
    document.getElementById("2s").innerHTML = score[1]; //Accumulator 2
    if (win == null) {
        if (currentPlayer == 0) {
            document.getElementById("currentPlayer").innerHTML = "Current Player: Player 1/Human Player";
        } else {
            document.getElementById("currentPlayer").innerHTML = "Current Player: Player 2/AI Player";
        }
    } else {
        if (win == 0) {
            document.getElementById("currentPlayer").innerHTML = "Player 1/Human Player Wins!";
        } else if (win == 1) {
            document.getElementById("currentPlayer").innerHTML = "Player 2 Wins!";
        } else {
            document.getElementById("currentPlayer").innerHTML = "It's a tie!";
        }
    }
} // Closes the update list function.


/*function updateimage() {
    $('#img10').children().attr('src','images/' + board[1][0] + '.png');
    //$("#img10").attr("src","2.png");

    //document.getElementById("00").innerHTML = board[0][0];
    
   
   // document.getElementsByClassName(img10).innerHTML="board[0][0].png";
    document.getElementById("01").innerHTML = board[0][1];
    document.getElementById("02").innerHTML = board[0][2];
    document.getElementById("03").innerHTML = board[0][3];
    document.getElementById("04").innerHTML = board[0][4];
    document.getElementById("05").innerHTML = board[0][5]; // end of player 1 pots, the first row.
    document.getElementById("1s").innerHTML = score[0]; // Accumulator 1
    document.getElementById("10").innerHTML = board[1][0]; // start of the next row, player 2.
    document.getElementById("11").innerHTML = board[1][1];
    document.getElementById("12").innerHTML = board[1][2];
    document.getElementById("13").innerHTML = board[1][3];
    document.getElementById("14").innerHTML = board[1][4];
    document.getElementById("15").innerHTML = board[1][5];
    document.getElementById("2s").innerHTML = score[1]; //Accumulator 2
}
*/




function AIButton(){
    if (AI == false){
        AI = true
        if (currentPlayer == 1) { //player two/ bottom row.
            AIMove(board,1,score)
            //sleep(10000)
            updateList()
        }
        document.getElementById("AIButton").innerHTML = "Turn AI Off";
    } else {
        AI = false
        document.getElementById("AIButton").innerHTML = "Turn AI On";
    }
    return false
}


const score = [0,0] 
let currentPlayer = 0 // the first player, p1 always human player starts.
AI = false // always turn this on for AI against player functionality.
let win = null
const board = createBoard()



