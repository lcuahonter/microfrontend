/**
 * Store de estado para la gestión de choferes en el trámite 40103.
 *
 * Este archivo contiene la implementación del patrón de estado utilizando Akita para la gestión
 * centralizada de información de choferes nacionales y extranjeros en el sistema de transportistas
 * terrestres. Maneja operaciones de alta, modificación y retirada de conductores profesionales.
 *
 * El store incluye:
 * - Interfaz de estado para choferes nacionales y extranjeros
 * - Función de creación del estado inicial
 * - Store principal con métodos para actualización de estado
 * - Métodos específicos para cada campo de información del chofer
 * - Gestión de listas de choferes por tipo de operación
 *
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module Chofer40103Store
 */

import { Chofer, ChoferesExtranjeros, DatosDelChoferNacional } from '../models/registro-muestras-mercancias.model';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Interfaz que define el estado completo de los choferes nacionales y extranjeros en el trámite 40103.
 *
 * Esta interfaz especifica la estructura del estado que maneja toda la información relacionada
 * con choferes en el sistema de transportistas terrestres. Incluye datos personales básicos
 * y arrays separados para diferentes tipos de operaciones (alta, modificación, retirada)
 * tanto para choferes nacionales como extranjeros.
 *
 * Las propiedades del estado incluyen:
 * - Información personal básica (nombre, apellidos)
 * - Arrays de choferes nacionales por tipo de operación
 * - Arrays de choferes extranjeros por tipo de operación
 * - Gestión separada para cada flujo de trabajo
 *
 * @interface Choferesnacionales40103State
 *
 * @example
 * ```typescript
 * const estadoChoferes: Choferesnacionales40103State = {
 *   nombre: 'Juan',
 *   primerApellido: 'Pérez',
 *   segundoApellido: 'García',
 *   datosDelChoferNacionalAlta: [choferNacional1, choferNacional2],
 *   datosDelChoferNacionalModification: [],
 *   datosDelChoferNacionalRetirada: [choferNacionalRetirado],
 *   datosDelChoferExtranjerosAlta: [choferExtranjero1],
 *   datosDelChoferExtranjerosModification: [],
 *   datosDelChoferExtranjerosRetirada: []
 * };
 * ```
 *
 * @since 1.0.0
 */
export interface Choferesnacionales40103State {
  /**
   * @property {string} nombre
   * Nombre del chofer en el estado actual del formulario.
   */
  nombre: string;

  /**
   * @property {string} primerApellido
   * Primer apellido del chofer en el estado actual del formulario.
   */
  primerApellido: string;

  /**
   * @property {string} segundoApellido
   * Segundo apellido del chofer en el estado actual del formulario.
   */
  segundoApellido: string;

  /**
   * @property {DatosDelChoferNacional[]} datosDelChoferNacionalAlta
   * Array de choferes nacionales dados de alta en el sistema.
   */
  datosDelChoferNacionalAlta: DatosDelChoferNacional[]; 

  /**
   * @property {DatosDelChoferNacional[]} datosDelChoferNacionalModification
   * Array de choferes nacionales con modificaciones pendientes o aplicadas.
   */
  datosDelChoferNacionalModification: DatosDelChoferNacional[];

  /**
   * @property {DatosDelChoferNacional[]} datosDelChoferNacionalRetirada
   * Array de choferes nacionales dados de baja o retirados del sistema.
   */
  datosDelChoferNacionalRetirada: DatosDelChoferNacional[]; 

  /**
   * @property {ChoferesExtranjeros[]} datosDelChoferExtranjerosAlta
   * Array de choferes extranjeros dados de alta en el sistema.
   */
  datosDelChoferExtranjerosAlta: ChoferesExtranjeros[];

  /**
   * @property {ChoferesExtranjeros[]} datosDelChoferExtranjerosModification
   * Array de choferes extranjeros con modificaciones pendientes o aplicadas.
   */
  datosDelChoferExtranjerosModification: ChoferesExtranjeros[];

  /**
   * @property {ChoferesExtranjeros[]} datosDelChoferExtranjerosRetirada
   * Array de choferes extranjeros dados de baja o retirados del sistema.
   */
  datosDelChoferExtranjerosRetirada: ChoferesExtranjeros[];
  solicitudeId: string;
  cadenaOriginal: string;
  codigo: string;
  isShowDirector:boolean
  catErrorMessage: string;
  isCaat: boolean;
  IdPersonaSolicitud: string;
}

