import { makeAutoObservable } from 'mobx';
import { CanvasType } from '../types/canvas';

class CanvasState {
  canvas: CanvasType = null;

  constructor() {
    makeAutoObservable(this);
  }

  public setCanvas(tool: CanvasType) {
    this.canvas = tool;
  }
}

export default new CanvasState();
