
/**
 * Importaciones necesarias para el funcionamiento del store.
 */
import { DestinatarioModel, FacricanteModel, FacturadorModel, ProveedorModel } from '../../models/terceros-fabricante-relocionados.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { TablaDatos } from '../../models/terceros-fabricante.model';


/**
 * Interfaz que define el estado completo de los terceros relacionados para el trámite.
 * 
 * Contiene dos tipos de datos para cada entidad:
 * - Arrays de TablaDatos: Datos básicos para visualización en tablas
 * - Arrays de Modelos: Información completa y detallada de cada entidad
 * 
 * Las entidades incluidas son: fabricante, destinatario, proveedor y facturador.
 */
export interface TercerosRelacionadasState {
  /**
   * Datos básicos del fabricante para visualización en tabla.
   */
  Fabricante: TablaDatos[];
  /**
   * Datos básicos del destinatario para visualización en tabla.
   */
  Destinatario: TablaDatos[];
  /**
   * Datos básicos del proveedor para visualización en tabla.
   */
  Proveedor: TablaDatos[];
  /**
   * Datos del facturador.
   */
  Facturador: TablaDatos[];
  /**
   * Modelo completo de datos del fabricante con toda la información detallada.
   * Incluye datos personales, de contacto y domicilio del fabricante.
   */
  facricanteModel: FacricanteModel[];
  /**
   * Modelo completo de datos del destinatario con toda la información detallada.
   * Incluye datos personales, de contacto y domicilio del destinatario.
   */
  destinatarioModel: DestinatarioModel[];
  /**
   * Modelo completo de datos del proveedor con toda la información detallada.
   * Incluye datos personales, de contacto y domicilio del proveedor.
   */
  proveedorModel: ProveedorModel[];
  /**
   * Modelo completo de datos del facturador con toda la información detallada.
   * Incluye datos personales, de contacto y domicilio del facturador.
   */
  facturadorModel: FacturadorModel[];
}

/**
 * Función que crea el estado inicial del store de terceros relacionados.
 * 
 * Inicializa todos los arrays tanto de datos básicos (TablaDatos) como de modelos completos
 * como arrays vacíos, proporcionando un punto de partida limpio para el estado del store.
 * 
 * @returns Estado inicial del store con todos los arrays vacíos
 */
export function createInitialState(): TercerosRelacionadasState {
  return {
    Fabricante: [],
    Destinatario: [],
    Proveedor: [],
    Facturador: [],
    facricanteModel: [],
    destinatarioModel: [],
    proveedorModel: [],
    facturadorModel: [],
  };
}

/**
 * Store que gestiona el estado de los terceros relacionados para trámites de COFEPRIS.
 * 
 * Este store mantiene la información de las entidades terceras involucradas en un trámite:
 * fabricantes, destinatarios, proveedores y facturadores. Para cada entidad se almacenan
 * tanto los datos básicos para tablas como los modelos completos con toda la información.
 * 
 * Se provee en el ámbito raíz de la aplicación y permite reiniciar su estado cuando sea necesario.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tercerosRelacionadas', resettable: true })
export class TramiteRelacionadaseStore extends Store<TercerosRelacionadasState> {

  /**
   * Constructor del store de terceros relacionados.
   * 
   * Inicializa el estado del store con valores por defecto vacíos
   * utilizando la función createInitialState().
   */
  constructor() {
    super(createInitialState());
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

  /**
   * Establece el modelo completo de datos del fabricante en el estado del store.
   * 
   * Este método actualiza el estado con la información detallada del fabricante,
   * incluyendo todos los campos del formulario como datos personales, domicilio,
   * información de contacto y demás campos requeridos.
   * 
   * @param facricanteModel - Array del modelo completo de fabricantes
   */
  public setFacricanteModel(facricanteModel: FacricanteModel[]) {
    this.update((state) => ({
      ...state,
      facricanteModel: facricanteModel,
    }));
  }

  /**
   * Establece el modelo completo de datos del destinatario en el estado del store.
   * 
   * Este método actualiza el estado con la información detallada del destinatario,
   * incluyendo todos los campos del formulario como datos personales, domicilio,
   * información de contacto y demás campos requeridos.
   * 
   * @param destinatarioModel - Array del modelo completo de destinatarios
   */
  public setDestinatarioModel(destinatarioModel: DestinatarioModel[]) {
    this.update((state) => ({
      ...state,
      destinatarioModel: destinatarioModel,
    }));
  }

  /**
   * Establece el modelo completo de datos del proveedor en el estado del store.
   * 
   * Este método actualiza el estado con la información detallada del proveedor,
   * incluyendo todos los campos del formulario como datos personales, domicilio,
   * información de contacto y demás campos requeridos.
   * 
   * @param proveedorModel - Array del modelo completo de proveedores
   */
  public setProveedorModel(proveedorModel: ProveedorModel[]) {
    this.update((state) => ({
      ...state,
      proveedorModel: proveedorModel,
    }));
  }

  /**
   * Establece el modelo completo de datos del facturador en el estado del store.
   * 
   * Este método actualiza el estado con la información detallada del facturador,
   * incluyendo todos los campos del formulario como datos personales, domicilio,
   * información de contacto y demás campos requeridos.
   * 
   * @param facturadorModel - Array del modelo completo de facturadores
   */
  public setFacturadorModel(facturadorModel: FacturadorModel[]) {
    this.update((state) => ({
      ...state,
      facturadorModel: facturadorModel,
    }));
  }

}
