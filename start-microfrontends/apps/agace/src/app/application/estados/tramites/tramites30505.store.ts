import { AvisoAgente } from '../../core/models/30505/aviso-modificacion.model';
import { FusionEscision } from '../../core/models/30505/aviso-modificacion.model';
import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Estado que representa los datos de la solicitud 30505.
 * @interface Solicitud30505State
 * @property numeroDeOficio - Número de oficio relacionado con la solicitud.
 * @property fechaFinVigencia - Fecha de fin de vigencia de la solicitud.
 * @property avisoDeMod - Indica si se ha realizado un aviso de modificación.
 * @property avisoDeFusion - Indica si se ha realizado un aviso de fusión.
 * @property avisoDeCal - Indica si se ha realizado un aviso de cambio de calidad.
 * @property avisoDenom - Indica si se ha realizado un aviso de denominación.
 * @property selectedCheckbox - Lista de checkboxes seleccionados.
 * @property descClobGenerica - Descripción genérica en formato CLOB.
 * @property fechaInicioVigencia - Fecha de inicio de vigencia de la solicitud.
 * @property rfcVucem - RFC registrado en VUCEM.
 * @property razonSocialVucem - Razón social registrada en VUCEM.
 * @property rfcIdc - RFC registrado en IDC.
 * @property razonSocialIdc - Razón social registrada en IDC.
 * @property folioAcuse - Folio del acuse de la solicitud.
 * @property cantidadBienes - Cantidad de bienes declarados.
 * @property capacidadAlmacenamiento2 - Capacidad de almacenamiento adicional.
 * @property numeroTotalCarros - Número total de carros involucrados.
 * @property fechaInspeccion - Fecha de inspección.
 * @property descripcionClobGenerica2 - Descripción adicional en formato CLOB.
 * @property razonSocial - Razón social principal.
 * @property razonSocialSC - Razón social de sociedad controladora.
 * @property numFolioTramite - Número de folio del trámite.
 * @property fechafinVigencia2 - Fecha de fin de vigencia secundaria.
 * @property tipoSolicitudPexim - Tipo de solicitud PEXIM.
 * @property capacidadAlmacenamiento - Capacidad de almacenamiento principal.
 * @property tipoCaat - Tipo de CAAT.
 * @property tipoProgFomExp - Tipo de programa de fomento a la exportación.
 * @property tipoTransito - Tipo de tránsito.
 * @property numeroEstablecimiento - Número de establecimiento.
 * @property medioTransporte - Medio de transporte utilizado.
 * @property nombreBanco - Nombre del banco relacionado.
 * @property nomOficialAutorizado - Nombre del oficial autorizado.
 * @property empresaControladora - Nombre de la empresa controladora.
 * @property observaciones - Observaciones adicionales.
 * @property descripcionLugarEmbarque - Descripción del lugar de embarque.
 * @property actividadProductiva - Actividad productiva principal.
 * @property certificacionModal - Certificación modal.
 * @property rfcBusquedaModal - RFC utilizado para búsqueda modal.
 * @property razonSocialFusionante - Razón social de la empresa fusionante.
 * @property folioVucemFusionante - Folio VUCEM de la empresa fusionante.
 * @property fechaInicioVigenciaFusionante - Fecha de inicio de vigencia de la empresa fusionante.
 * @property fechaFinVigenciaFusionante - Fecha de fin de vigencia de la empresa fusionante.
 * @property rfcBusquedaModalSC - RFC de búsqueda para sociedad controladora.
 * @property razonSocialFusionanteSC - Razón social fusionante de sociedad controladora.
 * @property fusionEscisionData - Datos de fusión o escisión.
 * @property tipoFigura - Tipo de figura legal.
 * @property numPatenteModal - Número de patente modal.
 * @property obligFisc - Obligaciones fiscales.
 * @property autPantente - Autorización de patente.
 * @property patente2 - Patente secundaria.
 * @property razonAgencia - Razón social de la agencia.
 * @property rfcModal - RFC modal.
 * @property patenteModificada - Patente modificada.
 * @property nombre - Nombre de la persona relacionada.
 * @property apellidoPaterno - Apellido paterno de la persona relacionada.
 * @property apellidoMaterno - Apellido materno de la persona relacionada.
 * @property razonSocialAgente - Razón social del agente aduanal.
 * @property agenteDatos - Datos de los avisos de agente aduanal.
 * @property avisoDatos - Datos adicionales de aviso (clave-valor).
 * @property avisoCheckbox - Estado de los checkboxes de aviso.
 */
