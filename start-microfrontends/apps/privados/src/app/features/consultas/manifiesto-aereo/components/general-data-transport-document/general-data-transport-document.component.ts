import { Component, inject, Input, signal } from '@angular/core';
import { GeneralDataDocument } from '../../interfaces/consultas-aereos.interface';

@Component({
  selector: 'app-general-data-transport-document',
  standalone: true,
  imports: [],
  templateUrl: './general-data-transport-document.component.html',
  styleUrl: './general-data-transport-document.component.scss',
})
export class GeneralDataTransportDocumentComponent {
  @Input() documentGeneralData = signal<GeneralDataDocument | null>(null);
}
