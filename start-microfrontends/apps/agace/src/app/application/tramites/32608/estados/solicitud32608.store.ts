import { AgregarMiembroEmpresaTabla, ControlInventariosTabla, DomiciliosRfcSolicitanteTabla, NumeroEmpleadosTabla } from '../models/oea-textil-registro.model';
import { EmpresaDelGrupo } from '../constants/datos-comunes.enum';
import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
import { TablaEnlaceOperativo } from '../models/enlace-operativo-tabla.model';
import { TransportistasTable } from '../constants/datos-comunes.enum';
/**
 * Interfaz que define las propiedades relacionadas con listas de datos
 * de empleados, domicilios, socios, y enlaces operativos.
 */
export interface Solicitud32608State {
  representanteRegistro: string;
  representanteRfc: string;
  representanteNombre: string;
  representanteApellidoPaterno: string;
  representanteApellidoMaterno: string;
  representanteTelefono: string;
  representanteCorreo: string;
  registro: string;
  rfc: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  ciudad: string;
  cargo: string;
  telefono: string;
  correo: string;
  suplente: boolean;
  enlaceOperativoData: TablaEnlaceOperativo[];
  sectorProductivo: string;
  sectorServicio: string;
  cumplimientoFiscalAduanero: string;
  autorizaOpinionSAT: string;
  cuentaConEmpleadosPropios: string;
  bimestreUltimo: string;
  numeroDeEmpleadas: string;
  retencionISRTrabajadores: string;
  pagoCuotasIMSS: string;
  cuentaConSubcontratacionEspecializada: string;
  registroPadronLFT: string;
  listadoSATArt69: string;
  listadoSATArt69B: string;
  listadoSATArt69BBis: string;
  certificadosSellosVigentes: string;
  infringioSupuestos17HBis: string;
  mediosContactoActualizadosBuzon: string;
  suspensionPadronImportadoresExportadores: string;
  archivoNacionales?: string;
  proveedores: string;
  domiciliosRegistrados: string;
  numeroEmpleadosBimestre: NumeroEmpleadosTabla[];
  DomiciliosRfcSolicitante: DomiciliosRfcSolicitanteTabla[],
  controlInventarios: ControlInventariosTabla[];
  querellaSATUltimos3Anios: string;
  ingresoInfoContableSAT: string;
  agregarMiembroEmpresa: AgregarMiembroEmpresaTabla[];
  manifests: boolean;
  bajoProtesta: boolean;
  sistemaControlInventariosArt59: string;


  /**
   * Indica si la empresa realiza operaciones de comercio exterior.
   * Valor booleano representado como string ('1' para Sí, '0' para No).
   */
  comercioExteriorRealizado: string;

  /**
   * Fecha en que se realizó el pago asociado a la solicitud.
   * Formato esperado: DD/MM/YYYY.
   */
  fechaDePago: string;

  /**
   * Fecha de inicio de las operaciones de comercio exterior de la empresa.
   * Formato esperado: DD/MM/YYYY.
   */
  fechaInicioComercio: string;

  /**
   * Indica si la empresa es parte de un grupo empresarial que realiza comercio exterior.
   * Valor booleano representado como string ('1' para Sí, '0' para No).
   */
  esParteGrupoComercioExterior: string;

  /**
   * RFC o clave operativa de la empresa del enlace operativo.
   * Identificador fiscal único de 12 o 13 caracteres.
   */
  rfcEnclaveOperativo: string;

  /**
   * RFC del enlace operativo obtenido automáticamente del servicio.
   * Campo de solo lectura que se llena al buscar por RFC.
   */
  enlaceOperativorfc: string;

  /**
   * Denominación social o razón social de la empresa del enlace operativo.
   * Nombre legal completo de la empresa registrada.
   */
  denominacionRazonsocial: string;

  /**
   * Domicilio fiscal completo de la empresa del enlace operativo.
   * Dirección registrada ante las autoridades fiscales.
   */
  domicilio: string;

  /**
   * Fecha de la última operación comercial registrada por la empresa.
   * Formato esperado: DD/MM/YYYY. Campo opcional.
   */
  inputfechaDeLaUltimaOperacion: string;

  /**
   * Indica si existe fusión o escisión con operaciones de comercio exterior.
   * Valor booleano representado como string ('1' para Sí, '0' para No).
   */
  fusionEscisionConOperacionExterior: string;

  /**
   * Indica si la empresa es extranjera con programa IMMEX.
   * Valor booleano representado como string ('1' para Sí, '0' para No).
   */
  empresaExtranjeraIMMEX: string;

  /**
   * Monto total en pesos mexicanos asociado a las operaciones.
   * Valor numérico representado como string.
   */
  monto: string;

  /**
   * Detalles de las operaciones bancarias relacionadas con la solicitud.
   * Información alfanumérica sobre transacciones financieras.
   */
  operacionesBancarias: string;

