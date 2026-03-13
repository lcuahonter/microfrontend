import { Component, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '@/shared/components/table/table.component';
import { AirWaybillService } from '../../../services/air-waybill.service';
import { TableBodyData, TableData } from '@/shared/interfaces/table.interface';
import { catchError, of, take, tap } from 'rxjs';
import { MasterGuidesResponse } from '../../../interfaces/air-waybill-forms.interface';

@Component({
  selector: 'app-master-table',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './master-table.component.html',
})
export class MasterTableComponent implements OnInit {
  private airWaybillService = inject(AirWaybillService);
  tableMastersData = signal<TableData>({
    headers: [
      'No. Guía master',
      'CAAT',
      'Lugar de carga',
      'Lugar de descarga',
      'Fecha Arribo',
      'Fecha de transmisión',
      'No.Piezas',
      'Tipo operación',
      'RFC transmisor',
      'Recinto Fiscalizado',
    ],
    body: [],
  });
  hiddenMastersData = signal<Object[]>([]);
  errorMastersData = false;
  isLoadingMastersDataTable = signal<boolean>(true);

  ngOnInit(): void {
    this.getMasters();
  }

  getMasters() {
    this.airWaybillService
      .getMasters()
      .pipe(
        tap((resp: MasterGuidesResponse) => {
          if (resp.codigo === '00') {
            const masters = this.airWaybillService.masterGuides();
            const body = masters.map((item) => [
              item.numGuia,
              item.caat,
              item.lugarCarga,
              item.lugarDescarga,
              item.fechaArribo,
              item.fechaTransmision,
              item.numPiezas,
              item.operacion,
              item.rfc,
              item.recintoFiscalizado,
            ]);
            this.hiddenMastersData.set(masters);
            this.tableMastersData.set({ ...this.tableMastersData(), body });
          }
          this.isLoadingMastersDataTable.set(false);
        }),
        catchError(() => {
          this.errorMastersData = true;
          this.isLoadingMastersDataTable.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  masterSelected(master: TableBodyData) {
    this.airWaybillService.redirectMasterDetails(master.hiddenData);
  }
}
