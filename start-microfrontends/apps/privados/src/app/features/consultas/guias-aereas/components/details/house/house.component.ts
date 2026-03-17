import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { AirWaybillService } from '../../../services/air-waybill.service';
import { catchError, of, take, tap } from 'rxjs';
import { HouseDetailsResponse, HouseGuide } from '../../../interfaces/air-waybill-forms.interface';
import { TableBodyData, TableData } from '@/shared/interfaces/table.interface';
import { TableComponent } from '@/shared/components/table/table.component';

@Component({
  selector: 'app-house',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './house.component.html',
})
export class HouseComponent implements OnInit {
  @Output() houseClicked = new EventEmitter<HouseGuide>();
  private airWaybillService = inject(AirWaybillService);
  tableHousesData = signal<TableData>({
    headers: [
      'No. Guía house',
      'CAAT',
      'Lugar de carga',
      'Lugar de descarga',
      'Fecha Arribo',
      'Fecha de transmisión',
      'No.Piezas',
      'Tipo operación',
      'RFC transmisor',
    ],
    body: [],
  });
  hiddenHousesData = signal<Object[]>([]);
  errorHousesData = false;
  isLoadingHousesDataTable = signal<boolean>(true);

  ngOnInit(): void {
    this.getHouseDetails();
  }

  getHouseDetails() {
    this.airWaybillService
      .getHouseDetails()
      .pipe(
        tap((resp: HouseDetailsResponse) => {
          if (resp.codigo === '00') {
            const houseDetails = this.airWaybillService.housesDetails();
            const body = houseDetails.map((item) => [
              item.numGuia,
              item.caat,
              item.lugarCarga,
              item.lugarDescarga,
              item.fechaArribo,
              item.fechaTransmision,
              item.numPiezas,
              item.operacion,
              item.rfc,
            ]);
            this.hiddenHousesData.set(houseDetails);
            this.tableHousesData.set({ ...this.tableHousesData(), body });
          }
          this.isLoadingHousesDataTable.set(false);
        }),
        catchError(() => {
          this.errorHousesData = true;
          this.isLoadingHousesDataTable.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  houseSelected(tableData: TableBodyData) {
    this.houseClicked.emit(tableData.hiddenData);
  }
}
