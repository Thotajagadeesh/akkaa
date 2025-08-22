// ======================
// 🎉 Birthday Animation
// ======================

var S = {
  init: function () {
    var action = window.location.href,
        i = action.indexOf('?a=');

    S.Drawing.init('.canvas');
    document.body.classList.add('body--ready');

    if (i !== -1) {
      S.UI.simulate(decodeURI(action).substring(i + 3));
    } else {
      S.UI.simulate('|#countdown 3||HAPPY|BIRTHDAY|ANUSHA|AKKA|❤|#rectangle|');
    }

    S.Drawing.loop(function () {
      S.Shape.render();
    });
  }
};

// ======================
// Drawing Module
// ======================
S.Drawing = (function () {
  var canvas,
      context,
      renderFn,
      requestFrame = window.requestAnimationFrame       ||
                     window.webkitRequestAnimationFrame ||
                     window.mozRequestAnimationFrame    ||
                     window.oRequestAnimationFrame      ||
                     window.msRequestAnimationFrame     ||
                     function(callback) {
                       window.setTimeout(callback, 1000 / 60);
                     };

  return {
    init: function (el) {
      canvas = document.querySelector(el);
      context = canvas.getContext('2d');
      this.adjustCanvas();

      window.addEventListener('resize', function () {
        S.Drawing.adjustCanvas();
      });
    },

    loop: function (fn) {
      renderFn = !renderFn ? fn : renderFn;
      this.clearFrame();
      renderFn();
      requestFrame.call(window, this.loop.bind(this));
    },

    adjustCanvas: function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    },

    clearFrame: function () {
      context.clearRect(0, 0, canvas.width, canvas.height);
    },

    getArea: function () {
      return { w: canvas.width, h: canvas.height };
    },

    drawCircle: function (p, c) {
      context.fillStyle = c.render();
      context.beginPath();
      context.arc(p.x, p.y, p.z, 0, 2 * Math.PI, true);
      context.closePath();
      context.fill();
    }
  }
}());

// ======================
// UI Module
// ======================
S.UI = (function () {
  var canvas = document.querySelector('.canvas'),
      interval,
      isTouch = false,
      currentAction,
      resizeTimer,
      time,
      maxShapeSize = 30,
      firstAction = true,
      sequence = [],
      cmd = '#';

  function formatTime(date) {
    var h = date.getHours(),
        m = date.getMinutes();
    m = m < 10 ? '0' + m : m;
    return h + ':' + m;
  }

  function getValue(value) {
    return value && value.split(' ')[1];
  }

  function getAction(value) {
    value = value && value.split(' ')[0];
    return value && value[0] === cmd && value.substring(1);
  }

  function timedAction(fn, delay, max, reverse) {
    clearInterval(interval);
    currentAction = reverse ? max : 1;
    fn(currentAction);

    if (!max || (!reverse && currentAction < max) || (reverse && currentAction > 0)) {
      interval = setInterval(function () {
        currentAction = reverse ? currentAction - 1 : currentAction + 1;
        fn(currentAction);

        if ((!reverse && max && currentAction === max) || (reverse && currentAction === 0)) {
          clearInterval(interval);
        }
      }, delay);
    }
  }

  function reset(destroy) {
    clearInterval(interval);
    sequence = [];
    time = null;
    destroy && S.Shape.switchShape(S.ShapeBuilder.letter(''));
  }

  function performAction(value) {
    var action,
        current;

    sequence = typeof(value) === 'object' ? value : sequence.concat(value.split('|'));

    timedAction(function () {
      current = sequence.shift();
      action = getAction(current);
      value = getValue(current);

      switch (action) {
        case 'countdown':
          value = parseInt(value) || 10;
          value = value > 0 ? value : 10;

          timedAction(function (index) {
            if (index === 0) {
              if (sequence.length === 0) {
                S.Shape.switchShape(S.ShapeBuilder.letter(''));
              } else {
                performAction(sequence);
              }
            } else {
              S.Shape.switchShape(S.ShapeBuilder.letter(index), true);
            }
          }, 1000, value, true);
          break;

        case 'rectangle':
          value = value && value.split('x');
          value = (value && value.length === 2) ? value : [maxShapeSize, maxShapeSize / 2];

          S.Shape.switchShape(
            S.ShapeBuilder.rectangle(
              Math.min(maxShapeSize, parseInt(value[0])),
              Math.min(maxShapeSize, parseInt(value[1]))
            )
          );
          break;

        case 'circle':
          value = parseInt(value) || maxShapeSize;
          value = Math.min(value, maxShapeSize);
          S.Shape.switchShape(S.ShapeBuilder.circle(value));
          break;

        case 'time':
          var t = formatTime(new Date());

          if (sequence.length > 0) {
            S.Shape.switchShape(S.ShapeBuilder.letter(t));
          } else {
            timedAction(function () {
              t = formatTime(new Date());
              if (t !== time) {
                time = t;
                S.Shape.switchShape(S.ShapeBuilder.letter(time));
              }
            }, 1000);
          }
          break;

        default:
          S.Shape.switchShape(
            S.ShapeBuilder.letter(current[0] === cmd ? 'What?' : current)
          );
      }
    }, 2000, sequence.length);
  }

  function bindEvents() {
    document.body.addEventListener('keydown', function (e) {
      if (e.keyCode === 13) { // Enter key
        firstAction = false;
        reset();
        performAction("HAPPY|BIRTHDAY|ANUSHA|AKKA|❤");
      }
    });

    canvas.addEventListener('click', function () {
      // placeholder for overlay logic if needed
    });
  }

  function init() {
    bindEvents();
    isTouch && document.body.classList.add('touch');
  }

  init();

  return {
    simulate: function (action) {
      performAction(action);
    }
  }
}());

// ======================
// Tabs, Point, Color, Dot, ShapeBuilder, Shape
// (unchanged from your code)
// ======================

// ... (keep all your Tabs, Point, Color, Dot, ShapeBuilder, Shape code unchanged) ...

// ======================
// 🎵 Background Audio
// ======================

// Use correct relative path: js/audio/filename
let audio = new Audio("js/audio.mpeg");
audio.loop = true;

// Required: play after first user interaction
document.addEventListener("click", () => {
  audio.play();
}, { once: true });

// ======================
// Start animation
// ======================
S.init();
