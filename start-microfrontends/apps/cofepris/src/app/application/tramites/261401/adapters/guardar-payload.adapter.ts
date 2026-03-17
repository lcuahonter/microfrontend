/**
 * @fileoverview
 * Servicio adaptador que transforma el estado interno (Akita)
 * al formato requerido por la API para el trámite 261401.
 * 
 * Este adaptador sigue los patrones establecidos por los adaptadores 260604 y 260201
 * para mantener consistencia en la estructura y formato del código.
 */

import { Injectable } from '@angular/core';
import { PagoDerechosState } from '../../../shared/estados/stores/pago-de-derechos.store';
import { Solicitud261401State } from '../estados/tramite261401.store';
import { Solicitud2614State } from '../../../estados/tramites/tramite2614.store';

/**
 * @class GuardarAdapter_261401
 * @description
 * Adaptador encargado de convertir el estado almacenado en Akita
 * hacia el payload final esperado por el backend para guardar información
 * del trámite 261401.
 * 
 */
@Injectable({
  providedIn: 'root'
})
/**
 * @class GuardarAdapter_261401
 * @description
 * Adaptador encargado de convertir el estado almacenado en Akita
 * hacia el payload final esperado por el backend para guardar información
 * del trámite 261401.
 */
export class GuardarAdapter_261401 {
  /**
   * Convierte el estado y los datos recopilados en el payload final requerido por la API.
   * @param state Estado específico del trámite 261401.
   * @param datosState Datos recopilados del formulario.
   * @param solicitud2614State Estado general del trámite 2614.
   * @param guardarDatos Datos adicionales a guardar.
   * @param pagoState Estado de pago de derechos.
   * @returns {unknown} Payload final para la API.
   */
  static toFormPayload(
    state: Solicitud261401State,
    datosState: Record<string, unknown>,
    solicitud2614State: Solicitud2614State,
    guardarDatos: Record<string, unknown>,
    pagoState: PagoDerechosState
  ): unknown {
    const MERGED = GuardarAdapter_261401.deepMerge(
      {},
      datosState,
      state,
      solicitud2614State as unknown as Record<string, unknown>,
      guardarDatos,
      pagoState as unknown as Record<string, unknown>
    );
    
    if (datosState['destinatarioDatos'] && Array.isArray(datosState['destinatarioDatos']) && datosState['destinatarioDatos'].length > 0) {
      MERGED['destinatarioDatos'] = datosState['destinatarioDatos'];
    } else if (state.destinatarios && Array.isArray(state.destinatarios) && state.destinatarios.length > 0) {
      MERGED['destinatarioDatos'] = state.destinatarios;
    }
    
    if (datosState['mercanciaTabla'] && Array.isArray(datosState['mercanciaTabla']) && datosState['mercanciaTabla'].length > 0) {
      MERGED['mercanciaTabla'] = datosState['mercanciaTabla'];
    } else if (state.mercanciaTabla && Array.isArray(state.mercanciaTabla) && state.mercanciaTabla.length > 0) {
      MERGED['mercanciaTabla'] = state.mercanciaTabla;
    }
    
    const FINAL_PAYLOAD = {
      idSolicitud: MERGED['idSolicitud'] ?? state.idSolicitud ?? 0,
      solicitante: this.buildSolicitante(state, MERGED),
      solicitud: this.buildSolicitud(),
      establecimiento: this.buildEstablecimiento(MERGED),
      datosSCIAN: this.buildDatosScian(MERGED),
      mercancias: this.buildMercancias(state, datosState),
      representanteLegal: this.buildRepresentanteLegal(MERGED),
      gridTerceros_TIPERS_INF: this.buildTerceros(solicitud2614State, MERGED),
      pagoDeDerechos: this.buildPagoDeDerechos(pagoState, MERGED)
    };
    
    return FINAL_PAYLOAD;
  }

  /**
   * Realiza una fusión profunda de varios objetos fuente en el objeto destino.
   * @param target Objeto destino.
   * @param sources Objetos fuente a fusionar.
   * @returns {Record<string, unknown>} Objeto fusionado.
   */
  private static deepMerge(target: Record<string, unknown>, ...sources: Record<string, unknown>[]): Record<string, unknown> {
    for (const SOURCE of sources) {
      if (SOURCE && typeof SOURCE === 'object') {
        for (const KEY of Object.keys(SOURCE)) {
          if (
            SOURCE[KEY] &&
            typeof SOURCE[KEY] === 'object' &&
            !Array.isArray(SOURCE[KEY])
          ) {
            if (!target[KEY] || typeof target[KEY] !== 'object') {
              target[KEY] = {};
            }
            target[KEY] = GuardarAdapter_261401.deepMerge(target[KEY] as Record<string, unknown>, SOURCE[KEY] as Record<string, unknown>);
          } else {
            target[KEY] = SOURCE[KEY];
          }
        }
      }
    }
    return target;
  }