export interface Solicitud30505State {
  numeroDeOficio: string,
  fechaFinVigencia: string,
  avisoDeMod: boolean
  avisoDeFusion: boolean
  avisoDeCal: boolean,
  avisoDenom: boolean,
  selectedCheckbox: string[],


  descClobGenerica: string;
  fechaInicioVigencia: string;

  rfcVucem: string;
  razonSocialVucem: string;
  rfcIdc: string;
  razonSocialIdc: string;
  folioAcuse: string;

  cantidadBienes: string;
  capacidadAlmacenamiento2: string;
  numeroTotalCarros: string;
  fechaInspeccion: string;
  descripcionClobGenerica2: string;
  razonSocial: string;
  razonSocialSC: string;
  numFolioTramite: string;
  fechafinVigencia2: string;
  tipoSolicitudPexim: string;
  capacidadAlmacenamiento: string;
  tipoCaat: string;
  tipoProgFomExp: string;
  tipoTransito: string;
  numeroEstablecimiento: string;
  medioTransporte: string;
  nombreBanco: string;
  nomOficialAutorizado: string;
  empresaControladora: string;
  observaciones: string;
  descripcionLugarEmbarque: string;
  actividadProductiva: string;

  certificacionModal: string,
  rfcBusquedaModal: string,
  razonSocialFusionante: string,
  folioVucemFusionante: string,
  fechaInicioVigenciaFusionante: string,
  fechaFinVigenciaFusionante: string,
  rfcBusquedaModalSC: string,
  razonSocialFusionanteSC: string,
  fusionEscisionData: FusionEscision[]

  tipoFigura: string;
  numPatenteModal: string;
  obligFisc: string;
  autPantente: string;
  patente2: string;
  razonAgencia: string;
  rfcModal: string;
  patenteModificada: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  razonSocialAgente: string;
  agenteDatos: AvisoAgente[];
  avisoDatos: { [key: string]: string };
  avisoCheckbox: { [key: string]: boolean }; 
  tipoMovimiento: string,
}

/**
 * Crea y retorna el estado inicial para la solicitud 30505.
 *
 * @returns {Solicitud30505State} El estado inicial de la solicitud, con todos los campos predefinidos.
 *
 * @remarks
 * Esta función inicializa todos los campos requeridos para el manejo del estado de la solicitud 30505,
 * incluyendo información de identificación, vigencia, avisos, datos de RFC, razón social, almacenamiento,
 * transporte, agente aduanal, y otros datos relevantes para el trámite.
 *
 * Los valores por defecto están definidos según los requerimientos del proceso y pueden ser modificados
 * posteriormente durante el flujo de la aplicación.
 */
export function createInitialSolicitudState(): Solicitud30505State {
  return {
    numeroDeOficio: '2500300300202599100000000000',
    fechaFinVigencia: '02-04-2025',
    avisoDeMod: false,
    avisoDeFusion: false,
    avisoDeCal: false,
    avisoDenom: false,
    selectedCheckbox: [],
    descClobGenerica: '',
    fechaInicioVigencia: '',
    fechafinVigencia2: '',
    rfcVucem: 'AAL0409235E6',
    razonSocialVucem: 'INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV',
    rfcIdc: 'AAL0409235E6',
    razonSocialIdc: 'INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV',
    folioAcuse: '',
    capacidadAlmacenamiento2: '',
    cantidadBienes: '',
    numeroTotalCarros: '',
    fechaInspeccion: '',
    descripcionClobGenerica2: '',
    razonSocial: '',
    razonSocialSC: '',
    numFolioTramite: '',
    tipoSolicitudPexim: '',
    capacidadAlmacenamiento: '',
    tipoCaat: '',
    tipoProgFomExp: '',
    tipoTransito: '',
    numeroEstablecimiento: '',
    medioTransporte: '',
    nombreBanco: '',
    nomOficialAutorizado: '',
    empresaControladora: '',
    observaciones: '',
    descripcionLugarEmbarque: '',
    actividadProductiva: '',
    certificacionModal: '',
    rfcBusquedaModal: '',
    razonSocialFusionante: '',
    folioVucemFusionante: '',
    fechaInicioVigenciaFusionante: '',
    fechaFinVigenciaFusionante: '',
    rfcBusquedaModalSC: '',
    razonSocialFusionanteSC: '',
    fusionEscisionData: [],
     tipoFigura: '',
  numPatenteModal: '',
  obligFisc: '',
  autPantente: '',
  patente2: '',
  razonAgencia: '',
  rfcModal: '',
  patenteModificada: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  razonSocialAgente: '',
    agenteDatos: [],
    avisoDatos: {

    },
    avisoCheckbox: { 
      avisoDeMod: false,
      avisoDeFusion: false,
      avisoDeCal: false,
      avisoDenom: false,
    },
    tipoMovimiento: '',
  };
}

