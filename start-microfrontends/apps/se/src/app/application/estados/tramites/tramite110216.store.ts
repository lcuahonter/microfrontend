import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@ng-mf/data-access-user';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../shared/models/modificacion.enum';

import {
  DisponiblesTabla,
  GrupoDeDirecciones,
  GrupoDeDomicilio,
  GrupoDeTransporte,
  GrupoOperador,
  GrupoReceptor,
  GrupoRepresentativo,
  GrupoTratado,
  HistoricoColumnas,
  MercanciaTabla,
  SeleccionadasTabla,
} from '../../tramites/110216/models/certificado-origen.model';

/**
 * Interfaz que representa la estructura del estado de un trámite 110216.
 * Este estado contiene formularios, catálogos, listas, valores seleccionados y otros datos requeridos.
 */
export interface Tramite110216State {
  observaciones?: string;
  idioma?: string;
  entidadFederativa?: string;
  representacionFederal?: string;
  formDatosProductor?: { [key: string]: string | number | boolean | null };
  formHistorico: { [key: string]: boolean | undefined };
  grupoDeTransporte: GrupoDeTransporte;
  grupoReceptor: GrupoReceptor;
  grupoRepresentativo: {
    nombreRepresentante?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    numeroFiscal?: string;
    razonSocial?: string;
    pais?: string;
    entidadFederativa?: string;
    domicilio?: string;
    telefono?: string;
    email?: string;
    datosConfidenciales?: boolean;
    productorMismoExportador?: boolean;
  } & GrupoRepresentativo;
  grupoDeDirecciones: {
    ciudad: string;
    numeroLetra: string | number;
    lada: string | number;
    telefono: string | number;
    fax: string | number | null;
    correoElectronico: string;
    calle?: string;
    numeroExterior?: string;
    numeroInterior?: string;
    colonia?: string;
    localidad?: string;
    municipio?: string;
    estado?: string;
    pais?: string;
    cp?: string;
  };
  pestanaActiva?: number;
  idSolicitud?: number | null;
  idiomaDatos?: Catalogo[];
  idiomaDatosSeleccion?: Catalogo | null;
  representacionFederalSeleccion?: Catalogo | null;
  entidadFederativaDatos?: Catalogo[];
  representacionFederalDatos?: Catalogo[];
  altaPlanta?: Catalogo[];
  estado?: Catalogo | null;
  factura?: Catalogo[];
  facturas?: Catalogo | null;
  umc?: Catalogo | null;
  umcs?: Catalogo[];
  paisBloques?: Catalogo[];
  paisBloque?: Catalogo | null;
  formCertificado: { [key: string]: undefined | boolean | string | number | object } | null;
  formDatosCertificado: { [key: string]: unknown };
  mercanciaForm?: { [key: string]: undefined | boolean | string | number | object };
  buscarMercancia?: Mercancia[];
  formaValida?: { [key: string]: boolean };
  mercanciaTabla: Mercancia[];
  /**
   * @description
   * Lista de mercancías disponibles para seleccionar o procesar dentro del formulario.
   */
  disponiblesDatos?: Mercancia[];
  
    nombre?: string;
    apellidoPrimer?: string;
    apellidoSegundo?: string;
    numeroFiscal?: string;
    razonSocial?: string;

  /**
   * @property {Object} formulario - Otros datos de formularios auxiliares.
   * @description
   * Contiene otros datos relevantes para el trámite, como datos confidenciales del productor y si el productor es el mismo exportador.
   */
  formulario?: { [key: string]: unknown };

  /**
   * @property {Object} datosProductorFormulario - Datos adicionales del productor.
   * @description
   * Contiene campos adicionales para el formulario del productor, como número de registro fiscal y fax.
   */
  datosProductorFormulario?: { [key: string]: unknown };

  /**
 * Objeto que indica la validez de los diferentes formularios del trámite.
 * Cada propiedad representa un formulario y su valor indica si es válido.
 */
  formValidity?: {
    datosCertificado?: boolean;
    destinatario?: boolean;
    histProductores?: boolean;
    certificadoOrigen?: boolean;
  };

