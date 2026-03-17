import { Servicio, ServicioAmpliacion, ServicioAutorizado, ServicioInmex, Servicios } from '../models/datos-info.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '../constantes/modificacion.enum';
import { EmpresaNacional } from '../../../shared/models/modelo-interface.model';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de la ampliación de servicios en la aplicación.
 */
export interface AmpliacionServiciosState {

  /** Identificador de la solicitud, puede ser nulo si aún no se ha creado. */
  idSolicitud: number | null;

  /**
   * Información del registro de servicios.
   */
  infoRegistro: Servicios;

  /**
   * Lista de catálogos de aduanas de ingreso.
   */
  aduanaDeIngreso: Catalogo[];

  /**
   * Datos relacionados con los servicios IMMEX.
   */
  datosImmex: ServicioAmpliacion[];

  datosAutorizados: ServicioAutorizado[];

  /**
   * Datos adicionales relacionados con IMMEX.
   */
  datos: ServicioInmex[];

  /**
   * Catálogo seleccionado de aduana de ingreso.
   */
  aduanaDeIngresoSelecion: Catalogo;

  /**
   * Indica si los formularios son válidos, mapeados por clave.
   */
  formaValida: { [key: string]: boolean };

  /**
   * Lista de empresas relacionadas con IMMEX.
   */
  empresas: EmpresaNacional[];

  /**
   * Lista de servicios disponibles.
   */
  servicios: Servicio[];

  /**
   * RFC de la empresa asociada.
   */
  rfcEmpresa: string;

  /**
   * Número del programa IMMEX.
   */
  numeroPrograma: string;

  /**
   * Tiempo de duración del programa IMMEX.
   */
  tiempoPrograma: string;
}

/**
 * Estado inicial para la gestión de ampliación de servicios.
 *
 * @constant
 * @type {AmpliacionServiciosState}
 *
 * @property {Object} infoRegistro - Información del registro.
 * @property {string} infoRegistro.seleccionaLaModalidad - Modalidad seleccionada.
 * @property {string} infoRegistro.folio - Folio del trámite.
 * @property {string} infoRegistro.ano - Año del trámite.
 *
 * @property {Array} empresas - Lista de empresas asociadas.
 * @property {Array} servicios - Lista de servicios disponibles.
 * @property {Array} aduanaDeIngreso - Lista de aduanas de ingreso.
 * @property {Array} datosImmex - Información relacionada con IMMEX.
 * @property {Array} datos - Datos adicionales.
 *
 * @property {Object} aduanaDeIngresoSelecion - Aduana de ingreso seleccionada.
 * @property {number} aduanaDeIngresoSelecion.id - Identificador de la aduana seleccionada.
 * @property {string} aduanaDeIngresoSelecion.descripcion - Descripción de la aduana seleccionada.
 *
 * @property {Object} formaValida - Validación de la forma.
 * @property {boolean} formaValida.entidadFederativa - Indica si la entidad federativa es válida.
 *
 * @property {string} rfcEmpresa - RFC de la empresa.
 * @property {string} numeroPrograma - Número del programa.
 * @property {string} tiempoPrograma - Tiempo del programa.
 */
export const INITIAL_AMPLIACION_SERVICIOS_STATE: AmpliacionServiciosState = {
  /** Identificador de la solicitud, puede ser nulo si aún no se ha creado. */
  idSolicitud:null,
  infoRegistro: {
    seleccionaLaModalidad: '',
    folio: '',
    ano: '',
    folioPrograma: '',
  },
  empresas: [],
  servicios: [],
  aduanaDeIngreso: [],
  datosImmex: [],
  datosAutorizados: [],
  datos: [],
  aduanaDeIngresoSelecion: {
    id: -1,
    descripcion: '',
  },
  formaValida: {
    entidadFederativa: true,
  },
  rfcEmpresa: '',
  numeroPrograma: '',
  tiempoPrograma: '',
};