  /**
   * Llave de pago única para identificar la transacción.
   * Código alfanumérico generado por el sistema bancario.
   */
  llavePago: string;

  /**
   * Registro del esquema de certificación empresarial.
   * Indica si se autoriza o no el esquema ('1' para Sí Autorizo, '0' para No Autorizo).
   */
  registroEsquemaCertificacion: string;

  /**
   * Tipo de información de la empresa según su clasificación.
   * Indica si es información pública o privada ('1' para Pública, '0' para Privada).
   */
  tipoInformacionEmpresa: string;

  /**
   * Número de registro CAAT vigente del transportista.
   * Código de autorización para transportistas de carga.
   */
  ccat: string;

  /**
   * Lista de empresas del grupo comercial relacionadas con la solicitud.
   * Array que contiene objetos de tipo EmpresaDelGrupo con RFC, denominación, domicilio y fecha.
   */
  tablaDatos: EmpresaDelGrupo[];

  /**
   * Lista de transportistas autorizados para la operación.
   * Array que contiene objetos de tipo TransportistasTable con RFC, denominación, domicilio y CAAT.
   */
  transportistasLista: TransportistasTable[];
  autorizacionCBP: string;
  instalacionesCertificadasCBP: string;
  suspensionCancelacionCBP: string;
  cuentaConProgramaIMMEX: string; // Indica si cuenta con un programa IMMEX
  declaracionAnualISRRepresentantes: string; // Indica si los representantes han presentado la declaración anual del ISR
  registroEsquemaCertificacionIVAIEPS: string; // Registro del esquema de certificación IVA e IEPS
  rubroCertificacion: string; // Rubro de certificación asociado a la solicitud
  fechaFinVigenciaRubro: string; // Fecha de fin de vigencia del rubro de certificación
  numeroOficio: string; // Número de oficio asociado a la solicitud
  autorizacion100A: string; // Autorización 100A requerida para la solicitud
  opcionTrabajadores: boolean; // Opción de contar con trabajadores registrados ante el IMSS
  opcionActivosFijos?: boolean; // Opción de contar con activos fijos
  numeroEmpleadosIMSS?: string; // Número de empleados registrados ante el IMSS
  valorTotalDe?: string; // Valor total de activos fijos o mercancías, según el contexto
  sistemaControl?: string; // Sistema de control de inventarios
  modalidadProgramaIMMEX?: string; // Modalidad del programa IMMEX, si aplica
  numeroProgramaIMMEX?: string; // Número del programa IMMEX, si aplica
}

/**
 * Crea el estado inicial para `Solicitud32608State`.
 *
 * @returns El estado inicial con valores predeterminados.
 */
