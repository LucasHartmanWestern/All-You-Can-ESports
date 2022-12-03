import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UsersComponent } from "../../modals/users/users.component";
import { DataService } from "../../services/data.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import {FantasyComponent} from "../../modals/fantasy/fantasy.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  helper = new JwtHelperService();
  user: any = this.helper.decodeToken(localStorage.getItem('token') || undefined);

  details: { type: string, details: any } | null = null;

  constructor(private router: Router, private modalService: NgbModal, private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.details$.subscribe(res => {
      this.details = res;
    });
  }

  back(): void {
    this.dataService.details$.next(null);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }

  openUsers(): void {
    let modalRef = this.modalService.open(UsersComponent, {centered: true, windowClass: 'UsersModalClass'});
  }

  openFantasyBuilder(): void {
    let modalRef = this.modalService.open(FantasyComponent, {centered: true, windowClass: 'FantasyModalClass'});
  }
}