  /**
   * Construye el objeto solicitante a partir del estado y los datos recopilados.
   * @param state Estado del trámite 261401.
   * @param guardarDatos Datos recopilados del formulario.
   * @returns {Record<string, unknown>} Objeto solicitante.
   */
  private static buildSolicitante(state: Solicitud261401State, guardarDatos: Record<string, unknown>): Record<string, unknown> {
    // Intente utilizar los datos del formulario si los campos del solicitante están vacíos
    const SOLICITANTE_DATA = {
      rfc: guardarDatos['rfc_original'] || state.rfc || 'RFC_TEMPORAL',
      nombre: guardarDatos['nombre'] || state.nombre || guardarDatos['observaciones'] || 'SOLICITANTE_TEMPORAL',
      actividadEconomica: guardarDatos['actividadEconomica'] || state['actividadEconomica'] || 'ACTIVIDAD_TEMPORAL',
      correoElectronico: guardarDatos['email'] || state.correoElecronico || 'correo@temporal.com',
      domicilio: this.buildSolicitanteDomicilio(state, guardarDatos),
      certificado_serial_number: ''
    };
    
    return SOLICITANTE_DATA;
  }

  /**
   * Construye el domicilio del solicitante a partir del estado y los datos recopilados.
   * @param state Estado del trámite 261401.
   * @param guardarDatos Datos recopilados del formulario.
   * @returns {Record<string, unknown>} Objeto domicilio del solicitante.
   */
  private static buildSolicitanteDomicilio(state: Solicitud261401State, guardarDatos: Record<string, unknown>): Record<string, unknown> {
    const UBICACION = guardarDatos['ubicacion'] as Record<string, unknown> | undefined;
    return {
      pais: this.resolveDomicilioField(UBICACION, 'pais_residencia', state.pais),
      codigoPostal: this.resolveDomicilioField(UBICACION, 'cp', state.codigoPostal),
      estado: this.resolveDomicilioField(UBICACION, 'd_ent_fed', state.estado),
      municipioAlcaldia: this.resolveDomicilioField(UBICACION, 'd_municipio', state.municipio),
      localidad: this.resolveDomicilioField(UBICACION, 'd_localidad', state.localidad),
      colonia: this.resolveDomicilioField(UBICACION, 'd_colonia', state.colonia),
      calle: this.resolveDomicilioField(UBICACION, 'calle', state.calleYNumero),
      numeroExterior: this.resolveDomicilioField(UBICACION, 'n_exterior', state['numeroExterior']),
      numeroInterior: this.resolveDomicilioField(UBICACION, 'n_interior', state['numeroInterior']),
      lada: '',
      telefono: this.resolveDomicilioField(UBICACION, 'telefono_1', state.telefono)
    };
  }

  /**
   * Resuelve el valor de un campo de domicilio, priorizando el dato de ubicación y usando un valor de respaldo si es necesario.
   * @param ubicacion Objeto de ubicación.
   * @param key Clave del campo a buscar.
   * @param fallback Valor de respaldo.
   * @returns {unknown} Valor resuelto.
   */
  private static resolveDomicilioField(
    ubicacion: Record<string, unknown> | undefined,
    key: string,
    fallback: unknown
  ): unknown {
    if (ubicacion && Object.prototype.hasOwnProperty.call(ubicacion, key) && ubicacion[key] !== undefined && ubicacion[key] !== null) {
      return ubicacion[key];
    }
    return fallback ?? '';
  }

  /**
   * Construye el objeto solicitud con valores fijos requeridos por la API.
   * @returns {Record<string, unknown>} Objeto solicitud.
   */
  private static buildSolicitud(): Record<string, unknown> {
    return {
      discriminatorValue: 261401,
      declaracionesSeleccionadas: true,
      regimen: '01',
      aduanaAIFA: '140',
      informacionConfidencial: true
    };
  }

