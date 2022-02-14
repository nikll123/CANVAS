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

const RELATION_NONE = 0;     // no data
const RELATION_CROSS_1 = 1;   // one point cross
const RELATION_CROSS_2 = 2;   // two points cross
const RELATION_OUT = 3;      // out
const RELATION_IN = 4;       // in
const RELATION_CONTACT = 5;  // contact

// point position relatively to a vector
const LINEPNTPOS_NONE = 0;   
const LINEPNTPOS_ON = 1;
const LINEPNTPOS_LEFT = 2;   
const LINEPNTPOS_RIGHT = 3;

// point position relatively to a circle
const CIRCLEPNTPOS_NONE = 0;   
const CIRCLEPNTPOS_ON = 1;
const CIRCLEPNTPOS_IN = 2;   
const CIRCLEPNTPOS_OUT = 3;

// const ARCTYPE_NONE = 0;
// const ARCTYPE_ZERO = 1;
// const ARCTYPE_NORMAL = 2;
// const ARCTYPE_CIRCLE = 3;
// const ARCTYPE_SPIRAL = 4;

const ANGLETYPE_NONE = 0;
const ANGLETYPE_ZERO = 1;
const ANGLETYPE_NORMAL = 2;
const ANGLETYPE_DVA_PI = 3;
const ANGLETYPE_OVER = 4;

const STATUS = { NORMAL: 0, INVISIBLE: 1 };
const FORMAT = { LONG: 0, SHORT: 1 };
const AZIMUTH = { NONE: 0, N: 1, NE: 2, E: 3, ES: 4, S: 5, SW: 6, W: 7, WN: 8 };

let globalCCW = false;
let globalDebugMode = false;

