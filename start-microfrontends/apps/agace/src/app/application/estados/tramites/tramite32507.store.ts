import { state } from '@angular/animations';
import {
  AvisoFormulario,
  AvisoTabla,
  DatosSolicitante,
} from '../../tramites/32507/models/aviso-traslado.model';
import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
import { UploadDocutoResponse } from '@ng-mf/data-access-user';

/**
 * @interface Tramite32507State
 * @description Representa el estado de la gestión del trámite 32507.
 *
 * @property {number} pasoActivo - Indica el paso activo en el flujo del trámite.
 * @property {number} pestanaActiva - Indica la pestaña activa en la interfaz del trámite.
 * @property {DatosSolicitante} datosSolicitante - Contiene los datos del solicitante.
 * @property {MercanciaFormulario} mercanciaFormulario - Contiene los datos del formulario de mercancía.
 * @property {DomicilioFormulario} domicilioFormulario - Contiene los datos del formulario de domicilio.
 * @property {AvisoFormulario} avisoFormulario - Contiene los datos del formulario de aviso.
 * @property {TipoDocumento[]} tipoTablaDatos - Lista de tipos de documentos disponibles.
 * @property {string} tipoDocumento - Tipo de documento seleccionado.
 * @property {ArchivoDocumentos[]} documentosDesplegable - Lista de documentos disponibles en el desplegable.
 * @property {string[]} valorSeleccionado - Valores seleccionados en el formulario.
 */
export interface Tramite32507State {
  datosSolicitante: DatosSolicitante;
  avisoFormulario: AvisoFormulario;
  tablaDeDatos: AvisoTabla[];
  listadoDocsAlmacenados: UploadDocutoResponse[];
}
/**
 * Estado inicial del trámite 32507.
 *
 * Esta función define el estado inicial del trámite, incluyendo datos del solicitante,
 * formulario de mercancías, formulario de domicilio, formulario de aviso, y otros datos relacionados.
 *
 * @returns {Tramite32507State} El estado inicial del trámite.
 *
 *
 */
