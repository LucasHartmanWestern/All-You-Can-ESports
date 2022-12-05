import { Component, Input, OnInit } from '@angular/core';
import { DataService } from "../core/services/data.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AnnouncementComponent } from "../core/modals/announcement/announcement.component";
import { JwtHelperService } from "@auth0/angular-jwt";
import { NgxSpinnerService } from "ngx-spinner";
import { TicketGraphComponent } from "../core/modals/ticket-graph/ticket-graph.component";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  @Input() data: { type: string, details: any } | null = null;

  orgTeams: { team_name: string, wins: number, losses: number, organization: string }[] = [];
  announcements: { title: string, author: string, body: string, creation_date: string }[] = [];
  openBets: boolean = false;
  bets: { holder: number, amount: number, location: string, match_date: string, team: string }[] = [];
  teamPlayers: {id: number, name: string, wins: number, losses: number}[] = [];
  leaderboard: { team_name: string, wins: number, losses: number }[] = [];
  tournamentMatches: { match_date: string, team1: string, team2: string, location: string, tournament: string | null, winner: number }[] = [];

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
      this.getTeamPlayers('Org');
    }

    if (this.data?.type === 'tournament') {
      this.spinner.show();
      this.dataService.getTournamentLeaderboard(this.data?.details?.name).subscribe(teams => {
        this.spinner.hide();
        this.leaderboard = teams;
      }, error => this.spinner.hide());

      this.spinner.show();
      this.dataService.getMatches('', '', '', this.data?.details?.name).subscribe(matches => {
        this.tournamentMatches = matches;
        this.spinner.hide();
      }, error => this.spinner.hide());

    }

    console.log(this.data);
  }

  getFormattedAnnouncements(): any[] {
    return this.announcements.map(a => {
      a.creation_date = a.creation_date.split('T')[0];
      return a;
    }).sort((a: any, b: any) => {
      return a > b ? 1 : a < b ? -1 : 0;
    });
  }

  getTeamPlayers(team_type: string): void {
    this.spinner.show();
    this.dataService.getTeamPlayers(this.data?.details?.team_name, team_type).subscribe(res => {
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
      this.announcements.splice(this.announcements.indexOf(announcement), 1);
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

  openPurchaseGraph(): void {
    let modalRef = this.modalService.open(TicketGraphComponent, {centered: true, windowClass: 'TicketGraphModalClass'});
    if (this.data?.type === 'tournament') modalRef.componentInstance.tournamentName = this.data?.details?.name;
    if (this.data?.type === 'match') modalRef.componentInstance.matchDetails = {match_date: this.data?.details?.match_date, match_location: this.data?.details?.location};
  }
}
