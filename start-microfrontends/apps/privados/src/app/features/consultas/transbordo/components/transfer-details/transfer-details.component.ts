import { Component, inject, OnInit, signal } from '@angular/core';
import { ManifestInfoComponent } from '../manifest-info/manifest-info.component';
import { TableData } from '@/shared/interfaces/table.interface';
import { TransferService } from '../../services/transfer.service';
import { catchError, of, take, tap } from 'rxjs';
import {
  HouseResponse,
  Master,
  MasterDetail,
  MasterDetailResponse,
  MasterResponse,
} from '../../interfaces/transfers.interface';
import { TableComponent } from '@/shared/components/table/table.component';
import { SessionStorageService } from '@/shared/services/session-storage.service';

@Component({
  selector: 'app-transfer-details',
  standalone: true,
  imports: [ManifestInfoComponent, TableComponent],
  templateUrl: './transfer-details.component.html',
})
export class TransferDetailsComponent implements OnInit {
  private transferService = inject(TransferService);
  private sessionStorage = inject(SessionStorageService);
  masterSelected = signal<boolean>(false);
  masterDetailSelected = signal<boolean>(false);
  tableMasterData = signal<TableData>({
    headers: ['Número de guía master', 'Tipo de operación', 'Recinto / IATA', 'Número de piezas'],
    body: [],
  });
  hiddenMasterData = signal<Object[]>([]);
  errorMasterData = false;
  isLoadingMasterDataTable = signal<boolean>(true);
  tableMasterSelectedData = signal<TableData>({
    headers: [
      'Número de guía master',
      'Número de secuencia',
      'Artículo por item',
      'Descripción',
      'Cantidad/Peso',
      'UMP',
    ],
    body: [],
  });
  hiddenMasterSelectedData = signal<Object[]>([]);
  errorMasterSelectedData = false;
  isLoadingMasterSelectedDataTable = signal<boolean>(true);
  tableHouseData = signal<TableData>({
    headers: [
      'Número de guía master',
      'Número de guía house',
      'CAAT',
      'Lugar de carga',
      'Lugar de descarga',
      'Fecha y hora de arribo',
      'Número de piezas',
      'Tipo de operación',
      'RFC de transmisión',
    ],
    body: [],
  });
  errorHouseData = false;
  isLoadingHouseDataTable = signal<boolean>(true);

  ngOnInit(): void {
    this.loadFromSessionStorage();
  }

  getMaster() {
    this.transferService
      .getMaster()
      .pipe(
        tap((resp: MasterResponse) => {
          if (resp.codigo === '00') {
            const masters = resp.datos;
            const body = masters.map((item) => [
              item.numMaster,
              item.tipoOperacion,
              item.recintoIATA,
              item.numpiezas,
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

  onMasterSelected(master: Master) {
    const idHeadDetail = master.idHead;
    this.transferService.idHeadDetail.set(idHeadDetail);
    this.sessionStorage.set('idHeadDetail', idHeadDetail);
    this.getMasterDetails();
  }

  getMasterDetails() {
    this.transferService
      .getMasterDetail()
      .pipe(
        tap((resp: MasterDetailResponse) => {
          if (resp.codigo === '00') {
            const masters = resp.datos;
            const body = masters.map((item) => [
              item.numMaster,
              item.secuencia,
              item.articulo,
              item.descripcion,
              item.cantidadPeso,
              item.ump,
            ]);
            this.hiddenMasterSelectedData.set(masters);
            this.tableMasterSelectedData.set({ ...this.tableMasterSelectedData(), body });
            this.masterSelected.set(true);
          }
          this.isLoadingMasterSelectedDataTable.set(false);
        }),
        catchError(() => {
          this.errorMasterSelectedData = true;
          this.isLoadingMasterSelectedDataTable.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  getHouse() {
    this.transferService
      .getHouses()
      .pipe(
        tap((resp: HouseResponse) => {
          if (resp.codigo === '00') {
            const houses = resp.datos;
            const body = houses.map((item) => [
              item.numMaster,
              item.numHouse,
              item.caat,
              item.lugarCarga,
              item.lugarDescarga,
              item.fechaHora,
              item.numpiezas,
              item.tipoOperacion,
              item.rfc,
            ]);
            this.tableHouseData.set({ ...this.tableHouseData(), body });
            this.masterDetailSelected.set(true);
          }
          this.isLoadingHouseDataTable.set(false);
        }),
        catchError(() => {
          this.errorHouseData = true;
          this.isLoadingHouseDataTable.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  onMasterDetailsSelected(masterDetail: MasterDetail) {
    const numGuideMaster = masterDetail.numMaster;
    this.transferService.numGuideMaster.set(numGuideMaster);
    this.sessionStorage.set('numGuideMaster', numGuideMaster);
    this.getHouse();
  }

  private loadFromSessionStorage() {
    const idHeadDetail = this.sessionStorage.get<string>('idHeadDetail');
    const numGuideMaster = this.sessionStorage.get<string>('numGuideMaster');
    if (idHeadDetail) {
      this.transferService.idHeadDetail.set(idHeadDetail);
      this.getMasterDetails();
    }
    if (numGuideMaster) {
      this.transferService.numGuideMaster.set(numGuideMaster);
      this.getHouse();
    }
  }
}
