import { Store, StoreConfig } from '@datorama/akita';
import { DatosSolicitante } from '../../tramites/32505/models/avios-model';
import { Injectable } from '@angular/core';

/**
 * @interface Solicitud32505State
 * @description Define el estado inicial para el trámite 32502.
 */
export interface Solicitud32505State {
  /**
   * Número de serie del vehículo.
   */
  numeroSerie: string;

  /**
   * Folio del tipo de aviso.
   */
  folioTipo: string;

  /**
   * Tipo de búsqueda para el aviso.
   */
  tipoBusquedaAviso: string;

  /**
   * Tipo de búsqueda general.
   */
  tipoBusqueda: string;
  /**
   * Confirmidad.
   */
  confirmidad: string;

  /**
   * Estado de la solicitud.
   */
  adace: string;

  /**
   * País relacionado con la solicitud.
   */
  pais: string;

  /**
   * Año relacionado con la solicitud.
   */
  anio: string;

  /**
   * Número NIV del vehículo.
   */
  numeroNIV: string;

  /**
   * Año del modelo del vehículo.
   */
  anoModelo: string;

  /**
   * Marca del vehículo.
   */
  marca: string;

  /**
   * Modelo del vehículo.
   */
  modelo: string;

  /**
   * Tipo o variante del vehículo.
   */
  tipoVariante: string;

  /**
   * Número de cilindros del vehículo.
   */
  cilindros: string;

  /**
   * Número de puertas del vehículo.
   */
  puertas: string;

  /**
   * Tipo de combustible del vehículo.
   */
  combustible: string;

  /**
   * Propiedad relacionada con el vehículo.
   */
  propiedad: string;

  /**
   * Nombre en el título de propiedad.
   */
  nombreTitulo: string;

  /**
   * País que emitió el título de propiedad.
   */
  paisEmitio: string;

  /**
   * Provincia de emisión del título de propiedad.
   */
  provinciaEmision: string;

  /**
   * Procedencia del vehículo.
   */
  procedencia: string;

  /**
   * Indica si el vehículo es importado.
   */
  vehiculoImportado: string;

  /**
   * Información sobre la exportación del vehículo.
   */
  exportacion: string;

  /**
   * Aduana de importación del vehículo.
   */
  aduanaImportacion: string;

  /**
   * Patente de importación del vehículo.
   */
  patenteImportacion: string;

  /**
   * Pedimento de importación del vehículo.
   */
  pedimentoImportacion: string;

  /**
   * Valor en la aduana del vehículo.
   */
  valorAduana: string;

  /**
   * Kilometraje del vehículo al momento de la importación.
   */
  kilometraje: string;

  /**
   * Monto del IGI pagado.
   */
  montoIGI: string;

  /**
   * Forma de pago del IGI.
   */
  formaPagoIGI: string;

  /**
   * Monto del DTA pagado.
   */
  montoDTA: string;

  /**
   * Monto del IVA pagado.
   */
  montoIVA: string;

  /**
   * Valor del vehículo en dólares.
   */
  valorDolares: string;

  /**
   * Folio del CFDI relacionado con el aviso.
   */
  folioCFDI: string;

  /**
   * Folio de la venta del vehículo.
   */
  folioVenta: string;

  /**
   * Valor de la venta del vehículo.
   */
  valorVenta: string;

  /**
   * Datos del solicitante.
   */
  datosSolicitante: DatosSolicitante;

  /**
   * Identificador de la transacción en VUCEM.
   */
  identificadorTransaccionVucem?: string;

  /**
   * NIV o número de serie del vehículo.
   */
  nivNumeroSerie?: string;
}

/**
 * @function createInitialState
 * @description Crea el estado inicial para el trámite 32505.
 * @returns {Solicitud32505State} El estado inicial.
 */
