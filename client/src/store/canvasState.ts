import { makeAutoObservable } from 'mobx';
import { CanvasType, CanvasWSMethods } from '../types/canvas';

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
    this.socket?.send(
      JSON.stringify({
        id: this.sessionId,
        username: this.username,
        method: CanvasWSMethods.UNDO,
      }),
    );
  }

  public requestRedo() {
    this.socket?.send(
      JSON.stringify({
        id: this.sessionId,
        username: this.username,
        method: CanvasWSMethods.REDO,
      }),
    );
  }

  public undo() {
    const ctx = this.canvas?.getContext('2d');
    const canvasWidth = this.canvas?.width as number;
    const canvasHeight = this.canvas?.height as number;

    if (this.undoList.length > 0) {
      const dataUrl = this.undoList.pop() as string;
      this.addRedo(this.canvas?.toDataURL() as string);

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
      this.addUndo(this.canvas?.toDataURL() as string);

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