  /** Lista de productores exportador agregados al estado del trámite. */
  agregarProductoresExportador: HistoricoColumnas[];

  /**
   * @property {HistoricoColumnas[]} productoresExportador
   * @description Lista de productores asociados al exportador.
   */
  productoresExportador: HistoricoColumnas[];

  /** Lista de mercancías asociadas a los productores en el estado del trámite. */
  mercanciaProductores: MercanciaTabla[];

  continuarTriggered?: boolean;
}

/**
 * Estado inicial que se utiliza para crear el store con valores por defecto.
 */
export const INITIAL_STATE: Tramite110216State = {
  observaciones: '',
  idioma: '',
  entidadFederativa: '',
  representacionFederal: '',
  idSolicitud: 0,
  idiomaDatos: [],
  idiomaDatosSeleccion: { id: -1, descripcion: '' },
  representacionFederalSeleccion: { id: -1, descripcion: '' },
  entidadFederativaDatos: [],
  representacionFederalDatos: [],
  altaPlanta: [],
  estado: { id: -1, descripcion: '' },
  factura: [],
  facturas: { id: -1, descripcion: '' },
  umc: { id: -1, descripcion: '' },
  umcs: [],
  paisBloques: [],
  paisBloque: { id: -1, descripcion: '' },
  formCertificado: {
    entidadFederativa: '',
    tercerOperador: false,
    bloque: '',
    nombreComercialForm: '',
    registroProductoForm: '',
    fraccionArancelariaForm: '',
    fechaInicioInput: '',
    fechaFinalInput: '',
  },
  formDatosCertificado: {
    observacionesDates: '',
    idiomaDates: '',
    precisaDates: '',
    EntidadFederativaDates: '',
    representacionFederalDates: '',
  },
  mercanciaForm: {
    fraccionNaladi: '',
    fraccionNaladiSa93: '',
    fraccionNaladiSa96: '',
    fraccionNaladiSa02: '',
    nombreTecnico: '',
    nombreComercial: '',
    normaOrigen: '',
    id: '',
    cantidad: '',
    umc: '',
    tipoFactura: '',
    valorMercancia: '',
    fechaFinalInput: '',
    numeroFactura: '',
    nalad: '',
    complementoClasificacion: '',
  },
  buscarMercancia: [],
  formaValida: {},
  mercanciaTabla: [],
  disponiblesDatos: [],
  pestanaActiva: 0,
  grupoReceptor: {
    nombre: '',
    apellidoPrimer: '',
    apellidoSegundo: '',
    numeroFiscal: '',
    razonSocial: '',
  },
  grupoDeDirecciones: {} as GrupoDeDirecciones,

  grupoRepresentativo: {} as GrupoRepresentativo,
  formDatosProductor: {},
  formHistorico: {
    datosConfidencialesProductor: false,
    productorMismoExportador: false,
  },
  grupoDeTransporte: {} as GrupoDeTransporte,

  nombre: '',
  apellidoPrimer: '',
  apellidoSegundo: '',
  numeroFiscal: '',
  razonSocial: '',

  formulario:{
    datosConfidencialesProductor: '',
    productorMismoExportador: '',
  },
  datosProductorFormulario: {
    numeroRegistroFiscal: '',
    fax: '',      
  },
  formValidity: {
    datosCertificado: false,
    destinatario: false,
    histProductores: false,
    certificadoOrigen: false,
  },
  agregarProductoresExportador: [],
  productoresExportador: [],
  mercanciaProductores: [],
  continuarTriggered: false,
};

