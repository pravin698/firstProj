import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  tokenVal:any;
  constructor() { }

  saveToken(token) {
    //localStorage.setItem('jwtToken', token);
    this.tokenVal = token;
  }

  destroyTokens() {
    //localStorage.removeItem('jwtToken');
    this.tokenVal = "";
  }

  getToken(): string {
    return this.tokenVal;
  }
}
