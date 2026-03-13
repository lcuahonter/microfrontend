import {
  AnexoEncabezado,
  AnexoUnoEncabezado,
  DatosAnexotressUno,
  DatosComplimento,
  ProveedorClienteTabla,
  ProyectoImmexEncabezado,
} from '../../../shared/models/nuevo-programa-industrial.model';
import {
  AnnexoDosTres,
  AnnexoUno,
} from '../models/nuevo-programa-industrial.model';
import { ComplementarPlantaState, ComplementoDePlanta, MontoDeInversion } from '../../../shared/constantes/complementar-planta.enum';
import { FederatariosEncabezado, PlantasDisponibles, PlantasImmex } from '../../../shared/models/federatarios-y-plantas.model';
import { AnexoDosEncabezado } from '../../../shared/models/nuevo-programa-industrial.model';
import { CapacidadInstalada } from '../../../shared/constantes/capacidad-instalada.enum';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogoPaises } from '@ng-mf/data-access-user';
import { DatosComplimentos } from '../../../shared/models/complimentos.model';
import { DatosEmpresaExtranjera } from '../models/nuevo-programa-industrial.model';
import { DatosSubcontratista } from '../../../shared/models/empresas-subfabricanta.model';
import { Directos } from '../../../shared/constantes/empleados.enum';
import { EmpressaSubFabricantePlantas } from '../../../shared/models/empresas-subfabricanta.model';
import { Injectable } from '@angular/core';
import { PlantasSubfabricante } from '../../../shared/models/empresas-subfabricanta.model';
import { Servicio } from '../models/nuevo-programa-industrial.model';
import { ServicioInmex } from '../models/nuevo-programa-industrial.model';
import { Servicios } from '../models/nuevo-programa-industrial.model';
import { SociaoAccionistas } from '../../../shared/models/complimentos.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';


/**
 * Representa el estado de Tramite80101.
 */
export interface Tramite80101State {
  /** Identificador de la solicitud, puede ser nulo si aún no se ha creado. */
  idSolicitud: number | null;
  /**
   * Información del registro de servicios.
   */
  infoRegistro: Servicios;

  /**
   * Lista de aduanas de ingreso disponibles.
   */
  aduanaDeIngreso: Catalogo[];

  /**
   * Datos relacionados con IMMEX.
   */
  datosImmex: Servicio[];

  /**
   * Información detallada de servicios IMMEX.
   */
  datos: ServicioInmex[];

  /**
   * Aduana de ingreso seleccionada.
   */
  aduanaDeIngresoSelecion: Catalogo;

  /**
   * Validación de la forma, donde cada clave representa un campo y su valor indica si es válido.
   */
  formaValida: { [key: string]: boolean };

  /**
   * Lista de empresas relacionadas con el servicio IMMEX.
   */
  empresas: ServicioInmex[];

  /**
   * Lista de servicios disponibles.
   */
  servicios: Servicio[];

  /**
   * RFC de la empresa.
   */
  rfcEmpresa: string;

  /**
   * Número del programa IMMEX.
   */
  numeroPrograma: string;

  /**
   * Tiempo de duración del programa IMMEX.
   */
  tiempoPrograma: string;

  /**
   * Lista de países de origen disponibles.
   */
  paisesOrigen: CatalogoPaises[];

  /**
   * Datos de empresas extranjeras relacionadas.
   */
  datosEmpresaExtranjera: DatosEmpresaExtranjera[];

  /**
   * Información de la forma de la empresa extranjera.
   */
  formaEmpresaExtranjera: DatosEmpresaExtranjera;

  /**
   * Datos complementarios relacionados con el trámite.
   */
  datosComplimentos: DatosComplimentos;

  /**
   * Datos complementarios relacionados con el trámite.
   */
  datosComplimento: DatosComplimento;

  
  /**
   * Datos complementarios relacionados con el trámite.
   */
  datosComplimentoDos: DatosComplimento;

   /**
   * Datos complementarios relacionados con el trámite.
   */
  datosAnexoTress: DatosAnexotressUno;

     /**
   * Datos complementarios relacionados con el trámite.
   */
  datosAnexoTressDos: DatosAnexotressUno;


  /**
   * Tabla de datos complementarios de socios y accionistas.
   */
  tablaDatosComplimentos: SociaoAccionistas[];

  /**
   * Tabla de datos complementarios de socios y accionistas extranjeros.
   */
  tablaDatosComplimentosExtranjera: SociaoAccionistas[];

  /**
   * Información de plantas de subfabricantes de la empresa.
   */
  empressaSubFabricantePlantas: EmpressaSubFabricantePlantas;

  /**
   * Información relacionada con los anexos dos y tres.
   */
  annexoDosTres: AnnexoDosTres;

  /**
   * Información relacionada con el anexo uno.
   */
  annexoUno: AnnexoUno;

  /**
   * Índice previo de la ruta seleccionada.
   */
  indicePrevioRuta: number;

  /**
   * Tabla de datos de federatarios.
   */
  tablaDatosFederatarios: FederatariosEncabezado[];

  /**
   * Información detallada de plantas IMMEX.
   */
  plantasImmexTablaLista: PlantasImmex[];
  /** 
   * Información detallada de plantas disponibles. 
   */
  plantasDisponiblesTablaLista: PlantasDisponibles[];

  /**
   * Información detallada de federatarios.
   */
  datosFederatarios: FederatariosEncabezado;

  /**
   * Información detallada de plantas IMMEX.
   */
  proyectoImmexTablaLista: ProyectoImmexEncabezado[];

