import { Component } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'se3309-a4';

  helper = new JwtHelperService();
  user: any = this.helper.decodeToken(localStorage.getItem('token') || undefined);

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (!this.user) this.router.navigateByUrl('login');
    else this.router.navigateByUrl('home');
  }
}
