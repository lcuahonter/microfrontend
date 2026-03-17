import { DatosSolicitud, Mercancia, MercanciaTablaDatos } from "../../tramites/130401/models/modificacion-descripcion.model";
import { Injectable } from "@angular/core";
import { Store } from "@datorama/akita";
import { StoreConfig } from "@datorama/akita";


/**
 * Interfaz que define el estado del trámite 130401.
 * 
 * Esta interfaz incluye las propiedades necesarias para gestionar el estado del trámite,
 * como el paso activo, la pestaña activa, el folio de permiso, los datos de la solicitud
 * y los datos de la mercancía.
 */
export interface Tramite130401State {

  /** 
   * Identificador de la solicitud o null si no existe 
   */
  idSolicitud: number | null;

  /**
   * Paso activo del trámite.
   * 
   * Indica el número del paso actual en el flujo del trámite.
   */
  pasoActivo: number;

  /**
   * Pestaña activa del trámite.
   * 
   * Indica el índice de la pestaña activa en el flujo del trámite.
   */
  pestanaActiva: number;

  /**
   * Folio de permiso del trámite.
   * 
   * Representa el folio de permiso asociado al trámite.
   */
  folioPermiso: string;

  /**
   * Datos de la solicitud.
   * 
   * Contiene información detallada sobre la solicitud del trámite.
   */
  datosSolicitud: DatosSolicitud;

  /**
   * Datos de la mercancía.
   * 
   * Contiene información detallada sobre la mercancía asociada al trámite.
   */
  mercancia: Mercancia;
  /**
   * Datos de la tabla de mercancías.
   */
  mercanciaTablaDatos: MercanciaTablaDatos[];

  /**
 * Campo que almacena la descripción solicitada para la mercancía.
 *
 * Este valor representa el texto ingresado o modificado por el usuario
 * en el formulario de modificación de mercancías.
 *
 * @type {string}
 */
  descipcionSolicitada: string;
}

/**
 * Función para crear el estado inicial del trámite 130401.
 * 
 * Esta función devuelve un objeto con los valores predeterminados para el estado del trámite.
 * 
 * @returns {Tramite130401State} El estado inicial del trámite.
 */
export function createInitialState(): Tramite130401State {
  return {
    idSolicitud: 0,
    pasoActivo: 1,
    pestanaActiva: 1,
    folioPermiso: '',
    datosSolicitud: {
      numeroFolioTramiteOriginal: '',
      numeroFolioResolucion: '',
      tramite: {
        solicitud: false
      },
      tipoSolicitudPexim: 'TISOL.M',
      mercancia: '',
      mercanciaResponseDto: {
        tipoSolicitudPexim: 'TISOL.M',
        regimen: '',
        clasificacionRegimen: '',
        condicionMercancia: 'CONDMER.N',
        descripcion: '',
        fraccionArancelaria: '',
        unidadMedidaTarifaria: '',
        unidadesAutorizadas: '',
        importeFacturaAutorizadoUSD: ''
      },
      solicitud: '',
      clasificacionRegimen: '',
      condicionMercancia: 'CONDMER.N',
      mercanciaDescripcion: '',
      fraccionArancelaria: '',
      unidadMedidaTarifaria: '',
      unidadesAutorizadas: '',
      importeFacturaAutorizadoUSD: '',
      usoEspecifico: '',
      justificacionImportacionExportacion: '',
      observaciones: '',
      representacionFederal: '',
      paises: '',
      partidasMercancia: [],
      partidasModificationDescripcion: []
    },
    mercancia: {
      numeroFolioResolucion: '',
      cantidadLibreMercancia: '',
      descripcion: '',
      descripcionNuevaMercanciaPexim: '',
    },
    mercanciaTablaDatos: [],
    descipcionSolicitada: ''
  };
}

