import { DatosSolicitudFormState } from '../../../../shared/models/datos-solicitud.model';
import { Destinatario } from '../../../../shared/models/terceros-relacionados.model';
import { Fabricante } from '../../../../shared/models/terceros-relacionados.model';
import { Facturador } from '../../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaForm } from '../../../../shared/models/datos-solicitud.model';
import { PRODUCTO_TABLA_DATA } from '../../../../shared/constantes/datos-solicitud.enum';
import { PagoDerechosFormState } from '../../../../shared/models/terceros-relacionados.model';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
import { TABLA_OPCION_DATA } from '../../../../shared/constantes/datos-solicitud.enum';
import { TablaMercanciasDatos } from '../../../../shared/models/datos-solicitud.model';
import { TablaOpcionConfig } from '../../../../shared/models/datos-solicitud.model';
import { TablaScianConfig } from '../../../../shared/models/datos-solicitud.model';

/**
 * Representa el estado de la solicitud para el trámite 260205.
 */
export interface Tramite260205State {
/**
   * Identificador de la solicitud (opcional).
  */
  idSolicitud: number;

  /**
   * Lista de destinatarios finales en la tabla de datos.
   */
  destinatarioFinalTablaDatos: Destinatario[];

  /**
   * Lista de facturadores en la tabla de datos.
   */
  facturadorTablaDatos: Facturador[];

  /**
   * Lista de proveedores en la tabla de datos.
   */
  proveedorTablaDatos: Proveedor[];

  /**
   * Lista de fabricantes en la tabla de datos.
   */
  fabricanteTablaDatos: Fabricante[];

  /**
   * Estado del formulario de datos de la solicitud.
   */
  datosSolicitudFormState: DatosSolicitudFormState;

  /**
   * Información del formulario de mercancías.
   */
  mercanciaForm: MercanciaForm;

  /**
   * Configuración de opciones para la tabla de datos.
   */
  opcionConfigDatos: TablaOpcionConfig[];

  /**
   * Configuración de SCIAN para la tabla de datos.
   */
  scianConfigDatos: TablaScianConfig[];

  /**
   * Configuración de mercancías para la tabla de datos.
   */
  tablaMercanciasConfigDatos: TablaMercanciasDatos[];

  /**
   * Opciones seleccionadas en la tabla de datos.
   */
  seleccionadoopcionDatos: TablaOpcionConfig[];

  /**
   * SCIAN seleccionado en la tabla de datos.
   */
  seleccionadoScianDatos: TablaScianConfig[];

  /**
   * Mercancías seleccionadas en la tabla de datos.
   */
  seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[];

  /**
   * Estado de colapsabilidad de las opciones.
   */
  opcionesColapsableState: boolean;

  /**
   * Estado del formulario de pago de derechos.
   */
  pagoDerechos: PagoDerechosFormState;

  /**
   * Índice utilizado para identificar elementos específicos.
   */
  indice: number;

}

