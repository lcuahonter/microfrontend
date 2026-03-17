import { AnexoEncabezado, AnexoUnoEncabezado, DatosAnexotressUno, DatosComplimento, ProveedorClienteTabla, ProyectoImmexEncabezado } from '../../../shared/models/nuevo-programa-industrial.model';
import { AnnexoDosTres, AnnexoUno } from '../models/nuevo-programa-industrial.model';
import { FederatariosEncabezado, PlantasDisponibles, PlantasImmex } from '../../../shared/models/federatarios-y-plantas.model';
import { AnexoDosEncabezado } from '../../../shared/models/nuevo-programa-industrial.model';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogoPaises } from '@libs/shared/data-access-user/src';
import { DatosComplimentos } from '../../../shared/models/complimentos.model';
import { DatosEmpresaExtranjera} from '../models/nuevo-programa-industrial.model';
import { DatosSubcontratista } from '../../../shared/models/empresas-subfabricanta.model';
import { EmpressaSubFabricantePlantas } from '../../../shared/models/empresas-subfabricanta.model';
import { Injectable } from '@angular/core';
import { PlantasSubfabricante } from '../../../shared/models/empresas-subfabricanta.model';
import { Servicio } from '../models/nuevo-programa-industrial.model';
import { ServicioInmex } from '../models/nuevo-programa-industrial.model';
import { Servicios } from '../models/nuevo-programa-industrial.model';
import { SociaoAccionistas } from '../../../shared/models/complimentos.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

import { AnexoFraccionAnarelaria, AnexoUnoProducto, ProveedorCliente, ProyectoImmex } from '../../../shared/models/complimentos-seccion.model';
import { ComplementarPlantaState, ComplementoDePlanta, MontoDeInversion } from '../../../shared/constantes/complementar-planta.enum';
import { CapacidadInstalada } from '../../../shared/constantes/capacidad-instalada.enum';
import { Directos } from '../../../shared/constantes/empleados.enum';

/**
 * Representa el estado de Tramite80101 en la aplicación.
 * 
 * @interface Tramite80101State
 * 
 * @property {Servicios} infoRegistro - Información del registro de servicios.
 * @property {Catalogo[]} aduanaDeIngreso - Lista de aduanas de ingreso disponibles.
 * @property {Servicio[]} datosImmex - Datos relacionados con el programa IMMEX.
 * @property {ServicioInmex[]} datos - Información detallada de servicios IMMEX.
 * @property {Catalogo} aduanaDeIngresoSelecion - Aduana de ingreso seleccionada.
 * @property {{ [key: string]: boolean }} formaValida - Validación de formularios por clave.
 * @property {ServicioInmex[]} empresas - Lista de empresas relacionadas con IMMEX.
 * @property {Servicio[]} servicios - Lista de servicios disponibles.
 * @property {string} rfcEmpresa - RFC de la empresa.
 * @property {string} numeroPrograma - Número del programa IMMEX.
 * @property {string} tiempoPrograma - Duración del programa IMMEX.
 * @property {CatalogoPaises[]} paisesOrigen - Lista de países de origen.
 * @property {DatosEmpresaExtranjera[]} datosEmpresaExtranjera - Información de empresas extranjeras.
 * @property {DatosEmpresaExtranjera} formaEmpresaExtranjera - Detalles de la empresa extranjera seleccionada.
 * @property {DatosComplimentos} datosComplimentos - Información de complementos relacionados.
 * @property {SociaoAccionistas[]} tablaDatosComplimentos - Tabla de datos de socios accionistas nacionales.
 * @property {SociaoAccionistas[]} tablaDatosComplimentosExtranjera - Tabla de datos de socios accionistas extranjeros.
 * @property {EmpressaSubFabricantePlantas} empressaSubFabricantePlantas - Información de subfabricantes y plantas.
 * @property {AnnexoDosTres} annexoDosTres - Información del anexo dos y tres.
 * @property {AnnexoUno} annexoUno - Información del anexo uno.
 * @property {number} indicePrevioRuta - Índice previo de la ruta seleccionada.
 * @property {FederatariosEncabezado[]} tablaDatosFederatarios - Tabla de datos de fedatarios públicos.
 */
export interface Tramite80101State {
  /** Identificador de la solicitud, puede ser nulo si aún no se ha creado. */
  idSolicitud: number | null;
  infoRegistro: Servicios;
  aduanaDeIngreso: Catalogo[];
  datosImmex: Servicio[];
  datos: ServicioInmex[];
  aduanaDeIngresoSelecion: Catalogo;
  formaValida: { [key: string]: boolean };
  empresas: ServicioInmex[];
  servicios: Servicio[];
  rfcEmpresa: string;
  numeroPrograma: string;
  tiempoPrograma: string;
  paisesOrigen: CatalogoPaises[];
  datosEmpresaExtranjera: DatosEmpresaExtranjera[];
  formaEmpresaExtranjera: DatosEmpresaExtranjera;

