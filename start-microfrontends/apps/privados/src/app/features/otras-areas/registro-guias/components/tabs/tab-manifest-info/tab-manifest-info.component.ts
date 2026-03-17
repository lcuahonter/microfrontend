import { FormUtils } from '@/shared/utils/formUtils';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tooltip } from '@/shared/components/tooltip/tooltip.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimeFormatDirective } from '@/shared/directives/time-format.directive';
import { UppercaseDirective } from '@/shared/directives/uppercase.directive';
import { MaxLengthDirective } from '@/shared/directives/max-length.directive';
import { NumericDecimalDirective } from '@/shared/directives/numeric-decimal.directive';
import { TableComponent } from '@/shared/components/table/table.component';
import { TableBodyData, TableData } from '@/shared/interfaces/table.interface';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { RoutingService } from '@/core/services/routing.service';
import { STORE_FRONT_ROUTES } from '@/routes.constants';
import { OTRAS_AREAS_ROUTES } from '../../../../otras-areas.routes.constants';
import { REGISTRO_GUIAS_ROUTES } from '../../../registro-guias.routes.constants';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import {
  DateTime,
  Location,
  LocationEnum,
  UnitsWeight,
} from '../../../interfaces/catalogs.interface';
import { CatologsRegisterGuideService } from '../../../services/catologs-register-guide.service';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { RegisterGuideService } from '../../../services/register-guide.service';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import {
  ArrivalEvent,
  BusinessHeaderDocument,
  LogisticsTransportMovement,
} from '../../../interfaces/manifest.interface';
import { combineLocalDateAndTime } from '@/shared/utils/serviceUtils';
declare const $: any;