  /**
   * Información detallada de proveedor Cliente Datos Tabla.
   */
  proveedorClienteDatosTabla: ProveedorClienteTabla[];

   /**
   * Información detallada de proveedor Cliente Datos TablaDos.
   */
  proveedorClienteDatosTablaDos: ProveedorClienteTabla[];

  /**
 * Información detallada de montos de inversión en la tabla.
 */
  montosDeInversionTablaDatos: MontoDeInversion[];

  /**
 * Información detallada de los empleados directos en la tabla.
 */
  empleadosTablaDatos: Directos[];

  /**
 * Información detallada de los complementos de planta en la tabla.
 */
  complementarPlantaDatos: ComplementoDePlanta[];

  /**
 * Información detallada del estado de firmantes de complementar planta en la tabla.
 */
  complementarFirmanteDatos: ComplementarPlantaState[];

/**
 * así como información de proveedores y capacidad instalada.
 */
  tablaDatosCapacidadInstalada: CapacidadInstalada[];
}

/**
 * Estado inicial para el trámite 80101 relacionado con la ampliación de servicios.
 * Este objeto define la estructura y valores predeterminados para manejar el estado
 * de la aplicación en este trámite específico.
 *
 * Propiedades:
 * - `infoRegistro`: Contiene información básica del registro, como modalidad, folio y año.
 * - `empresas`: Lista de empresas relacionadas con el trámite.
 * - `servicios`: Servicios asociados al trámite.
 * - `aduanaDeIngreso`: Lista de aduanas de ingreso disponibles.
 * - `datosImmex`: Información relacionada con el programa IMMEX.
 * - `datos`: Datos adicionales relacionados con el trámite.
 * - `aduanaDeIngresoSelecion`: Aduana de ingreso seleccionada por el usuario.
 * - `formaValida`: Validaciones relacionadas con la forma del trámite.
 * - `rfcEmpresa`: RFC de la empresa asociada al trámite.
 * - `numeroPrograma`: Número del programa IMMEX.
 * - `tiempoPrograma`: Duración del programa IMMEX.
 * - `paisesOrigen`: Lista de países de origen relacionados con el trámite.
 * - `datosEmpresaExtranjera`: Información de empresas extranjeras relacionadas.
 * - `formaEmpresaExtranjera`: Detalles de la forma de empresa extranjera.
 * - `datosComplimentos`: Información complementaria del trámite, incluyendo modalidad,
 *   obligaciones fiscales, modificaciones, certificaciones y datos de socios o accionistas.
 * - `empressaSubFabricantePlantas`: Información sobre subfabricantes y plantas relacionadas.
 * - `annexoDosTres`: Datos relacionados con los anexos II y III.
 * - `tablaDatosComplimentos`: Tabla de datos complementarios.
 * - `tablaDatosComplimentosExtranjera`: Tabla de datos complementarios para empresas extranjeras.
 * - `annexoUno`: Información relacionada con el anexo I, incluyendo datos de exportación,
 *   importación y navegación.
 * - `indicePrevioRuta`: Índice para manejar la navegación previa en rutas.
 * - `tablaDatosFederatarios`: Tabla de datos de fedatarios públicos.
 */
export const INITIAL_AMPLIACION_SERVICIOS_STATE: Tramite80101State = {
  idSolicitud: 0,
  infoRegistro: {
    seleccionaLaModalidad: '',
    folio: '',
    ano: '',
  },
  empresas: [],
  servicios: [],
  aduanaDeIngreso: [],
  datosImmex: [],
  datos: [],
  aduanaDeIngresoSelecion: {
    id: -1,
    descripcion: '',
  },
  formaValida: {
    entidadFederativa: false,
    formaEmpresaExtranjera: false,
  },
  rfcEmpresa: '',
  numeroPrograma: '',
  tiempoPrograma: '',
  paisesOrigen: [],
  datosEmpresaExtranjera: [],
  formaEmpresaExtranjera: {
    id: '',
    taxIdEmpresaExt: '',
    entidadFederativaEmpresaExt: '',
    nombreEmpresaExt: '',
    direccionEmpresaExtranjera: '',
  },
  datosComplimento:{
    fraccionArancelaria: "",
    descripcion: "",
  },
   datosComplimentoDos:{
    fraccionArancelaria: "",
    descripcion: "",
  },
  datosAnexoTress:{
    fraccionArancelaria:"",
  descripcion: ""
  },
  datosAnexoTressDos:{
     fraccionArancelaria:"",
  descripcion: ""
  },
  datosComplimentos: {
    modalidad: 'Industrial',
    programaPreOperativo: '',
    datosGeneralis: {
      paginaWWeb: '',
      localizacion: '',
    },
    obligacionesFiscales: {
      opinionPositiva: 'Si',
      fechaExpedicion: new Date().toLocaleDateString('en-GB'),
      aceptarObligacionFiscal: '',
    },
    formaModificaciones: {
      nombreDelFederatario: '',
      nombreDeNotaria: '',
      estado: '',
      nombreDeActa: '',
      fechaDeActa: '',
      rfc: '',
      nombreDeRepresentante: '',
    },
    formaCertificacion: {
      certificada: 'No',
      fechaInicio: '',
      fechaVigencia: '',
    },
    formaSocioAccionistas: {
      nationalidadMaxicana: 'false',
      tipoDePersona: 'false',
      formaDatos: {
        rfc: '',
        taxId: '',
        razonSocial: '',
        pais: '',
        codigoPostal: '',
        estado: '',
        correoElectronico: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        cp: '',
      },
    },
  },

  empressaSubFabricantePlantas: {
    datosSubcontratista: {
      rfc: '',
      estado: '',
    },
    plantasBuscadas: [],
    plantasSubfabricantesAgregar: [],
    plantasPorCompletar: [],
  },
  annexoDosTres: {
    anexoDosTablaLista: [],
    anexoTresTablaLista: [],
  },

  tablaDatosComplimentos: [],
  tablaDatosComplimentosExtranjera: [],

  annexoUno: {
    exportarDatosTabla: [],
    importarDatosTabla: [],
    datosParaNavegar: {
      encabezadoFraccion: '',
      encabezadoDescripcionComercial: '',
      estatus: false,
      encabezadoFraccionArancelaria: '',
      encabezadoAnexoII: '',
      encabezadoTipo: '',
      encabezadoUmt: '',
      encabezadoCategoria: '',
      encabezadoValorEnMonedaMensual: 0,
      encabezadoValorEnMonedaAnual: 0,
      encabezadoVolumenMensual: 0,
      encabezadoVolumenAnual: 0,
      encabezadoValorEnMercado: '',
    },
    proveedorClienteDatosTabla:[],
    proveedorClienteDatosTablaDos:[],
    seccionActiva: '',
  },

  indicePrevioRuta: 0,
  tablaDatosFederatarios: [],
  plantasImmexTablaLista: [],
  plantasDisponiblesTablaLista: [],
  datosFederatarios: {
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    numeroDeActa: '',
    fechaDelActa: '',
    numeroDeNotaria: '',
    entidadFederativa: '',
    municipioODelegacion: '',
    estado: '',
    estadoOptions: '',
    estadoUno: '',
    estadoDos: '',
    estadoTres: ''
  },
  proyectoImmexTablaLista: [],
  proveedorClienteDatosTabla: [],
  proveedorClienteDatosTablaDos: [],
  montosDeInversionTablaDatos: [],
  empleadosTablaDatos: [],
  complementarPlantaDatos: [],
  complementarFirmanteDatos: [],
  tablaDatosCapacidadInstalada: [],
};

