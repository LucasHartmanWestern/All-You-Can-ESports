import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  helper = new JwtHelperService();
  user: any = this.helper.decodeToken(localStorage.getItem('token') || undefined);

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (!this.user) this.router.navigateByUrl('login');
  }

}
