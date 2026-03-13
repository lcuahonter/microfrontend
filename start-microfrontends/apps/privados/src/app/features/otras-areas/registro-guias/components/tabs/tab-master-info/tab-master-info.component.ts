import { FormUtils } from '@/shared/utils/formUtils';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Tooltip } from '@/shared/components/tooltip/tooltip.component';
import { TimeFormatDirective } from '@/shared/directives/time-format.directive';
import { TableComponent } from '@/shared/components/table/table.component';
import { TableBodyData, TableData } from '@/shared/interfaces/table.interface';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { RoutingService } from '@/core/services/routing.service';
import { STORE_FRONT_ROUTES } from '@/routes.constants';
import { OTRAS_AREAS_ROUTES } from '../../../../otras-areas.routes.constants';
import { REGISTRO_GUIAS_ROUTES } from '../../../registro-guias.routes.constants';
import { UppercaseDirective } from '@/shared/directives/uppercase.directive';
import { MaxLengthDirective } from '@/shared/directives/max-length.directive';
import { NumericDecimalDirective } from '@/shared/directives/numeric-decimal.directive';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { CatologsRegisterGuideService } from '../../../services/catologs-register-guide.service';
import { Subject, take, takeUntil, tap } from 'rxjs';
import {
  Currency,
  Location,
  LocationEnum,
  PaymentIndicator,
  UnitsWeight,
} from '../../../interfaces/catalogs.interface';
import { RegisterGuideService } from '../../../services/register-guide.service';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { BusinessHeaderDocument, MasterConsignment } from '../../../interfaces/master.interface';
import { combineLocalDateAndTime } from '@/shared/utils/serviceUtils';

