import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { DataService } from "../../services/data.service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  @Input() orgName: string = '';
  @Output() newAnnouncement: EventEmitter<{title: string, author: string, body: string, creation_date: string}> = new EventEmitter<{title: string, author: string, body: string, creation_date: string}>();

  helper = new JwtHelperService();
  user: any = this.helper.decodeToken(localStorage.getItem('token') || undefined);

  constructor(private dataService: DataService, public activeModal: NgbActiveModal, private modalService: NgbModal, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    console.log(this.orgName);
    console.log(this.user);
  }

  createAnnouncement(event: any, title: string, body: string): void {
    event.preventDefault();

    this.dataService.createAnnouncement(title, this.user?.username, body, new Date().toISOString().split('T')[0], this.orgName).subscribe(res => {
      this.newAnnouncement.emit(res);
    });

    this.close();
  }

  close(): void {
    this.activeModal.close();
  }

}
