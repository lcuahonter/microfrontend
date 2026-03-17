import {
  PreFillMasterDatos,
  PreFillMasterPersona,
  PreFillMasterResponse,
  WaybillType,
} from './../interfaces/master.interface';
import { RoutingService } from '@/core/services/routing.service';
import { STORE_FRONT_ROUTES } from '@/routes.constants';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { OTRAS_AREAS_ROUTES } from '../../otras-areas.routes.constants';
import {
  CommodityForm,
  FeeDetailsForm,
  OtherContactForm,
  PersonsForm,
  SaveMasterResponse,
  TransportForm,
  TypeSearchGuideRegister,
  CargoTypeForm,
  MasterGuideForm,
  SequenceMerchandiseForm,
} from '../interfaces/guides-register.interface';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import {
  BusinessHeaderDocument as BusinessHeaderDocumentMaster,
  MasterConsignment,
  RootPayload,
} from '../interfaces/master.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { formatIsoLiteral, TypeResponseStatus } from '@/shared/utils/serviceUtils';
import { Location, LocationEnum } from '../interfaces/catalogs.interface';
import {
  ManifestRequest,
  ManifestResponse,
  BusinessHeaderDocument as BusinessHeaderDocumentManifest,
  LogisticsTransportMovement,
  ArrivalEvent,
  FlightManifestType,
} from '../interfaces/manifest.interface';
import {
  HouseConsignmentHouse,
  Persona,
  PrefillHouse,
  PrefillHouseResponse,
  RootHouse,
  WaybillTypeHouse,
} from '../interfaces/house.interface';

type SaveMasterStatus = TypeResponseStatus & { waybillNumber?: string };
type SaveManifestStatus = TypeResponseStatus & { manifestNumber?: string };
type SaveHouseStatus = TypeResponseStatus & { houseNumber?: string };

@Injectable({
  providedIn: 'root',
})
export class RegisterGuideService {
  private http = inject(HttpClient);
  private routingService = inject(RoutingService);
  private sessionStorage = inject(SessionStorageService);
  private baseUrl = 'https://catalogos-frontend.v30.ultrasist.net/api/v1/catalogos-frontend';
  private baseUrlSave = 'https://aereos-web.v30.ultrasist.net/api/aereos-web';

  typeSearchEnum = TypeSearchGuideRegister;
  activeTab = signal<string>('step1');
  purpuseCode = signal<string | null>(null);
  searchByGuideRegister = signal<TypeSearchGuideRegister | null>(null);
  formsDispatched = signal<boolean>(false);
  resetTabs = signal<boolean>(false);
  locationEnum = LocationEnum;
  // Master Forms
  merchandiseDetails: CommodityForm | null = null;
  feeDetails: FeeDetailsForm | null = null;
  persons: PersonsForm[] | null = null;
  otherContacts: OtherContactForm[] | null = null;
  transportDetails: TransportForm[] | null = null;

  // Manifest Forms
  cargoTypeForm: CargoTypeForm[] | null = null;
  masterGuideForm: MasterGuideForm[] | null = null;

  // House Forms
  sequenceMerchandise: SequenceMerchandiseForm[] | null = null;

  // Payload Master object
  rootPayload: RootPayload = {} as RootPayload;
  businessHeader: BusinessHeaderDocumentMaster = {} as BusinessHeaderDocumentMaster;
  masterConsignmentTabMaster: Partial<MasterConsignment> = {} as MasterConsignment;
  masterConsignmentTabPeople: Partial<MasterConsignment> = {} as MasterConsignment;

  // Payload Manifest object
  manifestRequest: ManifestRequest = {} as ManifestRequest;
  businessHeaderDocument: BusinessHeaderDocumentManifest = {} as BusinessHeaderDocumentManifest;
  logisticsTransportMovement: LogisticsTransportMovement = {} as LogisticsTransportMovement;
  arrivalEvent: ArrivalEvent[] = [];

  // Payload House object
  houseRequest: RootHouse = {} as RootHouse;
  houseConsigmentTabHouse: Partial<HouseConsignmentHouse> = {} as HouseConsignmentHouse;
  houseConsigmentTabPeople: Partial<HouseConsignmentHouse> = {} as HouseConsignmentHouse;

