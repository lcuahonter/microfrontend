import {
  ConfiguracionCertificados,
  CupoDetalle,
  GrupoCupo,
  GrupoDatalleCupo,
  GrupoEmpresa,
  GrupoFolio,
  ProductoDetalle,
} from '../../models/detalle';
import { Store, StoreConfig } from '@datorama/akita';
import { Cupo } from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model';
import { Injectable } from '@angular/core';
/**
 * Creacion del estado inicial para la interfaz de tramite 90201
 * @returns Solicitud90201
 */
export interface Solicitud140205State {
  idSolicitud: number;
  grupoEmpresa: GrupoEmpresa;
  grupoCupo: GrupoCupo;
  grupoDatalleCupo: GrupoDatalleCupo;
  grupoFolio: GrupoFolio;
  regimen: string;
  mecanismo: string;
  tratado: string;
  producto: string;
  subproducto: string;
  representacion: string;
  cantidad: string;
  cancelacion: Cupo[];
  certificados: ConfiguracionCertificados[];
  cupo: CupoDetalle[];
  productoDetalle: ProductoDetalle[];
  idSolicitudState: number;
}

/** Crea y devuelve el estado inicial vacío para el formulario de Solicitud 140205. */
export function createInitialState(): Solicitud140205State {
  return {
    idSolicitud: 0,
    grupoEmpresa: {
      rfc: '',
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      actividadEconomica: '',
      datosRfc: '',
      clave: '',
      correo: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      codigoPostal: '',
      colonia: '',
      pais: '',
      estado: '',
      localidad: '',
      telefono: '',
      municipio: '',
    },
    grupoCupo: {
      aduanero: '',
      mecanismo: '',
      tratado: '',
      nombreProducto: '',
      nombreSubproducto: '',
      federal: '',
    },
    grupoDatalleCupo: {
      aduanero: '',
      clasificacionSubproducto: '',
      descripcionProducto: '',
      unidad: '',
      mecanismo: '',
      tratado: '',
      arancelarias: '',
      paises: '',
      observaciones: '',
      fundamentos: '',
      inicio: '',
      fin: '',
    },
    grupoFolio: {
      montoAsignado: '',
      montoDisponible: '',
      montoExpedido: '',
    },
    regimen: '',
    mecanismo: '',
    tratado: '',
    producto: '',
    subproducto: '',
    representacion: '',
    cantidad: '',
    cancelacion: [],
    certificados: [],
    cupo: [],
    productoDetalle: [],
    idSolicitudState: 0,
  };
}

