import { makeAutoObservable } from 'mobx';
import Tool from '../Tools/Tool';

class ToolState {
  tool: Tool | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public setTool(tool: Tool) {
    this.tool = tool;
  }

  public setFillColor(color: string) {
    if (this.tool) {
      this.tool.fillColor = color;
    }
  }

  public setStrokeColor(color: string) {
    if (this.tool) {
      this.tool.strokeColor = color;
    }
  }

  public setLineWidth(width: number) {
    if (this.tool) {
      this.tool.lineWidth = width;
    }
  }

  get currentToolName() {
    return this.tool?.name;
  }

  get currentLineWidth() {
    return this.tool?.lineWidth;
  }
}

export default new ToolState();