/**
 * @class Tramite110216Store
 * @description
 * Store que administra el estado global del trámite 110216 utilizando Akita.
 * Este store encapsula todos los datos y formularios necesarios para la gestión
 * de un trámite, tales como catálogos, formularios, validaciones y mercancías.
 *
 * Cada método `set` permite actualizar secciones específicas del estado de forma inmutable.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite-110216', resettable: true })
export class Tramite110216Store extends Store<Tramite110216State> {
  constructor() {
    super(INITIAL_STATE);
  }

 /**
 * Establece el estado del botón continuar para activar o desactivar las validaciones del formulario.
 * @param continuarTriggered Indica si el botón continuar ha sido activado.
 */
  public setContinuarTriggered(continuarTriggered: boolean): void {
    this.update((state) => ({ ...state, continuarTriggered }));
  }

  public setFormHistorico(values: { [key: string]: boolean | undefined }): void {
    this.update((state) => ({ ...state, formHistorico: { ...state.formHistorico, ...values } }));
  }

  public setAgregarFormDatosProductor(values: { [key: string]: string | number | boolean | null }): void {
    this.update((state) => ({ ...state, formDatosProductor: { ...state.formDatosProductor, ...values } }));
  }

  public setObservaciones(observaciones: string): void {
    this.update((state) => ({ ...state, observaciones }));
  }

  public setIdioma(idioma: string): void {
    this.update((state) => ({ ...state, idioma }));
  }

  public setPasoActivo(pasoActivo: number): void {
    this.update((state) => ({ ...state, pasoActivo }));
  }

  public setRepresentacionFederal(representacionFederal: string): void {
    this.update((state) => ({ ...state, representacionFederal }));
  }

  /**
     * @method setGrupoReceptor
     * @description Actualiza la información del receptor en el estado del trámite.
     *
     * Este método permite establecer los datos del receptor en el grupo receptor del estado.
     *
     * @param {GrupoReceptor} grupoReceptor - Objeto que contiene la información del receptor a actualizar.
     *
     * @returns {void}
     */
    public setGrupoReceptor(grupoReceptor: GrupoReceptor): void {
      this.update((state) => ({
        ...state,
        grupoReceptor,
      }));
    }

  public setGrupoDeDirecciones(grupoDeDirecciones: GrupoDeDirecciones): void {
    this.update((state) => ({ ...state, grupoDeDirecciones }));
  }

  public setGrupoRepresentativo(grupoRepresentativo: GrupoRepresentativo): void {
    this.update((state) => ({ ...state, grupoRepresentativo }));
  }

  public setGrupoDeTransporte(grupoDeTransporte: GrupoDeTransporte): void {
    this.update((state) => ({ ...state, grupoDeTransporte }));
  }

  public setTercerOperador(tercerOperador: boolean): void {
    this.update((state) => ({ ...state, tercerOperador }));
  }

  public setGrupoOperador(grupoOperador: GrupoOperador): void {
    this.update((state) => ({ ...state, grupoOperador }));
  }

  public setGrupoTratado(grupoTratado: GrupoTratado): void {
    this.update((state) => ({ ...state, grupoTratado }));
  }

  public setGrupoDeDomicilio(grupoDeDomicilio: GrupoDeDomicilio): void {
    this.update((state) => ({ ...state, grupoDeDomicilio }));
  }

  public setMercanciaTablaDatos(mercanciaSeleccionadasTablaDatos: SeleccionadasTabla[]): void {
    this.update((state) => ({ ...state, mercanciaSeleccionadasTablaDatos }));
  }

  public setMercanciaDisponsiblesTablaDatos(mercanciaDisponsiblesTablaDatos: DisponiblesTabla[]): void {
    this.update((state) => ({ ...state, mercanciaDisponsiblesTablaDatos }));
  }

  public setDatosConfidencialesProductor(datosConfidencialesProductor: boolean): void {
    this.update((state) => ({ ...state, datosConfidencialesProductor }));
  }

  public setProductorMismoExportador(productorMismoExportador: boolean): void {
    this.update((state) => ({ ...state, productorMismoExportador }));
  }

  public setProductoresExportador(productoresExportador: HistoricoColumnas[]): void {
    this.update((state) => ({ ...state, productoresExportador }));
  }

  public setPestanaActiva(pestanaActiva: number): void {
    this.update((state) => ({ ...state, pestanaActiva }));
  }

  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({ ...state, idSolicitud }));
  }

  public setEstado(estado: Catalogo): void {
    this.update((state) => ({ ...state, estado }));
  }

  public setFactura(factura: Catalogo[]): void {
    this.update((state) => ({ ...state, factura }));
  }

  public setUmc(umcs: Catalogo[]): void {
    this.update((state) => ({ ...state, umcs }));
  }

  public setBloque(paisBloques: Catalogo[]): void {
    this.update((state) => ({ ...state, paisBloques }));
  }

  /**
 * Actualiza el país bloque seleccionado en el estado del trámite.
 * @param paisBloque Objeto de tipo Catalogo que representa el país bloque a asignar.
 */
  public setBloqu(paisBloque: Catalogo): void {
    this.update((state) => ({ ...state, paisBloque }));
  }

  public setAltaPlanta(altaPlanta: Catalogo[]): void {
    this.update((state) => ({ ...state, altaPlanta }));
  }

  public setFormValida(formaValida: { [key: string]: boolean }): void {
    const IS_VALID = { ...this.getValue().formaValida, ...formaValida };
    this.update({ formaValida: IS_VALID });
  }

  public setEntidadFederativa(entidadFederativa: string): void {
    this.update((state) => ({ ...state, entidadFederativa }));
  }

  public setFormDatosCertificado(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formDatosCertificado: {
        ...state.formDatosCertificado,
        ...values,
      },
    }));
  }

  public setFormCertificado(values: { [key: string]: undefined | boolean | string | number | object }): void {
    this.update((state) => ({
      formCertificado: {
        ...state.formCertificado,
        ...values,
      },
    }));
  }

  /**
 * Actualiza el estado de validez de un formulario específico dentro del trámite.
 * @param formName Nombre del formulario a actualizar.
 * @param isValid Indica si el formulario es válido o no.
 */
  setFormValidity(formName: string, isValid: boolean): void {
    this.update((state) => ({
      ...state,
      formValidity: {
        ...state.formValidity,
        [formName]: isValid,
      },
    }));
  }

  public setFormMercancia(values: { [key: string]: undefined | boolean | string | number | object }): void {
    this.update((state) => ({
      mercanciaForm: {
        ...state.mercanciaForm,
        ...values,
      },
    }));
  }

  public setBuscarMercancia(buscarMercancia: Mercancia[]): void {
    this.update((state) => ({ ...state, buscarMercancia }));
  }

  public setMercanciaTabla(mercanciaTabla: Mercancia[]): void {
    this.update((state) => {
      const LISTAEXISTENTE = state.mercanciaTabla || [];
      const NUEVOARTICULO = { ...mercanciaTabla[0] };

      if (NUEVOARTICULO.id === 0) {
        NUEVOARTICULO.id = (LISTAEXISTENTE.length || 0) + 1;
        const UPDATEDLIST = [...LISTAEXISTENTE, NUEVOARTICULO];
        return { ...state, mercanciaTabla: UPDATEDLIST };
      }

      const UPDATEDLIST = mercanciaTabla.map((ITEM) =>
        ITEM.id === NUEVOARTICULO.id ? { ...ITEM, ...NUEVOARTICULO } : ITEM
      );
      return { ...state, mercanciaTabla: UPDATEDLIST };
    });
  }

  /**
   * Actualiza el nombre del grupo receptor.
   *
   * @param {string} nombre - Nombre del grupo receptor.
   */
  public setGrupoReceptorNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, nombre },
    }));
  }

  /**
   * Actualiza el primer apellido del grupo receptor.
   *
   * @param {string} apellidoPrimer - Primer apellido del grupo receptor.
   */
  public setGrupoReceptorApellidoPrimer(apellidoPrimer: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, apellidoPrimer },
    }));
  }

  /**
   * Actualiza el segundo apellido del grupo receptor.
   *
   * @param {string} apellidoSegundo - Segundo apellido del grupo receptor.
   */
  public setGrupoReceptorApellidoSegundo(apellidoSegundo: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, apellidoSegundo },
    }));
  }

  /**
   * Actualiza el número fiscal del grupo receptor.
   *
   * @param {string} numeroFiscal - Número fiscal del grupo receptor.
   */
  public setGrupoReceptorNumeroFiscal(numeroFiscal: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, numeroFiscal },
    }));
  }

  /**
   * Actualiza la razón social del grupo receptor.
   *
   * @param {string} razonSocial - Razón social del grupo receptor.
   */
  public setGrupoReceptorRazonSocial(razonSocial: string): void {
    this.update((state) => ({
      ...state,
      grupoReceptor: { ...state.grupoReceptor, razonSocial },
    }));
  }

