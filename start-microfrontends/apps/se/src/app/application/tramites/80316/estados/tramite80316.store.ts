import {
  Anexo,
  Complimentaria,
  DatosCertificacion,
  DatosDeLaTabla,
  DatosModificacion,
  DatosSolicitante,
  Empresas,
  Federetarios,
  FraccionSensible,
  Operacions,
  Plantas,
  Servicios,
} from '../models/datos-tramite.model';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Representa el estado de la solicitud 80316.
 */
export interface Solicitud80316State {
  /**
   * Datos del solicitante.
   */
  datosSolicitante: DatosSolicitante;

  /**
   * Lista de plantas a dar de alta.
   */
  altaPlanta: Catalogo[];

  /**
   * Estado seleccionado.
   */
  estado: Catalogo;

  /**
   * Estado de validación del formulario.
   * Las claves son los nombres de los campos y los valores indican si son válidos.
   */
  formaValida: { [key: string]: boolean };

  /**
   * RFC del solicitante.
   */
  rfc: string;

  /**
   * Información federal del solicitante.
   */
  federal: string;

  /**
   * Tipo de trámite.
   */
  tipo: string;

  /**
   * Programa seleccionado.
   */
  programa: string;

  /**
   * Actividad actual del solicitante.
   */
  actividadActual: string;

  /**
   * Lista de actividades productivas.
   */
  actividadProductiva: string;

  /**
   * Tipo de persona seleccionada.
   */
  tipoDePersona: Catalogo[] | null;

  /**
   * RFC del importador/exportador.
   */
  RFCImpExp: string;

  /**
   * Fecha de inicio del trámite.
   */
  fechaInicio: string;

  /**
   * Fecha de vigencia del trámite.
   */
  fechaVigencia: string;

  /**
   * Estado de certificación.
   */
  certificion: string;

  /**
 * Indica si se ha activado la acción de continuar.
 */
  isContinuarTriggered?: boolean;
  /** ID de la solicitud. */
   idSolicitud: number;

     /**
   * Tipo de programa seleccionado.
   */
  selectedTipoPrograma: string;

  /**
   * ID del programa seleccionado.
   */
  selectedIdPrograma: string;
   /**
      * Lista de socios accionistas.
      */
     sociosAccionistas: Complimentaria[];
       /**
   * ID de la solicitud buscada.
   * @type {string[]}
   */
  buscarIdSolicitud?: string[];
  /**
   * RFC de inicio de sesión.
   */
    loginRfc: string;
      /**
   * Folio del programa seleccionado.
   */
  selectedFolioPrograma: string;
    /**
     * Lista de datos del programa.
     */
    programaListaDatos: DatosDeLaTabla[];

     /**
       * Datos de los notarios.
       */
      notarios: Federetarios[];
/**
 * Datos de las operaciones.
 */
      operaciones: Operacions[];
      /**
       * Datos de las empresas.
       */
      empresas: Empresas[];
      /** Datos de las plantas. */
      plantas: Plantas[];
      /** Datos de los servicios. */
      servicios: Servicios[];
      /** Datos de la certificación SAT. */
      certificacionSAT: string;
      /**
       * Datos de los fraccionesExportacion
       */
        fraccionesExportacion: Anexo[];
        /**
         * Datos de los fraccionesImportacion 
         */
        fraccionesImportacion: Anexo[];
        /**
         * Datos de las fracciones sensibles
         */
        fraccionesSensibles: FraccionSensible[];
/**
 * Datos de la certificación LSAT.
 */
        certificacionLSAT: DatosCertificacion[];

}

/**
 * Crea el estado inicial de la solicitud 80316.
 *
 * @returns {Solicitud80316State} - Estado inicial de la solicitud.
 */
