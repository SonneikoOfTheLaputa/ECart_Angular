import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../Models/ApiResponse';
import { OrderDetails } from '../Models/OrderDetails';
import { Promo } from '../Models/Promo';

@Injectable({
  providedIn: 'root'
})
export class BookOrderServiceService {

  constructor(private http:HttpClient) { }
  UpdatePromoCode(obj:Promo):Observable<any>
  {
    var token=localStorage.getItem('AuthToken')||'';
    var refreshToken=localStorage.getItem('RefreshToken')||'';
    const body=JSON.stringify(obj);
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('AuthToken',token)
    .set('RefreshToken',refreshToken);
    return this.http.post(environment.API_URL+"/product/UpdatePromoCode",body,{headers});
  }
  bookOrder(obj:OrderDetails):Observable<any>
   {
    var token=localStorage.getItem('AuthToken')||'';
    var refreshToken=localStorage.getItem('RefreshToken')||'';
    const body=JSON.stringify(obj);
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('AuthToken',token)
    .set('RefreshToken',refreshToken);

    return this.http.post(environment.API_URL+"/product/bookorder",body,{headers});
  }
}
