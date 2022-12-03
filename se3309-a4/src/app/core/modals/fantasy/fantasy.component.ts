import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { DataService } from "../../services/data.service";
import { NgxSpinnerService } from "ngx-spinner";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-fantasy',
  templateUrl: './fantasy.component.html',
  styleUrls: ['./fantasy.component.scss']
})
export class FantasyComponent implements OnInit {

  helper = new JwtHelperService();
  user: any = this.helper.decodeToken(localStorage.getItem('token') || undefined);

  allPlayers: { id: number, name: string, wins: number, losses: number }[] = [];
  fantasyRoster: { id: number, name: string, wins: number, losses: number }[] = [];
  userTeams: {team_name: string, game_name: string}[] = [];
  selectedTeam: {team_name: string, game_name: string} | null = null;
  games: {name: string}[] = [];

  createForm: boolean = false;
  playerFilter: string | null = null;

  constructor(private dataService: DataService, public activeModal: NgbActiveModal, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // this.spinner.show();
    // this.dataService.getPlayers().subscribe(res => {
    //   this.allPlayers = res;
    //   this.spinner.hide();
    // }, error => {
    //   this.spinner.hide();
    //   alert(error);
    // });
    //
    // this.dataService.searchFantasyTeam(this.user.user_id).subscribe(res => {
    //   this.userTeams = res;
    //   this.spinner.hide();
    //   if (this.userTeams?.length) {
    //     this.selectTeam(this.userTeams[0]);
    //   }
    // }, error => {
    //   this.spinner.hide();
    //   alert(error);
    // });

    this.dataService.getGames().subscribe(res => {
      this.games = res;
    });

    this.addSampleData();
  }

  getFilteredPlayers(): any[] {
    return this.allPlayers.filter(player => {
      return player.name.toLowerCase().includes(this.playerFilter?.toLowerCase() || '');
    });
  }

  selectTeam(team_name: string): void {
    this.spinner.show();
    this.selectedTeam = this.userTeams[this.userTeams.findIndex(t => t.team_name === team_name)];
    this.dataService.getTeamPlayers(team_name).subscribe(players => {
      this.fantasyRoster = players;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      alert(error);
    });
  }

  createNewTeam(event: any, team_name: string, game_name: string): void {
    event.preventDefault();
    if (!team_name) return;
    this.createForm = false;
    this.userTeams.push({team_name: team_name, game_name: game_name});
    this.selectedTeam = this.userTeams[this.userTeams.length - 1];
    this.fantasyRoster = [];
  }

  selectPlayer(player: { id: number, name: string, wins: number, losses: number }): void {
    let index = this.fantasyRoster.findIndex(p => p.id === player.id);
    index === -1 ? this.fantasyRoster.push(player) : this.fantasyRoster.splice(index, 1);
  }

  isOnTeam(player: { id: number, name: string, wins: number, losses: number }): boolean {
    return this.fantasyRoster.findIndex(p => p.id === player.id) !== -1;
  }

  saveTeam(): void {
    if (this.selectedTeam) {
      this.spinner.show();
      this.dataService.saveTeam(this.selectedTeam.team_name, this.selectedTeam.game_name, null, this.user.user_id, this.fantasyRoster.map(player => player.id)).subscribe(res => {
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        alert(error);
      });
    }

    this.close();
  }

  close(): void {
    this.activeModal.close();
  }

  addSampleData(): void {
    this.allPlayers = [
      { id: 1, name: "Test 1", wins: 1, losses: 9 },
      { id: 2, name: "Test 2", wins: 2, losses: 8 },
      { id: 3, name: "Test 3", wins: 3, losses: 7 },
      { id: 4, name: "Test 4", wins: 4, losses: 6 },
      { id: 5, name: "Test 5", wins: 5, losses: 5 },
      { id: 6, name: "Test 6", wins: 6, losses: 4 },
      { id: 7, name: "Test 7", wins: 7, losses: 3 },
      { id: 8, name: "Test 8", wins: 8, losses: 2 },
      { id: 9, name: "Test 9", wins: 9, losses: 1 },
      { id: 10, name: "Test 10", wins: 1, losses: 9 },
      { id: 11, name: "Test 11", wins: 2, losses: 8 },
      { id: 12, name: "Test 12", wins: 3, losses: 7 },
      { id: 13, name: "Test 13", wins: 4, losses: 6 },
      { id: 14, name: "Test 14", wins: 5, losses: 5 },
      { id: 15, name: "Test 15", wins: 6, losses: 4 },
      { id: 16, name: "Test 16", wins: 7, losses: 3 },
      { id: 17, name: "Test 17", wins: 8, losses: 2 },
      { id: 18, name: "Test 18", wins: 9, losses: 1 }
    ];
  }

}
