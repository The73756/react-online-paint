import { makeAutoObservable } from 'mobx';
import { CanvasType, CanvasWSMethods } from '../types/canvas';
import { defaultSend } from '../ws/senders';
import { updateImage } from '../http/imageApi';

class CanvasState {
  canvas: CanvasType = null;
  socket: WebSocket | null = null;
  sessionId = '';
  undoList: string[] = [];
  redoList: string[] = [];
  username = '';

  constructor() {
    makeAutoObservable(this);
  }

  public setCanvas(tool: CanvasType) {
    this.canvas = tool;
  }

  public setUsername(username: string) {
    this.username = username;
  }

  public setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  public setSocket(socket: WebSocket) {
    this.socket = socket;
  }

  public addUndo(data: string) {
    this.undoList.push(data);
  }

  public addRedo(data: string) {
    this.redoList.push(data);
  }

  public requestUndo() {
    defaultSend(CanvasWSMethods.UNDO);
  }

  public requestRedo() {
    defaultSend(CanvasWSMethods.REDO);
  }

  public rewriteCanvas(canvas: CanvasType, dataUrl: string) {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const canvasWidth = canvas.width as number;
      const canvasHeight = canvas.height as number;

      const newImage = new Image();
      newImage.src = dataUrl;

      newImage.onload = () => {
        ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx?.drawImage(newImage, 0, 0, canvasWidth, canvasHeight);
      };
    }
  }

  public undo() {
    const currentDataUrl = this.canvas?.toDataURL() as string;

    if (this.undoList.length > 0) {
      const undoDataUrl = this.undoList.pop() as string;
      this.addRedo(currentDataUrl);

      this.rewriteCanvas(this.canvas, undoDataUrl);

      try {
        void updateImage(this.sessionId, undoDataUrl);
      } catch (e) {
        console.log(e);
      }
    }
  }

  public redo() {
    const currentDataUrl = this.canvas?.toDataURL() as string;

    if (this.redoList.length > 0) {
      const redoDataUrl = this.redoList.pop() as string;
      this.addUndo(currentDataUrl);

      this.rewriteCanvas(this.canvas, redoDataUrl);

      try {
        void updateImage(this.sessionId, redoDataUrl);
      } catch (e) {
        console.log(e);
      }
    }
  }
}

export default new CanvasState();
