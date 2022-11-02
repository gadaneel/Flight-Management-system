import { Component, OnInit } from '@angular/core';
import { Route, Router, Routes } from '@angular/router';
import { AuthService } from '../_service/auth.service';


@Component({
    selector: 'contactus',
    templateUrl: './contactus.component.html',
    styleUrls: ['./contactus.component.css']
  })

  export class ContactUs implements OnInit {

    constructor() { }
  
    ngOnInit(): void {
    }
  }