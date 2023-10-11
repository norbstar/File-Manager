import { Component, ComponentRef, Input, OnInit, ViewChild } from '@angular/core';

import { AnchorDirective } from 'src/app/shared/anchor.directive';
import { AdInterface } from '../ad.interface';
import { SampleAdComponent } from '../samples/sample-ad/sample-ad.component';
import { OtherSampleAdComponent } from '../samples/other-sample-ad/other-sample-ad.component';

@Component({
  selector: 'app-ad-insert',
  templateUrl: './ad-insert.component.html',
  styleUrls: ['./ad-insert.component.css']
})
export class AdInsertComponent implements OnInit {
  @Input() index: number;

  @ViewChild(AnchorDirective, {static: true}) anchor!: AnchorDirective;

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  ngOnInit(): void {
    const viewContainerRef = this.anchor.viewContainerRef;
    viewContainerRef.clear();

    const id = this.getRandomInt(2);

    let componentRef: ComponentRef<AdInterface>;

    switch (id) {
      case 0:
        componentRef = viewContainerRef.createComponent<AdInterface>(SampleAdComponent);
        componentRef.instance.data = { id: this.index + 1, name: 'Sample Ad' };
        break;
        
      case 1:
        componentRef = viewContainerRef.createComponent<AdInterface>(OtherSampleAdComponent);
        componentRef.instance.data = { id: this.index + 1, name: 'Other Sample Ad' };
        break;
    }
  }
}
