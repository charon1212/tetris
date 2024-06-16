import { TetrisBoard, initialTetrisBoard } from "../TetrisBoard";
import { TetrominoType } from "../Tetromino";

export type TetrisTemplate = {
  name: string,
  /** 初期条件 */
  initialCondition: {
    /** 何個置いたときの状態か */
    putCount?: number,
    /** 初期状態の盤面判定 */
    board: TetrisBoard,
  },
  /** 各ミノの置き場所 */
  corMap: {
    mino: TetrominoType;
    cors: [x: number, y: number][];
  }[];
  /** 手順完成後に必要なTSpinの数 */
  needTSpin: number,
};

export type CreateTemplateArgs = { name: string, templateString: string, needTSpin?: number, };
export const createTetrisTemplateFromString = (args: CreateTemplateArgs): TetrisTemplate => {
  const { name, templateString, needTSpin } = args;
  const { initialBoard, corMap } = translateTemplateString(templateString);
  return {
    name, corMap, needTSpin: needTSpin ?? 0,
    initialCondition: {
      board: initialBoard,
      putCount: 0,
    },
  };
};

const translateTemplateString = (templateString: String) => {
  const initialBoard = initialTetrisBoard();
  const corMap: { mino: TetrominoType, cors: [x: number, y: number][] }[] = [];
  const corMapTemp: { [key: string]: [x: number, y: number][] } = {};
  let y = 0;
  for (let line of templateString.split('\n').reverse()) {
    if (!line) continue;
    for (let x = 0; x < line.length; x++) {
      if (line[x] === '.') continue;
      if (line[x] === 'x') {
        initialBoard[x][y] = '-';
      } else {
        if (corMapTemp[line[x]]) corMapTemp[line[x]].push([x, y]);
        else corMapTemp[line[x]] = [[x, y]];
      }
    }
    y++;
  }
  for (let [key, cors] of Object.entries(corMapTemp)) {
    if (key === 'I' || key === 'i') corMap.push({ mino: 'I', cors });
    if (key === 'O' || key === 'o') corMap.push({ mino: 'O', cors });
    if (key === 'T' || key === 't') corMap.push({ mino: 'T', cors });
    if (key === 'S' || key === 's') corMap.push({ mino: 'S', cors });
    if (key === 'Z' || key === 'z') corMap.push({ mino: 'Z', cors });
    if (key === 'J' || key === 'j') corMap.push({ mino: 'J', cors });
    if (key === 'L' || key === 'l') corMap.push({ mino: 'L', cors });
  }
  return { initialBoard, corMap };
};
