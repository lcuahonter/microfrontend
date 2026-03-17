import { DatosSolicitudFormState, TablaMercanciaClaveConfig } from '../../../../shared/models/datos-solicitud.model';
import { PRODUCTO_TABLA_DATA, TIPO_ACTUALIZACION } from '../../../../shared/constantes/datos-solicitud.enum';
import { Destinatario } from '../../../../shared/models/terceros-relacionados.model';
import { Fabricante } from '../../../../shared/models/terceros-relacionados.model';
import { Facturador } from '../../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaForm } from '../../../../shared/models/datos-solicitud.model';
import { PagoDerechosFormState } from '../../../../shared/models/terceros-relacionados.model';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
import { TABLA_OPCION_DATA } from '../../../../shared/constantes/datos-solicitud.enum';
import { TablaMercanciasDatos } from '../../../../shared/components/shared26010/models/datos-solicitud.model';
import { TablaOpcionConfig } from '../../../../shared/models/datos-solicitud.model';
import { TablaScianConfig } from '../../../../shared/models/datos-solicitud.model';

/**
 * @interface Tramite260102State
 * @description
 * Define la estructura del estado central utilizado para gestionar los datos del trámite 260102.
 * Este estado abarca información general del formulario, tablas dinámicas de terceros relacionados,
 * configuraciones de tablas y el estado del pago de derechos.
 */
export interface Tramite260102State {
  /**
   * Identificador de la solicitud (opcional).
  */
  idSolicitud: number;
  /**
   * @property destinatarioFinalTablaDatos
   * @description Lista de destinatarios finales registrados en la tabla.
   * Utilizado para representar entidades que reciben el producto o mercancía.
   */
  destinatarioFinalTablaDatos: Destinatario[];
  /**
   * @property tabSeleccionado
   * @description Indica qué pestaña está seleccionada actualmente en el formulario.
   */
  tabSeleccionado?: number;
  /**
   * @property facturadorTablaDatos
   * @description Lista de facturadores registrados en la tabla.
   * Corresponde a los terceros encargados de emitir facturas en el proceso del trámite.
   */
  facturadorTablaDatos: Facturador[];

  /**
   * @property proveedorTablaDatos
   * @description Lista de proveedores registrados en la tabla.
   * Son aquellos terceros que abastecen de mercancías, productos o servicios.
   */
  proveedorTablaDatos: Proveedor[];

  /**
   * @property fabricanteTablaDatos
   * @description Lista de fabricantes registrados en la tabla.
   * Incluye entidades responsables de la fabricación o elaboración del producto.
   */
  fabricanteTablaDatos: Fabricante[];

  /**
   * @property datosSolicitudFormState
   * @description Datos generales del formulario de solicitud.
   * Incluye información como RFC, denominación, domicilio, contacto, entre otros.
   */
  datosSolicitudFormState: DatosSolicitudFormState;

  /**
   * @property mercanciaForm
   * @description Información del formulario correspondiente a los datos de la mercancía.
   * Contiene detalles como tipo de producto, fracción arancelaria, presentación, etc.
   */
  mercanciaForm: MercanciaForm;

  /**
   * @property opcionConfigDatos
   * @description Configuración utilizada para poblar la tabla de opciones.
   * Se puede utilizar para representar opciones específicas seleccionables por el usuario.
   */
  opcionConfigDatos: TablaOpcionConfig[];

  /**
   * @property scianConfigDatos
   * @description Configuración de la tabla SCIAN (clasificación económica).
   * Representa categorías económicas según el Sistema de Clasificación Industrial.
   */
  scianConfigDatos: TablaScianConfig[];

  /**
   * @property tablaMercanciasConfigDatos
   * @description Datos y configuración para la tabla de mercancías mostrada en pantalla.
   * Utilizado para listar productos o bienes relacionados con el trámite.
   */
  tablaMercanciasConfigDatos: TablaMercanciasDatos[];

  tablaMercanciaClaveConfigDatos: TablaMercanciaClaveConfig[];

  /**
   * @property seleccionadoopcionDatos
   * @description Opciones seleccionadas actualmente en la tabla de opciones.
   * Refleja la selección hecha por el usuario durante el llenado del formulario.
   */
  seleccionadoopcionDatos: TablaOpcionConfig[];

