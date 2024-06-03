import { MonoTetrisBoard, boardInside } from "./TetrisBoard";
import { TetrisCursor, getTetrisCor, rotateDefinition } from "./TetrisCursor";

export type TetrominoOperation = (board: MonoTetrisBoard, cur: TetrisCursor) => TetrisCursor;

/** テトリミノを1つ左に移動する */
const moveLeft: TetrominoOperation = (board, cur) => examNewCursor(board, { ...cur, x: cur.x - 1 }) ?? cur;
/** テトリミノを1つ右に移動する */
const moveRight: TetrominoOperation = (board, cur) => examNewCursor(board, { ...cur, x: cur.x + 1 }) ?? cur;
/** テトリミノを1つ下に移動する */
const moveDown: TetrominoOperation = (board, cur) => examNewCursor(board, { ...cur, y: cur.y - 1 }) ?? cur;
/** テトリミノを落下する */
const dropDown: TetrominoOperation = (board, cur) => {
  const newCursor = examNewCursor(board, { ...cur, y: cur.y - 1 });
  return newCursor ? dropDown(board, newCursor) : cur; // 再帰的に評価して、NG判定が起きるまで落下させる。
};
/** テトリミノを左回転する */
const rotateLeft: TetrominoOperation = (board, cur) => examNewCursor(board, { ...cur, rotate: rotateDefinition[cur.rotate].left }) ?? cur;
/** テトリミノを右回転する */
const rotateRight: TetrominoOperation = (board, cur) => examNewCursor(board, { ...cur, rotate: rotateDefinition[cur.rotate].right }) ?? cur;

export const tetrominoOperation = { moveLeft, moveRight, moveDown, dropDown, rotateLeft, rotateRight, };

/**
 * ある盤面で、カーソルをテストする。
 * @returns カーソルがOKな場合（有効な移動である）、カーソルを返却する。そうでない場合、undefinedを返却する。
 */
const examNewCursor = (board: MonoTetrisBoard, newCursor: TetrisCursor): TetrisCursor | undefined => {
  return getTetrisCor(newCursor).some(([x, y]) => !boardInside(x, y) || board[x][y]) ? undefined : newCursor;
};
