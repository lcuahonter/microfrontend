import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, NxWelcomeComponent, RouterModule,NgxSpinnerModule],
  selector: 'app-se-entry',
  template: `<router-outlet></router-outlet><ngx-spinner name="spinner" type="ball-clip-rotate" [fullScreen]="true"></ngx-spinner>`,
})
export class RemoteEntryComponent { }
