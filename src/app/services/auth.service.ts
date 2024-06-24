import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<string | null>(null);
  private imageSource = new BehaviorSubject<string|null>(null);
  public imageSource$ = this.imageSource.asObservable();

  constructor() { }

  setImageSource(image: string) {
    this.imageSource.next(image);
  }

  getImageSource(): string|null {
    return this.imageSource.getValue();
  }

  setUser(username: string) {
    this.user.next(username);
  }

  getUser() {
    return this.user.asObservable();
  }

  
}
