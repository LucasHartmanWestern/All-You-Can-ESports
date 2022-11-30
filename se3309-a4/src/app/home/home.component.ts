import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { DataService } from "../core/services/data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  helper = new JwtHelperService();
  user: any = this.helper.decodeToken(localStorage.getItem('token') || undefined);
  details: {type: string, details: any} | null = null;

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    if (!this.user) this.router.navigateByUrl('login');

    this.dataService.details$.subscribe((res: any) => {
      this.details = res;
    });
  }

  setDetails(event: any): void {
    this.details = event;
  }
}
