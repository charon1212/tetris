import { TetrisCursor, getTetrisCor } from "./TetrisCursor";
import { TetrominoType } from "./Tetromino";

export const BoardWidth = 10;
const xarray = Array(BoardWidth).fill(null).map((_, x) => x); // [0,1,2,...,9]
export const BoardHeight = 20;
const yarray = Array(BoardHeight).fill(null).map((_, y) => y); // [0,1,2,...,19]
export const boardInsideX = (x: number) => x >= 0 && x < BoardWidth;
export const boardInsideY = (y: number) => y >= 0 && y < BoardHeight;
export const boardInside = (x: number, y: number) => boardInsideX(x) && boardInsideY(y);

/** テトリスの盤面 */
export type TetrisBoardCell = TetrominoType | '' | '-';
export type TetrisBoard = TetrisBoardCell[][];
const cloneTetrisBoard = (board: TetrisBoard): TetrisBoard => board.map((line) => [...line]);
export const initialTetrisBoard = (): TetrisBoard => Array(BoardWidth).fill(null).map(() => Array(BoardHeight).fill(''));
export const putTetromino = (board: TetrisBoard, cursor: TetrisCursor): TetrisBoard => {
  const cor = getTetrisCor(cursor);
  const newBoard = cloneTetrisBoard(board);
  cor.forEach(([x, y]) => newBoard[x][y] = cursor.mino);
  return newBoard;
};

export const clearTetrisBoard = (board: TetrisBoard) => {
  const clearedBoard = cloneTetrisBoard(board);
  const dropedBoard = initialTetrisBoard();
  let clearCount = 0;
  const clearRowIndex: number[] = [];
  let dropIndex = 0;
  for (let y = 0; y < BoardHeight; y++) {
    if (xarray.every((x) => board[x][y])) {
      clearRowIndex.push(y);
      clearCount++;
      xarray.forEach((x) => clearedBoard[x][y] = '');
    } else {
      xarray.forEach((x) => dropedBoard[x][dropIndex] = board[x][y]);
      dropIndex++;
    }
  }
  return { clearCount, clearedBoard, dropedBoard, clearRowIndex }
};

/** デバッグ出力用 */
export const debugTetrisBoard = (board: TetrisBoard, title?: string) => {
  if (title) console.log(`title: ${title}`);
  const text = yarray.toReversed().map((y) => xarray.map((x) => board[x][y] || '.').join('')).join('\n');
  console.log(text);
};

/** 色情報なしのテトリスの盤面 */
export type MonoTetrisBoard = boolean[][];
export const createMonoTetrisBoard = (board: TetrisBoard) => board.map((v) => v.map((cell) => cell !== ''));

