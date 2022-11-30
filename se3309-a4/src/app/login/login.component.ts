import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthenticationService } from "../core/services/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Output() credentials = new EventEmitter<any>();
  error: string = '';
  formType: string = 'Login';

  constructor(private authenticationService: AuthenticationService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
  }

  authenticate(username: string, password: string): void {

    if (!username || !password) this.error = "Please enter both a username and password";
    else {
      // Authenticate the user
      this.spinner.show();
      localStorage.setItem('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Njk3ODE5ODIsInVzZXJuYW1lIjoiZ3Vlc3QiLCJhY2Nlc3NfbGV2ZWwiOjAsImlhdCI6MTY2OTc2Mzk4Mn0.ulCwp25Gp-oiCbcJPiQhIWHWY_KTPqLNqOJnsyiUvzM");
      this.router.navigateByUrl('home');

      // this.authenticationService.login(username, password).subscribe(res => {
      //
      //   if (res?.jwt) {
      //     this.credentials.emit({jwt: res?.jwt});
      //     localStorage.setItem('token', res?.jwt);
      //   }
      //
      //   this.spinner.hide();
      // }, error => {
      //   this.spinner.hide();
      //   this.error = error;
      // });
    }
  }

  createAccount(username: string, email: string, password: string, confirm: string): void {
    if (password !== confirm) this.error = "Your password does not match your confirmation";
    else if (!username || !password) this.error = "Please enter both a username and password";
    else {
      // Create the user
      this.spinner.show();
      // this.authenticationService.createAccount(username, email, password).subscribe(res => {
      //
      //   if (res?.result === 'Success') {
      //     this.formType = 'Login';
      //   }
      //   else {
      //     this.error = "Something went wrong, please try again";
      //   }
      //
      //   this.spinner.hide();
      // }, error => {
      //   this.spinner.hide();
      //   this.error = error;
      // });
    }
  }

  continueAsGuest(): void {
    // Assign guest account
    this.spinner.show();
    localStorage.setItem('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Njk3ODE5ODIsInVzZXJuYW1lIjoiZ3Vlc3QiLCJhY2Nlc3NfbGV2ZWwiOjAsImlhdCI6MTY2OTc2Mzk4Mn0.ulCwp25Gp-oiCbcJPiQhIWHWY_KTPqLNqOJnsyiUvzM");
    this.router.navigateByUrl('home');
    // this.authenticationService.continueAsGuest().subscribe(res => {
    //   this.spinner.hide();
    //   this.credentials.emit({jwt: res.jwt});
    //   localStorage.setItem('token', res.jwt);
    // }, error => {
    //   this.spinner.hide();
    //   this.error = error;
    // });
  }

}
