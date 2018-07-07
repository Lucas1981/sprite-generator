import Canvas from './Canvas';
import FileHandler from './File';
import KeyboardInput from './KeyboardInput';
import Selection from './Selection';
import Frame from './Frame';
import LoopTypes from './LoopTypes';
import MainModelFactory from './MainModelFactory';

export default {
  el: '#sprite-editor',
  data: MainModelFactory.createNewModel(),
  computed: {
  },
  methods: {
    handleFile(event) {
      FileHandler.handleImageFile(event).then( (result) => {
        this.sourceImage.src = result;
        this.sourceImage.onload = () => {
          this.canvas.adjustToImageData(this.sourceImage);
          this.mainLoop();
        };
      }).catch( this.handleError );
      event.target.blur();
    },
    mainLoop() {
      let context: any = this.canvas.getContext();
      let spaceBarIsPressed: boolean = false;

      this.keyboardInput = new KeyboardInput();

      setInterval( () => {
        this.canvas.clearRect();
        this.canvas.drawImage(this.sourceImage);
        if(this.keyboardInput.state.up && this.positionY > 0) this.positionY -= +this.stepY;
        if(this.keyboardInput.state.down && this.positionY < +this.canvas.getHeight()) {
          this.positionY += +this.stepY;
        }
        if(this.keyboardInput.state.left && this.positionX > 0) this.positionX -= +this.stepX;
        if(this.keyboardInput.state.right && this.positionX < +this.canvas.getWidth()) {
          this.positionX += +this.stepX;
        }
        if(this.keyboardInput.state.space && spaceBarIsPressed === false) {
          spaceBarIsPressed = true;
          if(this.activeSelection != -1) this.addFrame();
        }
        if(!this.keyboardInput.state.space) spaceBarIsPressed = false;
        context.beginPath();
        context.strokeStyle = "orange";
        context.rect(this.positionX, this.positionY, this.unitWidth, this.unitHeight);
        context.stroke();
      }, 100);
    },
    addSelection(event) {
      this.selections.unshift(new Selection(this.selectionIdIndex));
      this.selectionIdIndex++;
      this.activeSelection = this.selections[0].id;
      event.target.blur();
    },
    deleteSelection(selection) {
      /* Find index of selection */
      let selectionIndex = this.selections.indexOf(selection);

      /* Move selected up to the next if we are deleting selected */
      if(this.activeSelection == selection.id) {

        /* If there is another selection up, move up */
        if(selectionIndex > 0) {
          this.activeSelection = this.selections[selectionIndex - 1].id;
        }
        /* If not, and there is another selection down, move down */
        else if(this.selections.length - 1 > selectionIndex){
          this.activeSelection = this.selections[selectionIndex + 1].id;
        }
        /* If there are none up or down and this was the last selection, reset selection */
        else {
          this.activeSelection = -1;
        }
      }

      this.selections.splice(selectionIndex, 1);

    },
    getDataURL(frame) {
      let src = this.frameImageSourcesMap.get(JSON.stringify(frame));
      return src.toDataURL();
    },
    saveSelections(event) {
      FileHandler.downloadJsonFile('sprite.json', this.selections);
      event.target.blur();
    },
    loadSelections(event) {
      FileHandler.handleJsonFile(event).then( (result) => {
        this.clearSelections(null);
        for(let i in result) {
          let selection = result[i];
          let frames: Frame[] = [];
          for(let j = 0; j < selection.frames.length; j++) {
            let frame = selection.frames[j]
            let newFrame = new Frame(frame.positionX, frame.positionY, frame.width, frame.height)
            this.saveHash( newFrame );
            frames.push(newFrame);
          }
          this.selections.push(new Selection(
            selection.selectionIdIndex, selection.name, selection.loopType, frames
          ));
        }
      }).catch( this.handleError );
      event.target.blur();
    },
    loadSelectionsProxy(event) {
      let loadSelectionsPointer = this.$refs.loadSelection;
      loadSelectionsPointer.click();
      event.target.blur();
    },
    clearSelections(event) {
      this.selections = [];
      this.frameImageSourcesMap.clear();
      this.selectionIdIndex = 0;
      if(event !== null) event.target.blur();
    },
    addFrame() {
      let newFrame: Frame = null;
      let selected = this.selections.find( e => e.id == this.activeSelection )

      /* Determine values for the new frame */

      newFrame = new Frame(
        this.positionX,
        this.positionY,
        this.unitWidth,
        this.unitHeight,
      );

      if(this.trimSelection) newFrame = this.canvas.trimSelection( newFrame );

      /* Save a hash for the unique frame set */
      this.saveHash(newFrame);

      /* Commit the selection to our output json */
      selected.frames.push( newFrame );
    },
    deleteFrame(selection, frame) {
      let index = selection.frames.indexOf(frame);
      selection.frames.splice(index, 1);
      /* NOTE: We don't delete the frame hash because it can occur more than once */
    },
    saveHash(newFrame) {
      let tmpCanvas: any = null;
      var key: string = null;

      tmpCanvas = Canvas.createSnippet( this.canvas, newFrame );
      key = JSON.stringify(newFrame);
      if(!this.frameImageSourcesMap.has(key)) {
        this.frameImageSourcesMap.set(key, tmpCanvas);
      }
    },
    handleError(err) {
      console.log(err);
    }
  },
  mounted() {
    this.canvas = Canvas.createAndMount(320, 200, 'source-canvas');
  }
};
