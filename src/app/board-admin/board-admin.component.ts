import { Component, OnInit } from '@angular/core';
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
      data => {alert(data.message)},
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

}
