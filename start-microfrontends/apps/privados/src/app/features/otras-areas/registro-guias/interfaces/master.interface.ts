export interface RootPayload {
  rfc: string | null;
  numMaster: string | null;
  purposeCodeMenu: string;
  typeCodeMHD: string;
  waybillType: WaybillType | null;
  idMensajeOriginal: string | null;
}

export interface WaybillType {
  messageHeaderDocument: MessageHeaderDocument;
  businessHeaderDocument: BusinessHeaderDocument;
  masterConsignment: MasterConsignment;
}

export interface MessageHeaderDocument {
  id: null;
  name: null;
  typeCode: string;
  issueDateTime: string; // ISO string
  purposeCode: string;
  versionID: null;
  conversationID: null;
  senderParty_PrimaryID: null;
  senderParty_SchemeID: null;
  recipientParty_PrimaryID: null;
  recipientParty__SchemeID: null;
}

export interface BusinessHeaderDocument {
  id: string;
  senderAssignedID: null;
  includedHeaderNote: null;
  signatoryConsignorAuthentication: null;
  signatoryCarrierAuthentication_ActualDateTime: string; // ISO
  signatoryCarrierAuthentication_Signatory: string;
  signatoryCarrierAuthentication_IssueAuthenticationLocation: string;
}

export interface IncludedHeaderNote {
  contentCode: null;
  content: null;
}

export interface MasterConsignment {
  id: null;
  additionalID: null;
  freightForwarderAssignedID: null;
  associatedReferenceID: null;

  nilCarriageValueIndicator: null;
  declaredValueForCarriageAmount: number;
  declaredValueForCarriageAmount_CurrencyID: string;

  nilCustomsValueIndicator: null;
  declaredValueForCustomsAmount: null;
  declaredValueForCustomsAmount_CurrencyID: null;

  nilInsuranceValueIndicator: null;
  insuranceValueAmount: null;
  insuranceValueAmount_CurrencyID: null;

  totalChargePrepaidIndicator: boolean;
  totalDisbursementPrepaidIndicator: boolean;

  includedTareGrossWeightMeasure: number;
  includedTareGrossWeightMeasure_UnitCode: string;

  grossVolumeMeasure: null;
  grossVolumeMeasure_UnitCode: null;

  densityGroupCode: null;
  packageQuantity: null;
  totalPieceQuantity: number;
  productID: null;

  consignorParty: PartyWithAddressAndContacts;
  consigneeParty: PartyWithAddressAndContacts;
  freightForwarderParty: FreightForwarderParty | null;
  associatedParty: AssociatedParty[] | null;

  originLocation_Id: string | null;
  originLocation_Name: string | null;
  finalDestinationLocation_Id: string | null;
  finalDestinationLocation_Name: string | null;

  specifiedLogisticsTransportMovement: LogisticsTransportMovement[];
  utilizedLogisticsTransportEquipment: LogisticsTransportEquipment[] | null;

  handlingSPHInstructions: HandlingInstruction[];
  handlingSSRInstructions: HandlingInstruction[];
  handlingOSIInstructions: HandlingInstruction[] | null;

  includedAccountingNote: AccountingNote[] | null;
  includedCustomsNote: CustomsNote[];
  associatedReferenceDocument: ReferenceDocument[] | null;

  associatedConsignmentCustomsProcedure_GoodsStatusCode: string | null;

  applicableOriginCurrencyExchange_SourceCurrencyCode: string | null;
  applicableDestinationCurrencyExchange: DestinationCurrencyExchange | null;

  applicableLogisticsServiceCharge_TransportPaymentMethodCode: string | null;
  applicableLogisticsServiceCharge_ServiceTypeCode: string | null;

  applicableLogisticsAllowanceCharge: LogisticsAllowanceCharge[] | null;

  applicableRating: Rating[];
  applicableTotalRating: TotalRating[];
}

export interface PartyWithAddressAndContacts {
  primaryID: null;
  schemeAgencyID: null;
  additionalID: null;
  name: string;
  accountID: null;
  postalStructuredAddress: PostalStructuredAddress;
  definedTradeContact: DefinedTradeContact[];
}

export interface FreightForwarderParty {
  primaryID: null;
  schemeAgencyID: null;
  additionalID: null;
  name: string;
  accountID: null;
  cargoAgentID: null;
  freightForwarderAddress: FreightForwarderAddress;
  specifiedCargoAgentLocation: null;
  definedTradeContact: DefinedTradeContact[];
}

