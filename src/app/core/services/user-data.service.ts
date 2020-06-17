import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from '../interfaces/user-data';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  USER_DATA_REPOSITORY = 'userData';
  defaultUserData = {
    newUser: true,
    eulaAccepted: false,
    guideAccepted: false,
    firstName: '',
    lastName: '',
  };

  constructor(
    private localStorage: LocalStorageService
  ) { }

  getUserData(): Observable<UserData> {
    return this.localStorage.getData(this.USER_DATA_REPOSITORY, this.defaultUserData);
  }

  saveUserData(userData: UserData): Observable<UserData> {
    return this.localStorage.setData(userData, this.USER_DATA_REPOSITORY);
  }
}