  /**
   * Construye el objeto establecimiento a partir de los datos recopilados.
   * @param datosState Datos recopilados del formulario.
   * @returns {Record<string, unknown>} Objeto establecimiento.
   */
  private static buildEstablecimiento(datosState: Record<string, unknown>): Record<string, unknown> {
    const ESTABLECIMIENTO_DATA = {
      rfcResponsableSanitario: datosState['establecimientoRFCResponsableSanitario'] || datosState['rfcDelProfesionalResponsable'] || 'RFC_EST_TEMPORAL',
      razonSocial: datosState['establecimientoRazonSocial'] || datosState['establecimientoDenominacionRazonSocial'] || 'RAZON_SOCIAL_TEMPORAL',
      correoElectronico: datosState['establecimientoCorreoElectronico'] || 'establecimiento@temporal.com',
      domicilio: this.buildEstablecimientoDomicilio(datosState),
      original: '',
      avisoFuncionamiento: datosState['avisoCheckbox'] || datosState['avisoDeFuncionamiento'] || false,
      numeroLicencia: datosState['noDeLicenciaSanitaria'] || datosState['licenciaSanitaria'] || datosState['noLicenciaSanitaria'] || 'LIC_TEMPORAL',
      aduanas: datosState['aduanasEntradas'] || datosState['aduanaDeSalida'] || '001'
    };
    
    return ESTABLECIMIENTO_DATA;
  }

  /**
   * Construye el domicilio del establecimiento a partir de los datos recopilados.
   * @param datosState Datos recopilados del formulario.
   * @returns {Record<string, unknown>} Objeto domicilio del establecimiento.
   */
  private static buildEstablecimientoDomicilio(datosState: Record<string, unknown>): Record<string, unknown> {
    return {
      codigoPostal: datosState['establecimientoDomicilioCodigoPostal'] || '',
      entidadFederativa: {
        clave: datosState['establecimientoEstados'] || datosState['establecimientoDomicilioEstado'] || ''
      },
      descripcionMunicipio: datosState['descripcionMunicipio'] || datosState['establecimientoMunicipioYAlcaldia'] || '',
      informacionExtra: datosState['localidad'] || datosState['establecimientoDomicilioLocalidad'] || '',
      descripcionColonia: datosState['establishomentoColonias'] || datosState['establecimientoDomicilioColonia'] || datosState['colonias'] || '',
      calle: datosState['calle'] || datosState['establecimientoDomicilioCalle'] || '',
      lada: datosState['lada'] || datosState['establecimientoDomicilioLada'] || '',
      telefono: datosState['telefono'] || datosState['establecimientoDomicilioTelefono'] || ''
    };
  }

  /**
   * Construye el arreglo de datos SCIAN a partir de los datos recopilados.
   * @param datosState Datos recopilados del formulario.
   * @returns {unknown[]} Arreglo de datos SCIAN.
   */
  private static buildDatosScian(datosState: Record<string, unknown>): unknown[] {
    return [{
      cveScian: datosState['scian'],
      descripcion: datosState['descripcionScian'],
      selected: true
    }];
  }

  /**
   * Construye el arreglo de mercancías a partir del estado y los datos recopilados.
   * @param state Estado del trámite 261401.
   * @param datosState Datos recopilados del formulario.
   * @returns {unknown[]} Arreglo de mercancías.
   */
  private static buildMercancias(state: Solicitud261401State, datosState: Record<string, unknown>): unknown[] {
    let merchandiseData: Record<string, unknown>[] = [];
    if (
      datosState['establecimientoData'] &&
      Array.isArray(datosState['establecimientoData']) &&
      datosState['establecimientoData'].length > 0
    ) {
      merchandiseData = datosState['establecimientoData'] as Record<string, unknown>[];
    } else if (state?.scianTabla && Array.isArray(state.scianTabla) && state.scianTabla.length > 0) {
      merchandiseData = (state.scianTabla as unknown[]) as Record<string, unknown>[];
    }
    
    if (merchandiseData.length === 0) {
      return [{
        idMercancia: 0,
        clasificacion: 'TEMP',
        denominacionEspecifica: 'MERCANCIA_TEMPORAL',
        denominacionDistintiva: 'TEMPORAL',
        denominacionComun: 'TEMPORAL',
        tipoDeProducto: 'TEMPORAL',
        estadoFisico: 'SOLIDO',
        fraccionArancelaria: this.buildFraccionArancelaria({}),
        unidadesMedida: this.buildUnidadesMedida({}),
        presentacion: 'TEMPORAL',
        paisOrigen: { clave: '', nombre: '' },
        paisProcedencia: { clave: '', nombre: '' },
        formaFarmaceutica: '',
        nombreCortoUsoEspecifico: []
      }];
    }
    return merchandiseData.map((producto) => this.buildMercanciaItem(producto));
  }

