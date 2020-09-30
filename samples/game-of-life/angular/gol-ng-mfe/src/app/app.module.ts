import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';

import { CellComponent } from './components/cell/cell.component';
import { HostComponent } from './components/host/host.component';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [
    CellComponent,
    HostComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  entryComponents: [
    CellComponent,
    HostComponent
  ]
})
export class AppModule { 
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const cell = createCustomElement(CellComponent, 
                                 { injector: this.injector });
    customElements.define('ng-cell', cell);
    const host = createCustomElement(HostComponent, 
                                 { injector: this.injector });
    customElements.define('ng-host', host);
  }
}