export interface AssociatedParty {
  primaryID: null;
  schemeAgencyID: null;
  additionalID: null;
  name: string;
  roleCode: string;
  role: string;
  postalStructuredAddress: PostalStructuredAddress;
  definedTradeContact: DefinedTradeContact[];
}

export interface PostalStructuredAddress {
  postcodeCode: null;
  streetName: string;
  cityName: string;
  countryID: string;
  countryName: string;
  countrySubDivisionName: null;
  postOfficeBox: null;
  cityID: null;
  countrySubDivisionID: null;
  specifiedAddressLocation: SpecifiedAddressLocation | null;
}

export interface FreightForwarderAddress {
  postcodeCode: null;
  streetName: string;
  cityName: string;
  countryID: string;
  countryName: string;
  countrySubDivisionName: null;
  postOfficeBox: null;
  cityID: null;
  countrySubDivisionID: null;
}

export interface SpecifiedAddressLocation {
  id: null;
  name: null;
  typeCode: null;
}

export interface DefinedTradeContact {
  personName: string;
  departmentName: string;
  directTelephoneCommunication: string;
  faxCommunication: null;
  uriEmailCommunication: string;
  telexCommunication: null;
}

export interface LogisticsTransportMovement {
  stageCode: string;
  modeCode: null;
  mode: string;
  id: string;
  sequenceNumeric: null;
  usedLogisticsTransportMeans_Name: null;
  arrivalEvent: ArrivalEvent;
  departureEvent: DepartureEvent;
}

export interface ArrivalEvent {
  scheduledOccurrenceDateTime: string; // ISO
  occurrenceArrivalLocation_Id: string;
  occurrenceArrivalLocation_Name: string;
  occurrenceArrivalLocation_TypeCode: null;
}

export interface DepartureEvent {
  scheduledOccurrenceDateTime: string; // ISO
  occurrenceDepartureLocation_Id: string;
  occurrenceDepartureLocation_Name: string;
  occurrenceDepartureLocation_TypeCode: null;
}

export interface LogisticsTransportEquipment {
  id: string;
  characteristicCode: string;
  characteristic: string;
  affixedLogisticsSeal_Id: string;
}

export interface HandlingInstruction {
  description: string;
  descriptionCode: string;
}

export interface AccountingNote {
  contentCode: string;
  content: string;
}

export interface CustomsNote {
  subjectCode: string;
  contentCode: null;
  content: null;
  countryID: null;
}

export interface ReferenceDocument {
  id: string;
  issueDateTime: string; // ISO
  typeCode: string;
  name: string;
}

export interface DestinationCurrencyExchange {
  targetCurrencyCode: string;
  marketID: string;
  conversionRate: number;
}

export interface LogisticsAllowanceCharge {
  id: string;
  additionalID: string;
  prepaidIndicator: boolean;
  locationTypeCode: string;
  reason: string;
  partyTypeCode: string;
  actualAmount: number;
  actualAmount_CurrencyID: string;
  timeBasisQuantity: number;
  itemBasisQuantity: number;
  serviceDate: string; // ISO
  specialServiceDescription: string;
  specialServiceTime: string;
}

export interface Rating {
  typeCode: string;
  totalChargeAmount: null;
  totalChargeAmount_CurrencyID: null;
  consignmentItemQuantity: null;
  includedMasterConsignmentItem: MasterConsignmentItem[];
}

export interface MasterConsignmentItem {
  sequenceNumeric: null;
  typeCode: TypeCodeListItem[];
  grossWeightMeasure: number;
  grossWeightMeasure_UnitCode: string;
  grossVolumeMeasure: null;
  grossVolumeMeasure_UnitCode: null;
  packageQuantity: null;
  pieceQuantity: number;
  volumetricFactor: null;
  information: null;
  natureIdentificationTransportCargo_Identification: string;
  originCountry_ID: null;
  associatedUnitLoadTransportEquipment: UnitLoadTransportEquipment[] | null;
  transportLogisticsPackage: TransportLogisticsPackage[] | null;
  applicableFreightRateServiceCharge: FreightRateServiceCharge | null;
  specifiedRateCombinationPointLocation_ID: null;
  applicableUnitLoadDeviceRateClass: UnitLoadDeviceRateClass | null;
}

