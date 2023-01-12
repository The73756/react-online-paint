import { defaultSend } from './senders';
import { CanvasWSMethods } from '../types/canvas';

export const openHandler = () => {
  defaultSend(CanvasWSMethods.CONNECT);
};

export const closeHandler = () => {
  console.log('Соединение с сервером разорвано');
};
