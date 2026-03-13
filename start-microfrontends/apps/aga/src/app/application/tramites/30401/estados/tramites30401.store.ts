import { AgentesTabla, RegistroVehiculos, VehiculosTabla } from '../modelos/registro-empresas-transporte.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';


/**
 * @interfaz
 * @nombre Tramites30401State
 * @descripción
 * Define la estructura del estado para el trámite 30401.
 * Contiene propiedades relacionadas con los datos del trámite, como información de pago, datos de vehículos, agentes y más.
 */
export interface Tramites30401State {
  claveDeReferencia: string; // Clave de referencia del trámite.
  cadenaPagoDependencia: string; // Cadena de pago de la dependencia.
  clave: string; // Clave única del trámite.
  llaveDePago: string; // Llave de pago asociada al trámite.
  fecPago: string; // Fecha del pago.
  impPago: string; // Importe del pago.
  manifiestoDeclaracion: boolean; // Indica si se ha realizado la declaración del manifiesto.

  cveFolioCaat: string; // Folio CAAT.
  tipoTransito: string; // Tipo de tránsito.
  cboAduanasActuarSeleccionadas: string[]; // Lista de aduanas seleccionadas.
  calle: string; // Calle del domicilio.
  numeroExterior: string; // Número exterior del domicilio.
  numeroInterior: string; // Número interior del domicilio.
  entidadFederativa: string; // Entidad federativa.
  delegacionMunicipio: string; // Delegación o municipio.
  colonia: string; // Colonia.
  localidad: string; // Localidad.
  codigoPostal: string; // Código postal.
  capitalSocial: string; // Capital social de la empresa.
  numeroFolioPermiso: string; // Número de folio del permiso.
  fechaExpedicion: string; // Fecha de expedición del permiso.
  elCapitalSocial: boolean; // Indica si el capital social cumple con los requisitos.
  miRepresentada: boolean; // Indica si la empresa está representada.
  consolidacionCargas:number | string; // Indica si se está consolidando cargas.
  noConsolidadoET:number | string; // Indica si se está noConsolidadoET.
  vehiculosTablaDatos: VehiculosTabla[]; // Datos de la tabla de vehículos.
  agentesTablaDatos: AgentesTabla[]; // Datos de la tabla de agentes.
  registroTablaDatos: RegistroVehiculos[]; // Datos de la tabla de registro de vehículos.
}


/**
 * @función
 * @nombre createInitialState
 * @descripción
 * Crea y devuelve el estado inicial para el trámite 30401.
 * 
 * @retorna {Tramites30401State} El estado inicial del trámite.
 */
export function createInitialState(): Tramites30401State {
  return {
    claveDeReferencia: '',
    cadenaPagoDependencia: '',
    clave: '',
    llaveDePago: '',
    fecPago: '',
    impPago: '',
    manifiestoDeclaracion:false,

    cveFolioCaat: '',
    tipoTransito: '',
    cboAduanasActuarSeleccionadas: [],
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    entidadFederativa: '',
    delegacionMunicipio: '',
    colonia: '',
    localidad: '',
    codigoPostal: '',
    capitalSocial: '',
    numeroFolioPermiso: '',
    fechaExpedicion: '',
    elCapitalSocial: false,
    miRepresentada: false,
    consolidacionCargas:'',
    noConsolidadoET:'',
    vehiculosTablaDatos:[],
    agentesTablaDatos:[],
    registroTablaDatos:[],
  };
}

/**
 * @clase
 * @nombre Tramite30401Store
 * @descripción
 * Clase que extiende de `Store` de Akita para gestionar el estado del trámite 30401.
 * Proporciona métodos para actualizar diferentes partes del estado, como datos de vehículos, agentes y registros.
 * 
 * @decorador @Injectable
 * @decorador @StoreConfig
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramites30401', resettable: true })
export class Tramite30401Store extends Store<Tramites30401State> {
   
  /**
   * @constructor
   * @descripción
   * Constructor que inicializa la tienda con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @método
   * @nombre establecerDatos
   * @descripción
   * Actualiza el estado con los valores proporcionados.
   * 
   * @param {Partial<Tramites30401State>} values - Valores parciales para actualizar el estado.
   */
  public establecerDatos(values: Partial<Tramites30401State>): void {    
    this.update((state) => ({
      ...state,
      ...values,
    }));
  }

  /**
   * @método
   * @nombre setVehiculosTablaDatos
   * @descripción
   * Actualiza los datos de la tabla de vehículos en el estado.
   * 
   * @param {VehiculosTabla[]} vehiculosTablaDatos - Datos de la tabla de vehículos.
   */
  public setVehiculosTablaDatos(vehiculosTablaDatos: VehiculosTabla[]): void {
    this.update((state) => ({
      ...state,
      vehiculosTablaDatos,
    }));
  }

  /**
   * @método
   * @nombre setAgentesTablaDatos
   * @descripción
   * Actualiza los datos de la tabla de agentes en el estado.
   * 
   * @param {AgentesTabla[]} agentesTablaDatos - Datos de la tabla de agentes.
   */
  public setAgentesTablaDatos(agentesTablaDatos: AgentesTabla[]): void {
    this.update((state) => ({
      ...state,
      agentesTablaDatos,
    }));
  }

  /**
   * @método
   * @nombre setRegistroVehiculosDatos
   * @descripción
   * Actualiza los datos de la tabla de registro de vehículos en el estado.
   * 
   * @param {RegistroVehiculos[]} registroTablaDatos - Datos de la tabla de registro de vehículos.
   */
  public setRegistroVehiculosDatos(registroTablaDatos: RegistroVehiculos[]): void {
    this.update((state) => ({
      ...state,
      registroTablaDatos,
    }));
  }
}