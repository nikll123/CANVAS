let MouseTouchTracker = function (canvas, callback) {

  function processEvent(evt) {
    let rect = canvas.getBoundingClientRect();
    let offsetTop = rect.top;
    let offsetLeft = rect.left;

    if (evt.touches) { // tablet, smartphone
      return {
        x: evt.touches[0].clientX - offsetLeft,
        y: evt.touches[0].clientY - offsetTop
      }
    } else {
      return {
        x: evt.clientX - offsetLeft,
        y: evt.clientY - offsetTop
      }
    }
  }

  function onDown(evt) {
    evt.preventDefault();
    let coords = processEvent(evt);
    callback('down', coords.x, coords.y);
  }

  function onUp(evt) {
    evt.preventDefault();
    callback('up');
  }

  function onMove(evt) {
    evt.preventDefault();
    let coords = processEvent(evt);
    callback('move', coords.x, coords.y);
  }

  canvas.ontouchmove = onMove;
  canvas.onmousemove = onMove;

  canvas.ontouchstart = onDown;
  canvas.onmousedown = onDown;
  canvas.ontouchend = onUp;
  canvas.onmouseup = onUp;
}

let beginMoveX = 0;
let beginMoveY = 0;
let mouseCurX = 0;
let mouseCurY = 0;

function getMouseTouchTracker() {
  let mtt = new MouseTouchTracker(document.getElementById('canvas'),
    function (evtType, x, y) {                         // callback 
      mouseCurX = x;
      mouseCurY = y;
      switch (evtType) {
        case 'down':
          beginMoveX = x;
          beginMoveY = y;
          cclCmb1.startDrugIfPointIsInside(ctx, x, y);
          break;

        case 'up':
          cclCmb1.stopDrag();
          break;

        case 'move':
          let dx = x - beginMoveX;
          let dy = y - beginMoveY;
          beginMoveX = x;
          beginMoveY = y;

          cclCmb1.moveIfDragging(dx, dy);
          break;
      }
    }
  );
}