  // Pre fill
  preFillMasterDatos: PreFillMasterDatos = {} as PreFillMasterDatos;
  preFillHouseDatos: PrefillHouse = {} as PrefillHouse;

  constructor() {
    this.loadFromSessionStorage();
  }

  reset(): void {
    // Signals
    this.activeTab.set('step1');
    this.purpuseCode.set(null);
    this.searchByGuideRegister.set(null);
    this.formsDispatched.set(false);
    this.resetTabs.set(false);

    // Master Forms
    this.merchandiseDetails = null;
    this.feeDetails = null;
    this.persons = null;
    this.otherContacts = null;
    this.transportDetails = null;

    // Manifest Forms
    this.cargoTypeForm = null;
    this.masterGuideForm = null;

    // House Forms
    this.sequenceMerchandise = null;

    // Payload Master object
    this.rootPayload = {} as RootPayload;
    this.businessHeader = {} as BusinessHeaderDocumentMaster;
    this.masterConsignmentTabMaster = {} as MasterConsignment;
    this.masterConsignmentTabPeople = {} as MasterConsignment;

    // Payload Manifest object
    this.manifestRequest = {} as ManifestRequest;
    this.businessHeaderDocument = {} as BusinessHeaderDocumentManifest;
    this.logisticsTransportMovement = {} as LogisticsTransportMovement;
    this.arrivalEvent = [];

    // Payload House object
    this.houseRequest = {} as RootHouse;
    this.houseConsigmentTabHouse = {} as HouseConsignmentHouse;
    this.houseConsigmentTabPeople = {} as HouseConsignmentHouse;

    // Pre fill
    this.preFillMasterDatos = {} as PreFillMasterDatos;
    this.preFillHouseDatos = {} as PrefillHouse;
  }

  goToTabsPage() {
    this.routingService.navigate([
      STORE_FRONT_ROUTES.OTRAS_AREAS,
      OTRAS_AREAS_ROUTES.REGISTRO_GUIAS_AEREAS,
    ]);
  }

  get isManifest() {
    return this.searchByGuideRegister() === this.typeSearchEnum.MANIFEST;
  }

  get isMaster() {
    return this.searchByGuideRegister() === this.typeSearchEnum.MASTER;
  }

  get isHouse() {
    return this.searchByGuideRegister() === this.typeSearchEnum.HOUSE;
  }

  getMsgType(): string {
    return this.isManifest ? '122' : this.isHouse ? '703' : this.isMaster ? '740' : '';
  }

  getPersonByType(typePerson: string): PersonsForm | undefined {
    return this.persons?.filter((person) => person.typePerson === typePerson)[0];
  }

  getIdByLocation(ids: Location[], value: string): string {
    return ids.filter((id) => id.valor === value)[0]?.clave;
  }

  getNameByLocation(ids: Location[], value: string): string {
    return ids.filter((id) => id.clave === value)[0]?.valor;
  }

  parseDateTimeToDateAndTime(dateTime: string): { date: Date | null; time: string | null } {
    if (!dateTime) {
      return { date: null, time: null };
    }

    // Normaliza "YYYY-MM-DD HH:mm:ss" → ISO
    const normalized = dateTime.replace(' ', 'T');
    const parsedDate = new Date(normalized);

    if (isNaN(parsedDate.getTime())) {
      return { date: null, time: null };
    }

    const date = new Date(parsedDate.toISOString().split('T')[0]);
    const time = dateTime.split(' ')[1]?.slice(0, 5) ?? null;

    return { date, time };
  }

  saveMaster(): Observable<SaveMasterStatus> {
    const masterConsignment: MasterConsignment = {
      // merge partials and ensure required properties have concrete values
      ...(this.masterConsignmentTabMaster as Partial<MasterConsignment>),
      ...(this.masterConsignmentTabPeople as Partial<MasterConsignment>),
      id: null,
    } as MasterConsignment;

    const payload: RootPayload = {
      ...this.rootPayload,
      waybillType: {
        // preserve any existing waybillType fields, then override the parts we need
        ...(this.rootPayload.waybillType ?? ({} as any)),
        businessHeaderDocument: {
          ...this.businessHeader,
        },
        messageHeaderDocument: {
          ...(this.rootPayload.waybillType?.messageHeaderDocument ?? {}),
        },
        masterConsignment,
      },
    };

    return this.postMaster(payload);
  }

