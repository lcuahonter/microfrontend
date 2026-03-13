import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { ConstanciaTramiteConfiguracion } from '@libs/shared/data-access-user/src/core/models/shared/acuse-y-resoluciones-folio-tramite.model';

import { AsociadasTableColumns, FitosanitarioForm, HistoricoColumns } from '../models/elegibilidad-de-textiles.model';
import { FabricanteNacionalRfcResponse } from '../models/response/fabricante-nacional-response.model';
import { Injectable } from '@angular/core';

/**
 * @interface TextilesState
 * @description
 * Representa el estado completo de la sección de elegibilidad de textiles del trámite 120301.
 * Esta interfaz define todas las propiedades necesarias para gestionar la información
 * relacionada con el proceso de elegibilidad de productos textiles, incluyendo datos
 * del exportador, importador, facturas, constancias y configuraciones específicas.
 * 
 * @export
 * @since 1.0.0
 * @version 1.0.0
 * @author Sistema VUCEM 3.0
 * 
 * @example
 * ```typescript
 * // Implementación básica del estado
 * const estadoTextiles: TextilesState = {
 *   numeroFactura: 'FAC-001',
 *   cantidadTotal: '1000',
 *   unidadDeMedida: 'METROS',
 *   // ... resto de propiedades
 * };
 * ```
 */
export interface TextilesState {
  /**
 * @property {FitosanitarioForm} FitosanitarioForm
 * Estado del formulario de solicitud que contiene la información básica del trámite.
 */
  SolicitudState: FitosanitarioForm;

  /** 
   * Número de factura asociado al trámite.
   * @type {string}
   * @description Identificador único de la factura comercial relacionada con los textiles.
   */
  numeroFactura: string;

  exportadorFabricanteNacional: string;

  listaFabricantes: HistoricoColumns[];

  /** 
   * Cantidad total de textiles.
   * @type {string}
   * @description Cantidad total de productos textiles incluidos en el trámite.
   */
  cantidadTotal: string;

  /**
   * Lista completa de fabricantes nacionales con RFC.
   * @type {FabricanteNacionalRfcResponse[]}
   * @description Array que contiene los datos de todos los fabricantes nacionales registrados, incluyendo su RFC.
   */
  listaFabricantesCompleta: FabricanteNacionalRfcResponse[];

  /** 
   * Unidad de medida utilizada.
   * @type {string}
   * @description Unidad de medida estándar para cuantificar los textiles (metros, kg, piezas, etc.).
   */
  unidadDeMedida: string;

  /** 
   * Fecha de inicio del trámite.
   * @type {string}
   * @description Fecha en que se inicia el proceso del trámite, en formato ISO.
   */
  fechaInicioInput: string;

  /** 
   * Valor en dólares de los textiles.
   * @type {string}
   * @description Valor monetario total de los textiles expresado en dólares estadounidenses.
   */
  valorDolares: string;

  /** 
   * Identificación fiscal del exportador.
   * @type {string}
   * @description Tax ID o identificación fiscal del exportador de los textiles.
   */
  taxId: string;

  /** 
   * Razón social del exportador.
   * @type {string}
   * @description Nombre legal o razón social completa del exportador.
   */
  razonSocial: string;

  /** 
   * Calle del domicilio del exportador.
   * @type {string}
   * @description Dirección de la calle donde está ubicado el exportador.
   */
  calle: string;

  /** 
   * Ciudad del domicilio del exportador.
   * @type {string}
   * @description Ciudad donde está ubicado el exportador.
   */
  ciudad: string;

  /** 
   * Código postal del domicilio del exportador.
   * @type {string}
   * @description Código postal del domicilio del exportador.
   */
  cp: string;

  /** 
   * País del exportador.
   * @type {string}
   * @description País de origen o ubicación del exportador.
   */
  pais: string;

  /** 
   * Fecha de expedición de la factura.
   * @type {string}
   * @description Fecha en que se expidió la factura, en formato ISO.
   */
  fechaExpedicionFactura: string;

  /** 
   * Registro seleccionado en el formulario.
   * @type {string}
   * @description Valor del radio button o selección de registro en el formulario.
   */
  flexRadioRegistro: string;

  /** 
   * Estado del trámite.
   * @type {string}
   * @description Estado actual del proceso del trámite (en proceso, completado, etc.).
   */
  estado: string;

  /** 
   * Representación federal asociada.
   * @type {string}
   * @description Información de la representación federal relacionada con el trámite.
   */
  representacionFederal: string;

  /** 
   * Fracción arancelaria de los textiles.
   * @type {string}
   * @description Código de clasificación arancelaria específico para los productos textiles.
   */
  fraccionArancelaria: string;

  /** 
   * Descripción del producto textil.
   * @type {string}
   * @description Descripción detallada de los productos textiles incluidos en el trámite.
   */
  descripcionProducto: string;

  /** 
   * Tratado comercial aplicable.
   * @type {string}
   * @description Tratado o acuerdo comercial que aplica a la transacción de textiles.
   */
  tratado: string;

  /** 
   * Subproducto relacionado.
   * @type {string}
   * @description Clasificación específica del subproducto textil.
   */
  subproducto: string;

  /** 
   * Mecanismo de operación.
   * @type {string}
   * @description Mecanismo o procedimiento de operación comercial aplicable.
   */
  mecanismo: string;

  /** 
   * Tipo de categoría del textil.
   * @type {string}
   * @description Categoría específica del producto textil según regulaciones.
   */
  typoCategoria: string;

  /** 
   * Tipo de régimen aplicable.
   * @type {string}
   * @description Régimen aduanero o comercial que aplica a los textiles.
   */
  typoRegimen: string;

  /** 
   * Descripción de la categoría textil.
   * @type {string}
   * @description Descripción detallada de la categoría de producto textil.
   */
  descripcionCategoriaTextil: string;

  /** 
   * País de destino de los textiles.
   * @type {string}
   * @description País donde se destinan o importan los productos textiles.
   */
  PaisDestino: string;

  /** 
   * Unidad de medida de la categoría textil.
   * @type {string}
   * @description Unidad de medida específica para la categoría de textil seleccionada.
   */
  unidadMedidaCategoriaTextil: string;

  /** 
   * Factor de conversión de la categoría textil.
   * @type {string}
   * @description Factor matemático para convertir entre diferentes unidades de medida.
   */
  factorConversionCategoriaTextil: string;

  /** 
   * Fecha de inicio de vigencia.
   * @type {string}
   * @description Fecha desde la cual es válida la elegibilidad de los textiles.
   */
  fechaInicioVigencia: string;

  /** 
   * Fecha de fin de vigencia.
   * @type {string}
   * @description Fecha hasta la cual es válida la elegibilidad de los textiles.
   */
  fechaFinVigencia: string;

  /** 
   * Cantidad de facturas asociadas.
   * @type {string}
   * @description Número total de facturas asociadas al trámite.
   */
  cantidadFacturas: string;

  /**
   * Facturas asociadas al trámite.
   * @type {AsociadasTableColumns[]}
   * @description Array que contiene los datos de las facturas asociadas al trámite, incluyendo detalles relevantes para cada una.
   * */
  facturasAsociadas: AsociadasTableColumns[];

  /** 
   * Indica si el exportador y fabricante son el mismo.
   * @type {string}
   * @description Bandera que indica si el exportador y el fabricante son la misma entidad.
   */
  exportadorFabricanteMismo: string;

  /** 
   * Número de registro fiscal del exportador.
   * @type {string}
   * @description Número oficial de registro fiscal del exportador ante autoridades.
   */
  numeroRegistroFiscal: string;

