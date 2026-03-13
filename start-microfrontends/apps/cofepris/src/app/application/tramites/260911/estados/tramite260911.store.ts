import { Destinatario, Fabricante, Facturador, PagoDerechosFormState, Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@libs/shared/data-access-user/src';

import { Injectable } from '@angular/core';
import { TablaScianConfig } from '../../../shared/models/datos-solicitud.model';

import { DatosSolicitudFormState } from '../../../shared/components/shared26010/models/datos-solicitud.model';



/**
 * Interfaz que define el estado inicial del trámite 260911.
 */
export interface Tramite260911State {
  idSolicitud: number;
  /** Botón de radio seleccionado */
  btonDeRadio: string;
  /** Texto de justificación */
  justificacion: string;
  /** RFC del delegado */
  rfcDel: string;
  /** Denominación de la entidad */
  denominacion: string;
  /** Dirección de correo electrónico */
  correo: string;
  /** Código postal */
  codigoPostal: string;
  /** Catálogo del estado */
  estado: Catalogo | null;
  /** Municipio o alcaldía */
  municipioOAlcaldia: string;
  /** Localidad */
  localidad: string;
  /** Colonias */
  colonias: string;
  /** Calle */
  calle: string;
  /** Lada telefónica */
  lada: string;
  /** Teléfono */
  telefono: string;
  /** Checkbox de aviso */
  avisoCheckbox: string;
  /** Catálogo de régimen */
  regimen: Catalogo | null;
  /** Catálogo de aduanas de entrada */
  aduanasEntradas: Catalogo | null;
  /** Checkbox de AIFA */
  aifaCheckbox: string;
  /** Manifiestos */
  manifests: string;
  /** Acuerdo público */
  acuerdoPublico: string;
  /** RFC */
  rfc: string;
  /** Clave de referencia del trámite */
  claveDeReferencia: string;
  /** Cadena de pago de la dependencia */
  cadenaPagoDependencia: string;
  /** Clave del trámite */
  clave: string;
  /** Llave de pago */
  llaveDePago: string;
  /** Fecha de pago */
  fecPago: string;
  /** Importe del pago */
  impPago: string;
  /** Licencia sanitaria */
  licenciaSanitaria: string;
  /** Nombre del representante legal */
  nombre: string;
  /** Apellido paterno del representante legal */
  apellidoPaterno: string;
  /** Apellido materno del representante legal */
  apellidoMaterno: string;
  /** Número de permiso de importación CNSNS */
  importPermitNumberCNSNS?: string;
  /** Clave del modal SCian */
  claveScianModal?: string;
  /** Descripción del modal SCian */
  claveDescripcionModal?: string;
  /** Configuración de la tabla SCian */
  scianConfigDatos?: TablaScianConfig[];
  /** Entidad federativa seleccionada */
  entidad: Catalogo | null;
  /** Representación federal seleccionada */
  representacion: Catalogo | null;
  /**
   * Lista de fabricantes en la tabla de datos.
   */
  fabricanteTablaDatos: Fabricante[];
  /**
   * Lista de proveedores en la tabla de datos.
   */
  proveedorTablaDatos: Proveedor[];
   /**
   * Lista de destinatarios finales en la tabla de datos.
   */
  destinatarioFinalTablaDatos: Destinatario[];
 /**
   * Lista de facturadores en la tabla de datos.
   */
  facturadorTablaDatos: Facturador[];
  
   /**
   * Lista de fabricantes relacionados con el trámite.
   */
  fabricanteTablaModificaDatos: Fabricante[];

  /**
 * Almacena el estado del formulario de datos de la solicitud.
 */
  datosSolicitudFormState: DatosSolicitudFormState;

  /**
 * Contiene el estado del formulario de pago de derechos.
 */
  pagoDerechos: PagoDerechosFormState;
  
}

/**
 * Función que crea el estado inicial del trámite 260911.
 * @returns El estado inicial del trámite.
 */
export function createInitialState(): Tramite260911State {
  return {
    idSolicitud: 0,
    btonDeRadio: '',
    justificacion: '',
    rfcDel: '',
    denominacion: '',
    correo: '',
    codigoPostal: '',
    estado: null,
    municipioOAlcaldia: '',
    localidad: '',
    colonias: '',
    calle: '',
    lada: '',
    telefono: '',
    avisoCheckbox: '',
    regimen: null,
    aduanasEntradas: null,
    aifaCheckbox: '',
    manifests: '',
    acuerdoPublico: '',
    rfc: '',
    claveDeReferencia: '',
    cadenaPagoDependencia: '',
    clave: '',
    llaveDePago: '',
    fecPago: '',
    impPago: '',
    licenciaSanitaria: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    importPermitNumberCNSNS: undefined,
    claveScianModal: undefined,
    claveDescripcionModal: undefined,
    scianConfigDatos: [],
    entidad: null,
    representacion: null,
    fabricanteTablaDatos: [],
    proveedorTablaDatos: [],
    destinatarioFinalTablaDatos: [],
    facturadorTablaDatos: [],
    fabricanteTablaModificaDatos: [],

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

/**
 * Servicio que gestiona el estado del trámite 260911.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260911', resettable: true })
export class Tramite260911Store extends Store<Tramite260911State> {
  /**
   * Constructor del servicio de estado.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

   /**
   * Actualiza la tabla de fabricantes.
   * @param {Fabricante[]} newFabricantes - Nuevos fabricantes a agregar
   */
  public updateFabricanteTablaDatos(newFabricantes: Fabricante[]): void {
    this.update((state) => ({
      ...state,
      fabricanteTablaDatos: [...state.fabricanteTablaDatos, ...newFabricantes],
    }));
  }

   /**
   * @method fabricanteTablaModificaDatos
   * @description
   * Actualiza los datos seleccionados en la tabla de fabricantes en el estado del trámite.
   * Sustituye el arreglo actual por el nuevo conjunto de fabricantes.
   *
   * @param {Fabricante[]} tabSeleccionado - Lista de fabricantes seleccionados que se asignarán al estado.
   * @returns {void} Este método no retorna ningún valor.
   */
  public fabricanteTablaModificaDatos(tabSeleccionado: Fabricante[]): void {
    this.update((state) => ({
      ...state,
      fabricanteTablaModificaDatos: tabSeleccionado,
    }));
  }

    /**
   * Actualiza la tabla de proveedores.
   * @param {Proveedor[]} newProveedores - Nuevos proveedores a agregar
   */
  public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaDatos: [...state.proveedorTablaDatos, ...newProveedores],
    }));
  }
  /**
   * Actualiza la tabla de destinatarios finales.
   * @param {Destinatario[]} newDestinatarios - Nuevos destinatarios a agregar
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
   * Actualiza la tabla de facturadores.
   * @param {Facturador[]} newFacturadores - Nuevos facturadores a agregar
   */
  public updateFacturadorTablaDatos(newFacturadores: Facturador[]): void {
    this.update((state) => ({
      ...state,
      facturadorTablaDatos: [...state.facturadorTablaDatos, ...newFacturadores],
    }));
  }


  /**
   * Actualiza el estado del trámite 630303 con los valores proporcionados.
   * 
   * @param valores - Valores parciales para actualizar el estado.
   */
  setTramite260911State(valores: Partial<Tramite260911State>): void {
    this.update((state => ({
      ...state,
      ...valores,
    })));
  }

/**
 * Actualiza el estado del formulario de datos de la solicitud en el store.
 * Reemplaza el valor actual por el nuevo estado recibido.
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
 * Actualiza el estado del formulario de pago de derechos en el store.
 * Reemplaza el valor actual de `pagoDerechos` por el nuevo estado proporcionado.
 */
  public updatePagoDerechos(nuevoPagoDerechos: PagoDerechosFormState): void {
    this.update((state) => ({
      ...state,
      pagoDerechos: nuevoPagoDerechos,
    }));
  }

/**
 * Establece el identificador de la solicitud en el estado del store.
 */
  setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

}