  /**
   * @property seleccionadoScianDatos
   * @description Registros SCIAN actualmente seleccionados por el usuario.
   * Permite almacenar temporalmente las categorías económicas elegidas.
   */
  seleccionadoScianDatos: TablaScianConfig[];

  /**
   * @property seleccionadoTablaMercanciasDatos
   * @description Registros seleccionados en la tabla de mercancías.
   * Permite manejar qué productos han sido marcados como seleccionados por el usuario.
   */
  seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[];

  /**
   * @property opcionesColapsableState
   * @description Estado del panel de opciones (colapsado o desplegado).
   * true indica que el panel está colapsado; false, que está visible.
   */
  opcionesColapsableState: boolean;

  /**
   * @property pagoDerechos
   * @description Información del formulario de pago de derechos del trámite.
   * Incluye clave de referencia, cadena de dependencia, importe y fecha de pago.
   */
  pagoDerechos: PagoDerechosFormState;

  /**
   * @property seleccionadoTablaFabricanteDatos
   * @description Registros seleccionados en la tabla de fabricantes.
   * Permite manejar qué fabricantes han sido marcados como seleccionados por el usuario.
   */
  seleccionadoTablaFabricanteDatos?: Fabricante[];

  /**
   * @property seleccionadoTablaDestinatarioDatos
   * @description Registros seleccionados en la tabla de destinatarios.
   * Permite manejar qué destinatarios han sido marcados como seleccionados por el usuario.
   */
  seleccionadoTablaDestinatarioDatos?: Destinatario[];

  /**
   * @property seleccionadoTablaProveedorDatos
   * @description Registros seleccionados en la tabla de proveedores.
   * Permite manejar qué proveedores han sido marcados como seleccionados por el usuario.
   */
  seleccionadoTablaProveedorDatos?: Proveedor[];

  /**
   * @property seleccionadoTablaFacturadorDatos
   * @description Registros seleccionados en la tabla de facturadores.
   * Permite manejar qué facturadores han sido marcados como seleccionados por el usuario.
   */
  seleccionadoTablaFacturadorDatos?: Facturador[];
}

/**
 * Crea y retorna el estado inicial para el store de Tramite260102.
 *
 * Este estado inicializa todas las propiedades necesarias para el manejo de datos
 * relacionados con destinatarios, facturadores, proveedores, fabricantes, formularios
 * de solicitud y mercancía, configuración de tablas y opciones, así como el estado
 * de pago de derechos.
 *
 * @returns {Tramite260102State} El objeto de estado inicializado con valores por defecto
 * para todos los campos requeridos en el trámite 260102.
 */