/**
 * Crea el estado inicial para el store de choferes del trámite 40103.
 *
 * Esta función factory genera el estado inicial vacío para todos los campos
 * y arrays relacionados con la gestión de choferes nacionales y extranjeros.
 * Proporciona valores por defecto que aseguran la consistencia del estado
 * al inicializar el store.
 *
 * El estado inicial incluye:
 * - Campos de texto vacíos para información personal
 * - Arrays vacíos para todas las categorías de choferes
 * - Configuración predeterminada para el flujo de trabajo
 *
 * @function createChoferState
 * @returns {Choferesnacionales40103State} El estado inicial del store de choferes
 *
 * @example
 * ```typescript
 * const estadoInicial = createChoferState();
 * console.log(estadoInicial.nombre); // ''
 * console.log(estadoInicial.datosDelChoferNacionalAlta); // []
 * ```
 *
 * @since 1.0.0
 */
export function createChoferState(): Choferesnacionales40103State {
  return { 
    cadenaOriginal:'',
  codigo: '00',
    catErrorMessage:'',
    isCaat: false,
    IdPersonaSolicitud: '',
    solicitudeId:'',
    isShowDirector:false,
    nombre: '',
    primerApellido: '',
    segundoApellido: '',

    datosDelChoferNacionalAlta: [],
    datosDelChoferNacionalModification: [],
    datosDelChoferNacionalRetirada: [],
    
    datosDelChoferExtranjerosAlta: [],
    datosDelChoferExtranjerosModification: [],
    datosDelChoferExtranjerosRetirada: [],
  };
}