export interface TypeCodeListItem {
  value: string;
  listID: null;
  listAgencyID: null;
  listAgencyName: null;
  listName: null;
  listVersionID: null;
  name: null;
  languageID: null;
  listURI: null;
  listSchemeURI: null;
}

export interface UnitLoadTransportEquipment {
  id: string;
  tareWeightMeasure: number;
  tareWeightMeasure_UnitCode: string;
  loadedPackageQuantity: number;
  characteristicCode: string;
  operatingParty_PrimaryID: string;
  operatingParty_SchemeAgencyID: string;
}

export interface TransportLogisticsPackage {
  itemQuantity: number;
  grossWeightMeasure_Value: number;
  grossWeightMeasure_UnitCode: string;
  linearSpatialDimension_Width_Value: number;
  linearSpatialDimension_Width_UnitCode: string;
  linearSpatialDimension_length_Value: number;
  linearSpatialDimension_length_UnitCode: string;
  linearSpatialDimension_height_Value: number;
  linearSpatialDimension_height_UnitCode: string;
}

export interface FreightRateServiceCharge {
  categoryCode: string;
  commodityItemID: string;
  chargeableWeightMeasure: number;
  chargeableWeightMeasure_UnitCode: string;
  appliedRate: number;
  appliedAmount: number;
  appliedAmount_CurrencyID: string;
}

export interface UnitLoadDeviceRateClass {
  typeCode: string;
  basisCode: string;
  appliedPercent: number;
  referenceID: string;
  referenceTypeCode: string;
}

export interface TotalRating {
  typeCode: string;
  applicableDestinationCurrencyServiceCharge: DestinationCurrencyServiceCharge | null;
  applicablePrepaidCollectMonetarySummation: PrepaidCollectMonetarySummation[];
}

export interface DestinationCurrencyServiceCharge {
  collectAppliedAmount: null;
  collectAppliedAmount_CurrencyID: null;
  destinationAppliedAmount: null;
  destinationAppliedAmount_CurrencyID: null;
  totalAppliedAmount: null;
  totalAppliedAmount_CurrencyID: null;
}

export interface PrepaidCollectMonetarySummation {
  prepaidIndicator: boolean;
  weightChargeTotalAmount: null;
  weightChargeTotalAmount_CurrencyID: null;
  valuationChargeTotalAmount: null;
  valuationChargeTotalAmount_CurrencyID: null;
  taxTotalAmount: null;
  taxTotalAmount_CurrencyID: null;
  agentTotalDuePayableAmount: number;
  agentTotalDuePayableAmount_CurrencyID: string;
  carrierTotalDuePayableAmount: null;
  carrierTotalDuePayableAmount_CurrencyID: null;
  grandTotalAmount: number;
  grandTotalAmount_CurrencyID: string;
}

export interface PreFillMasterResponse {
  codigo: string;
  mensaje: string;
  datos: PreFillMasterDatos;
}

export interface PreFillMasterDatos {
  mensajeMaster: PreFillMasterMensajeMaster;
  detalleMercancia: PreFillMasterDetalleMercancia;
  detalleTarifa: PreFillMasterDetalleTarifa;
  personas: PreFillMasterPersona[];
  detalleTansporte: PreFillMasterDetalleTransporte[];
  caat: string;
  rfc: string;
}

export interface PreFillMasterMensajeMaster {
  messageHeaderDocument: PreFillMasterMessageHeaderDocument;
  businessHeaderDocument: PreFillMasterBusinessHeaderDocument;
  masterConsignment: PreFillMasterMasterConsignment;
}

export interface PreFillMasterMessageHeaderDocument {
  id: string;
  issueDateTime: string;
  conversationID: string;
  senderParty_PrimaryID: string;
}

export interface PreFillMasterBusinessHeaderDocument {
  id: string;
  senderAssignedID: string;
  signatoryConsignorAuthentication: string;
  signatoryCarrierAuthentication_ActualDateTime: string;
  signatoryCarrierAuthentication_Signatory: string;
  signatoryCarrierAuthentication_IssueAuthenticationLocation: string;
}