export function createInitialState(): Tramite32507State {
  return {
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
      adace: '',
      cveEntidadFederativa: '',
      tipoPersona: ''
    },

    avisoFormulario: {
      idSolicitud: '',
      adace: '',
      valorProgramaImmex: '',
      valorAnioProgramaImmex: '',
      tipoBusqueda: '',
      levantaActa: '',
      levantaActaClave: '',
      cveUnidadAdministrativa: '',
      tipoAviso: '',
      idTransaccion: '',
      motivoProrroga: '',
      fechaTranslado: '',
      nombreComercial: '',
      claveEntidadFederativa: '',
      claveDelegacionMunicipio: '',
      claveColonia: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      codigoPostal: '',
      tipoCarga: '',
      siIdTransaccion: '',
      transaccionId: '',
      cantidad: '',
      peso: '',
      unidadMedida: '',
      descripcion: '',
    },
    tablaDeDatos: [],
    listadoDocsAlmacenados: [],
  };
}
/**
 * Store para gestionar el estado del trámite 32507.
 *
 * Este store utiliza Akita para manejar el estado del trámite, permitiendo actualizar y consultar
 * diferentes propiedades relacionadas con el trámite.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite32507', resettable: true })
export class Tramite32507Store extends Store<Tramite32507State> {
  /**
   * Constructor del store.
   *
   * Inicializa el store con el estado inicial definido en `createInitialState`.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el paso activo del trámite.
   *
   * @param {number} pasoActivo - El número del paso activo.
   */
  public setPasoActivo(pasoActivo: number): void {
    this.update((state) => ({
      ...state,
      pasoActivo,
    }));
  }

  /**
   * Actualiza el tipo de documento seleccionado.
   *
   * @param {string} tipoDocumento - El tipo de documento seleccionado.
   */
  public setTipoDocumento(tipoDocumento: string): void {
    this.update((state) => ({
      ...state,
      tipoDocumento,
    }));
  }

  /**
   * Actualiza los valores seleccionados.
   *
   * @param {string[]} valorSeleccionado - Lista de valores seleccionados.
   */
  public setValorSeleccionado(valorSeleccionado: string[]): void {
    this.update((state) => ({
      ...state,
      valorSeleccionado,
    }));
  }

  /**
   * Actualiza la pestaña activa del trámite.
   *
   * @param {number} pestanaActiva - El número de la pestaña activa.
   */
  public setPestanaActiva(pestanaActiva: number): void {
    this.update((state) => ({
      ...state,
      pestanaActiva,
    }));
  }
  /**
   * Actualiza los datos del solicitante en el estado.
   *
   * @param {DatosSolicitante} datosSolicitante - Objeto que contiene los datos del solicitante.
   */
  public setDatosSolicitante(datosSolicitante: DatosSolicitante): void {
    this.update((state) => ({
      ...state,
      datosSolicitante,
    }));
  }

  /**
   * Actualiza el valor de ADACE en el formulario de aviso.
   *
   * @param {string} adace - El valor de ADACE.
   */
  public setAvisoFormularioAdace(adace: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, adace },
    }));
  }

  /**
   * Actualiza el valor de cve unidad administratriva en el formulario de aviso.
   *
   * @param {string} cveUnidadAdministrativa - El valor de cve unidad administratriva.
   */
  public setCveUnidadAdministrativa(cveUnidadAdministrativa: string): void {
    this.update((state) =>({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, cveUnidadAdministrativa}
    }));
  }

  /**
   * Actualiza el valor del programa IMMEX en el formulario de aviso.
   *
   * @param {string} valorProgramaImmex - El valor del programa IMMEX.
   */
  public setAvisoFormularioValorProgramaImmex(
    valorProgramaImmex: string
  ): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, valorProgramaImmex },
    }));
  }
  /**
   * Actualiza el valor del año del programa IMMEX en el formulario de aviso.
   *
   * @param {string} valorAnioProgramaImmex - El valor del año del programa IMMEX.
   */
  public setAvisoFormularioValorAnioProgramaImmex(
    valorAnioProgramaImmex: string
  ): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, valorAnioProgramaImmex },
    }));
  }

  /**
   * Actualiza el tipo de aviso en el formulario de aviso.
   *
   * @param {string} tipoAviso - El tipo de aviso.
   */
  public setAvisoFormularioTipoAviso(tipoAviso: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, tipoAviso },
    }));
  }

  /**
   * Actualiza el ID de la transacción en el formulario de aviso.
   *
   * @param {string} idTransaccion - El ID de la transacción.
   */
  public setAvisoFormularioTransaccion(idTransaccion: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, idTransaccion },
    }));
  }

  /**
   * Actualiza el motivo de la prórroga en el formulario de aviso.
   *
   * @param {string} motivoProrroga - El motivo de la prórroga.
   */
  public setAvisoFormularioMotivoProrroga(motivoProrroga: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, motivoProrroga },
    }));
  }

  /**
   * Actualiza la fecha de traslado en el formulario de aviso.
   *
   * @param {string} fechaTranslado - La fecha de traslado.
   */
  public setAvisoFormularioFechaTranslado(fechaTranslado: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, fechaTranslado },
    }));
  }

  /**
   * Actualiza el nombre comercial en el formulario de aviso.
   *
   * @param {string} nombreComercial - El nombre comercial.
   */
  public setAvisoFormularioNombreComercial(nombreComercial: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, nombreComercial },
    }));
  }

  /**
   * Actualiza el tipo de búsqueda en el formulario de aviso.
   *
   * @param {string} tipoBusqueda - El tipo de búsqueda seleccionado.
   */
  public setAvisoFormularioTipoBusqueda(tipoBusqueda: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, tipoBusqueda },
    }));
  }

  /**
   * Actualiza la entidad que levanta el acta en el formulario de aviso.
   *
   * @param {string} levantaActa - La entidad que levanta el acta.
   */
  public setAvisoFormularioLevantaActa(levantaActa: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, levantaActa },
    }));
  }

  /**
   * Actualiza la clave de la entidad que levanta el acta en el formulario de aviso.
   *
   * @param {string} levantaActaClave - La clave/ID de la entidad que levanta el acta.
   */
  public setAvisoFormularioLevantaActaClave(levantaActaClave: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, levantaActaClave },
    }));
  }

  /**
   * Actualiza la unidad de medida en el formulario de aviso.
   *
   * @param {string} unidadMedida - La unidad de medida seleccionada.
   */
  public setAvisoFormularioUnidadMedida(unidadMedida: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, unidadMedida },
    }));
  }

  /**
   * Actualiza la descripción en el formulario de aviso.
   *
   * @param {string} descripcion - La descripción del producto o mercancía.
   */
  public setAvisoFormularioDescripcion(descripcion: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, descripcion },
    }));
  }

  /**
   * Actualiza la clave de la entidad federativa en el formulario de aviso.
   *
   * @param {string} claveEntidadFederativa - La clave de la entidad federativa.
   */
  public setAvisoFormularioEntidadFederativa(
    claveEntidadFederativa: string
  ): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, claveEntidadFederativa },
    }));
  }

  /**
   * Actualiza la clave de la delegación o municipio en el formulario de aviso.
   *
   * @param {string} claveDelegacionMunicipio - La clave de la delegación o municipio.
   */
  public setAvisoFormularioDelegacionMunicipio(
    claveDelegacionMunicipio: string
  ): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, claveDelegacionMunicipio },
    }));
  }

  /**
   * Actualiza la clave de la colonia en el formulario de aviso.
   *
   * @param {string} claveColonia - La clave de la colonia.
   */
  public setAvisoFormularioColonia(claveColonia: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, claveColonia },
    }));
  }
  /**
   * Actualiza la calle en el formulario de aviso.
   *
   * @param {string} calle - La calle del aviso.
   */
  public setAvisoFormularioCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, calle },
    }));
  }

  /**
   * Actualiza el número exterior en el formulario de aviso.
   *
   * @param {string} numeroExterior - El número exterior del aviso.
   */
  public setAvisoFormularioNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, numeroExterior },
    }));
  }

  /**
   * Actualiza el número interior en el formulario de aviso.
   *
   * @param {string} numeroInterior - El número interior del aviso.
   */
  public setAvisoFormularioNumeroInterior(numeroInterior: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, numeroInterior },
    }));
  }

  /**
   * Actualiza el código postal en el formulario de aviso.
   *
   * @param {string} codigoPostal - El código postal del aviso.
   */
  public setAvisoFormularioCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, codigoPostal },
    }));
  }

  /**
   * Actualiza el tipo de carga en el formulario de aviso.
   *
   * @param {string} tipoCarga - El tipo de carga del aviso.
   */
  public setAvisoFormularioTipoCarga(tipoCarga: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, tipoCarga },
    }));
  }

  /**
   * Actualiza el valor siIdTransaccion
   * @param siIdTransaccion
   */
  public setSiIdTransaccion(siIdTransaccion: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, siIdTransaccion },
    }));
  }

 /**
 * Actualiza el ID de la transacción en el formulario de aviso.
 *
 * @param {string} transaccionId - El identificador único de la transacción.
 */
