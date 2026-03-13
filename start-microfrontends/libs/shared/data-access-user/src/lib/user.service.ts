import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private isUserLoggedIn = new BehaviorSubject(false);
  isUserLoggedIn$ = this.isUserLoggedIn.asObservable();

  checkCredentials(username: string, password: string):void {
    if (username === 'demo' && password === 'demo') {
      this.isUserLoggedIn.next(true);
    }
  }

  logout():void {
    this.isUserLoggedIn.next(false);
  }
}