public setGrupoDeDireccionesCiudad(ciudad: string): void {
  this.update((state) => ({
    ...state,
    grupoDeDirecciones: { ...state.grupoDeDirecciones, ciudad },
  }));
}

public setGrupoDeDireccionesCalle(calle: string): void {
  this.update((state) => ({
    ...state,
    grupoDeDirecciones: { ...state.grupoDeDirecciones, calle },
  }));
}

public setGrupoDeDireccionesNumeroLetra(numeroLetra: string): void {
  this.update((state) => ({
    ...state,
    grupoDeDirecciones: { ...state.grupoDeDirecciones, numeroLetra },
  }));
}

public setGrupoDeDireccionesLada(lada: string): void {
  this.update((state) => ({
    ...state,
    grupoDeDirecciones: { ...state.grupoDeDirecciones, lada },
  }));
}

public setGrupoDeDireccionesTelefono(telefono: string): void {
  this.update((state) => ({
    ...state,
    grupoDeDirecciones: { ...state.grupoDeDirecciones, telefono },
  }));
}

public setGrupoDeDireccionesFax(fax: string): void {
  this.update((state) => ({
    ...state,
    grupoDeDirecciones: { ...state.grupoDeDirecciones, fax },
  }));
}

public setGrupoDeDireccionesCorreoElectronico(correoElectronico: string): void {
  this.update((state) => ({
    ...state,
    grupoDeDirecciones: { ...state.grupoDeDirecciones, correoElectronico },
  }));
}
  public setIdiomaDatos(idiomaDatos: Catalogo[]): void {
    this.update((state) => ({ ...state, idiomaDatos }));
  }

  public setIdiomaSeleccion(idiomaDatosSeleccion: Catalogo): void {
    this.update((state) => ({ ...state, idiomaDatosSeleccion }));
  }

  public setRepresentacionFederalDatos(representacionFederalDatos: Catalogo[]): void {
    this.update((state) => ({ ...state, representacionFederalDatos }));
  }

  public setEntidadFederativaDatos(entidadFederativaDatos: Catalogo[]): void {
    this.update((state) => ({ ...state, entidadFederativaDatos }));
  }
  public setNombre(nombre: string): void {
    this.update((state) => ({ ...state, nombre }));
  }
  public setApellidoPrimer(apellidoPrimer: string): void {
    this.update((state) => ({ ...state, apellidoPrimer }));
  }
  public setApellidoSegundo(apellidoSegundo: string): void {
    this.update((state) => ({ ...state, apellidoSegundo }));
  }
  public setNumeroFiscal(numeroFiscal: string): void {
    this.update((state) => ({ ...state, numeroFiscal }));
  }
  public setRazonSocial(razonSocial: string): void {
    this.update((state) => ({ ...state, razonSocial }));
  }
  public setGrupoRepresentativoTelefono(telefono: string): void {
  this.update((state) => ({
    ...state,
    grupoRepresentativo: { ...state.grupoRepresentativo, telefono },
  }));
}
public setGrupoRepresentativoLugar(lugar: string): void {
  this.update((state) => ({
    ...state,
    grupoRepresentativo: { ...state.grupoRepresentativo, lugar },
  }));
}

