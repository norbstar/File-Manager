import { Component, Input, OnInit } from '@angular/core';

import { AdInterface } from '../../ad.interface';

@Component({
  selector: 'app-sample-ad',
  templateUrl: './sample-ad.component.html',
  styleUrls: ['./sample-ad.component.css']
})
export class SampleAdComponent implements AdInterface, OnInit {
  @Input() data: any;

  id: number;
  name: string;

  ngOnInit(): void {
    this.id = this.data.id;
    this.name = this.data.name;
  }
}