  /** 
   * Tipo de trámite.
   * @type {string}
   * @description Clasificación específica del tipo de trámite siendo procesado.
   */
  tipo: string;

  /** 
   * Cantidad total del importador.
   * @type {string}
   * @description Cantidad total de textiles desde la perspectiva del importador.
   */
  cantidadTotalImportador: string;

  /** 
   * Razón social del importador.
   * @type {string}
   * @description Nombre legal completo del importador de los textiles.
   */
  razonSocialImportador: string;

  /** 
   * Domicilio del importador.
   * @type {string}
   * @description Dirección completa del domicilio del importador.
   */
  domicilio: string;

  /** 
   * Ciudad del importador.
   * @type {string}
   * @description Ciudad donde está ubicado el importador.
   */
  ciudadImportador: string;

  /** 
   * Código postal del importador.
   * @type {string}
   * @description Código postal del domicilio del importador.
   */
  cpImportador: string;

  /** 
   * País del importador.
   * @type {string}
   * @description País donde está ubicado el importador.
   */
  PaisImportador: string;

  /** 
   * Lista de formas válidas de operación.
   * @type {Catalogo[]}
   * @description Array de catálogos que contiene las formas válidas de operación comercial.
   */
  formaValida: Catalogo[];

  /** 
   * Metros cuadrados equivalentes de los textiles.
   * @type {number}
   * @description Medida en metros cuadrados equivalentes de los productos textiles.
   */
  metrosCuadradosEquivalentes: number;

  /** 
   * Cantidad total de facturas.
   * @type {number}
   * @description Número total de facturas asociadas al trámite.
   */
  cantidadFacturasTotal: number;

  /** 
   * Año de la constancia.
   * @type {string}
   * @description Año correspondiente a la constancia de registro.
   */
  anoDeLaConstancia: string;

  /**
   * Número de la constancia.
   * @type {string}
   * @description Número único de identificación de la constancia emitida.
   */
  numeroDeLaConstancia: string;

  /**
   * Datos de la tabla de constancia del registro.
   * @type {ConstanciaTramiteConfiguracion[]}
   * @description Array con los datos de configuración de la tabla de constancia.
   */
  datosTablaConstanciaDelRegistro: ConstanciaTramiteConfiguracion[];

  /**
   * Bandera de guardado.
   * @type {boolean}
   * @description Indica si los datos han sido guardados exitosamente.
   */
  guardarBandera: boolean;

  /**
   * Indica si las facturas son requeridas.
   * @property {boolean} facturasRequeridos
   * @description Bandera que indica si la sección de facturas asociadas es obligatoria para continuar con el trámite.
   */
  requiereFactura: boolean;
}

/**
 * Crea y retorna el estado inicial para la sección de elegibilidad de textiles.
 * Esta función factory inicializa todas las propiedades del estado con valores por defecto
 * apropiados para comenzar un nuevo trámite. Los valores incluyen cadenas vacías para
 * campos de texto, arrays vacíos para listas, y valores predeterminados específicos
 * para campos numéricos según los requerimientos del negocio.
 *
 * @returns {TextilesState} El estado inicial completo de tipo TextilesState con todos
 *                         los campos inicializados con valores por defecto apropiados.
 * 
 * @example
 * ```typescript
 * // Crear estado inicial
 * const estadoInicial = createInitialState();
 * console.log(estadoInicial.numeroFactura); // ''
 * console.log(estadoInicial.metrosCuadradosEquivalentes); // 53
 * console.log(estadoInicial.cantidadFacturasTotal); // 5
 * 
 * // Usar en store
 * const store = new ElegibilidadDeTextilesStore();
 * // El constructor ya usa createInitialState() internamente
 * ```
 * 
 * @since 1.0.0
 * @export
 * @public
 * @author Sistema VUCEM 3.0
 * @see {@link TextilesState} - Interfaz del estado retornado
 * @see {@link ElegibilidadDeTextilesStore} - Store que utiliza este estado inicial
 * 
 * @note
 * Los valores predeterminados específicos como metrosCuadradosEquivalentes (53)
 * y cantidadFacturasTotal (5) están definidos según requerimientos del negocio
 * y pueden ajustarse según sea necesario.
 */
export function createInitialState(): TextilesState {
  return {
    SolicitudState: {} as FitosanitarioForm,
    numeroFactura: '',
    exportadorFabricanteNacional: '',
    listaFabricantes: [],
    listaFabricantesCompleta: [],
    cantidadTotal: '',
    unidadDeMedida: '',
    fechaInicioInput: '',
    valorDolares: '',
    taxId: '',
    razonSocial: '',
    calle: '',
    ciudad: '',
    cp: '',
    pais: '',
    flexRadioRegistro: '',
    estado: '',
    representacionFederal: '',
    fraccionArancelaria: '',
    descripcionProducto: '',
    tratado: '',
    subproducto: '',
    mecanismo: '',
    typoCategoria: '',
    typoRegimen: '',
    descripcionCategoriaTextil: '',
    PaisDestino: '',
    unidadMedidaCategoriaTextil: '',
    factorConversionCategoriaTextil: '',
    fechaInicioVigencia: '',
    fechaFinVigencia: '',
    cantidadFacturas: '',
    facturasAsociadas: [],
    exportadorFabricanteMismo: '',
    numeroRegistroFiscal: '',
    tipo: '',
    cantidadTotalImportador: '',
    razonSocialImportador: '',
    domicilio: '',
    ciudadImportador: '',
    cpImportador: '',
    PaisImportador: '',
    formaValida: [],
    metrosCuadradosEquivalentes: 0,
    cantidadFacturasTotal: 0,
    numeroDeLaConstancia: '',
    anoDeLaConstancia: '',
    datosTablaConstanciaDelRegistro: [],
    guardarBandera: false,
    fechaExpedicionFactura: '',
    requiereFactura: false,
  };
}