export interface PreFillMasterMasterConsignment {
  id: string;
  additionalID: string;
  freightForwarderAssignedID: string;
  associatedReferenceID: string;
  nilCarriageValueIndicator: string;
  declaredValueForCarriageAmount: string;
  declaredValueForCarriageAmount_CurrencyID: string;
  nilCustomsValueIndicator: string;
  declaredValueForCustomsAmount: string;
  declaredValueForCustomsAmount_CurrencyID: string;
  nilInsuranceValueIndicator: string;
  insuranceValueAmount: string;
  insuranceValueAmount_CurrencyID: string;
  totalChargePrepaidIndicator: string;
  totalDisbursementPrepaidIndicator: string;
  includedTareGrossWeightMeasure: string;
  includedTareGrossWeightMeasure_UnitCode: string;
  grossVolumeMeasure: string;
  grossVolumeMeasure_UnitCode: string;
  handlingSPHInstructions: HandlingInstruction[];
  handlingSSRInstructions: HandlingInstruction[];
  densityGroupCode: string;
  packageQuantity: string;
  totalPieceQuantity: string;
  productID: string;
  originLocation_Id: string;
  originLocation_Name: string;
  finalDestinationLocation_Id: string;
  finalDestinationLocation_Name: string;
  associatedConsignmentCustomsProcedure_GoodsStatusCode: string;
  applicableOriginCurrencyExchange_SourceCurrencyCode: string;
  targetCurrencyCode: string;
  marketID: string;
  conversionRate: string;
  applicableLogisticsServiceCharge_TransportPaymentMethodCode: string;
  applicableLogisticsServiceCharge_ServiceTypeCode: string;
  subjectCode: string;
}

export interface PreFillMasterDetalleMercancia {
  typeCode: string;
  grossWeightMeasure: string;
  grossWeightMeasure_UnitCode: string;
  pieceQuantity: string;
  natureIdentificationTransportCargo_Identification: string;
}

export interface PreFillMasterDetalleTarifa {
  typeCode: string;
  prepaidIndicator: string;
  agentTotalDuePayableAmount: string;
  agentTotalDuePayableAmount_CurrencyID: string;
  grandTotalAmount: string;
  grandTotalAmount_CurrencyID: string;
}

export interface PreFillMasterPersona {
  idIATASALMS: string;
  nameSALMS: string | null;
  indice: string | null;
  typePersonWS2MS: string;
  primaryIDWS2MS: string;
  primaryIDSchemeAgencyIDWS2MS: string;
  additionalIDWS2MS: string;
  nameWS2MS: string;
  accountIDWS2MS: string;
  cargoAgentIDWS2MS: string;
  roleCodeWS2MS: string;
  roleWS2MS: string;
  postcodeCodePSAMS: string;
  streetNamePSAMS: string;
  cityNamePSAMS: string;
  countryPSAMS: string;
  countryNamePSAMS: string;
  countrySubDivisionNamePSAMS: string;
  postOfficeBoxPSAMS: string;
  cityIDPSAMS: string;
  countrySubDivisionIDPSAMS: string;
  typeCodeWS2MS: string | null;
  associatedPartyType: PreFillMasterAssociatedPartyType | null;
}

export interface PreFillMasterAssociatedPartyType {
  primaryID: string;
  schemeAgencyID: string;
  additionalID: string;
  name: string;
  roleCode: string;
  role: string;
  postalStructuredAddress: PreFillMasterPostalAddress;
  definedTradeContact: PreFillMasterTradeContact[];
}

export interface PreFillMasterPostalAddress {
  postcodeCode: string;
  streetName: string;
  cityName: string;
  countryID: string;
  countryName: string;
  countrySubDivisionName: string;
  postOfficeBox: string;
  cityID: string;
  countrySubDivisionID: string;
  specifiedAddressLocation: PreFillMasterSpecifiedAddressLocation;
}

export interface PreFillMasterSpecifiedAddressLocation {
  id: string;
  name: string;
  typeCode: string;
}

export interface PreFillMasterTradeContact {
  personName: string;
  departmentName: string;
  directTelephoneCommunication: string;
  faxCommunication: string;
  uriEmailCommunication: string;
  telexCommunication: string;
}

export interface PreFillMasterDetalleTransporte {
  nameUTMMS3: string;
  idIATAOALMS3: string;
  nameOALMS3: string;
  idIATAODLMS3: string;
  nameODLMS3: string;
  stageCodeSLTMMS3: string;
  modeCodeSLTMMS3: string;
  modeLTMMS3: string;
  idSLTMMS3: string;
  scheduledOccurrenceDateAEMS3: string;
  typeCodeOALMS3: string;
  scheduledOccurrenceDateDEMS3: string;
  typeCodeODLMS3: string;
}
