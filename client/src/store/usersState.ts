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

  public addUser(user: UserType) {
    this.users.push(user);
  }

  public removeUser(user: UserType) {
    this.users = this.users.filter((u) => u.username !== user.username);
  }
}
export default new UsersState();
