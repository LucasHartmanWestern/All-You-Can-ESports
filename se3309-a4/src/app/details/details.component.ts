import { Component, Input, OnInit } from '@angular/core';
import { DataService } from "../core/services/data.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AnnouncementComponent } from "../core/modals/announcement/announcement.component";
import { JwtHelperService } from "@auth0/angular-jwt";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  @Input() data: { type: string, details: any } | null = null;

  orgTeams: { name: string, wins: number, losses: number, organization: string }[] = [];
  announcements: { title: string, author: string, body: string, creation_date: string }[] = [];
  openBets: boolean = false;
  bets: { holder: number, amount: number, match_location: string, match_date: string, team: string }[] = [];

  helper = new JwtHelperService();
  user: any = this.helper.decodeToken(localStorage.getItem('token') || undefined);

  constructor(private dataService: DataService, private modalService: NgbModal, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    if (this.data?.type === 'org') {
      this.spinner.show();
      this.dataService.getTeams('', '', this?.data?.details?.org_name)
        .subscribe(teams => {
          this.spinner.hide();
          this.orgTeams = teams;
        }, error => {
          this.spinner.hide();
      });

      this.dataService.getAnnouncements(this?.data?.details?.org_name)
        .subscribe(announcements => {
          this.spinner.hide();
          this.announcements = announcements;
        }, error => {
          this.spinner.hide();
      });
    }

    if (this.data?.type === 'match') {
      this.spinner.show();
      this.dataService.viewBets(this.data?.details?.match_date, this.data?.details?.match_location, this.data?.details?.team1_name).subscribe(bets => {
        this.spinner.hide();
        bets.forEach((bet: any) => this.bets.push(bet));
      }, error => this.spinner.hide());
      this.dataService.viewBets(this.data?.details?.match_date, this.data?.details?.match_location, this.data?.details?.team2_name).subscribe(bets => {
        this.spinner.hide();
        bets.forEach((bet: any) => this.bets.push(bet));
      }, error => this.spinner.hide());
    }
  }

  createAnnouncement(): void {
    let modalRef = this.modalService.open(AnnouncementComponent, {centered: true, windowClass: 'AnnouncementModalClass'});
    modalRef.componentInstance.orgName = this.data?.details?.org_name;
    modalRef.componentInstance.newAnnouncement.subscribe((announcement: any) => this.announcements.push(announcement));
  }

  deleteAnnouncement(announcement: any): void {
    this.spinner.show();
    this.dataService.deleteAnnouncement(announcement?.title, announcement?.author, announcement?.body, announcement?.creation_date, this.data?.details?.org_name).subscribe(res => {
      this.spinner.hide();
      this.announcements.filter(announcement => announcement !== res);
    }, error => this.spinner.show());
  }

  placeBet(event: any, team: string, amount: string): void {
    this.spinner.show();
    event.preventDefault();
    this.dataService.placeBet(parseInt(amount), this.user?.user_id, this.data?.details?.match_location, this.data?.details?.match_date, team).subscribe(res => {
      this.spinner.hide();
      this.bets.push(res);
    }, error => this.spinner.hide());
  }

  updateMatchOutcome(event: any, result: string): void {
    this.spinner.show();
    event.preventDefault();
    this.dataService.updateOutcome(this.data?.details?.match_location, this.data?.details?.match_date, this.data?.details?.team1_name, this.data?.details?.team2_name, parseInt(result)).subscribe(res => {
      this.spinner.hide();
      // @ts-ignore
      this.data.details = res;
    }, error => this.spinner.hide());
  }

}
