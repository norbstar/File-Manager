import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WindowRefService } from './services/window-ref.service';
import { HttpService } from './services/http-service';
import { AnchorDirective } from './shared/anchor.directive';
import { SampleAdComponent } from './page/ads/samples/sample-ad/sample-ad.component';
import { AdInsertComponent } from './page/ads/ad-insert/ad-insert.component';
import { OtherSampleAdComponent } from './page/ads/samples/other-sample-ad/other-sample-ad.component';
import { ModelInfoComponent } from './page/model-info/model-info.component';

@NgModule({
  declarations: [
    AppComponent,
    AnchorDirective,
    SampleAdComponent,
    AdInsertComponent,
    OtherSampleAdComponent,
    ModelInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    WindowRefService,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