  datosComplimentos: DatosComplimentos;
  
  /**
   * Datos complementarios relacionados con el trámite.
   */
  datosComplimento: DatosComplimento;

  
  /**
   * Datos complementarios relacionados con el trámite.
   */
  datosComplimentoDos: DatosComplimento;

  tablaDatosComplimentos: SociaoAccionistas[];
  tablaDatosComplimentosExtranjera: SociaoAccionistas[];

  /** Contiene los datos del primer anexo Tress. */
  datosAnexoTress: DatosAnexotressUno;
  /** Contiene los datos del segundo anexo Tress. */
  datosAnexoTressDos: DatosAnexotressUno;

  empressaSubFabricantePlantas: EmpressaSubFabricantePlantas;
  annexoDosTres: AnnexoDosTres,
  annexoUno: AnnexoUno,
  
  indicePrevioRuta: number;
  tablaDatosFederatarios: FederatariosEncabezado[]
  datosFederatarios: FederatariosEncabezado;
  /**
   * Información detallada de plantas IMMEX.
   */
  plantasImmexTablaLista: PlantasImmex[];
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
   * Información detallada del estado de firmantes de complementar planta en la tabla.
   */
    complementarFirmanteDatos: ComplementarPlantaState[];
  /** 
   * Información detallada de plantas disponibles. 
   */
  plantasDisponiblesTablaLista: PlantasDisponibles[];

  /**
   * Información detallada de plantas IMMEX.
   */
  proyectoImmexTablaLista: ProyectoImmexEncabezado[];

  /**
 * Información detallada de los complementos de planta en la tabla.
 */
  complementarPlantaDatos: ComplementoDePlanta[];

/**
 * Información de los firmantes relacionada con los complementos de planta.
 */
  firmantesDatos: ComplementarPlantaState[];

/**
 * Información de los montos de inversión registrados en la tabla.
 */
  montosInversionDatos: MontoDeInversion[];

/**
 * Información de los empleados directos registrados en la tabla.
 */
  empleadosDatos: Directos[];
  
/**
 * así como información de proveedores y capacidad instalada.
 */
  tablaDatosCapacidadInstalada: CapacidadInstalada[];

  /**
   * Almacena los datos del FormControl del componente complimentos.
   * Contiene todos los valores del formulario reactivo.
   */
  formControlData: { [key: string]: any };

  /**
   * Almacena los datos del FormControl del componente anexo-uno-seccion.
   * Contiene todos los valores del formulario reactivo del anexo uno.
   */
  anexoFormControlData: { [key: string]: any };

