import { Component, Input, signal } from '@angular/core';
import { TableComponent } from '../../../../../shared/components/table/table.component';
import { Totals } from '../../interfaces/consultas-aereos.interface';

@Component({
  selector: 'app-transport-document-totals',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './transport-document-totals.component.html',
  styleUrl: './transport-document-totals.component.scss',
})
export class TransportDocumentTotalsComponent {
  @Input() totals = signal<Totals | null>(null);
}
