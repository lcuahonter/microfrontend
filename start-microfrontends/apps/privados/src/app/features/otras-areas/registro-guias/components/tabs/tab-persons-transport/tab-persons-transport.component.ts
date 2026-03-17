import { TableComponent } from '@/shared/components/table/table.component';
import { TableBodyData, TableData } from '@/shared/interfaces/table.interface';
import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { Tooltip } from '@/shared/components/tooltip/tooltip.component';
import { FormUtils } from '@/shared/utils/formUtils';
import { RoutingService } from '@/core/services/routing.service';
import { STORE_FRONT_ROUTES } from '@/routes.constants';
import { OTRAS_AREAS_ROUTES } from '../../../../otras-areas.routes.constants';
import { REGISTRO_GUIAS_ROUTES } from '../../../registro-guias.routes.constants';
import { MaxLengthDirective } from '@/shared/directives/max-length.directive';
import { RegisterGuideService } from '../../../services/register-guide.service';
import { TypeSearchGuideRegister } from '../../../interfaces/guides-register.interface';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { CatologsRegisterGuideService } from '../../../services/catologs-register-guide.service';
import { Subject, take, takeUntil, tap } from 'rxjs';
import {
  Code,
  Currency,
  Location,
  LocationEnum,
  OperationType,
} from '../../../interfaces/catalogs.interface';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { MasterConsignment } from '../../../interfaces/master.interface';
import {
  combineLocalDateAndTime,
  formatIsoLiteral,
  formatToSqlDateTime,
  mergeDateWithTime,
  parseSafeDate,
} from '@/shared/utils/serviceUtils';
import {
  HouseConsignmentHouse,
  PostalStructuredAddressHouse,
} from '../../../interfaces/house.interface';
declare const $: any;

