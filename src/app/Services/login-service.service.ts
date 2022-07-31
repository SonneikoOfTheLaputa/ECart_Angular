import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable, observable } from 'rxjs';
import { LoginModal } from '../Models/LoginModal';
import { ApiResponse } from '../Models/ApiResponse';
@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private http:HttpClient ) { }
  GetLogin(loginObj:LoginModal):Observable<any>{
     const body=JSON.stringify(loginObj);
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
   
    return this.http.post<ApiResponse> (environment.API_URL + '/User/LoginUser',body,{'headers':headers});
 }


 getUserName(loginObj:LoginModal):Observable<any>{
  const body=JSON.stringify(loginObj);

  var token=localStorage.getItem('AuthToken')||'';
  var refreshToken=localStorage.getItem('RefreshToken')||'';
  const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*')
  .set('AuthToken',token)
  .set('RefreshToken',refreshToken);

return this.http.post<ApiResponse> (environment.API_URL + '/User/GetUserName',body,{'headers':headers});
 }

}