public setGrupoRepresentativoNombreExportador(nombreExportador: string): void {
  this.update((state) => ({
    ...state,
    grupoRepresentativo: { ...state.grupoRepresentativo, nombreExportador },
  }));
}

public setGrupoRepresentativoEmpresa(empresa: string): void {
  this.update((state) => ({
    ...state,
    grupoRepresentativo: { ...state.grupoRepresentativo, empresa },
  }));
}

public setGrupoRepresentativoCargo(cargo: string): void {
  this.update((state) => ({
    ...state,
    grupoRepresentativo: { ...state.grupoRepresentativo, cargo },
  }));
}

public setGrupoRepresentativoLada(lada: string): void {
  this.update((state) => ({
    ...state,
    grupoRepresentativo: { ...state.grupoRepresentativo, lada },
  }));
}
public setGrupoRepresentativoFax(fax: string): void {
  this.update((state) => ({
    ...state,
    grupoRepresentativo: { ...state.grupoRepresentativo, fax },
  }));
}

public setGrupoRepresentativoCorreoElectronico(correoElectronico: string): void {
  this.update((state) => ({
    ...state,
    grupoRepresentativo: { ...state.grupoRepresentativo, correoElectronico },
  }));
}
// Correctly defined methods in Tramite110216Store
public setGrupoDeTransportePuertoEmbarque(puertoEmbarque: string): void {
  this.update((state) => ({
    ...state,
    grupoDeTransporte: { ...state.grupoDeTransporte, puertoEmbarque },
  }));
}

