import { TetrisBoard, putTetromino } from "../TetrisBoard";
import { TetrominoType, getAllTetromino } from "../Tetromino";
import { TetrisProcedureItem } from "../advance/TetrisProcedure";
import { DropCandidate, calcDropCandidate } from "../advance/dropCandidate";
import { equalCor } from "../util";
import { TetrisTemplate } from "./TetrisTemplate";

export const searchTetrisTemplate = (template: TetrisTemplate, board: TetrisBoard, current: TetrominoType, hold: TetrominoType | null, next: TetrominoType[], indexMino: number) => {
  if (!examTemplateInitialCondition(template, board, current, hold, next, indexMino)) return undefined;
  const firstNode: SearchNode = { board, current, hold, next, process: [], corMap: template.corMap };
  let array = [firstNode];
  const generations = [array];
  while (true) {
    array = createNextNodeGeneration(array);
    if (array.length === 0) return undefined;
    if (array.some((node) => node.corMap.length === 0)) break;
  }
  return array.find((node) => node.corMap.length === 0);
};

// x x x x x x x x x x x x x x x x x x x x
// x x x x x x x x Node探索 x x x x x x x x
// x x x x x x x x x x x x x x x x x x x x
type SearchNode = {
  board: TetrisBoard,
  current: TetrominoType,
  hold: TetrominoType | null,
  next: TetrominoType[],
  process: { procedure: TetrisProcedureItem, softDrop: boolean, tSpin: boolean, }[],
  corMap: { mino: TetrominoType, cors: [x: number, y: number][] }[],
};

/** 手順は異なるものの、最終的な盤面状況とnextが等しいノードであることを判定する。corMapが実質一緒ならOK。 */
const isSameNode = (node1: SearchNode, node2: SearchNode) => JSON.stringify(node1.corMap) === JSON.stringify(node2.corMap);

const createNextNodeGeneration = (nodeList: SearchNode[]): SearchNode[] => {
  let list: SearchNode[] = [];
  for (let sourceNode of nodeList) {
    for (let nextNode of createNextNodeList(sourceNode)) {
      const dupulicateNode = list.find((node) => isSameNode(node, nextNode));
      if (!dupulicateNode) {
        list.push(nextNode);
      } else if (getNodeProcessScore(dupulicateNode) < getNodeProcessScore(nextNode)) {
        list = list.filter((l) => l !== dupulicateNode);
        list.push(nextNode);
      }
    }
  }
  return list;
};

const createNextNodeList = (node: SearchNode): SearchNode[] => {
  const list: SearchNode[] = [];
  const { board, current, hold, next, process, corMap } = node;

  for (let corMapItem of corMap) {
    const { mino, cors } = corMapItem;
    if (mino === current || mino === (hold || next[0])) {
      const needHold = mino !== current;
      const dc = evalDropCandidate(board, mino, cors);
      if (dc) {
        const newBoard = putTetromino(board, dc.cursor);
        // TODO: tspin判定無し。
        const newProcess: SearchNode['process'] = needHold ?
          [...process, { procedure: 'hold', softDrop: false, tSpin: false }, { procedure: dc.cursor, softDrop: dc.moves.some((m) => m === 'md'), tSpin: false }]
          : [...process, { procedure: dc.cursor, softDrop: dc.moves.some((m) => m === 'md'), tSpin: false }];
        /**
         * 初期状態のhold有無とhold要否を元にした、次の要素。putは置くミノ。
         *                           [put]     [current]  [hold]
         * hold===null &&  needHold   next[0]   next[1]    current        HOLDなしでHOLDすると、currentがHOLDへ行き、next[0]をputして、next[1]がcurrentになる。
         * hold===null && !needHold   current   next[0]    null           HOLDなしでHOLDしないと、currentをputして、next[0]がcurrentになる。HOLDはnullのまま。
         * hold!==null &&  needHold   hold      next[0]    current        HOLDありでHOLDすると、currentがHOLDへ行き、holdをputして、next[0]がcurrentになる。
         * hold!==null && !needHold   current   next[0]    hold           HOLDありでHOLDしないと、currentをputして、next[0]がcurrentになる。HOLDはholdのまま。
         */
        const current2 = (needHold && (hold === null)) ? next[1] : next[0];
        const hold2 = needHold ? current : hold;
        const next2 = needHold && (hold === null) ? next.filter((_, i) => i > 1) : next.filter((_, i) => i > 0);
        list.push({ board: newBoard, current: current2, hold: hold2, next: next2, process: newProcess, corMap: corMap.filter((v) => v !== corMapItem), });
      }
    }
  }
  return list;
};

const evalDropCandidate = (board: TetrisBoard, mino: TetrominoType, cors: [x: number, y: number][]): DropCandidate | undefined => {
  const dropCandidateList = calcDropCandidate(board, mino);
  for (let { dc, cashCor } of dropCandidateList) {
    if (equalCor(cashCor, cors)) {
      return dc;
    }
  }
  return undefined;
};

/** Proceessの評価点。高いほど良い。holdは-1点/回、T-SPINは200点/回、ソフドロは-60点/回でいったん計算。 */
const getNodeProcessScore = (node: SearchNode) => {
  let score = 0;
  for (let processItem of node.process) {
    if (processItem.procedure === 'hold') score -= 1;
    if (processItem.softDrop) score -= 60;
    if (processItem.tSpin) score += 200;
  }
  return score;
};

// x x x x x x x x x x x x x x x x x x x x x x x x
// x x x x x x x x 初期条件チェック x x x x x x x x
// x x x x x x x x x x x x x x x x x x x x x x x x

const examTemplateInitialCondition = (template: TetrisTemplate, board: TetrisBoard, current: TetrominoType, hold: TetrominoType | null, next: TetrominoType[], indexMino: number,): boolean => {
  /** putcount チェック */
  if (template.initialCondition.putCount) {
    if (hold && ((indexMino - (hold ? 1 : 0)) % 35) !== template.initialCondition.putCount) return false;
  }
  const tetrominoArray = getAllTetromino();
  /** current/hold/next チェック */
  const minoCounter: { [key in TetrominoType]: number } = { I: 0, O: 0, T: 0, S: 0, Z: 0, J: 0, L: 0 };
  tetrominoArray.forEach((mino) => {
    minoCounter[mino] = template.corMap.filter((v) => v.mino === mino).length;
  });
  minoCounter[current] -= 1;
  if (hold) minoCounter[hold] -= 1;
  for (let n of next) { // nextを1個ずつ見ていってminoCounterを減らしていき、すべてがぴったり0になればOK。
    if (tetrominoArray.some((mino) => minoCounter[mino] < 0)) return false;
    if (tetrominoArray.every((mino) => minoCounter[mino] === 0)) break;
    minoCounter[n] -= 1;
  }
  if (!tetrominoArray.every((mino) => minoCounter[mino] === 0)) return false;
  return true;
};