/**
 * AmpliacionServicios Store
 * @export
 * @class Tramite80102Store
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite-80102', resettable: true })
export class Tramite80101Store extends Store<Tramite80101State> {
  /**
   * Crea una instancia de `Tramite80101Store` con el estado inicial definido en `INITIAL_AMPLIACION_SERVICIOS_STATE`.
   */
  constructor() {
    super(INITIAL_AMPLIACION_SERVICIOS_STATE);
  }

  /**
    * Guarda el ID de la solicitud en el estado.
    *
    * @param idSolicitud - El ID de la solicitud que se va a guardar.
    */
  public setFederatariosCatalogo(datosFederatarios: FederatariosEncabezado): void {
    this.update((state) => ({
      ...state,
      datosFederatarios,
    }));
  }
 /**
   * Devuelve el arreglo federatariosDatos del estado actual del store.
   */

    /**
   * Actualiza el arreglo de federatariosDatos en el estado del store.
   * @param datos - Nuevo arreglo de federatariosDatos a establecer.
   */
  setFederatariosDatos(datos: any[]): void {
    this.update((state) => ({
      ...state,
      federatariosDatos: [...datos],
    }));
  }
    /**
   * Devuelve el valor de datosFederatarios del estado actual del store.
   */
  getDatosFederatarios(): any {
    return this.getValue().datosFederatarios;
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
   * Establece la información de registro en el estado de la tienda.
   *
   * @param infoRegistro - Objeto de tipo `Servicios` que contiene la información de registro a actualizar.
   */
  setInfoRegistro(infoRegistro: Servicios): void {
    this.update((state) => ({
      ...state,
      infoRegistro,
    }));
  }

  /**
   * Establece el catálogo de aduanas de ingreso en el estado de la tienda.
   *
   * @param aduanaDeIngreso - Una lista de objetos del tipo `Catalogo` que representa las aduanas de ingreso.
   *
   * @remarks
   * Este método actualiza el estado de la tienda con la información proporcionada
   * en el parámetro `aduanaDeIngreso`.
   */
  setAduanaDeIngreso(aduanaDeIngreso: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      aduanaDeIngreso,
    }));
  }

  /**
   * Actualiza el estado con los datos proporcionados de IMMEX.
   *
   * @param datosImmex - Una lista de objetos de tipo `Servicio` que contiene los datos de IMMEX a establecer en el estado.
   */
  setDatosImmex(datosImmex: Servicio[]): void {
    this.update((state) => ({
      ...state,
      datosImmex,
    }));
  }

  /**
   * Establece los datos en el estado de la tienda.
   *
   * @param datos - Una lista de objetos de tipo `ServicioInmex` que se asignarán al estado.
   */
  setDatos(datos: ServicioInmex[]): void {
    this.update((state) => ({
      ...state,
      datos,
    }));
  }

  /**
   * Establece la aduana de ingreso seleccionada en el estado de la tienda.
   *
   * @param aduanaDeIngresoSelecion - El objeto de tipo `Catalogo` que representa la aduana de ingreso seleccionada.
   */
  setAduanaDeIngresoSeleccion(aduanaDeIngresoSelecion: Catalogo): void {
    this.update((state) => ({
      ...state,
      aduanaDeIngresoSelecion,
    }));
  }

  /**
   * Actualiza el estado de la validez del formulario combinando los valores existentes
   * con los nuevos valores proporcionados.
   *
   * @param formaValida - Un objeto donde las claves representan los nombres de los campos
   * y los valores son booleanos que indican si el campo es válido o no.
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
   * Establece el RFC de la empresa en el estado de la tienda.
   *
   * @param rfcEmpresa - El RFC de la empresa que se desea establecer.
   */
  setRfcEmpresa(rfcEmpresa: string): void {
    this.update((state) => ({
      ...state,
      rfcEmpresa,
    }));
  }
  /**
   * Establece el número de programa en el estado de la tienda.
   *
   * @param numeroPrograma - El número de programa que se debe asignar al estado.
   */
  setNumeroPrograma(numeroPrograma: string): void {
    this.update((state) => ({
      ...state,
      numeroPrograma,
    }));
  }
  /**
   * Establece el tiempo del programa en el estado de la tienda.
   *
   * @param tiempoPrograma - El tiempo del programa que se debe establecer.
   */
  setTiempoPrograma(tiempoPrograma: string): void {
    this.update((state) => ({
      ...state,
      tiempoPrograma,
    }));
  }
  /**
   * Establece los campos relacionados con la empresa en el estado.
   *
   * @param rfcEmpresa - El RFC de la empresa.
   * @param numeroPrograma - El número del programa asociado.
   * @param tiempoPrograma - El tiempo asignado al programa.
   */
  setCamposEmpresa(
    rfcEmpresa: string,
    numeroPrograma: string,
    tiempoPrograma: string
  ): void {
    this.update((state) => ({
      ...state,
      rfcEmpresa,
      numeroPrograma,
      tiempoPrograma,
    }));
  }

  /**
   * Establece la lista de empresas en el estado.
   *
   * @param empresas - Arreglo de objetos de tipo `ServicioInmex` que representa las empresas a actualizar en el estado.
   */
  setEmpresas(empresas: ServicioInmex[]): void {
    this.update((state) => ({
      ...state,
      empresas,
    }));
  }

  /**
   * Establece la lista de servicios en el estado de la tienda.
   *
   * @param servicios - Un arreglo de objetos de tipo `Servicio` que se asignará al estado.
   */
  setServicios(servicios: Servicio[]): void {
    this.update((state) => ({
      ...state,
      servicios,
    }));
  }

  /**
   * Agrega un nuevo servicio al estado actual.
   *
   * @param servicio - El objeto de tipo `Servicio` que se agregará a la lista de servicios.
   */
  agregarServicio(servicio: Servicio): void {
    this.update((state) => ({
      ...state,
      servicios: [...state.servicios, servicio],
    }));
  }
  /**
   * Agrega una nueva empresa al estado actual.
   *
   * @param empresa - Objeto de tipo `ServicioInmex` que representa la empresa a agregar.
   */
  agregarEmpresa(empresa: ServicioInmex): void {
    this.update((state) => ({
      ...state,
      empresas: [...state.empresas, empresa],
    }));
  }

  /**
   * Establece la lista de países de origen en el estado de la tienda.
   *
   * @param paisesOrigen - Un arreglo de objetos de tipo `CatalogoPaises` que representa los países de origen.
   */
  setPaisesOrigen(paisesOrigen: CatalogoPaises[]): void {
    this.update((state) => ({
      ...state,
      paisesOrigen,
    }));
  }

  /**
   * Agrega los datos de una empresa extranjera al estado actual.
   *
   * @param datosEmpresaExtranjera - Objeto que contiene la información de la empresa extranjera.
   *                                Este objeto será extendido con un identificador único generado automáticamente.
   *
   * @remarks
   * Este método utiliza la función `update` para modificar el estado actual,
   * añadiendo los datos de la nueva empresa extranjera al arreglo existente.
   */
  agregarDdatosEmpresaExtranjera(
    datosEmpresaExtranjera: DatosEmpresaExtranjera
  ): void {
    this.update((state) => {
      const DATOS = {
        ...datosEmpresaExtranjera,
        id: crypto.randomUUID().toString(),
      };

      return {
        ...state,
        datosEmpresaExtranjera: [...state.datosEmpresaExtranjera, DATOS],
      };
    });
  }

  /**
   * Elimina los datos de empresas extranjeras especificados del estado actual.
   *
   * @param datosEmpresaExtranjera - Un arreglo de objetos `DatosEmpresaExtranjera` que representan
   * los datos de las empresas extranjeras a eliminar.
   *
   * Este método actualiza el estado eliminando los elementos que coincidan con los
   * identificadores proporcionados en el arreglo `datosEmpresaExtranjera`.
   */
  eliminarDatosEmpresaExtranjera(
    datosEmpresaExtranjera: DatosEmpresaExtranjera[]
  ): void {
    this.update((state) => {
      const DOMICILIOS = [...state.datosEmpresaExtranjera].filter((ele) =>
        datosEmpresaExtranjera.some((datos) => ele.id !== datos.id)
      );
      return {
        ...state,
        datosEmpresaExtranjera: DOMICILIOS,
      };
    });
  }
  setEliminarPlantasImmexId(plantaId: string[]): void {
    this.update((state) => {
      const PLANTAS = [...state.plantasImmexTablaLista].filter((ele) =>
        plantaId.every((id) => ele.planta !== id)
      );
      return {
        ...state,
        plantasImmexTablaLista: PLANTAS,
      };
    });
  }

  setEliminarMontosDeInversionPlanta(plantaId: string[]): void {
  this.update((state) => {
    const MONTOS = [...state.montosDeInversionTablaDatos].filter((ele) =>
      plantaId.every((id) => ele.PLANTA !== id)
    );

    return {
      ...state,
      montosDeInversionTablaDatos: MONTOS,
    };
  });
}



  /**
   * Actualiza el estado con los datos complementarios proporcionados.
   *
   * @param datosComplimentos - Objeto que contiene los datos complementarios a actualizar.
   *
   * Este método combina los datos existentes en el estado con los nuevos datos proporcionados
   * y actualiza el estado con el resultado.
   */
  setDatosComplimentos(datosComplimentos: DatosComplimentos): void {
    this.update((state) => {
      const VALUE = { ...state.datosComplimentos, ...datosComplimentos };
      return { ...state, datosComplimentos: VALUE };
    });
  }
