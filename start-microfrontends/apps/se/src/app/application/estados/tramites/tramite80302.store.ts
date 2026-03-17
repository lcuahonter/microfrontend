/**
 * @fileoverview Store de gestión de estado para el trámite 80302
 * @description Este archivo contiene el store principal que maneja todo el estado
 * de la aplicación para el trámite 80302, incluyendo datos de solicitud,
 * información de contenedores, modificaciones y operaciones IMMEX
 * @author Sistema VUCEM
 * @version 1.0.0
 * @since 2024
 */

import { DatosModificacion, DatosSolicitante } from '../../tramites/80302/estados/models/datos-tramite.model';
import { Injectable } from '@angular/core';
import { Store, } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
import { AnexoImportacion, BitacoraModificacion, DatosSocioAccionista, Notario, OperacionsImmex, Planta, ProductoExportacion } from '../../tramites/80302/estados/models/plantas-consulta.model';
import { ProgramaLista } from '../../tramites/80302/estados/models/payload.model';

/**
 * Interfaz que representa el estado completo de la solicitud del trámite 80302
 * @interface Solicitud80302State
 * @description Define la estructura completa del estado de una solicitud del trámite 80302,
 * incluyendo todos los datos necesarios para el proceso de modificación de programas IMMEX
 */
export interface Solicitud80302State {
  /** 
   * Identificador único de la solicitud
   * @type {number | null}
   * @description ID de la solicitud, puede ser nulo si aún no se ha creado
   */
  idSolicitud: number | null;
  
  /**
   * Valor del menú desplegable seleccionado
   * @type {string}
   * @description Opción actualmente seleccionada en el menú desplegable principal
   */
  menuDesplegable: string;

  /**
   * Información completa del solicitante
   * @type {DatosSolicitante}
   * @description Datos personales y de contacto del solicitante del trámite
   */
  datosSolicitante: DatosSolicitante;

  /**
   * Datos relacionados con la modificación del programa
   * @type {DatosModificacion}
   * @description Información específica sobre las modificaciones solicitadas
   */
  datosModificacion: DatosModificacion;

  /**
   * Lista de plantas y sus modificaciones
   * @type {Planta[]}
   * @description Array con datos de plantas industriales y sus modificaciones
   */
  modificacionDatos: Planta[];

  /** 
   * Lista de socios y accionistas
   * @type {DatosSocioAccionista[]}
   * @description Array con información de socios y accionistas de la empresa
   */
  datosComplimentaria: DatosSocioAccionista[];

  /** 
   * Lista de notarios federales
   * @type {Notario[]}
   * @description Array con información de notarios federales involucrados
   */
  datosFederetarios: Notario[];

  /** 
   * Lista de operaciones IMMEX
   * @type {OperacionsImmex[]}
   * @description Array con datos detallados de operaciones IMMEX
   */
  datosOperacions: OperacionsImmex[];

  /** 
   * Lista de productos de exportación
   * @type {ProductoExportacion[]}
   * @description Array con información de productos destinados a exportación
   */
  datosAnexo: ProductoExportacion[];

  /** 
   * Lista de productos de importación
   * @type {AnexoImportacion[]}
   * @description Array con datos de anexos de importación
   */
  datosImportacion: AnexoImportacion[];

  /** 
   * Registro de modificaciones realizadas
   * @type {BitacoraModificacion[]}
   * @description Array con el historial de modificaciones del sistema
   */
  datosBitacora: BitacoraModificacion[];

  /** 
   * Certificación del SAT
   * @type {string}
   * @description Valor de la certificación emitida por el Servicio de Administración Tributaria
   */
  certificacionSAT: string;

  /**
   * Datos de contenedores asociados
   * @type {any[]}
   * @description Lista de información de contenedores relacionados con la solicitud
   */
  datosDelContenedor: [];

  /**
   * Tipo de búsqueda seleccionada
   * @type {string}
   * @description Modalidad de búsqueda activa en el sistema
   */
  tipoBusqueda: string;

  /**
   * Aduana seleccionada
   * @type {string}
   * @description Código o nombre de la aduana seleccionada
   */
  aduana: string;

  /**
   * Fecha de ingreso del contenedor
   * @type {string}
   * @description Fecha en que el contenedor ingresó al recinto aduanero
   */
  fechaIngreso: string;

  /**
   * Iniciales del equipo contenedor
   * @type {string}
   * @description Código de iniciales del contenedor
   */
  inicialesContenedor: string;

  /**
   * Número identificador del contenedor
   * @type {string}
   * @description Número único asignado al contenedor
   */
  numeroContenedor: string;