/**
 * Crea el estado inicial para el trámite 260205.
 * 
 * Este método devuelve un objeto que representa el estado inicial de la aplicación 
 * para el trámite específico. Incluye configuraciones predeterminadas, datos de formularios 
 * y estructuras de datos necesarias para la funcionalidad del trámite.
 * 
 * @returns {Tramite260205State} El estado inicial del trámite 260205.
 * 
 * Propiedades del estado inicial:
 * - `destinatarioFinalTablaDatos`: Lista vacía para los datos de destinatarios finales.
 * - `facturadorTablaDatos`: Lista vacía para los datos de facturadores.
 * - `proveedorTablaDatos`: Lista vacía para los datos de proveedores.
 * - `fabricanteTablaDatos`: Lista vacía para los datos de fabricantes.
 * - `datosSolicitudFormState`: Estado inicial del formulario de solicitud, con campos como:
 *   - `rfcSanitario`: RFC del sanitario.
 *   - `denominacionRazon`: Denominación o razón social.
 *   - `correoElectronico`: Correo electrónico del solicitante.
 *   - `codigoPostal`: Código postal.
 *   - `estado`: Estado de residencia.
 *   - `municipioAlcaldia`: Municipio o alcaldía.
 *   - `localidad`: Localidad.
 *   - `colonia`: Colonia.
 *   - `calle`: Calle.
 *   - `lada`: Lada telefónica.
 *   - `telefono`: Número de teléfono.
 *   - `aviso`: Aviso relacionado.
 *   - `licenciaSanitaria`: Licencia sanitaria.
 *   - `regimen`: Régimen fiscal.
 *   - `adunasDeEntradas`: Aduanas de entrada.
 *   - `aeropuerto`: Indicador de aeropuerto (booleano).
 *   - `publico`: Indicador público (por defecto "si").
 *   - `representanteRfc`: RFC del representante.
 *   - `representanteNombre`: Nombre del representante.
 *   - `apellidoPaterno`: Apellido paterno del representante.
 *   - `apellidoMaterno`: Apellido materno del representante.
 * - `mercanciaForm`: Estado inicial del formulario de mercancías, con campos como:
 *   - `clasificacionProducto`: Clasificación del producto.
 *   - `especificarClasificacionProducto`: Especificación de la clasificación del producto.
 *   - `denominacionEspecificaProducto`: Denominación específica del producto.
 *   - `denominacionDistintiva`: Denominación distintiva.
 *   - `denominacionComun`: Denominación común.
 *   - `tipoProducto`: Tipo de producto.
 *   - `formaFarmaceutica`: Forma farmacéutica.
 *   - `estadoFisico`: Estado físico del producto.
 *   - `fraccionArancelaria`: Fracción arancelaria.
 *   - `descripcionFraccion`: Descripción de la fracción.
 *   - `cantidadUmtValor`: Valor de la cantidad en UMT.
 *   - `cantidadUmt`: Cantidad en UMT.
 *   - `cantidadUmcValor`: Valor de la cantidad en UMC.
 *   - `cantidadUmc`: Cantidad en UMC.
 *   - `presentacion`: Presentación del producto.
 *   - `numeroRegistroSanitario`: Número de registro sanitario.
 *   - `fechaCaducidad`: Fecha de caducidad.
 *   - `paisDeOriginDatos`: Lista vacía para los datos de país de origen.
 *   - `paisDeProcedenciaDatos`: Lista vacía para los datos de país de procedencia.
 * - `opcionConfigDatos`: Configuración inicial de opciones de tabla.
 * - `scianConfigDatos`: Configuración inicial de datos SCIAN (vacío).
 * - `tablaMercanciasConfigDatos`: Configuración inicial de tabla de mercancías.
 * - `seleccionadoopcionDatos`: Lista vacía para las opciones seleccionadas.
 * - `seleccionadoScianDatos`: Lista vacía para los datos SCIAN seleccionados.
 * - `seleccionadoTablaMercanciasDatos`: Lista vacía para los datos de tabla de mercancías seleccionados.
 * - `opcionesColapsableState`: Estado inicial de las opciones colapsables (por defecto `false`).
 * - `pagoDerechos`: Estado inicial de los datos de pago de derechos, con campos como:
 *   - `claveReferencia`: Clave de referencia.
 *   - `cadenaDependencia`: Cadena de dependencia.
 *   - `estado`: Estado del pago.
 *   - `llavePago`: Llave de pago.
 *   - `fechaPago`: Fecha del pago.
 *   - `importePago`: Importe del pago.
 * - `indice`: Índice inicial (por defecto `1`).
 */
export function createInitialState(): Tramite260205State {
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
    tablaMercanciasConfigDatos: [],
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
    indice: 1,    
  };
}


