/**
 * @fileoverview Store para el manejo del estado del trámite 300105
 * 
 * Este archivo contiene la definición del estado, funciones utilitarias y el store
 * principal para el trámite 300105 de autorización de equipos de rayos X.
 * Utiliza el patrón Akita para manejo de estado inmutable y reactivo.
 * 
 * Funcionalidades principales:
 * - Definición de la estructura del estado
 * - Inicialización del estado por defecto
 * - Operaciones de actualización del estado
 * - Métodos específicos para mercancías y destinatarios
 * 
 * @author VUCEM Development Team
 * @since 1.0.0
 * @version 1.0.0
 */

import { Store, StoreConfig } from '@datorama/akita';
import { ConfiguracionItem } from '../enum/mercancia-tabla.enum';
import { DestinatarioConfiguracionItem } from '../enum/destinatario-tabla.enum';
import { Injectable } from '@angular/core';

/**
 * @interface Tramite300105State
 * @description Define la estructura completa del estado para el trámite 300105 de autorización
 * de equipos de rayos X. Esta interfaz establece todos los campos necesarios para gestionar
 * el ciclo completo del trámite, desde la captura de datos hasta el pago de derechos.
 * 
 * El estado incluye información sobre:
 * - Control de mercancías y equipos de rayos X
 * - Datos de destinatarios y responsables
 * - Información de pagos y referencias
 * - Estados de autorización y exención
 * - Configuraciones de visualización (popups, controles)
 * 
 * @example
 * ```typescript
 * // Ejemplo de estado completo
 * const estadoEjemplo: Tramite300105State = {
 *   mercacniaSolicitudControlar: true,
 *   mercanciaTablaDatos: [
 *     {
 *       id: 1,
 *       marca: 'SIEMENS',
 *       modelo: 'AXIOM',
 *       serie: 'XR-001'
 *       // ... más propiedades
 *     }
 *   ],
 *   observaciones: 'Equipo para uso médico',
 *   // ... más propiedades
 * };
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 */
export interface Tramite300105State {
  /**
   * @property {boolean} mercacniaSolicitudControlar
   * @description Indica si se debe controlar la mercancía en la solicitud.
   * Cuando es true, se aplican validaciones adicionales sobre los equipos de rayos X.
   * Este campo determina el flujo de validación que seguirá el trámite.
   * 
   * @example
   * ```typescript
   * // Uso en validaciones
   * if (estado.mercacniaSolicitudControlar) {
   *   // Aplicar validaciones estrictas
   *   validarEspecificacionesTecnicas();
   * }
   * ```
   * 
   * @since 1.0.0
   */
  mercacniaSolicitudControlar: boolean;

  /**
   * @property {string} observaciones
   * @description Observaciones relacionadas con el trámite ingresadas por el usuario.
   * Campo de texto libre que permite agregar comentarios, aclaraciones o
   * información adicional relevante para el proceso de autorización.
   * 
   * @example
   * ```typescript
   * // Actualización de observaciones
   * store.update({ 
   *   observaciones: 'Equipo destinado para uso en hospital público'
   * });
   * ```
   * 
   * @since 1.0.0
   */
  observaciones: string;

  /**
   * @property {boolean} tercerosPopupState
   * @description Estado del popup de terceros relacionados con el trámite.
   * Controla la visibilidad del modal que permite gestionar terceros
   * involucrados en el proceso de autorización.
   * 
   * @example
   * ```typescript
   * // Abrir popup de terceros
   * store.update({ tercerosPopupState: true });
   * ```
   * 
   * @since 1.0.0
   */
  tercerosPopupState: boolean;

  /**
   * @property {ConfiguracionItem[]} mercanciaTablaDatos
   * @description Datos de la tabla de mercancías (equipos de rayos X) asociadas al trámite.
   * Array que contiene la información técnica completa de cada equipo que requiere
   * autorización, incluyendo especificaciones, marca, modelo y características técnicas.
   * 
   * @example
   * ```typescript
   * // Agregar nuevo equipo
   * const nuevoEquipo: ConfiguracionItem = {
   *   id: 1,
   *   marca: 'PHILIPS',
   *   modelo: 'DIGITAL',
   *   serie: 'DR-002',
   *   voltaje: '125',
   *   corriente: '400'
   * };
   * ```
   * 
   * @since 1.0.0
   */
  mercanciaTablaDatos: ConfiguracionItem[];

