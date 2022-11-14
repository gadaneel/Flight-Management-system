import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coupon } from '../models/coupon.model';

const AUTH_API = 'http://localhost:8085/api/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class AddDiscountCodeService {
  constructor(private http: HttpClient) { }
  addDiscountCode(code: string, discountValue: Number, expiryDate: Number, emailAddress: string): Observable<any> {
    return this.http.post(AUTH_API + "addDiscountCode", {
      code,
      discountValue,
      expiryDate,
      emailAddress
    }, httpOptions);
  }

  getDiscountCodes(emailAddress: string): Observable<Coupon[]> {
    return (this.http.get<Coupon[]>(AUTH_API + "getDiscountCodes/user/" + emailAddress));
  }
}