export function createInitialState(): Solicitud80316State {
  return {
    datosSolicitante: {
      rfc: '',
      denominacion: '',
      actividadEconomica: '',
      correoElectronico: '',
    },
    rfc: '',
    federal: '',
    tipo: '',
    programa: '',
    actividadActual: '',
    actividadProductiva: '',
    tipoDePersona: null,
    RFCImpExp: '',
    altaPlanta: [],
    estado: {
      id: -1,
      descripcion: '',
    },
    formaValida: {
      entidadFederativa: false,
    },
    fechaInicio: '',
    fechaVigencia: '',
    certificion: '',
    isContinuarTriggered: false,
    idSolicitud: 0,
    selectedTipoPrograma: '',
    selectedIdPrograma: '',
    sociosAccionistas: [],
    buscarIdSolicitud: [],
    loginRfc: '',
    selectedFolioPrograma: '',
    programaListaDatos: [],
     notarios: [],
      operaciones: [],
      empresas: [],
      plantas: [],
      servicios: [],
      certificacionSAT: '',
      fraccionesExportacion: [],
      fraccionesImportacion: [],
      fraccionesSensibles: [],
      certificacionLSAT: []
  
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite80316', resettable: true })
export class Tramite80316Store extends Store<Solicitud80316State> {
  /**
   * Constructor de la clase `Tramite80316Store`.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece las actividades productivas en el estado.
   *
   * @param {Catalogo[]} actividadProductiva - Lista de actividades productivas.
   */
  public setActividadProductiva(actividadProductiva: string): void {
    this.update((state) => ({
      ...state,
      actividadProductiva,
    }));
  }

  /**
   * Establece el estado seleccionado en el almacén.
   *
   * @param {Catalogo} estado - Estado a establecer.
   */
  public setEstado(estado: Catalogo): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Establece las plantas a dar de alta en el estado.
   *
   * @param {Catalogo[]} altaPlanta - Lista de plantas.
   */
  public setaltaPlanta(altaPlanta: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      altaPlanta,
    }));
  }

  /**
   * Establece el estado de validación del formulario.
   *
   * @param {Object} formaValida - Objeto con los estados de validación de los campos.
   */
  public setFormValida(formaValida: { [key: string]: boolean }): void {
    this.update((state) => {
      const IS_VALID = { ...state.formaValida, ...formaValida };
      return {
        ...state,
        formaValida: IS_VALID,
      };
    });
  }

  /**
   * Establece los datos del solicitante en el estado.
   *
   * @param {DatosSolicitante} datosSolicitante - Datos del solicitante.
   */
  public setDatosSolicitante(datosSolicitante: DatosSolicitante): void {
    this.update((state) => ({
      ...state,
      datosSolicitante,
    }));
  }

  /**
   * Establece los datos de modificación en el estado.
   *
   * @param {DatosModificacion} datosModificacion - Datos de modificación.
   */
  public setDatosModificacion(datosModificacion: DatosModificacion): void {
    this.update((state) => ({
      ...state,
      datosModificacion,
    }));
  }

  /**
   * Establece los datos de certificación en el estado.
   *
   * @param {DatosCertificacion} datosCertificacion - Datos de certificación.
   */
  public setDatosCertificacion(datosCertificacion: DatosCertificacion): void {
    this.update((state) => ({
      ...state,
      datosCertificacion,
    }));
  }

  /**
   * Establece el tipo de búsqueda en el estado.
   *
   * @param {string} tipoBusqueda - Tipo de búsqueda.
   */
  public setTipoBusqueda(tipoBusqueda: string): void {
    this.update((state) => ({
      ...state,
      tipoBusqueda,
    }));
  }

  /**
   * Establece el tipo de persona en el estado.
   *
   * @param {Catalogo[]} tipoDePersona - Lista de tipos de persona.
   */
  public setTipoDePersona(tipoDePersona: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      tipoDePersona,
    }));
  }

  /**
   * Establece el RFC del importador/exportador en el estado.
   *
   * @param {string} RFCImpExp - RFC del importador/exportador.
   */
  public setRFCImpExp(RFCImpExp: string): void {
    this.update((state) => ({
      ...state,
      RFCImpExp,
    }));
  }

  /**
   * Establece la fecha de inicio en el estado.
   *
   * @param {string} fechaInicio - Fecha de inicio.
   */
  public setFechaInicio(fechaInicio: string): void {
    this.update((state) => ({
      ...state,
      fechaInicio,
    }));
  }

  /**
   * Establece la fecha de vigencia en el estado.
   *
   * @param {string} fechaVigencia - Fecha de vigencia.
   */
  public setFechaVigencia(fechaVigencia: string): void {
    this.update((state) => ({
      ...state,
      fechaVigencia,
    }));
  }

  /**
   * Establece el estado de certificación en el estado.
   *
   * @param {string} certificion - Estado de certificación.
   */
  public setCertificion(certificion: string): void {
    this.update((state) => ({
      ...state,
      certificion,
    }));
  }

    /**
   * Actualiza el estado de si se ha activado la acción de continuar.
   * @param isContinuarTriggered Indica si la acción de continuar ha sido activada.
   */
  public setContinuarTriggered(isContinuarTriggered: boolean): void {
    this.update((state) => ({
      ...state,
      isContinuarTriggered: isContinuarTriggered,
    }));
  }

