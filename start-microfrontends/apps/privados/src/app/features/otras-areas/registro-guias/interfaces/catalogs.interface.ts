export enum LocationEnum {
  IATA = 'iata',
  CONTROLLED_PREMISES = 'recintoFiscalizado',
}

export interface OperationTypeResponse {
  codigo: string;
  mensaje: string;
  datos: OperationType[];
}

export interface OperationType {
  clave: string;
  valor: string;
}

export interface MessagePurposeResponse {
  codigo: string;
  mensaje: string;
  datos: Message[];
}

export interface Message {
  clave: string;
  valor: string;
}

export interface LocationResponse {
  codigo: string;
  mensaje: string;
  datos: Location[];
}

export interface Location {
  clave: string;
  valor: string;
}

export interface PaymentIndicatorsResponse {
  codigo: string;
  mensaje: string;
  datos: PaymentIndicator[];
}

export interface PaymentIndicator {
  clave: string;
  valor: string;
}

export interface CurrencyResponse {
  codigo: string;
  mensaje: string;
  datos: Currency[];
}

export interface Currency {
  clave: string;
  valor: string;
}

export interface UnitsWeightResponse {
  codigo: string;
  mensaje: string;
  datos: UnitsWeight[];
}

export interface UnitsWeight {
  clave: string;
  valor: string;
}

export interface FareClassesResponse {
  codigo: string;
  mensaje: string;
  datos: FareClass[];
}

export interface FareClass {
  clave: string;
  valor: string;
}

export interface PersonsTypeResponse {
  codigo: string;
  mensaje: string;
  datos: PersonType[];
}

export interface PersonType {
  clave: string;
  valor: string;
}

export interface NameCountriesResponse {
  codigo: string;
  mensaje: string;
  datos: Country[];
}

export interface Country {
  clave: string;
  valor: string;
}

export interface TransportationStagesResponse {
  codigo: string;
  mensaje: string;
  datos: TransportationStages[];
}

export interface TransportationStages {
  clave: string;
  valor: string;
}

export interface TransportationModesResponse {
  codigo: string;
  mensaje: string;
  datos: TransportationMode[];
}

export interface TransportationMode {
  clave: string;
  valor: string;
}

export interface RolesPartsResponse {
  codigo: string;
  mensaje: string;
  datos: Rol[];
}

export interface Rol {
  clave: string;
  valor: string;
}

export interface CodesSPHResponse {
  codigo: string;
  mensaje: string;
  datos: Code[];
}

export interface Code {
  clave: string;
  valor: string;
}

export interface CodesSSRResponse {
  codigo: string;
  mensaje: string;
  datos: Code[];
}
export interface RFCResponse {
  codigo: string;
  mensaje: string;
  datos: string;
}

export interface TransportSplitResponse {
  codigo: string;
  mensaje: string;
  datos: TransportSplit[];
}

export interface TransportSplit {
  clave: string;
  valor: string;
}

export interface SearchGuideResponse {
  codigo: string;
  mensaje: string;
  datos: string;
}

export interface LoadTypeResponse {
  codigo: string;
  mensaje: string;
  datos: LoadType[];
}

export interface LoadType {
  clave: string;
  valor: string;
}

export interface DateTimeResponse {
  codigo: string;
  mensaje: string;
  datos: DateTime[];
}

export interface DateTime {
  clave: string;
  valor: string;
}