/**
 * Store para gestionar el estado del trámite 130401.
 * 
 * Este store utiliza Akita para manejar el estado global del trámite, incluyendo
 * información como el paso activo, pestaña activa, folio de permiso, datos de la solicitud
 * y datos de la mercancía.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite130401', resettable: true })
export class Tramite130401Store extends Store<Tramite130401State> {

  /**
   * Constructor del store.
   * 
   * Inicializa el estado con los valores predeterminados definidos en `createInitialState`.
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
   * Actualiza la pestaña activa del trámite.
   * 
   * @param {number} pestanaActiva - El índice de la pestaña activa.
   */
  public setPestanaActiva(pestanaActiva: number): void {
    this.update((state) => ({
      ...state,
      pestanaActiva,
    }));
  }

  /**
   * Actualiza el folio de permiso del trámite.
   * 
   * @param {string} folioPermiso - El folio de permiso.
   */
  public setFolioPermiso(folioPermiso: string): void {
    this.update((state) => ({
      ...state,
      folioPermiso,
    }));
  }

  /**
   * Actualiza los datos de la solicitud.
   * 
   * @param {DatosSolicitud} datosSolicitud - Los datos de la solicitud.
   */
  public setSolicitud(datosSolicitud: DatosSolicitud): void {
    this.update((state) => ({
      ...state,
      datosSolicitud,
    }));
  }

  /**
   * Actualiza los datos de la mercancía.
   * 
   * @param {Mercancia} mercancia - Los datos de la mercancía.
   */
  public setMercancia(mercancia: Mercancia): void {
    this.update((state) => ({
      ...state,
      mercancia,
    }));
  }

  /**
   * Actualiza la descripción de modificación de la mercancía.
   * 
   * @param {string} descripcionModificacion - La nueva descripción de modificación.
   */
  public setDescripcionModificacion(descripcionModificacion: string): void {
    this.update((state) => ({
      ...state,
      mercancia: { ...state.mercancia, descripcionModificacion },
    }));
  }

  /**
   * Actualiza la descripción nueva de mercancía PEXIM en datosSolicitud.
   * 
   * @param {string} descripcionNuevaMercanciaPexim - La nueva descripción PEXIM.
   */
  public setDescripcionNuevaMercanciaPexim(descripcionNuevaMercanciaPexim: string): void {
    this.update((state) => ({
      ...state,
      datosSolicitud: {
        ...state.datosSolicitud,
        modificationDescripcion: {
          numeroFolioResolucion: state.datosSolicitud.modificationDescripcion?.numeroFolioResolucion || '',
          cantidadLibreMercancia: state.datosSolicitud.modificationDescripcion?.cantidadLibreMercancia || '',
          descripcion: state.datosSolicitud.modificationDescripcion?.descripcion || '',
          descripcionNuevaMercanciaPexim
        }
      }
    }));
  }
  /**
   * Actualiza los datos de la tabla de mercancías en el estado del trámite.
   * 
   * Este método permite establecer los datos de la tabla de mercancías en el estado del trámite.
   * 
   * @param {MercanciaTablaDatos[]} mercanciaTablaDatos - Lista de datos de mercancías que se mostrarán en la tabla.
   */
  public setMercanciaTablaDatos(mercanciaTablaDatos: MercanciaTablaDatos[]): void {
    this.update((state) => ({
      ...state,
      mercanciaTablaDatos,
    }));
  }

  /**
   * Establece la descripción solicitada en el estado de la mercancía.
   *
   * Este método actualiza el `state` interno del store agregando o
   * modificando la propiedad `descripcionSolicitada`.
   *
   * @param descripcionSolicitada - Texto de la descripción solicitada para la mercancía.
   */
  public setDescripcionSolicitada(descipcionSolicitada: string): void {
    this.update((state) => ({
      ...state,
      descipcionSolicitada,
    }));
  }

  /**
   * Guarda el ID de la solicitud en el estado.
   *
   * @param idSolicitud - El ID de la solicitud que se va a guardar.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * Actualiza los datos de la solicitud en el estado.
   */
  public setDatosSolicitud(response: DatosSolicitud): void {
    this.update((state) => ({
      ...state,
      datosSolicitud: response,
    }));
  }
}