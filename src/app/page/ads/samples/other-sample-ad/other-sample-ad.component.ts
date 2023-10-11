import { Component, Input, OnInit } from '@angular/core';

import { AdInterface } from '../../ad.interface';

@Component({
  selector: 'app-other-sample-ad',
  templateUrl: './other-sample-ad.component.html',
  styleUrls: ['./other-sample-ad.component.css']
})
export class OtherSampleAdComponent implements AdInterface, OnInit {
  @Input() data: any;

  id: number;
  name: string;

  ngOnInit(): void {
    this.id = this.data.id;
    this.name = this.data.name;
  }
}