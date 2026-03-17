import { TABLA_OPCION_DATA, TIPO_ACTUALIZACION } from '../../../../shared/constantes/datos-solicitud.enum';
import { DatosSolicitudFormState } from '../../../../shared/models/datos-solicitud.model';
import { Destinatario } from '../../../../shared/models/terceros-relacionados.model';
import { Fabricante } from '../../../../shared/models/terceros-relacionados.model';
import { Facturador } from '../../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaForm } from '../../../../shared/models/datos-solicitud.model';
import { PagoDerechosFormState } from '../../../../shared/models/terceros-relacionados.model';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
import { TablaMercanciasDatos } from '../../../../shared/models/datos-solicitud.model';
import { TablaOpcionConfig } from '../../../../shared/models/datos-solicitud.model';
import { TablaScianConfig } from '../../../../shared/models/datos-solicitud.model';

/**
 * Representa el estado de la aplicación para el trámite 260206.
 * Contiene las propiedades necesarias para gestionar los datos y configuraciones
 * relacionadas con el trámite, incluyendo tablas de datos, formularios, configuraciones
 * y estados seleccionados.
 *
 * Propiedades:
 * - `destinatarioFinalTablaDatos`: Lista de destinatarios finales.
 * - `facturadorTablaDatos`: Lista de facturadores.
 * - `proveedorTablaDatos`: Lista de proveedores.
 * - `fabricanteTablaDatos`: Lista de fabricantes.
 * - `datosSolicitudFormState`: Estado del formulario de datos de la solicitud.
 * - `mercanciaForm`: Información del formulario de mercancías.
 * - `opcionConfigDatos`: Configuración de opciones para la tabla.
 * - `scianConfigDatos`: Configuración de SCIAN para la tabla.
 * - `tablaMercanciasConfigDatos`: Configuración de datos para la tabla de mercancías.
 * - `seleccionadoopcionDatos`: Opciones seleccionadas de la tabla de configuración.
 * - `seleccionadoScianDatos`: Configuración SCIAN seleccionada.
 * - `seleccionadoTablaMercanciasDatos`: Datos seleccionados de la tabla de mercancías.
 * - `opcionesColapsableState`: Estado de colapsabilidad de las opciones.
 * - `pagoDerechos`: Estado del formulario de pago de derechos.
 * - `tabSeleccionado`: Identificador de la pestaña seleccionada (opcional).
 * - `seleccionadoTablaFabricanteDatos`: Datos seleccionados de la tabla de fabricantes (opcional).
 * - `seleccionadoTablaDestinatarioDatos`: Datos seleccionados de la tabla de destinatarios (opcional).
 * - `seleccionadoTablaProveedorDatos`: Datos seleccionados de la tabla de proveedores (opcional).
 * - `seleccionadoTablaFacturadorDatos`: Datos seleccionados de la tabla de facturadores (opcional).
 */
export interface Tramite260206State {
  idSolicitud: number | null;
  destinatarioFinalTablaDatos: Destinatario[];
  facturadorTablaDatos: Facturador[];
  proveedorTablaDatos: Proveedor[];
  fabricanteTablaDatos: Fabricante[];
  datosSolicitudFormState: DatosSolicitudFormState;
  mercanciaForm: MercanciaForm;
  opcionConfigDatos: TablaOpcionConfig[];
  scianConfigDatos: TablaScianConfig[];
  tablaMercanciasConfigDatos: TablaMercanciasDatos[];
  seleccionadoopcionDatos: TablaOpcionConfig[];
  seleccionadoScianDatos: TablaScianConfig[];
  seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[];
  opcionesColapsableState: boolean;
  pagoDerechos: PagoDerechosFormState;
  tabSeleccionado?: number;
  seleccionadoTablaFabricanteDatos?: Fabricante[];
  seleccionadoTablaDestinatarioDatos?: Destinatario[];
  seleccionadoTablaProveedorDatos?: Proveedor[];
  seleccionadoTablaFacturadorDatos?: Facturador[];
}


/**
 * Crea y devuelve el estado inicial para el trámite 260206.
 * 
 * @returns {Tramite260206State} El estado inicial del trámite, que incluye:
 * - `destinatarioFinalTablaDatos`: Lista inicial vacía para los datos del destinatario final.
 * - `facturadorTablaDatos`: Lista inicial vacía para los datos del facturador.
 * - `proveedorTablaDatos`: Lista inicial vacía para los datos del proveedor.
 * - `fabricanteTablaDatos`: Lista inicial vacía para los datos del fabricante.
 * - `datosSolicitudFormState`: Objeto que contiene los datos iniciales del formulario de solicitud.
 * - `mercanciaForm`: Objeto que contiene los datos iniciales del formulario de mercancías.
 * - `opcionConfigDatos`: Configuración inicial para las opciones de tabla.
 * - `scianConfigDatos`: Configuración inicial para los datos SCIAN.
 * - `tablaMercanciasConfigDatos`: Configuración inicial para los datos de la tabla de mercancías.
 * - `seleccionadoopcionDatos`: Lista inicial vacía para las opciones seleccionadas.
 * - `seleccionadoScianDatos`: Lista inicial vacía para los datos SCIAN seleccionados.
 * - `seleccionadoTablaMercanciasDatos`: Lista inicial vacía para los datos de la tabla de mercancías seleccionados.
 * - `opcionesColapsableState`: Estado inicial del colapsable de opciones (por defecto `false`).
 * - `pagoDerechos`: Objeto que contiene los datos iniciales del pago de derechos.
 * - `tabSeleccionado`: Número de la pestaña seleccionada inicialmente (por defecto `1`).
 * - `seleccionadoTablaDestinatarioDatos`: Lista inicial vacía para los datos seleccionados de la tabla de destinatarios.
 * - `seleccionadoTablaFabricanteDatos`: Lista inicial vacía para los datos seleccionados de la tabla de fabricantes.
 * - `seleccionadoTablaProveedorDatos`: Lista inicial vacía para los datos seleccionados de la tabla de proveedores.
 * - `seleccionadoTablaFacturadorDatos`: Lista inicial vacía para los datos seleccionados de la tabla de facturadores.
 */
