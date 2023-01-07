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
}

export default new ToolState();
