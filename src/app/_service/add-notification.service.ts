import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const AUTH_API = 'http://localhost:8085/api/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class AddNotificationService {
  constructor(private http: HttpClient) { }
  addNotification(userType: string, message: string): Observable<any> {
    return this.http.post(AUTH_API + "addUserNotification", {
      userType,
      message
    }, httpOptions);
  }

  getNotification(userType: string): Observable<any> {
    return (this.http.get(AUTH_API + "user/" + userType));
  }
}