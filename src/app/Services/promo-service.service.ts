import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Promo } from '../Models/Promo';

@Injectable({
  providedIn: 'root'
})
export class PromoServiceService {

  constructor(private http: HttpClient) { }

  getPromoCodes(obj: Promo): Observable<any> {

    var body = JSON.stringify(obj);
    var token = localStorage.getItem('AuthToken') || '';
    var refreshToken = localStorage.getItem('RefreshToken') || '';
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('AuthToken', token)
      .set('RefreshToken', refreshToken);

    return this.http.post(environment.API_URL + "/product/GetPromoCodes", body, { 'headers': headers });
  }

  }

