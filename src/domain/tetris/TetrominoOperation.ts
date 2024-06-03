import { MonoTetrisBoard, boardInside } from "./TetrisBoard";
import { TetrisCursor, TetrominoRotate, getTetrisCor, rotateDefinition } from "./TetrisCursor";
import { TetrominoType } from "./Tetromino";

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
const rotateLeft: TetrominoOperation = (board, cur) => srs(board, cur, false) ?? cur;
/** テトリミノを右回転する */
const rotateRight: TetrominoOperation = (board, cur) => srs(board, cur, true) ?? cur;

export const tetrominoOperation = { moveLeft, moveRight, moveDown, dropDown, rotateLeft, rotateRight, };

/**
 * ある盤面で、カーソルをテストする。
 * @returns カーソルがOKな場合（有効な移動である）、カーソルを返却する。そうでない場合、undefinedを返却する。
 */
const examNewCursor = (board: MonoTetrisBoard, newCursor: TetrisCursor): TetrisCursor | undefined => {
  return getTetrisCor(newCursor).some(([x, y]) => !boardInside(x, y) || board[x][y]) ? undefined : newCursor;
};

/**
 * SRS: Super Rotation System
 * テトリミノの自然な挙動のため、回転動作が本来はできない時も軸座標を調整することで回転を実行する仕様。
 * @param 盤面情報
 * @param cursor 開店前のカーソル
 * @param rotateRight 右回転の場合はtrue、左回転の場合はfalse
 * @returns SRSの範囲で回転可能な場合、その回転後のカーソル。回転不可の場合、undefined。
 */
const srs = (board: MonoTetrisBoard, cursor: TetrisCursor, rotateRight: boolean): TetrisCursor | undefined => {

  if (cursor.mino === 'O') return cursor; // 回転が起こらないOミノは考えないこととする。

  const afterRotate = rotateRight ? rotateDefinition[cursor.rotate].right : rotateDefinition[cursor.rotate].left;
  const srsCorrectionList = getSrsCorrectionList(cursor.mino);
  const srsCorrection = rotateRight ? srsCorrectionList[cursor.rotate].right : srsCorrectionList[cursor.rotate].left;
  for (let [xCorr, yCorr] of srsCorrection) {
    // SRSのCorrection(補正)を配列の順に試していき、examに合格したものが登場した場合、その場で早期リターンする。
    const newCursor = examNewCursor(board, { ...cursor, rotate: afterRotate, x: cursor.x + xCorr, y: cursor.y + yCorr, });
    if (newCursor) return newCursor;
  }
  return undefined;
};

type SRSCorrection = [x: number, y: number][];
type SRSCorrectionList = { [rotate in TetrominoRotate]: { left: SRSCorrection, right: SRSCorrection } };
// <https://tetrisch.github.io/main/srs.html>
const srsCorrectionListDefault: SRSCorrectionList = {
  T: { left: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2],], right: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2],], },
  R: { left: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2],], right: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2],], },
  D: { left: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2],], right: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2],], },
  L: { left: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2],], right: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2],], },
};
const srsCorrectionListI: SRSCorrectionList = {
  T: { left: [[0, -1], [-1, -1], [2, -1], [-1, 1], [2, -2],], right: [[1, 0], [-1, 0], [2, 0], [-1, -1], [2, 2],], },
  R: { left: [[-1, 0], [1, 0], [-2, 0], [1, 1], [-2, -2],], right: [[0, -1], [-1, -1], [1, -1], [-1, 1], [1, -2],], },
  D: { left: [[0, 1], [1, 1], [-2, 1], [1, -1], [-2, 2],], right: [[-1, 0], [1, 0], [-2, 0], [1, 1], [-2, -2],], },
  L: { left: [[1, 0], [2, 0], [-1, 0], [-1, -1], [2, 2],], right: [[0, 1], [-2, 1], [1, 1], [1, -1], [-2, 2],], },
};
const getSrsCorrectionList = (mino: TetrominoType): SRSCorrectionList => {
  return mino === 'I' ? srsCorrectionListI : srsCorrectionListDefault;
};
