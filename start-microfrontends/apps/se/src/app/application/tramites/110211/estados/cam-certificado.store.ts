import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@ng-mf/data-access-user';
import { GrupoRepresentativo } from '../models/cam-certificado.module';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';

/**
 * @description
 * Interfaz que define el estado del certificado CAM.
 */
/**
 * @interface CamState
 * @description Representa el estado de la aplicación relacionado con el certificado CAM.
 * Contiene información sobre formularios, catálogos, mercancías, datos del destinatario,
 * y otros detalles necesarios para la gestión del certificado.
 *
 * @property {Object} formCertificado - Objeto que contiene los datos del formulario del certificado.
 * @property {Catalogo} estado - Catálogo que representa el estado actual.
 * @property {Catalogo[]} paisBloques - Lista de catálogos que representan los bloques de países.
 * @property {Object} mercanciaForm - Objeto que contiene los datos del formulario de mercancías.
 * @property {Mercancia[]} mercanciaTabla - Lista de mercancías para la tabla.
 * @property {Object} formDatosCertificado - Objeto que contiene los datos del formulario del certificado.
 * @property {Catalogo} idiomaDatosSeleccion - Catálogo que representa el idioma seleccionado.
 * @property {Catalogo} entidadFederativaSeleccion - Catálogo que representa la entidad federativa seleccionada.
 * @property {Catalogo} representacionFederalSeleccion - Catálogo que representa la representación federal seleccionada.
 * @property {Object} formDatosDelDestinatario - Objeto que contiene los datos del formulario del destinatario.
 * @property {string} fraccionArancelaria - Fracción arancelaria de la mercancía.
 * @property {string} nombreComercialMercancia - Nombre comercial de la mercancía.
 * @property {string} nombreTecnico - Nombre técnico de la mercancía.
 * @property {string} nombreIngles - Nombre en inglés de la mercancía.
 * @property {string} criterioClasificacion - Criterio de clasificación de la mercancía.
 * @property {string} cantidad - Cantidad de la mercancía.
 * @property {Catalogo[]} umc - Lista de catálogos que representan las unidades de medida comercial.
 * @property {string} valorMercancia - Valor de la mercancía.
 * @property {string} complementoClasificacion - Complemento de clasificación de la mercancía.
 * @property {string} numeroFactura - Número de la factura.
 * @property {Catalogo[]} tipoFactura - Lista de catálogos que representan los tipos de factura.
 * @property {string} lugar - Lugar relacionado con el certificado.
 * @property {string} exportador - Nombre del exportador.
 * @property {string} empresa - Nombre de la empresa.
 * @property {string} cargo - Cargo del representante.
 * @property {string} lada - Código de área telefónica.
 * @property {string} telfono - Número de teléfono.
 * @property {string} fax - Número de fax.
 * @property {string} correo - Dirección de correo electrónico.
 * @property {Object} formaValida - Objeto que indica la validez de los formularios.
 * @property {Object} formDestinatario - Objeto que contiene los datos del formulario del destinatario.
 *
 * @command Este estado se utiliza para gestionar los datos y formularios relacionados con el certificado CAM.
 */
