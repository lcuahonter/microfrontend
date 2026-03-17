import { ButtonComponent } from '@/shared/components/button/button.component';
import { FormUtils } from '@/shared/utils/formUtils';
import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TypeSearch } from '../../interfaces/air-waybill-forms.interface';
import { ManifestFormComponent } from '../forms/manifest-form/manifest-form.component';
import { MasterFormComponent } from '../forms/master-form/master-form.component';
import { HouseFormComponent } from '../forms/house-form/house-form.component';
import { FlightFormComponent } from '../forms/flight-form/flight-form.component';
import { CaatFormComponent } from '../forms/caat-form/caat-form.component';
import { CatologosService } from '@/features/consultas/manifiesto-aereo/services/catalogos/catologos.service';
import { take, tap } from 'rxjs';
import { Custom } from '@/features/consultas/manifiesto-aereo/interfaces/catalogos.interface';
import { ManifestTableComponent } from '../tables/manifest-table/manifest-table.component';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { MasterTableComponent } from '../tables/master-table/master-table.component';
import { HouseTableComponent } from '../tables/house-table/house-table.component';
import { FlightTableComponent } from '../tables/flight-table/flight-table.component';
import { AirWaybillService } from '../../services/air-waybill.service';
import { AuthInformationService } from '@/features/auth/services/auth-information.service';

@Component({
  selector: 'app-air-waybill-forms',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    NgIf,
    ManifestFormComponent,
    MasterFormComponent,
    HouseFormComponent,
    FlightFormComponent,
    CaatFormComponent,
    ManifestTableComponent,
    MasterTableComponent,
    HouseTableComponent,
    FlightTableComponent,
  ],
  templateUrl: './air-waybill-forms.component.html',
})
export class AirWaybillFormsComponent implements OnInit {
  @ViewChild(ManifestFormComponent) manifestComponent!: ManifestFormComponent;
  @ViewChild(MasterFormComponent) masterComponent!: MasterFormComponent;
  @ViewChild(HouseFormComponent) houseComponent!: HouseFormComponent;
  @ViewChild(FlightFormComponent) flightComponent!: FlightFormComponent;
  @ViewChild(CaatFormComponent) caatComponent!: CaatFormComponent;
  @ViewChild(ManifestTableComponent) manifestTable!: ManifestTableComponent;
  @ViewChild(MasterTableComponent) masterTable!: MasterTableComponent;
  @ViewChild(HouseTableComponent) houseTable!: HouseTableComponent;
  @ViewChild(FlightTableComponent) flightTable!: FlightTableComponent;
  private catalogosService = inject(CatologosService);
  private sessionStorage = inject(SessionStorageService);
  private airWaybillService = inject(AirWaybillService);
  authInformationService = inject(AuthInformationService);
  formUtils = FormUtils;
  searchTypeEnum = TypeSearch;
  searchType: TypeSearch | null = null;
  customs: Custom[] = [];
  displayManifestTable = signal<boolean>(false);
  displayMasterTable = signal<boolean>(false);
  displayHouseTable = signal<boolean>(false);
  displayFlightTable = signal<boolean>(false);
  displayCaatTable = signal<boolean>(false);

  private getActiveFormComponent() {
    switch (this.airWaybillService.searchType()) {
      case this.searchTypeEnum.MANIFEST:
        return this.manifestComponent;
      case this.searchTypeEnum.MASTER:
        return this.masterComponent;
      case this.searchTypeEnum.HOUSE:
        return this.houseComponent;
      case this.searchTypeEnum.FLIGHT:
        return this.flightComponent;
      case this.searchTypeEnum.CAAT:
        return this.caatComponent;
      default:
        return null;
    }
  }

  ngOnInit(): void {
    this.getCustoms();
    this.loadSearchTypeFromSession();
    this.resetComesFromDetailsPage();
    this.checkManifestOrFlightClicked();
  }

  resetComesFromDetailsPage() {
    this.airWaybillService.comesFromDetailsPage.set(false);
    this.sessionStorage.set('comesFromDetailsPage', false);
  }

  submitForm() {
    const activeComponent = this.getActiveFormComponent();
    if (activeComponent) {
      activeComponent.submitForm();
    }
  }

  resetForm() {
    const activeComponent = this.getActiveFormComponent();
    if (activeComponent) {
      activeComponent.resetForm();
    }

    this.hideTables();
    this.cleanParamsFromSessionStorage();
  }

  checkManifestOrFlightClicked() {
    if (
      this.airWaybillService.checkManifestClicked() &&
      this.airWaybillService.searchType() === TypeSearch.MANIFEST
    ) {
      this.displayManifestTable.set(true);
    } else if (
      this.airWaybillService.checkManifestClicked() &&
      this.airWaybillService.searchType() === TypeSearch.CAAT
    ) {
      this.displayCaatTable.set(true);
    }

    if (this.airWaybillService.checkFlightClicked()) {
      this.displayFlightTable.set(true);
    }
  }

  displayTable(form: TypeSearch) {
    if (form === TypeSearch.MANIFEST) {
      if (this.displayManifestTable()) {
        this.manifestTable.getManifests();
        this.manifestTable.manifestSelected.set(false);
      } else {
        this.displayManifestTable.set(true);
      }
    } else if (form === TypeSearch.MASTER) {
      if (this.displayMasterTable()) {
        this.masterTable.getMasters();
      } else {
        this.displayMasterTable.set(true);
      }
    } else if (form === TypeSearch.HOUSE) {
      if (this.displayHouseTable()) {
        this.houseTable.getHouseGuides();
      } else {
        this.displayHouseTable.set(true);
      }
    } else if (form === TypeSearch.FLIGHT) {
      if (this.displayFlightTable()) {
        this.flightTable.getFlights();
      } else {
        this.displayFlightTable.set(true);
      }
    } else if (form === TypeSearch.CAAT) {
      if (this.displayCaatTable()) {
        this.manifestTable.getManifests(true);
        this.manifestTable.manifestSelected.set(false);
      } else {
        this.displayCaatTable.set(true);
      }
    }
  }

  onSearchTypeChange() {
    this.sessionStorage.set('searchBy', this.searchType);
    this.airWaybillService.searchType.set(this.searchType);
    this.hideTables();
    this.cleanParamsFromSessionStorage();
  }

  hideTables() {
    this.displayManifestTable.set(false);
    this.displayMasterTable.set(false);
    this.displayCaatTable.set(false);
    this.displayHouseTable.set(false);
    this.displayFlightTable.set(false);
  }

  cleanParamsFromSessionStorage() {
    this.sessionStorage.cleanParamsFromSessionStorage([
      'isManifest',
      'manifests',
      'masterByManifest',
      'paramsToGetManifests',
      'paramsToGetMaster',
      'paramsToGetHouseGuides',
      'paramsToGetFlights',
      'paramsToGetCaat',
      'manifestClicked',
      'flightClicked',
      'comesFromDetailsPage',
      'guideNum',
      'masterDetails',
      'merchandises',
      'persons',
      'houseSelectedDetails',
      'masterGuides',
      'houseGuides',
      'flights',
    ]);
  }

  private getCustoms(): void {
    this.catalogosService
      .getAduanas()
      .pipe(
        tap((customs) => {
          this.customs = customs;
        }),
        take(1),
      )
      .subscribe();
  }

  private loadSearchTypeFromSession(): void {
    const stored = this.sessionStorage.get<TypeSearch | null>('searchBy');
    if (stored) {
      this.airWaybillService.searchType.set(stored);
      this.searchType = stored;
    }
  }
}
