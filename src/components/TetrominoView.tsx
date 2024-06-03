import { TetrominoType, getTetrominoDefinition } from '../domain/tetris/Tetromino';

type Props = {
  mino: TetrominoType;
  size: number;
};
const array4 = Array(4).fill(null);
export const TetrominoView = (props: Props) => {
  const { mino, size } = props;
  const definition = getTetrominoDefinition(mino);
  const colorArray = array4.map(() => array4.map(() => ''));
  definition.shape.forEach(([x, y]) => {
    colorArray[x + 1][y + 1] = definition.color;
  });
  return (
    <div style={{ display: 'flex' }}>
      {colorArray.map((line) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {line.toReversed().map((cell) => (
            <div style={{ width: `${size}px`, height: `${size}px`, border: 'none', backgroundColor: cell }}></div>
          ))}
        </div>
      ))}
    </div>
  );
};