export interface CamState {
  /** Identificador de la solicitud */
  idSolicitud: number | null;
  /** Datos del formulario del certificado */
  formCertificado: { [key: string]: unknown };
  /** Estado seleccionado */
  estado: Catalogo;
  /** Bloques de países disponibles */
  paisBloques: Catalogo[];
  /** Datos del formulario de mercancías */
  mercanciaForm: { [key: string]: unknown };
  /** Tabla de mercancías */
  mercanciaTabla: Mercancia[];
  /** Datos del formulario del certificado */
  formDatosCertificado: { [key: string]: unknown };
  /** Idioma seleccionado */
  idiomaDatosSeleccion: Catalogo;
  /** Entidad federativa seleccionada */
  entidadFederativaSeleccion: Catalogo;
  /** Representación federal seleccionada */
  representacionFederalSeleccion: Catalogo;
  /** Datos del formulario del destinatario */
  formDatosDelDestinatario: { [key: string]: unknown };
  /** Fracción arancelaria */
  fraccionArancelaria: string;
  /** Nombre comercial de la mercancía */
  nombreComercialMercancia: string;
  /** Nombre técnico de la mercancía */
  nombreTecnico: string;
  /** Nombre en inglés de la mercancía */
  nombreIngles: string;
  /** Criterio de clasificación de la mercancía */
  criterioClasificacion: string;
  /** Cantidad de la mercancía */
  cantidad: string;
  /** Unidades de medida comercial */
  umc: Catalogo[];
  /** Valor de la mercancía */
  valorMercancia: string;
  /** Complemento de clasificación de la mercancía */
  complementoClasificacion: string;
  /** Número de la factura */
  numeroFactura: string;
  /** Tipos de factura */
  tipoFactura: Catalogo[];
  /** Lugar relacionado con el certificado */
  lugar: string;
  /** Nombre del exportador */
  exportador: string;
  /** Nombre de la empresa */
  empresa: string;
  /** Cargo del representante */
  cargo: string;
  /** Código de área telefónica */
  lada: string;
  /** Número de teléfono */
  telfono: string;
  /** Número de fax */
  fax: string;
  /** Dirección de correo electrónico */
  correo: string;
  /** Validez de los formularios */
  formaValida: { [key: string]: boolean };
  /** Datos del formulario del destinatario */
  formDestinatario: { [key: string]: unknown };
  /** Calle */
  calle: string;
  /** Mercancías disponibles */
  disponiblesDatos: Mercancia[];
  /** Mercancías seleccionadas en la tabla */
  mercanciaSeleccionadasTablaDatos: Mercancia[];
  /** Mercancías seleccionadas */
  mercanciaSeleccionadasDatos: Mercancia[];
  /** Datos del grupo representativo */
  grupoRepresentativo: GrupoRepresentativo;
}

/**
 * Función que crea el estado inicial del certificado CAM.
 * @method createInitialState
 */
export function createInitialState(): CamState {
  return {
    idSolicitud: 0,
    calle: '',
    disponiblesDatos: [],
    mercanciaSeleccionadasTablaDatos: [],
    mercanciaSeleccionadasDatos: [],
    formCertificado: {
      si: false,
      entidadFederativa: '',
      bloque: '',
      fraccionArancelariaForm: '',
      registroProductoForm: '',
      nombreComercialForm: '',
      fechaInicioInput: '',
      fechaFinalInput: '',
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      numeroDeRegistroFiscal: '',
      razonSocial: '',
      pais: '',
      calle: '',
      numeroLetra: '',
      ciudad: '',
      lada: '',
      telefono: '',
      fax: '',
      correo: ''
    },

    estado: {
      id: -1,
      descripcion: '',
    },
    paisBloques: [],
    mercanciaForm: {
      fraccionArancelaria: '',
      nombreComercialMercancia: '',
      nombreTecnico: '',
      nombreIngles: '',
      criterioClasificacion: '',
      marca: '',
      cantidad: '',
      umc: '',
      valorMercancia: '',
      complementoClasificacion: '',
      masaBruta: '',
      unidadMedidaMasaBruta: '',
      numeroFactura: '',
      tipoFactura: '',
      fechaFinal: '',
      normaOrigen: '',
      id: '',
      fechaFinalInput: '',
      nalad: '',
    },
    mercanciaTabla: [],
    formDatosCertificado: {
      observacionesDates: '',
      idiomaDates: '',
      precisaDates: '',
      EntidadFederativaDates: '',
      representacionFederalDates: '',
      presenta: '',
    },
    idiomaDatosSeleccion: { id: -1, clave: '', descripcion: '' },
    entidadFederativaSeleccion: { id: -1, clave: '', descripcion: '' },
    representacionFederalSeleccion: { id: -1, clave: '', descripcion: '' },
    formDatosDelDestinatario: {
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      numeroDeRegistroFiscal: '',
      razonSocial: '',
    },
    fraccionArancelaria: '',
    nombreComercialMercancia: '',
    nombreTecnico: '',
    nombreIngles: '',
    criterioClasificacion: '',
    cantidad: '',
    umc: [],
    valorMercancia: '',
    complementoClasificacion: '',
    numeroFactura: '',
    tipoFactura: [],
    lugar: '',
    exportador: '',
    empresa: '',
    cargo: '',
    lada: '',
    telfono: '',
    fax: '',
    correo: '',
    formaValida: {
      certificado: false,
      datos: false,
      destinatrio: false,
      datosDestinatario: false,
    },
    formDestinatario: {
      paisDestin: '',
      ciudad: '',
      calle: '',
      numeroLetra: '',
      lada: '',
      telefono: '',
      fax: '',
      correoElectronico: '',
    },
    grupoRepresentativo: {
      lugar: '',
      nombreExportador: '',
      empresa: '',
      cargo: '',
      lada: '',
      telefono: '',
      fax: '',
      correoElectronico: '',
    },
  };
}

