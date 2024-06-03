import { useEffect, useRef, useState } from 'react';

type KeyOperation = {
  arrowLeft?: () => void;
  arrowRight?: () => void;
  arrowUp?: () => void;
  arrowDown?: () => void;
  z?: () => void;
  x?: () => void;
  c?: () => void;
};
type Props = { children?: React.ReactNode; keyOperation: KeyOperation };
export const TetrisHandleKeyinput = (props: Props) => {
  const { children, keyOperation } = props;

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const operation = getOperation(e.key, keyOperation);
    if (operation) operation.f();
  };

  return (
    // tabIndexがないと、divをフォーカスできない。styleにoutline:'none'がないと、フォーカス時に黒線が出る。
    <div tabIndex={0} onKeyDown={onKeyDown} style={{ outline: 'none' }}>
      {children || ''}
    </div>
  );
};

const getOperation = (key: string, keyOperation: KeyOperation): { f: () => void; repeat: boolean } | undefined => {
  key = key.toLowerCase();
  if (key === 'arrowleft' && keyOperation.arrowLeft) return { f: keyOperation.arrowLeft, repeat: true };
  if (key === 'arrowright' && keyOperation.arrowRight) return { f: keyOperation.arrowRight, repeat: true };
  if (key === 'arrowup' && keyOperation.arrowUp) return { f: keyOperation.arrowUp, repeat: false };
  if (key === 'arrowdown' && keyOperation.arrowDown) return { f: keyOperation.arrowDown, repeat: true };
  if (key === 'z' && keyOperation.z) return { f: keyOperation.z, repeat: true };
  if (key === 'x' && keyOperation.x) return { f: keyOperation.x, repeat: true };
  if (key === 'c' && keyOperation.c) return { f: keyOperation.c, repeat: false };
};