/**
 * @injectable
 * Store para gestionar el estado de la solicitud 30505.
 * 
 * Proporciona métodos para actualizar diferentes campos del estado relacionados con la solicitud,
 * como descripciones, fechas de vigencia, avisos, datos seleccionados, folios, tipos de solicitud,
 * capacidades, medios de transporte, bancos, observaciones, lugares de embarque, actividades productivas,
 * y datos de fusión/escisión.
 * 
 * @remarks
 * Utiliza Akita Store para el manejo del estado reactivo.
 * 
 * @example
 * ```typescript
 * solicitud30505Store.setDescClobGenerica('Descripción genérica');
 * solicitud30505Store.setFechaInicioVigencia('2024-01-01');
 * ```
 */

@Injectable({
  providedIn: 'root',
})
/**
 * Store Akita para gestionar el estado de la solicitud 30505.
 * 
 * Proporciona métodos para actualizar diferentes propiedades del estado relacionadas con la solicitud,
 * como la descripción genérica del producto, fechas de vigencia, avisos, datos seleccionados, folio de acuse,
 * tipo de solicitud, capacidad de almacenamiento, tipo de tránsito, medio de transporte, nombre del banco,
 * observaciones, descripción del lugar de embarque, actividad productiva, y datos de fusión/escisión.
 * 
 * @remarks
 * Utiliza Akita Store para el manejo reactivo del estado en la aplicación.
 * 
 * @example
 * ```typescript
 * solicitud30505Store.setDescClobGenerica('Nueva descripción');
 * solicitud30505Store.setFechaInicioVigencia('2024-06-01');
 * ```
 */

@StoreConfig({ name: 'solicitud30505', resettable: true })
export class Solicitud30505Store extends Store<Solicitud30505State> {

  /**
   * Constructor de la clase.
   * Inicializa el estado de la solicitud utilizando el estado inicial definido por `createInitialSolicitudState()`.
   * Llama al constructor de la clase base con el estado inicial.
   */
  constructor() {
    super(createInitialSolicitudState());
  }

  /**
   * Actualiza el estado con un nuevo valor para la propiedad `descClobGenerica`.
   *
   * @param descClobGenerica - Nueva descripción en formato CLOB genérica que se asignará al estado.
   */
  public setDescClobGenerica(descClobGenerica: string): void {
    this.update((state) => ({
      ...state,
      descClobGenerica,
    }));
  }

  /**
   * Establece la fecha de inicio de vigencia en el estado.
   *
   * @param fechaInicioVigencia - La nueva fecha de inicio de vigencia en formato string.
   */
  public setFechaInicioVigencia(fechaInicioVigencia: string): void {
    this.update((state) => ({
      ...state,
      fechaInicioVigencia,
    }));
  }

  /**
   * Establece la fecha de fin de vigencia en el estado.
   *
   * @param fechaFinVigencia - La nueva fecha de fin de vigencia en formato string.
   */
  public setFechaFinVigencia(fechaFinVigencia: string): void {
    this.update((state) => ({
      ...state,
      fechaFinVigencia,
    }));
  }

  /**
   * Actualiza el estado estableciendo el valor del aviso para un campo específico.
   *
   * @param aviso - Valor booleano que indica el estado del aviso.
   * @param field - Nombre del campo del estado que se actualizará.
   */
  public setAviso(field: string,aviso: boolean): void {
    this.update((state) => ({
      ...state,
      [field]: aviso,
    }));
  }

  /**
   * Actualiza el estado con los valores seleccionados de los checkboxes.
   *
   * @param datos - Un arreglo de strings que representa los valores seleccionados de los checkboxes.
   */
  public setCheckboxDatos(datos: string[]): void {
    this.update((state) => ({
      ...state,
      selectedCheckbox: datos,
    }));
  }

  /**
   * Actualiza el estado con el nuevo valor de folioAcuse.
   *
   * @param folio - El folio del acuse que se debe establecer en el estado.
   */
  public setFolioAcuse(folio: string): void {
    this.update((state) => ({
      ...state,
      folioAcuse: folio,
    }));
  }

