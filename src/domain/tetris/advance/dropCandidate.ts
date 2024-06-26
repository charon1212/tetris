import { TetrisBoard, } from "../TetrisBoard";
import { TetrisCursor, getDefaultCursor, getTetrisCor } from "../TetrisCursor";
import { TetrominoType } from "../Tetromino";
import { TetrominoOperation, tetrominoOperation } from "../TetrominoOperation";
import { equalCor, equalCursor } from "../util";

type DropCandidateMove =
  | 'ml' // move left
  | 'mr' // move right
  | 'md' // move down
  | 'rl' // rotate left
  | 'rr'; // rotate right
export type DropCandidate = { cursor: TetrisCursor, moves: DropCandidateMove[], };

/** ハードドロップのみでおけるパターンを探索する */
export const calcHardDropCandidate = (board: TetrisBoard, mino: TetrominoType) => {
  return calcDropCandidateInner(board, mino, [
    { ope: tetrominoOperation.moveLeft, move: 'ml', },
    { ope: tetrominoOperation.moveRight, move: 'mr', },
    // { ope: tetrominoOperation.moveDown, move: 'md', },  ハードドロップのみにするため、ソフドロを削除。
    { ope: tetrominoOperation.rotateLeft, move: 'rl', },
    { ope: tetrominoOperation.rotateRight, move: 'rr', },
  ]);
};

export const calcDropCandidate = (board: TetrisBoard, mino: TetrominoType) => {
  return calcDropCandidateInner(board, mino, [
    { ope: tetrominoOperation.moveLeft, move: 'ml', },
    { ope: tetrominoOperation.moveRight, move: 'mr', },
    { ope: tetrominoOperation.moveDown, move: 'md', },
    { ope: tetrominoOperation.rotateLeft, move: 'rl', },
    { ope: tetrominoOperation.rotateRight, move: 'rr', },
  ]);
};

/** ある盤面で、あるミノの置き方（カーソル）が実現可能であることを確認する。 */
export const isPossibleCursor = (board: TetrisBoard, cursor: TetrisCursor) => calcDropCandidate(board, cursor.mino).some(({ dc }) => equalCursor(dc.cursor, cursor));

const calcDropCandidateInner = (board: TetrisBoard, mino: TetrominoType, operations: { ope: TetrominoOperation, move: DropCandidateMove }[],): { dc: DropCandidate, cashCor: [x: number, y: number][] }[] => {
  const array: { cursor: TetrisCursor, moves: DropCandidateMove[] }[] = [{ cursor: getDefaultCursor(mino), moves: [] }];
  const searched: TetrisCursor[] = [];
  const dropCandidateList: { dc: DropCandidate, cashCor: [x: number, y: number][] }[] = [];
  while (array.length > 0) {
    const top = array.shift();
    if (!top) break; // 到達不能コード。topがない場合おかしいので、ループ脱出。
    if (searched.some((cur) => equalCursor(top.cursor, cur))) continue; // 既に探索済みの場合、次の要素へ。
    searched.push(top.cursor);
    // 現在のカーソルから各種操作後の操作を、arrayに追加。
    operations.forEach(({ ope, move }) => {
      const newCursor = ope(board, top.cursor);
      if (!equalCursor(top.cursor, newCursor)) array.push({ cursor: newCursor, moves: [...top.moves, move] });
    });
    // 現在のカーソルからドロップした結果を登録。重複する場合は登録しない。
    const dropedCursor = tetrominoOperation.dropDown(board, top.cursor);
    const cor = getTetrisCor(dropedCursor);
    if (!dropCandidateList.some(({ cashCor }) => equalCor(cashCor, cor))) dropCandidateList.push({ dc: { cursor: dropedCursor, moves: top.moves }, cashCor: cor });
  }
  return dropCandidateList;
};