  deleteMaster(numMaster: string, deleting = false): Observable<SaveMasterStatus> {
    const payload: RootPayload = {
      rfc: null,
      numMaster,
      purposeCodeMenu: 'Deletion',
      typeCodeMHD: '740',
      idMensajeOriginal: null,
      waybillType: {} as WaybillType,
    };

    return this.postMaster(payload, deleting);
  }

  deleteManifest(numManifest: string, deleting = false): Observable<SaveManifestStatus> {
    const manifestRequest: ManifestRequest = {
      rfc: 'AAL0409235E6', // TODO: Este dato se debe obtener de la sesión! queda pendiente
      purposeCodeMenu: 'Deletion',
      typeCodeMHD: '122',
      numManifest,
      flightManifestType: {} as FlightManifestType,
    };

    return this.postManifest(manifestRequest, deleting);
  }

  deleteHouse(numHouse: string, deleting = false): Observable<SaveHouseStatus> {
    const houseRequest: RootHouse = {
      rfc: 'AAL0409235E6', // TODO: Este dato se debe obtener de la sesión! queda pendiente
      purposeCodeMenu: 'Deletion',
      typeCodeMHD: '703',
      numHouse,
      idMensajeOriginal: null,
      waybillType: {} as WaybillTypeHouse,
    };

    return this.postHouse(houseRequest, deleting);
  }

  saveHouse(): Observable<SaveHouseStatus> {
    const houseConsignment: HouseConsignmentHouse = {
      // merge partials and ensure required properties have concrete values
      ...(this.houseConsigmentTabHouse as Partial<HouseConsignmentHouse>),
      ...(this.houseConsigmentTabPeople as Partial<HouseConsignmentHouse>),
    } as HouseConsignmentHouse;

    const payload: RootHouse = {
      ...this.houseRequest,
      waybillType: {
        // preserve any existing waybillType fields, then override the parts we need
        businessHeaderDocument: {
          ...this.houseRequest.waybillType.businessHeaderDocument,
        },
        messageHeaderDocument: {
          ...this.houseRequest.waybillType.messageHeaderDocument,
        },
        masterConsignment: {
          ...this.houseRequest.waybillType.masterConsignment,
          includedHouseConsignment: {
            ...houseConsignment,
          },
        },
      },
    };

    return this.postHouse(payload);
  }

  saveManifest(): Observable<SaveManifestStatus> {
    const manifestRequest: ManifestRequest = {
      ...this.manifestRequest,
      flightManifestType: {
        ...this.manifestRequest.flightManifestType,
        businessHeaderDocument: {
          ...this.businessHeaderDocument,
        },
        logisticsTransportMovement: {
          ...this.logisticsTransportMovement,
        },
        arrivalEvent: [...this.arrivalEvent],
      },
    };
    return this.postManifest(manifestRequest);
  }

