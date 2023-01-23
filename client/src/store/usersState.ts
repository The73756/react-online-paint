import { makeAutoObservable } from 'mobx';
import { UserType } from '../types/user';

class UsersState {
  users: UserType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public setUsers(users: UserType[]) {
    this.users = users;
  }
}
export default new UsersState();
