import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { TablaEmpresaFusionada } from '../modelos/aviso-de-empresa-fusionadas.model';
import { TablaEmpresaTransportista } from '../modelos/aviso-de-transportistas.model';

export interface Solicitud33304State {
  cambioDocumentoUsoGoce: boolean; //Cambio de documento de uso o goce
  fusionEscisionEmpresas: boolean; //Fusión o escisión de empresas
  reestructuracion: boolean; //Reestructuración
  transportistas: boolean; //¿Incluye transportistas?
  BAJO_MANIFIESTO: boolean; //Bajo manifiesto
  avisoDeOperacion: number | string; //Aviso de operación
  tipoOperacion: number | string; //Tipo de operación
  cuenta: number | string; //Cuenta
  rfc: string; //RFC
  denominacion: string; //Denominación o razón social
  fechaFusioneEfecto: string; //Fecha de fusión con efecto
  folioAcuse: string; //Folio del acuse
  registroCertificacion: string; //Registro de certificación
  empresaFusionadasLista: TablaEmpresaFusionada[]; //Lista de empresas fusionadas
  transportistasLista: TablaEmpresaTransportista[]; //Lista de empresas transportistas


  colonia: string; // Colonia
  codigoPostal: string; // Código Postal
  direccion: string; // Dirección
  rfcPartesC: string; // RFC Partes Contratantes
  rfcPartesCons: string; // RFC Partes Consultadas
  nombrePartesCons: string; // Nombre Partes Consultadas
  caracterDeCons: string; // Carácter de Consultadas
  fechaInicioAnterior: string; // Fecha Inicio Anterior
  fechaFinAnterior: string; // Fecha Fin Anterior
  cveEntidad: string; // Clave de Entidad
  cveMunicipio: string; // Clave de Municipio
  cveTipoDoc: string; // Clave de Tipo de Documento
  observaciones: string; // Observaciones
  ideGenerica2: string; // Identificador Genérico 2
  direccionNuevo?: string; // Dirección Nueva
  codigoPostalNuevo?: string; // Código Postal Nuevo
  cveEntidadNuevo?: string; // Clave de Entidad Nueva
  cveMunicipioNuevo?: string; // Clave de Municipio Nueva
  cveTipoDocNuevo?: string; // Clave de Tipo de Documento Nueva
  fechaInicioAnteriorNuevo?: string; // Fecha Inicio Anterior Nueva
  fechaFinAnteriorNuevo?: string; // Fecha Fin Anterior Nueva
  rfcPartesCNuevo: string; // RFC Partes Contratantes Nueva
  rfcPartesConsNuevo: string; // RFC Partes Consultadas Nueva
  nombrePartesConsNuevo: string; // Nombre Partes Consultadas Nueva
  caracterDeConsNuevo: string; // Carácter de Consultadas Nueva
  observacionesNuevo: string; // Observaciones Nueva
  modificacionVigencias:string | number; // Modificación de vigencias
  modificacionPartes: string | number; // Modificación de partes
  fechaInicioVigenciaAnterior: string; // Fecha Inicio Vigencia Anterior
  fechaFinVigenciaAnterior: string; // Fecha Fin Vigencia Anterior
  fechaInicioVigenciaActual: string; // Fecha Inicio Vigencia Actual
  fechaFinVigenciaActual: string; // Fecha Fin Vigencia Actual
  cveTipoDoc2: string; // Clave de Tipo de Documento 2
  direccion2: string; // Dirección 2
  codigoPostal2: string; // Código Postal 2
  cveEntidad2: string; // Clave de Entidad 2
  cveMunicipio2: string; // Clave de Municipio 2
  cveTipo2: string; // Clave de Tipo 2
  fechaInicioAnterior2: string; // Fecha Inicio Anterior 2
  fechaFinAnterior2: string; // Fecha Fin Anterior 2
  rfcPartesC2: string; // RFC Partes Contratantes 2
  rfcPartesCons2: string; // RFC Partes Consultadas 2
  nombrePartesCons2: string; // Nombre Partes Consultadas 2
  caracterDeCons2: string; // Carácter de Consultadas 2
  observaciones2: string; // Observaciones 2

}