/**
 * AmpliacionServicios Store
 * @export
 * @class AmpliacionServiciosStore
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ampliacion-servicios', resettable: true })
export class AmpliacionServiciosStore extends Store<AmpliacionServiciosState> {
  /**
   * Constructor de la clase AmpliacionServiciosStore.
   * Inicializa el estado del store con el estado inicial definido.
   */
  constructor() {
    super(INITIAL_AMPLIACION_SERVICIOS_STATE);
  }

  /**
   * Actualiza el estado del store con la información proporcionada de registro.
   *
   * @param infoRegistro - Objeto de tipo `Servicios` que contiene la información
   *                        del registro a establecer en el estado.
   */
  setInfoRegistro(infoRegistro: Servicios): void {
    this.update((state) => ({
      ...state,
      infoRegistro,
    }));
  }

  /**
   * Establece el catálogo de aduanas de ingreso en el estado de la tienda.
   *
   * @param aduanaDeIngreso - Arreglo de objetos del tipo `Catalogo` que representa las aduanas de ingreso.
   */
  setAduanaDeIngreso(aduanaDeIngreso: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      aduanaDeIngreso,
    }));
  }

  /**
   * Establece los datos IMMEX en el estado de la tienda.
   *
   * @param datosImmex - Un arreglo de objetos de tipo `Servicio` que contiene la información IMMEX a actualizar en el estado.
   */
  setDatosImmex(datosImmex: ServicioAmpliacion[]): void {
    this.update((state) => ({
      ...state,
      datosImmex,
    }));
  }

  /**
   * Establece los datos en el estado de la tienda.
   *
   * @param datos - Un arreglo de objetos de tipo `ServicioInmex` que se asignarán al estado.
   */
  setDatos(datos: ServicioInmex[]): void {
    this.update((state) => ({
      ...state,
      datos,
    }));
  }

  /**
   * Establece la aduana de ingreso seleccionada en el estado de la tienda.
   *
   * @param aduanaDeIngresoSelecion - Objeto de tipo `Catalogo` que representa la aduana de ingreso seleccionada.
   *
   * @remarks
   * Este método actualiza el estado de la tienda con la aduana de ingreso proporcionada.
   */
  setAduanaDeIngresoSeleccion(aduanaDeIngresoSelecion: Catalogo): void {
    this.update((state) => ({
      ...state,
      aduanaDeIngresoSelecion,
    }));
  }

  /**
   * Actualiza el estado de la propiedad `formaValida` en el store.
   * Combina los valores existentes con los nuevos valores proporcionados.
   *
   * @param formaValida - Un objeto donde las claves son cadenas y los valores son booleanos,
   *                      representando la validez de diferentes partes del formulario.
   *
   * @returns void
   */
  setFormValida(formaValida: { [key: string]: boolean }): void {
    this.update((state) => {
      const IS_VALID = { ...state.formaValida, ...formaValida };
      return {
        ...state,
        formaValida: IS_VALID,
      };
    });
  }

  /**
   * Establece el RFC de la empresa en el estado de la tienda.
   *
   * @param rfcEmpresa - El RFC de la empresa que se desea establecer.
   */
  setRfcEmpresa(rfcEmpresa: string): void {
    this.update((state) => ({
      ...state,
      rfcEmpresa,
    }));
  }
  /**
   * Establece el número de programa en el estado de la tienda.
   *
   * @param numeroPrograma - El número de programa que se desea asignar.
   */
  setNumeroPrograma(numeroPrograma: string): void {
    this.update((state) => ({
      ...state,
      numeroPrograma,
    }));
  }
  /**
   * Establece el valor de `tiempoPrograma` en el estado de la tienda.
   *
   * @param tiempoPrograma - El nuevo valor para el campo `tiempoPrograma`.
   */
  setTiempoPrograma(tiempoPrograma: string): void {
    this.update((state) => ({
      ...state,
      tiempoPrograma,
    }));
  }
  /**
   * Establece los campos relacionados con la empresa en el estado de la tienda.
   *
   * @param rfcEmpresa - El RFC de la empresa.
   * @param numeroPrograma - El número del programa asociado.
   * @param tiempoPrograma - El tiempo del programa en formato de cadena.
   */
  setCamposEmpresa(
    rfcEmpresa: string,
    numeroPrograma: string,
    tiempoPrograma: string
  ): void {
    this.update((state) => ({
      ...state,
      rfcEmpresa,
      numeroPrograma,
      tiempoPrograma,
    }));
  }

  /**
   * Actualiza el estado con una lista de empresas proporcionada.
   *
   * @param empresas - Arreglo de objetos de tipo `ServicioInmex` que representa las empresas a establecer en el estado.
   */
  setEmpresas(empresas: Partial<EmpresaNacional[]>): void {
    const FILTERED_EMPRESAS = (empresas as EmpresaNacional[]).filter((e): e is EmpresaNacional => e !== undefined);
    this.update((state) => ({
      ...state,
      empresas: FILTERED_EMPRESAS,
    }));
  }

  /**
   * Establece la lista de servicios en el estado de la tienda.
   *
   * @param servicios - Un arreglo de objetos de tipo `Servicio` que representa los servicios a establecer.
   */
  setServicios(servicios: Servicio[]): void {
    this.update((state) => ({
      ...state,
      servicios,
    }));
  }

  /**
   * Agrega un nuevo servicio al estado actual.
   *
   * @param servicio - El objeto de tipo `Servicio` que se desea agregar a la lista de servicios.
   */
  agregarServicio(servicio: Servicio): void {
    this.update((state) => ({
      ...state,
      servicios: [...state.servicios, servicio],
    }));
  }
  /**
   * Agrega una nueva empresa al estado actual.
   *
   * @param empresa - Objeto de tipo `EmpresaNacional` que representa la empresa a agregar.
   */
  agregarEmpresa(empresa: EmpresaNacional): void {
    this.update((state) => ({
      ...state,
      empresas: [...state.empresas, empresa],
    }));
  }

  datosAutorizados(datosAutorizados: ServicioAutorizado[]): void {
    this.update((state) => ({
      ...state,
      datosAutorizados,
    }));
  }

  setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

}
