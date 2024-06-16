import { createTetrisTemplateFromString } from "./TetrisTemplate";

export const templateHachimitsuLeft1 = createTetrisTemplateFromString({
  name: 'はちみつ砲左組1',
  templateString: `
.........J
.SS......J
SSL....TJJ
LLL.ZZTTOO
IIII.ZZTOO
`});

export const templateHachimitsuLeft2A = createTetrisTemplateFromString({
  name: 'はちみつ砲左組2A',
  templateString: `
IJJJ......
IOOJ..LS..
IOO...LSSx
IxxTZZLLSx
xxxTTZZxxx
xxxTxxxxxx
xxxx.xxxxx
`});
