import { Component, Input, OnInit } from '@angular/core';
import { DataService } from "../core/services/data.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AnnouncementComponent } from "../core/modals/announcement/announcement.component";
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  @Input() data: { type: string, details: any } | null = null;

  orgTeams: { name: string, wins: number, losses: number, organization: string }[] = [];
  announcements: {title: string, author: string, body: string, creation_date: string}[] = [];

  helper = new JwtHelperService();
  user: any = this.helper.decodeToken(localStorage.getItem('token') || undefined);

  constructor(private dataService: DataService, private modalService: NgbModal) { }

  ngOnInit(): void {
    console.log(this.data);

    if (this.data?.type === 'org') {

      this.makeSampleOrgData();

      // this.dataService.getTeams('', '', this?.data?.details?.org_name)
      //   .subscribe(teams => this.orgTeams = teams);

      // this.dataService.getAnnouncements(this?.data?.details?.org_name)
      //   .subscribe(announcements => this.announcements = announcements);
    }
  }

  createAnnouncement(): void {
    let modalRef = this.modalService.open(AnnouncementComponent, {centered: true, windowClass: 'AnnouncementModalClass'});
    modalRef.componentInstance.orgName = this.data?.details?.org_name;
    modalRef.componentInstance.newAnnouncement.subscribe((announcement: any) => this.announcements.push(announcement));
  }

  deleteAnnouncement(announcement: any): void {
    this.dataService.deleteAnnouncement(announcement?.title, announcement?.author, announcement?.body, announcement?.creation_date, this.data?.details?.org_name).subscribe(res => {
      this.announcements.filter(announcement => announcement !== res);
    });
  }

  makeSampleOrgData(): void {
    this.orgTeams = [
      { name: "Test 1", wins: 1, losses: 2, organization: this.data?.details?.org_name },
      { name: "Test 2", wins: 2, losses: 3, organization: this.data?.details?.org_name },
      { name: "Test 3", wins: 3, losses: 4, organization: this.data?.details?.org_name },
      { name: "Test 4", wins: 4, losses: 5, organization: this.data?.details?.org_name },
      { name: "Test 5", wins: 5, losses: 6, organization: this.data?.details?.org_name },
      { name: "Test 5", wins: 5, losses: 6, organization: this.data?.details?.org_name },
      { name: "Test 5", wins: 5, losses: 6, organization: this.data?.details?.org_name },
      { name: "Test 5", wins: 5, losses: 6, organization: this.data?.details?.org_name },
      { name: "Test 5", wins: 5, losses: 6, organization: this.data?.details?.org_name },
      { name: "Test 5", wins: 5, losses: 6, organization: this.data?.details?.org_name },
      { name: "Test 5", wins: 5, losses: 6, organization: this.data?.details?.org_name },
      { name: "Test 2", wins: 2, losses: 3, organization: this.data?.details?.org_name },
      { name: "Test 3", wins: 3, losses: 4, organization: this.data?.details?.org_name },
      { name: "Test 4", wins: 4, losses: 5, organization: this.data?.details?.org_name },
      { name: "Test 5", wins: 5, losses: 6, organization: this.data?.details?.org_name },
      { name: "Test 5", wins: 5, losses: 6, organization: this.data?.details?.org_name },
      { name: "Test 5", wins: 5, losses: 6, organization: this.data?.details?.org_name },
      { name: "Test 5", wins: 5, losses: 6, organization: this.data?.details?.org_name },
      { name: "Test 5", wins: 5, losses: 6, organization: this.data?.details?.org_name },
      { name: "Test 5", wins: 5, losses: 6, organization: this.data?.details?.org_name },
      { name: "Test 5", wins: 5, losses: 6, organization: this.data?.details?.org_name }
    ];

    this.announcements = [
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 1", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 2", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 3", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 4", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 5", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 6", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 7", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 1", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 2", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 3", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 4", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 5", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 6", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 7", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 1", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 2", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 3", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 4", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 5", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 6", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 7", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 1", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 2", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 3", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 4", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 5", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 6", creation_date: "2022-10-10"},
      {title: "This is a title", author: "Lucas Hartman", body: "This is a body 7", creation_date: "2022-10-10"}
    ];
  }

}
