export enum TypeSearchGuideRegister {
  MANIFEST = 'manifest',
  MASTER = 'master',
  HOUSE = 'house',
}

export interface CommodityForm {
  rateType: string;
  grossWeightMeasure: string;
  grossWeightUnitCode: string;
  pieceQuantity: string;
  description: string;
}

export interface FeeDetailsForm {
  rateType: string;
  prepaidIndicator: string;
  agentTotalDuePayable: string;
  agentCurrencyId: string;
  grandTotalAmount: string;
  grandCurrencyId: string;
}

export interface PersonsForm {
  typePerson: string;
  name: string;
  streetName: string;
  cityName: string;
  countryId: string;
  contacts: OtherContactForm[];
  countryName: string;
  roleId?: string;
  roleRealId?: string;
  roleName?: string;
}

export interface OtherContactForm {
  temporalId?: number | null;
  personName: string;
  departmentName: string | null;
  telephone: string | null;
  emailAddress: string | null;
}

export interface TransportForm {
  temporalId: number;
  stageCode: string;
  mode: string;
  scheduledOccurrenceDate: string;
  scheduledOccurrenceTime: string;
  arrivalLocationType: string;
  arrivalId: string;
  arrivalIdComplete: string;
  arrivalName: string;
  arrivalScheduledDate: string;
  arrivalScheduledTime: string;
  departureLocationType: string;
  departureId: string;
  departureIdComplete: string;
  departureName: string;
}

export interface CargoTypeForm {
  temporalId: number;
  typeCode: string;
  uldSerialNumber: string;
  locationType: string;
  locationId: string;
  localtionRealId: string;
  locationName: string;
  masters: MasterGuideForm[];
}

export interface MasterGuideForm {
  temporalId: number | null;
  transportSplitDescription: string;
  waybillNumber: string;
  grossWeightMeasure: string;
  grossWeightUnitCode: string;
  totalPieceQuantity: string;
  description: string;
  originType: string;
  originId: string;
  originRealId: string;
  originName: string;
  finalType: string;
  finalId: string;
  finalRealId: string;
  finalName: string;
  subjectCode: string;
  maneuverType: string;
  maneuverDescription: string;
  maneuverCode: string;
  specialType: string;
  specialDescription: string;
  specialCode: string;
}

export interface SequenceMerchandiseForm {
  temporalId: number;
  grossWeightMeasure: string;
  grossWeightUnitCode: string;
  pieceQuantity: string;
  description: string;
  chargeableWeightMeasure: string;
  chargeableWeightUnitCode: string;
}
export interface SaveMasterResponse {
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
