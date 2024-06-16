import { useEffect, useState } from 'react';
import { clearTetrisBoard, initialTetrisBoard, putTetromino } from '../domain/tetris/TetrisBoard';
import { TetrisCursor, TetrominoRotate, getDefaultCursor } from '../domain/tetris/TetrisCursor';
import { TetrisHandleKeyinput } from './TetrisHandleKeyinput';
import { TetrisBoardView } from './TetrisBoardView';
import { tetrominoOperation } from '../domain/tetris/TetrominoOperation';
import { useTetrisBag } from './useTetrisBag';
import { TetrominoType } from '../domain/tetris/Tetromino';
import { NextView } from './NextView';
import { HoldView } from './HoldView';
import { calcDropCandidate } from '../domain/tetris/advance/dropCandidate';
import { template__hachimitsu } from '../domain/tetris/template/hachimitsu_old';
import { createProcedureCorArray } from '../domain/tetris/advance/TetrisProcedure';
import { searchTetrisTemplate } from '../domain/tetris/template/searchTetrisTemplate';
import { templateHachimitsuLeft1, templateHachimitsuLeft2A } from '../domain/tetris/template/hachimitsu';

type Props = {};
export const TetrisGame = (props: Props) => {
  const {} = props;
  const [board, setBoard] = useState(initialTetrisBoard());
  const { bag, pickFromBag, resetBag, indexMino } = useTetrisBag();

  const [mino, setMino] = useState<TetrominoType>('I');
  useEffect(() => {
    updateCursor(getDefaultCursor(pickFromBag()));
  }, []);
  const [x, setX] = useState(4);
  const [y, setY] = useState(18);
  const [rotate, setRotate] = useState<TetrominoRotate>('T');
  const cur: TetrisCursor = { mino, x, y, rotate };

  const [hold, setHold] = useState<TetrominoType | null>(null);

  const updateCursor = (cursor: TetrisCursor) => {
    setMino(cursor.mino);
    setX(cursor.x);
    setY(cursor.y);
    setRotate(cursor.rotate);
  };

  const drop = () => {
    const dropedCursor = tetrominoOperation.dropDown(board, cur);
    setDebugCursorList([...debugCursorList, { ...dropedCursor }]);
    // board 更新
    const newBoard = putTetromino(board, dropedCursor);
    const { dropedBoard } = clearTetrisBoard(newBoard);
    setBoard(dropedBoard);
    // next 更新
    const next = pickFromBag();
    // cursor 更新
    updateCursor(getDefaultCursor(next));
  };

  const holdTetromino = () => {
    if (hold === null) {
      setHold(mino);
      const next = pickFromBag();
      updateCursor(getDefaultCursor(next));
    } else {
      setHold(mino);
      updateCursor(getDefaultCursor(hold));
    }
  };

  const reset = () => {
    const firstMino = resetBag();
    setBoard(initialTetrisBoard());
    setHold(null);
    updateCursor(getDefaultCursor(firstMino));
    setDebugCursorList([]);
  };

  const [debugCursorList, setDebugCursorList] = useState<TetrisCursor[]>([]);

  const [construction, setConstruction] = useState<{ mino: TetrominoType; cors: [x: number, y: number][] }[] | undefined>();
  useEffect(() => {
    if (indexMino > 7) {
      setConstruction(undefined);
    } else if (indexMino === 0 && hold === null) {
      const procedure = template__hachimitsu.first([mino, ...bag.filter((_, i) => i < 6)]);
      if (procedure) {
        setConstruction(createProcedureCorArray(initialTetrisBoard(), procedure));
      }
    }
  }, [indexMino, mino, bag, hold]);

  useEffect(() => {
    const templates = [templateHachimitsuLeft1, templateHachimitsuLeft2A];
    templates.forEach((template) => {
      const searchResult = searchTetrisTemplate(template, board, mino, hold, bag, indexMino);
      if (searchResult) {
        console.log({ name: template.name, result: searchResult.process.map((v) => (v.procedure === 'hold' ? 'hold' : v.procedure.mino)) });
      } else {
        console.log({ name: template.name, result: 'undefined' });
      }
    });
  }, [board]);

  return (
    <>
      <TetrisHandleKeyinput
        keyOperation={{
          arrowLeft: () => updateCursor(tetrominoOperation.moveLeft(board, cur)),
          arrowRight: () => updateCursor(tetrominoOperation.moveRight(board, cur)),
          arrowDown: () => updateCursor(tetrominoOperation.moveDown(board, cur)),
          arrowUp: () => drop(),
          z: () => updateCursor(tetrominoOperation.rotateLeft(board, cur)),
          x: () => updateCursor(tetrominoOperation.rotateRight(board, cur)),
          c: () => holdTetromino(),
          r: () => reset(),
        }}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ margin: '10px' }}>
            <div style={{ width: '100px' }}>カレントミノIndex: {indexMino}</div>
            <div style={{ padding: '10px', border: '3px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>HOLD</div>
              <HoldView hold={hold} />
            </div>
          </div>
          <div style={{ margin: '10px' }}>
            <TetrisBoardView board={board} cursor={cur} assist={construction} />
          </div>
          <div style={{ margin: '10px' }}>
            <NextView bag={bag} showNext={5} />
          </div>
          <div>
            <button onClick={() => console.log(calcDropCandidate(board, cur.mino))}>test</button>
            <button onClick={() => console.log(JSON.stringify(debugCursorList))}>test2</button>
          </div>
          <div>{construction ? JSON.stringify(construction) : ''}</div>
        </div>
      </TetrisHandleKeyinput>
      <button
        onClick={() => {
          console.log(searchTetrisTemplate(templateHachimitsuLeft1, board, mino, hold, bag, indexMino));
        }}
      >
        searchProcedure_DEBUG001
      </button>
    </>
  );
};
