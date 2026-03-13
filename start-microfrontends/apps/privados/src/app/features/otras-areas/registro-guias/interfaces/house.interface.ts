export interface RootHouse {
  rfc: string;
  numHouse: string | null;
  purposeCodeMenu: string;
  typeCodeMHD: string;
  idMensajeOriginal: string | null;
  waybillType: WaybillTypeHouse;
}

export interface WaybillTypeHouse {
  messageHeaderDocument: MessageHeaderDocumentHouse;
  businessHeaderDocument: BusinessHeaderDocumentHouse;
  masterConsignment: MasterConsignmentHouse;
}

/** ===================== Message Header ===================== */
export interface MessageHeaderDocumentHouse {
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

/** ===================== Business Header ===================== */
export interface BusinessHeaderDocumentHouse {
  id: string;
  includedHeaderNote: null;
  signatoryConsignorAuthentication: string;
  signatoryCarrierAuthentication_ActualDateTime: string; // ISO string
  signatoryCarrierAuthentication_Signatory: string;
  signatoryCarrierAuthentication_IssueAuthenticationLocation: string;
}

export interface HeaderNoteHouse {
  contentCode: string;
  content: string;
}

/** ===================== Master Consignment ===================== */
export interface MasterConsignmentHouse {
  includedTareGrossWeightMeasure: string | null;
  includedTareGrossWeightMeasure_UnitCode: string | null;
  totalPieceQuantity: string | null;
  transportContractDocument_Id: string;
  originLocation_Id: string;
  originLocation_Name: string;
  finalDestinationLocation_Id: string;
  finalDestinationLocation_Name: string;
  includedHouseConsignment: HouseConsignmentHouse;
}

/** ===================== House Consignment ===================== */
export interface HouseConsignmentHouse {
  id: null;
  additionalID: null;
  associatedReferenceID: null;
  nilCarriageValueIndicator: null;
  declaredValueForCarriageAmount: null;
  declaredValueForCarriageAmount_CurrencyID: null;
  nilCustomsValueIndicator: null;
  declaredValueForCustomsAmount: null;
  declaredValueForCustomsAmount_CurrencyID: null;
  nilInsuranceValueIndicator: null;
  insuranceValueAmount: null;
  insuranceValueAmount_CurrencyID: null;
  totalChargePrepaidIndicator: null;
  weightTotalChargeAmount_Value: null;
  weightTotalChargeAmount_CurrencyID: null;
  valuationTotalChargeAmount_Value: null;
  valuationTotalChargeAmount_CurrencyID: null;
  taxTotalChargeAmount_Value: null;
  taxTotalChargeAmount_CurrencyID: null;
  totalDisbursementPrepaidIndicator: null;
  agentTotalDisbursementAmount_Value: null;
  agentTotalDisbursementAmount_CurrencyID: null;
  carrierTotalDisbursementAmount_Value: null;
  carrierTotalDisbursementAmount_CurrencyID: null;
  totalPrepaidChargeAmount_Value: null;
  totalPrepaidChargeAmount_CurrencyID: null;
  totalCollectChargeAmount_Value: null;
  totalCollectChargeAmount_CurrencyID: null;
  includedTareGrossWeightMeasure: null;
  includedTareGrossWeightMeasure_UnitCode: null;
  grossVolumeMeasure: string;
  grossVolumeMeasure_UnitCode: string;
  densityGroupCode: null;
  consignmentItemQuantity: null;
  packageQuantity: null;
  totalPieceQuantity: string;
  summaryDescription: string;
  freightRateTypeCode: null;
  includedHouseConsignmentItem: HouseConsignmentItemHouse[];
  consignorParty: TradePartyHouse;
  consigneeParty: TradePartyHouse;
  freightForwarderParty: TradePartyHouse;
  associatedParty: AssociatedPartyHouse[];
  specifiedLogisticsTransportMovement: LogisticsTransportMovementHouse[];
  includedCustomsNote: CustomsNoteHouse[];
  handlingSPHInstructions: HandlingInstructionHouse[];
  handlingSSRInstructions: HandlingInstructionHouse[];
  applicableOriginCurrencyExchange_SourceCurrencyCode: string;