/**
 * @descripcion
 * Clase que representa el almacén del certificado CAM.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'camstore', resettable: true })
export class camCertificadoStore extends Store<CamState> {
  /**
   * Constructor que inicializa el almacén con el estado inicial.
   * @method constructor
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda el ID de la solicitud en el estado.
   *
   * @param idSolicitud - El ID de la solicitud que se va a guardar.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de certificado.
   * @param values - Valores a actualizar en el formulario.
   */
  setFormCertificado(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formCertificado: {
        ...state.formCertificado,
        ...values,
      },
    }));
  }

  /**
   * @descripcion
   * Actualiza el estado seleccionado en el almacén.
   * @param estado - Objeto de tipo `Catalogo` que contiene la información del estado a actualizar.
   */
  setEstado(estado: Catalogo): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * @descripcion
   * Actualiza los bloques de países en el almacén.
   * @param paisBloques - Array de objetos `Catalogo` que representa los bloques de países.
   */
  setBloque(paisBloques: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      paisBloques,
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de mercancía en el almacén.
   * @param values - Objeto que contiene los valores a actualizar en el formulario de mercancía.
   */
  setFormMercancia(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      mercanciaForm: {
        ...state.mercanciaForm,
        ...values,
      },
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de certificado en el almacén.
   * @param values - Objeto que contiene los valores a actualizar en el formulario de certificado.
   */
  setFormDatosCertificado(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formDatosCertificado: {
        ...state.formDatosCertificado,
        ...values,
      },
    }));
  }

  /**
   * @descripcion
   * Actualiza el idioma seleccionado en el almacén.
   * @param idiomaDatosSeleccion - Objeto de tipo `Catalogo` que contiene la información del idioma seleccionado.
   */
  setIdiomaSeleccion(idiomaDatosSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      idiomaDatosSeleccion,
    }));
  }

  /**
   * @descripcion
   * Actualiza la entidad federativa seleccionada en el almacén.
   * @param entidadFederativaSeleccion - Objeto de tipo `Catalogo` que contiene la información de la entidad federativa seleccionada.
   */
  setEntidadFederativaSeleccion(entidadFederativaSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      entidadFederativaSeleccion,
    }));
  }

  /**
   * @descripcion
   * Actualiza la representación federal seleccionada en el almacén.
   * @param representacionFederalSeleccion - Objeto de tipo `Catalogo` que contiene la información de la representación federal seleccionada.
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
   * @descripcion
   * Actualiza los datos del formulario de destinatario en el almacén.
   * @param values - Objeto que contiene los valores a actualizar en el formulario de destinatario.
   */
  setFormDatosDelDestinatario(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formDatosDelDestinatario: {
        ...state.formDatosDelDestinatario,
        ...values,
      },
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de fraccionArancelaria en el almacén.
   * @param telfono - Cadena que representa el número de fraccionArancelaria a actualizar.
   */
  setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de nombreComercialMercancia en el almacén.
   * @param telfono - Cadena que representa el número de nombreComercialMercancia a actualizar.
   */
  setNombreComercialMercancia(nombreComercialMercancia: string): void {
    this.update((state) => ({
      ...state,
      nombreComercialMercancia,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de nombreTecnico en el almacén.
   * @param telfono - Cadena que representa el número de nombreTecnico a actualizar.
   */
  setNombreTecnico(nombreTecnico: string): void {
    this.update((state) => ({
      ...state,
      nombreTecnico,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de nombreIngles en el almacén.
   * @param telfono - Cadena que representa el número de nombreIngles a actualizar.
   */
  setNombreIngles(nombreIngles: string): void {
    this.update((state) => ({
      ...state,
      nombreIngles,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de criterioClasificacion en el almacén.
   * @param telfono - Cadena que representa el número de criterioClasificacion a actualizar.
   */
  setCriterioClasificacion(criterioClasificacion: string): void {
    this.update((state) => ({
      ...state,
      criterioClasificacion,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de cantidad en el almacén.
   * @param telfono - Cadena que representa el número de cantidad a actualizar.
   */
  setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de umc en el almacén.
   * @param telfono - Cadena que representa el número de umc a actualizar.
   */
  setUmc(umc: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      umc,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de valorMercancia en el almacén.
   * @param telfono - Cadena que representa el número de valorMercancia a actualizar.
   */
  setValorMercancia(valorMercancia: string): void {
    this.update((state) => ({
      ...state,
      valorMercancia,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de complementoClasificacion en el almacén.
   * @param telfono - Cadena que representa el número de complementoClasificacion a actualizar.
   */
  setComplementoClasificacion(complementoClasificacion: string): void {
    this.update((state) => ({
      ...state,
      complementoClasificacion,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de numeroFactura en el almacén.
   * @param telfono - Cadena que representa el número de numeroFactura a actualizar.
   */
  setNumeroFactura(numeroFactura: string): void {
    this.update((state) => ({
      ...state,
      numeroFactura,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de tipoFactura en el almacén.
   * @param telfono - Cadena que representa el número de tipoFactura a actualizar.
   */
  setTipoFactura(tipoFactura: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      tipoFactura,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de lugar en el almacén.
   * @param telfono - Cadena que representa el número de lugar a actualizar.
   */
  setLugar(lugar: string): void {
    this.update((state) => ({
      ...state,
      lugar,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de exportador en el almacén.
   * @param telfono - Cadena que representa el número de exportador a actualizar.
   */
  setExportador(exportador: string): void {
    this.update((state) => ({
      ...state,
      exportador,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de empresa en el almacén.
   * @param telfono - Cadena que representa el número de empresa a actualizar.
   */
  setEmpresa(empresa: string): void {
    this.update((state) => ({
      ...state,
      empresa,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de cargo en el almacén.
   * @param telfono - Cadena que representa el número de cargo a actualizar.
   */
  setCargo(cargo: string): void {
    this.update((state) => ({
      ...state,
      cargo,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de lada en el almacén.
   * @param telfono - Cadena que representa el número de lada a actualizar.
   */
  setLada(lada: string): void {
    this.update((state) => ({
      ...state,
      lada,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de teléfono en el almacén.
   * @param telfono - Cadena que representa el número de teléfono a actualizar.
   */
  setTelfono(telfono: string): void {
    this.update((state) => ({
      ...state,
      telfono,
    }));
  }

  /**
   * @descripcion
   * Actualiza el número de fax en el almacén.
   * @param fax - Cadena que representa el número de fax a actualizar.
   */
  setFax(fax: string): void {
    this.update((state) => ({
      ...state,
      fax,
    }));
  }

  /**
   * @descripcion
   * Actualiza el correo electrónico en el almacén.
   * @param correo - Cadena que representa el correo electrónico a actualizar.
   */
  setCorreo(correo: string): void {
    this.update((state) => ({
      ...state,
      correo,
    }));
  }

  /**
   * @descripcion
   * Actualiza el estado de validación de los formularios en el almacén.
   * @param formaValida - Objeto que contiene los valores de validación para los formularios.
   */
  setFormValida(formaValida: { [key: string]: boolean }): void {
    this.update((state) => {
      const IS_VALID = { ...state.formaValida, ...formaValida };
      return {
        ...state,
        formaValida: IS_VALID,
      };
    });
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de destinatario en el almacén.
   * @param values - Objeto que contiene los valores a actualizar en el formulario de destinatario.
   */
  setFormDestinatario(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formDestinatario: {
        ...state.formDestinatario,
        ...values,
      },
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de certificado en el almacén.
   * @param values - Objeto que contiene los valores a actualizar en el formulario de certificado.
   */
  setFormCertificadoGenric(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formCertificado: {
        ...state.formCertificado,
        ...values,
      },
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de certificado en el almacén.
   * @param values - Objeto que contiene los valores a actualizar en el formulario de certificado.
   */
  setFormDatosCertificadoGenric(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formDatosCertificado: {
        ...state.formDatosCertificado,
        ...values,
      },
    }));
  }

  /**
   * @descripcion
   * Actualiza los datos del formulario de certificado en el almacén.
   * @param values - Objeto que contiene los valores a actualizar en el formulario de certificado.
   */
  setGrupoRepresentativoNombreExportador(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      grupoRepresentativo: {
        ...state.grupoRepresentativo,
        ...values,
      },
    }));
  }

  /**
   * @descripcion
   * Actualiza completamente el estado con los valores proporcionados.
   * @param values - Objeto que contiene uno o más campos del estado a actualizar.
   */
  setEstadoCompleto(values: CamState): void {
    this.update((state) => ({
      ...state,
      ...values,
    }));
  }

  /**
   * @method setMercanciaTabla
   * @description Actualiza la lista de mercancías en la tabla del estado del trámite.
   *
   * Este método permite agregar una nueva mercancía o actualizar una existente en la tabla de mercancías.
   * Si la mercancía tiene un `id` de 0, se considera una nueva entrada y se le asigna un nuevo `id`.
   * Si la mercancía ya tiene un `id` mayor que 0, se actualiza la entrada existente con los nuevos datos.
   *
   * @param {Mercancia[]} mercanciaTabla - Lista de mercancías a actualizar en el estado.
   *
   * @returns {void}
   */
  public setMercanciaTabla(mercanciaTabla: Mercancia[]): void {
    this.update((STATE) => {
      const LISTAEXISTENTE = STATE.mercanciaTabla || [];
      const NUEVOARTICULO = { ...mercanciaTabla[0] };

      if (NUEVOARTICULO.id === 0) {
        // Agregar nuevo elemento con una identificación generada
        NUEVOARTICULO.id = (LISTAEXISTENTE.length || 0) + 1;
        const UPDATEDLIST = [...LISTAEXISTENTE, NUEVOARTICULO];
        return { ...STATE, mercanciaTabla: UPDATEDLIST };
      }

      // Actualizar el elemento existente cuando id > 0
      const UPDATEDLIST = LISTAEXISTENTE.map((ITEM) =>
        ITEM.id === NUEVOARTICULO.id ? { ...ITEM, ...NUEVOARTICULO } : ITEM
      );
      return { ...STATE, mercanciaTabla: UPDATEDLIST };
    });
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


  /**
   * @param mercanciaSeleccionadasDatos 
   * 
   */
  setMercanciaSeleccionadasDatos(mercanciaSeleccionadasDatos: Mercancia[]): void {
    this.update((state) => ({
      ...state,
      mercanciaSeleccionadasDatos,
    }));
  }

  /**
   * @method setMercanciaTablaDatos
   * @description Actualiza la lista de mercancías seleccionadas en la tabla de datos del estado del trámite.
   *
   * Este método permite establecer las mercancías seleccionadas por el usuario en la tabla de datos.
   *
   * @param {SeleccionadasTabla[]} mercanciaSeleccionadasTablaDatos - Lista de mercancías seleccionadas a actualizar en el estado.
   *
   * @returns {void}
   */
  public setMercanciaTablaDatos(
    mercanciaSeleccionadasTablaDatos: Mercancia[]
  ): void {
    this.update((STATE) => {
      const LISTAEXISTENTE = STATE.mercanciaSeleccionadasTablaDatos || [];
      const NUEVOARTICULO = { ...mercanciaSeleccionadasTablaDatos[0] };

      if (NUEVOARTICULO.id === 0) {
        // Agregar nuevo elemento con una identificación generada
        NUEVOARTICULO.id = (LISTAEXISTENTE.length || 0) + 1;
        const UPDATEDLIST = [...LISTAEXISTENTE, NUEVOARTICULO];
        return { ...STATE, mercanciaSeleccionadasTablaDatos: UPDATEDLIST };
      }

      // Actualizar el elemento existente cuando id > 0
      const UPDATEDLIST = LISTAEXISTENTE.map((ITEM) =>
        ITEM.id === NUEVOARTICULO.id ? { ...ITEM, ...NUEVOARTICULO } : ITEM
      );
      return { ...STATE, mercanciaSeleccionadasTablaDatos: UPDATEDLIST };
    });
  }

  /**
   * Actualiza el lugar en el grupo representativo.
   *
   * Este método permite establecer el lugar en el grupo representativo del trámite.
   *
   * @param {string} lugar - El lugar a establecer.
   */
  public setGrupoRepresentativoLugar(lugar: string): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo: { ...state.grupoRepresentativo, lugar },
    }));
  }

  /**
   * Resetea el estado del almacén al estado inicial.
   * Este método restablece todos los valores del estado al estado inicial definido en `createInitialState`.
   */
  public resetStore(): void {
    this.reset();
  }
}
