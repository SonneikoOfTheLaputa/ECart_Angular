import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginModal } from '../Models/LoginModal';
import { SingleOrderDetailsRequest } from '../Models/SingleOrderDetailsRequest';

@Injectable({
  providedIn: 'root'
})
export class OrderserviceService {

  constructor(private http:HttpClient) { }

getSingleOrder(obj:SingleOrderDetailsRequest):Observable<any>{

  const body=JSON.stringify(obj);
  var token=localStorage.getItem('AuthToken')||'';
  var refreshToken=localStorage.getItem('RefreshToken')||'';
  const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*')
  .set('AuthToken',token)
  .set('RefreshToken',refreshToken);
return this.http.post(environment.API_URL+"/user/GetSingleOrder",body,{headers});

}
  getAllOrders(obj:LoginModal):Observable<any>{
const body=JSON.stringify(obj);
    
    var token=localStorage.getItem('AuthToken')||'';
    var refreshToken=localStorage.getItem('RefreshToken')||'';
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('AuthToken',token)
    .set('RefreshToken',refreshToken);


    return this.http.post(environment.API_URL+"/user/getallorders",body,{headers});

    
  }
}
