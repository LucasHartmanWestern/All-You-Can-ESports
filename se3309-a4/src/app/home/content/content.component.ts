import { Component, OnInit } from '@angular/core';
import { DataService } from "../../core/services/data.service";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.newSearch$.subscribe((res: any) => {
      console.log(res);
    });
  }

}
