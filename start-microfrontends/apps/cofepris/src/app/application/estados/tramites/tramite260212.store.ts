
/**
 * Importaciones necesarias para el funcionamiento del store.
 */
import { FabricanteDatos, TablaDatos } from '../../tramites/260212/models/permiso-maquila.models';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define el estado de los terceros relacionados para el trámite 260212.
 * Contiene arreglos de datos para fabricante, destinatario, proveedor y facturador.
 */
export interface TercerosRelacionadas260212State {
  /**
   * Datos del fabricante.
   */
  Fabricante: TablaDatos[];
  /**
   * Datos del destinatario.
   */
  Destinatario: TablaDatos[];
  /**
   * Datos del proveedor.
   */
  Proveedor: TablaDatos[];
  /**
   * Datos del facturador.
   */
  Facturador: TablaDatos[];
  Fabricantes: FabricanteDatos[];
  Proveedores: FabricanteDatos[];
  Facturadores: FabricanteDatos[];
  Destinatarios: FabricanteDatos[];
}

/**
 * Función que crea el estado inicial del store.
 * Inicializa todos los arreglos de datos como vacíos.
 * 
 * @returns Estado inicial del store.
 */
export function createInitialState(): TercerosRelacionadas260212State {
  return {
    Fabricante: [],
    Destinatario: [],
    Proveedor: [],
    Facturador: [],
    Fabricantes: [],
    Destinatarios: [],
    Proveedores: [],
    Facturadores: []
  };
}

/**
 * Store que gestiona el estado de los terceros relacionados para el trámite 260212.
 * Se provee en el ámbito de la aplicación y permite reiniciar su estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260212', resettable: true })
export class Shared260212Store extends Store<TercerosRelacionadas260212State> {

  /**
   * Constructor del store.
   * Inicializa el estado del store con el estado inicial creado por la función `createInitialState`.
   */
  constructor() {
    super(createInitialState());
  }
  /**
 * Actualiza la lista de fabricantes en el estado del store.
 * @param fabricantes - Arreglo de objetos FabricanteDatos que se almacenarán en el store.
 */
public setFabricantes(fabricantes: FabricanteDatos[]): void {
  this.update((state) => ({
      ...state,
      Fabricantes: fabricantes,
    }));
}

/**
 * Actualiza la lista de proveedores en el estado del store.
 * @param proveedores - Arreglo de objetos FabricanteDatos que se almacenarán en el store.
 */
public setProveedors(proveedores: FabricanteDatos[]): void {
   this.update((state) => ({
      ...state,
      Proveedores: proveedores,
    }));
}

/**
 * Actualiza la lista de facturadores en el estado del store.
 * @param facturadores - Arreglo de objetos FabricanteDatos que se almacenarán en el store.
 */
public setFacturadors(facturadores: FabricanteDatos[]): void {
  this.update((state) => ({
      ...state,
      Facturadores: facturadores,
    }));
}

/**
 * Actualiza la lista de destinatarios en el estado del store.
 * @param destinatarios - Arreglo de objetos FabricanteDatos que se almacenarán en el store.
 */
public setDestinatarios(destinatarios: FabricanteDatos[]): void {
  this.update((state) => ({
      ...state,
      Destinatarios: destinatarios,
    }));
}

  /**
   * Establece los datos del fabricante en el estado del store.
   * 
   * @param fabricante Arreglo de datos del fabricante.
   */
  public setFabricante(fabricante: TablaDatos[]) {
    this.update((state) => ({
      ...state,
      Fabricante: fabricante,
    }));
  }

  /**
   * Establece los datos del destinatario en el estado del store.
   * 
   * @param destinatario Arreglo de datos del destinatario.
   */
  public setDestinatario(destinatario: TablaDatos[]) {
    this.update((state) => ({
      ...state,
      Destinatario: destinatario,
    }));
  }

  /**
   * Establece los datos del proveedor en el estado del store.
   * 
   * @param proveedor Arreglo de datos del proveedor.
   */
  public setProveedor(proveedor: TablaDatos[]) {
    this.update((state) => ({
      ...state,
      Proveedor: proveedor,
    }));
  }

  /**
   * Establece los datos del facturador en el estado del store.
   * 
   * @param facturador Arreglo de datos del facturador.
   */
  public setFacturador(facturador: TablaDatos[]) {
    this.update((state) => ({
      ...state,
      Facturador: facturador,
    }));
  }

}
