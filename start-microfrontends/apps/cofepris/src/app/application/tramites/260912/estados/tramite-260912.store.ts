import { Destinatario, Fabricante, Facturador, PagoDerechosFormState, Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store, StoreConfig } from '@datorama/akita';
import type { Catalogo } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { TablaScianConfig } from '../../../shared/models/datos-solicitud.model';

import { DatosSolicitudFormState } from '../../../shared/components/shared26010/models/datos-solicitud.model';
import { TablaMercanciasDatos } from '../../../shared/models/datos-solicitud.model';
import { TablaOpcionConfig } from '../../../shared/models/datos-solicitud.model';

/**
 * Interfaz que define el estado completo para el trámite 260912.
 * Contiene todos los campos necesarios para manejar la información
 * del formulario de trámite, incluyendo datos de pago, información
 * personal, direcciones y configuraciones específicas.
 */
export interface Tramites260912State {
  idSolicitud: number;
  /** Clave única de referencia para identificar el trámite */
  claveDeReferencia: string;
  
  /** Cadena de pago específica de la dependencia gubernamental */
  cadenaPagoDependencia: string;
  
  /** Clave general del trámite o proceso */
  clave: string;
  
  /** Llave específica utilizada para el proceso de pago */
  llaveDePago: string;
  
  /** Fecha en que se realizó el pago (formato string) */
  fecPago: string;
  
  /** Importe o monto del pago realizado */
  impPago: string;
  
  /** Valor del botón de radio seleccionado en el formulario */
  btonDeRadio: string;
  
  /** Texto de justificación o motivo del trámite */
  justificacion: string;
  
  /** RFC (Registro Federal de Contribuyentes) del solicitante */
  rfcDel: string;
  
  /** Denominación o razón social de la empresa o persona */
  denominacion: string;
  
  /** Dirección de correo electrónico del solicitante */
  correo: string;
  
  /** Código postal de la dirección del solicitante */
  codigoPostal: string;
  
  /** Objeto catálogo que representa el estado o entidad federativa */
  estado: Catalogo | null;
  
  /** Nombre del municipio o alcaldía donde reside el solicitante */
  municipioOAlcaldia: string;
  
  /** Localidad específica dentro del municipio */
  localidad: string;
  
  /** Nombre de la colonia o barrio */
  colonias: string;
  
  /** Nombre y número de la calle */
  calle: string;
  
  /** Código de área telefónica (LADA) */
  lada: string;
  
  /** Número telefónico de contacto */
  telefono: string;
  
  /** Estado del checkbox de aviso (marcado/desmarcado) */
  avisoCheckbox: string;
  
  /** Objeto catálogo que representa el régimen fiscal o legal */
  regimen: Catalogo | null;
  
  /** Objeto catálogo para las aduanas de entrada seleccionadas */
  aduanasEntradas: Catalogo | null;
  
  /** Estado del checkbox relacionado con AIFA (Aeropuerto Internacional Felipe Ángeles) */
  aifaCheckbox: string;
  
  /** Información o datos de los manifiestos */
  manifests: string;
  
  /** Datos del acuerdo público relacionado con el trámite */
  acuerdoPublico: string;
  
  /** RFC adicional o secundario */
  rfc: string;
  
  /** Número de licencia sanitaria si aplica */
  licenciaSanitaria: string;
  
  /** Nombre(s) de la persona física solicitante */
  nombre: string;
  
  /** Apellido paterno del solicitante */
  apellidoPaterno: string;
  
  /** Apellido materno del solicitante */
  apellidoMaterno: string;

  /** Número de programa IMMEX si aplica */
  immexProgramNumber?: string;
  /** Año del programa IMMEX si aplica */
  ano?: string;
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
   * Estado del formulario de datos de la solicitud.
   */
  datosSolicitudFormState: DatosSolicitudFormState;

  /**
   * Estado del formulario de pago de derechos.
   */
   pagoDerechos: PagoDerechosFormState;

  /**
   * Identificador de la pestaña seleccionada (opcional).
   */
   tabSeleccionado?: number;

  /**
   * Opciones seleccionadas en la tabla de configuración.
   */
   seleccionadoopcionDatos: TablaOpcionConfig[];

  /**
   * Configuración de datos de la tabla de mercancías.
   */
   tablaMercanciasConfigDatos: TablaMercanciasDatos[];
}

/**
 * Función que crea y retorna el estado inicial para el trámite 260912.
 * Inicializa todos los campos con valores por defecto (cadenas vacías o null
 * para objetos complejos como Catalogo).
 * 
 * @returns {Tramites260912State} Objeto con el estado inicial del trámite
 */