export function createInitialState(): Solicitud32505State {
  return {
    adace: 'default',
    pais: '',
    anio: '',
    tipoBusqueda: '',
    confirmidad: '',
    tipoBusquedaAviso: '',
    folioTipo: '',
    numeroSerie: '',
    numeroNIV: '',
    anoModelo: '',
    marca: '',
    modelo: '',
    tipoVariante: '',
    cilindros: '',
    puertas: '',
    combustible: '',
    propiedad: '',
    nombreTitulo: '',
    paisEmitio: '',
    provinciaEmision: '',
    procedencia: '',
    vehiculoImportado: '',
    exportacion: '',
    aduanaImportacion: '',
    patenteImportacion: '',
    pedimentoImportacion: '',
    valorAduana: '',
    kilometraje: '',
    montoIGI: '',
    formaPagoIGI: '',
    montoDTA: '',
    montoIVA: '',
    valorDolares: '',
    folioCFDI: '',
    folioVenta: '',
    valorVenta: '',
    identificadorTransaccionVucem: '',
    nivNumeroSerie: '',
    datosSolicitante: {
      rfc: '',
      denominacion: '',
      actividadEconomica: '',
      correoElectronico: '',
      pais: '',
      codigoPostal: '',
      entidadFederativa: '',
      municipio: '',
      localidad: '',
      colonia: '',
      calle: '',
      nExt: '',
      nInt: '',
      lada: '',
      telefono: '',
      adace: ''
    }
  };
}

/**
 * @class Tramite32505Store
 * @description Store para gestionar el estado del trámite 32505.
 * @extends {Store<Solicitud32505State>}
 */
@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'tramite32505', resettable: true })
export class Tramite32505Store extends Store<Solicitud32505State> {
  /**
   * @constructor
   * @description Inicializa el store con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @method setAdace
   * @description Actualiza el estado del campo `adace`.
   * @param {string} adace - Valor a actualizar.
   */
  public setAdace(adace: string): void {
    this.update((state) => ({
      ...state,
      adace
    }));
  }