public setAvisoFormularioTransaccionId(transaccionId: string): void {
  this.update((state) => ({
    ...state,
    avisoFormulario: { ...state.avisoFormulario, transaccionId },
  }));
}

/**
 * Actualiza la cantidad en el formulario de aviso.
 *
 * @param {string} cantidad - La cantidad especificada en el aviso.
 */
public setAvisoFormularioCantidad(cantidad: string): void {
  this.update((state) => ({
    ...state,
    avisoFormulario: { ...state.avisoFormulario, cantidad },
  }));
}

/**
 * Actualiza el peso en el formulario de aviso.
 *
 * @param {string} peso - El peso de la mercancía en el aviso.
 */
public setAvisoFormularioPeso(peso: string): void {
  this.update((state) => ({
    ...state,
    avisoFormulario: { ...state.avisoFormulario, peso },
  }));
}

  /**
   * Actualiza la tabla de datos (avisos) en el estado.
   *
   * @param {AvisoTabla[]} tablaDeDatos - Array con los datos de la tabla de avisos.
   */
  public setTablaDeDatos(tablaDeDatos: AvisoTabla[]): void {
    this.update((state) => ({
      ...state,
      tablaDeDatos,
    }));
  }

  /**
   * Actualiza el id de la solicitud
   */
  public setAvisoFormularioIdSolicitud(idSolicitud: string): void {
    this.update((state) => ({
      ...state,
      avisoFormulario: { ...state.avisoFormulario, idSolicitud}
    }));
  }

  /**
   * Actualiza el listado de documentos almacenados.
   *
   * @param {UploadDocutoResponse[]} listadoDocsAlmacenados - Array de documentos que fueron cargados exitosamente.
   */
  public setListadoDocsAlmacenados(listadoDocsAlmacenados: UploadDocutoResponse[]): void {
    this.update((state) => ({
      ...state,
      listadoDocsAlmacenados
    }));
  }

}
