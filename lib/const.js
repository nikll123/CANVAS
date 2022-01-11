// global const values
const DEFAULT_COLOR = '#888888';
const DEFAULT_COLOR_LIGHT = '#BBBBBB';
const DRAFT_COLOR = '#555555';
const PI = Math.PI;
const DVA_PI = 2 * PI;
const CCW = true;
const CW = false;
const DRAFT = true;
const DRAFT_LINE_PATTERN_1 = [1, 1];
const DRAFT_LINE_PATTERN_2 = [2, 2];
const DRAFT_LINE_PATTERN_3 = [3, 3];
const DRAFT_LINE_PATTERN_5 = [5, 5];
const DO_CLOSE = true;
const DO_NOT_CLOSE = false;
const ROUND_DEC_DEFAULT = 8;
const COMPARE_TOLERANCE = 10**-ROUND_DEC_DEFAULT;

const STATUS = { NORMAL: 0, INVISIBLE: 1 };
const FORMAT = { LONG: 0, SHORT: 1 };


let globalCCW = false;
let globalDebugMode = false;

