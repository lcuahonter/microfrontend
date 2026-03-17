export interface ManifestRequest {
  purposeCodeMenu: string;
  typeCodeMHD: string;
  rfc: string | null;
  numManifest: string | null;
  flightManifestType: FlightManifestType;
}

export interface FlightManifestType {
  messageHeaderDocumentDTO: MessageHeaderDocumentDTO;
  businessHeaderDocument: BusinessHeaderDocument;
  logisticsTransportMovement: LogisticsTransportMovement;
  arrivalEvent: ArrivalEvent[];
}

export interface MessageHeaderDocumentDTO {
  id: null;
  name: null;
  typeCode: string;
  issueDateTime: string; // ISO string
  purposeCode: string;
  versionID: null;
  conversationID: null;
  senderParty: PartyId;
  recipientParty: PartyId;
}

export interface PartyId {
  primaryID: null;
  schemeID: null;
}

export interface BusinessHeaderDocument {
  id: string;
  includedHeaderNote: HeaderNote[];
}

export interface HeaderNote {
  contentCode: null;
  content: null;
}

export interface LogisticsTransportMovement {
  id: string;
  totalGrossWeightMeasureValue: number;
  totalGrossWeightMeasureUnitCode: string;

  totalPieceQuantity: null;
  departureEvent: DepartureEvent;
  totalGrossVolumeMeasureValue: null;
  totalGrossVolumeMeasureUnitCode: null;
  totalPackageQuantity: number;
  includedCustomsNote: IncludedCustomsNote | null;
  relatedConsignmentCustomsProcedure_goodsStatusCode: null;
  stageCode: null;
  modeCode: null;
  mode: null;
  sequenceNumeric: null;
  masterResponsibleTransportPerson_name: null;
  usedLogisticsTransportMeans_name: null;
  usedLogisticsTransportMeans_countryId: null;
}

export interface DepartureEvent {
  departureOccurrenceDateTime: string;
  departureDateTimeTypeCode: string;
  occurrenceDepartureLocation_id: string;
  occurrenceDepartureLocation_name: string;
  occurrenceDepartureLocation_typeCode: string;
}

export interface IncludedCustomsNote {
  contentCode: null;
  content: null;
  subjectCode: null;
  countryID: null;
}

export interface ArrivalEvent {
  arrivalOccurrenceDateTime: string;
  departureOccurrenceDateTime: string;
  occurrenceArrivalLocation: OccurrenceArrivalLocation;
  associatedTransportCargo: AssociatedTransportCargo[] | undefined;
  arrivalDateTimeTypeCode: string;
  departureDateTimeTypeCode: string;
}

export interface OccurrenceArrivalLocation {
  id: string;
  name: string;
  typeCode: string;
  firstArrivalCountryID: null;
}

export interface AssociatedTransportCargo {
  typeCode: string;
  includedMasterConsignment: IncludedMasterConsignment[];
  utilizedUnitLoadTransportEquipment: null;
}

export interface UtilizedUnitLoadTransportEquipment {
  id: SchemeValue;
  characteristicCode: SchemeValue;
  onCarriageTransportMovement: OnCarriageTransportMovement;
  grossWeightMeasure_value: number;
  grossWeightMeasure_unitCode: string;
  grossVolumeMeasure_value: number;
  grossVolumeMeasure_unitCode: string;
  pieceQuantity: number;
  buildTypeCode: string;
  usedCapacityCode: string;
  operationalStatusCode: string;
  loadingRemark: string;
  positioningEvent_occurrencePositioningLocation_id: string;
  operatingParty_PrimaryID_SchemeAgencyID: string;
}

export interface SchemeValue {
  value: string;
  schemeID: string;
  schemeName: string;
  schemeAgencyID: string;
  schemeAgencyName: string;
  schemeVersionID: string;
  schemeDataURI: string;
  schemeURI: string;
}

export interface OnCarriageTransportMovement {
  id: string;
  arrivalDestinationEvent_OccurrenceDestinationLocation_Id: string;
  arrivalDestinationEvent_OccurrenceDestinationLocation_Name: string;
  carrierParty_PrimaryID: null;
  carrierParty_schemeAgencyID: null;
  onCarriageEvent_DepartureOccurrenceDateTime: null;
  onCarriageEvent_DepartureDateTimeTypeCode: null;
}

export interface IncludedMasterConsignment {
  transportContractDocument_Id: string;
  transportSplitDescription: string;
  waybillNumber: string;
  subjectCode: string;
  handlingSPHInstructions: HandlingInstruction[] | null;
  handlingSSRInstructions: HandlingInstruction[] | null;
  handlingOSIInstructions: HandlingInstruction[] | null;
  includedCustomsNote: IncludedCustomsNote[] | null;
  transportLogisticsPackage: TransportLogisticsPackage[] | null;
  onCarriageTransportMovement: OnCarriageTransportMovement[];
  includedMasterConsignmentItem: IncludedMasterConsignmentItem[] | null;
  originLocation_Id: string;
  originLocation_Name: string;
  finalDestinationLocation_Id: string;
  finalDestinationLocation_Name: string;
  grossWeightMeasure_Value: number;
  grossWeightMeasure_UnitCode: string;
  grossVolumeMeasure_Value: null;
  grossVolumeMeasure_UnitCode: null;
  densityGroupCode: null;
  packageQuantity: null;
  totalPieceQuantity: number;
  summaryDescription: string;
  associatedConsignmentCustomsProcedure_goodsStatusCode: null;
  movementPriorityCode_Value: null;
}

export interface HandlingInstruction {
  description: string;
  descriptionCode: string;
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

export interface IncludedMasterConsignmentItem {
  typeCode_Value: string;
  typeCode_listAgencyID: string;
}

export interface ManifestResponse {
  codigo: string;
  mensaje: string;
  datos: Datos;
}

export interface Datos {
  contador: number | string;
  duplicado: null;
  origenDestino: null;
  split: null;
  baja: null;
  alta: null;
  respuesta: string | null;
}
