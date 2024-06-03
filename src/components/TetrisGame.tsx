import { useEffect, useState } from 'react';
import { clearTetrisBoard, createMonoTetrisBoard, initialTetrisBoard, putTetromino } from '../domain/tetris/TetrisBoard';
import { TetrisCursor, TetrominoRotate, defaultCursor } from '../domain/tetris/TetrisCursor';
import { TetrisHandleKeyinput } from './TetrisHandleKeyinput';
import { TetrisBoardView } from './TetrisBoardView';
import { tetrominoOperation } from '../domain/tetris/TetrominoOperation';
import { useTetrisBag } from './useTetrisBag';
import { TetrominoType } from '../domain/tetris/Tetromino';
import { NextView } from './NextView';
import { HoldView } from './HoldView';

type Props = {};
export const TetrisGame = (props: Props) => {
  const {} = props;
  const [board, setBoard] = useState(initialTetrisBoard());
  const monoBoard = createMonoTetrisBoard(board);
  const { bag, pickFromBag } = useTetrisBag();

  const [mino, setMino] = useState<TetrominoType>('I');
  useEffect(() => {
    updateCursor(defaultCursor(pickFromBag()));
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
    const dropedCursor = tetrominoOperation.dropDown(monoBoard, cur);
    // board 更新
    const newBoard = putTetromino(board, dropedCursor);
    const { dropedBoard } = clearTetrisBoard(newBoard);
    setBoard(dropedBoard);
    // next 更新
    const next = pickFromBag();
    // cursor 更新
    updateCursor(defaultCursor(next));
  };

  const holdTetromino = () => {
    if (hold === null) {
      setHold(mino);
      const next = pickFromBag();
      updateCursor(defaultCursor(next));
    } else {
      setHold(mino);
      updateCursor(defaultCursor(hold));
    }
  };

  return (
    <>
      <TetrisHandleKeyinput
        keyOperation={{
          arrowLeft: () => updateCursor(tetrominoOperation.moveLeft(monoBoard, cur)),
          arrowRight: () => updateCursor(tetrominoOperation.moveRight(monoBoard, cur)),
          arrowDown: () => updateCursor(tetrominoOperation.moveDown(monoBoard, cur)),
          arrowUp: () => drop(),
          z: () => updateCursor(tetrominoOperation.rotateLeft(monoBoard, cur)),
          x: () => updateCursor(tetrominoOperation.rotateRight(monoBoard, cur)),
          c: () => holdTetromino(),
        }}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ margin: '10px' }}>
            <div>
              <HoldView hold={hold} />
            </div>
          </div>
          <div style={{ margin: '10px' }}>
            <TetrisBoardView board={board} cursor={cur} />
          </div>
          <div style={{ margin: '10px' }}>
            <NextView bag={bag} showNext={5} />
          </div>
        </div>
      </TetrisHandleKeyinput>
    </>
  );
};
