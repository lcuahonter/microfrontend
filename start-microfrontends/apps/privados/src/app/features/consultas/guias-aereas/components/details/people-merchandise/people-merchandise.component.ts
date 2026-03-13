import { Component, inject, OnInit, signal } from '@angular/core';
import { AirWaybillService } from '../../../services/air-waybill.service';
import { TableData } from '@/shared/interfaces/table.interface';
import { PersonsMerchandiseResponse } from '../../../interfaces/air-waybill-forms.interface';
import { catchError, of, take, tap } from 'rxjs';
import { TableComponent } from '@/shared/components/table/table.component';

@Component({
  selector: 'app-people-merchandise',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './people-merchandise.component.html',
})
export class PeopleMerchandiseComponent implements OnInit {
  private airWaybillService = inject(AirWaybillService);
  tableMerchandiseData = signal<TableData>({
    headers: ['No. secuencia', 'Artículos por ITEM', 'Descripción', 'Cantidad peso', 'UPM'],
    body: [],
  });
  errorMerchandiseData = false;
  isLoadingMerchandiseDataTable = signal<boolean>(true);
  tablePersonData = signal<TableData>({
    headers: ['Nombre', 'Dirección', 'Ciudad', 'País', 'Teléfono', 'Correo electrónico'],
    body: [],
  });
  errorPersonData = false;
  isLoadingPersonDataTable = signal<boolean>(true);

  ngOnInit(): void {
    this.getMerchandisesAndPersons();
  }

  getMerchandisesAndPersons() {
    this.airWaybillService
      .getMerchandisesAndPersons()
      .pipe(
        tap((resp: PersonsMerchandiseResponse) => {
          if (resp.codigo === '00') {
            const merchandises = this.airWaybillService.merchandises();
            const body = merchandises.map((item) => [
              item.numSecuencia,
              item.articulosITEM,
              item.descripcion,
              item.cantidadPeso,
              item.ump,
            ]);
            this.tableMerchandiseData.set({ ...this.tableMerchandiseData(), body });

            const persons = this.airWaybillService.persons();
            const bodyPerson = persons.map((item) => [
              item.nombre,
              item.direccion,
              item.ciudad,
              item.pais,
              item.telefono,
              item.correo,
            ]);
            this.tablePersonData.set({ ...this.tablePersonData(), body: bodyPerson });
          }
          this.isLoadingMerchandiseDataTable.set(false);
          this.isLoadingPersonDataTable.set(false);
        }),
        catchError(() => {
          this.errorMerchandiseData = true;
          this.errorPersonData = true;
          this.isLoadingMerchandiseDataTable.set(false);
          this.isLoadingPersonDataTable.set(false);

          return of();
        }),
        take(1),
      )
      .subscribe();
  }
}