/** Store que gestiona el estado reactivo para el trámite 140205 usando Akita. */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite140205', resettable: true })
export class Solicitud140205Store extends Store<Solicitud140205State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado estableciendo el régimen seleccionado.
   * @param regimen Valor del régimen a asignar
   */
  public setRegimen(regimen: string): void {
    this.update((state) => ({
      ...state,
      regimen,
    }));
  }
  /**
   * Actualiza el estado con el mecanismo seleccionado.
   * @param mecanismo Valor del mecanismo a asignar
   */
  public setMecanismo(mecanismo: string): void {
    this.update((state) => ({
      ...state,
      mecanismo,
    }));
  }
  /**
   * Actualiza el estado con el tratado seleccionado.
   * @param tratado Valor del tratado a asignar
   */
  public setTratado(tratado: string): void {
    this.update((state) => ({
      ...state,
      tratado,
    }));
  }
  /**
   * Actualiza el estado con el producto seleccionado.
   * @param producto Nombre del producto a asignar
   */
  public setProducto(producto: string): void {
    this.update((state) => ({
      ...state,
      producto,
    }));
  }
  /**
   * Actualiza el estado con el subproducto seleccionado.
   * @param subproducto Nombre del subproducto a asignar
   */
  public setSubproducto(subproducto: string): void {
    this.update((state) => ({
      ...state,
      subproducto,
    }));
  }
  /**
   * Actualiza el estado con la representación seleccionada.
   * @param representacion Valor de la representación a asignar
   */
  public setRepresentacion(representacion: string): void {
    this.update((state) => ({
      ...state,
      representacion,
    }));
  }
  /**
   * Actualiza el estado con la cantidad especificada.
   * @param cantidad Valor numérico de la cantidad
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }
  /**
   * Actualiza el estado con los cupos de cancelación.
   * @param cancelacion Lista de cupos asociados a la cancelación
   */
  public setCancelacion(cancelacion: Cupo[]): void {
    this.update((state) => ({
      ...state,
      cancelacion,
    }));
  }
  /**
   * Actualiza el estado con los certificados configurados.
   * @param certificados Lista de elementos de configuración de certificados
   */
  public setCertificados(certificados: ConfiguracionCertificados[]): void {
    this.update((state) => ({
      ...state,
      certificados,
    }));
  }

  /**
   * Actualiza el grupo de empresa en el estado del trámite.
   *
   * Este método permite establecer el grupo de empresa en el estado del trámite.
   *
   * @param {GrupoEmpresa} grupoEmpresa - El grupo de empresa a establecer.
   */
  public setGrupoEmpresa(grupoEmpresa: GrupoEmpresa): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa,
    }));
  }

  /**
   * Actualiza el RFC en el estado del trámite.
   *
   * Este método permite establecer el RFC en el estado del trámite.
   *
   * @param {string} rfc - El RFC a establecer.
   */
  public setGrupoEmpresaRFC(rfc: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        rfc,
      },
    }));
  }

  /**
   * Actualiza el nombre en el estado del trámite.
   */
  public setGrupoEmpresaNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        nombre,
      },
    }));
  }
  /**
   * Actualiza el nombre en el estado del trámite.
   *
   * Este método permite establecer el nombre en el estado del trámite.
   *
   * @param {string} nombre - El nombre a establecer.
   */
  public setGrupoEmpresaPrimerApellido(primerApellido: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        primerApellido,
      },
    }));
  }
  /**
   * Actualiza el segundo apellido en el estado del trámite.
   *
   * Este método permite establecer el segundo apellido en el estado del trámite.
   *
   * @param {string} segundoApellido - El segundo apellido a establecer.
   */
  public setGrupoEmpresaSegundoApellido(segundoApellido: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        segundoApellido,
      },
    }));
  }
  /**
   * Actualiza la actividad económica en el estado del trámite.
   *
   * Este método permite establecer la actividad económica en el estado del trámite.
   *
   * @param {string} actividadEconomica - La actividad económica a establecer.
   */
  public setGrupoEmpresaActividadEconomica(actividadEconomica: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        actividadEconomica,
      },
    }));
  }
  /**
   * Actualiza los datos RFC en el estado del trámite.
   *
   * Este método permite establecer los datos RFC en el estado del trámite.
   *
   * @param {string} datosRfc - Los datos RFC a establecer.
   */
  public setGrupoEmpresaDatosRfc(datosRfc: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        datosRfc,
      },
    }));
  }
  /**
   * Actualiza la clave en el estado del trámite.
   *
   * Este método permite establecer la clave en el estado del trámite.
   *
   * @param {string} clave - La clave a establecer.
   */
  public setGrupoEmpresaClave(clave: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        clave,
      },
    }));
  }

  /**
   * Actualiza el correo en el estado del trámite.
   *
   * Este método permite establecer el correo en el estado del trámite.
   *
   * @param {string} correo - El correo a establecer.
   */
  public setGrupoEmpresaCorreo(correo: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        correo,
      },
    }));
  }

  /**
   * Actualiza la calle en el estado del trámite.
   *
   * Este método permite establecer la calle en el estado del trámite.
   *
   * @param {string} calle - La calle a establecer.
   */
  public setGrupoEmpresaCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        calle,
      },
    }));
  }
  /**
   * Actualiza el número exterior en el estado del trámite.
   *
   * Este método permite establecer el número exterior en el estado del trámite.
   *
   * @param {string} numeroExterior - El número exterior a establecer.
   */
  public setGrupoEmpresaNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        numeroExterior,
      },
    }));
  }
  /**
   * Actualiza el número interior en el estado del trámite.
   *
   * Este método permite establecer el número interior en el estado del trámite.
   *
   * @param {string} numeroInterior - El número interior a establecer.
   */
  public setGrupoEmpresaNumeroInterior(numeroInterior: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        numeroInterior,
      },
    }));
  }
  /**
   * Actualiza el código postal en el estado del trámite.
   *
   * Este método permite establecer el código postal en el estado del trámite.
   *
   * @param {string} codigoPostal - El código postal a establecer.
   */
  public setGrupoEmpresaCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        codigoPostal,
      },
    }));
  }
  /**
   * Actualiza la colonia en el estado del trámite.
   *
   * Este método permite establecer la colonia en el estado del trámite.
   *
   * @param {string} colonia - La colonia a establecer.
   */
  public setGrupoEmpresaColonia(colonia: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        colonia,
      },
    }));
  }
  /**
   * Actualiza el país en el estado del trámite.
   *
   * Este método permite establecer el país en el estado del trámite.
   *
   * @param {string} pais - El país a establecer.
   */
  public setGrupoEmpresaPais(pais: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        pais,
      },
    }));
  }
  /**
   * Actualiza el estado en el estado del trámite.
   *
   * Este método permite establecer el estado en el estado del trámite.
   *
   * @param {string} estado - El estado a establecer.
   */
  public setGrupoEmpresaEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        estado,
      },
    }));
  }
  /**
   * Actualiza la localidad en el estado del trámite.
   *
   * Este método permite establecer la localidad en el estado del trámite.
   *
   * @param {string} localidad - La localidad a establecer.
   */
  public setGrupoEmpresaLocalidad(localidad: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        localidad,
      },
    }));
  }
  /**
   * Actualiza el teléfono en el estado del trámite.
   *
   * Este método permite establecer el teléfono en el estado del trámite.
   *
   * @param {string} telefono - El teléfono a establecer.
   */
  public setGrupoEmpresaTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        telefono,
      },
    }));
  }

  /**
   * Actualiza el municipio en el estado del trámite.
   *
   * Este método permite establecer el municipio en el estado del trámite.
   *
   * @param {string} municipio - El municipio a establecer.
   */
  public setGrupoEmpresaMunicipio(municipio: string): void {
    this.update((state) => ({
      ...state,
      grupoEmpresa: {
        ...state.grupoEmpresa,
        municipio,
      },
    }));
  }

  /**
   * Actualiza el ID de la solicitud.
   * @param idSolicitud Nuevo ID de la solicitud.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
}
