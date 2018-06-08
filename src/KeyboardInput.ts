const keyLeft = 37;
const keyUp = 38;
const keyRight = 39;
const keyDown = 40;
const keySpace = 32; // space

const a = 65; // a
const d = 68; // d
const w = 87; // w
const s = 83; // s
const enter = 13; // enter
const zero = 48; // 0

const myTimer = 40; // 40 ms

const state = {
  up: false,
  down: false,
  left: false,
  right: false,
  altUp: false,
  altDown: false,
  altLeft: false,
  altRight: false,
  z: false,
  x: false,
  space: false,
  toggle: false,
  suicide: false,
  enter: false,
  zero: false,
};

export default class KeyboardInput {

  constructor(
    private element = document
  ) {
    this.element.addEventListener('keydown', KeyboardInput.keyDownFunction);
    this.element.addEventListener('keyup', KeyboardInput.keyUpFunction);
  }

  public get state() {
    return state;
  }

  public destructor() {
    this.element.removeEventListener('keydown', KeyboardInput.keyDownFunction);
    this.element.removeEventListener('keyup', KeyboardInput.keyUpFunction);
  }

  private static keyDownFunction(e) {

    let release = e;

    switch(release.keyCode) {
      case keyUp:
        e.preventDefault();
        state.up = true;
        break;
      case keyDown:
        e.preventDefault();
        state.down = true;
        break;
      case keyLeft:
        state.left = true;
        break;
      case keyRight:
        state.right = true;
        break;
      case keySpace:
        e.preventDefault();
        state.space = true;
        break;
      case w:
        state.altUp = true;
        break;
      case s:
        state.altDown = true;
        break;
      case a:
        state.altLeft = true;
        break;
      case d:
        state.altRight = true;
        break;
      case enter:
        state.enter = true;
        break;
      case zero:
        state.zero = true;
        break;
      default:
        break;
    }
  }

  private static keyUpFunction(e) {

    let release = e;

    switch(release.keyCode) {
      case keyUp:
        state.up = false;
        break;
      case keyDown:
        state.down = false;
        break;
      case keyLeft:
        state.left = false;
        break;
      case keyRight:
        state.right = false;
        break;
      case keySpace:
        state.space = false;
        break;
      case w:
        state.altUp = false;
        break;
      case s:
        state.altDown = false;
        break;
      case a:
        state.altLeft = false;
        break;
      case d:
        state.altRight = false;
        break;
      case enter:
        state.enter = false;
        break;
      case zero:
        state.zero = false;
        break;
      default:
        break;
    }
  }

};
