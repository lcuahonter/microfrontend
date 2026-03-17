/**
 * @fileoverview Tienda Akita para la gestión de estado de choferes en el trámite 40102
 * 
 * Este archivo contiene la implementación de la tienda Akita responsable de gestionar
 * el estado global de los choferes nacionales y extranjeros en el contexto del trámite 40102.
 * Incluye interfaces para el estado, funciones de inicialización y la clase principal
 * de la tienda con todos los métodos para actualizar propiedades específicas.
 * 
 * La tienda maneja información personal, domiciliaria, de identificación y vehicular
 * tanto para choferes nacionales como extranjeros, proporcionando una interfaz
 * unificada para las operaciones de alta, modificación y retirada.
 * 
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module Chofer40102Store
 */

import { Chofer, ChoferesExtranjeros, DatosDelChoferNacional } from '../models/registro-muestras-mercancias.model';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Interfaz que define el estado completo de los choferes en el trámite 40102.
 * 
 * Esta interfaz establece la estructura del estado global para gestionar información
 * de choferes nacionales y extranjeros, incluyendo datos personales básicos y
 * arrays específicos para diferentes operaciones (alta, modificación, retirada).
 * 
 * El estado se organiza en tres categorías principales:
 * - Datos personales básicos (nombre, apellidos)
 * - Datos de choferes nacionales (alta, modificación, retirada)
 * - Datos de choferes extranjeros (alta, modificación, retirada)
 * 
 * @interface
 * @since 1.0.0
 * 
 * @example
 * ```typescript
 * const estadoInicial: Choferesnacionales40102State = {
 *   nombre: 'Juan Carlos',
 *   primerApellido: 'García',
 *   segundoApellido: 'López',
 *   datosDelChoferNacionalAlta: [...],
 *   // ... resto de propiedades
 * };
 * ```
 */
export interface Choferesnacionales40102State {
  /**
   * Nombre del chofer.
   * 
   * @property {string} nombre
   * Campo obligatorio que almacena el nombre o nombres del chofer.
   */
  nombre: string;

  solicitudeId: string;
  isShowDirector: boolean
  codigo: string

  /**
   * Primer apellido del chofer.
   * 
   * @property {string} primerApellido
   * Campo obligatorio que almacena el primer apellido del chofer.
   */
  primerApellido: string;

  /**
   * Segundo apellido del chofer.
   * 
   * @property {string} segundoApellido
   * Campo que almacena el segundo apellido del chofer cuando aplique.
   */
  segundoApellido: string;
  catErrorMessage: string
  isCaat: boolean
  cadenaOriginal: string
  IdPersonaSolicitud: string

  /**
   * Lista de choferes nacionales para operaciones de alta.
   * 
   * @property {DatosDelChoferNacional[]} datosDelChoferNacionalAlta
   * Array que contiene la información de choferes nacionales que serán dados de alta.
   */
  datosDelChoferNacionalAlta: DatosDelChoferNacional[];

  /**
   * Lista de choferes nacionales para operaciones de modificación.
   * 
   * @property {DatosDelChoferNacional[]} datosDelChoferNacionalModification
   * Array que contiene la información de choferes nacionales que serán modificados.
   */
  datosDelChoferNacionalModification: DatosDelChoferNacional[];

  /**
   * Lista de choferes nacionales para operaciones de retirada.
   * 
   * @property {DatosDelChoferNacional[]} datosDelChoferNacionalRetirada
   * Array que contiene la información de choferes nacionales que serán retirados.
   */
  datosDelChoferNacionalRetirada: DatosDelChoferNacional[];

  /**
   * Lista de choferes extranjeros para operaciones de alta.
   * 
   * @property {ChoferesExtranjeros[]} datosDelChoferExtranjerosAlta
   * Array que contiene la información de choferes extranjeros que serán dados de alta.
   */
  datosDelChoferExtranjerosAlta: ChoferesExtranjeros[];

  /**
   * Lista de choferes extranjeros para operaciones de modificación.
   * 
   * @property {ChoferesExtranjeros[]} datosDelChoferExtranjerosModification
   * Array que contiene la información de choferes extranjeros que serán modificados.
   */
  datosDelChoferExtranjerosModification: ChoferesExtranjeros[];

  /**
   * Lista de choferes extranjeros para operaciones de retirada.
   * 
   * @property {ChoferesExtranjeros[]} datosDelChoferExtranjerosRetirada
   * Array que contiene la información de choferes extranjeros que serán retirados.
   */
  datosDelChoferExtranjerosRetirada: ChoferesExtranjeros[];
}