/**
 * Decorador que marca esta clase como un servicio inyectable en Angular.
 * 
 * Este decorador permite que la clase `Tramite260205Store` sea registrada en el sistema de inyección de dependencias de Angular,
 * lo que facilita su uso en otras partes de la aplicación. La configuración especificada con `{ providedIn: 'root' }` indica que 
 * este servicio estará disponible de manera global en toda la aplicación, sin necesidad de declararlo explícitamente en los módulos.
 * 
 * @decorador @Injectable
 * @param providedIn - Define el alcance del servicio. En este caso, `'root'` asegura que el servicio esté disponible globalmente.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260205', resettable: true })
export class Tramite260205Store extends Store<Tramite260205State> {

  /**
   * Constructor de la clase `Tramite260205Store`.
   * 
   * Este constructor inicializa el estado inicial de la tienda utilizando 
   * la función `createInitialState` y llama al constructor de la clase base 
   * mediante `super()`.
   * 
   * La tienda se utiliza para gestionar el estado relacionado con los 
   * trámites específicos del módulo `260205` dentro de la aplicación.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado del formulario de datos de la solicitud.
   * 
   * Este método permite modificar el estado del formulario de datos de la solicitud
   * en la tienda, actualizando los campos según el objeto proporcionado.
   * 
   * @param datosSolicitudFormState - Nuevo estado del formulario de datos de la solicitud.
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
   * Actualiza el formulario de mercancías con los nuevos datos proporcionados.
   * 
   * Este método permite modificar el estado del formulario de mercancías en la tienda,
   * actualizando los campos según el objeto proporcionado.
   * 
   * @param mercanciaForm - Nuevo estado del formulario de mercancías.
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
   * Actualiza la lista de destinatarios finales en la tabla de datos del estado.
   *
   * Este método toma una lista de nuevos destinatarios y los agrega a la lista
   * existente de `destinatarioFinalTablaDatos` en el estado actual.
   *
   * @param newDestinatarios - Un arreglo de objetos de tipo `Destinatario` que
   * representan los nuevos destinatarios que se deben agregar a la tabla de datos.
   *
   * @returns {void} Este método no devuelve ningún valor.
   *
   * @example
   * ```typescript
   * const nuevosDestinatarios: Destinatario[] = [
   *   { id: 1, nombre: 'Juan Pérez' },
   *   { id: 2, nombre: 'María López' }
   * ];
   * store.updateDestinatarioFinalTablaDatos(nuevosDestinatarios);
   * ```
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
   * Actualiza la lista de proveedores en la tabla de datos del estado.
   * 
   * Este método toma una lista de nuevos proveedores y los agrega a la lista 
   * existente de proveedores en el estado. La actualización se realiza de 
   * manera inmutable, creando una nueva lista que combina los proveedores 
   * existentes con los nuevos.
   * 
   * @param newProveedores - Un arreglo de objetos de tipo `Proveedor` que 
   * contiene los nuevos proveedores que se agregarán a la tabla de datos.
   * 
   * Ejemplo de uso:
   * ```typescript
   * const nuevosProveedores: Proveedor[] = [
   *   { id: 1, nombre: 'Proveedor A' },
   *   { id: 2, nombre: 'Proveedor B' }
   * ];
   * store.updateProveedorTablaDatos(nuevosProveedores);
   * ```
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
   * Actualiza la lista de datos de facturadores en el estado de la tienda.
   *
   * Este método toma una lista de nuevos facturadores y los agrega a la lista 
   * existente de `facturadorTablaDatos` en el estado de la tienda. La actualización 
   * se realiza de manera inmutable, asegurando que el estado original no se modifique 
   * directamente.
   *
   * @param newFacturadores - Un arreglo de objetos de tipo `Facturador` que 
   *                          representan los nuevos facturadores a agregar.
   *
   * Ejemplo de uso:
   * ```typescript
   * const nuevosFacturadores: Facturador[] = [
   *   { id: 1, nombre: 'Facturador A' },
   *   { id: 2, nombre: 'Facturador B' }
   * ];
   * store.updateFacturadorTablaDatos(nuevosFacturadores);
   * ```
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
   * Actualiza el formulario de mercancías con los nuevos datos proporcionados.
   * 
   * Este método permite modificar el estado del formulario de mercancías en la tienda,
   * actualizando los campos según el objeto proporcionado.
   * 
   * @param mercanciaForm - Nuevo estado del formulario de mercancías.
   */
  public updateOpcionConfigDatos(opcionConfigDatos: TablaOpcionConfig[]): void {
    this.update((state) => ({
      ...state,
      opcionConfigDatos,
    }));
  }

  /**
   * Actualiza la configuración de datos SCIAN en el estado de la tienda.
   * 
   * Este método permite modificar la lista de configuraciones SCIAN en el estado,
   * reemplazando la lista existente con la nueva proporcionada.
   * 
   * @param scianConfigDatos - Nuevo arreglo de configuraciones SCIAN a establecer en el estado.
   */
  public updateScianConfigDatos(scianConfigDatos: TablaScianConfig[]): void {
    this.update((state) => ({
      ...state,
      scianConfigDatos,
    }));
  }

  /**
   * Actualiza la lista de mercancías en la tabla de datos del estado.
   * 
   * Este método toma una lista de nuevos datos de mercancías y los agrega a la lista
   * existente de `tablaMercanciasConfigDatos` en el estado actual.
   * 
   * @param tablaMercanciasConfigDatos - Un arreglo de objetos de tipo `TablaMercanciasDatos`
   * que representan las nuevas mercancías que se deben agregar a la tabla de datos.
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

  /**
   * Actualiza las opciones seleccionadas en la tabla de datos del estado.
   * 
   * Este método toma una lista de nuevas opciones seleccionadas y las agrega a la lista
   * existente de `seleccionadoopcionDatos` en el estado actual.
   * 
   * @param seleccionadoopcionDatos - Un arreglo de objetos de tipo `TablaOpcionConfig`
   * que representan las nuevas opciones seleccionadas que se deben agregar a la tabla de datos.
   */
  public updatePagoDerechos(nuevoPagoDerechos: PagoDerechosFormState): void {
    this.update((state) => ({
      ...state,
      pagoDerechos: nuevoPagoDerechos,
    }));
  }

  /**
   * Actualiza el índice en el estado del store.
   * 
   * Este método permite modificar el valor del índice en el estado actual del store,
   * lo que puede ser útil para identificar o rastrear elementos específicos dentro
   * de la aplicación.
   * 
   * @param indice - Nuevo valor del índice a establecer en el estado.
   */
  public setIndice(indice: number): void {
    this.update((state) => ({
      ...state,
      indice
    }))
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