  /**
   * @property {DestinatarioConfiguracionItem[]} destinatarioTablaDatos
   * @description Datos de la tabla de destinatarios asociados al trámite.
   * Array que contiene la información de las personas o entidades que recibirán
   * los equipos de rayos X autorizados.
   * 
   * @example
   * ```typescript
   * // Agregar destinatario
   * const destinatario: DestinatarioConfiguracionItem = {
   *   id: 1,
   *   nombre: 'Hospital General',
   *   direccion: 'Av. Principal 123'
   * };
   * ```
   * 
   * @since 1.0.0
   */
  destinatarioTablaDatos: DestinatarioConfiguracionItem[];

  /**
   * @property {string} claveDeReferencia
   * @description Clave de referencia única del trámite.
   * Identificador que permite rastrear y referenciar el trámite
   * en el sistema gubernamental.
   * 
   * @since 1.0.0
   */
  claveDeReferencia: string;

  /**
   * @property {string} cadenaDependencia
   * @description Cadena de dependencia asociada al trámite.
   * Información sobre las dependencias gubernamentales involucradas
   * en el proceso de autorización.
   * 
   * @since 1.0.0
   */
  cadenaDependencia: string;

  /**
   * @property {string} banco
   * @description Banco relacionado con el trámite para el pago de derechos.
   * Información de la institución bancaria donde se realizará el pago
   * de los derechos correspondientes al trámite.
   * 
   * @since 1.0.0
   */
  banco: string;

  /**
   * @property {string} llaveDePago
   * @description Llave de pago asociada al trámite.
   * Código único que identifica el pago realizado para cubrir
   * los derechos del trámite de autorización.
   * 
   * @since 1.0.0
   */
  llaveDePago: string;

  /**
   * @property {string} fechaPago
   * @description Fecha de pago asociada al trámite.
   * Fecha en que se realizó el pago de los derechos correspondientes
   * al trámite de autorización.
   * 
   * @since 1.0.0
   */
  fechaPago: string;

  /**
   * @property {string} importePago
   * @description Importe del pago asociado al trámite.
   * Cantidad monetaria que se debe pagar o se pagó por concepto
   * de derechos del trámite de autorización.
   * 
   * @since 1.0.0
   */
  importePago: string;

  /**
   * @property {string} [numeroExpediente]
   * @description Número de expediente del trámite (opcional).
   * Identificador único asignado por la autoridad para el seguimiento
   * del expediente del trámite.
   * 
   * @since 1.0.0
   */
  numeroExpediente?: string;

  /**
   * @property {string} [tipoOperacion]
   * @description Tipo de operación asociada al trámite (opcional).
   * Categoría que define el tipo específico de operación que se realiza
   * con los equipos de rayos X.
   * 
   * @since 1.0.0
   */
  tipoOperacion?: string;

  /**
   * @property {string} [finalidad]
   * @description Finalidad del trámite (opcional).
   * Descripción del propósito o uso previsto para los equipos de rayos X
   * que se están autorizando.
   * 
   * @since 1.0.0
   */
  finalidad?: string;

  /**
   * @property {boolean} [isExento]
   * @description Indica si el trámite está exento de ciertos requisitos (opcional).
   * Cuando es true, el trámite puede omitir algunos pasos del proceso normal
   * de autorización debido a exenciones aplicables.
   * 
   * @since 1.0.0
   */
  isExento?: boolean;

  /**
   * @property {boolean} [isAutorizacion]
   * @description Indica si el trámite tiene autorización concedida (opcional).
   * Campo que refleja el estado de aprobación del trámite por parte
   * de las autoridades competentes.
   * 
   * @since 1.0.0
   */
  isAutorizacion?: boolean;

  /**
   * @property {string} [numAutorizacion1]
   * @description Número de autorización principal (opcional).
   * Primer código de autorización asignado por la autoridad competente
   * para los equipos de rayos X solicitados.
   * 
   * @since 1.0.0
   */
  numAutorizacion1?: string;

