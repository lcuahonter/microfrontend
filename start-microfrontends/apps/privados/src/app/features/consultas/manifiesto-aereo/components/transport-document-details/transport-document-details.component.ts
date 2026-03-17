import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { TableBodyData, TableData } from '../../../../../shared/interfaces/table.interface';
import { TableComponent } from '../../../../../shared/components/table/table.component';
import { APP_ROUTES } from '../../../../../app.routes.constants';
import { STORE_FRONT_ROUTES } from '../../../../../routes.constants';
import {
  ComplementInfoResponse,
  DocumentDetail,
  MeansTransportationResponse,
  MovementsResponse,
  ThirdPartyDetailsReponse,
} from '../../interfaces/consultas-aereos.interface';
import { ConsultasAereosService } from '../../services/consultas-aereos/consultas-aereos.service';
import { catchError, of, take, tap } from 'rxjs';
import { RoutingService } from '@/core/services/routing.service';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { MANIFIESTO_AEREO_ROUTES } from '../../services/manifiesto-aereo.routes.constants';

@Component({
  selector: 'app-transport-document-details',
  standalone: true,
  imports: [TableComponent, NgIf],
  templateUrl: './transport-document-details.component.html',
})
export class TransportDocumentDetailsComponent implements OnInit {
  private consultasAereosService = inject(ConsultasAereosService);
  private routingService = inject(RoutingService);
  private sessionStorage = inject(SessionStorageService);
  @Input() documentDetails = signal<DocumentDetail | null>(null);
  @Input() isManifest = signal<boolean>(false);
  tableDataThirdPartyDetails = signal<TableData>({
    headers: [
      'Descripción',
      'RFC',
      'CAAT',
      'Nombre',
      'Apartado Postal',
      'Calle y Número',
      'Código Postal',
      'Nombre Ciudad',
      'Nombre País',
    ],
    body: [],
  });
  hiddenDataThirdPartyDetail = signal<Object[]>([]);
  isLoadingDataThirdPartyDetail = signal<boolean>(true);
  tableDataTransportDetails = signal<TableData>({
    headers: [
      'Número de Vuelo',
      'Nombre Lugar Programado Despegue',
      'Fecha/Hora Salida',
      'Nombre Lugar Programado Arribo',
      'Fecha/Hora Programada Arribo',
    ],
    body: [],
  });
  isDataTransportDetails = signal<boolean>(true);
  tableDataInfoMovements = signal<TableData>({
    headers: ['Código de Servicio', 'Descripción Servicio'],
    body: [],
  });
  isLoadingInfoMovements = signal<boolean>(true);
  tableAdditionalInfo = signal<TableData>({
    headers: ['Regimen', 'Tipo', 'Descripción'],
    body: [],
  });
  isLoadingAdditionalInfo = signal<boolean>(true);
  errorThirdPartyDetailData = false;
  erroInfoMovementsData = false;
  errorAdditionalInfoData = false;
  errorTransportDetailsData = false;

  ngOnInit(): void {
    this.getThirdPartyDetails();
    this.getMeanTransportation();
    this.getMovements();
    this.getComplementInfo();
  }

  getThirdPartyDetails(): void {
    this.consultasAereosService
      .getThirdPartyDetails()
      .pipe(
        tap((resp: ThirdPartyDetailsReponse) => {
          if (resp.codigo === '00') {
            const body = resp.datos.map((item) => [
              item.descripcion,
              item.rfc,
              item.caat,
              item.nombre,
              item.apartado,
              `${item.calle} ${item.numero ?? ''}`,
              item.codigoPostal,
              item.nombreCiudad,
              item.nombrePais,
            ]);
            this.hiddenDataThirdPartyDetail.set(resp.datos);
            this.tableDataThirdPartyDetails.set({
              ...this.tableDataThirdPartyDetails(),
              body,
            });
          }
          this.isLoadingDataThirdPartyDetail.set(false);
        }),
        catchError(() => {
          this.errorThirdPartyDetailData = true;
          this.isLoadingDataThirdPartyDetail.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  getMeanTransportation(): void {
    this.consultasAereosService
      .getMeanTransportation()
      .pipe(
        tap((resp: MeansTransportationResponse) => {
          if (resp.codigo === '00') {
            const body = resp.datos.map((item) => [
              item.numeroVuelo,
              item.nombreLugarProgramadoDespegue,
              item.fechaHoraSalida,
              item.nombreLugarProgramadoArribo,
              item.fechaHoraProgramadaArribo,
            ]);
            this.tableDataTransportDetails.set({
              ...this.tableDataTransportDetails(),
              body,
            });
          }
          this.isDataTransportDetails.set(false);
        }),
        catchError(() => {
          this.errorTransportDetailsData = true;
          this.isDataTransportDetails.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  getMovements(): void {
    this.consultasAereosService
      .getMovements()
      .pipe(
        tap((resp: MovementsResponse) => {
          if (resp.codigo === '00') {
            const body = resp.datos.map((item) => [item.codigoServicio, item.descripcionServicio]);
            this.tableDataInfoMovements.set({
              ...this.tableDataInfoMovements(),
              body,
            });
          }
          this.isLoadingInfoMovements.set(false);
        }),
        catchError(() => {
          this.erroInfoMovementsData = true;
          this.isLoadingInfoMovements.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  getComplementInfo(): void {
    this.consultasAereosService
      .getComplementInfo()
      .pipe(
        tap((resp: ComplementInfoResponse) => {
          if (resp.codigo === '00') {
            const body = resp.datos.map((item) => [item.regimen, item.tipo, item.descripcion]);
            this.tableAdditionalInfo.set({
              ...this.tableAdditionalInfo(),
              body,
            });
          }
          this.isLoadingAdditionalInfo.set(false);
        }),
        catchError(() => {
          this.errorAdditionalInfoData = true;
          this.isLoadingAdditionalInfo.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  navigateToContacts(row: TableBodyData) {
    const idPerson = row.hiddenData.idPersona;
    this.consultasAereosService.idPerson.set(idPerson);
    this.sessionStorage.set('idPerson', idPerson);
    this.routingService.navigate([
      STORE_FRONT_ROUTES.CONSULTAS,
      MANIFIESTO_AEREO_ROUTES.DETALLES_MANIFIESTO_AEREO,
      this.consultasAereosService.idHeader(),
      MANIFIESTO_AEREO_ROUTES.CONTACTOS,
    ]);
  }
}