  /**
   * Almacena los datos del FormControl del componente federatarios-y-planta.
   * Contiene todos los valores del formulario reactivo de federatarios y plantas.
   */
  federatariosFormControlData: { [key: string]: any };
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
  datosComplimento: {
    fraccionArancelaria: "",
    descripcion: "",
  },
  datosComplimentoDos: {
    fraccionArancelaria: "",
    descripcion: "",
  },
  datosAnexoTress: {
    fraccionArancelaria: "",
    descripcion: ""
  },
  datosAnexoTressDos: {
    fraccionArancelaria: "",
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
      fechaExpedicion: '15/02/2024',
      aceptarObligacionFiscal: '',
    },
    formaModificaciones: {
      nombreDelFederatario: '',
      nombreDeNotaria: '',
      estado: '',
      nombreDeActa: '',
      fechaDeActa: '',
      rfc: '',
      nombreDeRepresentante: 'Maria Lopez',
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
    proveedorClienteDatosTabla: [],
    proveedorClienteDatosTablaDos: [],
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
  firmantesDatos: [],
  montosInversionDatos: [],
  empleadosDatos: [],
  formControlData: {},
  anexoFormControlData: {},
  federatariosFormControlData: {}
};

/**
 * AmpliacionServicios Store
 * @export
 * @class Tramite80102Store
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite-80102', resettable: true })
export class Tramite80101Store extends Store<Tramite80101State> {
  constructor() {
    super(INITIAL_AMPLIACION_SERVICIOS_STATE);
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
        datos.some((datos) => ele.id !== datos.id)
      );
      return {
        ...state,
        tablaDatosComplimentos: DOMICILIOS,
      };
    });
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
        tablaDatosComplimentosExtranjera: [...state.tablaDatosComplimentosExtranjera, DATOS],
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
      const DOMICILIOS = [...state.tablaDatosComplimentosExtranjera].filter((ele) =>
        datos.some((datos) => ele.id !== datos.id)
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
  setAnnexoDosTableLista(anexoDosTablaLista:AnexoEncabezado[]):void{
    this.update((state) => ({
      ...state,
      annexoDosTres: {
        ...state.annexoDosTres,
        anexoDosTablaLista: anexoDosTablaLista,
      }
     
    }));
  }

  /**
   * Establece la lista de la tabla Anexo Tres en el estado de la tienda.
   *
   * @param anexoTresTablaLista - Arreglo de objetos de tipo `AnexoEncabezado` que representa la nueva lista de la tabla Anexo Tres.
   */
  setAnnexoTresTableLista(anexoTresTablaLista:AnexoEncabezado[]):void{
    this.update((state) => ({
      ...state,
      annexoDosTres: {
        ...state.annexoDosTres,
        anexoTresTablaLista: anexoTresTablaLista,
      }
     
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
   * Establece los datos necesarios para la navegación en el estado de la aplicación.
   * 
   * @param datosParaNavegar - Objeto que contiene los datos para navegar, 
   * puede ser de tipo `AnexoUnoEncabezado` o `AnexoDosEncabezado`.
   * 
   * @remarks
   * Este método actualiza el estado de la aplicación añadiendo o modificando 
   * los datos de navegación en el objeto `annexoUno`.
   */
  setDatosParaNavegar(datosParaNavegar:AnexoUnoEncabezado | AnexoDosEncabezado):void{
    this.update((state) => ({
      ...state,
      annexoUno: {
        ...state.annexoUno,
        datosParaNavegar: datosParaNavegar,
      }
     
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
  setImportarDatosTabla(importarDatosTabla:AnexoUnoEncabezado[]):void{
    this.update((state) => ({
      ...state,
      annexoUno: {
        ...state.annexoUno,
        importarDatosTabla: importarDatosTabla,
      }
     
    }));
  }

  /**
   * Establece los datos de la tabla para exportar y actualiza el estado correspondiente.
   *
   * @param exportarDatosTabla - Un arreglo de objetos de tipo `AnexoDosEncabezado` que contiene los datos a exportar.
   */
  setExportarDatosTabla(exportarDatosTabla:AnexoDosEncabezado[]):void{
    this.update((state) => ({
      ...state,
      annexoUno: {
        ...state.annexoUno,
        exportarDatosTabla: exportarDatosTabla,
      }
     
    }));
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
   * Agrega un nuevo elemento de tipo `FederatariosEncabezado` a la lista `tablaDatosFederatarios` 
   * en el estado actual de la tienda.
   *
   * @param formaFederatarios - El objeto de tipo `FederatariosEncabezado` que se añadirá 
   * a la lista `tablaDatosFederatarios`.
   */
  setFederatarios(formaFederatarios: FederatariosEncabezado): void {
    this.update((state) => ({
      ...state,
      tablaDatosFederatarios: [...state.tablaDatosFederatarios, formaFederatarios],
    }));
  }

  /**
   * Agrega un nuevo conjunto de datos a la tabla de plantas disponibles en el estado.
   * 
   * @param plantas - Un arreglo de objetos de tipo `PlantasDisponibles` que se agregarán a la tabla.
   */
  setPlantasDisponiblesTablaLista(plantas: PlantasDisponibles[]): void {
    this.update((state) => ({
      ...state,
      plantasDisponiblesTablaLista: [...state.plantasDisponiblesTablaLista, ...plantas],
    }));
  }

  /**
   * Agrega un nuevo conjunto de datos a la tabla de plantas IMMEX en el estado.
   * 
   * @param plantasImmex - Un arreglo de objetos de tipo `PlantasImmex` que se agregarán a la tabla.
   */
  setPlantasImmexTablaLista(plantasImmex: PlantasImmex[]): void {
    if (plantasImmex.length === 0) {
      this.update((state) => ({
        ...state,
        plantasImmexTablaLista: [...plantasImmex],
      }));
    }else{
      this.update((state) => ({
        ...state,
        plantasImmexTablaLista: [...state.plantasImmexTablaLista, ...plantasImmex],
      }));
    }
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
  agregarTablaDatosComplimentos(datos: SociaoAccionistas): void {
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
  agregarTablaDatosComplimentosExtranjera(datos: SociaoAccionistas): void {
    this.update((state) => {
      const DATOS = {
        ...datos,
        id: crypto.randomUUID().toString(),
      };
      return {
        ...state,
        tablaDatosComplimentosExtranjera: [...state.tablaDatosComplimentosExtranjera, DATOS],
      };
    });
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
   * Establece los datos del FormControl del componente complimentos.
   * 
   * @param formControlData - Objeto que contiene todos los valores del FormControl
   */
  public setFormControlData(formControlData: { [key: string]: any }): void {
    this.update((state) => ({ 
      ...state, 
      formControlData: { ...state.formControlData, ...formControlData }
    }));
  }

  /**
   * Actualiza un campo específico del FormControl.
   * 
   * @param fieldName - Nombre del campo a actualizar
   * @param fieldValue - Valor del campo
   */
  public updateFormControlField(fieldName: string, fieldValue: any): void {
    this.update((state) => ({ 
      ...state, 
      formControlData: { 
        ...state.formControlData, 
        [fieldName]: fieldValue 
      }
    }));
  }

  /**
   * Limpia todos los datos del FormControl.
   */
  public clearFormControlData(): void {
    this.update((state) => ({ ...state, formControlData: {} }));
  }

  /**
   * Establece los datos del FormControl del componente anexo-uno-seccion.
   * 
   * @param anexoFormControlData - Objeto que contiene todos los valores del FormControl del anexo
   */
  public setAnexoFormControlData(anexoFormControlData: { [key: string]: any }): void {
    this.update((state) => ({ 
      ...state, 
      anexoFormControlData: { ...state.anexoFormControlData, ...anexoFormControlData }
    }));
  }

  /**
   * Actualiza un campo específico del FormControl del anexo.
   * 
   * @param fieldName - Nombre del campo a actualizar
   * @param fieldValue - Valor del campo
   */
  public updateAnexoFormControlField(fieldName: string, fieldValue: any): void {
    this.update((state) => ({ 
      ...state, 
      anexoFormControlData: { 
        ...state.anexoFormControlData, 
        [fieldName]: fieldValue 
      }
    }));
  }

  /**
   * Limpia todos los datos del FormControl del anexo.
   */
  public clearAnexoFormControlData(): void {
    this.update((state) => ({ ...state, anexoFormControlData: {} }));
  }

  /**
   * Establece los datos del FormControl del componente federatarios-y-planta.
   * 
   * @param federatariosFormControlData - Objeto que contiene todos los valores del FormControl de federatarios
   */
  public setFederatariosFormControlData(federatariosFormControlData: { [key: string]: any }): void {
    this.update((state) => ({ 
      ...state, 
      federatariosFormControlData: { ...state.federatariosFormControlData, ...federatariosFormControlData }
    }));
  }

  /**
   * Actualiza un campo específico del FormControl de federatarios.
   * 
   * @param fieldName - Nombre del campo a actualizar
   * @param fieldValue - Valor del campo
   */
  public updateFederatariosFormControlField(fieldName: string, fieldValue: any): void {
    this.update((state) => ({ 
      ...state, 
      federatariosFormControlData: { 
        ...state.federatariosFormControlData, 
        [fieldName]: fieldValue 
      }
    }));
  }

  /**
   * Limpia todos los datos del FormControl de federatarios.
   */
  public clearFederatariosFormControlData(): void {
    this.update((state) => ({ ...state, federatariosFormControlData: {} }));
  }

  /**
 * Actualiza la lista de proyectos IMMEX en el estado agregando los elementos proporcionados.
 *
 * @param proyectoImmex - Arreglo de encabezados de proyectos IMMEX que se añadirán a la lista existente.
 */
setProyectoImmexTablaLista(proyectoImmex: ProyectoImmexEncabezado[]): void {
    this.update((state) => ({
      ...state,
      proyectoImmexTablaLista: [...state.proyectoImmexTablaLista, ...proyectoImmex],
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
 * Agrega datos complementarios de planta al estado existente.
 * 
 * @param complementar - Lista de datos complementarios de planta a agregar.
 */
setComplementarPlantaDatos(complementar: ComplementoDePlanta[]): void {
  this.update((state) => ({
    ...state,
    complementarPlantaDatos: [...state.complementarPlantaDatos, ...complementar ],
  }));
}

/**
 * Agrega datos de firmantes al estado existente.
 * 
 * @param firmantes - Lista de datos de firmantes a agregar.
 */
setFirmantesDatos(firmantes: ComplementarPlantaState[]): void {
  this.update((state) => ({
    ...state,
    firmantesDatos: [...state.firmantesDatos, ...firmantes],
  }));
}

/**
 * Agrega datos de montos de inversión al estado existente.
 * 
 * @param montosInversion - Lista de montos de inversión a agregar.
 */
setMontosInversionDatos(montosInversion: MontoDeInversion[]): void {
  this.update((state) => ({
    ...state,
    montosInversionDatos: [...state.montosInversionDatos, ...montosInversion],
  }))
}

/**
 * Agrega datos de empleados directos al estado existente.
 * 
 * @param empleados - Lista de empleados directos a agregar.
 */
setEmpleadosDatos(empleados: Directos[]): void {
  this.update((state) => ({
    ...state,
    empleadosDatos: [...state.empleadosDatos, ...empleados]
  }))
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
}
