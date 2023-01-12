import { defaultSend } from './senders';
import { CanvasWSMethods } from '../types/canvas';

export const openHandler = () => {
  defaultSend(CanvasWSMethods.CONNECT);
};

export const closeHandler = () => {
  alert('Соединение с сервером разорвано');
};
