import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, Subject, throwError } from "rxjs";
import { Constants } from "../constants/constants";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  newSearch$: Subject <{ search: any }> = new Subject<{ search: any }>();
  details$: Subject <{ type: string, details: any } | null> = new Subject<{ type: string, details: any } | null>();

  httpHeaders = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || 'N/A'
  });

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {
  }

  getOrgs(): Observable<any> {
    return this.http.get<any>(`${Constants.apiPaths.default}/orgs`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  getGames(): Observable<any> {
    return this.http.get<any>(`${Constants.apiPaths.default}/games`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  getTeams(team_name: string, game_name: string, org_name: string): Observable<any> {
    let params = `${team_name ? 'team_name=' + team_name : ''}${team_name && (game_name || org_name) ? '&' : ''}${game_name ? 'game_name=' + game_name : ''}${game_name && org_name ? '&' : ''}${org_name ? 'org_name=' + org_name : ''}`;
    console.log(params);
    return this.http.get<any>(`${Constants.apiPaths.default}/team?${params}`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  getMatches(match_date: string, team_name: string, location: string, tournament: string): Observable<any> {
    let params = `${match_date ? 'match_date=' + match_date : ''}${match_date && (team_name || location || tournament) ? '&' : ''}${team_name ? 'team_name=' + team_name : ''}${team_name && (location || tournament) ? '&' : ''}${location ? 'location=' + location : ''}${location && tournament ? '&' : ''}${tournament ? 'tournament=' + tournament : ''}`;
    return this.http.get<any>(`${Constants.apiPaths.default}/match?${params}`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  getAnnouncements(org_name: string): Observable<any> {
    return this.http.get<any>(`${Constants.apiPaths.announcements}?org_name=${org_name}`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  createAnnouncement(title: string, author: string, body: string, creation_date: string, org: string): Observable<any> {
    return this.http.put<any>(`${Constants.apiPaths.announcements}`, {
      title: title,
      author: author,
      body: body,
      creation_date: creation_date,
      org: org
    }, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  deleteAnnouncement(title: string, author: string, body: string, creation_date: string, org: string): Observable<any> {
    return this.http.post<any>(`${Constants.apiPaths.announcements}`, {
      title: title,
      author: author,
      body: body,
      creation_date: creation_date,
      org: org
    }, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  viewBets(match_date: string, match_location: string, team_name: string, holder?: number): Observable<any> {
    return this.http.get<any>(`${Constants.apiPaths.bets}?match_date=${match_date}&match_location=${match_location}&team_name=${team_name}${holder ? '&holder=' + holder : ''}`,
      {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  placeBet(amount: number, holder: number, match_location: string, match_date: string, team: string): Observable<any> {
    return this.http.put<any>(`${Constants.apiPaths.bets}`, {
      amount: amount,
      holder: holder,
      match_location: match_location,
      match_date: match_date,
      team: team
    }, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  updateOutcome(match_location: string, match_date: string, team1: string, team2: string, result: number): Observable<any> {
    return this.http.post<any>(`${Constants.apiPaths.match}/results`, {
      match_location: match_location,
      match_date: match_date,
      team1: team1,
      team2: team2,
      winner: result
    }, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  getPlayers(): Observable<any> {
    return this.http.get<any>(`${Constants.apiPaths.players}`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  saveTeam(team_name: string, game_name: string, organization: string | null, fantasy_builder: number | null, players: number[]): Observable<any> {
    return this.http.put<any>(`${Constants.apiPaths.team}`, {
      team_name: team_name,
      game_name: game_name,
      organization: organization,
      fantasy_builder: fantasy_builder,
      players: players
    }, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  searchFantasyTeam(fantasy_builder: number): Observable<any> {
    return this.http.get<any>(`${Constants.apiPaths.default}/fantasy?fantasy_builder=${fantasy_builder}`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  getTeamPlayers(team_name: string): Observable<any> {
    return this.http.get<any>(`${Constants.apiPaths.team}/players?team_name=${team_name}`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  getTournaments(name?: string): Observable<any> {
    return this.http.get<any>(`${Constants.apiPaths.tournaments}${name ? '?name=' + name : ''}`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  getTournamentLeaderboard(name: string): Observable<any> {
    return this.http.get<any>(`${Constants.apiPaths.tournaments}/leaderboard?name=${name}`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  getPPVData(tournament_name?: string, match_location?: string, match_date?: string): Observable<any> {
    return this.http.get<any>(`${Constants.apiPaths.ppv}?${tournament_name ? 'tournament_name=' + tournament_name : 'match_location=' + match_location + '&match_date=' + match_date}`,
      {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {


    alert(err.error);

    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {

      errorMessage = `An error occurred: ${err.error.message}`;
    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    return throwError(err.error);
  }
}
