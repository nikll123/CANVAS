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
const COMPARE_TOLERANCE = 10 ** -ROUND_DEC_DEFAULT;

const LEFT = -1;
const RIGHT = 1;

const CLOSEPATH = 0;

const RELATION_NONE = 0;
const RELATION_1CROSS = 1;
const RELATION_2CROSS = 2;
const RELATION_OUT = 3;
const RELATION_IN = 4;


const STATUS = { NORMAL: 0, INVISIBLE: 1 };
const FORMAT = { LONG: 0, SHORT: 1 };
const AZIMUTH = { NONE: 0, N: 1, NE: 2, E: 3, ES: 4, S: 5, SW: 6, W: 7, WN: 8 };

let globalCCW = false;
let globalDebugMode = false;

