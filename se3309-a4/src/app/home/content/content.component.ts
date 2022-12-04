import { Component, OnInit } from '@angular/core';
import { DataService } from "../../core/services/data.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(private dataService: DataService, private spinner: NgxSpinnerService) { }

  games: { name: string }[] = [];
  orgs: { name: string, team_count: number }[] = [];
  matches: { match_date: string, team1: string, team2: string, location: string, tournament: string | null, winner: number }[] = [];
  teams: { name: string, wins: number, losses: number, organization: string }[] = [];
  tournaments: {name: string, start_date: string, end_date: string, game: string, entries: {team_name: string}[] }[] = [];

  ngOnInit(): void {
    this.dataService.newSearch$.subscribe((res: any) => {
      this.games = [];
      this.orgs = [];
      this.matches = [];
      this.teams = [];
      this.tournaments = [];

      this.spinner.show();
      if (res?.search?.type === 'org') {
        this.spinner.show();
        this.dataService.getOrgs().subscribe(orgs => {
          this.spinner.hide();
          this.orgs = orgs;
        }, error => {
          this.spinner.hide();
        });
      }
      if (res?.search?.type === 'game') {
        this.dataService.getGames().subscribe(games => {
          this.spinner.hide();
          this.games = games;
        }, error => {
          this.spinner.hide();
        });
      }
      if (res?.search?.type === 'match') {
        this.dataService.getMatches(res?.search?.criteria?.match_date, res?.search?.criteria?.team_name, res?.search?.criteria?.location, res?.search?.criteria?.tournament)
          .subscribe(matches => {
            this.spinner.hide();
            this.matches = matches;
            }, error => {
            this.spinner.hide();
          });
      }
      if (res?.search?.type === 'team') {
        this.dataService.getTeams(res?.search?.criteria?.team_name, res?.search?.criteria?.game_name, res?.search?.criteria?.org_name)
          .subscribe(teams => {
            this.spinner.hide();
            this.teams = teams;
            }, error => {
            this.spinner.hide();
        });
      }
      if (res?.search?.type === 'tournament') {
        // this.dataService.getTournaments(res?.search?.criteria?.name)
        //   .subscribe(tournaments => {
        //     this.spinner.hide();
        //     this.tournaments = tournaments;
        //   }, error => {
        //     this.spinner.hide();
        // });
        this.addSampleData();
        this.spinner.hide();
      }
    });
  }

  setDetails(type: string, details: any): void {
    this.dataService.details$.next({type: type, details: details});
  }

  getTeamsByGame(gameName: string): void {
    this.games = [];
    this.spinner.show();
    this.dataService.getTeams('', gameName, '')
      .subscribe(teams => {
        this.spinner.hide();
        this.teams = teams;
      }, error => {
        this.spinner.hide();
    });
  }

  addSampleData(): void {
    this.tournaments = [
      {name: "aijmoootqqmhywtmr", start_date: "2022-01-01", end_date: "2022-01-02", game: "Elden Ring", entries: [
          {team_name: "Team 1"},
          {team_name: "Team 2"},
          {team_name: "Team 3"}
          ]
      },{name: "Tournament 2", start_date: "2022-01-01", end_date: "2022-01-02", game: "Elden Ring", entries: [
          {team_name: "Team 1"},
          {team_name: "Team 2"},
          {team_name: "Team 3"}
        ]
      },{name: "Tournament 3", start_date: "2022-01-01", end_date: "2022-01-02", game: "Elden Ring", entries: [
          {team_name: "Team 1"},
          {team_name: "Team 2"},
          {team_name: "Team 3"}
        ]
      },{name: "Tournament 4", start_date: "2022-01-01", end_date: "2022-01-02", game: "Elden Ring", entries: [
          {team_name: "Team 1"},
          {team_name: "Team 2"},
          {team_name: "Team 3"}
        ]
      },{name: "Tournament 5", start_date: "2022-01-01", end_date: "2022-01-02", game: "Elden Ring", entries: [
          {team_name: "Team 1"},
          {team_name: "Team 2"},
          {team_name: "Team 3"}
        ]
      },{name: "Tournament 6", start_date: "2022-01-01", end_date: "2022-01-02", game: "Elden Ring", entries: [
          {team_name: "Team 1"},
          {team_name: "Team 2"},
          {team_name: "Team 3"}
        ]
      },
    ];
  }
}
