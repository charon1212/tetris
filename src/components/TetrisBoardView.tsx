import { TetrisBoard, TetrisBoardCell, boardInside, createMonoTetrisBoard } from '../domain/tetris/TetrisBoard';
import { TetrisCursor, getTetrisCor } from '../domain/tetris/TetrisCursor';
import { TetrominoType, getTetrominoDefinition } from '../domain/tetris/Tetromino';
import { tetrominoOperation } from '../domain/tetris/TetrominoOperation';

type Props = {
  board: TetrisBoard;
  cursor: TetrisCursor;
  assist?: { mino: TetrominoType; cors: [x: number, y: number][] }[];
};
export const TetrisBoardView = (props: Props) => {
  const { board, cursor, assist } = props;

  const currentCor = getTetrisCor(cursor);
  const ghostCor = getTetrisCor(tetrominoOperation.dropDown(createMonoTetrisBoard(board), cursor));
  const colorBoard: { backgroundColor: string; opacity: number }[][] = board.map((_, x) =>
    board[0].map((__, y) => ({ backgroundColor: getColor(board[x][y]), opacity: 1 }))
  );

  const table: Cell[][] = board.map((_, x) => board[0].map((__, y) => ({ block: board[x][y] || undefined })));
  // カレントミノ描画
  currentCor.forEach(([x, y]) => {
    if (boardInside(x, y)) table[x][y].current = cursor.mino;
  });
  // ゴースト描画
  ghostCor.forEach(([x, y]) => {
    if (boardInside(x, y)) table[x][y].ghost = cursor.mino;
  });
  // アシスト描画
  assist?.forEach(({ mino, cors }) => {
    cors.forEach(([x, y]) => {
      table[x][y].assist = mino;
    });
  });

  // カレントミノ描画
  currentCor.forEach(([x, y]) => {
    if (boardInside(x, y) && !colorBoard[x][y].backgroundColor) colorBoard[x][y].backgroundColor = getColor(cursor.mino);
  });
  // ゴースト描画
  ghostCor.forEach(([x, y]) => {
    if (boardInside(x, y) && !colorBoard[x][y].backgroundColor) {
      colorBoard[x][y].backgroundColor = getColor(cursor.mino);
      colorBoard[x][y].opacity = 0.3;
    }
  });

  return (
    <>
      <div style={{ display: 'flex' }}>
        {table.map((line) => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {line.toReversed().map((cell) => (
              <TetrisBoardViewCell cell={cell} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

type Cell = { block?: TetrisBoardCell; current?: TetrominoType; ghost?: TetrominoType; assist?: TetrominoType };
const TetrisBoardViewCell = ({ cell }: { cell: Cell }) => {
  const { block, current, ghost, assist } = cell;
  if (block) return <div style={{ height: '20px', width: '20px', border: '1px solid black', backgroundColor: getColor(block) }}></div>;
  if (current) return <div style={{ height: '20px', width: '20px', border: '1px solid black', backgroundColor: getColor(current) }}></div>;
  if (ghost) return <div style={{ height: '20px', width: '20px', border: '1px solid black', backgroundColor: getColor(ghost), opacity: 0.3 }}></div>;
  if (assist)
    return (
      <div style={{ height: '20px', width: '20px', border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ height: '6px', width: '6px', border: `3px inset ${getColor(assist)}` }}></div>
      </div>
    );
  return <div style={{ height: '20px', width: '20px', border: '1px solid black' }}></div>;
};

const getColor = (cell: TetrisBoardCell) => {
  if (cell === '') return '';
  if (cell === '-') return 'lightgray';
  return getTetrominoDefinition(cell).color;
};