declare const $: any;
@Component({
  selector: 'app-tab-master-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TimeFormatDirective,
    CommonModule,
    DatePickerComponent,
    BsDatepickerModule,
    Tooltip,
    TableComponent,
    ButtonComponent,
    UppercaseDirective,
    MaxLengthDirective,
    NumericDecimalDirective,
    DialogComponent,
  ],
  templateUrl: './tab-master-info.component.html',
})
export class TabMasterInfoComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private routingService = inject(RoutingService);
  private sessionStorage = inject(SessionStorageService);
  private catalogsService = inject(CatologsRegisterGuideService);
  private destroy$ = new Subject<void>();
  registerGuideService = inject(RegisterGuideService);
  tableCommodityData = signal<TableData>({
    headers: [
      'Type Code',
      'Gross Weight Measure',
      'Gross Weight Measure - unit Code',
      'Piece Quantity',
      'Identification',
    ],
    body: [],
  });
  locationEnum = LocationEnum;
  isLoadingCommodityData = signal<boolean>(false);
  errorCommodityData = false;
  valueMissingCommodityTable = false;
  displayDeleteBtnCommodity = signal<boolean>(false);
  tableFeeData = signal<TableData>({
    headers: [
      'Type Code',
      'Agent Total Due Payable Amount',
      'Agent Total Due Payable Amount - currency ID',
      'Grand Total Amount',
      'Grand Total Amount - currency ID',
    ],
    body: [],
  });
  isLoadingFeeData = signal<boolean>(false);
  displayDeleteBtnFee = signal<boolean>(false);
  displayWarningFee = signal<boolean>(false);
  displayWarningCommodity = signal<boolean>(false);
  errorFeeData = false;
  valueMissingFeeTable = false;
  iataAirports: Location[] = [];
  controlledPremises: Location[] = [];
  issueIds: Location[] = [];
  originIds: Location[] = [];
  finalIds: Location[] = [];
  paymentIndicators: PaymentIndicator[] = [];
  currency: Currency[] = [];
  weightUnits: UnitsWeight[] = [];
  formUtils = FormUtils;
  masterForm = this.formBuilder.group({
    waybillNumber: this.formBuilder.control<string>('', {
      validators: [Validators.required, this.formUtils.waybillNumber()],
    }),
    actualDateTime: this.formBuilder.control<Date | null>(null, {
      validators: [Validators.required],
    }),
    time: this.formBuilder.control<string>('', {
      validators: [Validators.required],
    }),
    issueLocation: this.formBuilder.control<string | null>(null, {
      validators: [Validators.required],
    }),
    issueId: this.formBuilder.control<string | null>(null, {
      validators: [Validators.required],
    }),
    placeOfContract: this.formBuilder.control<string | null>(null),
    signatoryCarrier: this.formBuilder.control<string>('', {
      validators: [Validators.required],
    }),
    originType: this.formBuilder.control<string | null>(null, {
      validators: [Validators.required],
    }),
    originId: this.formBuilder.control<string | null>(null, {
      validators: [Validators.required],
    }),
    originName: this.formBuilder.control<string | null>(null),
    finalType: this.formBuilder.control<string | null>(null, {
      validators: [Validators.required],
    }),
    finalId: this.formBuilder.control<string | null>(null, {
      validators: [Validators.required],
    }),
    finalName: this.formBuilder.control<string | null>(null),
    transportationAmount: this.formBuilder.control<string>('', {
      validators: [Validators.required],
    }),
    currencyCode: this.formBuilder.control<string | null>(null, {
      validators: [Validators.required],
    }),
    totalChargeIndicator: this.formBuilder.control<boolean | null>(null, {
      validators: [Validators.required],
    }),
    totalDisbursementIndicator: this.formBuilder.control<boolean | null>(null, {
      validators: [Validators.required],
    }),
    grossWeight: this.formBuilder.control<number | null>(null, {
      validators: [Validators.required],
    }),
    grossWeightUnit: this.formBuilder.control<string | null>(null, {
      validators: [Validators.required],
    }),
    totalPieceQuantity: this.formBuilder.control<number | null>(null, {
      validators: [Validators.required],
    }),
  });
  actualDateTimeInitialValue: Date | undefined = undefined;
  isUpdating: boolean = false;

  ngOnInit(): void {
    this.getControlledPremises();
    this.getIataAirports();
    this.getPaymentIndicators();
    this.getCurrency();
    this.loadFromSessionStorage();
    this.getUnitsWeight();
    this.listenIdSelectsChanges();
    this.loadTablesData();

    const purpuseCode = this.sessionStorage.get<string>('purpuseCode');
    this.isUpdating = purpuseCode === 'Update';
  }

  saveValuesInSessionStorage() {
    this.sessionStorage.set('infoMasterTab', this.masterForm.value);
  }

  private loadTablesData() {
    const merchandiseDetails = this.registerGuideService.merchandiseDetails;
    if (!!merchandiseDetails) {
      const body = [
        [
          merchandiseDetails.rateType,
          merchandiseDetails.grossWeightMeasure,
          merchandiseDetails.grossWeightUnitCode,
          merchandiseDetails.pieceQuantity,
          merchandiseDetails.description,
        ],
      ];

      this.tableCommodityData.set({ ...this.tableCommodityData(), body });
    }

    const feeDetails = this.registerGuideService.feeDetails;
    if (!!feeDetails) {
      const body = [
        [
          feeDetails.rateType,
          feeDetails.agentTotalDuePayable,
          feeDetails.agentCurrencyId,
          feeDetails.grandTotalAmount,
          feeDetails.grandCurrencyId,
        ],
      ];

      this.tableFeeData.set({ ...this.tableFeeData(), body });
    }
  }

  private listenIdSelectsChanges() {
    this.masterForm.controls['originId'].valueChanges
      .pipe(
        tap((value) => {
          this.masterForm.controls['originName'].setValue(value);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.masterForm.controls['finalId'].valueChanges
      .pipe(
        tap((value) => {
          this.masterForm.controls['finalName'].setValue(value);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.masterForm.controls['issueId'].valueChanges
      .pipe(
        tap((value) => {
          this.masterForm.controls['placeOfContract'].setValue(value);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.masterForm.controls['originType'].valueChanges
      .pipe(
        tap(() => this.masterForm.controls['originName'].setValue(null)),
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

    this.masterForm.controls['issueLocation'].valueChanges
      .pipe(
        tap(() => this.masterForm.controls['placeOfContract'].setValue(null)),
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

    this.masterForm.controls['finalType'].valueChanges
      .pipe(
        tap(() => this.masterForm.controls['finalName'].setValue(null)),
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

  onSubmit() {
    this.masterForm.markAllAsTouched();
    this.saveValuesInSessionStorage();

    if (this.commodityTableHasValue()) {
      this.valueMissingCommodityTable = false;
    } else {
      this.valueMissingCommodityTable = true;
    }

    if (this.feeTableHasValue()) {
      this.valueMissingFeeTable = false;
    } else {
      this.valueMissingFeeTable = true;
    }

    if (this.masterForm.valid) {
      this.buildObjectoToSaveData();
    }
  }

  buildObjectoToSaveData() {
    const { actualDateTime, time } = this.masterForm.value;

    if (!actualDateTime || !time) {
      return;
    }

    const dateTime = combineLocalDateAndTime(actualDateTime as Date, time as string);
    let issueAuthenticationLocation = '';
    const issueLocation = this.masterForm.controls['issueLocation'].value;
    const issueId = this.masterForm.controls['issueId'].value;

    if (issueLocation === this.locationEnum.IATA) {
      issueAuthenticationLocation = this.iataAirports.filter((value) => value.valor === issueId)[0]
        ?.clave;
    } else if (issueLocation === this.locationEnum.CONTROLLED_PREMISES) {
      issueAuthenticationLocation = this.controlledPremises.filter(
        (value) => value.valor === issueId,
      )[0]?.clave;
    }

    const businessHeader: BusinessHeaderDocument = {
      id: this.masterForm.controls['waybillNumber'].value || '',
      signatoryCarrierAuthentication_ActualDateTime: dateTime,
      signatoryCarrierAuthentication_Signatory:
        this.masterForm.controls['signatoryCarrier'].value || '',
      signatoryCarrierAuthentication_IssueAuthenticationLocation: issueAuthenticationLocation,
      senderAssignedID: null,
      includedHeaderNote: null,
      signatoryConsignorAuthentication: null,
    };

    this.registerGuideService.businessHeader = businessHeader;

    let originLocation_Id = '';
    const originType = this.masterForm.controls['originType'].value;
    const originId = this.masterForm.controls['originId'].value;
    const originName = this.masterForm.controls['originName'].value || '';

    if (originType === this.locationEnum.IATA) {
      originLocation_Id = this.iataAirports.filter((value) => value.valor === originId)[0]?.clave;
    } else if (originType === this.locationEnum.CONTROLLED_PREMISES) {
      originLocation_Id = this.controlledPremises.filter((value) => value.valor === originId)[0]
        ?.clave;
    }

    let finalDestinationLocation_Id = '';
    const finalType = this.masterForm.controls['finalType'].value;
    const finalId = this.masterForm.controls['finalId'].value;
    const finalName = this.masterForm.controls['finalName'].value || '';

    if (finalType === this.locationEnum.IATA) {
      finalDestinationLocation_Id = this.iataAirports.filter((value) => value.valor === finalId)[0]
        ?.clave;
    } else if (finalType === this.locationEnum.CONTROLLED_PREMISES) {
      finalDestinationLocation_Id = this.controlledPremises.filter(
        (value) => value.valor === finalId,
      )[0]?.clave;
    }

    const masterConsignment: Partial<MasterConsignment> = {
      id: null,
      additionalID: null,
      freightForwarderAssignedID: null,
      associatedReferenceID: null,
      nilCarriageValueIndicator: null,
      originLocation_Id,
      originLocation_Name: originName,
      finalDestinationLocation_Id,
      finalDestinationLocation_Name: finalName,
      declaredValueForCarriageAmount:
        Number(this.masterForm.controls['transportationAmount'].value) || 0,
      declaredValueForCarriageAmount_CurrencyID:
        this.masterForm.controls['currencyCode'].value || '',
      totalChargePrepaidIndicator: this.masterForm.controls['totalChargeIndicator'].value === true,
      totalDisbursementPrepaidIndicator:
        this.masterForm.controls['totalDisbursementIndicator'].value === true,
      includedTareGrossWeightMeasure: Number(this.masterForm.controls['grossWeight'].value),
      includedTareGrossWeightMeasure_UnitCode:
        this.masterForm.controls['grossWeightUnit'].value || '',
      totalPieceQuantity: Number(this.masterForm.controls['totalPieceQuantity'].value),
      nilCustomsValueIndicator: null,
      declaredValueForCustomsAmount: null,
      declaredValueForCustomsAmount_CurrencyID: null,
      nilInsuranceValueIndicator: null,
      insuranceValueAmount: null,
      insuranceValueAmount_CurrencyID: null,
      grossVolumeMeasure: null,
      grossVolumeMeasure_UnitCode: null,
      densityGroupCode: null,
      packageQuantity: null,
      productID: null,
      applicableRating: [
        {
          typeCode: this.registerGuideService.merchandiseDetails?.rateType || '',
          totalChargeAmount: null,
          totalChargeAmount_CurrencyID: null,
          consignmentItemQuantity: null,
          includedMasterConsignmentItem: [
            {
              sequenceNumeric: null,
              packageQuantity: null,
              volumetricFactor: null,
              information: null,
              originCountry_ID: null,
              specifiedRateCombinationPointLocation_ID: null,
              typeCode: [
                {
                  value: this.registerGuideService.merchandiseDetails?.rateType || '',
                  listID: null,
                  listAgencyID: null,
                  listAgencyName: null,
                  listName: null,
                  listVersionID: null,
                  name: null,
                  languageID: null,
                  listURI: null,
                  listSchemeURI: null,
                },
              ],
              grossWeightMeasure: Number(
                this.registerGuideService.merchandiseDetails?.grossWeightMeasure,
              ),
              grossWeightMeasure_UnitCode:
                this.registerGuideService.merchandiseDetails?.grossWeightUnitCode || '',
              pieceQuantity: Number(this.registerGuideService.merchandiseDetails?.pieceQuantity),
              natureIdentificationTransportCargo_Identification:
                this.registerGuideService.merchandiseDetails?.description || '',

              grossVolumeMeasure: null,
              grossVolumeMeasure_UnitCode: null,
              associatedUnitLoadTransportEquipment: null,
              transportLogisticsPackage: null,
              applicableFreightRateServiceCharge: null,
              applicableUnitLoadDeviceRateClass: null,
            },
          ],
        },
      ],
      applicableTotalRating: [
        {
          typeCode: this.registerGuideService.feeDetails?.rateType || '',
          applicableDestinationCurrencyServiceCharge: null,
          applicablePrepaidCollectMonetarySummation: [
            {
              prepaidIndicator: this.registerGuideService.feeDetails?.rateType === 'true',
              weightChargeTotalAmount: null,
              weightChargeTotalAmount_CurrencyID: null,
              valuationChargeTotalAmount: null,
              valuationChargeTotalAmount_CurrencyID: null,
              taxTotalAmount: null,
              taxTotalAmount_CurrencyID: null,
              agentTotalDuePayableAmount: Number(
                this.registerGuideService.feeDetails?.agentTotalDuePayable,
              ),
              agentTotalDuePayableAmount_CurrencyID:
                this.registerGuideService.feeDetails?.agentCurrencyId || '',
              carrierTotalDuePayableAmount: null,
              carrierTotalDuePayableAmount_CurrencyID: null,
              grandTotalAmount: Number(this.registerGuideService.feeDetails?.grandTotalAmount),
              grandTotalAmount_CurrencyID:
                this.registerGuideService.feeDetails?.grandCurrencyId || '',
            },
          ],
        },
      ],
    };

    this.registerGuideService.masterConsignmentTabMaster = masterConsignment;
  }

  radioHasValue(controlName: string): boolean {
    const control = this.masterForm.get(controlName);
    return !!control && control.value !== null && control.value !== '';
  }

  commoditySelected([rowsSelected]: TableBodyData[]) {
    if (!!rowsSelected) {
      this.displayDeleteBtnCommodity.set(true);
    } else {
      this.displayDeleteBtnCommodity.set(false);
    }
  }

  feeSelected([rowsSelected]: TableBodyData[]) {
    if (!!rowsSelected) {
      this.displayDeleteBtnFee.set(true);
    } else {
      this.displayDeleteBtnFee.set(false);
    }
  }

  removeCommodity() {
    this.tableCommodityData.set({ ...this.tableCommodityData(), body: [] });
    this.sessionStorage.remove('merchandiseDetails');
    this.registerGuideService.merchandiseDetails = null;
    this.displayDeleteBtnCommodity.set(false);
    this.displayWarningCommodity.set(false);
    this.displayDeleteModal();
  }

  removeFee() {
    this.tableFeeData.set({ ...this.tableFeeData(), body: [] });
    this.sessionStorage.remove('feeDetails');
    this.registerGuideService.feeDetails = null;
    this.displayDeleteBtnFee.set(false);
    this.displayWarningFee.set(false);
    this.displayDeleteModal();
  }

  commodityTableHasValue(): boolean {
    return this.tableCommodityData().body.length > 0;
  }

  feeTableHasValue(): boolean {
    return this.tableFeeData().body.length > 0;
  }

  formIsValid(): boolean {
    return this.masterForm.valid && this.commodityTableHasValue() && this.feeTableHasValue();
  }

  addCommodity() {
    if (this.commodityTableHasValue()) {
      this.displayWarningCommodity.set(true);
    } else {
      this.saveValuesInSessionStorage();
      this.routingService.navigate([
        STORE_FRONT_ROUTES.OTRAS_AREAS,
        OTRAS_AREAS_ROUTES.REGISTRO_GUIAS_AEREAS,
        REGISTRO_GUIAS_ROUTES.DETALLE_MERCANCIA,
      ]);
    }
  }

  addFee() {
    if (this.feeTableHasValue()) {
      this.displayWarningFee.set(true);
    } else {
      this.saveValuesInSessionStorage();
      this.routingService.navigate([
        STORE_FRONT_ROUTES.OTRAS_AREAS,
        OTRAS_AREAS_ROUTES.REGISTRO_GUIAS_AEREAS,
        REGISTRO_GUIAS_ROUTES.DETALLE_TARIFA,
      ]);
    }
  }

  displayDeleteModal() {
    $('#registerDeleted').modal();
  }

  private getIataAirports() {
    this.catalogsService
      .getAirportsIata()
      .pipe(
        tap((iataAirports: Location[]) => {
          this.iataAirports = iataAirports;
          if (this.masterForm.controls['finalType'].value === this.locationEnum.IATA) {
            this.finalIds = iataAirports;
          }

          if (this.masterForm.controls['originType'].value === this.locationEnum.IATA) {
            this.originIds = iataAirports;
          }

          if (this.masterForm.controls['issueLocation'].value === this.locationEnum.IATA) {
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
            this.masterForm.controls['finalType'].value === this.locationEnum.CONTROLLED_PREMISES
          ) {
            this.finalIds = controlledPremises;
          }

          if (
            this.masterForm.controls['originType'].value === this.locationEnum.CONTROLLED_PREMISES
          ) {
            this.originIds = controlledPremises;
          }

          if (
            this.masterForm.controls['issueLocation'].value ===
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
    const infoMasterTab = this.sessionStorage.get<any>('infoMasterTab');

    if (!!infoMasterTab) {
      const issueName = this.registerGuideService.getNameByLocation(
        this.issueIds,
        infoMasterTab.issueId,
      );
      const originName = this.registerGuideService.getNameByLocation(
        this.originIds,
        infoMasterTab.originId,
      );
      const finalName = this.registerGuideService.getNameByLocation(
        this.finalIds,
        infoMasterTab.finalId,
      );
      this.masterForm.controls['issueId'].setValue(issueName);
      this.masterForm.controls['originId'].setValue(originName);
      this.masterForm.controls['finalId'].setValue(finalName);
    }
  }

  private getPaymentIndicators() {
    this.catalogsService
      .getPaymentIndicators()
      .pipe(
        tap((paymentIndicators: PaymentIndicator[]) => {
          this.paymentIndicators = paymentIndicators;
        }),
        take(1),
      )
      .subscribe();
  }

  private getCurrency() {
    this.catalogsService
      .getCurrency()
      .pipe(
        tap((currency: Currency[]) => {
          this.currency = currency;
        }),
        take(1),
      )
      .subscribe();
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

  private loadFromSessionStorage() {
    const infoMasterTab = this.sessionStorage.get<any>('infoMasterTab');

    if (!!infoMasterTab) {
      try {
        this.masterForm.patchValue(infoMasterTab);
        this.masterForm.controls['originName'].setValue(infoMasterTab.originId);
        this.masterForm.controls['placeOfContract'].setValue(infoMasterTab.issueId);
        this.masterForm.controls['finalName'].setValue(infoMasterTab.finalId);
        this.actualDateTimeInitialValue = infoMasterTab.actualDateTime
          ? new Date(infoMasterTab.actualDateTime)
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
