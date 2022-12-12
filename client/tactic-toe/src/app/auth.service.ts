import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { SocketioService } from './socketio.service';
import { dataResponse, response } from './types';
import { APIClientService } from './apiclient.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  ROOT_URL !: string;

  constructor(private http: HttpClient, private socket: SocketioService, private api : APIClientService) {
    this.ROOT_URL = environment.ROOT_URL
   }


  public isLoggedIn = false;

  isAuthenticated(){
    let result = false;
    return this.http.get(`${this.ROOT_URL}/loggedin`, {withCredentials: true}).pipe(
      map(() => {
        this.isLoggedIn = true;
        return true;
      }),
      catchError(() => of(false))
    )
  }

  setUserInfo(user:any) { // TODO: Make use of this
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  validate(email:string, password:string) {
    // {'statusCode': 200, 'message':'logged in', 'user':req.user}
    return this.http.post<dataResponse>(`${this.ROOT_URL}/login`, {'username': email, 'password': password}, {withCredentials: true});
  }

  register(email:string, firstName:string, lastName:string, password:string) {
    return this.http.post<response>(`${this.ROOT_URL}/register`, {email, firstName, lastName, password});
  }

  logout() {
    this.isLoggedIn = false;
    this.setUserInfo({});
    this.socket.clearSearchArray()
    this.socket.searching = false
    this.api.editAi(0)
    return this.http.delete<response>(`${this.ROOT_URL}/logout`, {withCredentials: true});
  }

}