export function createInitialState(): Tramite260206State {
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
      publico: '',
      representanteRfc: '',
      representanteNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
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
    tablaMercanciasConfigDatos: [], //PRODUCTO_TABLA_DATA,
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
    tabSeleccionado: 1,
    seleccionadoTablaDestinatarioDatos: [],
    seleccionadoTablaFabricanteDatos: [],
    seleccionadoTablaProveedorDatos: [],
    seleccionadoTablaFacturadorDatos: [],
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'Tramite260206', resettable: true })
export class Tramite260206Store extends Store<Tramite260206State> {
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
 * Actualiza los datos de la tabla de fabricantes en el estado de la tienda.
 *
 * @param nuevoFabricante - Lista de objetos de tipo `Fabricante` que representan los nuevos datos de fabricantes.
 * @param tipoActualizacion - (Opcional) Tipo de actualización a realizar. Puede ser `TIPO_ACTUALIZACION.ELIMINAR` 
 *                            para reemplazar completamente los datos existentes con los nuevos.
 *
 * Si el tipo de actualización es `TIPO_ACTUALIZACION.ELIMINAR`, los datos de la tabla de fabricantes se reemplazan 
 * por completo con los nuevos datos proporcionados. En caso contrario, se actualiza la lista existente utilizando 
 * el método `actualizarLista`, que combina los datos existentes con los nuevos basándose en el campo `rfc`.
 *
 * Además, se reinicia la selección de datos de la tabla de fabricantes (`seleccionadoTablaFabricanteDatos`) 
 * estableciéndola como una lista vacía.
 */
    public updateFabricanteTablaDatos(newFabricantes: Fabricante[]): void {
      this.update((state) => {
        const ACTUALIZADA = [...state.fabricanteTablaDatos];
  
        newFabricantes.forEach((nuevo) => {
          if (!nuevo?.id) {
            nuevo.id =
              ACTUALIZADA.length > 0
                ? Math.max(...ACTUALIZADA.map((f) => f.id ?? 0)) + 1
                : 1;
          }
  
          const INDICE = ACTUALIZADA.findIndex((f) => f.id === nuevo.id);
  
          if (INDICE > -1) {
            ACTUALIZADA[INDICE] = { ...ACTUALIZADA[INDICE], ...nuevo };
          } else {
            ACTUALIZADA.push(nuevo);
          }
        });
  
        return {
          ...state,
          fabricanteTablaDatos: ACTUALIZADA,
        };
      });
    }


/**
 * Actualiza la lista de destinatarios finales en la tabla de datos.
 *
 * @param newDestinatarios - Lista de nuevos destinatarios que se utilizarán para actualizar la tabla.
 * @param tipoActualizacion - (Opcional) Tipo de actualización que se realizará. Si es `TIPO_ACTUALIZACION.ELIMINAR`,
 *                            se reemplazará la lista actual con los nuevos destinatarios. En caso contrario, 
 *                            se actualizará la lista existente utilizando el método `actualizarLista`.
 *
 * Este método también reinicia la selección de datos en la tabla de destinatarios (`seleccionadoTablaDestinatarioDatos`).
 */
  public updateDestinatarioFinalTablaDatos(
    newDestinatarios: Destinatario[]
  ): void {
    this.update((state) => ({
      ...state,
      destinatarioFinalTablaDatos: [
        ...newDestinatarios,
      ],
    }));
  }


/**
 * Actualiza los datos de la tabla de proveedores en el estado de la tienda.
 *
 * @param newProveedores - Lista de nuevos proveedores que se utilizarán para actualizar la tabla.
 * @param tipoActualizacion - (Opcional) Tipo de actualización a realizar. Si es `TIPO_ACTUALIZACION.ELIMINAR`,
 *                            se reemplaza la tabla con los nuevos proveedores. En caso contrario, se actualiza
 *                            la lista existente utilizando una clave específica ('nombreRazonSocial' o 'razonSocial').
 *
 * La función también limpia los datos seleccionados en la tabla de destinatarios.
 */
  public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaDatos: [
        ...newProveedores
      ],
    }));
  }

/**
 * @function updateFacturadorTablaDatos
 * @description Actualiza la tabla de datos de facturadores, agregando nuevos facturadores.
 * @param {Facturador[]} newFacturadores - El array de nuevos facturadores a agregar.
 * @returns {void}
 */
 public updateFacturadorTablaDatos(newFacturadores: Facturador[]): void {
    this.update((state) => ({
      ...state,
      facturadorTablaDatos: [
        ...newFacturadores
      ],
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
    seleccionadoTablaMercanciasDatos:[]
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
   * @method updateTabSeleccionado
   * @description Actualiza el índice de la pestaña seleccionada.
   * @param {number} tabSeleccionado - Nuevo índice de la pestaña.
   */
public updateTabSeleccionado(tabSeleccionado: number): void {
  this.update((state) => ({
    ...state,
    tabSeleccionado: tabSeleccionado,
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

setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
}