/**
 * Store principal para la gestión de estado de choferes en el trámite 40103.
 *
 * Esta clase implementa el patrón de gestión de estado utilizando Akita Store para
 * centralizar toda la información relacionada con choferes nacionales y extranjeros.
 * Proporciona métodos para actualizar cada campo del estado de forma inmutable y
 * mantener la consistencia de los datos a través de la aplicación.
 *
 * Características principales:
 * - Gestión de estado centralizada con Akita
 * - Métodos específicos para cada campo de información
 * - Actualización inmutable del estado
 * - Configuración de store resetteable
 * - Inyección de dependencia como servicio global
 *
 * @class Chofer40103Store
 * @extends {Store<Choferesnacionales40103State>}
 * 
 * @injectable
 * @providedIn 'root'
 * 
 * @example
 * ```typescript
 * // Inyectar el store en un componente
 * constructor(private choferStore: Chofer40103Store) {}
 * 
 * // Actualizar el nombre del chofer
 * this.choferStore.setNombre('Juan Carlos');
 * 
 * // Limpiar el estado
 * this.choferStore.clearChoferes();
 * ```
 *
 * @since 1.0.0
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'chofer40103', resettable: true })
export class Chofer40103Store extends Store<Choferesnacionales40103State> {
  /**
   * Constructor del store de choferes.
   *
   * Inicializa el store con el estado por defecto utilizando la función
   * createChoferState() que proporciona valores iniciales vacíos para
   * todos los campos y arrays del estado.
   *
   * @constructor
   * @since 1.0.0
   */
  constructor() {
    super(createChoferState());
  }

  /**
   * Establece la lista de choferes en el estado.
   *
   * Actualiza el estado con un array de choferes proporcionado. Este método
   * reemplaza completamente la lista existente de choferes en el estado con
   * la nueva lista proporcionada como parámetro.
   *
   * @method set
   * @param {Chofer[]} nacionalArray - La lista de choferes a establecer en el estado
   * @returns {void}
   *
   * @example
   * ```typescript
   * const choferes: Chofer[] = [chofer1, chofer2, chofer3];
   * this.choferStore.set(choferes);
   * ```
   *
   * @since 1.0.0
   */
  set(nacionalArray: Chofer[]): void {
    this.update((state) => ({
      ...state,
      choferes: nacionalArray,
    }));
  }

   public setSolicitudeId(solicitudeId: string): void {
    this.update((state) => ({ ...state, solicitudeId }));
  }

  public setCadenaOriginal(cadenaOriginal: string): void {
    this.update((state) => ({ ...state, cadenaOriginal }));
  }

  public setCodigo(codigo: string): void {
    this.update((state) => ({ ...state, codigo }));
  }

  public setIsShowDirector(isShowDirector: boolean): void {
    this.update((state) => ({ ...state, isShowDirector }));
  }

  public setCatErrorMessage(catErrorMessage: string): void {
    this.update((state) => ({ ...state, catErrorMessage }));
  }

  public setIsCaat(isCaat: boolean): void {
    this.update((state) => ({ ...state, isCaat }));
  }

  public setIdPersonaSolicitud(IdPersonaSolicitud: string): void {
    this.update((state) => ({ ...state, IdPersonaSolicitud }));
  }


  /**
   * Establece el CURP del chofer en el estado.
   *
   * Actualiza el estado con la Clave Única de Registro de Población (CURP)
   * del chofer nacional. La CURP es un identificador único de 18 caracteres
   * utilizado en México para identificar a las personas.
   *
   * @method setCurp
   * @param {string} curp - El CURP del chofer (18 caracteres alfanuméricos)
   * @returns {void}
   *
   * @example
   * ```typescript
   * this.choferStore.setCurp('PAMC850315HDFRRR09');
   * ```
   *
   * @since 1.0.0
   */
  public setCurp(curp: string): void {
    this.update((state) => ({
      ...state,
      curp,
    }));
  }

  /**
   * Establece el primer apellido del chofer en el estado.
   *
   * Actualiza el estado con el primer apellido (apellido paterno) del chofer.
   * Este campo es utilizado para la identificación personal del conductor
   * en los formularios del sistema.
   *
   * @method setPrimerApellido
   * @param {string} primerApellido - El primer apellido del chofer
   * @returns {void}
   *
   * @example
   * ```typescript
   * this.choferStore.setPrimerApellido('García');
   * ```
   *
   * @since 1.0.0
   */
  public setPrimerApellido(primerApellido: string): void {
    this.update((state) => ({
      ...state,
      primerApellido,
    }));
  }

  /**
   * Establece el RFC del chofer en el estado.
   *
   * Actualiza el estado con el Registro Federal de Contribuyentes (RFC) del chofer.
   * El RFC es un identificador fiscal único de 13 caracteres para personas físicas
   * en México, requerido para actividades comerciales y laborales.
   *
   * @method setRfc
   * @param {string} rfc - El RFC del chofer (13 caracteres para persona física)
   * @returns {void}
   *
   * @example
   * ```typescript
   * this.choferStore.setRfc('GARC850315ABC');
   * ```
   *
   * @since 1.0.0
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }

  /**
   * Establece el segundo apellido del chofer en el estado.
   *
   * Actualiza el estado con el segundo apellido (apellido materno) del chofer.
   * Este campo complementa la identificación personal del conductor junto
   * con el nombre y primer apellido en el sistema.
   *
   * @method setSegundoApellido
   * @param {string} segundoApellido - El segundo apellido del chofer
   * @returns {void}
   *
   * @example
   * ```typescript
   * this.choferStore.setSegundoApellido('López');
   * ```
   *
   * @since 1.0.0
   */
  public setSegundoApellido(segundoApellido: string): void {
    this.update((state) => ({
      ...state,
      segundoApellido,
    }));
  }

  /**
   * Establece el apellido paterno del chofer.
   * @param apellidoPaterno El apellido paterno del chofer.
   * @returns void
   */
  public setApellidoPaterno(apellidoPaterno: string): void {
    this.update((state) => ({ ...state, apellidoPaterno }));
  }

  /**
   * Establece el apellido materno del chofer nacional.
   * @param apellidoMaternoCHN El apellido materno del chofer nacional.
   * @returns void
   */
  public setApellidoMaternoCHN(apellidoMaternoCHN: string): void {
    this.update((state) => ({ ...state, apellidoMaternoCHN }));
  }

  /**
   * Establece el número de gafete del chofer en el estado.
   *
   * Actualiza el estado con el número de gafete del conductor profesional.
   * El gafete es una identificación oficial requerida para conductores
   * de transporte comercial y de carga en México.
   *
   * @method setGafete
   * @param {string} gafete - El número de gafete del chofer
   * @returns {void}
   *
   * @example
   * ```typescript
   * this.choferStore.setGafete('123456789');
   * ```
   *
   * @since 1.0.0
   */
  public setGafete(gafete: string): void {
    this.update((state) => ({ ...state, gafete }));
  }

  /**
   * Establece la vigencia del gafete del chofer en el estado.
   *
   * Actualiza el estado con la fecha de vencimiento del gafete del conductor.
   * Esta información es crucial para verificar que el chofer tenga una
   * identificación válida y vigente para operar vehículos comerciales.
   *
   * @method setVigenciaGafete
   * @param {string} vigenciagafete - La fecha de vigencia del gafete (formato: YYYY-MM-DD)
   * @returns {void}
   *
   * @example
   * ```typescript
   * this.choferStore.setVigenciaGafete('2025-12-31');
   * ```
   *
   * @since 1.0.0
   */
  public setVigenciaGafete(vigenciagafete: string): void {
    this.update((state) => ({ ...state, vigenciagafete }));
  }

  /**
   * Establece la calle del domicilio del chofer.
   * @param calle La calle del domicilio.
   * @returns void
   */
  public setCalle(calle: string): void {
    this.update((state) => ({ ...state, calle }));
  }

  /**
   * Establece el número exterior del domicilio del chofer.
   * @param numeroExterior El número exterior del domicilio.
   * @returns void
   */
  public setNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({ ...state, numeroExterior }));
  }

  /**
   * Establece el número interior del domicilio del chofer.
   * @param numeroInterior El número interior del domicilio.
   * @returns void
   */
  public setNumeroInterior(numeroInterior: string): void {
    this.update((state) => ({ ...state, numeroInterior }));
  }

  /**
   * Establece la ciudad del domicilio del chofer.
   * @param ciudad La ciudad del domicilio.
   * @returns void
   */
  public setCiudad(ciudad: string): void {
    this.update((state) => ({ ...state, ciudad }));
  }

  /**
   * Establece la localidad del domicilio del chofer.
   * @param localidad La localidad del domicilio.
   * @returns void
   */
  public setLocalidad(localidad: string): void {
    this.update((state) => ({ ...state, localidad }));
  }

  /**
   * Establece el código postal del domicilio del chofer.
   * @param codigoPostal El código postal del domicilio.
   * @returns void
   */
  public setCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({ ...state, codigoPostal }));
  }

  /**
   * Establece el país del chofer nacional.
   * @param paisChn El país del chofer nacional.
   * @returns void
   */
  public setPaisChn(paisChn: string): void {
    this.update((state) => ({ ...state, paisChn }));
  }

  /**
   * Establece el estado del control del chofer.
   * @param estadoControl El estado del control.
   * @returns void
   */
  public setEstadoControl(estadoControl: string): void {
    this.update((state) => ({ ...state, estadoControl }));
  }

  /**
   * Establece el número del seguro social del chofer.
   * @param numerodelsegurosocial El número del seguro social.
   * @returns void
   */
  public setNumeroDelSeguroSocial(numerodelsegurosocial: string): void {
    this.update((state) => ({ ...state, numerodelsegurosocial }));
  }

  /**
   * Establece la entidad federativa del chofer nacional.
   * @param entidadFederativaCHN La entidad federativa del chofer nacional.
   * @returns void
   */
  public setEntidadFederativaCHN(entidadFederativaCHN: string): void {
    this.update((state) => ({ ...state, entidadFederativaCHN }));
  }

  /**
   * Establece la delegación del chofer nacional.
   * @param delegacionCHN La delegación del chofer nacional.
   * @returns void
   */
  public setDelegacionCHN(delegacionCHN: string): void {
    this.update((state) => ({ ...state, delegacionCHN }));
  }

  /**
   * Establece la colonia del chofer nacional.
   * @param coloniaCHN La colonia del chofer nacional.
   * @returns void
   */
  public setColoniaCHN(coloniaCHN: string): void {
    this.update((state) => ({ ...state, coloniaCHN }));
  }

  /**
   * Establece el país de origen del chofer nacional.
   * @param paisOrigenCHN El país de origen del chofer nacional.
   * @returns void
   */
  public setPaisOrigenCHN(paisOrigenCHN: string): void {
    this.update((state) => ({ ...state, paisOrigenCHN }));
  }

  /**
   * Establece el correo electrónico del chofer en el estado.
   *
   * Actualiza el estado con la dirección de correo electrónico del chofer.
   * Este campo es esencial para las comunicaciones oficiales y notificaciones
   * relacionadas con el trámite y la documentación del conductor.
   *
   * @method setCorreo
   * @param {string} correo - La dirección de correo electrónico del chofer
   * @returns {void}
   *
   * @example
   * ```typescript
   * this.choferStore.setCorreo('juan.garcia@email.com');
   * ```
   *
   * @since 1.0.0
   */
  public setCorreo(correo: string): void {
    this.update((state) => ({ ...state, correo }));
  }

  /**
   * Establece el número de teléfono del chofer en el estado.
   *
   * Actualiza el estado con el número telefónico de contacto del chofer.
   * Este campo es obligatorio para mantener comunicación directa con el
   * conductor en caso de emergencias o requerimientos del trámite.
   *
   * @method setTelefono
   * @param {string} telefono - El número de teléfono del chofer (incluir código de área)
   * @returns {void}
   *
   * @example
   * ```typescript
   * this.choferStore.setTelefono('5551234567');
   * ```
   *
   * @since 1.0.0
   */
  public setTelefono(telefono: string): void {
    this.update((state) => ({ ...state, telefono }));
  }

  /**
   * Establece el apellido materno del chofer extranjero.
   * @param apellidoMaternoCHE El apellido materno del chofer extranjero.
   * @returns void
   */
  public setApellidoMaternoCHE(apellidoMaternoCHE: string): void {
    this.update((state) => ({ ...state, apellidoMaternoCHE }));
  }

  /**
   * Establece la nacionalidad del chofer extranjero.
   * @param nacionalidadCHE La nacionalidad del chofer extranjero.
   * @returns void
   */
  public setNacionalidadCHE(nacionalidadCHE: string): void {
    this.update((state) => ({ ...state, nacionalidadCHE }));
  }

  /**
   * Establece el número de seguro social del chofer extranjero.
   * @param nss El número de seguro social del chofer extranjero.
   * @returns void
   */
  public setNss(nss: string): void {
    this.update((state) => ({ ...state, nss }));
  }

  /**
   * Establece el identificador fiscal del chofer extranjero.
   * @param ideFiscal El identificador fiscal del chofer extranjero.
   * @returns void
   */
  public setIdeFiscal(ideFiscal: string): void {
    this.update((state) => ({ ...state, ideFiscal }));
  }

  /**
   * Establece el país del chofer extranjero.
   * @param paisCHE El país del chofer extranjero.
   * @returns void
   */
  public setPaisCHE(paisCHE: string): void {
    this.update((state) => ({ ...state, paisCHE }));
  }

  /**
   * Establece la entidad federativa del chofer extranjero.
   * @param entidadFederativaCHE La entidad federativa del chofer extranjero.
   * @returns void
   */
  public setEntidadFederativaCHE(entidadFederativaCHE: string): void {
    this.update((state) => ({ ...state, entidadFederativaCHE }));
  }

  /**
   * Establece el país de origen del chofer extranjero.
   * @param paisOrigenCHE El país de origen del chofer extranjero.
   * @returns void
   */
  public setPaisOrigenCHE(paisOrigenCHE: string): void {
    this.update((state) => ({ ...state, paisOrigenCHE }));
  }

  /**
   * Establece el apellido paterno del chofer.
   * @param apellidoPaternos El apellido paterno del chofer.
   * @returns void
   */
  public setApellidoPaternos(apellidoPaternos: string): void {
    this.update((state) => ({ ...state, apellidoPaternos }));
  }

  /**
   * Establece los nombres del chofer.
   * @param nombres Los nombres del chofer.
   * @returns void
   */
  public setNombres(nombres: string): void {
    this.update((state) => ({ ...state, nombres }));
  }

  /**
   * Establece el nombre del chofer en el estado.
   *
   * Actualiza el estado con el nombre de pila del chofer. Este campo es
   * fundamental para la identificación personal del conductor y se utiliza
   * en conjunto con los apellidos para formar el nombre completo.
   *
   * @method setNombre
   * @param {string} nombre - El nombre del chofer
   * @returns {void}
   *
   * @example
   * ```typescript
   * this.choferStore.setNombre('Juan Carlos');
   * ```
   *
   * @since 1.0.0
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({ ...state, nombre }));
  }

  /**
   * Establece la lista de vehículos.
   * @param vehiculosArray La lista de vehículos.
   * @returns void
   */
  setVehiculos(vehiculosArray: string[]): void {
    this.update((state) => ({
      ...state,
      vehiculos: [...vehiculosArray],
    }));
  }

  /**
   * Establece la lista de unidades de arrastre.
   * @param unidadesdearrastreArray La lista de unidades de arrastre.
   * @returns void
   */
  setUnidadesdeArrastre(unidadesdearrastreArray: string[]): void {
    this.update((state) => ({
      ...state,
      unidadesdearrastre: unidadesdearrastreArray,
    }));
  }

  /**
   * Establece el tipo de vehículo de la solicitud.
   * @param solicitudVehiculo El tipo de vehículo de la solicitud.
   * @returns void
   */
  public setsolicitudVehiculoTipoVehiculo(solicitudVehiculo: string): void {
    this.update((state) => ({
      ...state,
      solicitudVehiculo,
    }));
  }

  /**
   * Establece el país emisor del vehículo de la solicitud.
   * @param solicitudVehiculo El país emisor del vehículo de la solicitud.
   * @returns void
   */
  public setsolicitudVehiculoPaisEmisor(solicitudVehiculo: string): void {
    this.update((state) => ({
      ...state,
      solicitudVehiculo,
    }));
  }

  /**
   * Establece el color del vehículo de la solicitud.
   * @param vehiculoColor El color del vehículo de la solicitud.
   * @returns void
   */
  public solicitudVehiculoColor(vehiculoColor: string): void {
    this.update((state) => ({
      ...state,
      vehiculoColor,
    }));
  }

  /**
   * Establece el país emisor de la segunda placa del vehículo.
   * @param PaisEmisor2daPlaca El país emisor de la segunda placa del vehículo.
   * @returns void
   */
  public VehiculoPaisEmisor2daPlaca(PaisEmisor2daPlaca: string): void {
    this.update((state) => ({
      ...state,
      PaisEmisor2daPlaca,
    }));
  }

  /**
   * Establece el año del vehículo.
   * @param VehiculoVEH El año del vehículo.
   * @returns void
   */
  public setanioVehiculoVEH(VehiculoVEH: string): void {
    this.update((state) => ({
      ...state,
      VehiculoVEH,
    }));
  }

  /**
   * Establece la lista de estados disponibles en el sistema.
   *
   * Actualiza el estado con un catálogo de estados o entidades federativas
   * que se utilizan en los formularios de domicilio. Esta información
   * proviene de catálogos oficiales del sistema.
   *
   * @method setEstado
   * @param {Catalogo[]} estado - Array de objetos de catálogo con estados disponibles
   * @returns {void}
   *
   * @example
   * ```typescript
   * const estados: Catalogo[] = [
   *   { id: 1, nombre: 'Ciudad de México', clave: 'CDMX' },
   *   { id: 2, nombre: 'Nuevo León', clave: 'NL' }
   * ];
   * this.choferStore.setEstado(estados);
   * ```
   *
   * @since 1.0.0
   */
  setEstado(estado: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Guarda un elemento por cada sección que se encuentre.
   * @param seccion La validación de la sección.
   * @returns void
   */
  public establecerSeccion(seccion: boolean[]): void {
    this.update((state) => ({
      ...state,
      seccion,
    }));
  }

  /**
   * Agrega elementos por cada sección indicando si el formulario es válido o no.
   * @param formaValida La validación del formulario.
   * @returns void
   */
  public establecerFormaValida(formaValida: boolean[]): void {
    this.update((state) => ({
      ...state,
      formaValida,
    }));
  }

  /**
   * Limpia completamente el estado del store de choferes.
   *
   * Restablece el store a su estado inicial utilizando el método reset()
   * de Akita. Esto elimina toda la información de choferes almacenada
   * y retorna el estado a los valores por defecto definidos en createChoferState().
   *
   * @method clearChoferes
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Limpiar todo el estado cuando el usuario sale del módulo
   * this.choferStore.clearChoferes();
   * ```
   *
   * @since 1.0.0
   */
  public clearChoferes(): void {
    this.reset();
  }
}
