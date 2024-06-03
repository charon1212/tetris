import { TetrisBoard, TetrisBoardCell, boardInside, createMonoTetrisBoard } from '../domain/tetris/TetrisBoard';
import { TetrisCursor, getTetrisCor } from '../domain/tetris/TetrisCursor';
import { getTetrominoDefinition } from '../domain/tetris/Tetromino';
import { tetrominoOperation } from '../domain/tetris/TetrominoOperation';

type Props = {
  board: TetrisBoard;
  cursor: TetrisCursor;
};
export const TetrisBoardView = (props: Props) => {
  const { board, cursor } = props;

  const currentCor = getTetrisCor(cursor);
  const ghostCor = getTetrisCor(tetrominoOperation.dropDown(createMonoTetrisBoard(board), cursor));
  const colorBoard: { backgroundColor: string; opacity: number }[][] = board.map((_, x) =>
    board[0].map((__, y) => ({ backgroundColor: getColor(board[x][y]), opacity: 1 }))
  );
  // カレントミノ描画
  currentCor.forEach(([x, y]) => {
    if (boardInside(x, y) && !colorBoard[x][y].backgroundColor) colorBoard[x][y].backgroundColor = getColor(cursor.mino);
  });
  // ゴースト描画
  ghostCor.forEach(([x, y]) => {
    if (boardInside(x, y) && !colorBoard[x][y].backgroundColor) {
      colorBoard[x][y].backgroundColor = getColor(cursor.mino);
      colorBoard[x][y].opacity = 0.5;
    }
  });

  return (
    <>
      <div style={{ display: 'flex' }}>
        {colorBoard.map((line) => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {line.toReversed().map(({ backgroundColor, opacity }) => (
              <div style={{ height: '20px', width: '20px', border: '1px solid black', backgroundColor, opacity }}></div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

const getColor = (cell: TetrisBoardCell) => {
  if (cell === '') return '';
  if (cell === '-') return 'lightgray';
  return getTetrominoDefinition(cell).color;
};