  /**
   * Construye el objeto representante legal a partir de los datos recopilados.
   * @param datosState Datos recopilados del formulario.
   * @returns {Record<string, unknown>} Objeto representante legal.
   */
  private static buildRepresentanteLegal(datosState: Record<string, unknown>): Record<string, unknown> {
    return {
      rfc: datosState['representanteRfc'] || '',
      resultadoIDC: '',
      nombre: datosState['representanteNombre'] || '',
      apellidoPaterno: datosState['apellidoPaterno'] || '',
      apellidoMaterno: datosState['apellidoMaterno'] || ''
    };
  }

  /**
   * Construye el arreglo de terceros a partir del estado general y los datos fusionados.
   * @param solicitud2614State Estado general del trámite 2614.
   * @param mergedData Datos fusionados opcionales.
   * @returns {unknown[]} Arreglo de terceros.
   */
  private static buildTerceros(solicitud2614State: Solicitud2614State, mergedData?: Record<string, unknown>): unknown[] {
    let thirdPartyData: Record<string, unknown>[] = [];
    
    // Intente obtener datos de terceros a partir de los datos recopilados primero y luego recurra a la tienda
    if (mergedData && mergedData['destinatarioDatos'] && Array.isArray(mergedData['destinatarioDatos']) && mergedData['destinatarioDatos'].length > 0) {
      thirdPartyData = (mergedData['destinatarioDatos'] as unknown[]) as Record<string, unknown>[];
    } else if (
      solicitud2614State?.destinatarioDatos &&
      Array.isArray(solicitud2614State.destinatarioDatos) &&
      solicitud2614State.destinatarioDatos.length > 0
    ) {
      thirdPartyData = (solicitud2614State.destinatarioDatos as unknown[]) as Record<string, unknown>[];
    }
    
    if (thirdPartyData.length === 0) {
      return [];
    }
    
    return thirdPartyData.map((destinatario) => this.buildTerceroItem(destinatario));
  }

  /**
   * Construye el objeto de pago de derechos a partir del estado de pago y los datos fusionados.
   * @param pagoState Estado de pago de derechos.
   * @param mergedData Datos fusionados opcionales.
   * @returns {Record<string, unknown>} Objeto de pago de derechos.
   */
  private static buildPagoDeDerechos(pagoState: PagoDerechosState, mergedData?: Record<string, unknown>): Record<string, unknown> {
    const PAGO_DATA = {
      claveDeReferencia: mergedData?.['claveDeReferencia'] || pagoState?.claveReferencia || '',
      cadenaPagoDependencia: mergedData?.['cadenaPagoDependencia'] || pagoState?.cadenaDependencia || '',
      banco: {
        clave: mergedData?.['bancoClave'] || '',
        descripcion: pagoState?.estado || ''
      },
      llaveDePago: mergedData?.['llaveDePago'] || pagoState?.llavePago || '',
      fecPago: mergedData?.['fecPago'] || pagoState?.fechaPago || '',
      impPago: mergedData?.['impPago'] || pagoState?.importePago || ''
    };
    return PAGO_DATA;
  }

  /**
   * Construye un objeto de mercancía individual a partir de los datos del producto.
   * @param producto Datos del producto.
   * @returns {Record<string, unknown>} Objeto de mercancía.
   */
  private static buildMercanciaItem(producto: Record<string, unknown>): Record<string, unknown> {
    return {
      idMercancia: producto?.['id'] ?? null,
      idClasificacionProducto: producto?.['tipoDeProducto'] || producto?.['clasificacion'] || '',
      nombreClasificacionProducto: '',
      ideSubClasificacionProducto: '',
      nombreSubClasificacionProducto: '',
      descDenominacionEspecifica: producto?.['nombreEspecifico'] || producto?.['denominacionEspecifica'] || '',
      descDenominacionDistintiva: producto?.['denominacionDistintiva'] || '',
      descripcionMercancia: producto?.['nombreEspecifico'] || producto?.['denominacionEspecifica'] || '',
      formaFarmaceuticaDescripcionOtros: '',
      estadoFisicoDescripcionOtros: '',
      ...this.buildFraccionArancelaria(producto),
      ...this.buildUnidadesMedida(producto),
      presentacion: producto?.['Presentacion'] || producto?.['presentacion'] || '',
      nombreCortoPaisOrigen: producto?.['paisOrigen'] ? [producto['paisOrigen']] : [],
      nombreCortoPaisProcedencia: producto?.['paisProcedencia'] ? [producto['paisProcedencia']] : [],
      tipoProductoDescripcionOtros: producto?.['tipoDeProducto'] || producto?.['clasificacion'] || '',
      nombreCortoUsoEspecifico: []
    };
  }

