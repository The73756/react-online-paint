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

  get currentToolName() {
    return this.tool?.name;
  }
}

export default new ToolState();
