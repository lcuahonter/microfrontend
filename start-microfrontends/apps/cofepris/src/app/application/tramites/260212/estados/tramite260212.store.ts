import { DatosSolicitudFormState } from '../../../shared/models/datos-solicitud.model';
import { Destinatario } from '../../../shared/models/terceros-relacionados.model';
import { Fabricante } from '../../../shared/models/terceros-relacionados.model';
import { Facturador } from '../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaForm } from '../../../shared/models/datos-solicitud.model';
import { PagoDerechosFormState } from '../../../shared/models/terceros-relacionados.model';
import { Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
import { TABLA_OPCION_DATA } from '../../../shared/constantes/datos-solicitud.enum';
import { TablaMercanciasDatos } from '../../../shared/models/datos-solicitud.model';
import { TablaOpcionConfig } from '../../../shared/models/datos-solicitud.model';
import { TablaScianConfig } from '../../../shared/models/datos-solicitud.model';

/**
 * Representa el estado del trámite 260212 en la aplicación.
 *
 * @interface Tramite260212State
 *
 * @property {Destinatario[]} destinatarioFinalTablaDatos - Lista de destinatarios finales.
 * @property {Facturador[]} facturadorTablaDatos - Lista de facturadores.
 * @property {Proveedor[]} proveedorTablaDatos - Lista de proveedores.
 * @property {Fabricante[]} fabricanteTablaDatos - Lista de fabricantes.
 * @property {DatosSolicitudFormState} datosSolicitudFormState - Información del formulario de solicitud.
 * @property {MercanciaForm} mercanciaForm - Datos del formulario de mercancías.
 * @property {TablaOpcionConfig[]} opcionConfigDatos - Opciones de configuración de tabla.
 * @property {TablaScianConfig[]} scianConfigDatos - Configuraciones SCIAN disponibles.
 * @property {TablaMercanciasDatos[]} tablaMercanciasConfigDatos - Configuración de tabla de mercancías.
 * @property {TablaOpcionConfig[]} seleccionadoopcionDatos - Opciones seleccionadas.
 * @property {TablaScianConfig[]} seleccionadoScianDatos - Configuraciones SCIAN seleccionadas.
 * @property {TablaMercanciasDatos[]} seleccionadoTablaMercanciasDatos - Mercancías seleccionadas.
 * @property {boolean} opcionesColapsableState - Estado del panel colapsable.
 * @property {PagoDerechosFormState} pagoDerechos - Estado del formulario de pago de derechos.
 * @property {number} [tabSeleccionado] - Pestaña seleccionada actualmente.
 */
export interface Tramite260212State {
  /** Identificador de la solicitud, puede ser nulo si aún no se ha creado. */
  idSolicitud: number;
  /**
   * Datos de la tabla de destinatarios finales.
   * @type {Destinatario[]}
   */
  destinatarioFinalTablaDatos: Destinatario[];

  /**
   * Datos de la tabla de facturadores.
   * @type {Facturador[]}
   */
  facturadorTablaDatos: Facturador[];

  /**
   * Datos de la tabla de proveedores.
   * @type {Proveedor[]}
   */
  proveedorTablaDatos: Proveedor[];

  /**
   * Datos de la tabla de fabricantes.
   * @type {Fabricante[]}
   */
  fabricanteTablaDatos: Fabricante[];

  /**
   * Estado del formulario de datos de solicitud.
   * @type {DatosSolicitudFormState}
   */
  datosSolicitudFormState: DatosSolicitudFormState;

  /**
   * Estado del formulario de mercancías.
   * @type {MercanciaForm}
   */
  mercanciaForm: MercanciaForm;

  /**
   * Configuración de opciones de la tabla.
   * @type {TablaOpcionConfig[]}
   */
  opcionConfigDatos: TablaOpcionConfig[];

  /**
   * Configuración de SCIAN en la tabla.
   * @type {TablaScianConfig[]}
   */
  scianConfigDatos: TablaScianConfig[];

  /**
   * Configuración de datos de mercancías en la tabla.
   * @type {TablaMercanciasDatos[]}
   */
  tablaMercanciasConfigDatos: TablaMercanciasDatos[];

  /**
   * Datos seleccionados de opciones en la tabla.
   * @type {TablaOpcionConfig[]}
   */
  seleccionadoopcionDatos: TablaOpcionConfig[];

  /**
   * Datos seleccionados de SCIAN en la tabla.
   * @type {TablaScianConfig[]}
   */
  seleccionadoScianDatos: TablaScianConfig[];

  /**
   * Datos seleccionados de mercancías en la tabla.
   * @type {TablaMercanciasDatos[]}
   */
  seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[];

  /**
   * Estado de colapsabilidad de las opciones.
   * @type {boolean}
   */
  opcionesColapsableState: boolean;

  /**
   * Estado del formulario de pago de derechos.
   * @type {PagoDerechosFormState}
   */
  pagoDerechos: PagoDerechosFormState;
}

/**
 * Crea el estado inicial para la aplicación Tramite260212.
 * 
 * @returns {Tramite260212State} El estado inicial con todas las propiedades predefinidas.
 * 
 * @property {Array} destinatarioFinalTablaDatos - Lista de datos para el destinatario final.
 * @property {Array} facturadorTablaDatos - Lista de datos para el facturador.
 * @property {Array} proveedorTablaDatos - Lista de datos para el proveedor.
 * @property {Array} fabricanteTablaDatos - Lista de datos para el fabricante.
 * @property {Object} datosSolicitudFormState - Estado inicial del formulario de solicitud.
 * @property {string} datosSolicitudFormState.rfcSanitario - RFC del sanitario.
 * @property {string} datosSolicitudFormState.denominacionRazon - Denominación o razón social.
 * @property {string} datosSolicitudFormState.correoElectronico - Correo electrónico del solicitante.
 * @property {string} datosSolicitudFormState.codigoPostal - Código postal del domicilio.
 * @property {string} datosSolicitudFormState.estado - Estado del domicilio.
 * @property {string} datosSolicitudFormState.municipioAlcaldia - Municipio o alcaldía del domicilio.
 * @property {string} datosSolicitudFormState.localidad - Localidad del domicilio.
 * @property {string} datosSolicitudFormState.colonia - Colonia del domicilio.
 * @property {string} datosSolicitudFormState.calle - Calle del domicilio.
 * @property {string} datosSolicitudFormState.lada - Lada telefónica.
 * @property {string} datosSolicitudFormState.telefono - Número de teléfono.
 * @property {string} datosSolicitudFormState.aviso - Aviso relacionado con la solicitud.
 * @property {string} datosSolicitudFormState.licenciaSanitaria - Licencia sanitaria del solicitante.
 * @property {string} datosSolicitudFormState.regimen - Régimen del solicitante.
 * @property {string} datosSolicitudFormState.adunasDeEntradas - Aduanas de entrada.
 * @property {boolean} datosSolicitudFormState.aeropuerto - Indica si aplica aeropuerto.
 * @property {string} datosSolicitudFormState.publico - Indica si es público (por defecto "si").
 * @property {string} datosSolicitudFormState.representanteRfc - RFC del representante.
 * @property {string} datosSolicitudFormState.representanteNombre - Nombre del representante.
 * @property {string} datosSolicitudFormState.apellidoPaterno - Apellido paterno del representante.
 * @property {string} datosSolicitudFormState.apellidoMaterno - Apellido materno del representante.
 * @property {Object} mercanciaForm - Estado inicial del formulario de mercancías.
 * @property {string} mercanciaForm.clasificacionProducto - Clasificación del producto.
 * @property {string} mercanciaForm.especificarClasificacionProducto - Especificación de la clasificación del producto.
 * @property {string} mercanciaForm.denominacionEspecificaProducto - Denominación específica del producto.
 * @property {string} mercanciaForm.denominacionDistintiva - Denominación distintiva del producto.
 * @property {string} mercanciaForm.denominacionComun - Denominación común del producto.
 * @property {string} mercanciaForm.tipoProducto - Tipo de producto.
 * @property {string} mercanciaForm.formaFarmaceutica - Forma farmacéutica del producto.
 * @property {string} mercanciaForm.estadoFisico - Estado físico del producto.
 * @property {string} mercanciaForm.fraccionArancelaria - Fracción arancelaria del producto.
 * @property {string} mercanciaForm.descripcionFraccion - Descripción de la fracción arancelaria.
 * @property {string} mercanciaForm.cantidadUmtValor - Valor de la cantidad en UMT.
 * @property {string} mercanciaForm.cantidadUmt - Cantidad en UMT.
 * @property {string} mercanciaForm.cantidadUmcValor - Valor de la cantidad en UMC.
 * @property {string} mercanciaForm.cantidadUmc - Cantidad en UMC.
 * @property {string} mercanciaForm.presentacion - Presentación del producto.
 * @property {string} mercanciaForm.numeroRegistroSanitario - Número de registro sanitario.
 * @property {string} mercanciaForm.fechaCaducidad - Fecha de caducidad del producto.
 * @property {Array} mercanciaForm.paisDeOriginDatos - Lista de países de origen.
 * @property {Array} mercanciaForm.paisDeProcedenciaDatos - Lista de países de procedencia.
 * @property {Array} opcionConfigDatos - Configuración de opciones de tabla.
 * @property {Array} scianConfigDatos - Configuración de datos SCIAN.
 * @property {Array} tablaMercanciasConfigDatos - Configuración de datos de tabla de mercancías.
 * @property {Array} seleccionadoopcionDatos - Opciones seleccionadas.
 * @property {Array} seleccionadoScianDatos - Datos SCIAN seleccionados.
 * @property {Array} seleccionadoTablaMercanciasDatos - Datos de tabla de mercancías seleccionados.
 * @property {boolean} opcionesColapsableState - Estado de colapsabilidad de las opciones.
 * @property {Object} pagoDerechos - Información sobre el pago de derechos.
 * @property {string} pagoDerechos.claveReferencia - Clave de referencia del pago.
 * @property {string} pagoDerechos.cadenaDependencia - Cadena de dependencia del pago.
 * @property {string} pagoDerechos.estado - Estado del pago.
 * @property {string} pagoDerechos.llavePago - Llave del pago.
 * @property {string} pagoDerechos.fechaPago - Fecha del pago.
 * @property {string} pagoDerechos.importePago - Importe del pago.
 */
export function createInitialState(): Tramite260212State {
  return {
    idSolicitud:0,
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
      manifesto: false,
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
    scianConfigDatos: [],
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
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260212', resettable: true })
export class Tramite260212Store extends Store<Tramite260212State> {

  /**
   * Constructor de la clase `Tramite260212Store`.
   * 
   * Este constructor inicializa el estado inicial del store utilizando la función `createInitialState`.
   * La clase base se invoca con el estado inicial generado, lo que permite configurar el store
   * con los valores predeterminados necesarios para su funcionamiento.
   * 
   * @remarks
   * Este constructor es esencial para establecer el estado inicial del store y garantizar
   * que los datos estén listos para ser utilizados en la aplicación.
   */
  constructor() {
    super(createInitialState());
  }

      /**
   * @método
   * @nombre establecerDatos
   * @descripción
   * Actualiza el estado con los valores proporcionados.
   *
   * @param {Partial<Tramite260210State>} values - Valores parciales para actualizar el estado.
   */
  public establecerDatos(values: Partial<Tramite260212State>): void {
    this.update((state) => ({
      ...state,
      ...values,
    }));
  }
  /**
   * Actualiza el estado del formulario de datos de solicitud en el store.
   *
   * @param datosSolicitudFormState - El nuevo estado del formulario de datos de solicitud 
   * que se debe establecer en el store. Este objeto contiene la información actualizada 
   * del formulario de solicitud.
   *
   * @remarks
   * Este método utiliza la función `update` para modificar el estado global del store, 
   * asegurándose de que el estado del formulario de datos de solicitud se actualice 
   * correctamente. Es útil para reflejar cambios en el formulario de solicitud dentro 
   * del estado de la aplicación.
   *
   * @example
   * ```typescript
   * const nuevoEstadoFormulario: DatosSolicitudFormState = {
   *   campo1: 'valor1',
   *   campo2: 'valor2',
   * };
   * tramite260212Store.updateDatosSolicitudFormState(nuevoEstadoFormulario);
   * ```
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
   * Actualiza el estado del formulario de mercancías en el store.
   *
   * @param mercanciaForm - El nuevo estado del formulario de mercancías que se debe establecer en el store.
   *
   * @remarks
   * Este método utiliza la función `update` para modificar el estado global del store, asegurando que 
   * el estado del formulario de mercancías se actualice correctamente. Es útil para reflejar cambios 
   * en el formulario de mercancías dentro del estado de la aplicación.
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
   * existente de `destinatarioFinalTablaDatos` en el estado. La actualización se
   * realiza de manera inmutable, creando una nueva lista que combina los destinatarios
   * existentes con los nuevos.
   * 
   * @param newDestinatarios - Un arreglo de objetos de tipo `Destinatario` que
   * representan los nuevos destinatarios que se agregarán a la tabla de datos.
   * 
   * @returns void - Este método no devuelve ningún valor, pero actualiza el estado
   * interno de la tienda.
   */
  public updateDestinatarioFinalTablaDatos(
    newDestinatarios: Destinatario[]
  ): void {
    this.update((state) => ({
      ...state,
      destinatarioFinalTablaDatos: [
        ...state.destinatarioFinalTablaDatos,
        ...newDestinatarios,
      ],
    }));
  }


  /**
 * Actualiza el estado global agregando nuevos proveedores a la lista existente.
 *
 * @param newProveedores - Un arreglo de objetos de tipo `Proveedor` que se añadirán a la propiedad `proveedorTablaDatos` del estado.
 * 
 * Este método conserva los proveedores actuales y concatena los nuevos al final de la lista. 
 * Utiliza la función `update` para modificar inmutablemente el estado de la store.
 */
public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
  this.update((state) => ({
    ...state,
    proveedorTablaDatos: [...state.proveedorTablaDatos, ...newProveedores],
  }));
}
/**
 * Agrega nuevos facturadores al estado actual en la propiedad `facturadorTablaDatos`.
 *
 * @param newFacturadores - Un arreglo de objetos de tipo `Facturador` que se unirán a los datos existentes.
 * 
 * Este método utiliza la técnica de inmutabilidad para preservar los datos previos y añadir nuevos elementos sin modificar el array original.
 */
public updateFacturadorTablaDatos(newFacturadores: Facturador[]): void {
  this.update((state) => ({
    ...state,
    facturadorTablaDatos: [...state.facturadorTablaDatos, ...newFacturadores],
  }));
}
/**
 * Reemplaza completamente la propiedad `opcionConfigDatos` del estado por un nuevo conjunto de configuraciones.
 *
 * @param opcionConfigDatos - Un arreglo de objetos `TablaOpcionConfig` que representará las nuevas configuraciones.
 * 
 * Este método sustituye la lista existente sin conservar los datos anteriores.
 */
public updateOpcionConfigDatos(opcionConfigDatos: TablaOpcionConfig[]): void {
  this.update((state) => ({
    ...state,
    opcionConfigDatos,
  }));
}
/**
 * Actualiza la propiedad `scianConfigDatos` del estado con un nuevo conjunto de configuraciones SCIAN.
 *
 * @param scianConfigDatos - Un arreglo de objetos `TablaScianConfig` que define las configuraciones actuales.
 * 
 * Sustituye la lista previa de configuraciones sin mantener una copia de las anteriores.
 */
public updateScianConfigDatos(scianConfigDatos: TablaScianConfig[]): void {
  this.update((state) => ({
    ...state,
    scianConfigDatos,
  }));
}
/**
 * Reemplaza el conjunto de datos relacionados con las mercancías dentro del estado.
 *
 * @param tablaMercanciasConfigDatos - Un arreglo de objetos `TablaMercanciasDatos` que se asigna directamente al estado.
 * 
 * Este método sobrescribe por completo los datos previos con la nueva información proporcionada.
 */
public updateTablaMercanciasConfigDatos(tablaMercanciasConfigDatos: TablaMercanciasDatos[]): void {
  this.update((state) => ({
    ...state,
    tablaMercanciasConfigDatos,
  }));
}
/**
 * Establece un nuevo objeto de estado para el formulario de pago de derechos.
 *
 * @param nuevoPagoDerechos - Un objeto `PagoDerechosFormState` que contiene la información completa del formulario actualizado.
 * 
 * Este método sobrescribe por completo el estado anterior de `pagoDerechos` sin fusionar campos.
 */
public updatePagoDerechos(nuevoPagoDerechos: PagoDerechosFormState): void {
  this.update((state) => ({
    ...state,
    pagoDerechos: nuevoPagoDerechos,
  }));
}

 /**
   * Actualiza el estado con el nuevo valor de `idSolicitud`.
   */
  setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

}