  /**
   * Construye el objeto de fracción arancelaria a partir de los datos del producto.
   * @param producto Datos del producto.
   * @returns {Record<string, unknown>} Objeto de fracción arancelaria.
   */
  private static buildFraccionArancelaria(producto: Record<string, unknown>): Record<string, unknown> {
    return {
      fraccionArancelaria: {
        clave: producto?.['fraccionArancelaria'] || '',
        descripcion: producto?.['descripcionFraccion'] || ''
      }
    };
  }

  /**
   * Construye el objeto de unidades de medida a partir de los datos del producto.
   * @param producto Datos del producto.
   * @returns {Record<string, unknown>} Objeto de unidades de medida.
   */
  private static buildUnidadesMedida(producto: Record<string, unknown>): Record<string, unknown> {
    return {
      unidadMedidaComercial: {
        descripcion: producto?.['unidadDeMedida'] || producto?.['UMT'] || ''
      },
      cantidadUMCConComas: producto?.['cantidadOVolumen'] || producto?.['cantidadUMT'] || '',
      unidadMedidaTarifa: {
        descripcion: producto?.['UMT'] || ''
      },
      cantidadUMTConComas: producto?.['cantidadUMT'] || ''
    };
  }

  /**
   * Construye un objeto de tercero individual a partir de los datos del destinatario.
   * @param destinatario Datos del destinatario.
   * @returns {Record<string, unknown>} Objeto de tercero.
   */
  private static buildTerceroItem(destinatario: Record<string, unknown>): Record<string, unknown> {
    const TERCERO_ITEM = {
      idPersonaSolicitud: '',
      ideTipoTercero: 'TIPERS.DES',
      personaMoral: '0',
      booleanExtranjero: '0',
      booleanFisicaNoContribuyente: '0',
      ...this.buildPersonalData(destinatario),
      actividadProductiva: '',
      actividadProductivaDesc: '',
      descripcionGiro: '',
      numeroRegistro: '',
      domicilio: this.buildDomicilioTercero(destinatario)
    };
    return TERCERO_ITEM;
  }

  /**
   * Construye los datos personales de un tercero a partir de los datos del destinatario.
   * @param destinatario Datos del destinatario.
   * @returns {Record<string, unknown>} Objeto de datos personales.
   */
  private static buildPersonalData(destinatario: Record<string, unknown>): Record<string, unknown> {
    return {
      denominacion: destinatario?.['nombre'] || destinatario?.['denominacion'] || '',
      razonSocial: destinatario?.['nombre'] || destinatario?.['razonSocial'] || '',
      rfc: destinatario?.['rfc'] || '',
      curp: destinatario?.['curp'] || '',
      nombre: destinatario?.['nombre'] || '',
      apellidoPaterno: destinatario?.['apellidoPaterno'] || '',
      apellidoMaterno: destinatario?.['apellidoMaterno'] || '',
      telefono: destinatario?.['telefono'] || '',
      correoElectronico: destinatario?.['correoElectronico'] || ''
    };
  }

  /**
   * Construye el domicilio de un tercero a partir de los datos del destinatario.
   * @param destinatario Datos del destinatario.
   * @returns {Record<string, unknown>} Objeto domicilio del tercero.
   */
  private static buildDomicilioTercero(destinatario: Record<string, unknown>): Record<string, unknown> {
    return {
      calle: destinatario?.['calle'] || '',
      numeroExterior: destinatario?.['numeroExterior'] || '',
      numeroInterior: destinatario?.['numeroInterior'] || '',
      pais: {
        clave: '',
        nombre: destinatario?.['pais'] || ''
      },
      colonia: {
        clave: '',
        nombre: destinatario?.['colonia'] || ''
      },
      delegacionMunicipio: {
        clave: '',
        nombre: destinatario?.['municipio'] || ''
      },
      localidad: {
        clave: '',
        nombre: destinatario?.['localidad'] || ''
      },
      entidadFederativa: {
        clave: '',
        nombre: destinatario?.['entidadFederativa'] || ''
      },
      informacionExtra: '',
      codigoPostal: destinatario?.['codigoPostal'] || '',
      descripcionColonia: destinatario?.['colonia'] || ''
    };
  }
}
