import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  @Input() data: { type: string, details: any } | null = null;

  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