  /**
   * @property {string} [numAutorizacion2]
   * @description Número de autorización secundario (opcional).
   * Segundo código de autorización que puede ser requerido
   * en casos específicos o para equipos adicionales.
   * 
   * @since 1.0.0
   */
  numAutorizacion2?: string;

  /**
   * @property {string} [numAutorizacion3]
   * @description Número de autorización terciario (opcional).
   * Tercer código de autorización para casos que requieren
   * múltiples niveles de aprobación o equipos especiales.
   * 
   * @since 1.0.0
   */
  numAutorizacion3?: string;
}

/**
 * @function createInitialState
 * @description Crea el estado inicial para el trámite 300105 con valores por defecto.
 * Esta función establece la configuración base del estado que se utiliza cuando
 * se inicializa el store por primera vez o cuando se resetea el estado.
 * 
 * Valores iniciales establecidos:
 * - Arrays vacíos para datos de tablas
 * - Strings vacíos para campos de texto
 * - Booleanos con valores lógicos por defecto
 * - Control de mercancía activado por defecto
 * 
 * @returns {Tramite300105State} Estado inicial del trámite con valores por defecto
 * 
 * @example
 * ```typescript
 * // Uso directo de la función
 * const estadoInicial = createInitialState();
 * console.log(estadoInicial.mercacniaSolicitudControlar); // true
 * console.log(estadoInicial.mercanciaTablaDatos); // []
 * ```
 * 
 * @example
 * ```typescript
 * // Uso en reset del store
 * store.reset();
 * // Internamente llama a createInitialState()
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 */
export function createInitialState(): Tramite300105State {
  return {
    mercacniaSolicitudControlar: true,
    mercanciaTablaDatos: [],
    destinatarioTablaDatos: [],
    observaciones: '',
    tercerosPopupState: false,
    claveDeReferencia: '',
    cadenaDependencia: '',
    banco: '',
    llaveDePago: '',
    fechaPago: '',
    importePago: '',
    numeroExpediente: '',
    tipoOperacion: '',
    finalidad: '',
    isExento: false,
    isAutorizacion: false,
    numAutorizacion1: '',
    numAutorizacion2: '',
    numAutorizacion3: '',
  };
}

