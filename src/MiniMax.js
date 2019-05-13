

export function minimax(board, isMax, depth, alpha, beta, blackHeuristic) {
  if (depth === 1) {
    board.m = calculateHeuristic(board, blackHeuristic);
    return board;
  }
  if (isMax) {
    var valBoard = copyBoard(board);
    valBoard.m = -10000;
    var nextBoards = getNextBoards(board, isMax, blackHeuristic);
    for (var i = 0; i < nextBoards.length; i++) {

      var board = minimax(nextBoards[i], !isMax, depth + 1, alpha, beta, blackHeuristic);
      nextBoards[i].m = board.m;
      valBoard = board.m > valBoard.m ? nextBoards[i] : valBoard;
      alpha = Math.max(alpha, valBoard.m);

      if (alpha >= beta) {
        return valBoard;
      }
    }
    return valBoard;
  } else {
    var valBoard = copyBoard(board);
    valBoard.m = 10000;
    var nextBoards = getNextBoards(board, isMax, blackHeuristic);
    for (var i = 0; i < nextBoards.length; i++) {

      var board = minimax(nextBoards[i], !isMax, depth + 1, alpha, beta, blackHeuristic);
      nextBoards[i].m = board.m;
      valBoard = board.m < valBoard.m ? nextBoards[i] : valBoard;
      beta = Math.min(beta, valBoard.m);

      if (alpha >= beta) {
        return valBoard;
      }
    }
    return valBoard;
  }
}

export function calculateHeuristic(board, blackHeuristic) {
  var h = 0;
  if(blackHeuristic) {
    h = board.black.length - board.red.length;
  } else {
    h = board.red.length - board.black.length;
  }
  return h;
}

export function getNextBoards(board, isMax, blackHeuristic) {

  var moves = getAllValidMoves(board, isMax, blackHeuristic);
  var firstBoards  = [];
  if((isMax && blackHeuristic) || (!isMax && !blackHeuristic)) {
    for(var i = 0; i < moves.length; i++) {
      firstBoards.push(executeMove(board, moves[i], true))
    }
  } else {
    for(var i = 0; i < moves.length; i++) {
      firstBoards.push(executeMove(board, moves[i], false))
    }
  }
  var boards = [];

  for(var i = 0; i < firstBoards.length; i++) {
    if(firstBoards[i].length > 0) {
      for(var j = 0; j < firstBoards[i].length; j++) {
        boards.push(firstBoards[i][j]);
      }
    }
  }
  return boards;
}

export function executeMove(board, move, blackTurn) {
  var boards = [];
  for(var i = 0; i < move.nextMoves.length; i++) {
    var tempBoard = copyBoard(board);
    if(move.nextMoves[i].jump) {
      addPiece(tempBoard, move.nextMoves[i], blackTurn);
      removePiece(tempBoard, move.move, blackTurn);
      removePiece(tempBoard, move.nextMoves[i].jumpedPiece, !blackTurn);
    } else {
      addPiece(tempBoard, move.nextMoves[i], blackTurn);
      removePiece(tempBoard, move.move, blackTurn);
    }
    boards.push(tempBoard);
  }
  return boards;
}

export function copyBoard(board) {
  var tempBoard = {black: [], red: []};
  for(var i = 0; i < board.black.length; i++) {
    tempBoard.black.push(board.black[i]);
  }
  for (i = 0; i < board.red.length; i++) {
    tempBoard.red.push(board.red[i]);
  }
  if('m' in board) {
    tempBoard.m = board.m;
  }
  return tempBoard;
}

export function getAllValidMoves(board, isMax, blackHeuristic) {
  var moves = [];
  if(isMax && blackHeuristic || !isMax && !blackHeuristic) {
    for(var i = 0; i < board.black.length; i++) {
      var posMoves = {move: board.black[i]};
      posMoves.nextMoves = getValidMoves(board, board.black[i]);
      moves.push(posMoves);
    }
  }
  else {
    for(var i = 0; i < board.red.length; i++) {
      var posMoves = {move: board.red[i]};
      posMoves.nextMoves = getValidMoves(board, board.red[i]);
      moves.push(posMoves);
    }
  }
  return moves;
}

function getValidMoves(board, position) {
  var moves = [];
  if(blackContains(board, position) || redContains(board, position)) {
    for(var i = -1; i < 2; i++) {
      for(var j = -1; j < 2; j++) {
        if(i !== 0 && j !== 0) {
          if(position.row + i > -1 && position.row + i < 8 && position.column + j > -1 && position.column + j < 8) {
            var pos = {row: position.row + i, column: position.column + j, jump: false};
            if(!blackContains(board, pos) && !redContains(board, pos)) {
              moves.push(pos);
            }
            var jumpPos = getValidJump(position, i, j, board);
            if (jumpPos.length > 0) {
              moves.push(jumpPos[0]);
            }
          }
        }
      }
    }
  }
  return moves;
}

function getValidJump(curPos, i, j, board) {
  var newPos = {row: curPos.row + i, column: curPos.column + j};
  var jumpPos = {row: newPos.row + i, column: newPos.column + j, jump: true, jumpedPiece: newPos};
  if(jumpPos.row > -1 && jumpPos.row < 8 && jumpPos.column > -1 && jumpPos.column < 8) {
    if(blackContains(board, curPos)) {
      if(redContains(board, newPos) && !blackContains(board, jumpPos) && !redContains(board, jumpPos)) {
        return [jumpPos];
      }
    }
    if(redContains(board, curPos)) {
      if(blackContains(board, newPos) && !blackContains(board, jumpPos) && !redContains(board, jumpPos)) {
        return [jumpPos];
      }
    }
  }
  return [];
}

function removePiece(board, position, black) {
  if(black === true) {
    for(var i = 0; i < board.black.length; i++) {
      if(board.black[i].row === position.row && board.black[i].column === position.column) {
        board.black.splice(i, 1);
      }
    }
  } else {
    for(var i = 0; i < board.red.length; i++) {
      if(board.red[i].row === position.row && board.red[i].column === position.column) {
        board.red.splice(i, 1);
      }
    }
  }
  return board;
}

function addPiece(board, position, black) {
  if(black === true) {
    board.black.push(position);
  } else {
    board.red.push(position);
  }
  return board
}

function blackContains(board, position) {
  for (var i = 0; i < board.black.length; i++) {
    if (board.black[i].row === position.row && board.black[i].column === position.column) {
      return true;
    }
  }
  return false;
}

export function redContains(board, position) {
  for (var i = 0; i < board.red.length; i++) {
    if (board.red[i].row === position.row && board.red[i].column === position.column) {
      return true;
    }
  }
  return false;
}
