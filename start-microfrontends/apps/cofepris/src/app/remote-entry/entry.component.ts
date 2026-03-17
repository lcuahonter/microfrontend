import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';

/**
 * Componente de entrada remoto para la aplicación Cofepris.
 * 
 * @export
 * @class RemoteEntryComponent
 */
@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSpinnerModule],
  selector: 'app-cofepris-entry',
  template: `<router-outlet></router-outlet><ngx-spinner name="spinner" type="ball-clip-rotate" [fullScreen]="true"></ngx-spinner>`,
})
export class RemoteEntryComponent { }