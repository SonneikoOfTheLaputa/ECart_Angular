import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginModal } from '../Models/LoginModal';

@Injectable({
  providedIn: 'root'
})
export class LogoutserviceService {

  constructor(private http:HttpClient) { }


  logoutUser():Observable<any>
  {

    var token=localStorage.getItem('AuthToken')||'';
    var refreshToken=localStorage.getItem('RefreshToken')||'';
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('AuthToken',token)
    .set('RefreshToken',refreshToken);
    return this.http.get(environment.API_URL+"/user/logoutuser",{headers});
  }
}
