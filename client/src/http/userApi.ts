import { $host } from './index';

interface LoginResponseType {
  isLogin: boolean;
  message: string;
}

export const loginUser = async (username: string, id: string): Promise<LoginResponseType> => {
  try {
    const { data } = await $host.post<LoginResponseType>('/login', { username, id });
    return data;
  } catch (e) {
    console.log(e);
    return { isLogin: false, message: 'Произошла ошибка при авторизации!' };
  }
};
