import { BoardHeight, TetrisBoard, clearTetrisBoard, putTetromino } from "../TetrisBoard";
import { TetrisCursor, getTetrisCor } from "../TetrisCursor";
import { TetrominoType } from "../Tetromino";

/** ある盤面からの「手順」に関する型。それのvisualize関連をまとめる。 */
export type TetrisProcedure = TetrisProcedureItem[];
export type TetrisProcedureItem = ('hold' | TetrisCursor);
export const getTetrisProcedureExceptHold = (procedure: TetrisProcedure): TetrisCursor[] => procedure.filter((v): v is TetrisCursor => typeof v !== 'string');

/** 現盤面のどの位置にどのミノを配置するか、可視化するための座標配列を生成する。 */
export const createProcedureCorArray = (start: TetrisBoard, procedure: TetrisProcedure,): { mino: TetrominoType, cors: [x: number, y: number][] }[] => {
  const result: { mino: TetrominoType, cors: [x: number, y: number][] }[] = [];
  let originalYIndex = Array(BoardHeight).fill(null).map((_, y) => y);
  let currentBoard = start;
  for (let cursor of getTetrisProcedureExceptHold(procedure)) {
    result.push({ mino: cursor.mino, cors: getTetrisCor(cursor).map(([x, y]) => [x, originalYIndex[y]]) });
    const putBoard = putTetromino(currentBoard, cursor);
    const { clearRowIndex, dropedBoard } = clearTetrisBoard(putBoard);
    currentBoard = dropedBoard;
    originalYIndex = originalYIndex.filter((_, i) => !clearRowIndex.includes(i));
    while (originalYIndex.length < BoardHeight) originalYIndex.push(originalYIndex[originalYIndex.length - 1] + 1);
  }
  return result;
};
