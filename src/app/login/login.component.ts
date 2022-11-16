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
  isValidEmail = true;
  isValidPassword = true;
  emailValidationError = '';
  passwordValidationError = '';
  roles: string[] = [];
  notification: string = "Note: ";
  constructor(private authService: AuthService, private addNotificationService: AddNotificationService, private tokenStorage: TokenStorageService, private router: Router) { }
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      if (this.roles[0] == "ROLE_ADMIN") {
        this.isAdmin = true;
      }
      else {
        this.addNotificationService.getNotification(this.roles[0]).subscribe(
          data => {
            this.notification += data.message;
          },
          err => {
            this.errorMessage = err.error ? err.error.message : "";
          }
        );
      }
    }
    // document.getElementById("username")?.addEventListener('keypress', (event) => {this.validateEmail();});
    // document.getElementById("password")?.addEventListener('keypress', (event) => {this.validatePassword();});
  }
  

  validateEmail(): void {
    const search = this.form.username;
    if(search == null) {
      this.emailValidationError = 'Username is required';
      this.isValidEmail = false;
      return;
    }
    const res = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(search);
    if(res) {
      this.emailValidationError = '';
    } else {
      this.emailValidationError = 'Username is invalid';
    }
    this.isValidEmail = res;
    return;
  }

  validatePassword(): void {
    const search = this.form.password;
    if(search == null) {
      this.passwordValidationError = 'Password is required';
      this.isValidPassword = false;
      return;
    }
    if(search.length < 8) {
      this.passwordValidationError = 'Password must contain at least 8 characters';
      this.isValidPassword = false;
      return;
    }
    if(search.length > 25) {
      this.passwordValidationError = 'Password must contain at most 25 characters';
      this.isValidPassword = false;
      return;
    }
    if(search.toUpperCase() == search) {
      this.passwordValidationError = 'Password must contain at least one lowercase character';
      this.isValidPassword = false;
      return;
    }
    if(search.toLowerCase() == search) {
      this.passwordValidationError = 'Password must contain at least one uppercase character';
      this.isValidPassword = false;
      return;
    }
    if(!new RegExp(/\d/).test(search)) {
      this.passwordValidationError = 'Password must contain at least one numeric character';
      this.isValidPassword = false;
      return;
    }
    if(!new RegExp(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/).test(search)) {
      this.passwordValidationError = 'Password must contain at least one special character';
      this.isValidPassword = false;
      return;
    }
    this.isValidPassword = true;
    this.passwordValidationError = '';
    return;
  }

  onSubmit(): void {
    const { username, password } = this.form;
    this.validateEmail();
    this.validatePassword();
    if(!this.isValidEmail || !this.isValidPassword)
      return;
    this.authService.login(username, password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        if (this.roles[0] == "ROLE_ADMIN") {
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
              this.errorMessage = err.error ? err.error.message : "";
            }
          );
        }

      },
      err => {
        this.errorMessage = err.error ? err.error.message : "";
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}