  /**
   * Dígito verificador del contenedor
   * @type {string}
   * @description Dígito de control para validación del número de contenedor
   */
  digitoDeControl: string;

  /**
   * Lista de contenedores asociados
   * @type {string}
   * @description Contenedores relacionados con la operación
   */
  contenedores: string;

  /**
   * Opción seleccionada en menú de aduanas
   * @type {string}
   * @description Valor seleccionado en el menú desplegable de aduanas
   */
  aduanaMenuDesplegable: string;

  /**
   * Estado de casillas de verificación individuales
   * @type {boolean[]}
   * @description Array de estados booleanos para casillas de verificación
   */
  casillaDeVerificacionindividual: boolean[];

  /**
   * Número del manifiesto de carga
   * @type {number}
   * @description Número identificador del manifiesto
   */
  numeroManifiesta: number;

  /**
   * Fecha de ingreso del manifiesto
   * @type {string}
   * @description Fecha de registro del manifiesto en el sistema
   */
  fechaDeIngreso: string;

  /**
   * Archivo seleccionado por el usuario
   * @type {string}
   * @description Nombre o identificador del archivo seleccionado
   */
  archivoSeleccionado: string;

  /** 
   * Identificador de línea
   * @type {string}
   * @description Valor de la línea seleccionada o activa
   */
  linea: string;

  /**
   * Estado de checkbox de línea
   * @type {string}
   * @description Valor del checkbox asociado a la línea
   */
  lineaCheckbox: string;

  /**
   * Monto financiero asociado
   * @type {string}
   * @description Valor monetario relacionado con la solicitud
   */
  monto: string;

  /**
   * Tipo de programa seleccionado.
   */
  selectedTipoPrograma: string;

    /**
   * Lista de datos del programa.
   */
  programaListaDatos: ProgramaLista[];

  /**
   * Folio del programa seleccionado.
   */
  selectedFolioPrograma: string;

    /**
   * ID del programa seleccionado.
   */
  selectedIdPrograma: string;

   /**
   * RFC de inicio de sesión.
   * @type {string}
   */
  loginRfc: string;

}

/**
 * Función para crear el estado inicial de la solicitud 80302
 * @function createInitialState
 * @description Genera y retorna el estado inicial por defecto para una nueva solicitud
 * del trámite 80302, con todos los campos inicializados en valores vacíos o por defecto
 * @returns {Solicitud80302State} Objeto con el estado inicial de la solicitud
 */
export function createInitialState(): Solicitud80302State {
  return {
    idSolicitud: 0,
    menuDesplegable: '',
    datosSolicitante: {
      rfc: "",
      denominacion: "",
      actividadEconomica: "",
      correoElectronico: ""
    },
    datosModificacion: {
      rfc: "",
      federal: "",
      tipo: "",
      programa: ""
    },   
    modificacionDatos: [],
    datosComplimentaria: [],
    datosFederetarios: [],
    datosOperacions: [],
    datosAnexo: [],
    datosImportacion: [],
    datosBitacora: [],
    datosDelContenedor: [],
    certificacionSAT: '',
    tipoBusqueda: '',
    aduana: '',
    inicialesContenedor: '',
    numeroContenedor: '',
    digitoDeControl: '',
    contenedores: '',
    fechaIngreso: '',
    aduanaMenuDesplegable: '',
    casillaDeVerificacionindividual: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    numeroManifiesta: 0,
    fechaDeIngreso: '',
    archivoSeleccionado: '',
    linea: '',
    lineaCheckbox: '',
    monto: '',
    selectedTipoPrograma: '',
    programaListaDatos: [],
    selectedFolioPrograma: '',
    selectedIdPrograma: '',
    loginRfc: '',

  };
}

