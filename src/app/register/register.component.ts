import { Component, OnInit } from '@angular/core';
import { Route, Router, Routes } from '@angular/router';
import { AuthService } from '../_service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    name: null,
    phone: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isValidName = true;
  isValidPhone = true;
  isValidEmail = true;
  isValidPassword = true;
  nameValidationError = '';
  phoneValidationError = '';
  emailValidationError = '';
  passwordValidationError = '';
  constructor(private authService: AuthService,private router:Router ) { }
  ngOnInit(): void {
  }

  validateName(): void {
    const search = this.form.name;
    if(search == null) {
      this.nameValidationError = 'Name is required';
      this.isValidName = false;
      return;
    }
    if(search.length < 4) {
      this.nameValidationError = 'Name must contain at least 4 characters';
      this.isValidName = false;
      return;
    }
    if(search.length > 40) {
      this.nameValidationError = 'Name must contain at most 40 characters';
      this.isValidName = false;
      return;
    }
    this.isValidName = true;
    this.nameValidationError = '';
    return;
  }

  validatePhone(): void {
    const search = this.form.phone;
    if(search == null) {
      this.phoneValidationError = 'Phone is required';
      this.isValidPhone = false;
      return;
    }
    const res = new RegExp(/^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/).test(search);
    if(res) {
      this.phoneValidationError = '';
    } else {
      this.phoneValidationError = 'Phone is invalid';
    }
    this.isValidPhone = res;
    return;
  }

  validateEmail(): void {
    const search = this.form.email;
    if(search == null) {
      this.emailValidationError = 'Email is required';
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
    const { name, phone, email, password } = this.form;
    this.validateName();
    this.validatePhone();
    this.validateEmail();
    this.validatePassword();
    if(!this.isValidName || !this.isValidPhone || this.isValidEmail || !this.isValidPassword)
      return;
    this.authService.register(name, phone, email, password).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
       this.router.navigate(['/login'])
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
