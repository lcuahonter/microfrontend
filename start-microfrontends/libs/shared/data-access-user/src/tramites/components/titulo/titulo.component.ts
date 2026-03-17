import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ng-titulo',
  standalone: true,
   imports: [CommonModule],
  templateUrl: './titulo.component.html',
  styleUrl: './titulo.component.scss',
  host: {}
})
export class TituloComponent {
  @Input() titulo!: string;
  @Input() fontSize!: boolean;

}