export function createInitialSolicitudState(): Solicitud32608State {
  return {

    representanteRegistro: '',
    representanteRfc: '',
    representanteNombre: '',
    representanteApellidoPaterno: '',
    representanteApellidoMaterno: '',
    representanteTelefono: '',
    representanteCorreo: '',
    registro: '',
    rfc: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    ciudad: '',
    cargo: '',
    telefono: '',
    correo: '',
    suplente: false,
    enlaceOperativoData: [],

    sectorProductivo: '',
    sectorServicio: '',
    cumplimientoFiscalAduanero: '',
    autorizaOpinionSAT: '',
    cuentaConEmpleadosPropios: '',
    bimestreUltimo: '',
    numeroDeEmpleadas: '',
    retencionISRTrabajadores: '',
    pagoCuotasIMSS: '',
    cuentaConSubcontratacionEspecializada: '',
    registroPadronLFT: '',
    listadoSATArt69: '',
    listadoSATArt69B: '',
    listadoSATArt69BBis: '',
    certificadosSellosVigentes: '',
    infringioSupuestos17HBis: '',
    mediosContactoActualizadosBuzon: '',
    suspensionPadronImportadoresExportadores: '',
    archivoNacionales: '',
    proveedores: '',
    domiciliosRegistrados: '',
    numeroEmpleadosBimestre: [],
    DomiciliosRfcSolicitante: [],
    controlInventarios: [],
    querellaSATUltimos3Anios: '',
    ingresoInfoContableSAT: '',
    agregarMiembroEmpresa: [],
    manifests: true,
    bajoProtesta: true,
    sistemaControlInventariosArt59: '',
    //---------------------------------------

    /**
     * Indica si la empresa realiza operaciones de comercio exterior.
     * Valor booleano representado como string ('1' para Sí, '0' para No).
     */
    comercioExteriorRealizado: '',

    /**
    * Fecha en que se realizó el pago asociado a la solicitud.
    * Formato esperado: DD/MM/YYYY.
    */
    fechaDePago: '',

    /**
    * Fecha de inicio de las operaciones de comercio exterior de la empresa.
    * Formato esperado: DD/MM/YYYY.
    */
    fechaInicioComercio: '',

    /**
    * Indica si la empresa es parte de un grupo empresarial que realiza comercio exterior.
    * Valor booleano representado como string ('1' para Sí, '0' para No).
    */
    esParteGrupoComercioExterior: '',

    /**
    * RFC o clave operativa de la empresa del enlace operativo.
    * Identificador fiscal único de 12 o 13 caracteres.
    */
    rfcEnclaveOperativo: '',

    /**
    * RFC del enlace operativo obtenido automáticamente del servicio.
    * Campo de solo lectura que se llena al buscar por RFC.
    */
    enlaceOperativorfc: '',

    /**
    * Denominación social o razón social de la empresa del enlace operativo.
    * Nombre legal completo de la empresa registrada.
    */
    denominacionRazonsocial: '',

    /**
    * Domicilio fiscal completo de la empresa del enlace operativo.
    * Dirección registrada ante las autoridades fiscales.
    */
    domicilio: '',

    /**
    * Fecha de la última operación comercial registrada por la empresa.
    * Formato esperado: DD/MM/YYYY. Campo opcional.
    */
    inputfechaDeLaUltimaOperacion: '',

    /**
    * Indica si existe fusión o escisión con operaciones de comercio exterior.
    * Valor booleano representado como string ('1' para Sí, '0' para No).
    */
    fusionEscisionConOperacionExterior: '',

    /**
    * Indica si la empresa es extranjera con programa IMMEX.
    * Valor booleano representado como string ('1' para Sí, '0' para No).
    */
    empresaExtranjeraIMMEX: '',

    /**
    * Monto total en pesos mexicanos asociado a las operaciones.
    * Valor numérico representado como string.
    */
    monto: '',

    /**
    * Detalles de las operaciones bancarias relacionadas con la solicitud.
    * Información alfanumérica sobre transacciones financieras.
    */
    operacionesBancarias: '',

    /**
    * Llave de pago única para identificar la transacción.
    * Código alfanumérico generado por el sistema bancario.
    */
    llavePago: '',

    /**
    * Registro del esquema de certificación empresarial.
    * Indica si se autoriza o no el esquema ('1' para Sí Autorizo, '0' para No Autorizo).
    */
    registroEsquemaCertificacion: '',

    /**
    * Tipo de información de la empresa según su clasificación.
    * Indica si es información pública o privada ('1' para Pública, '0' para Privada).
    */
    tipoInformacionEmpresa: '',

    /**
    * Número de registro CAAT vigente del transportista.
    * Código de autorización para transportistas de carga.
    */
    ccat: '',

    /**
    * Lista de empresas del grupo comercial relacionadas con la solicitud.
    * Array que contiene objetos de tipo EmpresaDelGrupo con RFC, denominación, domicilio y fecha.
    */
    tablaDatos: [],

    /**
    * Lista de transportistas autorizados para la operación.
    * Array que contiene objetos de tipo TransportistasTable con RFC, denominación, domicilio y CAAT.
    */
    transportistasLista: [],

    autorizacionCBP: '',
    instalacionesCertificadasCBP: '',
    suspensionCancelacionCBP: '',
    cuentaConProgramaIMMEX: '', // Indica si cuenta con un programa IMMEX
    declaracionAnualISRRepresentantes: '', // Indica si los representantes han presentado la declaración anual del ISR
    registroEsquemaCertificacionIVAIEPS: '', // Registro del esquema de certificación
    rubroCertificacion: '', // Rubro de certificación asociado a la solicitud
    fechaFinVigenciaRubro: '', // Fecha de fin de vigencia del rubro de certificación
    numeroOficio: '', // Número de oficio asociado a la solicitud
    autorizacion100A: '', // Autorización 100A requerida para la solicitud
    opcionTrabajadores: false, // Opción de contar con trabajadores registrados ante el IMSS
    opcionActivosFijos: false, // Opción de contar con activos fijos
    numeroEmpleadosIMSS: '', // Número de empleados registrados ante el IMSS
    valorTotalDe: '', // Valor total de activos fijos o mercancías, según el contexto
    sistemaControl: '', // Sistema de control de inventarios
    modalidadProgramaIMMEX: '', // Modalidad del programa IMMEX, si aplica
    numeroProgramaIMMEX: '', // Número del programa IMMEX, si aplica
  };
}
@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'solicitud32608',
  resettable: true,
})
/** Clase encargada de manejar el estado de 'Solicitud32608' mediante el uso de un store.
 *  Esta clase extiende de la clase 'Store', lo que permite la gestión centralizada del estado.
 */
export class Solicitud32608Store extends Store<Solicitud32608State> {
  /**
   * Constructor que inicializa el estado de la solicitud.
   * Utiliza la función `createInitialSolicitudState` para establecer el estado inicial.
   */
  constructor() {
    super(createInitialSolicitudState());
  }


  /**
   * Actualiza el estado del store con los valores proporcionados.
   * Valores parciales para actualizar el estado.
   */
  public actualizarEstado(valores: Partial<Solicitud32608State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }

}