/**
 * Función factory para crear el estado inicial de los choferes.
 * 
 * Inicializa todos los campos del estado con valores vacíos por defecto,
 * proporcionando un estado limpio y consistente para el inicio de la aplicación.
 * Esta función es utilizada por la tienda Akita para establecer el estado base.
 * 
 * Todos los campos de texto se inicializan como cadenas vacías y todos los
 * arrays se inicializan como arrays vacíos para evitar errores de referencia nula.
 * 
 * @function createChoferState
 * @returns {Choferesnacionales40102State} El estado inicial con valores por defecto
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
export function createChoferState(): Choferesnacionales40102State {
  return {
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    solicitudeId: '',
    isShowDirector: false,
    codigo: '00',
    cadenaOriginal: '',
    catErrorMessage: '',
    isCaat: false,
    IdPersonaSolicitud: "",
    datosDelChoferNacionalAlta: [],
    datosDelChoferNacionalModification: [],
    datosDelChoferNacionalRetirada: [],

    datosDelChoferExtranjerosAlta: [],
    datosDelChoferExtranjerosModification: [],
    datosDelChoferExtranjerosRetirada: [],
  };
}

/**
 * Tienda Akita para la gestión del estado de choferes en el trámite 40102.
 * 
 * Esta clase extiende la tienda base de Akita y proporciona métodos específicos
 * para actualizar el estado de los choferes. Incluye funcionalidades para:
 * 
 * - Gestión de datos personales (nombres, apellidos, documentos)
 * - Manejo de información domiciliaria (direcciones, códigos postales)
 * - Control de datos de contacto (teléfonos, correos electrónicos)
 * - Administración de información vehicular
 * - Gestión de catálogos y listas auxiliares
 * 
 * La tienda implementa el patrón inmutable para garantizar la integridad del estado
 * y utiliza el decorador @StoreConfig para configurar opciones específicas de Akita.
 * 
 * @class Chofer40102Store
 * @extends {Store<Choferesnacionales40102State>}
 * @injectable
 * @providedIn 'root'
 * 
 * @example
 * ```typescript
 * // Inyectar en un componente
 * constructor(private choferStore: Chofer40102Store) {}
 * 
 * // Actualizar el nombre del chofer
 * this.choferStore.setNombre('Juan Carlos');
 * 
 * // Actualizar primer apellido
 * this.choferStore.setPrimerApellido('García');
 * 
 * // Limpiar el estado
 * this.choferStore.clearChoferes();
 * ```
 * 
 * @since 1.0.0
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'chofer40102', resettable: true })
export class Chofer40102Store extends Store<Choferesnacionales40102State> {
  /**
   * Constructor de la tienda Chofer40102Store.
   * 
   * Inicializa la tienda con el estado por defecto creado por la función
   * createChoferState(). El constructor llama al constructor padre de Store
   * pasando el estado inicial como parámetro.
   * 
   * @constructor
   * 
   * @example
   * ```typescript
   * // La tienda se inyecta automáticamente mediante Angular DI
   * // No es necesario instanciarla manualmente
   * constructor(private choferStore: Chofer40102Store) {
   *   // La tienda ya está inicializada con el estado por defecto
   * }
   * ```
   */
  constructor() {
    super(createChoferState());
  }

  /**
   * Establece la lista de choferes nacionales en el estado.
   * 
   * Actualiza el estado global con una nueva lista de choferes,
   * reemplazando completamente la lista existente. Utiliza el
   * patrón inmutable para garantizar la integridad del estado.
   * 
   * @method set
   * @param {Chofer[]} nacionalArray - Lista de choferes nacionales a establecer
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const choferes: Chofer[] = [
   *   { id: 1, nombre: 'Juan', apellido: 'García' },
   *   { id: 2, nombre: 'María', apellido: 'López' }
   * ];
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

  /**
   * Establece el CURP (Clave Única de Registro de Población) del chofer.
   * 
   * Actualiza el estado con el CURP proporcionado, que es el documento
   * de identificación oficial único para ciudadanos mexicanos. Este campo
   * es obligatorio para choferes nacionales y debe seguir el formato
   * estándar de 18 caracteres alfanuméricos.
   * 
   * @method setCurp
   * @param {string} curp - El CURP del chofer (18 caracteres alfanuméricos)
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const curp = 'GALE820101HDFRNR05';
   * this.choferStore.setCurp(curp);
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

  public setIdPersonaSolicitud(IdPersonaSolicitud: string): void {
    this.update((state) => ({
      ...state,
      IdPersonaSolicitud,
    }));
  }

  public setCadenaOriginal(cadenaOriginal: string): void {
    this.update((state) => ({
      ...state,
      cadenaOriginal,
    }));
  }


  /**
   * Establece el primer apellido del chofer.
   * 
   * Actualiza el estado con el primer apellido (apellido paterno) del chofer.
   * Este campo es obligatorio para la identificación correcta del conductor
   * y debe coincidir con la documentación oficial presentada.
   * 
   * @method setPrimerApellido
   * @param {string} primerApellido - El primer apellido del chofer
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const apellido = 'García';
   * this.choferStore.setPrimerApellido(apellido);
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

  public setCodigo(codigo: string): void {
    this.update((state) => ({
      ...state,
      codigo,
    }));
  }

  /**
   * Establece el RFC (Registro Federal de Contribuyentes) del chofer.
   * 
   * Actualiza el estado con el RFC proporcionado, que es la clave de identificación
   * fiscal utilizada en México. Para personas físicas, consta de 13 caracteres
   * alfanuméricos derivados del nombre completo y fecha de nacimiento.
   * 
   * @method setRfc
   * @param {string} rfc - El RFC del chofer (13 caracteres para personas físicas)
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const rfc = 'GALE820101H45';
   * this.choferStore.setRfc(rfc);
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
   * Establece el segundo apellido del chofer.
   * 
   * Actualiza el estado con el segundo apellido (apellido materno) del chofer.
   * Este campo puede ser opcional dependiendo de la documentación del conductor,
   * pero es recomendable completarlo para una identificación más precisa.
   * 
   * @method setSegundoApellido
   * @param {string} segundoApellido - El segundo apellido del chofer
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const segundoApellido = 'López';
   * this.choferStore.setSegundoApellido(segundoApellido);
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

  public setIsShowDirector(isShowDirector: boolean): void {
    this.update((state) => ({
      ...state,
      isShowDirector,
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
   * Establece el gafete del chofer.
   * @param gafete El gafete del chofer.
   * @returns void
   */
  public setGafete(gafete: string): void {
    this.update((state) => ({ ...state, gafete }));
  }

  /**
   * Establece la vigencia del gafete del chofer.
   * @param vigenciagafete La vigencia del gafete.
   * @returns void
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
   * Establece el correo electrónico de contacto del chofer.
   * 
   * Actualiza el estado con la dirección de correo electrónico proporcionada.
   * Este campo es importante para comunicaciones oficiales y notificaciones
   * relacionadas con el trámite. Debe ser una dirección válida y activa.
   * 
   * @method setCorreo
   * @param {string} correo - La dirección de correo electrónico del chofer
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const email = 'juan.garcia@email.com';
   * this.choferStore.setCorreo(email);
   * ```
   * 
   * @since 1.0.0
   */
  public setCorreo(correo: string): void {
    this.update((state) => ({ ...state, correo }));
  }

  /**
   * Establece el número de teléfono de contacto del chofer.
   * 
   * Actualiza el estado con el número telefónico proporcionado. Este contacto
   * es fundamental para comunicaciones urgentes y verificaciones durante el
   * proceso del trámite. Se recomienda incluir código de área para llamadas
   * de larga distancia.
   * 
   * @method setTelefono
   * @param {string} telefono - El número de teléfono del chofer (incluir código de área)
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const telefono = '5551234567';
   * this.choferStore.setTelefono(telefono);
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

  public setSolicitudeId(solicitudeId: string): void {
    this.update((state) => ({ ...state, solicitudeId }));
  }

  /**
   * Establece el nombre del chofer.
   * @param nombre El nombre del chofer.
   * @returns void
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

  public setIsCaat(isCaat: boolean): void {
    this.update((state) => ({
      ...state,
      isCaat,
    }));
  }

  public setCatErrorMessage(catErrorMessage: string): void {
    this.update((state) => ({
      ...state,
      catErrorMessage,
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
   * Establece la lista de catálogos de estados disponibles.
   * 
   * Actualiza el estado con la lista completa de estados o entidades federativas
   * disponibles en el sistema. Esta información es utilizada para poblar controles
   * de selección en formularios de domicilio y para validaciones geográficas.
   * 
   * @method setEstado
   * @param {Catalogo[]} estado - Array de objetos Catalogo con información de estados
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const estados: Catalogo[] = [
   *   { clave: '09', descripcion: 'Ciudad de México' },
   *   { clave: '15', descripcion: 'Estado de México' }
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
   * Limpia completamente el estado de la tienda de choferes.
   * 
   * Restablece la tienda a su estado inicial utilizando el método reset() de Akita.
   * Esta operación elimina todos los datos almacenados y devuelve la tienda
   * al estado por defecto definido en createChoferState(). Es útil para
   * limpiar formularios o reiniciar procesos.
   * 
   * @method clearChoferes
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Limpiar todos los datos al cambiar de trámite
   * this.choferStore.clearChoferes();
   * 
   * // Verificar que se limpió correctamente
   * this.choferQuery.select().subscribe(state => {
   *   console.log(state.nombre); // ''
   *   console.log(state.datosDelChoferNacionalAlta); // []
   * });
   * ```
   * 
   * @since 1.0.0
   */
  public clearChoferes(): void {
    this.reset();
  }
}
