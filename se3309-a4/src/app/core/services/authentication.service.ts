import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { Constants } from "../constants/constants";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  httpHeaders = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || 'N/A'
  });

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {
  }

  continueAsGuest(): Observable<any> {
    return this.http.post<any>(`${Constants.apiPaths.credentials}/guest`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  login(username: string, password: string, email: string): Observable<any> {
    return this.http.post<any>(`${Constants.apiPaths.credentials}/login`, {
      "username": username,
      "email": email,
      "password": password,
    }, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  createAccount(username: string, email: string, password: string): Observable<any> {
    return this.http.put<any>(`${Constants.apiPaths.credentials}/create`, {
      "username": username,
      "email": email,
      "password": password
    }, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${Constants.apiPaths.credentials}`,{headers: this.httpHeaders}).pipe(
      map((data: any[]) => data),
      catchError(this.handleError)
    );
  }

  updateUser(user: string, email: string, access_level: number): Observable<any> {
    return this.http.post<any>(`${Constants.apiPaths.credentials}`,{name: user, email: email, access_level: access_level},{headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }


  private handleError(err: HttpErrorResponse) {


    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {

      errorMessage = `An error occurred: ${err.error.message}`;
    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    return throwError(err.error);
  }
}
