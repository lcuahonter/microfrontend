import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { FormUtils } from '@/shared/utils/formUtils';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tooltip } from '@/shared/components/tooltip/tooltip.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UppercaseDirective } from '@/shared/directives/uppercase.directive';
import { MaxLengthDirective } from '@/shared/directives/max-length.directive';
import { TimeFormatDirective } from '@/shared/directives/time-format.directive';
import { NumericDecimalDirective } from '@/shared/directives/numeric-decimal.directive';
import { TableComponent } from '@/shared/components/table/table.component';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { TableBodyData, TableData } from '@/shared/interfaces/table.interface';
import { RoutingService } from '@/core/services/routing.service';
import { STORE_FRONT_ROUTES } from '@/routes.constants';
import { OTRAS_AREAS_ROUTES } from '../../../../otras-areas.routes.constants';
import { REGISTRO_GUIAS_ROUTES } from '../../../registro-guias.routes.constants';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { CatologsRegisterGuideService } from '../../../services/catologs-register-guide.service';
import { Subject, take, takeUntil, tap, map } from 'rxjs';
import { Location, LocationEnum, UnitsWeight } from '../../../interfaces/catalogs.interface';
import { RegisterGuideService } from '../../../services/register-guide.service';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { combineLocalDateAndTime } from '@/shared/utils/serviceUtils';
import { HouseConsignmentHouse } from '../../../interfaces/house.interface';
declare const $: any;