/**
   * Actualiza el estado con los datos complementarios proporcionados.
   *
   * @param datosComplimento - Objeto que contiene los datos complementarios a actualizar.
   *
   * Este método combina los datos existentes en el estado con los nuevos datos proporcionados
   * y actualiza el estado con el resultado.
   */
  setDatosComplimento(datosComplimento: DatosComplimento): void {
    this.update((state) => {
      const VALUE = { ...state.datosComplimento, ...datosComplimento };
      return { ...state, datosComplimento: VALUE };
    });
  }

  /**
   * Actualiza el estado with los datos complementarios proporcionados.
   *
   * @param datosComplimentoDos - Objeto que contiene los datos complementarios a actualizar.
   *
   * Este método combina los datos existentes en el estado con los nuevos datos proporcionados
   * y actualiza el estado con el resultado.
   */
  setDatosComplimentoDos(datosComplimentoDos: DatosComplimento): void {
    this.update((state) => {
      const VALUE = { ...state.datosComplimentoDos, ...datosComplimentoDos };
      return { ...state, datosComplimentoDos: VALUE };
    });
  }
  /**
   * Establece los datos del subcontratista en el estado de la tienda.
   *
   * @param datosSubcontratista - Objeto que contiene la información del subcontratista.
   */
  setDatosSubcontratista(datosSubcontratista: DatosSubcontratista): void {
    this.update((state) => ({
      ...state,
      empressaSubFabricantePlantas: {
        ...state.empressaSubFabricantePlantas,
        datosSubcontratista: datosSubcontratista,
      },
    }));
  }

  /**
   * Establece las plantas subfabricantes a agregar en el estado de la tienda.
   *
   * @param plantasSubfabricantesAgregar - Lista de objetos de tipo `PlantasSubfabricante`
   * que representan las plantas subfabricantes que se deben agregar.
   *
   * Este método actualiza el estado de la tienda añadiendo o reemplazando
   * las plantas subfabricantes especificadas en la propiedad
   * `empressaSubFabricantePlantas`.
   */
  setPlantasSubfabricantesAgregar(
    plantasSubfabricantesAgregar: PlantasSubfabricante[]
  ): void {
    this.update((state) => ({
      ...state,
      empressaSubFabricantePlantas: {
        ...state.empressaSubFabricantePlantas,
        plantasSubfabricantesAgregar: plantasSubfabricantesAgregar,
      },
    }));
  }

  /**
   * Establece las plantas buscadas para el subfabricante.
   *
   * @param plantasBuscadas - Una lista de objetos de tipo `PlantasSubfabricante`
   * que representan las plantas buscadas.
   */
  setPlantasBuscadas(plantasBuscadas: PlantasSubfabricante[]): void {
    this.update((state) => ({
      ...state,
      empressaSubFabricantePlantas: {
        ...state.empressaSubFabricantePlantas,
        plantasBuscadas: plantasBuscadas,
      },
    }));
  }

  /**
   * Elimina las plantas especificadas de la lista de plantasSubfabricantesAgregar
   * en el estado de la tienda.
   *
   * @param eliminarPlantas - Un arreglo de objetos `PlantasSubfabricante` que
   * contiene las plantas a eliminar. Se identifican por la propiedad `calle`.
   */
  eliminarPlantas(eliminarPlantas: PlantasSubfabricante[]): void {
    this.update((state) => {
      const PLANTAS = [
        ...state.empressaSubFabricantePlantas.plantasSubfabricantesAgregar,
      ].filter(
        (ele) => !eliminarPlantas.some((plantas) => plantas.calle === ele.calle)
      );
      return {
        ...state,
        empressaSubFabricantePlantas: {
          ...state.empressaSubFabricantePlantas,
          plantasSubfabricantesAgregar: PLANTAS,
        },
      };
    });
  }

  /**
   * Establece las plantas por completar para el subfabricante.
   *
   * @param plantasPorCompletar - Una lista de objetos de tipo `PlantasSubfabricante`
   * que representan las plantas que deben ser agregadas.
   *
   * Actualiza el estado de la tienda para incluir las plantas proporcionadas
   * en la propiedad `plantasSubfabricantesAgregar` dentro de `empressaSubFabricantePlantas`.
   */
  setPlantasPorCompletar(plantasPorCompletar: PlantasSubfabricante[]): void {
    this.update((state) => ({
      ...state,
      empressaSubFabricantePlantas: {
        ...state.empressaSubFabricantePlantas,
        plantasSubfabricantesAgregar: plantasPorCompletar,
      },
    }));
  }

  /**
   * Agrega un nuevo conjunto de datos a la tabla de complementos en el estado.
   *
   * @param datos - Objeto que contiene la información de socios o accionistas que se agregará.
   *                Se genera un identificador único (UUID) para cada entrada.
   *
   * @remarks
   * Este método actualiza el estado actual añadiendo un nuevo elemento a la lista
   * `tablaDatosComplimentos`. Utiliza `crypto.randomUUID()` para generar un identificador único.
   */
  aggregarTablaDatosComplimentos(datos: SociaoAccionistas): void {
    this.update((state) => {
      const DATOS = {
        ...datos,
        id: crypto.randomUUID().toString(),
      };
      return {
        ...state,
        tablaDatosComplimentos: [...state.tablaDatosComplimentos, DATOS],
      };
    });
  }

  /**
   * Elimina elementos de la tabla `tablaDatosComplimentos` en el estado actual
   * basándose en los datos proporcionados.
   *
   * @param datos - Una lista de objetos `SociaoAccionistas` que contienen los elementos
   *                a comparar para determinar qué elementos eliminar de la tabla.
   *
   * El método filtra los elementos de `tablaDatosComplimentos` que no coinciden
   * con los identificadores (`id`) de los objetos proporcionados en el parámetro `datos`.
   */
  eliminarTablaDatosComplimentos(datos: SociaoAccionistas[]): void {
    this.update((state) => {
      const DOMICILIOS = [...state.tablaDatosComplimentos].filter((ele) =>
        datos.some((datos) => ele.id === datos.id)
      );
      return {
        ...state,
        tablaDatosComplimentos: DOMICILIOS,
      };
    });
  }

  /**
   * Agrega un nuevo registro a la tabla de datos de complementos extranjera.
   *
   * @param datos - Objeto que contiene la información del socio o accionista que se agregará.
   *                Este objeto se extiende con un identificador único generado automáticamente.
   *
   * @remarks
   * Este método actualiza el estado de la tienda añadiendo un nuevo elemento al arreglo
   * `tablaDatosComplimentosExtranjera`. El identificador único se genera utilizando
   * `crypto.randomUUID()`.
   */
  aggregarTablaDatosComplimentosExtranjera(datos: SociaoAccionistas): void {
    this.update((state) => {
      const DATOS = {
        ...datos,
        id: crypto.randomUUID().toString(),
      };
      return {
        ...state,
        tablaDatosComplimentosExtranjera: [
          ...state.tablaDatosComplimentosExtranjera,
          DATOS,
        ],
      };
    });
  }

  /**
   * Elimina elementos de la tabla `tablaDatosComplimentosExtranjera` en el estado actual,
   * excluyendo aquellos que coincidan con los identificadores proporcionados en el arreglo `datos`.
   *
   * @param datos - Un arreglo de objetos `SociaoAccionistas` que contiene los elementos
   *                cuyos identificadores se utilizarán para filtrar la tabla.
   */
  eliminarTablaDatosComplimentosExtranjera(datos: SociaoAccionistas[]): void {
    this.update((state) => {
      const DOMICILIOS = [...state.tablaDatosComplimentosExtranjera].filter(
        (ele) => datos.some((datos) => ele.id === datos.id)
      );
      return {
        ...state,
        tablaDatosComplimentosExtranjera: DOMICILIOS,
      };
    });
  }

  //annexo dos y tres estados

  /**
   * Establece la lista de la tabla Anexo Dos en el estado de la tienda.
   *
   * @param anexoDosTablaLista - Un arreglo de objetos de tipo `AnexoEncabezado` que representa la nueva lista de la tabla Anexo Dos.
   *
   * Este método actualiza el estado de la tienda para incluir la nueva lista de la tabla Anexo Dos,
   * manteniendo el resto de las propiedades del estado sin cambios.
   */
  setAnnexoDosTableLista(anexoDosTablaLista: AnexoEncabezado[]): void {
    this.update((state) => ({
      ...state,
      annexoDosTres: {
        ...state.annexoDosTres,
        anexoDosTablaLista: anexoDosTablaLista,
      },
    }));
  }

  /**
   * Establece la lista de la tabla Anexo Tres en el estado de la tienda.
   *
   * @param anexoTresTablaLista - Arreglo de objetos de tipo `AnexoEncabezado` que representa la nueva lista de la tabla Anexo Tres.
   */
  setAnnexoTresTableLista(anexoTresTablaLista: AnexoEncabezado[]): void {
    this.update((state) => ({
      ...state,
      annexoDosTres: {
        ...state.annexoDosTres,
        anexoTresTablaLista: anexoTresTablaLista,
      },
    }));
  }

  /**
   * Establece el índice previo de la ruta en el estado de la tienda.
   *
   * @param indice - El índice que se establecerá como el índice previo de la ruta.
   */
  setindicePrevioRuta(indice: number): void {
    this.update((state) => ({
      ...state,
      indicePrevioRuta: indice,
    }));
  }

  /**
   * Establece la sección activa en el estado de "annexoUno".
   *
   * @param seccionActiva - El identificador de la sección activa que se debe establecer.
   */
  setAnnexoUnoSeccionActiva(seccionActiva: string): void {
    this.update((state) => ({
      ...state,
      annexoUno: {
        ...state.annexoUno,
        seccionActiva: seccionActiva,
      },
    }));
  }

  /**
   * Actualiza la propiedad `proveedorClienteDatosTabla` dentro de `annexoUno` en el estado de la tienda.
   *
   * @param proveedorClienteDatosTabla - Arreglo de objetos de tipo `ProveedorClienteTabla` que representa los datos de proveedores y clientes para la tabla.
   */
  setProveedorClienteDatosTablaUno(proveedorClienteDatosTabla: ProveedorClienteTabla[]): void {
    this.update((state) => ({
      ...state,
      annexoUno: {
        ...state.annexoUno,
        proveedorClienteDatosTabla: proveedorClienteDatosTabla,
      },
    }));
  }

