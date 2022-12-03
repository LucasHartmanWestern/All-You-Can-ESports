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
  bets: { holder: number, amount: number, location: string, match_date: string, team: string }[] = [];
  teamPlayers: {id: number, name: string, wins: number, losses: number}[] = [];
  leaderboard: { name: string, wins: number, losses: number }[] = [];

  helper = new JwtHelperService();
  user: any = this.helper.decodeToken(localStorage.getItem('token') || undefined);

  constructor(private dataService: DataService, private modalService: NgbModal, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    if (this.data?.type === 'org') {
      this.spinner.show();
      this.dataService.getTeams('', '', this?.data?.details?.name)
        .subscribe(teams => {
          this.spinner.hide();
          this.orgTeams = teams;
        }, error => {
          this.spinner.hide();
      });

      this.dataService.getAnnouncements(this?.data?.details?.name)
        .subscribe(announcements => {
          this.spinner.hide();
          this.announcements = announcements;
        }, error => {
          this.spinner.hide();
      });
    }

    if (this.data?.type === 'match') {
      this.spinner.show();
      this.dataService.viewBets(this.data?.details?.match_date, this.data?.details?.location, this.data?.details?.team1).subscribe(bets => {
        this.spinner.hide();
        bets.forEach((bet: any) => this.bets.push(bet));
      }, error => this.spinner.hide());
      this.dataService.viewBets(this.data?.details?.match_date, this.data?.details?.location, this.data?.details?.team2).subscribe(bets => {
        this.spinner.hide();
        bets.forEach((bet: any) => this.bets.push(bet));
      }, error => this.spinner.hide());
    }

    if (this.data?.type === 'team') {
      this.getTeamPlayers();
    }

    if (this.data?.type === 'tournament') {
      // this.spinner.show();
      // this.dataService.getTournamentLeaderboard(this.data?.details?.name).subscribe(teams => {
      //   this.spinner.hide();
      //   this.leaderboard = teams;
      // }, error => this.spinner.hide());

      this.addSampleData();
    }

    console.log(this.data);
  }

  getTeamPlayers(): void {
    this.spinner.show();
    this.dataService.getTeamPlayers(this.data?.details?.name).subscribe(res => {
      this.teamPlayers = res;
      this.spinner.hide();
    }, error => {
      alert(error);
      this.spinner.hide();
    });
  }

  createAnnouncement(): void {
    let modalRef = this.modalService.open(AnnouncementComponent, {centered: true, windowClass: 'AnnouncementModalClass'});
    modalRef.componentInstance.orgName = this.data?.details?.name;
    modalRef.componentInstance.newAnnouncement.subscribe((announcement: any) => this.announcements.push(announcement));
  }

  deleteAnnouncement(announcement: any): void {
    this.spinner.show();
    this.dataService.deleteAnnouncement(announcement?.title, announcement?.author, announcement?.body, announcement?.creation_date, this.data?.details?.name).subscribe(res => {
      this.spinner.hide();
      this.announcements.filter(announcement => announcement !== res);
    }, error => {
      alert(error);
      this.spinner.hide();
    });
  }

  placeBet(event: any, team: string, amount: string): void {
    this.spinner.show();
    event.preventDefault();
    this.dataService.placeBet(parseInt(amount), this.user?.user_id, this.data?.details?.location, this.data?.details?.match_date.split('T')[0], team).subscribe(res => {
      this.spinner.hide();
      this.bets.push(res);
    },error => {
      alert(error);
      this.spinner.hide();
    });
  }

  updateMatchOutcome(event: any, result: string): void {
    this.spinner.show();
    event.preventDefault();
    this.dataService.updateOutcome(this.data?.details?.location, this.data?.details?.match_date.split('T')[0], this.data?.details?.team1, this.data?.details?.team2, parseInt(result)).subscribe(res => {
      this.spinner.hide();
      // @ts-ignore
      this.data.details = res;
    }, error => {
      alert(error);
      this.spinner.hide();
    });
  }

  addSampleData(): void {
    this.leaderboard = [
      { name: "Team 1", wins: 10, losses: 1 },
      { name: "Team 2", wins: 9, losses: 2 },
      { name: "Team 3", wins: 8, losses: 2 },
      { name: "Team 4", wins: 6, losses: 5 },
      { name: "Team 5", wins: 4, losses: 6 },
      { name: "Team 6", wins: 2, losses: 8 }
    ];
  }
}
