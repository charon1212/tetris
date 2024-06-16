export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export const getAllTetromino = (): TetrominoType[] => ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
export const isTetrominoType = (t: any): t is TetrominoType => ['I', 'O', 'T', 'S', 'Z', 'J', 'L'].includes(t);

/**
 * 各テトリミノの定義情報。
 * shape: 対象テトリミノの形を表す。デフォルト回転の時に、軸セルから見たx,y座標の組を示す。
 */
export type TetrominoDefinition = { type: TetrominoType, color: string, shape: [number, number][] };
export const tetrominoDefinitions: TetrominoDefinition[] = [
  { type: 'I', color: 'Cyan', shape: [[0, 0], [-1, 0], [1, 0], [2, 0],], },
  { type: 'O', color: 'Yellow', shape: [[0, 0], [1, 0], [1, 1], [0, 1],], },
  { type: 'T', color: 'Purple', shape: [[0, 0], [-1, 0], [0, 1], [1, 0],], },
  { type: 'S', color: 'Green', shape: [[-1, 0], [0, 0], [0, 1], [1, 1],], },
  { type: 'Z', color: 'Red', shape: [[-1, 1], [0, 1], [0, 0], [1, 0],], },
  { type: 'J', color: 'Blue', shape: [[-1, 1], [-1, 0], [0, 0], [1, 0],], },
  { type: 'L', color: 'Orange', shape: [[-1, 0], [0, 0], [1, 0], [1, 1],], },
];

export const getTetrominoDefinition = (type: TetrominoType) => {
  const def = tetrominoDefinitions.find((t) => t.type === type);
  if (!def) throw new Error(`無効なミノ種別[${type}]`);
  return def;
};