@Component({
  selector: 'app-tab-persons-transport',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TableComponent,
    ButtonComponent,
    Tooltip,
    MaxLengthDirective,
    DialogComponent,
  ],
  templateUrl: './tab-persons-transport.component.html',
})
export class TabPersonsTransportComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private routingService = inject(RoutingService);
  private registerGuideService = inject(RegisterGuideService);
  private sessionStorage = inject(SessionStorageService);
  private catalogsService = inject(CatologsRegisterGuideService);
  private destroy$ = new Subject<void>();
  tablePeopleData = signal<TableData>({
    headers: [
      'Type Person',
      'Name',
      'Role Code',
      'Role',
      'Street Name',
      'City Name',
      'Country ID',
      'Country Name',
    ],
    body: [],
  });
  isLoadingPeopleData = signal<boolean>(false);
  hiddenPeopleData = signal<Object[]>([]);
  errorPeopleData = false;
  valueMissingPeopleTable = false;
  displayDeleteBtnPeople = signal<boolean>(false);
  displayDeleteBtnTransport = signal<boolean>(false);
  displayUpdateBtnTransport = signal<boolean>(false);
  tableTransportData = signal<TableData>({
    headers: [
      'Stage Code',
      'Mode',
      'Scheduled Ocurrence Date Time',
      'ID IATA',
      'Name',
      'Scheduled Ocurrence Date Time',
      'ID IATA',
      'Name',
    ],
    body: [],
  });
  isLoadingTransportData = signal<boolean>(false);
  hiddenTransportData = signal<Object[]>([]);
  errorTransportData = false;
  valueMissingTransportTable = false;
  peopleRowsSelected: TableBodyData[] = [];
  transportRowsSelected: TableBodyData[] = [];
  operationTypes: OperationType[] = [];
  codesHandling: Code[] = [];
  codesSpecial: Code[] = [];
  codesSSH: Code[] = [];
  codesSSR: Code[] = [];
  currencyCodes: Currency[] = [];
  iataAirports: Location[] = [];
  controlledPremises: Location[] = [];
  originIds: Location[] = [];
  finalIds: Location[] = [];
  formUtils = FormUtils;
  locationEnum = LocationEnum;
  typeSearchEnum = TypeSearchGuideRegister;
  specialServiceForm = this.formBuilder.group({
    subjectCode: [null, Validators.required],
    handlingType: ['SpecialHandlingCodes'],
    handlingDescription: [null],
    handlingDescriptionCode: [null],
    specialType: ['SpecialHandlingCodes'],
    specialDescription: [null],
    specialDescriptionCode: [null],
    originCurrency: [null, Validators.required],
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
  });
  warningText = `Se debe agregar tipo persona: ${
    this.isHouse ? 'Consignor, Consignee y Freight Forwarder ' : 'Consignor y Consignee'
  }`;
  titleDetails = this.isHouse ? 'Datos del transporte' : 'Detalle del transporte';
  isUpdating: boolean = false;

  ngOnInit() {
    const purpuseCode = this.sessionStorage.get<string>('purpuseCode');
    this.isUpdating = purpuseCode === 'Update';
    this.getOperationTypes();
    this.getCodesSPH();
    this.getCodesSSR();
    this.getCurrency();
    this.listenIdSelectsChanges();
    if (this.isHouse) {
      this.getIataAirports();
      this.getControlledPremises();
      this.specialServiceForm.get('originType')?.setValidators([Validators.required]);
      this.specialServiceForm.get('originId')?.setValidators([Validators.required]);
      this.specialServiceForm.get('originName')?.setValidators([Validators.required]);

      this.specialServiceForm.get('finalType')?.setValidators([Validators.required]);
      this.specialServiceForm.get('finalId')?.setValidators([Validators.required]);
      this.specialServiceForm.get('finalName')?.setValidators([Validators.required]);
    } else {
      this.specialServiceForm.get('originType')?.clearValidators();
      this.specialServiceForm.get('originId')?.clearValidators();
      this.specialServiceForm.get('originName')?.clearValidators();

      this.specialServiceForm.get('finalType')?.clearValidators();
      this.specialServiceForm.get('finalId')?.clearValidators();
      this.specialServiceForm.get('finalName')?.clearValidators();
    }
    this.specialServiceForm.updateValueAndValidity();
    this.loadFromSessionStorage();
    this.loadTablesData();
  }

  saveValuesInSessionStorage() {
    this.sessionStorage.set('specialServiceForm', this.specialServiceForm.value);
  }

  get isHouse() {
    return this.registerGuideService.searchByGuideRegister() === this.typeSearchEnum.HOUSE;
  }

  get formsDispatched() {
    return !!this.registerGuideService.formsDispatched();
  }

  get hasConsigneeAndConsignor(): boolean {
    return this.hasConsignee && this.hasConsignor;
  }

  get hasConsignee(): boolean {
    return !!this.registerGuideService.persons?.some((p) => p.typePerson === 'Consignee');
  }

  get hasConsignor(): boolean {
    return !!this.registerGuideService.persons?.some((p) => p.typePerson === 'Consignor');
  }

  get hasFreightForwarder(): boolean {
    return !!this.registerGuideService.persons?.some((p) => p.typePerson === 'Freight Forwarder');
  }
  get hasOther(): boolean {
    return !!this.registerGuideService.persons?.some((p) => p.typePerson === 'Other');
  }

  get tableIsValid(): boolean {
    return this.isHouse
      ? this.hasConsigneeAndConsignor && this.hasFreightForwarder
      : this.hasConsigneeAndConsignor;
  }

  displayHasAllPersonsModal() {
    $('#hasAllPersons').modal();
  }

  tablePeopleTableHasValue(): boolean {
    return this.tablePeopleData().body.length > 0;
  }

  peopleSelected(rowsSelected: TableBodyData[]) {
    this.peopleRowsSelected = rowsSelected;
    if (!!rowsSelected && rowsSelected.length === 1) {
      this.displayDeleteBtnPeople.set(true);
    } else {
      this.displayDeleteBtnPeople.set(false);
    }
  }

  transportSelected(rowsSelected: TableBodyData[]) {
    this.transportRowsSelected = rowsSelected;
    if (!!rowsSelected && rowsSelected.length === 1) {
      this.displayDeleteBtnTransport.set(true);
      this.displayUpdateBtnTransport.set(true);
    } else {
      this.displayDeleteBtnTransport.set(false);
      this.displayUpdateBtnTransport.set(false);
    }
  }

  removePerson() {
    this.tablePeopleData.set({ ...this.tablePeopleData(), body: [] });
    this.registerGuideService.persons = this.registerGuideService.persons
      ? this.registerGuideService.persons.filter(
          (person) => person.typePerson !== this.peopleRowsSelected[0].rows[0],
        )
      : null;
    this.sessionStorage.set('persons', this.registerGuideService.persons);
    this.displayDeleteBtnPeople.set(false);
    this.loadTablesData();
    this.displayDeleteModal();
  }

  removeTransport() {
    this.tablePeopleData.set({ ...this.tablePeopleData(), body: [] });
    this.registerGuideService.transportDetails = this.registerGuideService.transportDetails
      ? this.registerGuideService.transportDetails.filter(
          (transport) =>
            transport.temporalId !== this.transportRowsSelected[0].hiddenData.temporalId,
        )
      : null;
    this.sessionStorage.set('transportDetails', this.registerGuideService.transportDetails);
    this.displayDeleteBtnTransport.set(false);
    this.loadTablesData();
    this.displayDeleteModal();
  }

  updateTransport() {
    this.sessionStorage.set('transportDetailsToUpdate', this.transportRowsSelected[0].hiddenData);
    this.addTransport();
  }

  displayDeleteModal() {
    $('#registerDeletedPeople').modal();
  }

  onSubmit(): void {
    this.specialServiceForm.markAllAsTouched();
    if (this.peopleTableHasValue()) {
      this.valueMissingPeopleTable = false;
    } else {
      this.valueMissingPeopleTable = true;
    }

    if (this.transportTableHasValue()) {
      this.valueMissingTransportTable = false;
    } else {
      this.valueMissingTransportTable = true;
    }

    if (this.specialServiceForm.valid) {
      this.buildObjectoToSaveData();
    }
  }

  buildObjectoToSaveData() {
    const consignee = this.registerGuideService.getPersonByType('Consignee');
    const consignor = this.registerGuideService.getPersonByType('Consignor');
    const freightForwarder = this.registerGuideService.getPersonByType('Freight Forwarder');
    const other = this.registerGuideService.getPersonByType('Other');

    if (this.registerGuideService.isMaster) {
      const masterConsignment: Partial<MasterConsignment> = {
        specifiedLogisticsTransportMovement: this.registerGuideService.transportDetails?.map(
          (c) => ({
            stageCode: c.stageCode,
            modeCode: null,
            mode: c.mode,
            id: c.mode,
            sequenceNumeric: null,
            usedLogisticsTransportMeans_Name: null,
            arrivalEvent: {
              scheduledOccurrenceDateTime: combineLocalDateAndTime(
                new Date(String(c.arrivalScheduledDate)),
                String(c.arrivalScheduledTime),
              ), // ISO
              occurrenceArrivalLocation_Id: c.arrivalId,
              occurrenceArrivalLocation_Name: c.arrivalName,
              occurrenceArrivalLocation_TypeCode: null,
            },
            departureEvent: {
              scheduledOccurrenceDateTime: combineLocalDateAndTime(
                new Date(String(c.scheduledOccurrenceDate)),
                String(c.scheduledOccurrenceTime),
              ), // ISO
              occurrenceDepartureLocation_Id: c.departureId,
              occurrenceDepartureLocation_Name: c.departureName,
              occurrenceDepartureLocation_TypeCode: null,
            },
          }),
        ),
        includedCustomsNote: [
          {
            subjectCode: this.specialServiceForm.value.subjectCode || '',
            contentCode: null,
            content: null,
            countryID: null,
          },
        ],
        handlingSPHInstructions: [
          {
            description: this.specialServiceForm.value.handlingDescription || '',
            descriptionCode: this.specialServiceForm.value.handlingDescriptionCode || '',
          },
        ],
        handlingSSRInstructions: [
          {
            description: this.specialServiceForm.value.specialDescription || '',
            descriptionCode: this.specialServiceForm.value.specialDescriptionCode || '',
          },
        ],
        consigneeParty: {
          primaryID: null,
          schemeAgencyID: null,
          additionalID: null,
          accountID: null,
          name: consignee?.name || '',
          postalStructuredAddress: {
            postcodeCode: null,
            streetName: consignee?.streetName || '',
            cityName: consignee?.cityName || '',
            countryID: consignee?.countryId || '',
            countryName: consignee?.countryName || '',
            countrySubDivisionName: null,
            postOfficeBox: null,
            cityID: null,
            countrySubDivisionID: null,
            specifiedAddressLocation: null,
          },
          definedTradeContact:
            consignee?.contacts?.map((c) => ({
              personName: c.personName || '',
              departmentName: c.departmentName || '',
              directTelephoneCommunication: c.telephone || '',
              faxCommunication: null,
              uriEmailCommunication: c.emailAddress || '',
              telexCommunication: null,
            })) ?? [],
        },
        consignorParty: {
          primaryID: null,
          schemeAgencyID: null,
          additionalID: null,
          accountID: null,
          name: consignor?.name || '',
          postalStructuredAddress: {
            postcodeCode: null,
            streetName: consignor?.streetName || '',
            cityName: consignor?.cityName || '',
            countryID: consignor?.countryId || '',
            countryName: consignor?.countryName || '',
            countrySubDivisionName: null,
            postOfficeBox: null,
            cityID: null,
            countrySubDivisionID: null,
            specifiedAddressLocation: null,
          },
          definedTradeContact:
            consignor?.contacts?.map((c) => ({
              personName: c.personName || '',
              departmentName: c.departmentName || '',
              directTelephoneCommunication: c.telephone || '',
              faxCommunication: null,
              uriEmailCommunication: c.emailAddress || '',
              telexCommunication: null,
            })) ?? [],
        },
        freightForwarderParty: {
          primaryID: null,
          schemeAgencyID: null,
          additionalID: null,
          name: freightForwarder?.name || '',
          accountID: null,
          cargoAgentID: null,
          specifiedCargoAgentLocation: null,
          freightForwarderAddress: {
            postcodeCode: null,
            streetName: freightForwarder?.streetName || '',
            cityName: freightForwarder?.cityName || '',
            countryID: freightForwarder?.countryId || '',
            countryName: freightForwarder?.countryName || '',
            countrySubDivisionName: null,
            postOfficeBox: null,
            cityID: null,
            countrySubDivisionID: null,
          },
          definedTradeContact:
            freightForwarder?.contacts?.map((c) => ({
              personName: c.personName || '',
              departmentName: c.departmentName || '',
              directTelephoneCommunication: c.telephone || '',
              faxCommunication: null,
              uriEmailCommunication: c.emailAddress || '',
              telexCommunication: null,
            })) ?? [],
        },
        associatedParty: [
          {
            primaryID: null,
            schemeAgencyID: null,
            additionalID: null,
            name: other?.name || '',
            roleCode: other?.roleRealId || '',
            role: other?.roleName || '',
            postalStructuredAddress: {
              postcodeCode: null,
              streetName: freightForwarder?.streetName || '',
              cityName: freightForwarder?.cityName || '',
              countryID: freightForwarder?.countryId || '',
              countryName: freightForwarder?.countryName || '',
              countrySubDivisionName: null,
              postOfficeBox: null,
              cityID: null,
              countrySubDivisionID: null,
              specifiedAddressLocation: null,
            },
            definedTradeContact:
              other?.contacts?.map((c) => ({
                personName: c.personName || '',
                departmentName: c.departmentName || '',
                directTelephoneCommunication: c.telephone || '',
                faxCommunication: null,
                uriEmailCommunication: c.emailAddress || '',
                telexCommunication: null,
              })) ?? [],
          },
        ],
        utilizedLogisticsTransportEquipment: null,
        handlingOSIInstructions: null,
        includedAccountingNote: null,
        associatedReferenceDocument: null,
        associatedConsignmentCustomsProcedure_GoodsStatusCode: null,
        applicableOriginCurrencyExchange_SourceCurrencyCode:
          this.specialServiceForm.value.originCurrency,
        applicableDestinationCurrencyExchange: null,
        applicableLogisticsServiceCharge_TransportPaymentMethodCode: null,
        applicableLogisticsServiceCharge_ServiceTypeCode: null,
        applicableLogisticsAllowanceCharge: null,
      };
      this.registerGuideService.masterConsignmentTabPeople = masterConsignment;
    } else if (this.registerGuideService.isHouse) {
      const { originId, finalId } = this.specialServiceForm.value;
      if (!originId || !finalId) {
        return;
      }
      const originLocationId = this.registerGuideService.getIdByLocation(this.originIds, originId);
      const finalLocationId = this.registerGuideService.getIdByLocation(this.finalIds, finalId);

      const houseConsignment: Partial<HouseConsignmentHouse> = {
        consignorParty: {
          primaryID: null,
          schemeAgencyID: null,
          additionalID: null,
          name: consignor?.name || '',
          accountID: null,
          postalStructuredAddress: {
            postcodeCode: null,
            streetName: consignor?.streetName,
            cityName: consignor?.cityName,
            countryID: consignor?.countryId,
            countryName: consignor?.countryName,
            countrySubDivisionName: null,
            postOfficeBox: null,
            cityID: null,
            countrySubDivisionID: null,
            specifiedAddressLocation: null,
          } as PostalStructuredAddressHouse,
          definedTradeContact:
            consignor?.contacts?.map((c) => ({
              personName: c.personName || '',
              departmentName: c.departmentName || '',
              directTelephoneCommunication: c.telephone || '',
              faxCommunication: null,
              uriEmailCommunication: c.emailAddress || '',
              telexCommunication: null,
            })) ?? [],
        },
        consigneeParty: {
          primaryID: null,
          schemeAgencyID: null,
          additionalID: null,
          name: consignor?.name || '',
          accountID: null,
          postalStructuredAddress: {
            postcodeCode: null,
            streetName: consignee?.streetName,
            cityName: consignee?.cityName,
            countryID: consignee?.countryId,
            countryName: consignee?.countryName,
            countrySubDivisionName: null,
            postOfficeBox: null,
            cityID: null,
            countrySubDivisionID: null,
            specifiedAddressLocation: null,
          } as PostalStructuredAddressHouse,
          definedTradeContact:
            consignee?.contacts?.map((c) => ({
              personName: c.personName || '',
              departmentName: c.departmentName || '',
              directTelephoneCommunication: c.telephone || '',
              faxCommunication: null,
              uriEmailCommunication: c.emailAddress || '',
              telexCommunication: null,
            })) ?? [],
        },
        freightForwarderParty: {
          primaryID: null,
          schemeAgencyID: null,
          additionalID: null,
          name: consignor?.name || '',
          accountID: null,
          postalStructuredAddress: {
            postcodeCode: null,
            streetName: freightForwarder?.streetName,
            cityName: freightForwarder?.cityName,
            countryID: freightForwarder?.countryId,
            countryName: freightForwarder?.countryName,
            countrySubDivisionName: null,
            postOfficeBox: null,
            cityID: null,
            countrySubDivisionID: null,
            specifiedAddressLocation: null,
          } as PostalStructuredAddressHouse,
          definedTradeContact:
            freightForwarder?.contacts?.map((c) => ({
              personName: c.personName || '',
              departmentName: c.departmentName || '',
              directTelephoneCommunication: c.telephone || '',
              faxCommunication: null,
              uriEmailCommunication: c.emailAddress || '',
              telexCommunication: null,
            })) ?? [],
        },
        associatedParty: [
          {
            primaryID: null,
            schemeAgencyID: null,
            additionalID: null,
            name: other?.name || '',
            roleCode: other?.roleId || '',
            role: other?.roleName || '',
            postalStructuredAddress: {
              postcodeCode: null,
              streetName: other?.streetName,
              cityName: other?.cityName,
              countryID: other?.countryId,
              countryName: other?.countryName,
              countrySubDivisionName: null,
              postOfficeBox: null,
              cityID: null,
              countrySubDivisionID: null,
              specifiedAddressLocation: null,
            } as PostalStructuredAddressHouse,
            definedTradeContact:
              other?.contacts?.map((c) => ({
                personName: c.personName || '',
                departmentName: c.departmentName || '',
                directTelephoneCommunication: c.telephone || '',
                faxCommunication: null,
                uriEmailCommunication: c.emailAddress || '',
                telexCommunication: null,
              })) ?? [],
          },
        ],
        specifiedLogisticsTransportMovement: this.registerGuideService.transportDetails?.map(
          (c) => ({
            stageCode: c.stageCode,
            modeCode: null,
            mode: c.mode,
            id: null,
            sequenceNumeric: null,
            usedLogisticsTransportMeans_Name: null,
            arrivalEvent: {
              scheduledOccurrenceDateTime: combineLocalDateAndTime(
                new Date(parseSafeDate(String(c.arrivalScheduledDate))),
                c.arrivalScheduledTime,
              ), // ISO string
              occurrenceArrivalLocation_Id: c.arrivalId,
              occurrenceArrivalLocation_Name: c.arrivalName,
              occurrenceArrivalLocation_TypeCode: null,
              occurrenceDepartureLocation_Id: null,
              occurrenceDepartureLocation_Name: null,
              occurrenceDepartureLocation_TypeCode: null,
            },
            departureEvent: {
              scheduledOccurrenceDateTime: combineLocalDateAndTime(
                new Date(parseSafeDate(String(c.scheduledOccurrenceDate))),
                c.scheduledOccurrenceTime,
              ), // ISO string
              occurrenceArrivalLocation_Id: null,
              occurrenceArrivalLocation_Name: null,
              occurrenceArrivalLocation_TypeCode: null,
              occurrenceDepartureLocation_Id: c.departureId,
              occurrenceDepartureLocation_Name: c.departureName,
              occurrenceDepartureLocation_TypeCode: null,
            },
          }),
        ),
        includedCustomsNote: [
          {
            subjectCode: this.specialServiceForm.value.subjectCode || '',
            contentCode: null,
            content: null,
            countryID: null,
          },
        ],
        handlingSPHInstructions: [
          {
            description: this.specialServiceForm.value.handlingDescription || '',
            descriptionCode: this.specialServiceForm.value.handlingDescriptionCode || '',
          },
        ],
        handlingSSRInstructions: [
          {
            description: this.specialServiceForm.value.specialDescription || '',
            descriptionCode: this.specialServiceForm.value.specialDescriptionCode || '',
          },
        ],
        applicableOriginCurrencyExchange_SourceCurrencyCode:
          this.specialServiceForm.value.originCurrency || '',
        originLocation_Id: originLocationId,
        originLocation_Name: originId,
        finalDestinationLocation_Id: finalLocationId,
        finalDestinationLocation_Name: finalId,
      };
      this.registerGuideService.houseConsigmentTabPeople = houseConsignment;
    }
  }

  private loadTablesData() {
    const persons = this.registerGuideService.persons;
    if (!!persons) {
      const body = persons.map((person) => [
        person.typePerson,
        person.name,
        person.roleId || '',
        person.roleName || '',
        person.streetName,
        person.cityName,
        person.countryId,
        person.countryName,
      ]);

      this.tablePeopleData.set({ ...this.tablePeopleData(), body });
    }

    const transportDetails = this.registerGuideService.transportDetails;
    if (!!transportDetails) {
      const body = transportDetails.map((transport) => {
        let scheduledOccurrenceDate = '';
        let arrivalScheduledDate = '';

        const scheduledDateTimeMerged = mergeDateWithTime(
          transport.scheduledOccurrenceDate,
          transport.scheduledOccurrenceTime,
        );
        const arrivalLocationDateTimeMerged = mergeDateWithTime(
          transport.arrivalScheduledDate,
          transport.arrivalScheduledTime,
        );

        if (this.registerGuideService.purpuseCode() === 'Update') {
          scheduledOccurrenceDate = formatToSqlDateTime(scheduledDateTimeMerged);
          arrivalScheduledDate = formatToSqlDateTime(arrivalLocationDateTimeMerged);
        } else {
          scheduledOccurrenceDate = formatIsoLiteral(transport.scheduledOccurrenceDate);
          arrivalScheduledDate = formatIsoLiteral(transport.arrivalScheduledDate);
        }

        return [
          transport.stageCode || '',
          transport.mode,
          scheduledOccurrenceDate,
          transport.arrivalId,
          transport.arrivalName,
          arrivalScheduledDate,
          transport.departureId,
          transport.departureName,
        ];
      });

      this.tableTransportData.set({ ...this.tableTransportData(), body });
      this.hiddenTransportData.set(transportDetails);
    }
  }

  addPerson() {
    if (this.hasConsigneeAndConsignor && this.hasFreightForwarder && this.hasOther) {
      this.displayHasAllPersonsModal();
    } else {
      this.saveValuesInSessionStorage();
      this.routingService.navigate([
        STORE_FRONT_ROUTES.OTRAS_AREAS,
        OTRAS_AREAS_ROUTES.REGISTRO_GUIAS_AEREAS,
        REGISTRO_GUIAS_ROUTES.PERSONAS,
      ]);
    }
  }

  addTransport() {
    this.saveValuesInSessionStorage();
    this.routingService.navigate([
      STORE_FRONT_ROUTES.OTRAS_AREAS,
      OTRAS_AREAS_ROUTES.REGISTRO_GUIAS_AEREAS,
      REGISTRO_GUIAS_ROUTES.DETALLE_TRANSPORTE,
    ]);
  }

  peopleTableHasValue(): boolean {
    return this.tablePeopleData().body.length > 0;
  }

  transportTableHasValue(): boolean {
    return this.tableTransportData().body.length > 0;
  }

  formIsValid(): boolean {
    return (
      this.specialServiceForm.valid && this.peopleTableHasValue() && this.transportTableHasValue()
    );
  }

  radioHasValue(controlName: string): boolean {
    const control = this.specialServiceForm.get(controlName);
    return !!control && control.value !== null && control.value !== '';
  }

  private listenIdSelectsChanges() {
    this.specialServiceForm.controls['originId'].valueChanges
      .pipe(
        tap((value) => this.specialServiceForm.controls['originName'].setValue(value)),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.specialServiceForm.controls['finalId'].valueChanges
      .pipe(
        tap((value) => this.specialServiceForm.controls['finalName'].setValue(value)),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.specialServiceForm.controls['originType'].valueChanges
      .pipe(
        tap(() => this.specialServiceForm.controls['originName'].setValue(null)),
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

    this.specialServiceForm.controls['finalType'].valueChanges
      .pipe(
        tap(() => this.specialServiceForm.controls['finalName'].setValue(null)),
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

    this.specialServiceForm.controls['handlingType'].valueChanges
      .pipe(
        tap(() => this.specialServiceForm.controls['handlingDescriptionCode'].setValue(null)),
        tap((value) => {
          if (value === 'SpecialHandlingCodes') {
            this.codesHandling = this.codesSSH;
          }
          if (value === 'Dangerous') {
            this.codesHandling = this.codesSSR;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.specialServiceForm.controls['specialType'].valueChanges
      .pipe(
        tap(() => this.specialServiceForm.controls['specialDescriptionCode'].setValue(null)),
        tap((value) => {
          if (value === 'SpecialHandlingCodes') {
            this.codesSpecial = this.codesSSH;
          }
          if (value === 'Dangerous') {
            this.codesSpecial = this.codesSSR;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private getOperationTypes() {
    this.catalogsService
      .getOperationTypes()
      .pipe(
        tap((operationTypes: OperationType[]) => {
          this.operationTypes = operationTypes;
        }),
        take(1),
      )
      .subscribe();
  }

  private getCodesSPH() {
    this.catalogsService
      .getCodesSPH()
      .pipe(
        tap((codes: Code[]) => {
          this.codesSSH = codes;
          this.codesHandling = codes;
          this.codesSpecial = codes;
        }),
        take(1),
      )
      .subscribe();
  }

  private getCodesSSR() {
    this.catalogsService
      .getCodesSSR()
      .pipe(
        tap((codes: Code[]) => {
          this.codesSSR = codes;
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
          this.currencyCodes = currency;
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

          if (this.specialServiceForm.controls['finalType'].value === this.locationEnum.IATA) {
            this.finalIds = iataAirports;
          }

          if (this.specialServiceForm.controls['originType'].value === this.locationEnum.IATA) {
            this.originIds = iataAirports;
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
            this.specialServiceForm.controls['finalType'].value ===
            this.locationEnum.CONTROLLED_PREMISES
          ) {
            this.finalIds = controlledPremises;
          }

          if (
            this.specialServiceForm.controls['originType'].value ===
            this.locationEnum.CONTROLLED_PREMISES
          ) {
            this.originIds = controlledPremises;
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
    const specialServiceForm = this.sessionStorage.get<any>('specialServiceForm');

    if (!!specialServiceForm) {
      const originName = this.registerGuideService.getNameByLocation(
        this.originIds,
        specialServiceForm.originId,
      );
      const finalName = this.registerGuideService.getNameByLocation(
        this.finalIds,
        specialServiceForm.finalId,
      );
      this.specialServiceForm.controls['originId'].setValue(originName);
      this.specialServiceForm.controls['finalId'].setValue(finalName);
    }
  }

  private loadFromSessionStorage() {
    let specialServiceForm = this.sessionStorage.get<any>('specialServiceForm');
    specialServiceForm = {
      ...specialServiceForm,
      handlingType: 'SpecialHandlingCodes',
      specialType: 'SpecialHandlingCodes',
    };
    if (!!specialServiceForm) {
      try {
        this.specialServiceForm.patchValue(specialServiceForm);
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
