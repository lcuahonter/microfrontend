import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { TableComponent } from '@/shared/components/table/table.component';
import { catchError, of, take, tap } from 'rxjs';
import { AirWaybillService } from '../../../services/air-waybill.service';
import {
  Manisfest,
  ManisfestsResponse,
  MasterResponse,
  TypeSearch,
} from '../../../interfaces/air-waybill-forms.interface';
import { TableBodyData, TableData } from '@/shared/interfaces/table.interface';
import { SessionStorageService } from '@/shared/services/session-storage.service';

@Component({
  selector: 'app-manifest-table',
  standalone: true,
  imports: [TableComponent, NgIf],
  templateUrl: './manifest-table.component.html',
})
export class ManifestTableComponent implements OnInit {
  private airWaybillService = inject(AirWaybillService);
  private sessionStorage = inject(SessionStorageService);
  tableManifestData = signal<TableData>({
    headers: [
      'Empresa transportista',
      'No. Vuelo',
      'No. Manifiesto',
      'Lugar de carga',
      'Lugar de descarga',
      'Fecha de transmisión',
      'RFC Transmisor',
    ],
    body: [],
  });
  hiddenManifestData = signal<Object[]>([]);
  errorManifestsData = false;
  isLoadingManifestDataTable = signal<boolean>(true);
  tableManifestSelectedData = signal<TableData>({
    headers: [
      'Empresa transportista',
      'No. Vuelo',
      'No. Manifiesto',
      'Lugar de carga',
      'Lugar de descarga',
      'Fecha de transmisión',
      'RFC Transmisor',
    ],
    body: [],
  });
  errorManifestsSelectedData = false;
  isLoadingManifestSelectedDataTable = signal<boolean>(true);
  tableMasterData = signal<TableData>({
    headers: [
      'No. Guía Master',
      'CAAT',
      'Lugar de carga',
      'Lugar de descarga',
      'Fecha arribo',
      'Fecha de transmisión',
      'No. Piezas',
    ],
    body: [],
  });
  hiddenMasterData = signal<Object[]>([]);
  errorMasterData = false;
  isLoadingMasterDataTable = signal<boolean>(true);
  manifestSelected = signal<boolean>(false);

  ngOnInit(): void {
    this.getManifests(this.airWaybillService.searchType() === TypeSearch.CAAT);

    const manifestClicked = this.sessionStorage.get<Manisfest>('manifestClicked');
    if (this.airWaybillService.checkManifestClicked() && manifestClicked) {
      this.buildManifestSelectedTable(manifestClicked);
      this.getMasterByManifest(manifestClicked);
    }
  }
  onMasterSelected(manifest: Manisfest) {
    this.buildManifestSelectedTable(manifest);
    this.getMasterByManifest(manifest);
  }

  getMasterByManifest(manifest: Manisfest) {
    const { idHead } = manifest;
    this.airWaybillService.idHeadManifest.set(idHead);
    this.airWaybillService
      .getMasterByManifest()
      .pipe(
        tap((resp: MasterResponse) => {
          if (resp.codigo === '00') {
            const masters = this.airWaybillService.masterByManifest();
            const body = masters.map((item) => [
              item.numGuia,
              item.caat,
              item.lugarCarga,
              item.lugarDescarga,
              item.fechaArribo,
              item.fechaTransmision,
              item.numPiezas,
            ]);
            this.hiddenMasterData.set(masters);
            this.tableMasterData.set({ ...this.tableMasterData(), body });
          }
          this.isLoadingMasterDataTable.set(false);
        }),
        catchError(() => {
          this.errorMasterData = true;
          this.isLoadingMasterDataTable.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  getManifests(fromCaat = false) {
    this.airWaybillService
      .getManifests(fromCaat)
      .pipe(
        tap((resp: ManisfestsResponse) => {
          if (resp.codigo === '00') {
            const manifests = this.airWaybillService.manifests();
            const body = manifests.map((item) => [
              item.empresaTransportista,
              item.numVuelo,
              item.numManifiesto,
              item.lugarCarga,
              item.lugarDescarga,
              item.fechaHora,
              item.rfc,
            ]);
            this.hiddenManifestData.set(manifests);
            this.tableManifestData.set({ ...this.tableManifestData(), body });
          }
          this.isLoadingManifestDataTable.set(false);
        }),
        catchError(() => {
          this.errorManifestsData = true;
          this.isLoadingManifestDataTable.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  masterSelected(master: TableBodyData) {
    this.airWaybillService.redirectMasterDetails(master.hiddenData);
  }

  buildManifestSelectedTable(manifestData: Manisfest) {
    this.sessionStorage.set('manifestClicked', manifestData);
    const body = [
      [
        manifestData.empresaTransportista,
        manifestData.numVuelo,
        manifestData.numManifiesto,
        manifestData.lugarCarga,
        manifestData.lugarDescarga,
        manifestData.fechaHora,
        manifestData.rfc,
      ],
    ];
    this.tableManifestSelectedData.set({ ...this.tableManifestSelectedData(), body });
    this.isLoadingManifestSelectedDataTable.set(false);
    this.manifestSelected.set(true);
  }
}
