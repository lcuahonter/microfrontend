import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

export interface Tramite260516State {
  /**
   * Identificador de la solicitud (opcional).
  */
  idSolicitud: number;
}

/**
 * Crea y retorna el estado inicial para el store de la funcionalidad Tramite260516.
 *
 * El estado inicial incluye valores por defecto para todos los campos de formularios, tablas,
 * opciones de configuración y estado de la interfaz de usuario relevantes para el flujo del trámite 260516.
 * Esta función se utiliza normalmente para inicializar el store o restablecerlo a su estado por defecto.
 *
 * @returns {Tramite260516State} El objeto de estado inicial para el store Tramite260516.
 */
export function createInitialState(): Tramite260516State {
  return {
    idSolicitud: 0,
  };
}
/**
 * @class Tramite260516Store
 * @description
 * Clase que representa el estado global del trámite `260516` utilizando Akita Store.
 * Esta clase gestiona el estado de los datos relacionados con el trámite, incluyendo
 * destinatarios, fabricantes, proveedores, facturadores, mercancías, y más.
 *
 * @extends Store<Tramite260516State>
 * Extiende la clase `Store` de Akita para manejar el estado del trámite.
 *
 * @decorator Injectable
 * Marca la clase como un servicio inyectable en Angular.
 *
 * @decorator StoreConfig
 * Configura el nombre del store como `tramite260516` y permite que el estado sea reiniciable.
 *
 * @property {Tramite260516State} state
 * Representa el estado inicial del trámite, definido por la función `createInitialState`.
 *
 * @method updateDatosSolicitudFormState
 * Actualiza el estado del formulario de datos de la solicitud.
 *
 * @method updateFabricanteTablaDatos
 * Agrega nuevos fabricantes a la tabla de datos de fabricantes.
 *
 * @method updateDestinatarioFinalTablaDatos
 * Agrega nuevos destinatarios a la tabla de datos de destinatarios finales.
 *
 * @method updateProveedorTablaDatos
 * Agrega nuevos proveedores a la tabla de datos de proveedores.
 *
 * @method updateFacturadorTablaDatos
 * Agrega nuevos facturadores a la tabla de datos de facturadores.
 *
 * @method updateOpcionConfigDatos
 * Actualiza la configuración de opciones de la tabla.
 *
 * @method updateScianConfigDatos
 * Actualiza la configuración de datos de la tabla SCIAN.
 *
 * @method updateTablaMercanciasConfigDatos
 * Actualiza la configuración de datos de la tabla de mercancías.
 *
 * @method updatePagoDerechos
 * Actualiza los datos relacionados con el pago de derechos.
 *
 * @method updateTabSeleccionado
 * Actualiza el índice de la pestaña seleccionada en el estado.
 *
 * @example
 * // Crear una instancia del store
 * const store = new Tramite260516Store();
 *
 * // Actualizar el estado del formulario de datos de la solicitud
 * store.updateDatosSolicitudFormState({
 *   rfcSanitario: 'ABC123456789',
 *   denominacionRazon: 'Empresa Ejemplo',
 *   correoElectronico: 'ejemplo@correo.com',
 *   ...
 * });
 *
 * // Agregar un nuevo fabricante
 * store.updateFabricanteTablaDatos([{ nombre: 'Fabricante 1', direccion: 'Dirección 1' }]);
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260516', resettable: true })
export class Tramite260516Store extends Store<Tramite260516State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * @method setIdSolicitud
   * @description Establece el identificador de la solicitud.
   * @param {number} idSolicitud - Nuevo identificador de la solicitud.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
        ...state,
        idSolicitud,
    }));
  }
}