  applicableTransportCargoInsurance_Role: null;
  originLocation_Id: string;
  originLocation_Name: string;
  finalDestinationLocation_Id: string;
  finalDestinationLocation_Name: string;
  utilizedLogisticsTransportEquipment: null;
  handlingOSIInstructions: null;
  includedAccountingNote: null;
  associatedReferenceDocument: null;
  associatedConsignmentCustomsProcedure_GoodsStatusCode: null;
  applicableDestinationCurrencyExchange: null;
  applicableLogisticsServiceCharge_TransportPaymentMethodCode: null;
  applicableLogisticsServiceCharge_ServiceTypeCode: null;
  applicableLogisticsAllowanceCharge: null;
}

/** ===================== Parties / Address / Contact ===================== */
export interface TradePartyHouse {
  primaryID: string | null;
  schemeAgencyID: string | null;
  additionalID: string | null;
  name: string;
  accountID: string | null;
  postalStructuredAddress: PostalStructuredAddressHouse;
  definedTradeContact: TradeContactHouse[];
}

export interface AssociatedPartyHouse {
  primaryID: null;
  schemeAgencyID: null;
  additionalID: null;
  name: string;
  roleCode: string;
  role: string;
  postalStructuredAddress: PostalStructuredAddressHouse;
  definedTradeContact: TradeContactHouse[];
}

export interface PostalStructuredAddressHouse {
  postcodeCode: null;
  streetName: string;
  cityName: string;
  countryID: string;
  countryName: string;
  countrySubDivisionName: null;
  postOfficeBox: null;
  cityID: null;
  countrySubDivisionID: null;
  specifiedAddressLocation: null;
}

export interface SpecifiedAddressLocationHouse {
  id: string;
  name: string;
  typeCode: string;
}

export interface TradeContactHouse {
  personName: string;
  departmentName: string;
  directTelephoneCommunication: string;
  faxCommunication: null;
  uriEmailCommunication: string;
  telexCommunication: null;
}

/** ===================== Transport Movement ===================== */
export interface LogisticsTransportMovementHouse {
  stageCode: string;
  modeCode: null;
  mode: string;
  id: null;
  sequenceNumeric: null;
  usedLogisticsTransportMeans_Name: null;
  arrivalEvent: TransportEventHouse;
  departureEvent: TransportEventHouse;
}

export interface TransportEventHouse {
  scheduledOccurrenceDateTime: string; // ISO string
  occurrenceArrivalLocation_Id?: string | null;
  occurrenceArrivalLocation_Name?: string | null;
  occurrenceArrivalLocation_TypeCode?: null;
  occurrenceDepartureLocation_Id?: string | null;
  occurrenceDepartureLocation_Name?: string | null;
  occurrenceDepartureLocation_TypeCode?: null;
}

/** ===================== Equipment / Seals ===================== */
export interface LogisticsTransportEquipmentHouse {
  id: string;
  characteristicCode: string;
  characteristic: string;
  affixedLogisticsSeal_Id: string;
}

/** ===================== Handling / Notes / Docs ===================== */
export interface HandlingInstructionHouse {
  description: string;
  descriptionCode: string;
}

export interface CustomsNoteHouse {
  subjectCode: string;
  contentCode: null;
  content: null;
  countryID: null;
}

export interface ReferenceDocumentHouse {
  id: string;
  issueDateTime: string; // ISO string
  typeCode: string;
  name: string;
}

/** ===================== Currency / Charges ===================== */
export interface DestinationCurrencyExchangeHouse {
  targetCurrencyCode: string;
  marketID: string;
  conversionRate: number;
}

export interface LogisticsAllowanceChargeHouse {
  id: string;
  reason: string;
  actualAmount: number;
  actualAmount_CurrencyID: string;
  partyTypeCode: string;
}

/** ===================== House Consignment Item ===================== */
export interface HouseConsignmentItemHouse {
  grossWeightMeasure: string;
  grossWeightMeasure_UnitCode: string;
  grossVolumeMeasure: string;
  grossVolumeMeasure_UnitCode: string;
  pieceQuantity: string;
  information: string;