  /**
   * Actualiza el estado estableciendo un aviso en el campo especificado.
   *
   * @param aviso - El mensaje de aviso que se asignará.
   * @param field - El nombre del campo del estado donde se almacenará el aviso.
   */
  public setAvisoDatos(field: string,aviso: string): void {
    this.update((state) => ({
      ...state,
      [field]: aviso,
    }));
  }

  /**
   * Establece el valor de `tipoSolicitudPexim` en el estado de la tienda.
   *
   * @param tipoSolicitudPexim - El nuevo valor para el tipo de solicitud PEXIM.
   */
  public setTipoSolicitudPexim(tipoSolicitudPexim: string): void {
    this.update((state) => ({
      ...state,
      tipoSolicitudPexim,
    }));
  }

  /**
   * Actualiza la capacidad de almacenamiento en el estado de la tienda.
   *
   * @param capacidadAlmacenamiento - Nueva capacidad de almacenamiento a establecer en el estado.
   */
  public setCapacidadAlmacenamiento(capacidadAlmacenamiento: string): void {
    this.update((state) => ({
      ...state,
      capacidadAlmacenamiento,
    }));
  }

  /**
   * Actualiza el estado con un nuevo valor para el tipo de CAAT.
   *
   * @param tipoCaat - El nuevo valor de tipo CAAT que se establecerá en el estado.
   */
  public setTipoCaat(tipoCaat: string): void {
    this.update((state) => ({
      ...state,
      tipoCaat,
    }));
  }

  /**
   * Establece el valor de `tipoProgFomExp` en el estado de la tienda.
   *
   * @param tipoProgFomExp - El nuevo valor para el campo `tipoProgFomExp`.
   */
  public setTipoProgFomExp(tipoProgFomExp: string): void {
    this.update((state) => ({
      ...state,
      tipoProgFomExp,
    }));
  }

  /**
   * Establece el tipo de tránsito en el estado de la tienda.
   *
   * @param tipoTransito - El nuevo valor para el tipo de tránsito.
   */
  public setTipoTransito(tipoTransito: string): void {
    this.update((state) => ({
      ...state,
      tipoTransito,
    }));
  }

  /**
   * Establece el número de establecimiento en el estado.
   *
   * @param numeroEstablecimiento - El nuevo número de establecimiento a asignar al estado.
   */
  public setNumeroEstablecimiento(numeroEstablecimiento: string): void {
    this.update((state) => ({
      ...state,
      numeroEstablecimiento,
    }));
  }

  /**
   * Actualiza el estado con el medio de transporte especificado.
   *
   * @param medioTransporte - El medio de transporte a establecer en el estado.
   */
  public setMedioTransporte(medioTransporte: string): void {
    this.update((state) => ({
      ...state,
      medioTransporte,
    }));
  }

  /**
   * Establece el nombre del banco en el estado.
   *
   * @param nombreBanco - El nombre del banco a asignar en el estado.
   */
  public setNombreBanco(nombreBanco: string): void {
    this.update((state) => ({
      ...state,
      nombreBanco,
    }));
  }

  /**
   * Establece el nombre del oficial autorizado en el estado.
   *
   * @param nomOficialAutorizado - El nombre del oficial autorizado que se va a asignar al estado.
   */
  public setNomOficialAutorizado(nomOficialAutorizado: string): void {
    this.update((state) => ({
      ...state,
      nomOficialAutorizado,
    }));
  }

  /**
   * Establece el valor de la empresa controladora en el estado.
   *
   * @param empresaControladora - El nombre o identificador de la empresa controladora a asignar.
   */
  public setEmpresaControladora(empresaControladora: string): void {
    this.update((state) => ({
      ...state,
      empresaControladora,
    }));
  }

  /**
   * Actualiza el estado con las nuevas observaciones proporcionadas.
   *
   * @param observaciones - Texto que contiene las observaciones a guardar en el estado.
   */
  public setObservaciones(observaciones: string): void {
    this.update((state) => ({
      ...state,
      observaciones,
    }));
  }

  /**
   * Actualiza la descripción del lugar de embarque en el estado.
   *
   * @param descripcionLugarEmbarque - Nueva descripción para el lugar de embarque.
   */
  public setDescripcionLugarEmbarque(descripcionLugarEmbarque: string): void {
    this.update((state) => ({
      ...state,
      descripcionLugarEmbarque,
    }));
  }

  /**
   * Actualiza el estado con una nueva actividad productiva.
   *
   * @param actividadProductiva - La actividad productiva que se va a establecer en el estado.
   */
  public setActividadProductiva(actividadProductiva: string): void {
    this.update((state) => ({
      ...state,
      actividadProductiva,
    }));
  }