  /**
   * @method setPais
   * @description Actualiza el estado del campo `pais`.
   * @param {string} pais - Valor a actualizar.
   */
  public setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais
    }));
  }

  /**
   * @method setAnio
   * @description Actualiza el estado del campo `anio`.
   * @param {string} anio - Valor a actualizar.
   */
  public setAnio(anio: string): void {
    this.update((state) => ({
      ...state,
      anio
    }));
  }

  /**
   * @method setTipoBusqueda
   * @description Actualiza el estado del campo `tipoBusqueda`.
   * @param {string} tipoBusqueda - Valor a actualizar.
   */
  public setTipoBusqueda(tipoBusqueda: string): void {
    this.update((state) => ({
      ...state,
      tipoBusqueda
    }));
  }

  /**
   * @method setConfirmidad
   * @description Actualiza el estado del campo `confirmidad`.
   * @param {string} confirmidad - Valor a actualizar.
   */
  public setConfirmidad(confirmidad: string): void {
    this.update((state) => ({
      ...state,
      confirmidad
    }));
  }

  /**
   * @method setTipoBusquedaAviso
   * @description Actualiza el estado del campo `tipoBusquedaAviso`.
   * @param {string} tipoBusquedaAviso - Valor a actualizar.
   */
  public setTipoBusquedaAviso(tipoBusquedaAviso: string): void {
    this.update((state) => ({
      ...state,
      tipoBusquedaAviso
    }));
  }

  /**
   * @method setFolioTipo
   * @description Actualiza el estado del campo `folioTipo`.
   * @param {string} folioTipo - Valor a actualizar.
   */
  public setFolioTipo(folioTipo: string): void {
    this.update((state) => ({
      ...state,
      folioTipo
    }));
  }

  /**
   * @method setNumeroSerie
   * @description Actualiza el estado del campo `numeroSerie`.
   * @param {string} numeroSerie - Valor a actualizar.
   */
  public setNumeroSerie(numeroSerie: string): void {
    this.update((state) => ({
      ...state,
      numeroSerie
    }));
  }

  /**
   * @method setNumeroNIV
   * @description Actualiza el estado del campo `numeroNIV`.
   * @param {string} numeroNIV - Valor a actualizar.
   */
  public setNumeroNIV(numeroNIV: string): void {
    this.update((state) => ({
      ...state,
      numeroNIV
    }));
  }

  /**
   * @method setAnoModelo
   * @description Actualiza el estado del campo `anoModelo`.
   * @param {string} anoModelo - Valor a actualizar.
   */
  public setAnoModelo(anoModelo: string): void {
    this.update((state) => ({
      ...state,
      anoModelo
    }));
  }

  /**
   * @method setMarca
   * @description Actualiza el estado del campo `marca`.
   * @param {string} marca - Valor a actualizar.
   */
  public setMarca(marca: string): void {
    this.update((state) => ({
      ...state,
      marca
    }));
  }

  /**
   * @method setModelo
   * @description Actualiza el estado del campo `modelo`.
   * @param {string} modelo - Valor a actualizar.
   */
  public setModelo(modelo: string): void {
    this.update((state) => ({
      ...state,
      modelo
    }));
  }

  /**
   * @method setTipoVariante
   * @description Actualiza el estado del campo `tipoVariante`.
   * @param {string} tipoVariante - Valor a actualizar.
   */
  public setTipoVariante(tipoVariante: string): void {
    this.update((state) => ({
      ...state,
      tipoVariante
    }));
  }

  /**
   * @method setCilindros
   * @description Actualiza el estado del campo `cilindros`.
   * @param {string} cilindros - Valor a actualizar.
   */
  public setCilindros(cilindros: string): void {
    this.update((state) => ({
      ...state,
      cilindros
    }));
  }

  /**
   * @method setPuertas
   * @description Actualiza el estado del campo `puertas`.
   * @param {string} puertas - Valor a actualizar.
   */
  public setPuertas(puertas: string): void {
    this.update((state) => ({
      ...state,
      puertas
    }));
  }

  /**
   * @method setCombustible
   * @description Actualiza el estado del campo `combustible`.
   * @param {string} combustible - Valor a actualizar.
   */
  public setCombustible(combustible: string): void {
    this.update((state) => ({
      ...state,
      combustible
    }));
  }

  /**
   * @method setPropiedad
   * @description Actualiza el estado del campo `propiedad`.
   * @param {string} propiedad - Valor a actualizar.
   */
  public setPropiedad(propiedad: string): void {
    this.update((state) => ({
      ...state,
      propiedad
    }));
  }

  /**
   * @method setNombreTitulo
   * @description Actualiza el estado del campo `nombreTitulo`.
   * @param {string} nombreTitulo - Valor a actualizar.
   */
  public setNombreTitulo(nombreTitulo: string): void {
    this.update((state) => ({
      ...state,
      nombreTitulo
    }));
  }

  /**
   * @method setPaisEmitio
   * @description Actualiza el estado del campo `paisEmitio`.
   * @param {string} paisEmitio - Valor a actualizar.
   */
  public setPaisEmitio(paisEmitio: string): void {
    this.update((state) => ({
      ...state,
      paisEmitio
    }));
  }

  /**
   * @method setProvinciaEmision
   * @description Actualiza el estado del campo `provinciaEmision`.
   * @param {string} provinciaEmision - Valor a actualizar.
   */
  public setProvinciaEmision(provinciaEmision: string): void {
    this.update((state) => ({
      ...state,
      provinciaEmision
    }));
  }

  /**
   * @method setProcedencia
   * @description Actualiza el estado del campo `procedencia`.
   * @param {string} procedencia - Valor a actualizar.
   */
  public setProcedencia(procedencia: string): void {
    this.update((state) => ({
      ...state,
      procedencia
    }));
  }

  /**
   * @method setVehiculoImportado
   * @description Actualiza el estado del campo `vehiculoImportado`.
   * @param {string} vehiculoImportado - Valor a actualizar.
   */
  public setVehiculoImportado(vehiculoImportado: string): void {
    this.update((state) => ({
      ...state,
      vehiculoImportado
    }));
  }

  /**
   * @method setExportacion
   * @description Actualiza el estado del campo `exportacion`.
   * @param {string} exportacion - Valor a actualizar.
   */
  public setExportacion(exportacion: string): void {
    this.update((state) => ({
      ...state,
      exportacion
    }));
  }

  /**
   * @method setAduanaImportacion
   * @description Actualiza el estado del campo `aduanaImportacion`.
   * @param {string} aduanaImportacion - Valor a actualizar.
   */
  public setAduanaImportacion(aduanaImportacion: string): void {
    this.update((state) => ({
      ...state,
      aduanaImportacion
    }));
  }

  /**
   * @method setPatenteImportacion
   * @description Actualiza el estado del campo `patenteImportacion`.
   * @param {string} patenteImportacion - Valor a actualizar.
   */
  public setPatenteImportacion(patenteImportacion: string): void {
    this.update((state) => ({
      ...state,
      patenteImportacion
    }));
  }

  /**
   * @method setPedimentoImportacion
   * @description Actualiza el estado del campo `pedimentoImportacion`.
   * @param {string} pedimentoImportacion - Valor a actualizar.
   */
  public setPedimentoImportacion(pedimentoImportacion: string): void {
    this.update((state) => ({
      ...state,
      pedimentoImportacion
    }));
  }

  /**
   * @method setValorAduana
   * @description Actualiza el estado del campo `valorAduana`.
   * @param {string} valorAduana - Valor a actualizar.
   */
  public setValorAduana(valorAduana: string): void {
    this.update((state) => ({
      ...state,
      valorAduana
    }));
  }

  /**
   * @method setKilometraje
   * @description Actualiza el estado del campo `kilometraje`.
   * @param {string} kilometraje - Valor a actualizar.
   */
  public setKilometraje(kilometraje: string): void {
    this.update((state) => ({
      ...state,
      kilometraje
    }));
  }

  /**
   * @method setMontoIGI
   * @description Actualiza el estado del campo `montoIGI`.
   * @param {string} montoIGI - Valor a actualizar.
   */
  public setMontoIGI(montoIGI: string): void {
    this.update((state) => ({
      ...state,
      montoIGI
    }));
  }

  /**
   * @method setFormaPagoIGI
   * @description Actualiza el estado del campo `formaPagoIGI`.
   * @param {string} formaPagoIGI - Valor a actualizar.
   */
  public setFormaPagoIGI(formaPagoIGI: string): void {
    this.update((state) => ({
      ...state,
      formaPagoIGI
    }));
  }

  /**
   * @method setMontoDTA
   * @description Actualiza el estado del campo `montoDTA`.
   * @param {string} montoDTA - Valor a actualizar.
   */
  public setMontoDTA(montoDTA: string): void {
    this.update((state) => ({
      ...state,
      montoDTA
    }));
  }

  /**
   * @method setMontoIVA
   * @description Actualiza el estado del campo `montoIVA`.
   * @param {string} montoIVA - Valor a actualizar.
   */
  public setMontoIVA(montoIVA: string): void {
    this.update((state) => ({
      ...state,
      montoIVA
    }));
  }

  /**
   * @method setValorDolares
   * @description Actualiza el estado del campo `valorDolares`.
   * @param {string} valorDolares - Valor a actualizar.
   */
  public setValorDolares(valorDolares: string): void {
    this.update((state) => ({
      ...state,
      valorDolares
    }));
  }

  /**
   * @method setFolioCFDI
   * @description Actualiza el estado del campo `folioCFDI`.
   * @param {string} folioCFDI - Valor a actualizar.
   */
  public setFolioCFDI(folioCFDI: string): void {
    this.update((state) => ({
      ...state,
      folioCFDI
    }));
  }

  /**
   * @method setFolioVenta
   * @description Actualiza el estado del campo `folioVenta`.
   * @param {string} folioVenta - Valor a actualizar.
   */
  public setFolioVenta(folioVenta: string): void {
    this.update((state) => ({
      ...state,
      folioVenta
    }));
  }

  /**
   * @method setValorVenta
   * @description Actualiza el estado del campo `valorVenta`.
   * @param {string} valorVenta - Valor a actualizar.
   */
  public setValorVenta(valorVenta: string): void {
    this.update((state) => ({
      ...state,
      valorVenta
    }));
  }

  /**
   * @method setValorVenta
   * @description Actualiza el estado del campo `valorVenta`.
   * @param {string} valorVenta - Valor a actualizar.
   */
  public setidentificadorTransaccionVucem(identificadorTransaccionVucem: string): void {
    this.update((state) => ({
      ...state,
      identificadorTransaccionVucem
    }));
  }

  /**
   * @method setValorVenta
   * @description Actualiza el estado del campo `valorVenta`.
   * @param {string} valorVenta - Valor a actualizar.
   */
  public setnivNumeroSerie(nivNumeroSerie: string): void {
    this.update((state) => ({
      ...state,
      nivNumeroSerie
    }));
  }

  /**
   * @method setDatosSolicitante
   * @description Actualiza el estado del campo `datosSolicitante`.
   * @param {DatosSolicitante} datosSolicitante - Objeto con los datos del solicitante.
   */
  public setDatosSolicitante(datosSolicitante: DatosSolicitante): void {
    this.update((state) => ({
      ...state,
      datosSolicitante
    }));
  }
}