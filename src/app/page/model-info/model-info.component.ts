import { Component, Input } from '@angular/core';

import { WindowRefService } from 'src/app/services/window-ref.service';
import { ModelInfo } from 'src/app/models/scrape.model';

@Component({
  selector: 'app-model-info',
  templateUrl: './model-info.component.html',
  styleUrls: ['./model-info.component.css']
})
export class ModelInfoComponent {
  @Input() modelInfo: ModelInfo;

  constructor(private windowRefService: WindowRefService) { }

  get modelInfoJson() { return JSON.stringify(this.modelInfo); }

  isOnline(): boolean {
    return this.modelInfo.status.includes('online');
  }

  launchURL(): void {
    this.windowRefService.nativeWindow.open(this.modelInfo.url, '_blank');
  }
}
