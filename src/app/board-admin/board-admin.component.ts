import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_service/token-storage.service';
import { AuthService } from '../_service/auth.service';
import { Router } from '@angular/router';
import { AddNotificationService } from '../_service/add-notification.service';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {

  form: any = {
    usertype: null,
    notification: null
  };
  isLoggedIn = true;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  constructor(private addNotificationService: AddNotificationService,private router:Router) { }
  ngOnInit(): void {}

  onSubmit(): void {
    const { usertype, notification } = this.form;
    this.addNotificationService.addNotification(usertype, notification).subscribe(
      data => {},
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

}