  sequenceNumeric: null;
  typeCode: null | string;
  packageQuantity: null;
  volumetricFactor: null;
  natureIdentificationTransportCargo_Identification: null;
  originCountry_ID: null;
  associatedUnitLoadTransportEquipment: null;
  transportLogisticsPackage: null;
  applicableFreightRateServiceCharge: FreightRateServiceChargeHouse[];
  associatedReferenceDocument: null;
  specifiedRateCombinationPointLocation_ID: null;
}

export interface CodeListValueHouse {
  value: string;
  listID: string;
  listAgencyID: string;
  listAgencyName: string;
  listName: string;
  listVersionID: string;
  name: string;
  languageID: string;
  listURI: string;
  listSchemeURI: string;
}

export interface UnitLoadTransportEquipmentHouse {
  id: string;
  tareWeightMeasure: number;
  tareWeightMeasure_UnitCode: string;
  loadedPackageQuantity: number;
  characteristicCode: string;
  operatingParty_PrimaryID: string;
  operatingParty_SchemeAgencyID: string;
}

export interface TransportLogisticsPackageHouse {
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

export interface FreightRateServiceChargeHouse {
  categoryCode: null;
  commodityItemID: null;
  chargeableWeightMeasure: null;
  chargeableWeightMeasure_UnitCode: null;
  appliedRate: null;
  appliedAmount: null;
  appliedAmount_CurrencyID: null;
}

export interface PrefillHouseResponse {
  codigo: string;
  mensaje: string;
  datos: PrefillHouse;
}

export interface PrefillHouse {
  mensajeHouse: MensajeHouse;
  secuenciaMercancias: SecuenciaMercancia[];
  personas: Persona[];
  transporte: Transporte[];
  handlingSPH: HandlingCodes;
  handlingSSR: HandlingCodes;
  caat: string;
  rfc: string;
}

export interface HandlingCodes {
  description: string;
  descriptionCode: string;
}

export interface MensajeHouse {
  messageHeaderDocument: MessageHeaderDocument;
  businessHeaderDocument: BusinessHeaderDocument;
  houseConsignment: HouseConsignment;
}

export interface BusinessHeaderDocument {
  id: string;
  signatoryConsignorAuthentication: string;
  signatoryCarrierAuthentication_ActualDateTime: string;
  signatoryCarrierAuthentication_Signatory: string;
  signatoryCarrierAuthentication_IssueAuthenticationLocation: string;
}

export interface HouseConsignment {
  id: null;
  includedTareGrossWeightMeasure: string;
  includedTareGrossWeightMeasure_UnitCode: string;
  totalPieceQuantity: string;
  originLocation_Id: string;
  originLocation_Name: string;
  finalDestinationLocation_Id: string;
  finalDestinationLocation_Name: string;
  transportContractDocument_Id: string;
  includedHouseConsignment: IncludedHouseConsignment;
}

export interface IncludedHouseConsignment {
  id: string;
  additionalID: string;
  associatedReferenceID: string;
  nilCarriageValueIndicator: null;
  declaredValueForCarriageAmount: string;
  declaredValueForCarriageAmount_CurrencyID: string;
  nilCustomsValueIndicator: string;
  declaredValueForCustomsAmount: string;
  declaredValueForCustomsAmount_CurrencyID: string;
  nilInsuranceValueIndicator: string;
  insuranceValueAmount: string;
  insuranceValueAmount_CurrencyI: string;
  totalChargePrepaidIndicator: string;
  weightTotalChargeAmount_Value: string;
  weightTotalChargeAmount_CurrencyID: string;
  valuationTotalChargeAmount_Value: string;
  valuationTotalChargeAmount_CurrencyID: string;
  taxTotalChargeAmount_Value: string;
  taxTotalChargeAmount_CurrencyID: string;
  totalDisbursementPrepaidIndicator: string;
  agentTotalDisbursementAmount_Value: string;
  agentTotalDisbursementAmount_CurrencyID: string;
  carrierTotalDisbursementAmount_Value: string;
  carrierTotalDisbursementAmount_CurrencyID: string;
  totalPrepaidChargeAmount_Value: string;
  totalPrepaidChargeAmount_CurrencyID: null;
  totalCollectChargeAmount_Value: string;
  totalCollectChargeAmount_CurrencyID: string;
  includedTareGrossWeightMeasure: string;
  includedTareGrossWeightMeasure_UnitCode: string;
  grossVolumeMeasure: string;
  grossVolumeMeasure_UnitCode: string;
  consignmentItemQuantity: string;
  packageQuantity: string;
  totalPieceQuantity: string;
  summaryDescription: string;
  freightRateTypeCode: string;
  originLocation_Id: string;
  originLocation_Name: string;
  finalDestinationLocation_Id: string;
  finalDestinationLocation_Name: string;
  subjectCode: string;
  associatedConsignmentCustomsProcedure_GoodsStatusCode: string;
  applicableOriginCurrencyExchange_SourceCurrencyCode: string;
  targetCurrencyCode: string;
  marketID: string;
  conversionRate: string;
  applicableLogisticsServiceCharge_TransportPaymentMethodCode: null;
  applicableLogisticsServiceCharge_ServiceTypeCode: string;
  applicableLogisticsAllowanceCharge: ApplicableLogisticsAllowanceCharge;
}

export interface ApplicableLogisticsAllowanceCharge {
  id: string;
  partyTypeCode: string;
  actualAmount: string;
  actualAmount_CurrencyID: string;
  reason: string;
}

export interface MessageHeaderDocument {
  id: string;
  issueDateTime: string;
  conversationID: string;
  senderParty_PrimaryID: string;
}

export interface Persona {
  idIATASALH3: null | string;
  nameSALH3: null | string;
  indice: null | string;
  associatedPartyType: AssociatedPartyType | null;
  typePersonWS2H3: string;
  primaryIDWS2H3: string;
  primaryIDSchemeAgencyIDWS2H3: string;
  additionalIDWS2H3: string;
  nameWS2H3: string;
  accountIDWS2H3: string;
  roleCodeWS2H3: string;
  roleWS2H3: string;
  postcodeCodePSAH3: string;
  streetNamePSAH3: string;
  cityNamePSAH3: string;
  countryPSAH3: string;
  countryNamePSAH3: string;
  countrySubDivisionNamePSAH3: string;
  postOfficeBoxPSAH3: string;
  cityIDPSAH3: string;
  countrySubDivisionIDPSAH3: string;
  typeCodeWS2H3: null | string;
}

export interface AssociatedPartyType {
  primaryID: string;
  schemeAgencyID: string;
  additionalID: string;
  name: string;
  roleCode: string;
  role: string;
  postalStructuredAddress: PostalStructuredAddress;
  definedTradeContact: DefinedTradeContact[];
}

export interface DefinedTradeContact {
  personName: string;
  departmentName: string;
  directTelephoneCommunication: string;
  faxCommunication: string;
  uriEmailCommunication: string;
  telexCommunication: string;
}

export interface PostalStructuredAddress {
  postcodeCode: string;
  streetName: string;
  cityName: string;
  countryID: string;
  countryName: string;
  countrySubDivisionName: string;
  postOfficeBox: string;
  cityID: string;
  countrySubDivisionID: string;
  specifiedAddressLocation: AssociatedReferenceDocument;
}

export interface AssociatedReferenceDocument {
  id: string;
  name: string;
  typeCode: string;
  issueDateTime?: string;
}

export interface SecuenciaMercancia {
  indiceIHCI: string;
  houseConsignmentItemTypeDTO: HouseConsignmentItemTypeDTO;
  grossVolumeMeasureUnitCodeID: string;
  grossWeightMeasureUnitCodeID: string;
  typeCodeListAgencyID: string;
  typeCode: string;
  grossVolumeMeasure: string;
  grossWeightMeasure: string;
  pieceQuantity: string;
  volumetricFactor: string;
  information: string;
  packageQuantity: string;
}

export interface HouseConsignmentItemTypeDTO {
  sequenceNumeric: null;
  typeCode: TypeCode[];
  grossWeightMeasure: number;
  grossWeightMeasure_UnitCode: string;
  grossVolumeMeasure: number;
  grossVolumeMeasure_UnitCode: string;
  packageQuantity: number;
  pieceQuantity: number;
  volumetricFactor: string;
  information: string;
  natureIdentificationTransportCargo_Identification: string;
  originCountry_ID: string;
  associatedUnitLoadTransportEquipment: AssociatedUnitLoadTransportEquipment;
  transportLogisticsPackage: TransportLogisticsPackage[];
  applicableFreightRateServiceCharge: ApplicableFreightRateServiceCharge[];
  associatedReferenceDocument: AssociatedReferenceDocument[];
  specifiedRateCombinationPointLocation_ID: string;
}

export interface ApplicableFreightRateServiceCharge {
  categoryCode: string;
  commodityItemID: string;
  chargeableWeightMeasure: number;
  chargeableWeightMeasure_UnitCode: string;
  appliedRate: number;
  appliedAmount: number;
  appliedAmount_CurrencyID: string;
}

export interface AssociatedUnitLoadTransportEquipment {
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

export interface TypeCode {
  value: string;
  listID: null;
  listAgencyID: string;
  listAgencyName: null;
  listName: null;
  listVersionID: null;
  name: null;
  languageID: null;
  listURI: null;
  listSchemeURI: null;
}

export interface Transporte {
  nameUTMH4: string;
  idIATAOALH4: string;
  nameOALH4: string;
  idIATAODLH4: string;
  nameODLH4: string;
  stageCodeSLTMH4: string;
  modeCodeSLTMH4: string;
  modeLTMH4: string;
  idSLTMH4: string;
  scheduledOccurrenceDateAEH4: string;
  typeCodeOALH4: string;
  scheduledOccurrenceDateDEH4: string;
  typeCodeODLH4: string;
}
