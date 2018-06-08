import Frame from './Frame';

const BACKGROUND = '#e2b973';

export default class Canvas {

  private canvasPointer;
  private context;

  constructor(maxWidth, maxHeight, background = BACKGROUND) {
    this.canvasPointer = document.createElement('canvas');
    this.context = this.canvasPointer.getContext("2d");
    this.canvasPointer.width = maxWidth;
    this.canvasPointer.height = maxHeight;
    this.canvasPointer.style.width = "100%";
  }

  public static createAndMount(maxWidth, maxHeight, id, background = BACKGROUND) {
    let canvas = new Canvas(maxWidth, maxHeight, background);
    let elementPointer = canvas.getCanvas();
    document.getElementById(id).appendChild(elementPointer);
    return canvas;
  }

  public adjustToImageData(img) {
    this.canvasPointer.width = img.width;
    this.canvasPointer.height = img.height;
  }

  public drawImage(img, offsetX = 0, offsetY = 0) {
    this.context.drawImage(img, offsetX, offsetY);
  }

  public getWidth() {
    return this.canvasPointer.width;
  }

  public getHeight() {
    return this.canvasPointer.height;
  }

  public getCanvas() {
    return this.canvasPointer;
  }

  public getContext() {
    return this.context;
  }

  public clearRect() {
    this.context.clearRect(0, 0, this.canvasPointer.width, this.canvasPointer.height);
  }

  public static createSnippet(canvas: Canvas, frame: Frame): any {
    let tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = frame.width;
    tmpCanvas.height = frame.height;
    tmpCanvas.getContext('2d').drawImage(
      canvas.getCanvas(),
      frame.positionX,
      frame.positionY,
      frame.width,
      frame.height,
      0, 0, frame.width, frame.height
    );
    return tmpCanvas;
  }

  public trimSelection(frame: Frame): Frame {

    /* First, get the selection that is under audit */
    let finalFrame = new Frame(
      frame.positionX,
      frame.positionY,
      frame.width,
      frame.height
    );

    let imageData = this.context.getImageData(
      frame.positionX, frame.positionY, frame.width, frame.height
    );

    /* Loop through the columns */

    while(Canvas.isEmptyColumn(imageData, finalFrame.positionX - frame.positionX) && finalFrame.positionX < frame.positionX + imageData.width){
      finalFrame.positionX++;
      finalFrame.width--;
    }

    while(Canvas.isEmptyColumn(imageData, (finalFrame.positionX - frame.positionX) + finalFrame.width - 1) && finalFrame.width > 0){
      finalFrame.width--;
    }

    /* Loop through all the rows */

    while(Canvas.isEmptyRow(imageData, finalFrame.positionY - frame.positionY) && finalFrame.positionY < frame.positionY + imageData.height){
      finalFrame.positionY++;
      finalFrame.height--;
    }

    while(Canvas.isEmptyRow(imageData, (finalFrame.positionY - frame.positionY) + finalFrame.height - 1) && finalFrame.height > 0){
      finalFrame.height--;
    }

    return finalFrame;

  }

  private static isEmptyColumn(imageData, col) {
    let data = imageData.data;
    for(let i = 0; i < imageData.height; i++) {
      let pixelAlpha = data[(col * 4) + (i * imageData.width * 4) + 3];
      if(pixelAlpha != 0) return false;
    }
    return true;
  }

  private static isEmptyRow(imageData, row) {
    let data = imageData.data;
    for(let i = 0; i < imageData.width; i++) {
      let pixelAlpha = data[(i * 4) + (row * imageData.width * 4) + 3] ;
      if(pixelAlpha != 0) return false;
    }
    return true;
  }

};
