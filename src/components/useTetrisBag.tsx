import { useState } from 'react';
import { TetrominoType } from '../domain/tetris/Tetromino';

const bagSize = 20;
export const useTetrisBag = () => {
  const [bag, setBag] = useState<TetrominoType[]>(addBag([], bagSize));

  const pickFromBag = () => {
    const newBag = [...bag];
    const picked = newBag.shift();
    setBag(addBag(newBag, bagSize));
    return picked!;
  };
  const resetBag = () => {
    const newBag = addBag([], bagSize);
    const picked = newBag.shift();
    setBag(newBag);
    return picked!;
  };

  return { bag, pickFromBag, resetBag };
};

/** バッグの中身がn個以上となるまで充填する。 */
const addBag = (bag: TetrominoType[], n: number): TetrominoType[] => {
  while (bag.length < n) bag = [...bag, ...randomSet()];
  return bag;
};

const randomSet = (): TetrominoType[] => shuffleArray(['I', 'O', 'T', 'S', 'Z', 'J', 'L']);

const shuffleArray = <T extends any>(arr: T[]): T[] => {
  if (arr.length === 0) return arr;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
