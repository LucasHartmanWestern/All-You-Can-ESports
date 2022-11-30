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
  announcements: { title: string, author: string, body: string, creation_date: string }[] = [];
  openBets: boolean = false;
  bets: { holder: number, amount: number, match_location: string, match_date: string, team: string }[] = [];

  helper = new JwtHelperService();
  user: any = this.helper.decodeToken(localStorage.getItem('token') || undefined);

  constructor(private dataService: DataService, private modalService: NgbModal) { }

  ngOnInit(): void {
    if (this.data?.type === 'org') {
      this.dataService.getTeams('', '', this?.data?.details?.org_name)
        .subscribe(teams => this.orgTeams = teams);

      this.dataService.getAnnouncements(this?.data?.details?.org_name)
        .subscribe(announcements => this.announcements = announcements);
    }

    if (this.data?.type === 'match') {
      this.dataService.viewBets(this.data?.details?.match_date, this.data?.details?.match_location, this.data?.details?.team1_name).subscribe(bets => {
        bets.forEach((bet: any) => this.bets.push(bet));
      });
      this.dataService.viewBets(this.data?.details?.match_date, this.data?.details?.match_location, this.data?.details?.team2_name).subscribe(bets => {
        bets.forEach((bet: any) => this.bets.push(bet));
      });
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

  placeBet(event: any, team: string, amount: string): void {
    event.preventDefault();
    this.dataService.placeBet(parseInt(amount), this.user?.user_id, this.data?.details?.match_location, this.data?.details?.match_date, team).subscribe(res => {
      this.bets.push(res);
    });
  }

  updateMatchOutcome(event: any, result: string): void {
    event.preventDefault();
    this.dataService.updateOutcome(this.data?.details?.match_location, this.data?.details?.match_date, this.data?.details?.team1_name, this.data?.details?.team2_name, parseInt(result)).subscribe(res => {
      // @ts-ignore
      this.data.details = res;
    });
  }

}