/**
   * Actualiza la propiedad `proveedorClienteDatosTablaDos` dentro de `annexoUno` en el estado de la tienda.
   *
   * @param proveedorClienteDatosTablaDos - Arreglo de objetos de tipo `ProveedorClienteTabla` que representa los datos de proveedores y clientes para la tabla.
   */
  setProveedorClienteDatosTablaDos(proveedorClienteDatosTabla: ProveedorClienteTabla[]): void {
    this.update((state) => ({
      ...state,
      annexoUno: {
        ...state.annexoUno,
        proveedorClienteDatosTablaDos: proveedorClienteDatosTabla,
      },
    }));
  }

  /**
   * Establece los datos necesarios para la navegación en el estado de la aplicación.
   *
   * @param datosParaNavegar - Objeto que contiene los datos para navegar,
   * puede ser de tipo `AnexoUnoEncabezado` o `AnexoDosEncabezado`.
   *
   * @remarks
   * Este método actualiza el estado de la aplicación añadiendo o modificando
   * los datos de navegación en el objeto `annexoUno`.
   */
  setDatosParaNavegar(
    datosParaNavegar: AnexoUnoEncabezado | AnexoDosEncabezado
  ): void {
    this.update((state) => ({
      ...state,
      annexoUno: {
        ...state.annexoUno,
        datosParaNavegar: datosParaNavegar,
      },
    }));
  }

  /**
   * Establece los datos de la tabla de importación en el estado.
   *
   * @param importarDatosTabla - Un arreglo de objetos de tipo `AnexoUnoEncabezado` que contiene los datos a importar.
   *
   * Este método actualiza el estado del componente añadiendo o reemplazando
   * los datos de la tabla de importación en la propiedad `annexoUno`.
   */
  setImportarDatosTabla(importarDatosTabla: AnexoUnoEncabezado[]): void {
    this.update((state) => ({
      ...state,
      annexoUno: {
        ...state.annexoUno,
        importarDatosTabla: importarDatosTabla,
      },
    }));
  }

  /**
   * Establece los datos de la tabla para exportar y actualiza el estado correspondiente.
   *
   * @param exportarDatosTabla - Un arreglo de objetos de tipo `AnexoDosEncabezado` que contiene los datos a exportar.
   */
  setExportarDatosTabla(exportarDatosTabla: AnexoDosEncabezado[]): void {
    this.update((state) => ({
      ...state,
      annexoUno: {
        ...state.annexoUno,
        exportarDatosTabla: exportarDatosTabla,
      },
    }));
  }

  /**
   * Agrega un nuevo elemento de tipo `FederatariosEncabezado` a la lista `tablaDatosFederatarios`
   * en el estado actual de la tienda.
   *
   * @param formaFederatarios - El objeto de tipo `FederatariosEncabezado` que se añadirá
   * a la lista `tablaDatosFederatarios`.
   */
  setFederatarios(formaFederatarios: FederatariosEncabezado): void {
    this.update((state) => ({
      ...state,
      tablaDatosFederatarios: [
        ...state.tablaDatosFederatarios,
        formaFederatarios,
      ],
    }));
  }


    updateFederatarios(formaFederatarios: FederatariosEncabezado[]): void {
    this.update((state) => ({
      ...state,
      tablaDatosFederatarios: [
       ...formaFederatarios,
      ],
    }));
  }
  /**
   * Establece la lista de plantas disponibles en el estado de la tienda.
   *
   * @param plantas - Una lista de objetos de tipo `PlantasDisponibles` que se asignará al estado.
   */
  setPlantasDisponiblesTablaLista(plantas: PlantasDisponibles[]): void {
    this.update((state) => ({
      ...state,
      plantasDisponiblesTablaLista: [...state.plantasDisponiblesTablaLista, ...plantas],
    }));
  }

  /**
   * Elimina las plantas disponibles especificadas del estado de la tienda.
   *
   * @param eliminarPlantas - Un arreglo de objetos `PlantasDisponibles` que se eliminarán del estado.
   */
  setEliminarPlantasDisponibles(plantas: PlantasDisponibles[]): void {
    this.update((state) => ({
      ...state,
      plantasDisponiblesTablaLista: [...plantas], // fresh copy
    }));
  }

  /**
   * Establece la lista de plantas IMMEX en el estado de la tienda.
   *
   * @param plantasImmex - Una lista de objetos de tipo `PlantasImmex` que se asignará al estado.
   */
  setPlantasImmexTablaLista(plantasImmex: PlantasImmex[]): void {
    this.update((state) => ({
      ...state,
      plantasImmexTablaLista: [...state.plantasImmexTablaLista, ...plantasImmex],
    }));
  }

  /**
   * Agrega un nuevo elemento de tipo `PlantasImmex` a la lista `plantasImmexTablaLista`
   * en el estado actual de la tienda.
   *
   * @param formaFederatarios - El objeto de tipo `PlantasImmex` que se añadirá
   * a la lista `plantasImmexTablaLista`.
   */
  setPlantasImmex(formaFederatarios: PlantasImmex): void {
    this.update((state) => ({
      ...state,
      plantasImmexTablaLista: [
        ...state.plantasImmexTablaLista,
        formaFederatarios
      ],
    }));
  }

  /**
   * Agrega un nuevo elemento de tipo `PlantasDisponibles` a la lista `plantasDisponiblesTablaLista`
   * en el estado actual de la tienda.
   *
   * @param formaFederatarios - El objeto de tipo `PlantasDisponibles` que se añadirá
   * a la lista `plantasDisponiblesTablaLista`.
   */
  setPlantasDisponibles(formaFederatarios: PlantasDisponibles): void {
    this.update((state) => ({
      ...state,
      plantasDisponiblesTablaLista: [
        ...state.plantasDisponiblesTablaLista,
        formaFederatarios
      ],
    }));
  }

  /**
   * Actualiza la propiedad `datosAnexoTress` en el store con los datos proporcionados.
   * Fusiona el estado existente de `datosAnexoTress` con los nuevos valores recibidos.
   *
   * @param datosAnexoTress - Objeto que contiene los nuevos datos a fusionar en `datosAnexoTress`.
   */
  setDatosAnexoTres(datosAnexoTress: DatosAnexotressUno): void {
    this.update((state) => {
      const VALUE = { ...state.datosAnexoTress, ...datosAnexoTress };
      return { ...state, datosAnexoTress: VALUE };
    });
  }

  /**
   * Actualiza la propiedad `datosAnexoTressDos` en el store con los datos proporcionados.
   * Fusiona el estado existente de `datosAnexoTressDos` con los nuevos valores recibidos.
   *
   * @param datosAnexoTressDos - Objeto que contiene los nuevos datos a fusionar en `datosAnexoTressDos`.
   */
  setDatosAnexoTresDos(datosAnexoTressDos: DatosAnexotressUno): void {
    this.update((state) => {
      const VALUE = { ...state.datosAnexoTressDos, ...datosAnexoTressDos };
      return { ...state, datosAnexoTressDos: VALUE };
    });
  }