@Component({
  selector: 'app-tab-house-info',
  standalone: true,
  imports: [
    DatePickerComponent,
    ReactiveFormsModule,
    Tooltip,
    NgForOf,
    BsDatepickerModule,
    NgIf,
    NgClass,
    UppercaseDirective,
    MaxLengthDirective,
    TimeFormatDirective,
    NumericDecimalDirective,
    TableComponent,
    ButtonComponent,
    DialogComponent,
  ],
  templateUrl: './tab-house-info.component.html',
})
export class TabHouseInfoComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private routingService = inject(RoutingService);
  private sessionStorage = inject(SessionStorageService);
  private catalogsService = inject(CatologsRegisterGuideService);
  private registerGuideService = inject(RegisterGuideService);
  private destroy$ = new Subject<void>();
  weightUnits: UnitsWeight[] = [];
  formUtils = FormUtils;
  valueMissingMerchandiseTable = false;
  displayDeleteBtnMerchandise = signal<boolean>(false);
  merchandiseRowsSelected: TableBodyData[] = [];
  tableMerchandiseData = signal<TableData>({
    headers: [
      'Gross Weight Measure',
      'Gross Weight Measure - unit Code',
      'Piece Quantity',
      'Identification',
      'Chargeable Weight Measure',
      'Chargeable Weight Measure - unit Code',
    ],
    body: [],
  });
  locationEnum = LocationEnum;
  isLoadingMerchandiseData = signal<boolean>(false);
  hiddenMerchandiseData = signal<Object[]>([]);
  iataAirports: Location[] = [];
  controlledPremises: Location[] = [];
  issueIds: Location[] = [];
  originIds: Location[] = [];
  finalIds: Location[] = [];
  errorMerchandiseData = false;
  houseMasterForm = this.formBuilder.group({
    houseWaybillNumber: [null, Validators.required],
    actualDate: [null, Validators.required],
    actualTime: [null, Validators.required],
    issueLocation: [null, Validators.required],
    departureId: this.formBuilder.control<string | null>(null, {
      validators: [Validators.required],
    }),
    placeOfContract: this.formBuilder.control<string | null>(null),
    signatoryCarrier: [null, Validators.required],
    consignorSignature: [null, Validators.required],
    masterWaybillNumber: [null, [Validators.required, this.formUtils.waybillNumber()]],
    originType: [null, Validators.required],
    originId: this.formBuilder.control<string | null>(null, {
      validators: [Validators.required],
    }),
    originName: this.formBuilder.control<string | null>(null),
    finalType: [null, Validators.required],
    finalId: this.formBuilder.control<string | null>(null, {
      validators: [Validators.required],
    }),
    finalName: this.formBuilder.control<string | null>(null),
    grossWeight: [null, Validators.required],
    grossWeightUnit: [null, Validators.required],
    totalPieceQuantity: [null, Validators.required],
    totalDescription: [null, Validators.required],
  });
  actualDate: Date | undefined = undefined;
  isUpdating: boolean = false;

  ngOnInit(): void {
    this.getIataAirports();
    this.getControlledPremises();
    this.loadFromSessionStorage();
    this.getUnitsWeight();
    this.listenIdSelectsChanges();
    this.loadTableData();
    const purpuseCode = this.sessionStorage.get<string>('purpuseCode');
    this.isUpdating = purpuseCode === 'Update';
  }

  saveValuesInSessionStorage() {
    this.sessionStorage.set('houseMasterForm', this.houseMasterForm.value);
  }

  private listenIdSelectsChanges() {
    this.houseMasterForm.controls['originId'].valueChanges
      .pipe(
        tap((value) => {
          this.houseMasterForm.controls['originName'].setValue(value);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.houseMasterForm.controls['finalId'].valueChanges
      .pipe(
        tap((value) => {
          this.houseMasterForm.controls['finalName'].setValue(value);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.houseMasterForm.controls['departureId'].valueChanges
      .pipe(
        tap((value) => {
          this.houseMasterForm.controls['placeOfContract'].setValue(value);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.houseMasterForm.controls['originType'].valueChanges
      .pipe(
        tap(() => this.houseMasterForm.controls['originName'].setValue(null)),
        tap((value) => {
          if (value === this.locationEnum.IATA) {
            this.originIds = this.iataAirports;
          }

          if (value === this.locationEnum.CONTROLLED_PREMISES) {
            this.originIds = this.controlledPremises;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.houseMasterForm.controls['issueLocation'].valueChanges
      .pipe(
        tap(() => this.houseMasterForm.controls['placeOfContract'].setValue(null)),
        tap((value) => {
          if (!value) return;
          if (value === this.locationEnum.IATA) {
            this.issueIds = this.iataAirports;
          }

          if (value === this.locationEnum.CONTROLLED_PREMISES) {
            this.issueIds = this.controlledPremises;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.houseMasterForm.controls['finalType'].valueChanges
      .pipe(
        tap(() => this.houseMasterForm.controls['finalName'].setValue(null)),
        tap((value) => {
          if (value === this.locationEnum.IATA) {
            this.finalIds = this.iataAirports;
          }
          if (value === this.locationEnum.CONTROLLED_PREMISES) {
            this.finalIds = this.controlledPremises;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  radioHasValue(controlName: string): boolean {
    const control = this.houseMasterForm.get(controlName);
    return !!control && control.value !== null && control.value !== '';
  }

  onSubmit() {
    this.houseMasterForm.markAllAsTouched();
    this.saveValuesInSessionStorage();

    if (this.merchandiseTableHasValue()) {
      this.valueMissingMerchandiseTable = false;
    } else {
      this.valueMissingMerchandiseTable = true;
    }

    if (this.houseMasterForm.valid) {
      this.buildObjectoToSaveData();
    }
  }

  buildObjectoToSaveData() {
    const {
      houseWaybillNumber,
      actualDate,
      actualTime,
      consignorSignature,
      signatoryCarrier,
      departureId,
      masterWaybillNumber,
      originId,
      finalId,
      grossWeight,
      grossWeightUnit,
      totalPieceQuantity,
      totalDescription,
    } = this.houseMasterForm.value;

    if (!actualDate || !actualTime || !departureId || !originId || !finalId) {
      return;
    }

    const dateTime = combineLocalDateAndTime(actualDate as Date, actualTime as string);
    const issueLocationId = this.registerGuideService.getIdByLocation(this.issueIds, departureId);

    this.registerGuideService.houseRequest.waybillType.businessHeaderDocument = {
      id: houseWaybillNumber || '',
      includedHeaderNote: null,
      signatoryConsignorAuthentication: consignorSignature || '',
      signatoryCarrierAuthentication_ActualDateTime: dateTime, // ISO string
      signatoryCarrierAuthentication_Signatory: signatoryCarrier || '',
      signatoryCarrierAuthentication_IssueAuthenticationLocation: issueLocationId,
    };

    const originLocationId = this.registerGuideService.getIdByLocation(this.originIds, originId);
    const finalLocationId = this.registerGuideService.getIdByLocation(this.finalIds, finalId);

    this.registerGuideService.houseRequest.waybillType.masterConsignment = {
      includedTareGrossWeightMeasure: null,
      includedTareGrossWeightMeasure_UnitCode: null,
      totalPieceQuantity: null,
      transportContractDocument_Id: masterWaybillNumber || '',
      originLocation_Id: originLocationId,
      originLocation_Name: originId,
      finalDestinationLocation_Id: finalLocationId,
      finalDestinationLocation_Name: finalId,
      includedHouseConsignment: {} as HouseConsignmentHouse,
    };

    this.registerGuideService.houseConsigmentTabHouse = {
      id: null,
      additionalID: null,
      associatedReferenceID: null,
      nilCarriageValueIndicator: null,
      declaredValueForCarriageAmount: null,
      declaredValueForCarriageAmount_CurrencyID: null,
      nilCustomsValueIndicator: null,
      declaredValueForCustomsAmount: null,
      declaredValueForCustomsAmount_CurrencyID: null,
      nilInsuranceValueIndicator: null,
      insuranceValueAmount: null,
      insuranceValueAmount_CurrencyID: null,
      totalChargePrepaidIndicator: null,
      weightTotalChargeAmount_Value: null,
      weightTotalChargeAmount_CurrencyID: null,
      valuationTotalChargeAmount_Value: null,
      valuationTotalChargeAmount_CurrencyID: null,
      taxTotalChargeAmount_Value: null,
      taxTotalChargeAmount_CurrencyID: null,
      totalDisbursementPrepaidIndicator: null,
      agentTotalDisbursementAmount_Value: null,
      agentTotalDisbursementAmount_CurrencyID: null,
      carrierTotalDisbursementAmount_Value: null,
      carrierTotalDisbursementAmount_CurrencyID: null,
      totalPrepaidChargeAmount_Value: null,
      totalPrepaidChargeAmount_CurrencyID: null,
      totalCollectChargeAmount_Value: null,
      totalCollectChargeAmount_CurrencyID: null,
      includedTareGrossWeightMeasure: null,
      includedTareGrossWeightMeasure_UnitCode: null,
      grossVolumeMeasure: grossWeight || '',
      grossVolumeMeasure_UnitCode: grossWeightUnit || '',
      densityGroupCode: null,
      consignmentItemQuantity: null,
      packageQuantity: null,
      totalPieceQuantity: totalPieceQuantity || '',
      summaryDescription: totalDescription || '',
      freightRateTypeCode: null,
      includedHouseConsignmentItem: this.registerGuideService.sequenceMerchandise?.map((item) => ({
        grossWeightMeasure: item.grossWeightMeasure,
        grossWeightMeasure_UnitCode: item.grossWeightUnitCode,
        grossVolumeMeasure: item.chargeableWeightMeasure,
        grossVolumeMeasure_UnitCode: item.chargeableWeightUnitCode,
        pieceQuantity: item.pieceQuantity,
        information: item.description,
        sequenceNumeric: null,
        typeCode: null,
        packageQuantity: null,
        volumetricFactor: null,
        natureIdentificationTransportCargo_Identification: null,
        originCountry_ID: null,
        associatedUnitLoadTransportEquipment: null,
        transportLogisticsPackage: null,
        applicableFreightRateServiceCharge: [
          {
            categoryCode: null,
            commodityItemID: null,
            chargeableWeightMeasure: null,
            chargeableWeightMeasure_UnitCode: null,
            appliedRate: null,
            appliedAmount: null,
            appliedAmount_CurrencyID: null,
          },
        ],
        associatedReferenceDocument: null,
        specifiedRateCombinationPointLocation_ID: null,
      })),
    } as HouseConsignmentHouse;
  }

  merchandiseSelected(rowsSelected: TableBodyData[]) {
    this.merchandiseRowsSelected = rowsSelected;
    if (!!rowsSelected && rowsSelected.length === 1) {
      this.displayDeleteBtnMerchandise.set(true);
    } else {
      this.displayDeleteBtnMerchandise.set(false);
    }
  }

  addMerchandise() {
    this.saveValuesInSessionStorage();
    this.routingService.navigate([
      STORE_FRONT_ROUTES.OTRAS_AREAS,
      OTRAS_AREAS_ROUTES.REGISTRO_GUIAS_AEREAS,
      REGISTRO_GUIAS_ROUTES.DETALLE_MERCANCIA_SECUENCIA,
    ]);
  }

  merchandiseTableHasValue(): boolean {
    return this.tableMerchandiseData().body.length > 0;
  }

  removeMerchandise() {
    this.tableMerchandiseData.set({ ...this.tableMerchandiseData(), body: [] });
    this.registerGuideService.sequenceMerchandise = this.registerGuideService.sequenceMerchandise
      ? this.registerGuideService.sequenceMerchandise.filter(
          (merch) => merch.temporalId !== this.merchandiseRowsSelected[0].hiddenData.temporalId,
        )
      : null;
    this.sessionStorage.set('sequenceMerchandise', this.registerGuideService.sequenceMerchandise);
    this.displayDeleteBtnMerchandise.set(false);
    this.loadTableData();
    this.displayDeleteModal();
  }

  formIsValid(): boolean {
    return this.houseMasterForm.valid && this.merchandiseTableHasValue();
  }

  private loadTableData() {
    const sequenceMerchandise = this.registerGuideService.sequenceMerchandise;
    if (!!sequenceMerchandise) {
      const body = sequenceMerchandise.map((merch) => [
        merch.grossWeightMeasure,
        merch.grossWeightUnitCode,
        merch.pieceQuantity,
        merch.description,
        merch.chargeableWeightMeasure,
        merch.chargeableWeightUnitCode,
      ]);

      this.tableMerchandiseData.set({ ...this.tableMerchandiseData(), body });
      this.hiddenMerchandiseData.set(sequenceMerchandise);
    }
  }

  displayDeleteModal() {
    $('#registerDeletedMerch').modal();
  }

  private getIataAirports() {
    this.catalogsService
      .getAirportsIata()
      .pipe(
        tap((iataAirports: Location[]) => {
          this.iataAirports = iataAirports;

          if (this.houseMasterForm.controls['finalType'].value === this.locationEnum.IATA) {
            this.finalIds = iataAirports;
          }

          if (this.houseMasterForm.controls['originType'].value === this.locationEnum.IATA) {
            this.originIds = iataAirports;
          }

          if (this.houseMasterForm.controls['issueLocation'].value === this.locationEnum.IATA) {
            this.issueIds = iataAirports;
          }
        }),
        tap(() => {
          if (this.isUpdating) {
            this.setIds();
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
            this.houseMasterForm.controls['finalType'].value ===
            this.locationEnum.CONTROLLED_PREMISES
          ) {
            this.finalIds = controlledPremises;
          }

          if (
            this.houseMasterForm.controls['originType'].value ===
            this.locationEnum.CONTROLLED_PREMISES
          ) {
            this.originIds = controlledPremises;
          }

          if (
            this.houseMasterForm.controls['issueLocation'].value ===
            this.locationEnum.CONTROLLED_PREMISES
          ) {
            this.issueIds = controlledPremises;
          }
        }),
        tap(() => {
          if (this.isUpdating) {
            this.setIds();
          }
        }),
        take(1),
      )
      .subscribe();
  }

  private setIds() {
    const houseMasterForm = this.sessionStorage.get<any>('houseMasterForm');

    if (!!houseMasterForm) {
      const issueName = this.registerGuideService.getNameByLocation(
        this.issueIds,
        houseMasterForm.departureId,
      );
      const originName = this.registerGuideService.getNameByLocation(
        this.originIds,
        houseMasterForm.originId,
      );
      const finalName = this.registerGuideService.getNameByLocation(
        this.finalIds,
        houseMasterForm.finalId,
      );
      this.houseMasterForm.controls['departureId'].setValue(issueName);
      this.houseMasterForm.controls['originId'].setValue(originName);
      this.houseMasterForm.controls['finalId'].setValue(finalName);
    }
  }

  private loadFromSessionStorage() {
    const houseMasterForm = this.sessionStorage.get<any>('houseMasterForm');
    if (!!houseMasterForm) {
      try {
        // defer patching to avoid ExpressionChangedAfterItHasBeenCheckedError
        this.houseMasterForm.patchValue(houseMasterForm);
        this.houseMasterForm.controls['originName'].setValue(houseMasterForm.originId);
        this.houseMasterForm.controls['placeOfContract'].setValue(houseMasterForm.departureId);
        this.houseMasterForm.controls['finalName'].setValue(houseMasterForm.finalId);
        this.actualDate = houseMasterForm.actualDate
          ? new Date(houseMasterForm.actualDate)
          : undefined;
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
