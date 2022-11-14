import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { FaIconLibrary } from '@fortawesome/angular-fontawesome/icon-library';
import { FlightSearchService } from '../_service/flightsearch.service';
import { TokenStorageService } from '../_service/token-storage.service';
import { UserService } from '../_service/user.service';
import { DatePipe } from "@angular/common";
import { AddDiscountCodeService } from '../_service/add-discount.service';
import { Coupon } from '../models/coupon.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content?: string;
  message?:string;
  isLoggedIn=false;
  showUserHome = false;
  emailAddress="";
  codes?: Array<Coupon>;
  now: any;
  form:any={departure_location:null,
    arrival_location:null,
    date:null
  }
    result:any;
  
  constructor(private userService: UserService,private search:FlightSearchService,private tokenStorageService: TokenStorageService ,private router:Router, private addNDiscountCodeService: AddDiscountCodeService ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.userService.getPublicContent().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
    const user = this.tokenStorageService.getUser();
    if (user.roles.includes('ROLE_USER')) {
      this.showUserHome = true;
      this.emailAddress = user.email;
      this.addNDiscountCodeService.getDiscountCodes(this.emailAddress).subscribe(data=>{console.log(data);
        this.result=data;
        console.log(this.result);
        this.codes = this.result;
        return this.result;
      });
    }
  }
  
  onSubmit():void{
    const{departure_location,arrival_location,date}=this.form;
    this.search.GetFlights(departure_location,arrival_location).subscribe(data=>{console.log(data);
    this.result=data;
    console.log(this.result);
    return this.result;
    })
    
  }
  clickFunction():void{
    alert(" Please Login To Make Booking!")
    {this.router.navigate(["/login"])}
  }
  clickFunction2(flight_id:number,date:Date):void{
  {this.router.navigate(["/user",flight_id,date])}
    
    
  }


}