/**
 * Actualiza la lista de proyectos IMMEX en el estado agregando los elementos proporcionados.
 *
 * @param proyectoImmex - Arreglo de encabezados de proyectos IMMEX que se añadirán a la lista existente.
 */
// setProyectoImmexTablaLista(proyectoImmex: ProyectoImmexEncabezado[]): void {
//     this.update((state) => ({
//       ...state,
//       proyectoImmexTablaLista: [...state.proyectoImmexTablaLista, ...proyectoImmex],
//     }));
//   }

  setProyectoImmexTablaLista(proyectoImmex: ProyectoImmexEncabezado[]): void {
  this.update((state) => ({
    ...state,
    proyectoImmexTablaLista: [...proyectoImmex],
  }));
}

  setMontosDeInversionTablaDatos(montos: MontoDeInversion): void {
  this.update((state) => ({
    ...state,
    montosDeInversionTablaDatos: [...state.montosDeInversionTablaDatos, montos ],
  }));
}

removeMontosDeInversionTablaDatos(selected:MontoDeInversion[]): void {
  this.update(state => ({
    ...state,
    montosDeInversionTablaDatos: state.montosDeInversionTablaDatos.filter(data =>
      !selected.some(sel =>
        sel.PLANTA === data.PLANTA &&
        sel.TIPO === data.TIPO &&
        sel.CANTIDAD === data.CANTIDAD &&
        sel.DESCRIPCION === data.DESCRIPCION &&
        sel.MONTO === data.MONTO
      )
    )
  }));
}
/**
 * Actualiza la lista de capacidad instalada en el estado agregando los elementos proporcionados.
 *
 * @param CapacidadInstaladaTablaLista - Arreglo de objetos de tipo `CapacidadInstalada` que serán añadidos a la tabla de datos de capacidad instalada.
 */