export function createInitialState(): Tramite260102State {
  return {
  idSolicitud: 0,
    destinatarioFinalTablaDatos: [],
    facturadorTablaDatos: [],
    proveedorTablaDatos: [],
    fabricanteTablaDatos: [],
    datosSolicitudFormState: {
      rfcSanitario: '',
      denominacionRazon: '',
      correoElectronico: '',
      codigoPostal: '',
      estado: '',
      municipioAlcaldia: '',
      localidad: '',
      colonia: '',
      calle: '',
      lada: '',
      telefono: '',
      aviso: '',
      licenciaSanitaria: '',
      regimen: '',
      adunasDeEntradas: '',
      aeropuerto: false,
      publico: 'si',
      representanteRfc: '',
      representanteNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      marca: '',
      especifique: '',
      claveDeLos: '',
      fechaDeFabricacio: '',
      fechaDeCaducidad: '',
      manifiestosCasillaDeVerificacion: false,
    },
    mercanciaForm: {
      clasificacionProducto: '',
      especificarClasificacionProducto: '',
      denominacionEspecificaProducto: '',
      denominacionDistintiva: '',
      denominacionComun: '',
      tipoProducto: '',
      formaFarmaceutica: '',
      estadoFisico: '',
      fraccionArancelaria: '',
      descripcionFraccion: '',
      cantidadUmtValor: '',
      cantidadUmt: '',
      cantidadUmcValor: '',
      cantidadUmc: '',
      presentacion: '',
      numeroRegistroSanitario: '',
      fechaCaducidad: '',
      paisDeOriginDatos: [],
      paisDeProcedenciaDatos: [],
    },
    opcionConfigDatos: TABLA_OPCION_DATA,
    scianConfigDatos: [], // SCIAN_TABLA_DATA
    tablaMercanciasConfigDatos: [],
    tablaMercanciaClaveConfigDatos: [],
    seleccionadoopcionDatos: [],
    seleccionadoScianDatos: [],
    seleccionadoTablaMercanciasDatos: [],
    opcionesColapsableState: false,
    pagoDerechos: {
      claveReferencia: '',
      cadenaDependencia: '',
      estado: '',
      llavePago: '',
      fechaPago: '',
      importePago: '',
    },
    seleccionadoTablaDestinatarioDatos: [],
    seleccionadoTablaFabricanteDatos: [],
    seleccionadoTablaProveedorDatos: [],
    seleccionadoTablaFacturadorDatos: [],
  };
}
/**
 * Decorador que marca esta clase como un servicio inyectable en Angular.
 * 
 * Este servicio se registra en el nivel raíz del inyector, lo que significa que estará disponible
 * en toda la aplicación sin necesidad de declararlo explícitamente en los módulos.
 * 
 * @Injectable({
 *   providedIn: 'root'
 * })
 * 
 * - `providedIn: 'root'`: Indica que el servicio se proporciona en el inyector raíz de la aplicación.
 * Esto asegura que haya una única instancia del servicio compartida en toda la aplicación.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'Tramite260102', resettable: true })
/**
 * Clase Store para gestionar el estado del módulo de aplicación "Trámite 260102".
 * 
 * Este store proporciona métodos para actualizar distintas partes del estado de la aplicación, como los datos de formularios,
 * tablas de fabricantes, destinatarios, proveedores, facturadores y datos de configuración para opciones, SCIAN y mercancías.
 * También gestiona el estado del formulario de pago de derechos.
 * 
 * Cada método de actualización es responsable de modificar de forma inmutable una sección específica del estado.
 * 
 * @extends Store<Tramite260102State>
 * 
 * @example
 * const store = new Tramite260102Store();
 * store.updateDatosSolicitudFormState(newFormState);
 * store.updateFabricanteTablaDatos([newFabricante]);
 */
export class Tramite260102Store extends Store<Tramite260102State> {

  /**
   * @constructor
   * @description
   * Inicializa el store con el estado inicial predeterminado definido en `createInitialState`.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @function updateDatosSolicitudFormState
   * @description Actualiza el estado del formulario de datos de la solicitud.
   * @param {DatosSolicitudFormState} datosSolicitudFormState - El nuevo estado del formulario.
   * @returns {void}
   */
  public updateDatosSolicitudFormState(
    datosSolicitudFormState: DatosSolicitudFormState
  ): void {
    this.update((state) => ({
      ...state,
      datosSolicitudFormState,
    }));
  }

  /**
   * @function updateFabricanteTablaDatos
   * @description Actualiza la tabla de datos de fabricantes, agregando nuevos fabricantes.
   * @param {Fabricante[]} newFabricantes - El array de nuevos fabricantes a agregar.
   * @returns {void}
   */
  public updateFabricanteTablaDatos(
    nuevoFabricante: Fabricante[],
    tipoActualizacion?: string
  ): void {
    this.update((state) => {
      return {
        ...state,
        fabricanteTablaDatos:
          tipoActualizacion === TIPO_ACTUALIZACION.ELIMINAR
            ? [...nuevoFabricante]
            : [
              ...Tramite260102Store.actualizarLista(
                state.fabricanteTablaDatos,
                nuevoFabricante,
                'rfc'
              ),
            ],
        seleccionadoTablaFabricanteDatos: [],
      };
    });
  }