/**
 * @injectable
 * @class ElegibilidadDeTextilesStore
 * @description
 * Store Akita para gestionar el estado de la sección de elegibilidad de textiles.
 * Proporciona el estado completo y métodos para actualizar propiedades específicas del trámite de elegibilidad de textiles.
 * Este store extiende la funcionalidad de Akita Store para mantener un estado reactivo y centralizado
 * de todos los datos relacionados con el proceso de elegibilidad de textiles del trámite 120301.
 *
 * @extends {Store<TextilesState>}
 * @implements {Injectable}
 * 
 * @property {TextilesState} state - Estado actual de la sección de elegibilidad de textiles.
 *
 * @method constructor Inicializa el store con el estado inicial.
 * @method setTextilesState Actualiza el estado completo del store.
 * @method setNumeroFactura Actualiza el número de factura asociado al trámite.
 * @method setCantidadTotal Actualiza la cantidad total de textiles.
 * @method setUnidadDeMedida Actualiza la unidad de medida utilizada para los textiles.
 * @method setFechaInicioInput Actualiza la fecha de inicio del trámite.
 * @method setValorDolares Actualiza el valor en dólares de los textiles.
 * @method setTaxId Actualiza la identificación fiscal (Tax ID) del exportador.
 * @method setRazonSocial Actualiza la razón social del exportador.
 * @method setCalle Actualiza la calle del domicilio del exportador.
 * @method setCiudad Actualiza la ciudad del domicilio del exportador.
 * @method setCp Actualiza el código postal del domicilio del exportador.
 * @method setPais Actualiza el país del exportador.
 * @method setFlexRadioRegistro Actualiza el registro seleccionado en el formulario.
 * @method setEstado Actualiza el estado del trámite.
 * @method setRepresentacionFederal Actualiza la representación federal asociada.
 * @method setFraccionArancelaria Actualiza la fracción arancelaria de los textiles.
 * @method setDescripcionProducto Actualiza la descripción del producto textil.
 * @method setTratado Actualiza el tratado comercial aplicable.
 * @method setSubproducto Actualiza el subproducto relacionado.
 * @method setMecanismo Actualiza el mecanismo de operación.
 * @method setTypoCategoria Actualiza el tipo de categoría del textil.
 * @method setTypoRegimen Actualiza el tipo de régimen aplicable.
 * @method setDescripcionCategoriaTextil Actualiza la descripción de la categoría textil.
 * @method setPaisDestino Actualiza el país de destino de los textiles.
 * @method setUnidadMedidaCategoriaTextil Actualiza la unidad de medida de la categoría textil.
 * @method setFactorConversionCategoriaTextil Actualiza el factor de conversión de la categoría textil.
 * @method setFechaInicioVigencia Actualiza la fecha de inicio de vigencia.
 * @method setFechaFinVigencia Actualiza la fecha de fin de vigencia.
 * @method setCantidadFacturas Actualiza la cantidad de facturas asociadas.
 * @method setExportadorFabricanteMismo Actualiza si el exportador y fabricante son la misma entidad.
 * @method setNumeroRegistroFiscal Actualiza el número de registro fiscal del exportador.
 * @method setTipo Actualiza el tipo de trámite.
 * @method setCantidadTotalImportador Actualiza la cantidad total del importador.
 * @method setRazonSocialImportador Actualiza la razón social del importador.
 * @method setDomicilio Actualiza el domicilio del importador.
 * @method setCiudadImportador Actualiza la ciudad del importador.
 * @method setCpImportador Actualiza el código postal del importador.
 * @method setPaisImportador Actualiza el país del importador.
 * @method setFormaValida Actualiza la lista de formas válidas de operación.
 * @method setMetrosCuadradosEquivalentes Actualiza los metros cuadrados equivalentes de los textiles.
 * @method setCantidadFacturasTotal Actualiza la cantidad total de facturas.
 * @method setdatosTablaConstanciaDelRegistro Actualiza los datos de la tabla de constancia del registro.
 * @method setguardarBandera Actualiza la bandera de guardado.
 * @method setAnoDeLaConstancia Actualiza el año de la constancia.
 * @method setNumeroDeLaConstancia Actualiza el número de la constancia.
 *
 * @example
 * ```typescript
 * // Inyección del store en un componente
 * constructor(private textilesStore: ElegibilidadDeTextilesStore) {}
 * 
 * // Actualizar el número de factura
 * this.textilesStore.setNumeroFactura('FAC-001');
 * 
 * // Actualizar el estado completo
 * this.textilesStore.setTextilesState(nuevoEstado);
 * ```
 *
 * @since 1.0.0
 * @version 1.0.0
 * @author Sistema VUCEM 3.0
 * @see {@link TextilesState} - Interfaz del estado de textiles
 * @see {@link Store} - Clase base de Akita Store
 * @see {@link createInitialState} - Función para crear el estado inicial
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'seccion', resettable: true })
export class ElegibilidadDeTextilesStore extends Store<TextilesState> {

  /**
   * Constructor de la clase ElegibilidadDeTextilesStore.
   * Inicializa el store con el estado inicial predefinido para el trámite de elegibilidad de textiles.
   * 
   * @constructor
   * @description
   * Crea una nueva instancia del store e inicializa el estado con los valores por defecto
   * definidos en la función createInitialState. Este constructor es llamado automáticamente
   * por el sistema de inyección de dependencias de Angular.
   * 
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por Angular DI
   * // No es necesario instanciarlo manualmente
   * constructor(private store: ElegibilidadDeTextilesStore) {
   *   // El store ya está inicializado y listo para usar
   * }
   * ```
   * 
   * @since 1.0.0
   * @see {@link createInitialState} - Estado inicial del store
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado completo del store con un nuevo estado de textiles.
   * 
   * @description
   * Este método permite reemplazar completamente el estado actual del store con un nuevo estado.
   * Es útil cuando se necesita cargar datos desde una fuente externa o resetear el estado
   * a una configuración específica. Todos los valores existentes serán sobrescritos.
   * 
   * @param {TextilesState} newState - El nuevo estado completo a establecer en el store.
   *                                  Debe contener todas las propiedades requeridas por la interfaz TextilesState.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Cargar un estado desde un servicio
   * const estadoGuardado = await this.serviceTextiles.obtenerEstado();
   * this.textilesStore.setTextilesState(estadoGuardado);
   * 
   * // Resetear a un estado específico
   * const estadoLimpio = {
   *   numeroFactura: '',
   *   cantidadTotal: '0',
   *   // ... resto de propiedades
   * };
   * this.textilesStore.setTextilesState(estadoLimpio);
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   * @see {@link TextilesState} - Interfaz del estado de textiles
   */
  public setTextilesState(newState: TextilesState): void {
    this.update(newState);
  }

  /**
   * Actualiza el número de factura asociado al trámite en el estado.
   * 
   * @description
   * Establece el número de identificación único de la factura relacionada con el trámite
   * de elegibilidad de textiles. Este número es fundamental para el seguimiento y
   * validación del proceso comercial.
   * 
   * @param {string} numeroFactura - El nuevo número de factura a establecer.
   *                                Debe ser una cadena que identifique únicamente la factura.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer número de factura
   * this.textilesStore.setNumeroFactura('FAC-2025-001234');
   * 
   * // Limpiar número de factura
   * this.textilesStore.setNumeroFactura('');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setNumeroFactura(numeroFactura: string): void {
    this.update((state) => ({
      ...state,
      numeroFactura,
    }));
  }

  /**
   * Actualiza la cantidad total de textiles en el estado.
   * 
   * @description
   * Establece la cantidad total de productos textiles incluidos en el trámite.
   * Esta cantidad debe corresponder con la información declarada en las facturas
   * y documentos comerciales asociados.
   * 
   * @param {string} cantidadTotal - La nueva cantidad total de textiles.
   *                                Generalmente expresada como cadena para mantener
   *                                formato y decimales específicos.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer cantidad total
   * this.textilesStore.setCantidadTotal('1500.50');
   * 
   * // Establecer cantidad en cero
   * this.textilesStore.setCantidadTotal('0');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setCantidadTotal(cantidadTotal: string): void {
    this.update((state) => ({
      ...state,
      cantidadTotal,
    }));
  }

  /**
   * Actualiza la unidad de medida utilizada para los textiles en el estado.
   * 
   * @description
   * Establece la unidad de medida estándar que se utiliza para cuantificar
   * los productos textiles. Puede ser metros, kilogramos, piezas, etc.,
   * dependiendo del tipo de textil y las regulaciones aplicables.
   * 
   * @param {string} unidadDeMedida - La nueva unidad de medida a establecer.
   *                                 Debe corresponder con las unidades permitidas
   *                                 en el catálogo oficial.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer unidad de medida
   * this.textilesStore.setUnidadDeMedida('METROS');
   * this.textilesStore.setUnidadDeMedida('KILOGRAMOS');
   * this.textilesStore.setUnidadDeMedida('PIEZAS');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setUnidadDeMedida(unidadDeMedida: string): void {
    this.update((state) => ({
      ...state,
      unidadDeMedida,
    }));
  }

  /**
   * Actualiza la fecha de inicio del trámite en el estado.
   * 
   * @description
   * Establece la fecha en que se inicia el proceso del trámite de elegibilidad
   * de textiles. Esta fecha es importante para determinar la vigencia de
   * regulaciones y tratados comerciales aplicables.
   * 
   * @param {string} fechaInicioInput - La nueva fecha de inicio del trámite.
   *                                   Debe estar en formato de fecha válido,
   *                                   preferiblemente ISO 8601 (YYYY-MM-DD).
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer fecha de inicio
   * this.textilesStore.setFechaInicioInput('2025-06-30');
   * 
   * // Establecer fecha actual
   * const fechaActual = new Date().toISOString().split('T')[0];
   * this.textilesStore.setFechaInicioInput(fechaActual);
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setFechaInicioInput(fechaInicioInput: string): void {
    this.update((state) => ({
      ...state,
      fechaInicioInput,
    }));
  }

  /**
   * Actualiza el valor en dólares de los textiles en el estado.
   * 
   * @description
   * Establece el valor monetario total de los textiles expresado en dólares estadounidenses.
   * Este valor es crucial para determinar aranceles, impuestos y cumplir con
   * regulaciones comerciales internacionales.
   * 
   * @param {string} valorDolares - El nuevo valor en dólares de los textiles.
   *                               Debe incluir decimales para mayor precisión
   *                               en cálculos financieros.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer valor en dólares
   * this.textilesStore.setValorDolares('15000.75');
   * 
   * // Establecer valor formateado
   * const valor = (cantidad * precioPorUnidad).toFixed(2);
   * this.textilesStore.setValorDolares(valor);
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setValorDolares(valorDolares: string): void {
    this.update((state) => ({
      ...state,
      valorDolares,
    }));
  }

  /**
   * Actualiza la identificación fiscal (Tax ID) del exportador en el estado.
   * 
   * @description
   * Establece el número de identificación fiscal o Tax ID del exportador de textiles.
   * Este identificador es crucial para la validación de la entidad exportadora
   * y el cumplimiento de regulaciones fiscales internacionales.
   * 
   * @param {string} taxId - El nuevo Tax ID del exportador.
   *                        Debe ser un identificador fiscal válido según las
   *                        regulaciones del país de origen del exportador.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer Tax ID de exportador estadounidense
   * this.textilesStore.setTaxId('12-3456789');
   * 
   * // Establecer Tax ID de exportador mexicano
   * this.textilesStore.setTaxId('XAXX010101000');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setTaxId(taxId: string): void {
    this.update((state) => ({
      ...state,
      taxId,
    }));
  }

  /**
   * Actualiza la razón social del exportador en el estado.
   * 
   * @description
   * Establece el nombre legal completo o razón social de la empresa exportadora.
   * Esta información debe coincidir exactamente con la registrada en los
   * documentos oficiales y facturas comerciales.
   * 
   * @param {string} razonSocial - La nueva razón social del exportador.
   *                              Debe ser el nombre legal completo de la empresa
   *                              tal como aparece en sus documentos constitutivos.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer razón social completa
   * this.textilesStore.setRazonSocial('Textiles Internacionales S.A. de C.V.');
   * 
   * // Establecer nombre de persona física
   * this.textilesStore.setRazonSocial('Juan Pérez García');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setRazonSocial(razonSocial: string): void {
    this.update((state) => ({
      ...state,
      razonSocial,
    }));
  }

  /**
   * Actualiza la calle del domicilio del exportador en el estado.
   * 
   * @description
   * Establece la dirección de la calle donde está ubicado el exportador.
   * Esta información forma parte del domicilio fiscal y debe coincidir
   * con los registros oficiales de la empresa.
   * 
   * @param {string} calle - La nueva dirección de calle del exportador.
   *                        Debe incluir nombre de la calle, número y
   *                        cualquier información adicional relevante.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer dirección completa
   * this.textilesStore.setCalle('Av. Insurgentes Sur 1234, Col. Del Valle');
   * 
   * // Establecer dirección con número interior
   * this.textilesStore.setCalle('Calle 5 de Mayo 567, Int. 2B');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle,
    }));
  }

  /**
   * Actualiza la ciudad del domicilio del exportador en el estado.
   * 
   * @description
   * Establece la ciudad donde está ubicado el exportador de textiles.
   * Esta información es parte del domicilio fiscal y se utiliza
   * para validaciones geográficas y regulatorias.
   * 
   * @param {string} ciudad - La nueva ciudad del exportador.
   *                         Debe ser el nombre oficial de la ciudad
   *                         según las divisiones administrativas del país.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer ciudad mexicana
   * this.textilesStore.setCiudad('Ciudad de México');
   * 
   * // Establecer ciudad extranjera
   * this.textilesStore.setCiudad('Los Angeles');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setCiudad(ciudad: string): void {
    this.update((state) => ({
      ...state,
      ciudad,
    }));
  }

  /**
   * Actualiza el código postal del domicilio del exportador en el estado.
   * 
   * @description
   * Establece el código postal correspondiente al domicilio del exportador.
   * Este código debe ser válido según el sistema postal del país donde
   * está ubicado el exportador.
   * 
   * @param {string} cp - El nuevo código postal del exportador.
   *                     Debe seguir el formato oficial del sistema postal
   *                     del país correspondiente.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer código postal mexicano
   * this.textilesStore.setCp('03100');
   * 
   * // Establecer código postal estadounidense
   * this.textilesStore.setCp('90210');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setCp(cp: string): void {
    this.update((state) => ({
      ...state,
      cp,
    }));
  }

  /**
   * Actualiza el país del exportador en el estado.
   * 
   * @description
   * Establece el país de origen o ubicación del exportador de textiles.
   * Esta información es fundamental para determinar las regulaciones
   * comerciales, tratados y aranceles aplicables.
   * 
   * @param {string} pais - El nuevo país del exportador.
   *                       Debe ser el nombre oficial del país o su código
   *                       ISO según estándares internacionales.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer país por nombre
   * this.textilesStore.setPais('Estados Unidos');
   * 
   * // Establecer país por código ISO
   * this.textilesStore.setPais('USA');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
   * Actualiza el registro seleccionado en el formulario en el estado.
   * 
   * @description
   * Establece el valor del radio button o elemento de selección de registro
   * en el formulario del trámite. Este valor determina el tipo de registro
   * o modalidad seleccionada por el usuario.
   * 
   * @param {string} flexRadioRegistro - El nuevo valor del registro seleccionado.
   *                                    Representa la opción elegida en el formulario
   *                                    de tipo radio button o similar.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Seleccionar registro tipo A
   * this.textilesStore.setFlexRadioRegistro('registro_a');
   * 
   * // Seleccionar registro especial
   * this.textilesStore.setFlexRadioRegistro('registro_especial');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setFlexRadioRegistro(flexRadioRegistro: string): void {
    this.update((state) => ({
      ...state,
      flexRadioRegistro,
    }));
  }

  /**
   * Actualiza el estado del trámite en el estado.
   * 
   * @description
   * Establece el estado actual del proceso del trámite de elegibilidad de textiles.
   * Este estado puede indicar si el trámite está en proceso, completado,
   * pendiente de documentos, rechazado, etc.
   * 
   * @param {string} estado - El nuevo estado del trámite.
   *                         Debe corresponder con los estados válidos
   *                         definidos en el sistema (ej: 'EN_PROCESO', 'COMPLETADO').
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Marcar trámite en proceso
   * this.textilesStore.setEstado('EN_PROCESO');
   * 
   * // Marcar trámite completado
   * this.textilesStore.setEstado('COMPLETADO');
   * 
   * // Marcar trámite pendiente
   * this.textilesStore.setEstado('PENDIENTE_DOCUMENTOS');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Actualiza la representación federal asociada en el estado.
   * 
   * @description
   * Establece la información de la representación federal que está asociada
   * con el trámite de elegibilidad de textiles. Esta puede incluir información
   * sobre delegaciones, oficinas federales o entidades gubernamentales relevantes.
   * 
   * @param {string} representacionFederal - La nueva representación federal.
   *                                        Información sobre la entidad federal
   *                                        asociada al trámite.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer representación federal
   * this.textilesStore.setRepresentacionFederal('Delegación Centro');
   * 
   * // Establecer oficina específica
   * this.textilesStore.setRepresentacionFederal('Oficina Federal de Comercio Exterior');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setRepresentacionFederal(representacionFederal: string): void {
    this.update((state) => ({
      ...state,
      representacionFederal,
    }));
  }

  /**
   * Actualiza la fracción arancelaria de los textiles en el estado.
   * 
   * @description
   * Establece el código de clasificación arancelaria específico para los productos
   * textiles. Esta fracción determina los aranceles, regulaciones y tratamientos
   * comerciales aplicables a los textiles.
   * 
   * @param {string} fraccionArancelaria - La nueva fracción arancelaria.
   *                                      Código numérico que clasifica el producto
   *                                      según el Sistema Armonizado de Designación
   *                                      y Codificación de Mercancías.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer fracción para algodón
   * this.textilesStore.setFraccionArancelaria('5208.11.01');
   * 
   * // Establecer fracción para fibras sintéticas
   * this.textilesStore.setFraccionArancelaria('5407.20.01');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * Actualiza la descripción del producto textil en el estado.
   * 
   * @description
   * Establece la descripción detallada de los productos textiles incluidos en el trámite.
   * Esta descripción debe ser precisa y completa, ya que se utiliza para
   * validaciones regulatorias y clasificaciones comerciales.
   * 
   * @param {string} descripcionProducto - La nueva descripción del producto textil.
   *                                      Debe incluir características específicas
   *                                      como tipo de fibra, acabados, uso previsto, etc.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Descripción detallada de textiles
   * this.textilesStore.setDescripcionProducto('Telas de algodón 100% para confección de camisas');
   * 
   * // Descripción de productos específicos
   * this.textilesStore.setDescripcionProducto('Fibras sintéticas de poliéster para uso industrial');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setDescripcionProducto(descripcionProducto: string): void {
    this.update((state) => ({
      ...state,
      descripcionProducto,
    }));
  }

  /**
   * Actualiza el tratado comercial aplicable en el estado.
   * 
   * @description
   * Establece el tratado o acuerdo comercial internacional que aplica
   * a la transacción de textiles. Este tratado determina aranceles preferenciales,
   * cuotas y otros beneficios comerciales.
   * 
   * @param {string} tratado - El nuevo tratado comercial aplicable.
   *                          Debe ser un tratado válido reconocido internacionalmente
   *                          (ej: TLCAN, T-MEC, TLCUEM, etc.).
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Aplicar T-MEC
   * this.textilesStore.setTratado('T-MEC');
   * 
   * // Aplicar tratado con Unión Europea
   * this.textilesStore.setTratado('TLCUEM');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setTratado(tratado: string): void {
    this.update((state) => ({
      ...state,
      tratado,
    }));
  }

  /**
   * Actualiza el subproducto relacionado en el estado.
   * 
   * @description
   * Establece la clasificación específica del subproducto textil.
   * Esta categorización más detallada permite una mejor clasificación
   * y aplicación de regulaciones específicas.
   * 
   * @param {string} subproducto - El nuevo subproducto textil.
   *                              Clasificación específica dentro de la
   *                              categoría principal de textiles.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Subproducto específico
   * this.textilesStore.setSubproducto('Telas de punto');
   * 
   * // Subproducto industrial
   * this.textilesStore.setSubproducto('Fibras técnicas');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setSubproducto(subproducto: string): void {
    this.update((state) => ({
      ...state,
      subproducto,
    }));
  }

  /**
   * Actualiza el mecanismo de operación en el estado.
   * 
   * @description
   * Establece el mecanismo o procedimiento de operación comercial
   * que se aplicará a la transacción de textiles. Define el tipo
   * de operación y los procedimientos asociados.
   * 
   * @param {string} mecanismo - El nuevo mecanismo de operación.
   *                            Tipo de procedimiento comercial o
   *                            operativo que se aplicará al trámite.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Mecanismo de importación regular
   * this.textilesStore.setMecanismo('IMPORTACION_REGULAR');
   * 
   * // Mecanismo de maquila
   * this.textilesStore.setMecanismo('MAQUILA_EXPORTACION');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setMecanismo(mecanismo: string): void {
    this.update((state) => ({
      ...state,
      mecanismo,
    }));
  }

  /**
   * Actualiza el tipo de categoría del textil en el estado.
   * 
   * @description
   * Establece la categoría específica del producto textil según
   * las clasificaciones oficiales. Esta categoría determina
   * regulaciones, cuotas y tratamientos especiales aplicables.
   * 
   * @param {string} typoCategoria - El nuevo tipo de categoría textil.
   *                                Clasificación oficial del producto
   *                                según normativas internacionales.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Categoría de fibras naturales
   * this.textilesStore.setTypoCategoria('FIBRAS_NATURALES');
   * 
   * // Categoría de productos confeccionados
   * this.textilesStore.setTypoCategoria('PRODUCTOS_CONFECCIONADOS');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setTypoCategoria(typoCategoria: string): void {
    this.update((state) => ({
      ...state,
      typoCategoria,
    }));
  }

  /**
   * Actualiza el tipo de régimen aplicable en el estado.
   * 
   * @description
   * Establece el régimen aduanero o comercial que se aplicará
   * a los productos textiles. Este régimen determina los
   * procedimientos, aranceles y regulaciones específicas.
   * 
   * @param {string} typoRegimen - El nuevo tipo de régimen aplicable.
   *                              Clasificación del régimen aduanero
   *                              o comercial según regulaciones oficiales.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Régimen de importación definitiva
   * this.textilesStore.setTypoRegimen('IMPORTACION_DEFINITIVA');
   * 
   * // Régimen temporal de exportación
   * this.textilesStore.setTypoRegimen('EXPORTACION_TEMPORAL');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setTypoRegimen(typoRegimen: string): void {
    this.update((state) => ({
      ...state,
      typoRegimen,
    }));
  }

  /**
   * Actualiza la descripción de la categoría textil en el estado.
   * 
   * @description
   * Establece la descripción detallada de la categoría específica del textil.
   * Esta descripción proporciona información adicional sobre las características
   * y especificaciones de la categoría textil seleccionada.
   * 
   * @param {string} descripcionCategoriaTextil - La nueva descripción de la categoría textil.
   *                                             Descripción detallada que complementa
   *                                             la clasificación de la categoría.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Descripción de categoría específica
   * this.textilesStore.setDescripcionCategoriaTextil('Tejidos de punto de algodón para uso doméstico');
   * 
   * // Descripción técnica
   * this.textilesStore.setDescripcionCategoriaTextil('Fibras sintéticas de alta resistencia para uso industrial');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setDescripcionCategoriaTextil(
    descripcionCategoriaTextil: string
  ): void {
    this.update((state) => ({
      ...state,
      descripcionCategoriaTextil,
    }));
  }

  /**
   * Actualiza el país de destino de los textiles en el estado.
   * 
   * @description
   * Establece el país donde se destinan o importan los productos textiles.
   * Esta información es crucial para determinar regulaciones comerciales,
   * aranceles y acuerdos comerciales aplicables.
   * 
   * @param {string} PaisDestino - El nuevo país de destino de los textiles.
   *                              Debe ser el nombre oficial del país o su código
   *                              ISO según estándares internacionales.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer país de destino
   * this.textilesStore.setPaisDestino('México');
   * 
   * // Establecer con código ISO
   * this.textilesStore.setPaisDestino('MX');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setPaisDestino(PaisDestino: string): void {
    this.update((state) => ({
      ...state,
      PaisDestino,
    }));
  }

  /**
   * Actualiza la unidad de medida de la categoría textil en el estado.
   * 
   * @description
   * Establece la unidad de medida específica para la categoría de textiles seleccionada.
   * Esta unidad puede diferir de la unidad de medida general y debe corresponder
   * con las especificaciones técnicas de la categoría textil.
   * 
   * @param {string} unidadMedidaCategoriaTextil - La nueva unidad de medida de la categoría.
   *                                              Debe ser una unidad válida según las
   *                                              especificaciones de la categoría textil.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Unidad específica para telas
   * this.textilesStore.setUnidadMedidaCategoriaTextil('METROS_CUADRADOS');
   * 
   * // Unidad para fibras
   * this.textilesStore.setUnidadMedidaCategoriaTextil('KILOGRAMOS');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setUnidadMedidaCategoriaTextil(
    unidadMedidaCategoriaTextil: string
  ): void {
    this.update((state) => ({
      ...state,
      unidadMedidaCategoriaTextil,
    }));
  }

  /**
   * Actualiza el factor de conversión de la categoría textil en el estado.
   * 
   * @description
   * Establece el factor matemático utilizado para convertir entre diferentes
   * unidades de medida específicas de la categoría textil. Este factor es
   * esencial para cálculos precisos de equivalencias.
   * 
   * @param {string} factorConversionCategoriaTextil - El nuevo factor de conversión.
   *                                                  Valor numérico que representa
   *                                                  la relación de conversión entre unidades.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Factor de conversión estándar
   * this.textilesStore.setFactorConversionCategoriaTextil('1.5');
   * 
   * // Factor para conversión específica
   * this.textilesStore.setFactorConversionCategoriaTextil('2.54');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setFactorConversionCategoriaTextil(
    factorConversionCategoriaTextil: string
  ): void {
    this.update((state) => ({
      ...state,
      factorConversionCategoriaTextil,
    }));
  }

  /**
   * Actualiza la fecha de inicio de vigencia en el estado.
   * 
   * @description
   * Establece la fecha desde la cual es válida la elegibilidad de los textiles.
   * Esta fecha determina el período inicial de validez del trámite y debe
   * estar dentro de los rangos permitidos por las regulaciones.
   * 
   * @param {string} fechaInicioVigencia - La nueva fecha de inicio de vigencia.
   *                                      Debe estar en formato de fecha válido,
   *                                      preferiblemente ISO 8601 (YYYY-MM-DD).
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer fecha de inicio
   * this.textilesStore.setFechaInicioVigencia('2025-07-01');
   * 
   * // Fecha con formato específico
   * this.textilesStore.setFechaInicioVigencia('01/07/2025');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setFechaInicioVigencia(fechaInicioVigencia: string): void {
    this.update((state) => ({
      ...state,
      fechaInicioVigencia,
    }));
  }

  /**
   * Actualiza la fecha de fin de vigencia en el estado.
   * 
   * @description
   * Establece la fecha hasta la cual es válida la elegibilidad de los textiles.
   * Esta fecha marca el límite temporal del trámite y debe ser posterior
   * a la fecha de inicio de vigencia.
   * 
   * @param {string} fechaFinVigencia - La nueva fecha de fin de vigencia.
   *                                   Debe estar en formato de fecha válido y
   *                                   ser posterior a la fecha de inicio.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer fecha de fin
   * this.textilesStore.setFechaFinVigencia('2025-12-31');
   * 
   * // Fecha de vencimiento específica
   * this.textilesStore.setFechaFinVigencia('31/12/2025');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setFechaFinVigencia(fechaFinVigencia: string): void {
    this.update((state) => ({
      ...state,
      fechaFinVigencia,
    }));
  }

  /**
   * Actualiza la cantidad de facturas asociadas en el estado.
   * 
   * @description
   * Establece el número total de facturas comerciales que están asociadas
   * con el trámite de elegibilidad de textiles. Esta cantidad debe corresponder
   * con los documentos efectivamente presentados.
   * 
   * @param {string} cantidadFacturas - La nueva cantidad de facturas asociadas.
   *                                   Valor numérico expresado como cadena que
   *                                   representa el total de facturas.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer cantidad específica
   * this.textilesStore.setCantidadFacturas('5');
   * 
   * // Actualizar después de agregar facturas
   * this.textilesStore.setCantidadFacturas((parseInt(cantidadActual) + 1).toString());
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setCantidadFacturas(cantidadFacturasTotal: number): void {
    this.update((state) => ({
      ...state,
      cantidadFacturasTotal,
    }));
  }

  /**
   * Actualiza la lista de facturas asociadas en el estado.
   * @param facturasAsociadas - Array de objetos que representan las facturas asociadas.
   * @returns void
   */
  public setFacturasAsociadas(facturasAsociadas: AsociadasTableColumns[]): void {
    this.update((state) => ({
      ...state,
      facturasAsociadas,
    }));
  }

  /**
   * Actualiza el valor que indica si el exportador y fabricante son la misma entidad en el estado.
   * 
   * @description
   * Establece un indicador que determina si el exportador y el fabricante de los textiles
   * son la misma empresa o entidad. Esta información es relevante para validaciones
   * regulatorias y certificaciones de origen.
   * 
   * @param {string} exportadorFabricanteMismo - El nuevo valor del indicador.
   *                                            Generalmente 'true', 'false', 'SI', 'NO'
   *                                            o valores equivalentes según el sistema.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Indicar que son la misma entidad
   * this.textilesStore.setExportadorFabricanteMismo('SI');
   * 
   * // Indicar que son entidades diferentes
   * this.textilesStore.setExportadorFabricanteMismo('NO');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setExportadorFabricanteMismo(exportadorFabricanteMismo: string): void {
    this.update((state) => ({
      ...state,
      exportadorFabricanteMismo,
    }));
  }

  /**
   * @method setExportadorFabricanteNacional
   * @description Actualiza el estado del exportador/fabricante nacional en el store.
   * Utiliza el patrón de actualización inmutables para modificar el estado,
   * preservando las demás propiedades del estado actual.
   * @param {string} exportadorFabricanteNacional - El nuevo valor para la propiedad
   * exportadorFabricanteNacional en el estado del store.
   * @returns {void} No retorna ningún valor.
   */
  public setExportadorFabricanteNacional(exportadorFabricanteNacional: string): void {
    this.update((state) => ({
      ...state,
      exportadorFabricanteNacional,
    }));
  }

  /**
   * @method setListaFabricantes
   * @description Actualiza la lista de fabricantes en el store.
   * Realiza una actualización inmutable del estado, manteniendo todas las
   * propiedades existentes y reemplazando solamente la lista de fabricantes.
   * @param {HistoricoColumns[]} listaFabricantes - Array de objetos HistoricoColumns
   * que representa la nueva lista de fabricantes a almacenar en el estado.
   * @returns {void} No retorna ningún valor.
   */
  public setListaFabricantes(listaFabricantes: HistoricoColumns[]): void {
    this.update((state) => ({
      ...state,
      listaFabricantes,
    }));
  }

  /**
   * @method setListaFabricantesCompletos
   * @description Actualiza la lista completa de fabricantes en el store.
   * Realiza una actualización inmutable del estado, manteniendo todas las
   * propiedades existentes y reemplazando solamente la lista completa de fabricantes.
   * @param listaFabricantesCompleta - Array de objetos FabricanteNacionalRfcResponse
   * que representa la nueva lista completa de fabricantes a almacenar en el estado.
   * @returns {void} No retorna ningún valor.
   * 
   */
  public setListaFabricantesCompletos(listaFabricantesCompleta: FabricanteNacionalRfcResponse[]): void {
    this.update((state) => ({
      ...state,
      listaFabricantesCompleta,
    }));
  }

  /**
   * Actualiza el número de registro fiscal del exportador en el estado.
   * 
   * @description
   * Establece el número oficial de registro fiscal del exportador ante las
   * autoridades fiscales correspondientes. Este registro es fundamental
   * para la validación legal y fiscal de las operaciones comerciales.
   * 
   * @param {string} numeroRegistroFiscal - El nuevo número de registro fiscal.
   *                                       Debe ser un número válido emitido
   *                                       por las autoridades fiscales competentes.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Registro fiscal mexicano
   * this.textilesStore.setNumeroRegistroFiscal('RFC123456789');
   * 
   * // Registro fiscal extranjero
   * this.textilesStore.setNumeroRegistroFiscal('REG-US-987654321');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setNumeroRegistroFiscal(numeroRegistroFiscal: string): void {
    this.update((state) => ({
      ...state,
      numeroRegistroFiscal,
    }));
  }

  /**
   * Actualiza el tipo de trámite en el estado.
   * 
   * @description
   * Establece la clasificación específica del tipo de trámite que se está procesando.
   * Esta clasificación determina los procedimientos, validaciones y documentos
   * requeridos para completar el proceso.
   * 
   * @param {string} tipo - El nuevo tipo de trámite.
   *                       Debe corresponder con los tipos válidos definidos
   *                       en el sistema (ej: 'ELEGIBILIDAD_TEXTILES', 'REVISION', etc.).
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Tipo de trámite estándar
   * this.textilesStore.setTipo('ELEGIBILIDAD_TEXTILES');
   * 
   * // Tipo de revisión
   * this.textilesStore.setTipo('REVISION_DOCUMENTOS');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setTipo(tipo: string): void {
    this.update((state) => ({
      ...state,
      tipo,
    }));
  }

  /**
   * Actualiza la cantidad total del importador en el estado.
   * 
   * @description
   * Establece la cantidad total de textiles desde la perspectiva del importador.
   * Esta cantidad puede diferir de la cantidad del exportador debido a
   * factores de conversión, mermas o agrupaciones comerciales.
   * 
   * @param {string} cantidadTotalImportador - La nueva cantidad total del importador.
   *                                          Valor numérico expresado como cadena
   *                                          que representa la cantidad desde el importador.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Cantidad específica del importador
   * this.textilesStore.setCantidadTotalImportador('2000.75');
   * 
   * // Actualizar con cálculo
   * const cantidadConvertida = (cantidadExportador * factorConversion).toString();
   * this.textilesStore.setCantidadTotalImportador(cantidadConvertida);
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setCantidadTotalImportador(cantidadTotalImportador: string): void {
    this.update((state) => ({
      ...state,
      cantidadTotalImportador,
    }));
  }

  /**
   * Actualiza la razón social del importador en el estado.
   * 
   * @description
   * Establece el nombre legal completo o razón social de la empresa importadora.
   * Esta información debe coincidir con los registros oficiales del importador
   * y los documentos de importación correspondientes.
   * 
   * @param {string} razonSocialImportador - La nueva razón social del importador.
   *                                        Nombre legal completo de la empresa importadora
   *                                        tal como aparece en sus documentos oficiales.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Razón social de empresa importadora
   * this.textilesStore.setRazonSocialImportador('Importadora de Textiles del Norte S.A.');
   * 
   * // Persona física importadora
   * this.textilesStore.setRazonSocialImportador('María García López');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setRazonSocialImportador(razonSocialImportador: string): void {
    this.update((state) => ({
      ...state,
      razonSocialImportador,
    }));
  }

  /**
   * Actualiza el domicilio del importador en el estado.
   * 
   * @description
   * Establece la dirección completa del domicilio fiscal del importador.
   * Esta información debe corresponder con el registro oficial del importador
   * ante las autoridades correspondientes.
   * 
   * @param {string} domicilio - El nuevo domicilio del importador.
   *                            Dirección completa incluyendo calle, número,
   *                            colonia, ciudad y código postal.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Domicilio completo
   * this.textilesStore.setDomicilio('Av. Reforma 456, Col. Juárez, Ciudad de México, 06600');
   * 
   * // Domicilio con referencia
   * this.textilesStore.setDomicilio('Calle Principal 123, entre 1a y 2a, Centro, Guadalajara');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setDomicilio(domicilio: string): void {
    this.update((state) => ({
      ...state,
      domicilio,
    }));
  }

  /**
   * Actualiza la ciudad del importador en el estado.
   * 
   * @description
   * Establece la ciudad donde está ubicado el importador de textiles.
   * Esta información complementa el domicilio y es utilizada para
   * validaciones geográficas y aplicación de regulaciones locales.
   * 
   * @param {string} ciudadImportador - La nueva ciudad del importador.
   *                                   Nombre oficial de la ciudad según las
   *                                   divisiones administrativas del país.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Ciudad mexicana
   * this.textilesStore.setCiudadImportador('Monterrey');
   * 
   * // Ciudad con especificación
   * this.textilesStore.setCiudadImportador('Tijuana, Baja California');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setCiudadImportador(ciudadImportador: string): void {
    this.update((state) => ({
      ...state,
      ciudadImportador,
    }));
  }

  /**
   * Actualiza el código postal del importador en el estado.
   * 
   * @description
   * Establece el código postal correspondiente al domicilio del importador.
   * Este código debe ser válido según el sistema postal del país donde
   * está ubicado el importador.
   * 
   * @param {string} cpImportador - El nuevo código postal del importador.
   *                               Código postal válido según el sistema oficial
   *                               del país correspondiente.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Código postal mexicano
   * this.textilesStore.setCpImportador('64000');
   * 
   * // Código postal con formato específico
   * this.textilesStore.setCpImportador('01234');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setCpImportador(cpImportador: string): void {
    this.update((state) => ({
      ...state,
      cpImportador,
    }));
  }

  /**
   * Actualiza el país del importador en el estado.
   * 
   * @description
   * Establece el país donde está ubicado el importador de textiles.
   * Esta información es fundamental para determinar regulaciones
   * de importación, tratados comerciales y procedimientos aduaneros.
   * 
   * @param {string} PaisImportador - El nuevo país del importador.
   *                                 Nombre oficial del país o código ISO
   *                                 según estándares internacionales.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // País por nombre
   * this.textilesStore.setPaisImportador('México');
   * 
   * // País por código ISO
   * this.textilesStore.setPaisImportador('MX');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setPaisImportador(PaisImportador: string): void {
    this.update((state) => ({
      ...state,
      PaisImportador,
    }));
  }

  /**
   * Actualiza la lista de formas válidas de operación en el estado.
   * 
   * @description
   * Establece el conjunto de formas de operación comercial válidas para
   * el trámite de textiles. Esta lista determina los métodos permitidos
   * para realizar las operaciones comerciales.
   * 
   * @param {Catalogo[]} formaValida - La nueva lista de formas válidas de operación.
   *                                  Array de objetos Catalogo que contiene las
   *                                  opciones válidas de operación comercial.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Lista de formas válidas
   * const formasValidas = [
   *   { id: 1, descripcion: 'Importación definitiva' },
   *   { id: 2, descripcion: 'Importación temporal' }
   * ];
   * this.textilesStore.setFormaValida(formasValidas);
   * 
   * // Limpiar lista
   * this.textilesStore.setFormaValida([]);
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   * @see {@link Catalogo} - Interfaz de objetos del catálogo
   */
  public setFormaValida(formaValida: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      formaValida,
    }));
  }

  /**
   * Actualiza los metros cuadrados equivalentes de los textiles en el estado.
   * 
   * @description
   * Establece la medida en metros cuadrados equivalentes de los productos textiles.
   * Esta medida es utilizada para cálculos específicos de equivalencias
   * y puede ser requerida para ciertos tipos de textiles.
   * 
   * @param {number} metrosCuadradosEquivalentes - El nuevo valor de metros cuadrados equivalentes.
   *                                              Valor numérico que representa la medida
   *                                              en metros cuadrados.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer metros cuadrados
   * this.textilesStore.setMetrosCuadradosEquivalentes(150.5);
   * 
   * // Calcular equivalencia
   * const equivalencia = longitud * ancho * factor;
   * this.textilesStore.setMetrosCuadradosEquivalentes(equivalencia);
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setMetrosCuadradosEquivalentes(
    metrosCuadradosEquivalentes: number
  ): void {
    this.update((state) => ({
      ...state,
      metrosCuadradosEquivalentes,
    }));
  }

  /**
   * Actualiza la cantidad total de facturas en el estado.
   * 
   * @description
   * Establece el número total de facturas asociadas al trámite de elegibilidad
   * de textiles. Este valor representa el conteo total de documentos
   * facturados relacionados con la operación.
   * 
   * @param {number} cantidadFacturasTotal - La nueva cantidad total de facturas.
   *                                        Valor numérico entero que representa
   *                                        el número total de facturas.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer cantidad específica
   * this.textilesStore.setCantidadFacturasTotal(8);
   * 
   * // Incrementar contador
   * const nuevaCantidad = cantidadActual + 1;
   * this.textilesStore.setCantidadFacturasTotal(nuevaCantidad);
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setCantidadFacturasTotal(cantidadFacturasTotal: number): void {
    this.update((state) => ({
      ...state,
      cantidadFacturasTotal,
    }));
  }

  /**
   * Actualiza los datos de la tabla de constancia del registro en el estado.
   * 
   * @description
   * Establece la información completa de la tabla que contiene los datos de constancia
   * del registro de textiles. Esta tabla incluye configuraciones específicas del trámite
   * que son necesarias para generar constancias y documentos oficiales.
   * 
   * @param {ConstanciaTramiteConfiguracion[]} datosTablaConstanciaDelRegistro 
   *        Array con los nuevos datos de configuración de la tabla de constancia.
   *        Cada elemento debe cumplir con la estructura ConstanciaTramiteConfiguracion.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer datos de constancia
   * const datosConstancia = [
   *   { id: 1, descripcion: 'Constancia A', activo: true },
   *   { id: 2, descripcion: 'Constancia B', activo: false }
   * ];
   * this.textilesStore.setdatosTablaConstanciaDelRegistro(datosConstancia);
   * 
   * // Limpiar datos
   * this.textilesStore.setdatosTablaConstanciaDelRegistro([]);
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   * @see {@link ConstanciaTramiteConfiguracion} - Interfaz de configuración de constancia
   */
  public setdatosTablaConstanciaDelRegistro(
    datosTablaConstanciaDelRegistro: Array<ConstanciaTramiteConfiguracion>
  ): void {
    this.update((state) => ({
      ...state,
      datosTablaConstanciaDelRegistro,
    }));
  }

  /**
   * Actualiza la bandera de guardado en el estado.
   * 
   * @description
   * Establece el estado de la bandera que indica si los datos han sido guardados
   * exitosamente. Esta bandera es útil para controlar la interfaz de usuario,
   * mostrar indicadores de guardado y prevenir pérdida de información.
   * 
   * @param {boolean} guardarBandera - Valor booleano que indica el estado de guardado.
   *                                  true: datos guardados exitosamente
   *                                  false: datos pendientes de guardar o error en guardado
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Marcar como guardado exitosamente
   * this.textilesStore.setguardarBandera(true);
   * 
   * // Marcar como pendiente de guardar
   * this.textilesStore.setguardarBandera(false);
   * 
   * // Uso en flujo de guardado
   * try {
   *   await this.guardarDatos();
   *   this.textilesStore.setguardarBandera(true);
   * } catch (error) {
   *   this.textilesStore.setguardarBandera(false);
   * }
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setguardarBandera(guardarBandera: boolean): void {
    this.update((state) => ({
      ...state,
      guardarBandera,
    }));
  }

  /**
   * Actualiza el año de la constancia en el estado.
   * 
   * @description
   * Establece el año correspondiente a la constancia de registro de textiles.
   * Este año es importante para la trazabilidad y validez temporal de la constancia.
   * 
   * @param {string} anoDeLaConstancia - El año de la constancia en formato de cadena.
   *                                    Debe ser un año válido, generalmente en formato YYYY.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer año actual
   * const anoActual = new Date().getFullYear().toString();
   * this.textilesStore.setAnoDeLaConstancia(anoActual);
   * 
   * // Establecer año específico
   * this.textilesStore.setAnoDeLaConstancia('2025');
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setAnoDeLaConstancia(anoDeLaConstancia: string): void {
    this.update((state) => ({
      ...state,
      anoDeLaConstancia,
    }));
  }

  /**
   * Actualiza el número de la constancia en el estado.
   * 
   * @description
   * Establece el número único de identificación de la constancia de registro.
   * Este número permite identificar de manera unívoca cada constancia emitida
   * y es esencial para el seguimiento y consulta posterior.
   * 
   * @param {string} numeroDeLaConstancia - El número único de la constancia.
   *                                       Debe seguir el formato establecido por las
   *                                       regulaciones oficiales.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Establecer número de constancia
   * this.textilesStore.setNumeroDeLaConstancia('CONST-2025-000123');
   * 
   * // Generar número secuencial
   * const numero = `CONST-${new Date().getFullYear()}-${(secuencial).toString().padStart(6, '0')}`;
   * this.textilesStore.setNumeroDeLaConstancia(numero);
   * ```
   * 
   * @since 1.0.0
   * @public
   * @memberof ElegibilidadDeTextilesStore
   */
  public setNumeroDeLaConstancia(numeroDeLaConstancia: string): void {
    this.update((state) => ({
      ...state,
      numeroDeLaConstancia,
    }));
  }

  /**
   * Actualiza la pestaña activa en el flujo del trámite.
   * 
   * Este método permite establecer la pestaña activa en el flujo del trámite.
   * 
   * @param {number} pestanaActiva - El número de la pestaña activa a establecer.
   */
  public setPestanaActiva(pestanaActiva: number): void {
    this.update((state) => ({
      ...state,
      pestanaActiva,
    }));
  }
  /**
   * Actualiza el paso activo en el flujo del trámite.
   * Permite establecer el paso activo en el wizard o proceso.
   * @param {number} pasoActivo - El número del paso activo a establecer.
   */
  public setPasoActivo(pasoActivo: number): void {
    this.update((state) => ({
      ...state,
      pasoActivo,
    }));
  }

  /**
   * Actualiza la bandera que indica si las facturas son requeridas.
   * @param requiereFacturas - Valor booleano que indica si las facturas son requeridas.
   */
  public setRequiereFacturas(requiereFactura: boolean): void {
    this.update((state) => ({
      ...state,
      requiereFactura,
    }));
  }
}
