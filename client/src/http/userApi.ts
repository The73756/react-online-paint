import { $host } from './index';
import { UserType } from '../types/user';

interface LoginResponseType {
  isLogin: boolean;
  message: string;
  users: UserType[];
}

export const loginUser = async (username: string, id: string): Promise<LoginResponseType> => {
  try {
    const { data } = await $host.post<LoginResponseType>('/login', { username, id });
    return data;
  } catch (e) {
    console.log(e);
    return { isLogin: false, message: 'Произошла ошибка при авторизации!', users: [] };
  }
};
