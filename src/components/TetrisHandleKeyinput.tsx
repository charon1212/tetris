import { useEffect, useRef } from 'react';

type KeyOperation = {
  arrowLeft?: () => void;
  arrowRight?: () => void;
  arrowUp?: () => void;
  arrowDown?: () => void;
  z?: () => void;
  x?: () => void;
  c?: () => void;
  r?: () => void;
};
type Props = { children?: React.ReactNode; keyOperation: KeyOperation };
export const TetrisHandleKeyinput = (props: Props) => {
  const { children, keyOperation } = props;

  const divRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    divRef.current?.focus();
  }, [divRef]);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const operation = getOperation(e.key, keyOperation);
    operation?.();
  };

  return (
    // tabIndexがないと、divをフォーカスできない。styleにoutline:'none'がないと、フォーカス時に黒線が出る。
    <div ref={divRef} tabIndex={0} onKeyDown={onKeyDown} style={{ outline: 'none' }}>
      {children || ''}
    </div>
  );
};

const getOperation = (key: string, keyOperation: KeyOperation): (() => void) | undefined => {
  key = key.toLowerCase();
  if (key === 'arrowleft' && keyOperation.arrowLeft) return keyOperation.arrowLeft;
  if (key === 'arrowright' && keyOperation.arrowRight) return keyOperation.arrowRight;
  if (key === 'arrowup' && keyOperation.arrowUp) return keyOperation.arrowUp;
  if (key === 'arrowdown' && keyOperation.arrowDown) return keyOperation.arrowDown;
  if (key === 'z' && keyOperation.z) return keyOperation.z;
  if (key === 'x' && keyOperation.x) return keyOperation.x;
  if (key === 'c' && keyOperation.c) return keyOperation.c;
  if (key === 'r' && keyOperation.r) return keyOperation.r;
};