/**
 * @class Tramite300105Store
 * @description Clase que representa el store del estado del trámite 300105 para autorización
 * de equipos de rayos X. Esta clase extiende la funcionalidad base de Akita Store
 * para proporcionar operaciones específicas de actualización del estado del trámite.
 * 
 * Características principales:
 * - Estado inmutable con actualizaciones controladas
 * - Métodos específicos para diferentes tipos de datos
 * - Configuración de reseteo automático
 * - Inyección de dependencias con Angular
 * - Tipado fuerte con TypeScript
 * 
 * El store está configurado como resettable, lo que permite volver al estado
 * inicial cuando sea necesario, y como singleton a nivel de aplicación.
 * 
 * @extends {Store<Tramite300105State>}
 * 
 * @example
 * ```typescript
 * // Uso en un servicio
 * @Injectable()
 * export class TramiteService {
 *   constructor(private store: Tramite300105Store) {}
 *   
 *   actualizarObservaciones(texto: string) {
 *     this.store.establecerDatos({ observaciones: texto });
 *   }
 * }
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite300105', resettable: true })
export class Tramite300105Store extends Store<Tramite300105State> {
  
  /**
   * @constructor
   * @description Inicializa el store con el estado inicial del trámite 300105.
   * El constructor llama al estado inicial creado por createInitialState()
   * y establece la configuración base del store.
   * 
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por Angular
   * // cuando se inyecta el store en un servicio o componente
   * constructor(private store: Tramite300105Store) {
   *   // El store ya está inicializado y listo para usar
   * }
   * ```
   * 
   * @since 1.0.0
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @method establecerDatos
   * @description Actualiza el estado con los nuevos datos proporcionados de forma parcial.
   * Este método permite actualizar cualquier combinación de propiedades del estado
   * sin afectar las propiedades no especificadas. Utiliza el patrón de spread operator
   * para mantener la inmutabilidad del estado.
   * 
   * @param {Partial<Tramite300105State>} datos - Objeto con las propiedades del estado a actualizar.
   *                                               Solo se requieren las propiedades que se desean cambiar.
   * 
   * @example
   * ```typescript
   * // Actualizar solo observaciones
   * store.establecerDatos({ 
   *   observaciones: 'Nueva observación del trámite' 
   * });
   * ```
   * 
   * @example
   * ```typescript
   * // Actualizar múltiples propiedades
   * store.establecerDatos({
   *   observaciones: 'Trámite procesado',
   *   isAutorizacion: true,
   *   numAutorizacion1: 'AUTH-001'
   * });
   * ```
   * 
   * @since 1.0.0
   */
  public establecerDatos(datos: Partial<Tramite300105State>): void {
    this.update((state) => ({
      ...state,
      ...datos,
    }));
  }

  /**
   * @method setMercanciaTablaDatos
   * @description Actualiza específicamente los datos de la tabla de mercancías en el estado.
   * Este método está diseñado para gestionar exclusivamente la información de los equipos
   * de rayos X que forman parte del trámite de autorización.
   * 
   * @param {ConfiguracionItem[]} mercanciaTablaDatos - Array con los datos completos de los equipos
   *                                                    de rayos X que reemplazará la información actual
   * 
   * @example
   * ```typescript
   * // Actualizar tabla de mercancías
   * const equipos: ConfiguracionItem[] = [
   *   {
   *     id: 1,
   *     marca: 'SIEMENS',
   *     modelo: 'MULTIX',
   *     serie: 'MX-2023-001',
   *     voltaje: '150',
   *     corriente: '500'
   *   }
   * ];
   * store.setMercanciaTablaDatos(equipos);
   * ```
   * 
   * @since 1.0.0
   */
  public setMercanciaTablaDatos(mercanciaTablaDatos: ConfiguracionItem[]): void {
    this.update((state) => ({
      ...state,
      mercanciaTablaDatos,
    }));
  }

  /**
   * @method setDestinatarioTablaDatos
   * @description Actualiza específicamente los datos de la tabla de destinatarios en el estado.
   * Este método gestiona exclusivamente la información de las personas o entidades
   * que recibirán los equipos de rayos X autorizados.
   * 
   * @param {DestinatarioConfiguracionItem[]} destinatarioTablaDatos - Array con los datos completos
   *                                                                   de destinatarios que reemplazará la información actual
   * 
   * @example
   * ```typescript
   * // Actualizar tabla de destinatarios
   * const destinatarios: DestinatarioConfiguracionItem[] = [
   *   {
   *     id: 1,
   *     nombre: 'Hospital General de México',
   *     direccion: 'Dr. Balmis 148, Doctores',
   *     telefono: '555-1234',
   *     email: 'admin@hgm.gob.mx'
   *   }
   * ];
   * store.setDestinatarioTablaDatos(destinatarios);
   * ```
   * 
   * @since 1.0.0
   */
  public setDestinatarioTablaDatos(destinatarioTablaDatos: DestinatarioConfiguracionItem[]): void {
    this.update((state) => ({
      ...state,
      destinatarioTablaDatos,
    }));
  }

  /**
   * @method setllaveDePago
   * @description Actualiza específicamente la llave de pago en el estado del trámite.
   * Este método gestiona exclusivamente el código único que identifica el pago
   * realizado para cubrir los derechos del trámite de autorización.
   * 
   * @param {string} llaveDePago - Código único de pago que identifica la transacción
   *                               realizada para cubrir los derechos del trámite
   * 
   * @example
   * ```typescript
   * // Actualizar llave de pago después de procesar el pago
   * store.setllaveDePago('PAY-300105-2023-001234');
   * ```
   * 
   * @example
   * ```typescript
   * // Limpiar llave de pago
   * store.setllaveDePago('');
   * ```
   * 
   * @since 1.0.0
   */
  public setllaveDePago(llaveDePago: string): void {
    this.update((state) => ({
      ...state,
      llaveDePago,
    }));
  }
}