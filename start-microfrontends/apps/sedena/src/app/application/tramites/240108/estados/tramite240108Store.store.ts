import { DatosDelTramiteFormState, MercanciaDetalle } from '../../../shared/models/datos-del-tramite.model';
import { DestinoFinal, Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { PagoDerechosFormState } from '../../../shared/models/pago-de-derechos.model';

/**
 * @interface Tramite240108State
 * @description
 * Representa el estado completo del flujo del trámite 240108, incluyendo información de pestañas, formularios, tablas de datos y registros en edición.
 */
export interface Tramite240108State {
  /**
 * Identificador de la solicitud.
 * Se utiliza para consultar o actualizar
 * la información asociada al trámite.
 */
    idSolicitud?: number;  
    
  /**
   * @property {number} [tabSeleccionado]
   * @description
   * Número de la pestaña actualmente activa en el flujo del trámite.
   * 
   * @remarks
   * Usado por la interfaz de usuario para determinar qué sección del trámite se está visualizando.
   * 
   * @example
   * tabSeleccionado: 2
   */
  tabSeleccionado?: number;

  /**
   * @property {DestinoFinal[]} destinatarioFinalTablaDatos
   * @description
   * Lista de destinatarios finales registrados en el trámite.
   * 
   * @remarks
   * Esta tabla representa los destinatarios finales agregados por el usuario.
   * 
   * @example
   * destinatarioFinalTablaDatos: [{ nombre: 'Empresa X', pais: 'México' }]
   */
  destinatarioFinalTablaDatos: DestinoFinal[];

  /**
   * @property {Proveedor[]} proveedorTablaDatos
   * @description
   * Lista de proveedores registrados en el trámite.
   * 
   * @remarks
   * Esta tabla contiene los proveedores asociados al trámite actual.
   * 
   * @example
   * proveedorTablaDatos: [{ nombre: 'Proveedor Y', rfc: 'XYZ123456' }]
   */
  proveedorTablaDatos: Proveedor[];

  /**
   * @property {PagoDerechosFormState} pagoDerechos
   * @description
   * Estado del formulario relacionado al pago de derechos.
   * 
   * @remarks
   * Incluye datos como el banco, fecha, importe, referencia, etc.
   * 
   * @example
   * pagoDerechos: { banco: 'BANXICO', importePago: '1000.00' }
   */
  pagoDerechos: PagoDerechosFormState;

  /**
   * @property {MercanciaDetalle[]} merccancialTablaDatos
   * @description
   * Lista de mercancías asociadas al trámite.
   * 
   * @remarks
   * Contiene los detalles de cada mercancía registrada.
   * 
   * @example
   * merccancialTablaDatos: [{ nombre: 'Arma A', cantidad: 10 }]
   */
  merccancialTablaDatos: MercanciaDetalle[];

  /**
   * @property {DatosDelTramiteFormState} datosDelTramite
   * @description
   * Información general del formulario del trámite.
   * 
   * @remarks
   * Contiene datos como permiso general, uso final, aduanas seleccionadas, país destino, etc.
   * 
   * @example
   * datosDelTramite: { permisoGeneral: 'PG-2023', paisDestino: 'Colombia' }
   */
  datosDelTramite: DatosDelTramiteFormState;

  /**
   * @property {DestinoFinal | null} [modificarDestinarioDatos]
   * @description
   * Objeto con los datos del destinatario final que se está modificando, si aplica.
   * 
   * @remarks
   * Se usa para precargar los datos en el formulario de edición.
   * 
   * @example
   * modificarDestinarioDatos: { nombre: 'Empresa Z', direccion: 'Av. Reforma' }
   */
  modificarDestinarioDatos?: DestinoFinal | null;

  /**
   * @property {Proveedor | null} [modificarProveedorDatos]
   * @description
   * Objeto con los datos del proveedor que se está modificando, si aplica.
   * 
   * @remarks
   * Se utiliza cuando el usuario desea editar un proveedor existente.
   * 
   * @example
   * modificarProveedorDatos: { nombre: 'Proveedor A', pais: 'EE.UU.' }
   */
  modificarProveedorDatos?: Proveedor | null;
}

/**
 * Crea el estado inicial para el trámite 240108.
 *
 * @function createInitialState
 * @returns {Tramite240108State} El estado inicial del store.
 */
export function createInitialState(): Tramite240108State {
  return {
    idSolicitud: undefined, 
    tabSeleccionado: 1,
    destinatarioFinalTablaDatos: [],
    proveedorTablaDatos: [],
    pagoDerechos: {
      claveReferencia: '',
      cadenaDependencia: '',
      banco: '',
      llavePago: '',
      fechaPago: '',
      importePago: '',
    },
    merccancialTablaDatos: [],
    datosDelTramite: {
      permisoGeneral: '',
      usoFinal: '',
      aduanasSeleccionadas: [],
      paisDestino: '',
    },
    modificarDestinarioDatos: null,
    modificarProveedorDatos: null
  };
}

/**
 * Store que maneja el estado del trámite 240108.
 * Utiliza Akita para el control reactivo del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite240108', resettable: true })
export class Tramite240108Store extends Store<Tramite240108State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Cambia la pestaña actualmente seleccionada.
   *
   * @method updateTabSeleccionado
   * @param {number} tabSeleccionado - Índice de la nueva pestaña seleccionada.
   * @returns {void}
   */
  public updateTabSeleccionado(tabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      tabSeleccionado: tabSeleccionado,
    }));
  }

  /**
   * Actualiza los datos generales del formulario de trámite.
   *
   * @method updateDatosDelTramiteFormState
   * @param {DatosDelTramiteFormState} datosDelTramiteFormState - Estado actualizado del formulario.
   * @returns {void}
   */
  public updateDatosDelTramiteFormState(
    datosDelTramiteFormState: DatosDelTramiteFormState
  ): void {
    this.update((state) => ({
      ...state,
      datosDelTramite: datosDelTramiteFormState,
    }));
  }

  /**
   * Actualiza los datos del formulario de pago de derechos.
   *
   * @method updatePagoDerechosFormState
   * @param {PagoDerechosFormState} pagoDerechosFormState - Estado actualizado del formulario de pago.
   * @returns {void}
   */
  public updatePagoDerechosFormState(
    pagoDerechosFormState: PagoDerechosFormState
  ): void {
    this.update((state) => ({
      ...state,
      pagoDerechos: pagoDerechosFormState,
    }));
  }

  /**
   * Agrega nuevos registros a la tabla de destinatarios finales.
   *
   * @method updateDestinatarioFinalTablaDatos
   * @param {DestinoFinal[]} newDestinatarios - Nuevos destinatarios a agregar.
   * @returns {void}
   */
 public updateDestinatarioFinalTablaDatos(
    newDestinatarios: DestinoFinal[]
  ): void {
    this.update((state) => {

      const EXISTING_LIST = state.destinatarioFinalTablaDatos;

      const UPDATED_LIST = [...EXISTING_LIST];

      for (const NEW_DEST of newDestinatarios) {
        const INDEX = EXISTING_LIST.findIndex(
          (existing) => existing.id === NEW_DEST.id
        );

        if (INDEX !== -1) {
          UPDATED_LIST[INDEX] = NEW_DEST;
        } else {
          UPDATED_LIST.push(NEW_DEST);
        }
      }

      return {
        ...state,
        destinatarioFinalTablaDatos: UPDATED_LIST,
        modificarDestinarioDatos: null
      };
    });
  }

  /**
   * Agrega nuevos registros a la tabla de proveedores.
   *
   * @method updateProveedorTablaDatos
   * @param {Proveedor[]} newProveedores - Nuevos proveedores a agregar.
   * @returns {void}
   */
   public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => {

      const EXISTING_LIST = state.proveedorTablaDatos;

      const UPDATED_LIST = [...EXISTING_LIST];

      for (const NEW_DEST of newProveedores) {
        const INDEX = EXISTING_LIST.findIndex(
          (existing) => existing.id === NEW_DEST.id
        );

        if (INDEX !== -1) {
          UPDATED_LIST[INDEX] = NEW_DEST;
        } else {
          UPDATED_LIST.push(NEW_DEST);
        }
      }

      return {
        ...state,
        proveedorTablaDatos: UPDATED_LIST,
        modificarProveedorDatos: null
      };
    });
  }

  /**
   * Agrega nuevos registros a la tabla de mercancías.
   *
   * @method updateMercanciaTablaDatos
   * @param {MercanciaDetalle[]} newMercancia - Nuevas mercancías a agregar.
   * @returns {void}
   */
  public updateMercanciaTablaDatos(newMercancia: MercanciaDetalle[]): void {
    this.update((state) => ({
      ...state,
      merccancialTablaDatos: [...state.merccancialTablaDatos, ...newMercancia],
    }));
  }

  /**
   * Actualiza el estado con los datos del destinatario proporcionados y limpia los datos del proveedor.
   * 
   * Esta función se utiliza para establecer nuevos datos del destinatario (`modificarDestinarioDatos`)
   * en el estado del store, asegurando que los datos del proveedor se reinicien a `null`.
   *
   * @param {DestinoFinal} datos - Objeto con la información actualizada del destinatario.
   * @returns {void}
   */
  public actualizarDatosDestinatario(datos: DestinoFinal): void {
    this.update((state) => ({
      ...state,
      modificarDestinarioDatos: datos,
      modificarProveedorDatos: null
    }));
  }

  /**
   * Actualiza el estado con los datos del proveedor proporcionados y limpia los datos del destinatario.
   * 
   * Esta función se utiliza para establecer nuevos datos del proveedor (`modificarProveedorDatos`)
   * en el estado del store, asegurando que los datos del destinatario se reinicien a `null`.
   *
   * @param {Proveedor} datos - Objeto con la información actualizada del proveedor.
   * @returns {void}
   */
  public actualizarDatosProveedor(datos: Proveedor): void {
    this.update((state) => ({
      ...state,
      modificarProveedorDatos: datos,
      modificarDestinarioDatos: null
    }));
  }

  /**
 * Actualiza parcialmente el estado del trámite.
 * Combina el estado actual con los valores proporcionados.
 *
 * @param partial Objeto con las propiedades del estado a actualizar.
 */
  public updateState(
      partial: Partial<Tramite240108State>
    ): void {
      this.update((state) => ({
        ...state,
        ...partial,
      }));
    }

     /**
   * Limpia los datos de terceros del store de trámite.
   */
  public clearTercerosDatos(): void {
    this.update((state) => {
      return {
        ...state,
        modificarDestinarioDatos: null,
        modificarProveedorDatos: null,
      };
    });

  }
}