  postManifest(manifestRequest: ManifestRequest, deleting = false): Observable<SaveManifestStatus> {
    return this.http.post<ManifestResponse>(`${this.baseUrlSave}/manifiesto`, manifestRequest).pipe(
      map((resp) => {
        return {
          success: resp.codigo === '00',
          msg: resp.datos.respuesta || '',
          manifestNumber: deleting ? resp.datos.baja || '' : resp.datos.alta || '',
        };
      }),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo guardar el master'));
      }),
    );
  }

  postMaster(payload: RootPayload, deleting = false): Observable<SaveMasterStatus> {
    return this.http.post<SaveMasterResponse>(`${this.baseUrlSave}/master`, payload).pipe(
      map((resp) => {
        return {
          success: resp.codigo === '00',
          msg: resp.datos.respuesta || '',
          waybillNumber: deleting ? resp.datos.baja || '' : resp.datos.alta || '',
        };
      }),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo guardar el master'));
      }),
    );
  }

  postHouse(payload: RootHouse, deleting = false): Observable<SaveHouseStatus> {
    return this.http.post<SaveMasterResponse>(`${this.baseUrlSave}/house`, payload).pipe(
      map((resp) => {
        return {
          success: resp.codigo === '00',
          msg: resp.datos.respuesta || '',
          houseNumber: deleting ? resp.datos.baja || '' : resp.datos.alta || '',
        };
      }),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo guardar el house'));
      }),
    );
  }

  getHouse(numGuide: string): Observable<PrefillHouse> {
    return this.http
      .get<PrefillHouseResponse>(`${this.baseUrlSave}/prellenado-house/${numGuide}`)
      .pipe(
        map((response) => {
          this.fillHouseData(response.datos);

          return response.datos;
        }),
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener el pre llenado del House'));
        }),
      );
  }

  fillHouseData(data: PrefillHouse) {
    const { issueDateTime } = data.mensajeHouse.messageHeaderDocument;
    const { date, time } = this.parseDateTimeToDateAndTime(issueDateTime);
    const generalDataForm = {
      issueDate: date,
      issueTime: time,
      caat: data.caat,
      rfc: data.rfc,
    };
    this.sessionStorage.set('generalDataTab', generalDataForm);

    const {
      id,
      signatoryCarrierAuthentication_ActualDateTime,
      signatoryCarrierAuthentication_Signatory,
      signatoryCarrierAuthentication_IssueAuthenticationLocation,
      signatoryConsignorAuthentication,
    } = data.mensajeHouse.businessHeaderDocument;

    const { date: signatoryDate, time: signatoryTime } = this.parseDateTimeToDateAndTime(
      signatoryCarrierAuthentication_ActualDateTime,
    );

    const { transportContractDocument_Id, originLocation_Id, finalDestinationLocation_Id } =
      data.mensajeHouse.houseConsignment;

    const {
      grossVolumeMeasure,
      grossVolumeMeasure_UnitCode,
      totalPieceQuantity,
      summaryDescription,
    } = data.mensajeHouse.houseConsignment.includedHouseConsignment;

    const infoHouseTab = {
      houseWaybillNumber: id,
      actualDate: signatoryDate,
      actualTime: signatoryTime,
      issueLocation: this.resolveIdType(signatoryCarrierAuthentication_IssueAuthenticationLocation),
      departureId: signatoryCarrierAuthentication_IssueAuthenticationLocation,
      signatoryCarrier: signatoryCarrierAuthentication_Signatory,
      consignorSignature: signatoryConsignorAuthentication,
      masterWaybillNumber: transportContractDocument_Id,
      originType: this.resolveIdType(originLocation_Id),
      originId: originLocation_Id,
      finalType: this.resolveIdType(finalDestinationLocation_Id),
      finalId: finalDestinationLocation_Id,
      grossWeight: grossVolumeMeasure,
      grossWeightUnit: grossVolumeMeasure_UnitCode,
      totalPieceQuantity: totalPieceQuantity,
      totalDescription: summaryDescription,
    };

    this.sessionStorage.set('houseMasterForm', infoHouseTab);

    const sequenceMerchandise: SequenceMerchandiseForm[] = data.secuenciaMercancias.map((merch) => {
      return {
        temporalId: Number(new Date()),
        grossWeightMeasure: merch.grossWeightMeasure,
        grossWeightUnitCode: merch.grossWeightMeasureUnitCodeID,
        pieceQuantity: merch.pieceQuantity,
        description: merch.information,
        chargeableWeightMeasure: merch.grossVolumeMeasure,
        chargeableWeightUnitCode: merch.grossVolumeMeasureUnitCodeID,
      };
    });
    this.sequenceMerchandise = sequenceMerchandise;
    this.sessionStorage.set('sequenceMerchandise', sequenceMerchandise);

    const persons: PersonsForm[] = data.personas
      .filter((person) => this.shouldIncludePerson(person))
      .map((person) => {
        return {
          typePerson: person.typePersonWS2H3,
          name: person.nameWS2H3,
          streetName: person.streetNamePSAH3,
          cityName: person.countryNamePSAH3,
          countryId: person.countryPSAH3,
          countryName: person.countryNamePSAH3,
          roleId: person.roleCodeWS2H3,
          roleName: person.roleWS2H3,
          contacts: [],
        };
      });
    this.persons = persons;
    this.sessionStorage.set('persons', persons);

    const transports: TransportForm[] = data.transporte.map((transport) => {
      const { date, time } = this.parseDateTimeToDateAndTime(transport.scheduledOccurrenceDateDEH4);

      const { date: dateA, time: timeA } = this.parseDateTimeToDateAndTime(
        transport.scheduledOccurrenceDateAEH4,
      );

      return {
        temporalId: Number(new Date()),
        stageCode: transport.stageCodeSLTMH4,
        mode: transport.modeLTMH4,
        scheduledOccurrenceDate: date?.toString() ?? '',
        scheduledOccurrenceTime: time ?? '',
        arrivalLocationType: this.resolveIdType(transport.idIATAOALH4),
        arrivalId: transport.idIATAOALH4,
        arrivalIdComplete: '',
        arrivalName: transport.nameOALH4,
        arrivalScheduledDate: dateA?.toString() ?? '',
        arrivalScheduledTime: timeA ?? '',
        departureLocationType: this.resolveIdType(transport.idIATAODLH4),
        departureId: transport.idIATAODLH4,
        departureIdComplete: '',
        departureName: transport.nameODLH4,
      };
    });

    this.transportDetails = transports;
    this.sessionStorage.set('transportDetails', transports);

    const {
      subjectCode,
      applicableOriginCurrencyExchange_SourceCurrencyCode,
      originLocation_Id: originLocation_IdSpecialForm,
      finalDestinationLocation_Id: finalDestinationLocation_IdSpecialForm,
      finalDestinationLocation_Name,
      originLocation_Name,
    } = data.mensajeHouse.houseConsignment.includedHouseConsignment;
    const { handlingSPH, handlingSSR } = data;
    const specialServiceForm = {
      subjectCode,
      handlingType: '',
      handlingDescription: handlingSPH.description,
      handlingDescriptionCode: handlingSPH.descriptionCode,
      specialType: '',
      specialDescription: handlingSSR.description,
      specialDescriptionCode: handlingSSR.descriptionCode,
      originCurrency: applicableOriginCurrencyExchange_SourceCurrencyCode,
      finalType: this.resolveIdType(finalDestinationLocation_IdSpecialForm),
      finalId: finalDestinationLocation_IdSpecialForm,
      originType: this.resolveIdType(originLocation_IdSpecialForm),
      originId: originLocation_IdSpecialForm,
    };

    this.sessionStorage.set('specialServiceForm', specialServiceForm);
  }

  getMaster(numGuide: string): Observable<PreFillMasterDatos> {
    return this.http
      .get<PreFillMasterResponse>(`${this.baseUrlSave}/prellenado-master/${numGuide}`)
      .pipe(
        map((response) => {
          this.fillMasterData(response.datos);

          return response.datos;
        }),
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener el pre llenado del Máster'));
        }),
      );
  }

  fillMasterData(data: PreFillMasterDatos) {
    const { issueDateTime } = data.mensajeMaster.messageHeaderDocument;
    const { date, time } = this.parseDateTimeToDateAndTime(issueDateTime);
    const generalDataForm = {
      issueDate: date,
      issueTime: time,
      caat: data.caat,
      rfc: data.rfc,
    };
    this.sessionStorage.set('generalDataTab', generalDataForm);

    const {
      id,
      signatoryCarrierAuthentication_ActualDateTime,
      signatoryCarrierAuthentication_Signatory,
      signatoryCarrierAuthentication_IssueAuthenticationLocation,
    } = data.mensajeMaster.businessHeaderDocument;

    const { date: signatoryDate, time: signatoryTime } = this.parseDateTimeToDateAndTime(
      signatoryCarrierAuthentication_ActualDateTime,
    );

    const {
      declaredValueForCarriageAmount,
      declaredValueForCarriageAmount_CurrencyID,
      totalChargePrepaidIndicator,
      totalDisbursementPrepaidIndicator,
      includedTareGrossWeightMeasure,
      includedTareGrossWeightMeasure_UnitCode,
      totalPieceQuantity,
      originLocation_Id,
      finalDestinationLocation_Id,
    } = data.mensajeMaster.masterConsignment;

    const infoMasterTab = {
      waybillNumber: id,
      actualDateTime: signatoryDate,
      time: signatoryTime,
      issueLocation: this.resolveIdType(signatoryCarrierAuthentication_IssueAuthenticationLocation),
      issueId: signatoryCarrierAuthentication_IssueAuthenticationLocation,
      placeOfContract: null,
      signatoryCarrier: signatoryCarrierAuthentication_Signatory,
      originType: this.resolveIdType(originLocation_Id),
      originId: originLocation_Id,
      originName: null,
      finalType: this.resolveIdType(finalDestinationLocation_Id),
      finalId: finalDestinationLocation_Id,
      finalName: null,
      transportationAmount: declaredValueForCarriageAmount,
      currencyCode: declaredValueForCarriageAmount_CurrencyID,
      totalChargeIndicator: totalChargePrepaidIndicator === 'true',
      totalDisbursementIndicator: totalDisbursementPrepaidIndicator === 'true',
      grossWeight: includedTareGrossWeightMeasure,
      grossWeightUnit: includedTareGrossWeightMeasure_UnitCode,
      totalPieceQuantity: totalPieceQuantity,
    };
    this.sessionStorage.set('infoMasterTab', infoMasterTab);

    const {
      grossWeightMeasure,
      grossWeightMeasure_UnitCode,
      natureIdentificationTransportCargo_Identification,
      pieceQuantity,
      typeCode,
    } = data.detalleMercancia;

    const merchandiseDetails: CommodityForm = {
      rateType: typeCode,
      grossWeightMeasure,
      grossWeightUnitCode: grossWeightMeasure_UnitCode,
      pieceQuantity,
      description: natureIdentificationTransportCargo_Identification,
    };
    this.sessionStorage.set('merchandiseDetails', merchandiseDetails);
    this.merchandiseDetails = merchandiseDetails;

    const {
      agentTotalDuePayableAmount,
      agentTotalDuePayableAmount_CurrencyID,
      grandTotalAmount,
      grandTotalAmount_CurrencyID,
      prepaidIndicator,
      typeCode: rateType,
    } = data.detalleTarifa;

    if (!!rateType) {
      const feeDetails: FeeDetailsForm = {
        rateType,
        prepaidIndicator,
        agentTotalDuePayable: agentTotalDuePayableAmount_CurrencyID,
        agentCurrencyId: agentTotalDuePayableAmount,
        grandTotalAmount,
        grandCurrencyId: grandTotalAmount_CurrencyID,
      };
      this.sessionStorage.set('feeDetails', feeDetails);
      this.feeDetails = feeDetails;
    }

    const persons: PersonsForm[] = data.personas
      .filter((person) => this.shouldIncludePerson(person))
      .map((person) => ({
        typePerson: person.typePersonWS2MS,
        name: person.nameWS2MS,
        streetName: person.streetNamePSAMS,
        cityName: person.cityNamePSAMS,
        countryId: person.countryPSAMS,
        countryName: person.countryNamePSAMS,
        roleId: person.roleCodeWS2MS,
        roleName: person.roleWS2MS,
        contacts: [],
      }));
    this.persons = persons;
    this.sessionStorage.set('persons', persons);

    const transports: TransportForm[] = data.detalleTansporte.map((transport) => {
      const { date, time } = this.parseDateTimeToDateAndTime(
        transport.scheduledOccurrenceDateDEMS3,
      );

      const { date: dateA, time: timeA } = this.parseDateTimeToDateAndTime(
        transport.scheduledOccurrenceDateAEMS3,
      );

      return {
        temporalId: Number(new Date()),
        stageCode: transport.stageCodeSLTMMS3,
        mode: transport.modeLTMMS3,
        scheduledOccurrenceDate: date?.toString() ?? '',
        scheduledOccurrenceTime: time ?? '',
        arrivalLocationType: this.resolveIdType(transport.idIATAOALMS3),
        arrivalId: transport.idIATAOALMS3,
        arrivalIdComplete: '',
        arrivalName: transport.nameOALMS3,
        arrivalScheduledDate: dateA?.toString() ?? '',
        arrivalScheduledTime: timeA ?? '',
        departureLocationType: this.resolveIdType(transport.idIATAODLMS3),
        departureId: transport.idIATAODLMS3,
        departureIdComplete: '',
        departureName: transport.nameODLMS3,
      };
    });

    this.transportDetails = transports;
    this.sessionStorage.set('transportDetails', transports);

    const {
      subjectCode,
      handlingSPHInstructions,
      handlingSSRInstructions,
      applicableOriginCurrencyExchange_SourceCurrencyCode,
    } = data.mensajeMaster.masterConsignment;

    const specialServiceForm = {
      subjectCode,
      handlingType: '',
      handlingDescription: handlingSPHInstructions[0].description,
      handlingDescriptionCode: handlingSPHInstructions[0].descriptionCode,
      specialType: '',
      specialDescription: handlingSSRInstructions[0].description,
      specialDescriptionCode: handlingSSRInstructions[0].descriptionCode,
      originCurrency: applicableOriginCurrencyExchange_SourceCurrencyCode,
    };

    this.sessionStorage.set('specialServiceForm', specialServiceForm);
  }

  shouldIncludePerson(person: PreFillMasterPersona | Persona): boolean {
    const isEmpty = (value: unknown): boolean =>
      value === null || value === undefined || value === '';
    const hasAtLeastOneValue = <T extends object>(obj: T, keys: (keyof T)[]) =>
      pickValues(obj, keys).some((v) => !isEmpty(v));
    const pickValues = <T extends object>(obj: T, keys: (keyof T)[]) => keys.map((k) => obj[k]);
    const isPreFillMasterPersona = (p: any): p is PreFillMasterPersona => p && 'nameWS2MS' in p;

    const PRE_FILL_KEYS_MASTER: (keyof PreFillMasterPersona)[] = [
      'nameWS2MS',
      'streetNamePSAMS',
      'cityNamePSAMS',
      'countryPSAMS',
      'countryNamePSAMS',
      'roleCodeWS2MS',
      'roleWS2MS',
    ];
    const PRE_FILL_KEYS_HOUSE: (keyof Persona)[] = [
      'nameWS2H3',
      'streetNamePSAH3',
      'countryNamePSAH3',
      'countryPSAH3',
      'countryNamePSAH3',
      'roleCodeWS2H3',
      'roleWS2H3',
    ];

    if (isPreFillMasterPersona(person)) {
      return hasAtLeastOneValue(person, PRE_FILL_KEYS_MASTER);
    }

    return hasAtLeastOneValue(person as Persona, PRE_FILL_KEYS_HOUSE);
  }

  resolveIdType(value: string): LocationEnum {
    // Elimina espacios por seguridad
    const normalized = value.trim();

    // Regex: solo números
    const isNumeric = /^[0-9]+$/.test(normalized);

    return isNumeric ? this.locationEnum.CONTROLLED_PREMISES : this.locationEnum.IATA;
  }

  private loadFromSessionStorage() {
    const purpuseCode = this.sessionStorage.get<string>('purpuseCode');
    if (purpuseCode) {
      this.purpuseCode.set(purpuseCode);
    }

    const formsDispatched = this.sessionStorage.get<boolean>('formsDispatched');
    if (formsDispatched) {
      this.formsDispatched.set(formsDispatched);
    }

    const merchandiseDetails = this.sessionStorage.get<CommodityForm>('merchandiseDetails');
    if (merchandiseDetails) {
      this.merchandiseDetails = merchandiseDetails;
    }

    const feeDetails = this.sessionStorage.get<FeeDetailsForm>('feeDetails');
    if (feeDetails) {
      this.feeDetails = feeDetails;
    }

    const persons = this.sessionStorage.get<PersonsForm[]>('persons');
    if (persons) {
      this.persons = persons;
    }

    const transportDetails = this.sessionStorage.get<TransportForm[]>('transportDetails');
    if (transportDetails) {
      this.transportDetails = transportDetails;
    }

    const masterGuideForm = this.sessionStorage.get<MasterGuideForm[]>('masterGuideForm');
    if (masterGuideForm) {
      this.masterGuideForm = masterGuideForm;
    }

    const cargoTypeForm = this.sessionStorage.get<CargoTypeForm[]>('cargoTypeForm');
    if (cargoTypeForm) {
      this.cargoTypeForm = cargoTypeForm;
    }

    const sequenceMerchandise =
      this.sessionStorage.get<SequenceMerchandiseForm[]>('sequenceMerchandise');
    if (sequenceMerchandise) {
      this.sequenceMerchandise = sequenceMerchandise;
    }

    const searchByGuideRegister =
      this.sessionStorage.get<TypeSearchGuideRegister>('searchByGuideRegister');
    if (searchByGuideRegister) {
      this.searchByGuideRegister.set(searchByGuideRegister);
    }

    const preFillMasterDatos = this.sessionStorage.get<PreFillMasterDatos>('preFillMasterDatos');
    if (preFillMasterDatos) {
      this.preFillMasterDatos = preFillMasterDatos;
    }
  }
}
