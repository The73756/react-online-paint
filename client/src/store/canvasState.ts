import { makeAutoObservable } from 'mobx';
import { CanvasType } from '../types/canvas';

class CanvasState {
  canvas: CanvasType = null;
  undoList: string[] = [];
  redoList: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public setCanvas(tool: CanvasType) {
    this.canvas = tool;
  }

  public addUndo(data: string) {
    this.undoList.push(data);
  }

  public addRedo(data: string) {
    this.redoList.push(data);
  }

  public undo() {
    const ctx = this.canvas?.getContext('2d');
    const canvasWidth = this.canvas?.width as number;
    const canvasHeight = this.canvas?.height as number;

    if (this.undoList.length > 0) {
      const dataUrl = this.undoList.pop() as string;
      this.redoList.push(this.canvas?.toDataURL() as string);

      const img = new Image();

      img.src = dataUrl;
      img.onload = () => {
        ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx?.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      };
    } else {
      ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
    }
  }

  public redo() {
    const ctx = this.canvas?.getContext('2d');
    const canvasWidth = this.canvas?.width as number;
    const canvasHeight = this.canvas?.height as number;

    if (this.redoList.length > 0) {
      const dataUrl = this.redoList.pop() as string;
      this.undoList.push(this.canvas?.toDataURL() as string);

      const img = new Image();

      img.src = dataUrl;
      img.onload = () => {
        ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx?.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      };
    }
  }
}

export default new CanvasState();
