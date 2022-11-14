import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddDiscountCodeService } from '../_service/add-discount.service';

@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrls: ['./admin-discount.component.css']
})
export class AdminDiscountComponent implements OnInit {

  form: any = {
    discountcode: null,
    discountvalue: null,
    expirydate: null,
    emailaddress: null
  };
  isLoggedIn = true;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  constructor(private addNDiscountCodeService: AddDiscountCodeService,private router:Router) { }
  ngOnInit(): void {}

  onSubmit(): void {
    const { discountcode, discountvalue, expirydate, emailaddress } = this.form;
    var expiryDate = new Date(expirydate).getTime();
    this.addNDiscountCodeService.addDiscountCode(discountcode, discountvalue, expiryDate, emailaddress).subscribe(
      data => {
        alert(data.message);
        this.form.discountcode = null;
        this.form.discountvalue = null;
        this.form.expirydate = null;
        this.form.emailaddress = null;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

}