@Component({
  selector: 'app-tab-manifest-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Tooltip,
    NgFor,
    DatePickerComponent,
    BsDatepickerModule,
    TimeFormatDirective,
    UppercaseDirective,
    MaxLengthDirective,
    NumericDecimalDirective,
    NgIf,
    NgClass,
    TableComponent,
    ButtonComponent,
    DialogComponent,
  ],
  templateUrl: './tab-manifest-info.component.html',
})
export class TabManifestInfoComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private routingService = inject(RoutingService);
  private sessionStorage = inject(SessionStorageService);
  private catalogsService = inject(CatologsRegisterGuideService);
  private registerGuideService = inject(RegisterGuideService);
  private destroy$ = new Subject<void>();
  weightUnits: UnitsWeight[] = [];
  iataAirports: Location[] = [];
  controlledPremises: Location[] = [];
  departureIds: Location[] = [];
  arrivalIds: Location[] = [];
  timeTypes: DateTime[] = [];
  loadTypeRowsSelected: TableBodyData[] = [];
  formUtils = FormUtils;
  valueMissingLoadTypeTable = false;
  tableLoadTypeData = signal<TableData>({
    headers: ['Type Code', 'Flight number', 'Id IATA', 'Name'],
    body: [],
  });
  isLoadingLoadTypeData = signal<boolean>(false);
  hiddenLoadTypeData = signal<Object[]>([]);
  errorLoadTypeData = false;
  displayDeleteBtnLoadType = signal<boolean>(false);
  locationEnum = LocationEnum;
  manifestForm = this.formBuilder.group({
    manifestNumber: [null, Validators.required],
    flightNumber: [null, Validators.required],
    totalGrossWeight: [null],
    weightUnitCode: [null],
    packageQuantity: [null],
    departureLocationType: [null, Validators.required],
    departureId: [null, Validators.required],
    departureName: [null],
    arrivalDate: [null, Validators.required],
    arrivalTime: [null, Validators.required],
    arrivalTimeType: [null, Validators.required],
    loadingDate: [null, Validators.required],
    loadingTime: [null, Validators.required],
    loadingTimeType: [null, Validators.required],
    arrivalLocationType: [null, Validators.required],
    arrivalLocationId: [null, Validators.required],
    arrivalLocationName: [null],
  });
  arrivalDate: Date | undefined = undefined;
  loadingDate: Date | undefined = undefined;

  ngOnInit(): void {
    this.getIataAirports();
    this.getControlledPremises();
    this.getUnitsWeight();
    this.getDateTime();
    this.loadFromSessionStorage();
    this.listenIdSelectsChanges();
    this.loadTablesData();
  }

  saveValuesInSessionStorage() {
    this.sessionStorage.set('infoManifestTab', this.manifestForm.value);
  }

  private loadTablesData() {
    const cargoTypeForm = this.registerGuideService.cargoTypeForm;
    if (!!cargoTypeForm) {
      const body = cargoTypeForm.map((c) => [
        c.typeCode,
        c.uldSerialNumber,
        c.localtionRealId,
        c.locationName,
      ]);

      this.tableLoadTypeData.set({ ...this.tableLoadTypeData(), body });
      this.hiddenLoadTypeData.set(cargoTypeForm);
    }
  }

  private listenIdSelectsChanges() {
    this.manifestForm.controls['departureId'].valueChanges
      .pipe(
        tap((value) => {
          this.manifestForm.controls['departureName'].setValue(value);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.manifestForm.controls['arrivalLocationId'].valueChanges
      .pipe(
        tap((value) => {
          this.manifestForm.controls['arrivalLocationName'].setValue(value);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.manifestForm.controls['arrivalLocationType'].valueChanges
      .pipe(
        tap(() => this.manifestForm.controls['arrivalLocationName'].setValue(null)),
        tap((value) => {
          if (value === this.locationEnum.IATA) {
            this.arrivalIds = this.iataAirports;
          }

          if (value === this.locationEnum.CONTROLLED_PREMISES) {
            this.arrivalIds = this.controlledPremises;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.manifestForm.controls['departureLocationType'].valueChanges
      .pipe(
        tap(() => this.manifestForm.controls['departureName'].setValue(null)),
        tap((value) => {
          if (value === this.locationEnum.IATA) {
            this.departureIds = this.iataAirports;
          }

          if (value === this.locationEnum.CONTROLLED_PREMISES) {
            this.departureIds = this.controlledPremises;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  onSubmit() {
    this.manifestForm.markAllAsTouched();
    this.saveValuesInSessionStorage();

    if (this.loadTypeTableHasValue()) {
      this.valueMissingLoadTypeTable = false;
    } else {
      this.valueMissingLoadTypeTable = true;
    }

    if (this.manifestForm.valid) {
      this.buildObjectoToSaveData();
    }
  }

  buildObjectoToSaveData() {
    const businessHeaderDocument: BusinessHeaderDocument = {
      id: this.manifestForm.value.manifestNumber || '',
      includedHeaderNote: [
        {
          contentCode: null,
          content: null,
        },
      ],
    };

    const { arrivalDate, arrivalTime, loadingDate, loadingTime } = this.manifestForm.value;

    if (!arrivalDate || !arrivalTime || !loadingDate || !loadingTime) {
      return;
    }

    const departureOccurrenceDateTime = combineLocalDateAndTime(
      arrivalDate as Date,
      arrivalTime as string,
    );

    const departureOccurrenceDateTimeArrival = combineLocalDateAndTime(
      loadingDate as Date,
      loadingTime as string,
    );

    const occurrenceDepartureLocation_typeCode =
      this.manifestForm.value.departureLocationType != null &&
      this.manifestForm.value.departureLocationType === this.locationEnum.IATA
        ? 'AirPort'
        : 'Freight Terminal';

    const arrivalTypeCode =
      this.manifestForm.value.arrivalLocationType != null &&
      this.manifestForm.value.arrivalLocationType === this.locationEnum.IATA
        ? 'AirPort'
        : 'Freight Terminal';

    const logisticsTransportMovement: LogisticsTransportMovement = {
      id: this.manifestForm.value.flightNumber || '',
      totalGrossWeightMeasureValue: this.manifestForm.value.totalGrossWeight || 0,
      totalGrossWeightMeasureUnitCode: this.manifestForm.value.weightUnitCode || '',
      totalPackageQuantity: this.manifestForm.value.packageQuantity || 0,
      departureEvent: {
        departureOccurrenceDateTime,
        departureDateTimeTypeCode: this.manifestForm.value.arrivalTimeType || '',
        occurrenceDepartureLocation_id: this.registerGuideService.getIdByLocation(
          this.departureIds,
          this.manifestForm.value.departureId || '',
        ),
        occurrenceDepartureLocation_name: this.manifestForm.value.departureId || '',
        occurrenceDepartureLocation_typeCode,
      },
      totalPieceQuantity: null,
      includedCustomsNote: null,
      totalGrossVolumeMeasureValue: null,
      totalGrossVolumeMeasureUnitCode: null,
      relatedConsignmentCustomsProcedure_goodsStatusCode: null,
      stageCode: null,
      modeCode: null,
      mode: null,
      sequenceNumeric: null,
      masterResponsibleTransportPerson_name: null,
      usedLogisticsTransportMeans_name: null,
      usedLogisticsTransportMeans_countryId: null,
    };
    const arrivalEvent: ArrivalEvent[] = [
      {
        arrivalOccurrenceDateTime: departureOccurrenceDateTime,
        arrivalDateTimeTypeCode: occurrenceDepartureLocation_typeCode,
        departureOccurrenceDateTime: departureOccurrenceDateTimeArrival,
        departureDateTimeTypeCode: this.manifestForm.value.loadingTimeType || '',
        occurrenceArrivalLocation: {
          id: this.registerGuideService.getIdByLocation(
            this.arrivalIds,
            this.manifestForm.value.arrivalLocationId || '',
          ),
          name: this.manifestForm.value.arrivalLocationId || '',
          typeCode: arrivalTypeCode,
          firstArrivalCountryID: null,
        },
        associatedTransportCargo: this.registerGuideService.cargoTypeForm?.map((type) => ({
          typeCode: type.typeCode,
          utilizedUnitLoadTransportEquipment: null,
          includedMasterConsignment: type.masters.map((master) => ({
            transportSplitDescription: master.transportSplitDescription,
            waybillNumber: master.waybillNumber,
            transportContractDocument_Id: master.waybillNumber,
            subjectCode: master.subjectCode,
            grossWeightMeasure_Value: Number(master.grossWeightMeasure),
            grossWeightMeasure_UnitCode: master.grossWeightUnitCode,
            totalPieceQuantity: Number(master.totalPieceQuantity),
            summaryDescription: master.description,
            originLocation_Id: master.originRealId,
            originLocation_Name: master.originName,
            finalDestinationLocation_Id: master.finalRealId,
            finalDestinationLocation_Name: master.finalName,
            handlingSPHInstructions:
              master.maneuverCode || master.maneuverDescription
                ? [
                    {
                      description: master.maneuverCode,
                      descriptionCode: master.maneuverDescription,
                    },
                  ]
                : null,
            handlingSSRInstructions:
              master.specialDescription || master.specialCode
                ? [
                    {
                      description: master.specialDescription,
                      descriptionCode: master.specialCode,
                    },
                  ]
                : null,
            onCarriageTransportMovement: [
              {
                id: type.uldSerialNumber,
                arrivalDestinationEvent_OccurrenceDestinationLocation_Id: type.localtionRealId,
                arrivalDestinationEvent_OccurrenceDestinationLocation_Name: type.locationName,
                carrierParty_PrimaryID: null,
                carrierParty_schemeAgencyID: null,
                onCarriageEvent_DepartureOccurrenceDateTime: null,
                onCarriageEvent_DepartureDateTimeTypeCode: null,
              },
            ],
            handlingOSIInstructions: null,
            includedCustomsNote: null,
            transportLogisticsPackage: null,
            includedMasterConsignmentItem: null,
            grossVolumeMeasure_Value: null,
            grossVolumeMeasure_UnitCode: null,
            densityGroupCode: null,
            packageQuantity: null,
            associatedConsignmentCustomsProcedure_goodsStatusCode: null,
            movementPriorityCode_Value: null,
          })),
        })),
      },
    ];

    this.registerGuideService.businessHeaderDocument = businessHeaderDocument;
    this.registerGuideService.logisticsTransportMovement = logisticsTransportMovement;
    this.registerGuideService.arrivalEvent = arrivalEvent;
  }

  formIsValid(): boolean {
    return this.manifestForm.valid && this.loadTypeTableHasValue();
  }

  loadTypeSelected(rowsSelected: TableBodyData[]) {
    this.loadTypeRowsSelected = rowsSelected;
    if (!!rowsSelected && rowsSelected.length === 1) {
      this.displayDeleteBtnLoadType.set(true);
    } else {
      this.displayDeleteBtnLoadType.set(false);
    }
  }

  addLoadType() {
    this.saveValuesInSessionStorage();
    this.routingService.navigate([
      STORE_FRONT_ROUTES.OTRAS_AREAS,
      OTRAS_AREAS_ROUTES.REGISTRO_GUIAS_AEREAS,
      REGISTRO_GUIAS_ROUTES.TIPO_CARGA,
    ]);
  }

  loadTypeTableHasValue(): boolean {
    return this.tableLoadTypeData().body.length > 0;
  }

  radioHasValue(controlName: string): boolean {
    const control = this.manifestForm.get(controlName);
    return !!control && control.value !== null && control.value !== '';
  }

  removeLoadType() {
    this.tableLoadTypeData.set({ ...this.tableLoadTypeData(), body: [] });
    this.registerGuideService.cargoTypeForm = this.registerGuideService.cargoTypeForm
      ? this.registerGuideService.cargoTypeForm.filter(
          (merch) => merch.temporalId !== this.loadTypeRowsSelected[0].hiddenData.temporalId,
        )
      : null;
    this.sessionStorage.set('cargoTypeForm', this.registerGuideService.cargoTypeForm);
    this.displayDeleteBtnLoadType.set(false);
    this.loadTablesData();
    this.displayDeleteModal();
  }

  displayDeleteModal() {
    $('#registerDeletedLoadType').modal();
  }

  private getUnitsWeight() {
    this.catalogsService
      .getUnitsWeight()
      .pipe(
        tap((weightUnits: UnitsWeight[]) => {
          this.weightUnits = weightUnits;
        }),
        take(1),
      )
      .subscribe();
  }

  private getDateTime() {
    this.catalogsService
      .getDateTime()
      .pipe(
        tap((dateTime: DateTime[]) => {
          this.timeTypes = dateTime;
        }),
        take(1),
      )
      .subscribe();
  }

  private getIataAirports() {
    this.catalogsService
      .getAirportsIata()
      .pipe(
        tap((iataAirports: Location[]) => {
          this.iataAirports = iataAirports;
          if (
            this.manifestForm.controls['departureLocationType'].value === this.locationEnum.IATA
          ) {
            this.departureIds = iataAirports;
          }

          if (this.manifestForm.controls['arrivalLocationType'].value === this.locationEnum.IATA) {
            this.arrivalIds = iataAirports;
          }
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
            this.manifestForm.controls['departureLocationType'].value ===
            this.locationEnum.CONTROLLED_PREMISES
          ) {
            this.departureIds = controlledPremises;
          }

          if (
            this.manifestForm.controls['arrivalLocationType'].value ===
            this.locationEnum.CONTROLLED_PREMISES
          ) {
            this.arrivalIds = controlledPremises;
          }
        }),
        take(1),
      )
      .subscribe();
  }

  private loadFromSessionStorage() {
    const manifestForm = this.sessionStorage.get<any>('infoManifestTab');

    if (!!manifestForm) {
      try {
        this.manifestForm.patchValue(manifestForm);
        this.arrivalDate = manifestForm.arrivalDate
          ? new Date(manifestForm.arrivalDate)
          : undefined;
        this.loadingDate = manifestForm.loadingDate
          ? new Date(manifestForm.loadingDate)
          : undefined;
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
