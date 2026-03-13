import { ColumnasTabla, CombinacionRequerida, DatosRealizar, EmpresaProductora, FormularioGrupo, Importador, PagoDerechos, TercerosRelacionados, Transporte } from '../models/acuicola.module';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Estado inicial del formulario para el trámite 220403.
 * 
 * @constant
 * @type {FormularioGrupo}
 * @description Define los valores por defecto para cada sección del formulario, incluyendo datos de realización, combinación requerida, transporte y pago de derechos, así como los indicadores de validación correspondientes.
 */
export const INITIAL_STATE: FormularioGrupo = {
  datosRealizar: {
    certificadoTipo: '',
    aduanaEmbarque: '',
    numeroContenedor: '',
    paisOrigen: '',
    entidadFederativaOrigen: '',
    municipioOrigen: '',
    paisDestino: '',
  },
  combinacionRequerida: {
    especie: '',
    paisDeDestino: '',
    instalacionAcuicola: ''
  },
  transporte: {
    medioTransporte: '',
    identificacionMedioTransporte: '',
    numeroDeContenedor: '',
    denominacionRazonSocial: '',
    numeroFlejes: '',
  },
  pagoDerechos: {
    claveReferencia: '454002245',
    cadenaDependencia: '0001841471CAEX',
    banco: '',
    llavePago: '',
    fechaPago: '',
    importePago: '761.0',
  },
  datosRealizarValidada: false,
  combinacionRequeridaValidada: false,
  transporteValidada: false,
  pagoDerechosValidada: false,
  tercerosRelacionados: {
    tipoPersona: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    razonSocial: '',
    pais: '',
    domicilio: '',
    lada: '',
    telefono: '',
    correoElectronico: ''
  },
  mercanciasTablaDatos: [],
  empresaProductoraDatos: [],
  importadorDatos: [],
};