  /**
   * @function updateDestinatarioFinalTablaDatos
   * @description Actualiza la tabla de datos de destinatarios finales, agregando nuevos destinatarios.
   * @param {Destinatario[]} newDestinatarios - El array de nuevos destinatarios a agregar.
   * @returns {void}
   */
  public updateDestinatarioFinalTablaDatos(
    newDestinatarios: Destinatario[],
    tipoActualizacion?: string
  ): void {
    this.update((state) => {
      return {
        ...state,
        destinatarioFinalTablaDatos:
          tipoActualizacion === TIPO_ACTUALIZACION.ELIMINAR
            ? [...newDestinatarios]
            : [
              ...Tramite260102Store.actualizarLista(
                state.destinatarioFinalTablaDatos,
                newDestinatarios,
                'rfc'
              ),
            ],
        seleccionadoTablaDestinatarioDatos: [],
      };
    });
  }

  /**
   * @function updateProveedorTablaDatos
   * @description Actualiza la tabla de datos de proveedores, agregando nuevos proveedores.
   * @param {Proveedor[]} newProveedores - El array de nuevos proveedores a agregar.
   * @returns {void}
   */
  public updateProveedorTablaDatos(
    newProveedores: Proveedor[],
    tipoActualizacion?: string
  ): void {
    this.update((state) => {
      return {
        ...state,
        proveedorTablaDatos:
          tipoActualizacion === TIPO_ACTUALIZACION.ELIMINAR
            ? [...newProveedores]
            : [
              ...Tramite260102Store.actualizarLista(
                state.proveedorTablaDatos,
                newProveedores,
                newProveedores?.[0]?.nombreRazonSocial !== ''
                  ? 'nombreRazonSocial'
                  : 'razonSocial'
              ),
            ],
        seleccionadoTablaDestinatarioDatos: [],
      };
    });
  }

  /**
   * @function updateFacturadorTablaDatos
   * @description Actualiza la tabla de datos de facturadores, agregando nuevos facturadores.
   * @param {Facturador[]} newFacturadores - El array de nuevos facturadores a agregar.
   * @returns {void}
   */
  public updateFacturadorTablaDatos(newFacturadores: Facturador[],
    tipoActualizacion?: string
  ): void {
    this.update((state) => ({
      ...state,
      facturadorTablaDatos:
        tipoActualizacion === TIPO_ACTUALIZACION.ELIMINAR
          ? [...newFacturadores]
          : [
            ...Tramite260102Store.actualizarLista(
              state.facturadorTablaDatos,
              newFacturadores,
              newFacturadores?.[0]?.nombreRazonSocial !== ''
                ? 'nombreRazonSocial'
                : 'razonSocial'
            ),
          ],
      seleccionadoTablaFacturadorDatos: [],
    }));
  }

  /**
   * @function updateOpcionConfigDatos
   * @description Actualiza la configuración de opciones para la tabla.
   * @param {TablaOpcionConfig[]} opcionConfigDatos - El nuevo array de configuraciones de opciones.
   * @returns {void}
   */
  public updateOpcionConfigDatos(opcionConfigDatos: TablaOpcionConfig[]): void {
    this.update((state) => ({
      ...state,
      opcionConfigDatos,
    }));
  }

  /**
   * @function updateScianConfigDatos
   * @description Actualiza la configuración de datos SCIAN para la tabla.
   * @param {TablaScianConfig[]} scianConfigDatos - El nuevo array de configuraciones de datos SCIAN.
   * @returns {void}
   */
  public updateScianConfigDatos(scianConfigDatos: TablaScianConfig[]): void {
    this.update((state) => ({
      ...state,
      scianConfigDatos,
    }));
  }

  /**
   * @function updateTablaMercanciasConfigDatos
   * @description Actualiza la configuración de datos de mercancías para la tabla.
   * @param {TablaMercanciasDatos[]} tablaMercanciasConfigDatos - El nuevo array de configuraciones de datos de mercancías.
   * @returns {void}
   */
  public updateTablaMercanciasConfigDatos(
    tablaMercanciasConfigDatos: TablaMercanciasDatos[]
  ): void {
    this.update((state) => ({
      ...state,
      tablaMercanciasConfigDatos,
      seleccionadoTablaMercanciasDatos: []
    }));
  }

