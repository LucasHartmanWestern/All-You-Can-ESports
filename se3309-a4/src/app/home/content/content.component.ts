import { Component, OnInit } from '@angular/core';
import { DataService } from "../../core/services/data.service";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(private dataService: DataService) { }

  games: { game_name: string }[] = [];
  orgs: { org_name: string, team_count: number }[] = [];
  matches: { match_date: string, team1_name: string, team2_name: string, location: string, tournament: string }[] = [];
  teams: { name: string, wins: number, losses: number, organization: string }[] = [];

  ngOnInit(): void {
    this.dataService.newSearch$.subscribe((res: any) => {
      this.games = [];
      this.orgs = [];
      this.matches = [];
      this.teams = [];

      this.makeSample(res?.search?.type);

      // if (res?.search?.type === 'org') this.dataService.getOrgs().subscribe(orgs => this.orgs = orgs);
      // if (res?.search?.type === 'game') this.dataService.getGames().subscribe(games => this.games = games);
      // if (res?.search?.type === 'match') this.dataService.getMatches(res?.search?.criteria?.match_date, res?.search?.criteria?.team_name, res?.search?.criteria?.location, res?.search?.criteria?.tournament)
      //   .subscribe(matches => this.matches = matches);
      // if (res?.search?.type === 'team') this.dataService.getTeams(res?.search?.criteria?.team_name, res?.search?.criteria?.game_name, res?.search?.criteria?.org_name)
      //   .subscribe(teams => this.teams = teams);
    });
  }

  setDetails(type: string, details: any): void {
    this.dataService.details$.next({type: type, details: details});
  }


  makeSample(type: string): void {
    if (type === 'org') {
      this.orgs = [
        { org_name: "test 1", team_count: 1 },
        { org_name: "test 2", team_count: 3 }
      ];
    }

    if (type === 'game') {
      this.games = [
        { game_name: "test 1" },
        { game_name: "test 2" },
        { game_name: "test 3" },
        { game_name: "test 4" }
      ];
    }

    if (type === 'match') {
      this.matches = [
        { match_date: "2022-01-01", team1_name: "Test 1", team2_name: "Test 2", location: "Test Location", tournament: "Test Tournament" },
        { match_date: "2022-01-02", team1_name: "Test 1", team2_name: "Test 2", location: "Test Location", tournament: "Test Tournament" },
        { match_date: "2022-01-03", team1_name: "Test 1", team2_name: "Test 2", location: "Test Location", tournament: "Test Tournament" },
        { match_date: "2022-01-04", team1_name: "Test 1", team2_name: "Test 2", location: "Test Location", tournament: "Test Tournament" },
        { match_date: "2022-01-05", team1_name: "Test 1", team2_name: "Test 2", location: "Test Location", tournament: "Test Tournament" }
      ];
    }

    if (type === 'team') {
      this.teams = [
        { name: "Test 1", wins: 1, losses: 2, organization: "Test" },
        { name: "Test 2", wins: 2, losses: 3, organization: "Test" },
        { name: "Test 3", wins: 3, losses: 4, organization: "Test" },
        { name: "Test 4", wins: 4, losses: 5, organization: "Test" },
        { name: "Test 5", wins: 5, losses: 6, organization: "Test" },
        { name: "Test 5", wins: 5, losses: 6, organization: "Test" },
        { name: "Test 5", wins: 5, losses: 6, organization: "Test" },
        { name: "Test 5", wins: 5, losses: 6, organization: "Test" },
        { name: "Test 5", wins: 5, losses: 6, organization: "Test" },
        { name: "Test 5", wins: 5, losses: 6, organization: "Test" },
        { name: "Test 5", wins: 5, losses: 6, organization: "Test" },
        { name: "Test 2", wins: 2, losses: 3, organization: "Test" },
        { name: "Test 3", wins: 3, losses: 4, organization: "Test" },
        { name: "Test 4", wins: 4, losses: 5, organization: "Test" },
        { name: "Test 5", wins: 5, losses: 6, organization: "Test" },
        { name: "Test 5", wins: 5, losses: 6, organization: "Test" },
        { name: "Test 5", wins: 5, losses: 6, organization: "Test" },
        { name: "Test 5", wins: 5, losses: 6, organization: "Test" },
        { name: "Test 5", wins: 5, losses: 6, organization: "Test" },
        { name: "Test 5", wins: 5, losses: 6, organization: "Test" },
        { name: "Test 5", wins: 5, losses: 6, organization: "Test" }
      ];
    }
  }
}