/**
 * Tramite entity store
 *
 * @export
 * @class TramiteStore
 * @extends {Store<FormularioGrupo>}
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite-220403', resettable: true })
export class Tramite220403Store extends Store<FormularioGrupo> {
  constructor() {
    super(INITIAL_STATE);
  }

  /**
   * @method setDatosRealizar
   * @description
   * Establece los datos de modificación en el estado.
   * 
   * @param {DatosRealizar} datosRealizar - Los datos de modificación que se van a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setDatosRealizar(datosRealizar: DatosRealizar): void {
    this.update((state) => ({
      ...state,
      datosRealizar,
    }));
  }

  /**
   * @method setCombinacionRequerida
   * @description
   * Establece la combinación requerida en el estado.
   * 
   * @param {CombinacionRequerida} combinacionRequerida - La combinación requerida que se va a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setCombinacionRequerida(combinacionRequerida: CombinacionRequerida): void {
    this.update((state) => ({
      ...state,
      combinacionRequerida,
    }));
  }


  /**
   * @method setTransporte
   * @description
   * Establece el Transporte en el almacén.
   * 
   * @param {Transporte} transporte - El Transporte que se va a establecer en el almacén.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setTransporte(transporte: Transporte): void {
    this.update((state) => ({
      ...state,
      transporte,
    }));
  }

  /**
   * @method setPagoDerechos
   * @description
   * Establece el alta de PagoDerechos en el almacén.
   * 
   * @param {PagoDerechos} pagoDerechos - Representa las PagoDerechos a dar de alta.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setPagoDerechos(pagoDerechos: PagoDerechos): void {
    this.update((state) => ({
      ...state,
      pagoDerechos,
    }));
  }

  /**
   * @method setDatosRealizarValidada
   * @description
   * Establece el estado de validación de la sección "Datos a Realizar".
   * 
   * @param {boolean} datosRealizarValidada - Indica si la sección de datos a realizar ha sido validada.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setDatosRealizarValidada(datosRealizarValidada : boolean): void {
    this.update((state) => ({
      ...state,
      datosRealizarValidada,
    }));
  }

  /**
   * @method setCombinacionRequeridaValidada
   * @description
   * Establece el estado de validación de la sección "Combinación Requerida".
   * 
   * @param {boolean} combinacionRequeridaValidada - Indica si la sección de combinación requerida ha sido validada.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setCombinacionRequeridaValidada(combinacionRequeridaValidada : boolean): void {
    this.update((state) => ({
      ...state,
      combinacionRequeridaValidada,
    }));
  }

  /**
   * @method setTransporteValidada
   * @description
   * Establece el estado de validación de la sección "Transporte".
   * 
   * @param {boolean} transporteValidada - Indica si la sección de transporte ha sido validada.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setTransporteValidada(transporteValidada : boolean): void {
    this.update((state) => ({
      ...state,
      transporteValidada,
    }));
  }

  /**
   * @method setPagoDerechosValidada
   * @description
   * Actualiza el estado para indicar si el pago de derechos ha sido validado.
   * 
   * @param {boolean} pagoDerechosValidada - Indica si el pago de derechos ha sido validado.
   * 
   * @returns {void}
   */
  setPagoDerechosValidada(pagoDerechosValidada : boolean): void {
    this.update((state) => ({
      ...state,
      pagoDerechosValidada,
    }));
  }

  /**
   * @method setTercerosRelacionados
   * @description
   * Establece los terceros relacionados en el estado.
   * 
   * @param {any[]} tercerosRelacionados - Los terceros relacionados que se van a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setTercerosRelacionados(tercerosRelacionados: TercerosRelacionados): void {
    this.update((state) => ({
      ...state,
      tercerosRelacionados: tercerosRelacionados,
    }));
  }

  /**
   * @method setMercanciasTablaDatos
   * @description
   * Establece los datos de la tabla de mercancías en el estado.
   * 
   * @param {ColumnasTabla[]} mercanciasTablaDatos - Los datos de las mercancías que se van a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setMercanciasTablaDatos(mercanciasTablaDatos: ColumnasTabla[]): void {
    this.update((state) => ({
      ...state,
      mercanciasTablaDatos,
    }));
  }

  /**
   * @method setEmpresaProductoraDatos
   * @description
   * Establece los datos de la empresa productora en el estado.
   * 
   * @param {EmpresaProductora[]} empresaProductoraDatos - Los datos de la empresa productora que se van a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setEmpresaProductoraDatos(empresaProductoraDatos: EmpresaProductora[]): void {
    this.update((state) => ({
      ...state,
      empresaProductoraDatos,
    }));
  }

  /**
   * @method setImportadorDatos
   * @description
   * Establece los datos del importador en el estado.
   * 
   * @param {Importador[]} importadorDatos - Los datos del importador que se van a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setImportadorDatos(importadorDatos: Importador[]): void {
    this.update((state) => ({
      ...state,
      importadorDatos,
    }));
  }

  /**
   * @method setTipoPersona
   * @description
   * Establece el tipo de persona en el estado.
   * 
   * @param {string} tipoPersona - El tipo de persona que se va a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setTipoPersona(tipoPersona: string): void {
    this.update((state) => ({
      ...state,
      tipoPersona,
    }));
  }

  /**
   * @method setNombre
   * @description
   * Establece el nombre en el estado.
   * 
   * @param {string} nombre - El nombre que se va a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }

  /**
   * @method setApellidoPaterno
   * @description
   * Establece el apellido paterno en el estado.
   * 
   * @param {string} apellidoPaterno - El apellido paterno que se va a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setApellidoPaterno(apellidoPaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoPaterno,
    }));
  }

  /**
   * @method setApellidoMaterno
   * @description
   * Establece el apellido materno en el estado.
   * 
   * @param {string} apellidoMaterno - El apellido materno que se va a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setApellidoMaterno(apellidoMaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoMaterno,
    }));
  }

  /**
   * @method setRazonSocial
   * @description
   * Establece la razón social en el estado.
   * 
   * @param {string} razonSocial - La razón social que se va a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setRazonSocial(razonSocial: string): void {
    this.update((state) => ({
      ...state,
      razonSocial,
    }));
  }

  /**
   * @method setPais
   * @description
   * Establece el país en el estado.
   * 
   * @param {string} pais - El país que se va a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
   * @method setDomicilio
   * @description
   * Establece el domicilio en el estado.
   * 
   * @param {string} domicilio - El domicilio que se va a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setDomicilio(domicilio: string): void {
    this.update((state) => ({
      ...state,
      domicilio,
    }));
  }

  /**
   * @method setLada
   * @description
   * Establece la lada en el estado.
   * 
   * @param {string} lada - La lada que se va a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setLada(lada: string): void {
    this.update((state) => ({
      ...state,
      lada,
    }));
  }

  /**
   * @method setTelefono
   * @description
   * Establece el teléfono en el estado.
   * 
   * @param {string} telefono - El teléfono que se va a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }

  /**
   * @method setCorreoElectronico
   * @description
   * Establece el correo electrónico en el estado.
   * 
   * @param {string} correoElectronico - El correo electrónico que se va a establecer en el estado.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({
      ...state,
      correoElectronico,
    }));
  }

  /**
   * @method limpiarFormulario
   * @description 
   * Resets the store to its initial state.
   */
  public limpiarFormulario(): void {
    this.reset();
  }
}