public setGrupoDeTransportePuertoDesembarque(puertoDesembarque: string): void {
  this.update((state) => ({
    ...state,
    grupoDeTransporte: { ...state.grupoDeTransporte, puertoDesembarque },
  }));
}

public setGrupoDeTransportePuertoTransito(puertoTransito: string): void {
  this.update((state) => ({
    ...state,
    grupoDeTransporte: { ...state.grupoDeTransporte, puertoTransito },
  }));
}

public setGrupoDeTransporteNombreEmbarcacion(nombreEmbarcacion: string): void {
  this.update((state) => ({
    ...state,
    grupoDeTransporte: { ...state.grupoDeTransporte, nombreEmbarcacion },
  }));
}

public setGrupoDeTransporteNumeroVuelo(numeroVuelo: string): void {
  this.update((state) => ({
    ...state,
    grupoDeTransporte: { ...state.grupoDeTransporte, numeroVuelo },
  }));
}

/**
   * Establece los representacionFederalSeleccion de países en el almacén.
   *
   * @param {Catalogo} representacionFederalSeleccion - Un array de objetos `Catalogo` que representa los representacionFederalSeleccion de países.
   *
   * @returns {void} - No devuelve ningún valor.
   */
  setRepresentacionFederalDatosSeleccion(
    representacionFederalSeleccion: Catalogo
  ): void {
    this.update((state) => ({
      ...state,
      representacionFederalSeleccion,
    }));
  }

  /**
 * Actualiza completamente la lista de productores exportador agregados, reemplazando los valores existentes.
 * @param agregarProductoresExportador Arreglo completo de productores exportador que reemplazará la lista actual.
 */
  updateAgregarProductoresExportador(agregarProductoresExportador: HistoricoColumnas[]): void {
    this.update((state) => ({
      ...state,
      agregarProductoresExportador,
    }));
  }

  /**
 * Agrega productores exportador únicos al arreglo existente, evitando duplicados basados en el ID.
 * Solo se agregan los elementos que no existen previamente en la lista.
 * @param productor Arreglo de productores exportador a agregar al estado.
 */
  setAgregarProductoresExportador(productor: HistoricoColumnas[]): void {
    this.update((state) => {
      const EXISTING = state.agregarProductoresExportador || [];
      const UNIQUE_NEW_ITEMS = productor.filter(
        (nuevo) => !EXISTING.some((existente) => existente.id === nuevo.id)
      );
      return {
        ...state,
        agregarProductoresExportador: [
          ...EXISTING,
          ...UNIQUE_NEW_ITEMS.map(item => ({ ...item })),
        ],
      };
    });
  }


  /**
   * Actualiza la lista de mercancías asociadas a los productores en el estado del trámite.
   * @param mercancia Arreglo de objetos de tipo MercanciaTabla a asignar.
   */
  setMercanciaProductores(mercancia: MercanciaTabla[]): void {
    this.update((state) => ({
      ...state,
      mercanciaProductores: mercancia,
    }));
  }

  /**
   * @method setDatosConfidencialesProductor
   * @description
   * Actualiza el estado de datos confidenciales del productor en el almacén.
   * @param datosConfidencialesProductor Valor booleano que indica si los datos del productor son confidenciales.
   * */
  setDisponsiblesDatos(disponiblesDatos: Mercancia[]): void {
    this.update((state) => ({
      ...state,
      disponiblesDatos,
    }));
  }
}



