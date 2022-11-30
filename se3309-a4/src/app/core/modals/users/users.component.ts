import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { NgxSpinnerService } from "ngx-spinner";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  userList: { name: string, email: string, account_balance: number, access_level: number }[] = [];
  changeList: { user: { name: string, email: string, account_balance: number, access_level: number }, newValue: string, att: string }[] = [];

  constructor(private authenticationService: AuthenticationService, public activeModal: NgbActiveModal, private modalService: NgbModal, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();

    this.authenticationService.getUsers().subscribe(res => {
      this.userList = res;
      this.spinner.hide();
    });
  }

  changeMade(user: any, newValue: string, att: string): void {
    let currentChange = this.changeList.findIndex(change => {
      return (change.user == user && change.att == att);
    });

    if (currentChange !== -1) {
      if (newValue) this.changeList[currentChange].newValue = newValue;
      else this.changeList.splice(currentChange, 1);
    }
    else if (newValue) this.changeList.push({
      user: user,
      newValue: newValue,
      att: att
    });
  }

  saveChanges(): void {
    this.changeList.forEach(change => {
      this.authenticationService.updateUser(change?.user?.name, change?.user?.email, parseInt(change?.newValue)).subscribe(res => {
        console.log(res);
      });
    });
    this.close();
  }

  close(): void {
    this.activeModal.close();
  }
}
