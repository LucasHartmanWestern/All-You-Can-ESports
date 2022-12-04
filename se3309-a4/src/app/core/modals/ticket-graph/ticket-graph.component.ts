import { Component, Input, OnInit } from '@angular/core';
import { DataService } from "../../services/data.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-ticket-graph',
  templateUrl: './ticket-graph.component.html',
  styleUrls: ['./ticket-graph.component.scss']
})
export class TicketGraphComponent implements OnInit {

  @Input() tournamentName: string | undefined = undefined;
  @Input() matchDetails: {match_location: string, match_date: string} | null = null;

  ppvData: {purchase_date: Date}[] = [];

  constructor(private dataService: DataService, public activeModal: NgbActiveModal, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // this.dataService.getPPVData(this.tournamentName, this.matchDetails?.match_location, this.matchDetails?.match_date).subscribe(data => {
    //   this.ppvData = data.map((purchase: any) => {
    //     return {purchase_date: new Date(purchase.purchase_date)}
    //   });
    // });

    this.addSampleData();
    console.log(this.ppvData);
  }

  close(): void {
    this.activeModal.close();
  }

  addSampleData(): void {
    this.ppvData = [
      {purchase_date: "2022-01-01"},
      {purchase_date: "2022-01-01"},
      {purchase_date: "2022-01-02"},
      {purchase_date: "2022-01-02"},
      {purchase_date: "2022-01-02"},
      {purchase_date: "2022-01-03"},
      {purchase_date: "2022-01-04"},
    ].map((purchase: any) => {
      return {purchase_date: new Date(purchase.purchase_date)}
    });
  }

}