export function createInitialState(): Tramites260912State {
  return {
    idSolicitud: 0,
    claveDeReferencia: '',
    cadenaPagoDependencia: '',
    clave: '',
    llaveDePago: '',
    fecPago: '',
    impPago: '',
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
    licenciaSanitaria: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    immexProgramNumber: '',
    ano: '',
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
    tabSeleccionado: 1,
    seleccionadoopcionDatos: [],
    tablaMercanciasConfigDatos: [],
  };
}

/**
 * Store de Akita para manejar el estado del trámite 260912.
 * 
 * Esta clase extiende el Store de Akita y proporciona funcionalidad
 * para manejar el estado global del formulario de trámite 260912.
 * Incluye configuración para hacer el store reiniciable y métodos
 * para actualizar el estado de manera reactiva.
 * 
 * @Injectable Decorador que permite la inyección de dependencias
 * @StoreConfig Configuración del store con nombre único y capacidad de reinicio
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramites260912', resettable: true })
export class Tramite260912Store extends Store<Tramites260912State> {
  
  /**
   * Constructor del store.
   * Inicializa el store padre con el estado inicial creado
   * por la función createInitialState().
   */
  constructor() {
    super(createInitialState());
  }

  
   /**
   * Actualiza la tabla de fabricantes.
   * @param {Fabricante[]} newFabricantes - Nuevos fabricantes a agregar
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
      proveedorTablaDatos: newProveedores,
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
      destinatarioFinalTablaDatos: newDestinatarios,
    }));
  }

   /**
   * Actualiza la tabla de facturadores.
   * @param {Facturador[]} newFacturadores - Nuevos facturadores a agregar
   */
  public updateFacturadorTablaDatos(newFacturadores: Facturador[]): void {
    this.update((state) => ({
      ...state,
      facturadorTablaDatos: newFacturadores,
    }));
  }
  /**
   * Método que actualiza parcialmente el estado del trámite 260912.
   * 
   * Permite actualizar uno o varios campos del estado sin afectar
   * los campos no especificados. Utiliza el patrón de spread operator
   * para mantener la inmutabilidad del estado.
   * 
   * @param {Partial<Tramites260912State>} valores - Objeto con los campos
   *        a actualizar. Puede contener cualquier combinación de propiedades
   *        del estado, no es necesario proporcionar todos los campos.
   * 
   * @example
   * // Actualizar solo el nombre y correo
   * store.setTramite260912State({
   *   nombre: 'Juan',
   *   correo: 'juan@email.com'
   * });
   * 
   * @example
   * // Actualizar información de pago
   * store.setTramite260912State({
   *   fecPago: '2024-01-15',
   *   impPago: '1500.00',
   *   llaveDePago: 'LP123456'
   * });
   */
  setTramite260912State(valores: Partial<Tramites260912State>): void {
    this.update((state => ({
      ...state,
      ...valores,
    })));
  }

  /**
   * @method setIdSolicitud
   * @description Establece el identificador de la solicitud.
   * @param {number} idSolicitud - Nuevo identificador de la solicitud.
   */
  setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * @method updateDatosSolicitudFormState
   * @description Actualiza el estado del formulario de datos de la solicitud.
   * @param {DatosSolicitudFormState} datosSolicitudFormState - Nuevo estado del formulario.
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
   * @method updatePagoDerechos
   * @description Actualiza el estado del formulario de pago de derechos.
   * @param {PagoDerechosFormState} nuevoPagoDerechos - Nuevo estado del formulario.
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
   * @method updateOpcionConfigDatos
   * @description
   * Actualiza la configuración de opciones de la tabla en el estado.
   *
   * @param {TablaOpcionConfig[]} opcionConfigDatos - Nueva configuración de opciones de la tabla.
   */
  public updateOpcionConfigDatos(opcionConfigDatos: TablaOpcionConfig[]): void {
      this.update((state) => ({
        ...state,
        opcionConfigDatos,
      }));
    }

  /**
   * @method updateScianConfigDatos
   * @description Actualiza la opción seleccionada en el estado.
   * @param {TablaScianConfig[]} scianConfigDatos - Nueva opción seleccionada.
   */
  public updateScianConfigDatos(scianConfigDatos: TablaScianConfig[]): void {
    this.update((state) => ({
      ...state,
      scianConfigDatos,
    }));
  }

  /**
   * @method updateTablaMercanciasConfigDatos
   * @description Actualiza la opción seleccionada en el estado.
   * @param {TablaMercanciasDatos[]} tablaMercanciasConfigDatos - Nueva opción seleccionada.
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
}