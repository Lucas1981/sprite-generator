import LoopTypes from './LoopTypes';
import Selection from './Selection';
import Canvas from './Canvas';
import KeyboardInput from './KeyboardInput';

export default class MainModelFactory {

  public LoopTypes: any = null;

  constructor(
    public positionX: number = 0,
    public positionY: number = 0,
    public unitWidth: number = 24,
    public unitHeight: number = 48,
    public stepX: number = 6,
    public stepY: number = 6,
    public selections: Selection[] = [],
    public canvasElement: any = null,
    public canvas: Canvas = null,
    public sourceFile: any = null,
    public myImage: any = null,
    public activeSelection: number = -1,
    public keyboardInput: KeyboardInput = null,
    public frameImageSourcesMap: any = new Map(),
    public trimSelection: boolean = true,
    public sourceImage: any = new Image(),
    public selectionIdIndex: number = 0
  ) {
    this.LoopTypes = LoopTypes
  }

  public static createNewModel() {
    return new MainModelFactory();
  }

}
