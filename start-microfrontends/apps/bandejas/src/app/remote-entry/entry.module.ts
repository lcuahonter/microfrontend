import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RemoteEntryComponent } from './entry.component';
import { appRoutes } from '../app.routes';
import { provideRouter } from '@angular/router';

@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RemoteEntryComponent
  ],
  providers: [
    provideRouter(appRoutes),
  ],
  bootstrap: []
})
export class RemoteEntryModule { }