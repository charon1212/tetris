import { TetrominoType } from '../domain/tetris/Tetromino';
import { TetrominoView } from './TetrominoView';

type Props = { bag: TetrominoType[]; showNext: number };
export const NextView = (props: Props) => {
  const { bag, showNext } = props;
  const nextList: TetrominoType[] = bag.filter((_, i) => i < showNext);
  return (
    <>
      <div>
        {nextList.map((mino) => (
          <TetrominoView size={10} mino={mino} />
        ))}
      </div>
    </>
  );
};
