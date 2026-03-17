import { Component, inject, OnInit, signal } from '@angular/core';
import { AirWaybillService } from '../../../services/air-waybill.service';
import { TableBodyData, TableData } from '@/shared/interfaces/table.interface';
import { catchError, of, take, tap } from 'rxjs';
import { HouseGuidesResponse } from '../../../interfaces/air-waybill-forms.interface';
import { TableComponent } from '@/shared/components/table/table.component';

@Component({
  selector: 'app-house-table',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './house-table.component.html',
})
export class HouseTableComponent implements OnInit {
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

  pagination = signal({
    page: 1,
    totalPage: 1,
    totalRecords: 0,
    totalToLoad: 10,
  });

  ngOnInit(): void {
    this.getHouseGuides();
  }

  getHouseGuides() {
    this.airWaybillService
      .getHouses()
      .pipe(
        tap((resp: HouseGuidesResponse) => {
          if (resp.codigo === '00') {
            const houses = this.airWaybillService.houseGuides();
            this.hiddenHousesData.set(houses);

            const pageSize = 10;
            const firstPage = houses.slice(0, pageSize);
            const body = firstPage.map((item) => [
              item.numGuia,
              item.caat,
              item.lugarCarga,
              item.lugarDescarga,
              item.fechaArribo,
              item.fechaTransmision,
              item.numPiezas,
            ]);

            this.tableHousesData.set({
              ...this.tableHousesData(),
              body,
            });

            this.pagination.set({
              page: 1,
              totalPage: Math.ceil(houses.length / pageSize) || 1,
              totalRecords: houses.length,
              totalToLoad: pageSize,
            });
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

  onHousesPageChange(page: number) {
    const allHouses = this.hiddenHousesData() as any[];
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const pageSlice = allHouses.slice(start, end);
    const body = pageSlice.map((item) => [
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

    this.tableHousesData.set({
      ...this.tableHousesData(),
      body,
    });

    this.pagination.update((p) => ({ ...p, page }));
  }

  houseSelected(tableData: TableBodyData) {
    this.airWaybillService.redirectHouseDetails(tableData.hiddenData, false);
  }
}