export function createInitialState(): Solicitud33304State {
  return {
    cambioDocumentoUsoGoce: false, //Cambio de documento de uso o goce
    fusionEscisionEmpresas: false, //Fusión o escisión de empresas
    reestructuracion: false, //Reestructuración
    transportistas: false, //¿Incluye transportistas?
    BAJO_MANIFIESTO: false, //Bajo manifiesto
    avisoDeOperacion: 0, //Aviso de operación
    tipoOperacion: 0, //Tipo de operación
    cuenta: 0, //Cuenta
    rfc: '', //RFC
    denominacion: '', //Denominación o razón social
    fechaFusioneEfecto: '', //Fecha de fusión con efecto
    folioAcuse: '', //Folio del acuse
    registroCertificacion: '', //Registro de certificación
    empresaFusionadasLista: [], //Lista de empresas fusionadas
    transportistasLista: [], //Lista de empresas transportistas

    colonia: '', // Colonia
    codigoPostal: '', // Código Postal
    direccion: '', // Dirección
    rfcPartesC: '', // RFC Partes Contratantes
    rfcPartesCons: '', // RFC Partes Consultadas
    nombrePartesCons: '', // Nombre Partes Consultadas
    caracterDeCons: '', // Carácter de Consultadas
    fechaInicioAnterior: '', // Fecha Inicio Anterior
    fechaFinAnterior: '', // Fecha Fin Anterior
    cveEntidad: '', // Clave de Entidad
    cveMunicipio: '', // Clave de Municipio
    cveTipoDoc: '', // Clave de Tipo de Documento
    observaciones: '', // Observaciones
    ideGenerica2: '2', // Identificador Genérico 2
    direccionNuevo: '', // Dirección Nueva
    codigoPostalNuevo: '', // Código Postal Nuevo
    cveEntidadNuevo: '', // Clave de Entidad Nueva
    cveMunicipioNuevo: '', // Clave de Municipio Nueva
    cveTipoDocNuevo: '', // Clave de Tipo de Documento Nueva
    fechaInicioAnteriorNuevo: '', // Fecha Inicio Anterior Nueva
    fechaFinAnteriorNuevo: '', // Fecha Fin Anterior Nueva
    rfcPartesCNuevo: '', // RFC Partes Contratantes Nueva
    rfcPartesConsNuevo: '', // RFC Partes Consultadas Nueva
    nombrePartesConsNuevo: '', // Nombre Partes Consultadas Nueva
    caracterDeConsNuevo: '', // Carácter de Consultadas Nueva
    observacionesNuevo: '', // Observaciones Nueva
    modificacionVigencias: '1', // Modificación de vigencias
    modificacionPartes: '1', // Modificación de partes
    fechaInicioVigenciaAnterior: '', // Fecha Inicio Vigencia Anterior
    fechaFinVigenciaAnterior: '', // Fecha Fin Vigencia Anterior
    fechaInicioVigenciaActual: '', // Fecha Inicio Vigencia Actual
    fechaFinVigenciaActual: '', // Fecha Fin Vigencia Actual
    cveTipoDoc2: '', // Clave de Tipo de Documento 2
    direccion2: '', // Dirección 2
    codigoPostal2: '', // Código Postal 2
    cveEntidad2: '', // Clave de Entidad 2
    cveMunicipio2: '', // Clave de Municipio 2
    cveTipo2: '', // Clave de Tipo 2
    fechaInicioAnterior2: '', // Fecha Inicio Anterior 2
    fechaFinAnterior2: '', // Fecha Fin Anterior 2
    rfcPartesC2: '', // RFC Partes Contratantes 2
    rfcPartesCons2: '', // RFC Partes Consultadas 2
    nombrePartesCons2: '', // Nombre Partes Consultadas 2
    caracterDeCons2: '', // Carácter de Consultadas 2
    observaciones2: '', // Observaciones 2
  };
}


@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite33304', resettable: true })
export class Solicitud33304Store extends Store<Solicitud33304State> {

  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado del store con los valores proporcionados.
   * Valores a actualizar en el estado.
   */
  public actualizarEstado(valores: Partial<Solicitud33304State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  } 
}
