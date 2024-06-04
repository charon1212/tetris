import { TetrisCursor } from "./TetrisCursor";

export const equalCursor = (c1: TetrisCursor, c2: TetrisCursor) => c1.x === c2.x && c1.y === c2.y && c1.rotate === c2.rotate;
export const equalCor = (c1: [x: number, y: number][], c2: [x: number, y: number][]) => c1.every(([x1, y1]) => c2.some(([x2, y2]) => x1 === x2 && y1 === y2));
