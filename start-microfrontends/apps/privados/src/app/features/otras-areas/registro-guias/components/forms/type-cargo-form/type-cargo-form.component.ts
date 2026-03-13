import { ButtonComponent } from '@/shared/components/button/button.component';
import { Tooltip } from '@/shared/components/tooltip/tooltip.component';
import { FormUtils } from '@/shared/utils/formUtils';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterGuideService } from '../../../services/register-guide.service';
import { MaxLengthDirective } from '@/shared/directives/max-length.directive';
import { TableComponent } from '@/shared/components/table/table.component';
import { TableBodyData, TableData } from '@/shared/interfaces/table.interface';
import { RoutingService } from '@/core/services/routing.service';
import { STORE_FRONT_ROUTES } from '@/routes.constants';
import { OTRAS_AREAS_ROUTES } from '../../../../otras-areas.routes.constants';
import { REGISTRO_GUIAS_ROUTES } from '../../../registro-guias.routes.constants';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { CatologsRegisterGuideService } from '../../../services/catologs-register-guide.service';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { LoadType, Location, LocationEnum } from '../../../interfaces/catalogs.interface';
import { CargoTypeForm, MasterGuideForm } from '../../../interfaces/guides-register.interface';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
declare const $: any;

@Component({
  selector: 'app-type-cargo-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Tooltip,
    ButtonComponent,
    NgClass,
    NgIf,
    NgForOf,
    MaxLengthDirective,
    TableComponent,
    DialogComponent,
  ],
  templateUrl: './type-cargo-form.component.html',
})
export class TypeCargoFormComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private registerGuideService = inject(RegisterGuideService);
  private routingService = inject(RoutingService);
  private sessionStorage = inject(SessionStorageService);
  private catalogsService = inject(CatologsRegisterGuideService);
  private destroy$ = new Subject<void>();
  tableMasterGuidesData = signal<TableData>({
    headers: [
      'Gross Weight Measure',
      'Gross Weight Measure - unit Code',
      'Total Piece Quantity',
      'Summary Description',
      'Waybill Number',
      'Included Customs Note',
      'ID Clave',
      'Name',
      'Subject Code',
      'Description',
      'Description Code',
      'Description',
      'Description Code',
    ],
    body: [],
  });
  isLoadingMasterGuidesData = signal<boolean>(false);
  hiddenMasterGuidesData = signal<Object[]>([]);
  displayDeleteBtnMaster = signal<boolean>(false);
  errorMasterGuidesData = false;
  valueMissingMasterGuidesTable = false;
  locationEnum = LocationEnum;
  masterRowsSelected: TableBodyData[] = [];
  masterGuideFormData = signal<Object[]>([]);
  typeCodes: LoadType[] = [];
  iataAirports: Location[] = [];
  controlledPremises: Location[] = [];
  locationIds: Location[] = [];
  formUtils = FormUtils;
  cargoTypeForm = this.formBuilder.group({
    typeCode: [null, Validators.required],
    uldSerialNumber: [null],
    locationType: [null, Validators.required],
    locationId: [null, Validators.required],
    locationName: [null],
  });

  ngOnInit(): void {
    this.getIataAirports();
    this.getControlledPremises();
    this.getLoadType();
    this.loadFromSessionStorage();
    this.listenIdSelectsChanges();
    this.loadTablesData();
  }

  private listenIdSelectsChanges() {
    this.cargoTypeForm.controls['locationId'].valueChanges
      .pipe(
        tap((value) => this.cargoTypeForm.controls['locationName'].setValue(value)),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.cargoTypeForm.controls['locationType'].valueChanges
      .pipe(
        tap(() => this.cargoTypeForm.controls['locationName'].setValue(null)),
        tap((value) => {
          if (value === this.locationEnum.IATA) {
            this.locationIds = this.iataAirports;
          }

          if (value === this.locationEnum.CONTROLLED_PREMISES) {
            this.locationIds = this.controlledPremises;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  onSubmit() {
    this.cargoTypeForm.markAllAsTouched();

    if (this.masterGuidesTableHasValue()) {
      this.valueMissingMasterGuidesTable = false;
    } else {
      this.valueMissingMasterGuidesTable = true;
    }

    if (this.cargoTypeForm.valid) {
      const masterGuideForm = this.sessionStorage.get<MasterGuideForm[]>('masterGuideForm');
      const typeCargo = {
        ...this.cargoTypeForm.value,
        localtionRealId: this.registerGuideService.getIdByLocation(
          this.locationIds,
          this.cargoTypeForm.controls['locationId'].value || '',
        ),
        temporalId: Date.now(),
        masters:
          Array.isArray(masterGuideForm) && masterGuideForm.length > 0 ? masterGuideForm : [],
      } as unknown as CargoTypeForm;

      this.registerGuideService.cargoTypeForm = [
        ...(this.registerGuideService.cargoTypeForm ?? []),
        typeCargo,
      ];
      this.sessionStorage.set('cargoTypeForm', this.registerGuideService.cargoTypeForm);
      this.registerGuideService.goToTabsPage();
      this.sessionStorage.remove('masterGuideForm');
      this.registerGuideService.masterGuideForm = [];
    }
  }

  private loadTablesData() {
    const masterGuideForm = this.registerGuideService.masterGuideForm;
    if (!!masterGuideForm) {
      const body = masterGuideForm.map((master) => [
        master.grossWeightMeasure,
        master.grossWeightUnitCode,
        master.totalPieceQuantity,
        master.description,
        master.waybillNumber,
        master.waybillNumber, // TODO: Que debe ir aqui? Included Customs Note
        master.originRealId,
        master.originName,
        master.subjectCode,
        master.specialCode,
        master.specialDescription,
        master.maneuverCode,
        master.maneuverDescription,
      ]);
      this.hiddenMasterGuidesData.set(masterGuideForm);
      this.tableMasterGuidesData.set({ ...this.tableMasterGuidesData(), body });
    }
  }

  onCancel(): void {
    this.registerGuideService.goToTabsPage();
    this.sessionStorage.remove('masterGuideForm');
    this.registerGuideService.masterGuideForm = [];
  }

  removeMaster() {
    this.tableMasterGuidesData.set({ ...this.tableMasterGuidesData(), body: [] });
    this.registerGuideService.masterGuideForm = this.registerGuideService.masterGuideForm
      ? this.registerGuideService.masterGuideForm.filter(
          (master) => master.temporalId !== this.masterRowsSelected[0].hiddenData.temporalId,
        )
      : null;
    this.sessionStorage.set('masterGuideForm', this.registerGuideService.otherContacts);
    this.displayDeleteBtnMaster.set(false);
    this.loadTablesData();
    this.displayDeleteModal();
  }

  displayDeleteModal() {
    $('#registerDeletedGuide').modal();
  }

  radioHasValue() {
    const control = this.cargoTypeForm.get('locationType');

    return !!control && control.value !== null && control.value !== '';
  }

  masterSelected(rowsSelected: TableBodyData[]) {
    this.masterRowsSelected = rowsSelected;
    if (!!rowsSelected && rowsSelected.length === 1) {
      this.displayDeleteBtnMaster.set(true);
    } else {
      this.displayDeleteBtnMaster.set(false);
    }
  }

  addMasterGuide() {
    this.routingService.navigate([
      STORE_FRONT_ROUTES.OTRAS_AREAS,
      OTRAS_AREAS_ROUTES.REGISTRO_GUIAS_AEREAS,
      REGISTRO_GUIAS_ROUTES.GUIAS_MASTER,
    ]);
  }

  masterGuidesTableHasValue(): boolean {
    return this.tableMasterGuidesData().body.length > 0;
  }

  private getIataAirports() {
    this.catalogsService
      .getAirportsIata()
      .pipe(
        tap((iataAirports: Location[]) => {
          this.iataAirports = iataAirports;
          if (this.cargoTypeForm.controls['locationType'].value === this.locationEnum.IATA) {
            this.locationIds = iataAirports;
          }
        }),
        take(1),
      )
      .subscribe();
  }

  private getLoadType() {
    this.catalogsService
      .getLoadType()
      .pipe(
        tap((loadTypes: LoadType[]) => {
          this.typeCodes = loadTypes;
        }),
        take(1),
      )
      .subscribe();
  }

  private getControlledPremises() {
    this.catalogsService
      .getControlledPremises()
      .pipe(
        tap((controlledPremises: Location[]) => {
          this.controlledPremises = controlledPremises;
          if (
            this.cargoTypeForm.controls['locationType'].value ===
            this.locationEnum.CONTROLLED_PREMISES
          ) {
            this.locationIds = controlledPremises;
          }
        }),
        take(1),
      )
      .subscribe();
  }

  private loadFromSessionStorage() {
    const cargoTypeForm = this.sessionStorage.get<any>('cargoTypeForm');

    if (!!cargoTypeForm) {
      try {
        this.cargoTypeForm.patchValue(cargoTypeForm);
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
