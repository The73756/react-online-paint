import { defaultSend } from './senders';
import { CanvasWSMethods } from '../types/canvas';
import { toast } from 'react-hot-toast';

export const openHandler = () => {
  defaultSend(CanvasWSMethods.CONNECT);
};

export const disconnectHandler = () => {
  defaultSend(CanvasWSMethods.DISCONNECT);
};

export const closeHandler = () => {
  toast.error('Соединение с сервером разорвано!');
};
