import { $host } from './index';
import { toast } from 'react-hot-toast';

export const getImage = async (sessionId: string): Promise<string> => {
  const { data } = await $host.get<string>(`/image?id=${sessionId}`);
  return data;
};

export const updateImage = async (sessionId: string, img: string): Promise<void> => {
  try {
    await $host.post(`/image?id=${sessionId}`, { img });
  } catch (e) {
    console.log(e);
    toast.error('Произошла ошибка при синхронизации изображения с сервером!');
  }
};
