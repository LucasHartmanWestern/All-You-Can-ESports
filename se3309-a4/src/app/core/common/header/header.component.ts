import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {UsersComponent} from "../../modals/users/users.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }

  openUsers(): void {
    let modalRef = this.modalService.open(UsersComponent, {centered: true, windowClass: 'UsersModalClass'});
  }
}
