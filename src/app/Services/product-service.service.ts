import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Products } from '../Models/Products';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  private _refreshRequired=new Subject<void>();
  constructor(private http:HttpClient) { }

get RefreshRequired(){
  return this._refreshRequired;
}
  updateProducts(obj:Products[]):Observable<any>
  {
    var token=localStorage.getItem('AuthToken')||'';
    var refreshToken=localStorage.getItem('RefreshToken')||'';
    const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*')
  .set('AuthToken',token)
  .set('RefreshToken',refreshToken);
const body=JSON.stringify(obj);
  return this.http.post(environment.API_URL+"/product/UpdateProducts",body,{headers});
  }
  getProducts():Observable<any>{
    var token=localStorage.getItem('AuthToken')||'';
    var refreshToken=localStorage.getItem('RefreshToken')||'';
    const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*')
  .set('AuthToken',token)
  .set('RefreshToken',refreshToken);
   
    return this.http.get(environment.API_URL+"/product/GetAllProducts",{headers}).pipe(tap(()=>{
      this.RefreshRequired.next();
    }));
  }
}