/**
 * Store principal para la gestión del estado del trámite 80302
 * @class Tramite80302Store
 * @description Clase que extiende Store de Akita para manejar el estado completo
 * de las solicitudes del trámite 80302, incluyendo operaciones CRUD y gestión
 * de datos de contenedores, plantas, socios y modificaciones
 * @extends {Store<Solicitud80302State>}
 * @author Sistema VUCEM
 * @version 1.0.0
 * @since 2024
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite80302', resettable: true })
export class Tramite80302Store extends Store<Solicitud80302State> {
  
  /**
   * Constructor del store del trámite 80302
   * @constructor
   * @description Inicializa el store con el estado inicial predefinido
   */
  constructor() {
    super(createInitialState());
  }
  /**
   * Establece el identificador de la solicitud en el estado
   * @method setIdSolicitud
   * @description Actualiza el ID de la solicitud en el estado del store
   * @param {number | null} idSolicitud - El identificador de la solicitud que se va a guardar
   * @returns {void}
   * @public
   */
  public setIdSolicitud(idSolicitud: number | null): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * Establece el estado de las casillas de verificación individuales
   * @method setCasillaDeVerificacionindividual
   * @description Actualiza el array de estados de casillas de verificación
   * @param {any[]} casillaDeVerificacionindividual - Array con los estados de las casillas
   * @returns {void}
   * @public
   */
  public setCasillaDeVerificacionindividual(casillaDeVerificacionindividual: []): void {
    this.update((state) => ({
      ...state,
      casillaDeVerificacionindividual,
    }));
  }

  /**
   * Establece el número de manifiesto en el estado
   * @method setNumeroManifiesta
   * @description Actualiza el número de manifiesta en el estado de la tienda
   * @param {number} numeroManifiesta - El número de manifiesta que se desea asignar
   * @returns {void}
   * @public
   */
  public setNumeroManifiesta(numeroManifiesta: number): void {
    this.update((state) => ({
      ...state,
      numeroManifiesta,
    }));
  }

  /**
   * Establece el valor del menú desplegable principal
   * @method setMenuDesplegable
   * @description Actualiza la selección del menú desplegable en el estado
   * @param {string} menuDesplegable - El nuevo valor para el menú desplegable
   * @returns {void}
   * @public
   */
  public setMenuDesplegable(menuDesplegable: string): void {
    this.update((state) => ({
      ...state,
      menuDesplegable,
    }));
  }

  /**
   * Establece el valor del menú desplegable de aduana
   * @method setAduanaMenuDesplegable
   * @description Actualiza la selección de aduana en el menú desplegable
   * @param {string} aduanaMenuDesplegable - El nuevo valor para el menú desplegable de aduana
   * @returns {void}
   * @public
   */
  public setAduanaMenuDesplegable(aduanaMenuDesplegable: string): void {
    this.update((state) => ({
      ...state,
      aduanaMenuDesplegable,
    }));
  }

  /**
   * Establece la fecha de ingreso del manifiesto
   * @method setFechaDeIngreso
   * @description Actualiza la fecha de ingreso en el estado de la tienda
   * @param {string} fechaDeIngreso - La nueva fecha de ingreso en formato de cadena
   * @returns {void}
   * @public
   */
  public setFechaDeIngreso(fechaDeIngreso: string): void {
    this.update((state) => ({
      ...state,
      fechaDeIngreso,
    }));
  }


  /**
   * Establece los datos del solicitante
   * @method setDatosSolicitante
   * @description Actualiza la información completa del solicitante en el estado
   * @param {DatosSolicitante} datosSolicitante - Objeto con la información del solicitante
   * @returns {void}
   * @public
   */
  public setDatosSolicitante(datosSolicitante: DatosSolicitante): void {
    this.update((state) => ({
      ...state,
      datosSolicitante
    }));
  }

  /**
   * Establece los datos de modificación del programa
   * @method setDatosModificacion
   * @description Actualiza los datos de modificación en el estado de la tienda
   * @param {DatosModificacion} datosModificacion - Objeto con los datos de modificación
   * @returns {void}
   * @public
   */
  public setDatosModificacion(datosModificacion: DatosModificacion): void {
    this.update((state) => ({
      ...state,
      datosModificacion
    }));
  }

  /**
   * Establece los datos de modificación de plantas
   * @method setModificacionDatos
   * @description Actualiza la lista de plantas con sus modificaciones
   * @param {Planta[]} modificacionDatos - Array con los datos de plantas modificadas
   * @returns {void}
   * @public
   */
  public setModificacionDatos(modificacionDatos: Planta[]): void {
    this.update((state) => ({
      ...state,
      modificacionDatos
    }));
  }

  /**
   * Establece los datos complementarios de socios
   * @method setDatosComplimentaria
   * @description Actualiza la información de socios y accionistas
   * @param {DatosSocioAccionista[]} datosComplimentaria - Array con datos de socios
   * @returns {void}
   * @public
   */
  public setDatosComplimentaria(datosComplimentaria: DatosSocioAccionista[]): void {
    this.update((state) => ({
      ...state,
      datosComplimentaria
    }));
  }

  /**
   * Establece los datos de notarios federales
   * @method setDatosFederatarios
   * @description Actualiza la información de notarios federales
   * @param {Notario[]} datosFederetarios - Array con datos de notarios
   * @returns {void}
   * @public
   */
  public setDatosFederatarios(datosFederetarios: Notario[]): void {
    this.update((state) => ({
      ...state,
      datosFederetarios
    }));
  }

  /**
   * Establece los datos de operaciones IMMEX
   * @method setDatosOperacions
   * @description Actualiza la información de operaciones IMMEX
   * @param {OperacionsImmex[]} datosOperacions - Array con datos de operaciones
   * @returns {void}
   * @public
   */
  public setDatosOperacions(datosOperacions: OperacionsImmex[]): void {
    this.update((state) => ({
      ...state,
      datosOperacions
    }));
  }

  /**
   * Establece los datos de productos de exportación
   * @method setDatosAnexo
   * @description Actualiza la información de productos destinados a exportación
   * @param {ProductoExportacion[]} datosAnexo - Array con datos de productos de exportación
   * @returns {void}
   * @public
   */
  public setDatosAnexo(datosAnexo: ProductoExportacion[]): void {
    this.update((state) => ({
      ...state,
      datosAnexo
    }));
  }

  /**
   * Establece los datos de importación
   * @method setDatosImportacion
   * @description Actualiza la información de productos de importación
   * @param {AnexoImportacion[]} datosImportacion - Array con datos de productos de importación
   * @returns {void}
   * @public
   */
  public setDatosImportacion(datosImportacion: AnexoImportacion[]): void {
    this.update((state) => ({
      ...state,
      datosImportacion
    }));
  }

  /**
   * Establece los datos de la bitácora de modificación
   * @method setDatosBitacora
   * @description Actualiza el registro de modificaciones en la bitácora
   * @param {BitacoraModificacion[]} datosBitacora - Array con datos de la bitácora de modificaciones
   * @returns {void}
   * @public
   */
  public setDatosBitacora(datosBitacora: BitacoraModificacion[]): void {
    this.update((state) => ({
      ...state,
      datosBitacora
    }));
  }

  /**
   * Establece el valor de la certificación SAT
   * @method setCertificacionSAT
   * @description Actualiza el valor de la certificación del SAT
   * @param {string} certificacionSAT - Nuevo valor para la certificación SAT
   * @returns {void}
   * @public
   */
  public setCertificacionSAT(certificacionSAT: string): void {
    this.update((state) => ({
      ...state,
      certificacionSAT
    }));
  }

  /**
   * Establece los datos del contenedor
   * @method setDelContenedor
   * @description Actualiza los datos del contenedor en el estado
   * @param {any[]} datosDelContenedor - Array con los datos del contenedor
   * @returns {void}
   * @public
   * @remarks Este método actualiza el estado de la tienda con los datos proporcionados para el contenedor
   */
  public setDelContenedor(datosDelContenedor: []): void {
    this.update((state) => ({
      ...state,
      datosDelContenedor
    }));
  }

  /**
   * Establece el tipo de búsqueda
   * @method setTipoBusqueda
   * @description Actualiza el tipo de búsqueda seleccionado
   * @param {string} tipoBusqueda - Tipo de búsqueda que se desea establecer
   * @returns {void}
   * @public
   */
  public setTipoBusqueda(tipoBusqueda: string): void {
    this.update((state) => ({
      ...state,
      tipoBusqueda
    }));
  }

  /**
   * Establece el valor de la aduana
   * @method setAduana
   * @description Actualiza la aduana seleccionada en el estado
   * @param {string} aduana - Nuevo valor para la propiedad aduana
   * @returns {void}
   * @public
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      aduana
    }));
  }

  /**
   * Establece la fecha de ingreso
   * @method setFechaIngreso
   * @description Actualiza la fecha de ingreso en el estado
   * @param {string} fechaIngreso - Nueva fecha de ingreso en formato de cadena
   * @returns {void}
   * @public
   */
  public setFechaIngreso(fechaIngreso: string): void {
    this.update((state) => ({
      ...state,
      fechaIngreso
    }));
  }

  
  /**
   * Establece las iniciales del contenedor
   * @method setInicialesContenedor
   * @description Actualiza las iniciales del contenedor en el estado
   * @param {string} inicialesContenedor - Iniciales del contenedor que se deben establecer
   * @returns {void}
   * @public
   */
  public setInicialesContenedor(inicialesContenedor: string): void {
    this.update((state) => ({
      ...state,
      inicialesContenedor
    }));
  }

  /**
   * Establece el número de contenedor
   * @method setNumeroContenedor
   * @description Actualiza el número de contenedor en el estado
   * @param {string} numeroContenedor - Número de contenedor que se va a asignar
   * @returns {void}
   * @public
   */
  public setNumeroContenedor(numeroContenedor: string): void {
    this.update((state) => ({
      ...state,
      numeroContenedor
    }));
  }

  /**
   * Establece el dígito de control del contenedor
   * @method setDigitoDeControl
   * @description Actualiza el dígito de control en el estado
   * @param {string} digitoDeControl - Nuevo valor del dígito de control
   * @returns {void}
   * @public
   */
  public setDigitoDeControl(digitoDeControl: string): void {
    this.update((state) => ({
      ...state,
      digitoDeControl
    }));
  }

  /**
   * Establece la información de contenedores
   * @method setContenedores
   * @description Actualiza la cadena de contenedores en el estado
   * @param {string} contenedores - Cadena que representa los contenedores
   * @returns {void}
   * @public
   */
  public setContenedores(contenedores: string): void {
    this.update((state) => ({
      ...state,
      contenedores
    }));
  }


  /**
   * Establece el archivo seleccionado
   * @method setArchivoSeleccionado
   * @description Actualiza el archivo seleccionado en el estado
   * @param {string} archivoSeleccionado - Nombre o identificador del archivo seleccionado
   * @returns {void}
   * @public
   */
  public setArchivoSeleccionado(archivoSeleccionado: string): void {
    this.update((state) => ({
      ...state,
      archivoSeleccionado
    }));
  }

  /**
   * Establece el valor de línea
   * @method setLinea
   * @description Actualiza la propiedad línea en el estado actual
   * @param {string} linea - Nuevo valor para la propiedad línea
   * @returns {void}
   * @public
   */
  public setLinea(linea: string): void {
    this.update((state) => ({
      ...state,
      linea,
    }));
  }

  /**
   * Establece el valor del checkbox de línea
   * @method setLineaCheckbox
   * @description Actualiza el estado del checkbox de línea
   * @param {string} lineaCheckbox - Nuevo valor para el checkbox de línea
   * @returns {void}
   * @public
   */
  public setLineaCheckbox(lineaCheckbox: string): void {
    this.update((state) => ({
      ...state,
      lineaCheckbox,
    }));
  }

  /**
   * Establece el valor del monto
   * @method setMonto
   * @description Actualiza el monto en el estado
   * @param {string} monto - Nuevo valor del monto que se asignará al estado
   * @returns {void}
   * @public
   */
  public setMonto(monto: string): void {
    this.update((state) => ({
      ...state,
      monto,
    }));
  }

  /**
   * Establece el tipo de programa seleccionado
   * @method setSelectedTipoPrograma
   * @description Actualiza el tipo de programa seleccionado en el estado
   * @param {string} selectedTipoPrograma - Nuevo valor del tipo de programa seleccionado
   * @returns {void}
   * @public
   */
  public setSelectedTipoPrograma(selectedTipoPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedTipoPrograma,
    }));
  }

  /**
   * Establece la lista de datos del programa
   * @method setProgramaListaDatos
   * @description Actualiza la lista de datos del programa en el estado
   * @param {ProgramaLista[]} programaListaDatos - Nueva lista de datos del programa
   * @returns {void}
   * @public
   */
  public setProgramaListaDatos(programaListaDatos: ProgramaLista[]): void {
    this.update((state) => ({
      ...state,
      programaListaDatos,
    }));
  }

  /**
   * Establece el folio del programa seleccionado
   * @method setSelectedFolioPrograma
   * @description Actualiza el folio del programa seleccionado en el estado
   * @param {string} selectedFolioPrograma - Nuevo valor del folio del programa seleccionado
   * @returns {void}
   * @public
   */
  public setSelectedFolioPrograma(selectedFolioPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedFolioPrograma,
    }));
  }

  /**
   * Establece el ID del programa seleccionado
   * @method setSelectedIdPrograma
   * @description Actualiza el ID del programa seleccionado en el estado
   * @param {string} selectedIdPrograma - Nuevo valor del ID del programa seleccionado
   * @returns {void}
   * @public
   */
  public setSelectedIdPrograma(selectedIdPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedIdPrograma,
    }));
  }

  /**
   * Establece el RFC de inicio de sesión
   * @method setLoginRfc
   * @description Actualiza el RFC de inicio de sesión en el estado
   * @param {string} loginRfc - Nuevo valor del RFC de inicio de sesión
   * @returns {void}
   * @public
   */
  public setLoginRfc(loginRfc: string): void {
    this.update((state) => ({
      ...state,
      loginRfc,
    }));
  }

  /**
   * Limpia todos los datos de la solicitud
   * @method limpiarSolicitud
   * @description Reinicia el estado del store al estado inicial
   * @returns {void}
   * @public
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}