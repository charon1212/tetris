import { TetrominoType, getTetrominoDefinition } from "./Tetromino";

/** 操作ミノの情報 */
export type TetrisCursor = {
  mino: TetrominoType;
  rotate: TetrominoRotate;
  x: number;
  y: number;
};
export const getDefaultCursor = (mino: TetrominoType): TetrisCursor => ({ mino, rotate: 'T', x: 4, y: 18 });
export type TetrominoRotate = 'T' | 'R' | 'D' | 'L';
export const rotateDefinition: { [key in TetrominoRotate]: { left: TetrominoRotate, right: TetrominoRotate } } = {
  T: { left: 'L', right: 'R' },
  R: { left: 'T', right: 'D' },
  D: { left: 'R', right: 'L' },
  L: { left: 'D', right: 'T' },
};

/**
 * テトリミノが占有しているセルの座標を取得する。
 */
export const getTetrisCor = (cur: TetrisCursor): [number, number][] => {
  const def = getTetrominoDefinition(cur.mino);
  const converter = createRotationalCorConverter(cur.rotate);
  return def.shape.map(([x, y]) => {
    const c = converter({ x, y });
    return [cur.x + c.x, cur.y + c.y];
  });
};

/**
 * 回転状況に応じた座標の変換。
 * 例えば、右に90度回転した場合、x方向のベクトルは-y方向に向き(-y'=x)、y方向のベクトルはx方向に向く(x'=y)。そのため、(x',y') = (y,-x)となる。
 * @param rotate 回転状態
 * @returns 座標変換関数 (x,y) => (x',y')
 */
const createRotationalCorConverter = (rotate: TetrominoRotate) => ({ x, y }: { x: number, y: number }): { x: number, y: number } => {
  if (rotate === 'T') return { x: x, y: y };
  if (rotate === 'R') return { x: y, y: -x };
  if (rotate === 'D') return { x: -x, y: -y };
  if (rotate === 'L') return { x: -y, y: x };
  throw new Error(`unknown rotate: ${rotate}`);
};