  /**
   * Elimina un elemento de tipo FusionEscision del arreglo fusionEscisionData en el estado,
   * filtrando por el campo rfcBusquedaModal.
   *
   * @param fusionToRemove - El objeto FusionEscision que se desea eliminar del estado.
   */
  public removeFusionadoDato(fusionToRemove: FusionEscision): void {
    this.update((state) => {
      const INDICE_BORROR = state.fusionEscisionData.findIndex((ele) =>
        Object.entries(fusionToRemove).every(([key, value]) => ele[key as keyof FusionEscision] === value)
      );

      if (INDICE_BORROR !== -1) {
        state.fusionEscisionData.splice(INDICE_BORROR, 1);
      }

      return {
        ...state,
        fusionEscisionData: [...state.fusionEscisionData],
      };
    });
  }


  /**
   * Actualiza el estado agregando nuevos datos de fusión/escisión al arreglo existente.
   *
   * @param newFusion - Un arreglo de objetos `FusionEscision` que serán añadidos a los datos actuales de fusión/escisión.
   */
  public updateFusionDatos(newFusion: FusionEscision[]): void {
    this.update((state) => ({
      ...state,
      fusionEscisionData: [...state.fusionEscisionData, ...newFusion],
    }));
  }

  /**
      * Establece el estado de tipoFigura.
      * @param tipoFigura - El valor de tipoFigura.
      */
  public setTipoFigura(tipoFigura: string): void {
    this.update((state) => ({
      ...state,
      tipoFigura,
    }));
  }
  /**
   * Establece el estado de numPatenteModal.
   * @param numPatenteModal - El valor de numPatenteModal.
   */
  public setNumPatenteModal(numPatenteModal: string): void {
    this.update((state) => ({
      ...state,
      numPatenteModal,
    }));
  }
  /**
   * Establece el estado de obligFisc.
   * @param obligFisc - El valor de obligFisc.
   */
  public setObligFisc(obligFisc: string): void {
    this.update((state) => ({
      ...state,
      obligFisc,
    }));
  }
  /**
   * Establece el estado de autPantente.
   * @param autPantente - El valor de autPantente.
   */
  public setAutPantente(autPantente: string): void {
    this.update((state) => ({
      ...state,
      autPantente,
    }));
  }
  /**
   * Establece el estado de patente2.
   * @param patente2 - El valor de patente2.
   */
  public setPatente2(patente2: string): void {
    this.update((state) => ({
      ...state,
      patente2,
    }));
  }
  /**
   * Establece el estado de razonAgencia.
   * @param razonAgencia - El valor de razonAgencia.
   */
  public setRazonAgencia(razonAgencia: string): void {
    this.update((state) => ({
      ...state,
      razonAgencia,
    }));
  }

  /**
   * Actualiza la lista de datos de agentes en el estado agregando nuevos agentes.
   *
   * @param newAgente - Un arreglo de objetos de tipo `AvisoAgente` que serán añadidos a la lista existente de `agenteDatos`.
   */
  public updateAgenteDatos(newAgente: AvisoAgente[]): void {
    this.update((state) => ({
      ...state,
      agenteDatos: [...state.agenteDatos, ...newAgente],
    }));
  }
  public setTipoMovimiento(tipoMovimiento: string): void {
    this.update((state) => ({
      ...state,
      tipoMovimiento,
    }));
  }
  public setRazonSocial(razonSocial: string): void {
    this.update((state) => ({
      ...state,
      razonSocial,
    }));
  }
  /**
   * Elimina un agente específico de la lista `agenteDatos` en el estado.
   * 
   * Busca el agente proporcionado (`Agente`) en el arreglo `agenteDatos` comparando todas sus propiedades.
   * Si encuentra una coincidencia exacta, elimina ese agente del arreglo.
   * 
   * @param Agente - El objeto `AvisoAgente` que se desea eliminar de la lista.
   */
  public eliminarAgento(Agente: AvisoAgente): void {
    this.update((state) => {
      const INDICE_BORROR = state.agenteDatos.findIndex((ele) =>
        Object.entries(Agente).every(([key, value]) => ele[key as keyof AvisoAgente] === value)
      );

      if (INDICE_BORROR !== -1) {
        state.agenteDatos.splice(INDICE_BORROR, 1);
      }

      return {
        ...state,
        agenteDatos: [...state.agenteDatos],
      };
    });
  }

}
