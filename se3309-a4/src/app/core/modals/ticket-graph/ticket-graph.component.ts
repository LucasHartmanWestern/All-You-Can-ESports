import { Component, Input, OnInit } from '@angular/core';
import { DataService } from "../../services/data.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-ticket-graph',
  templateUrl: './ticket-graph.component.html',
  styleUrls: ['./ticket-graph.component.scss']
})
export class TicketGraphComponent implements OnInit {

  @Input() tournamentName: string | undefined = undefined;
  @Input() matchDetails: {match_location: string, match_date: string} | null = null;

  ppvData: {purchase_date: Date}[] = [];

  lineChart: any;

  constructor(private dataService: DataService, public activeModal: NgbActiveModal, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.dataService.getPPVData(this.tournamentName, this.matchDetails?.match_location, this.matchDetails?.match_date.split('T')[0]).subscribe(data => {
      this.ppvData = data.map((purchase: any) => {
        return {purchase_date: new Date(purchase.purchase_date)}
      });

      this.lineChart = new Chart('lineChart', {
        type: 'line',
        data: {
          labels: this.getGraphLabels(),
          datasets: [{
            label: 'Ticket Sales By Day',
            data: this.getGraphValues(),
            fill: false,
            borderColor: "red",
            borderWidth: 1
          }]
        }
      });
    });
  }

  getGraphLabels(): string[] {
    const date = new Date(this.ppvData[0].purchase_date.getTime());

    const dates = [];

    while (date <= this.ppvData[this.ppvData.length - 1].purchase_date) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates.map(date => date.toISOString().split('T')[0]);
  }
  getGraphValues(): number[] {
    let values: number[] = [];

    this.getGraphLabels().forEach(date => {
      let dateCount = 0;
      this.ppvData.forEach(ppv => {
        if (ppv.purchase_date.toISOString().split('T')[0] === date) dateCount++;
      });
      values.push(dateCount);
    });

    return values;
  }

  close(): void {
    this.activeModal.close();
  }

}
