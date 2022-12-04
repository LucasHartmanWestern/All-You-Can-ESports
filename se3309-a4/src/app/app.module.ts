import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbActiveModal, NgbModal, NgbModule, NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './core/common/header/header.component';
import { SearchComponent } from './core/common/header/search/search.component';
import { ContentComponent } from './home/content/content.component';
import { UsersComponent } from "./core/modals/users/users.component";
import { DetailsComponent } from './details/details.component';
import { AnnouncementComponent } from './core/modals/announcement/announcement.component';
import { FantasyComponent } from './core/modals/fantasy/fantasy.component';
import { TicketGraphComponent } from './core/modals/ticket-graph/ticket-graph.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    SearchComponent,
    ContentComponent,
    UsersComponent,
    DetailsComponent,
    AnnouncementComponent,
    FantasyComponent,
    TicketGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