  public updateTablaMercanciaClaveConfigDatos(
    tablaMercanciaClaveConfigDatos: TablaMercanciaClaveConfig[]
  ): void {
    this.update((state) => ({
      ...state,
      tablaMercanciaClaveConfigDatos,
    }));
  }

  /**
   * @function updatePagoDerechos
   * @description Actualiza el estado del formulario de pago de derechos.
   * @param {PagoDerechosFormState} nuevoPagoDerechos - El nuevo estado del formulario de pago de derechos.
   * @returns {void}
   */
  public updatePagoDerechos(nuevoPagoDerechos: PagoDerechosFormState): void {
    this.update((state) => ({
      ...state,
      pagoDerechos: nuevoPagoDerechos,
    }));
  }

  /**
  * @method updateSeleccionadoTablaFabricanteDatos
  * @description Actualiza la lista de fabricantes seleccionados en el estado.
  * @param {Fabricante[]} nuevoTablaFabricanteDatos - Nueva lista de fabricantes seleccionados.
  * @returns {void}
  */
  public updateSeleccionadoTablaFabricanteDatos(
    nuevoTablaFabricanteDatos: Fabricante[]
  ): void {
    this.update((state) => ({
      ...state,
      seleccionadoTablaFabricanteDatos: nuevoTablaFabricanteDatos,
    }));
  }
  /**
   * @method updateSeleccionadoTablaDestinatarioDatos
   * @description Actualiza la lista de destinatarios seleccionados en el estado.
   * @param {Destinatario[]} nuevoTablaDestinatarioDatos - Nueva lista de destinatarios seleccionados.
   * @returns {void}
   */
  public updateSeleccionadoTablaDestinatarioDatos(
    nuevoTablaDestinatarioDatos: Destinatario[]
  ): void {
    this.update((state) => ({
      ...state,
      seleccionadoTablaDestinatarioDatos: nuevoTablaDestinatarioDatos,
    }));
  }
  /**
   * @method updateSeleccionadoTablaProveedorDatos
   * @description Actualiza la lista de proveedores seleccionados en el estado.
   * @param {Proveedor[]} nuevoTablaProveedorDatos - Nueva lista de proveedores seleccionados.
   * @returns {void}
   */
  public updateSeleccionadoTablaProveedorDatos(
    nuevoTablaProveedorDatos: Proveedor[]
  ): void {
    this.update((state) => ({
      ...state,
      seleccionadoTablaProveedorDatos: nuevoTablaProveedorDatos,
    }));
  }
  /**
   * @method updateSeleccionadoTablaFacturadorDatos
   * @description Actualiza la lista de facturadores seleccionados en el estado.
   * @param {Facturador[]} nuevoTablaFacturadorDatos - Nueva lista de facturadores seleccionados.
   * @returns {void}
   */
  public updateSeleccionadoTablaFacturadorDatos(
    nuevoTablaFacturadorDatos: Facturador[]
  ): void {
    this.update((state) => ({
      ...state,
      seleccionadoTablaFacturadorDatos: nuevoTablaFacturadorDatos,
    }));
  }

  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
        ...state,
        idSolicitud,
    }));
  }

  /**
 * @method actualizarLista
 * @description Actualiza los datos seleccionados de la tabla de fabricantes.
 * @param {Fabricante[]} seleccionadoTablaFabricanteDatos - Nuevo array de datos seleccionados de fabricantes.
 */
  public static actualizarLista<
    T extends Fabricante | Destinatario | Proveedor | Facturador
  >(
    listaOriginal: T[],
    nuevosLista: T[],
    clave: keyof T
  ): Fabricante[] | Destinatario[] | Proveedor[] | Facturador[] {
    const LISTA_ACTUALIZADA = [...listaOriginal];

    const INDICE_ENCONTRADO = LISTA_ACTUALIZADA.findIndex(
      (item) => item?.[clave] === nuevosLista?.[0]?.[clave]
    );

    if (INDICE_ENCONTRADO !== -1) {
      LISTA_ACTUALIZADA.splice(INDICE_ENCONTRADO, 1, nuevosLista[0]);
    } else {
      LISTA_ACTUALIZADA.push(...nuevosLista);
    }

    return LISTA_ACTUALIZADA;
  }
}

