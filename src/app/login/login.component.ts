import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_service/token-storage.service';
import { AuthService } from '../_service/auth.service';
import { AddNotificationService } from '../_service/add-notification.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  isAdmin = false;
  errorMessage = '';
  roles: string[] = [];
  notification: string = "Note: ";
  constructor(private authService: AuthService, private addNotificationService: AddNotificationService, private tokenStorage: TokenStorageService, private router:Router) { }
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      if (this.roles[0]=="ROLE_ADMIN") {
        this.isAdmin = true;
      }
      else {
        this.addNotificationService.getNotification(this.roles[0]).subscribe(
          data => {
            this.notification += data.message;
          },
          err => {
            this.errorMessage = err.error.message;
          }
        );
      }
    }
  }
  onSubmit(): void {
    const { username, password } = this.form;
    this.authService.login(username, password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        if (this.roles[0]=="ROLE_ADMIN") {
          this.isAdmin = true;
          this.reloadPage();
        }
        else {
          this.addNotificationService.getNotification(this.roles[0]).subscribe(
            data => {
              this.notification += data.message;
              this.reloadPage();
            },
            err => {
              this.errorMessage = err.error.message;
            }
          );
        }
        
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }
  reloadPage(): void {
    window.location.reload();
  }
}