setCapacidadInstaladaTableLista(CapacidadInstaladaTablaLista: CapacidadInstalada[]): void {
    this.update((state) => ({
      ...state,
      tablaDatosCapacidadInstalada: [...state.tablaDatosCapacidadInstalada, ...CapacidadInstaladaTablaLista],
    }));
  }

/**
 * Actualiza la lista de empleados directos en el estado agregando los nuevos empleados recibidos.
 *
 * @param empleados - Arreglo de objetos de tipo `Directos` para agregar a la lista existente.
 */
  setEmpleadosTablaDatos(empleados: Directos[]): void {
  this.update((state) => ({
    ...state,
    empleadosTablaDatos: [...state.empleadosTablaDatos, ...empleados ],
  }));
}

/**
 * Actualiza la lista de complementos de planta en el estado agregando los nuevos complementos recibidos.
 *
 * @param complementar - Arreglo de objetos de tipo `ComplementoDePlanta` para agregar a la lista existente.
 */
setComplementarPlantaDatos(complementar: ComplementoDePlanta[]): void {
  this.update((state) => ({
    ...state,
    complementarPlantaDatos: [...state.complementarPlantaDatos, ...complementar ],
  }));
}

/**
 * Actualiza la lista de estados de firmantes de complementar planta en el estado agregando los nuevos datos recibidos.
 *
 * @param complementarPlantaDatos - Arreglo de objetos de tipo `ComplementarPlantaState` para agregar a la lista existente.
 */
setComplementarPlantaState(complementarPlantaDatos: ComplementarPlantaState[]): void {
  this.update((state) => ({
    ...state,
    complementarFirmanteDatos: [...state.complementarFirmanteDatos, ...complementarPlantaDatos ],
  }));
}
}
