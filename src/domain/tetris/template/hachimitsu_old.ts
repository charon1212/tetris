import { TetrisCursor } from "../TetrisCursor";
import { TetrominoType } from "../Tetromino";
import { TetrisProcedure } from "../advance/TetrisProcedure";


const HACHIMITSU_1_leftConstruction: TetrisCursor[] = [
  { mino: 'I', x: 1, y: 0, rotate: 'T' },
  { mino: 'O', x: 8, y: 0, rotate: 'T' },
  { mino: 'T', x: 7, y: 1, rotate: 'L' },
  { mino: 'S', x: 1, y: 2, rotate: 'T' },
  { mino: 'Z', x: 5, y: 0, rotate: 'T' },
  { mino: 'J', x: 9, y: 3, rotate: 'L' },
  { mino: 'L', x: 1, y: 1, rotate: 'T' },
];
const HACHIMITSU_1_rightConstruction: TetrisCursor[] = [
  { mino: 'I', x: 7, y: 0, rotate: 'T' },
  { mino: 'O', x: 0, y: 0, rotate: 'T' },
  { mino: 'T', x: 2, y: 1, rotate: 'R' },
  { mino: 'S', x: 4, y: 0, rotate: 'T' },
  { mino: 'Z', x: 8, y: 2, rotate: 'T' },
  { mino: 'J', x: 8, y: 1, rotate: 'T' },
  { mino: 'L', x: 0, y: 3, rotate: 'R' },
];

/**
 * :: memo ::
 * - 1巡目
 * 左組の場合で、HOLDによる順序変更を加味して、以下の条件を満たす場合は組める。
 *   I > L > S && O > J
 */
const first = (next: TetrominoType[]): TetrisProcedure | undefined => {
  const leftConstructTetrominoHoldProcedure = testConditionsWithHold(next, [{ before: 'I', after: 'L' }, { before: 'L', after: 'S' }, { before: 'O', after: 'J' }]);
  if (leftConstructTetrominoHoldProcedure) { // 左組みができる場合
    return leftConstructTetrominoHoldProcedure.map((v) => v === 'hold' ? 'hold' : HACHIMITSU_1_leftConstruction.find(({ mino }) => mino === v)!);
  }
  const rightConstructTetrominoHoldProcedure = testConditionsWithHold(next, [{ before: 'I', after: 'J' }, { before: 'J', after: 'Z' }, { before: 'O', after: 'L' }]);
  if (rightConstructTetrominoHoldProcedure) { // 右組みができる場合
    return rightConstructTetrominoHoldProcedure.map((v) => v === 'hold' ? 'hold' : HACHIMITSU_1_rightConstruction.find(({ mino }) => mino === v)!);
  }
  return undefined;
};

type TetrominoHoldProcedure = (TetrominoType | 'hold')[]
type Condition = { before: TetrominoType, after: TetrominoType };
/**
 * HOLDを利用したミノ順の変更を加味して、特定のBag(テトリミノの列)がいくつかの条件(condition)を満たすことが可能かテストする。
 */
const testConditionsWithHold = (bag: TetrominoType[], condition: Condition[],): TetrominoHoldProcedure | undefined => {
  return rec([], bag, null, condition);
};

/**
 * 再帰的にHOLDを使って指定した条件を満たすミノ順を探索する。1つ見つけたらそれを返却する。
 * 関数内では、determinedにpushするときに、afterをpushする場合、beforeがちゃんと入ってることを確認する。
 * @param determined 既に順番を確定させたミノの配列。この中の配列は全て、conditionを満たしていること。初期実行は空配列を指定。
 * @param rest まだdeterminedに入れてない、順番未確定のミノ。
 * @param hold ホールド中のミノ。ない場合はnull。
 * @param condition 「IミノはLミノより前」のような条件。
 * @returns 指定した条件を満たすミノ順をHOLDの範囲内で実現できる場合、そのミノ順。そうでなければundefined。実装上、最もHOLDが少ない手順（同数の場合、HOLDの実行がより遅い順）を返却する。
 */
const rec = (determined: TetrominoHoldProcedure, rest: TetrominoType[], hold: TetrominoType | null, condition: Condition[],): TetrominoHoldProcedure | undefined => {
  // 残りがない場合、hold(有れば)をいれて返却。
  if (rest.length === 0) return hold ? [...determined, 'hold', hold] : [...determined];
  // restから一つとる。
  const newRest = [...rest];
  const top = newRest.shift()!;

  // HOLDしない場合
  if (condition.filter(({ after }) => after === top).every(({ before }) => determined.some((mino) => mino === before))) {
    const result = rec([...determined, top], newRest, hold, condition);
    if (result) return result;
  }
  // HOLDする場合
  if (hold) {
    if (determined.length > 0 && determined[determined.length - 1] === 'hold') return undefined; // hold → hold の場合、無意味な探索なので早期return。
    if (!condition.filter(({ after }) => after === hold).every(({ before }) => determined.some((mino) => mino === before))) return undefined; // holdミノが使えない（条件を満たしてない）
    return rec([...determined, 'hold', hold], newRest, top, condition);
  } else {
    return rec([...determined, 'hold'], newRest, top, condition);
  }
};

export const template__hachimitsu = { first };