/** Establece el ID de la solicitud en el estado actual. */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({ ...state, idSolicitud }));
  }

  /**
   * Establece el tipo de programa seleccionado en el estado.
   * 
   * @param selectedTipoPrograma - El tipo de programa seleccionado.
   */
  public setSelectedTipoPrograma(selectedTipoPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedTipoPrograma,
    }));
  }

  /**
   * Establece el ID del programa seleccionado en el estado.
   *
   * @param selectedIdPrograma - El ID del programa seleccionado.
   */
  public setSelectedIdPrograma(selectedIdPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedIdPrograma,
    }));
  }
  /**
   * Establece la lista de socios accionistas en el estado.
   * @param sociosAccionistas 
   */
  public setSociosAccionistas(sociosAccionistas: Complimentaria[]): void {
    this.update((state) => ({
      ...state,
      sociosAccionistas,
    }));
  }

    /**
   * Establece el ID de la solicitud buscada en el estado.
   *
   * @param buscarIdSolicitud - El ID de la solicitud buscada a establecer en el estado.
   */
  public setBuscarIdSolicitud(buscarIdSolicitud: string[]): void {
    this.update((state) => ({
      ...state,
      buscarIdSolicitud,
    }));
  }

   /**
   * Establece el RFC de inicio de sesión en el estado.
   *
   * @param loginRfc - RFC del usuario que ha iniciado sesión.
   */
  public setLoginRfc(loginRfc: string): void {
    this.update((state) => ({
      ...state,
      loginRfc,
    }));
  }

   /**
   * Establece el folio del programa seleccionado en el estado.
   *
   * @param selectedFolioPrograma - El folio del programa seleccionado.
   */
  public setSelectedFolioPrograma(selectedFolioPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedFolioPrograma,
    }));
  }
  
   /**
     * Establece la lista de datos del programa en el estado.
     * 
     * @param programaListaDatos - Arreglo de objetos ProgramaLista que representan la lista de datos del programa.
     */
    public setProgramaListaDatos(programaListaDatos: DatosDeLaTabla[]): void {
      this.update((state) => ({
        ...state,
        programaListaDatos,
      }));
    }

   /**
      * Establece los notarios en el estado.
      *
      * @param notarios - Arreglo de objetos Federetarios que representan los notarios.
      */
     public setNotarios(notarios: Federetarios[]): void {
       this.update((state) => ({
         ...state,
         notarios,
       }));
     }

     /**
      * Establece las operaciones en el estado.
      * @param operaciones 
      */
     public setOperaciones(operaciones: Operacions[]): void {
      this.update((state) => ({
        ...state,
        operaciones,
      }));
    }
/**
 * Establece las empresas en el estado.
 * @param empresas 
 */
    public setEmpresas(empresas: Empresas[]): void {
      this.update((state) => ({
        ...state,
        empresas,
      }));
    }

    /**
     * Establece las plantas en el estado. 
     * @param plantas 
     */
    public setPlantas(plantas: Plantas[]): void {
      this.update((state) => ({
        ...state,
        plantas,
      }));
    }

    /**
     * Establece los servicios en el estado.
     * @param servicios
     */
    public setServicios(servicios: Servicios[]): void {
      this.update((state) => ({
        ...state,
        servicios,
      }));
    }

    public setCertificacionSAT(certificacionSAT: string): void {
      this.update((state) => ({
        ...state,
        certificacionSAT,
      }));
    }

    public setFraccionesExportacion(fraccionesExportacion: Anexo[]): void {
      this.update((state) => ({
        ...state,
        fraccionesExportacion,
      }));
    }

    public setFraccionesImportacion(fraccionesImportacion: Anexo[]): void {
      this.update((state) => ({
        ...state,
        fraccionesImportacion,
      }));
    }

    public setFraccionesSensibles(fraccionesSensibles: FraccionSensible[]): void {
      this.update((state) => ({
        ...state,
        fraccionesSensibles,
      }));
    }

    public setCertificacionLSAT(certificacionLSAT: DatosCertificacion[]): void {
      this.update((state) => ({
        ...state,
        certificacionLSAT,
      }));
    }
  /**
   * Limpia el estado de la solicitud.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
