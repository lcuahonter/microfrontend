import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {TituloComponent } from '@ng-mf/data-access-user';
@Component({
  selector: 'app-terceros-relacionados-fabricante',
  standalone: true,
  imports: [CommonModule,TituloComponent],
  templateUrl: './terceros-relacionados-fabricante.component.html',
  styleUrl: './terceros-relacionados-fabricante.component.scss',
})
export class TercerosRelacionadosFabricanteComponent {}
