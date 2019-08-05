import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AutomatonComponent } from './automaton/automaton.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { ManagerComponent } from './manager/manager.component';

@NgModule({
  declarations: [
    AppComponent,
    AutomatonComponent,
    ToolbarComponent,
    ManagerComponent
  ],
  imports: [
    BrowserModule,
    CustomMaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
