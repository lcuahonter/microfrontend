import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { TableComponent } from '../../../../../shared/components/table/table.component';
import { TableData } from '../../../../../shared/interfaces/table.interface';
import { APP_ROUTES } from '../../../../../app.routes.constants';
import { STORE_FRONT_ROUTES } from '../../../../../routes.constants';
import { ConsultasAereosService } from '../../services/consultas-aereos/consultas-aereos.service';
import { catchError, of, take, tap } from 'rxjs';
import { DimensionsResponse, ShipmentResponse } from '../../interfaces/consultas-aereos.interface';
import { GuidesResponse } from '../../interfaces/consultas-aereos.interface';
import { MANIFIESTO_AEREO_ROUTES } from '../../services/manifiesto-aereo.routes.constants';
import { RoutingService } from '@/core/services/routing.service';

@Component({
  selector: 'app-air-waybill-detail',
  standalone: true,
  imports: [TableComponent, NgIf],
  templateUrl: './air-waybill-detail.component.html',
})
export class AirWaybillDetailComponent implements OnInit {
  private consultasAereosService = inject(ConsultasAereosService);
  private routingService = inject(RoutingService);
  @Input() isManifest = signal<boolean>(false);
  tableDimensions = signal<TableData>({
    headers: ['Largo Producto', 'Ancho Producto', 'Altura Producto', 'Número Piezas', 'Peso'],
    body: [],
  });
  isLoadingDataDimensions = signal<boolean>(true);
  tableShipment = signal<TableData>({
    headers: [
      'Consecutivo',
      'Descripción de la Mercancía',
      'Número Piezas',
      'Peso Bruto',
      'Peso Neto',
      'Total Cargos y Descuentos',
      'Harmonized Commodity Code Coded',
      'Harmonized Commodity Code',
    ],
    body: [],
  });
  isLoadingDataShipment = signal<boolean>(true);
  tableGuides = signal<TableData>({
    headers: [
      'No. Documento Transporte',
      'Código Tipo Envío',
      'Número Piezas',
      'Peso Bruto',
      'Volumen',
      'Lugar Origen (Código)',
      'Lugar Origen',
      'Lugar Destino (Código)',
      'Lugar Destino',
      'Descripción de Mercancía',
    ],
    body: [],
  });
  isLoadingDataGuides = signal<boolean>(true);
  errorDataGuides = false;
  errorDataShipment = false;
  errorDataDimensions = false;

  ngOnInit(): void {
    this.getDimensions();
    this.getShipments();
    this.getGuides();
  }

  getDimensions(): void {
    this.consultasAereosService
      .getDimensions()
      .pipe(
        tap((resp: DimensionsResponse) => {
          if (resp.codigo === '00') {
            const body = resp.datos.map((item) => [
              item.largoProducto,
              item.anchoProducto,
              item.alturaProducto,
              item.numeroPiezas,
              item.peso,
            ]);
            this.tableDimensions.set({
              ...this.tableDimensions(),
              body,
            });
          }
          this.isLoadingDataDimensions.set(false);
        }),
        catchError(() => {
          this.errorDataDimensions = true;
          this.isLoadingDataDimensions.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  getShipments(): void {
    this.consultasAereosService
      .getShipments()
      .pipe(
        tap((resp: ShipmentResponse) => {
          if (resp.codigo === '00') {
            const body = resp.datos.map((item) => [
              item.consecutivo,
              item.descripcionMercancia,
              item.numeroPiezas,
              item.pesoBruto,
              item.pesoNeto,
              item.totalCargosDescuentos,
              item.harmonizedCommodityCodeCoded,
              item.harmonizedCommodityCode,
            ]);
            this.tableShipment.set({
              ...this.tableShipment(),
              body,
            });
          }
          this.isLoadingDataShipment.set(false);
        }),
        catchError(() => {
          this.errorDataShipment = true;
          this.isLoadingDataShipment.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  getGuides(): void {
    this.consultasAereosService
      .getGuides()
      .pipe(
        tap((resp: GuidesResponse) => {
          if (resp.codigo === '00') {
            const body = resp.datos.map((item) => [
              item.noDocumentoTransporte,
              item.codigoTipoEnvio,
              item.pesoBruto,
              item.volumen,
              item.lugarOrigenCodigo,
              item.lugarOrigen,
              item.lugarDestinoCodgio,
              item.lugarDestino,
              item.descripcionMercancia,
            ]);
            this.tableGuides.set({
              ...this.tableGuides(),
              body,
            });
          }
          this.isLoadingDataGuides.set(false);
        }),
        catchError((e) => {
          this.errorDataGuides = true;
          this.isLoadingDataGuides.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  navigateToDocumentDetails() {
    this.routingService.navigate([
      STORE_FRONT_ROUTES.CONSULTAS,
      MANIFIESTO_AEREO_ROUTES.DETALLES_MANIFIESTO_AEREO,
      this.consultasAereosService.idHeader(),
      MANIFIESTO_AEREO_ROUTES.DOCUMENTO_TRANSPORTE_DETALLE_INFORMACION,
    ]);
  }
}
