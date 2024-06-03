import { TetrominoType } from '../domain/tetris/Tetromino';
import { TetrominoView } from './TetrominoView';

type Props = { hold: TetrominoType | null };
export const HoldView = (props: Props) => {
  const { hold } = props;
  return (
    <>
      <div style={{ width: 40, height: 30 }}>{hold === null ? '' : <TetrominoView size={10} mino={hold} />}</div>
    </>
  );
};
