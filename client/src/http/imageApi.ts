import { $host } from './index';

export const getImage = async (sessionId: string): Promise<string> => {
  const { data } = await $host.get<string>(`/image?id=${sessionId}`);
  return data;
};

export const updateImage = async (sessionId: string, image: string): Promise<void> => {
  await $host.post(`/image?id=${sessionId}`, { image });
};
