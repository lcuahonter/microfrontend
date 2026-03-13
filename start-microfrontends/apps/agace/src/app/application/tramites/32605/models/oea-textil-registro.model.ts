/**
 * @interfaz
 * @nombre VehiculosTabla
 * @descripción
 * Define la estructura de los datos de la tabla de vehículos.
 * Contiene información básica sobre los vehículos, como marca, modelo y VIN.
 */
export interface NumeroEmpleadosTabla {
  /**
   * Identificador único del registro.
   */
  id: number;

  /**
   * Denominación social de la empresa o vehículo.
   */
  denominacionSocial: string;

  /**
   * RFC asociado.
   */
  rfc: string;

  /**
   * Número total de empleados registrados.
   */
  numeroDeEmpleados: number;

  /**
   * Bimestre al que corresponde la información.
   * Ejemplo: "Enero-Febrero".
   */
  bimestre: string;
}

/**
 * Interface para la respuesta de búsqueda de RFC
 */
export interface BuscarRfcResponse {
  /**
   * Código de estado devuelto por la API.
   * Generalmente sigue el estándar HTTP (200, 400, 500, etc.).
   */
  code: number;

  /**
   * Datos parciales obtenidos del RFC.
   * Se basan en la estructura de `NumeroEmpleadosTabla`.
   */
  data: Partial<NumeroEmpleadosTabla>;

  /**
   * Mensaje descriptivo de la respuesta.
   */
  message: string;
}

/**
 * Interface para la respuesta de la API
 * @template T - Tipo de datos que se espera en la respuesta.
 */
export interface ApiResponse<T> {
  /**
   * Código de estado devuelto por la API.
   * Generalmente sigue el estándar HTTP (200, 400, 500, etc.).
   */
  code: number;

  /**
   * Conjunto de datos devueltos por la API.
   */
  data: T[];

  /**
   * Mensaje descriptivo de la respuesta de la API.
   */
  message: string;
}

/**
 * Interface para las entidades federativas
 */
export interface EntidadFederativa {
  /**
   * Identificador único de la entidad federativa.
   */
  id: number;

  /**
   * Nombre o descripción de la entidad federativa.
   */
  descripcion: string;
}

/**
 * Representa la estructura de datos de una instalación
 * registrada por el solicitante.
 *
 * Contiene la información básica de ubicación y registro.
 */
export interface InstalacionesInterface {
  /**
   * Entidad federativa donde se localiza la instalación.
   */
  entidadFederativa: string;

  /**
   * Municipio o localidad de la instalación.
   */
  municipio: string;

  /**
   * Dirección completa de la instalación (calle, número, colonia, etc.).
   */
  direccion: string;

  /**
   * Código postal correspondiente a la ubicación de la instalación.
   */
  codigoPostal: string;

  /**
   * Registro asociado a la instalación.
   */
  registro: string;
}

/**
 * Representa la estructura de datos para los domicilios asociados
 * al RFC del solicitante.
 *
 * Esta interfaz define los atributos relacionados con las instalaciones,
 * su ubicación y los perfiles de la empresa vinculados al comercio exterior.
 */
export interface DomiciliosRfcSolicitanteTabla {
  /**
   * Identificador único del registro (opcional).
   */
  id?: number;

  /**
   * Nombre de las instalaciones principales.
   */
  InstalacionesPrincipales: string;

  /**
   * Tipo de instalación (ej. planta, bodega, oficina).
   */
  tipoInstalacion: string;

  /**
   * Entidad federativa donde se ubica la instalación.
   */
  entidadFederativa: string;

  /**
   * Municipio o alcaldía correspondiente a la instalación.
   */
  municipioAlcaldia: string;

  /**
   * Dirección detallada: colonia, calle y número.
   *
   * Nota: anteriormente estaba mal etiquetado como `codigoPostal` en la configuración de la tabla.
   */
  coloniaCalleNumero: string;

  /**
   * Código postal de la instalación.
   */
  codigoPostal: string;

  /**
   * Registro ante el SESAT.
   */
  registroSESAT: string;

  /**
   * Descripción del proceso productivo que se realiza en la instalación.
   */
  procesoProductivo: string;

  /**
   * Indica si se acredita el uso o goce del inmueble.
   */
  acreditaUsoGoceInmueble: string;

  /**
   * Indica si la instalación realiza actividades de comercio exterior.
   */
  realizaActividadComercioExterior: string;

  /**
   * Reconocimiento mutuo con el programa CTPAT.
   */
  reconocimientoMutuoCTPAT: string;

  /**
   * Perfil general de la empresa.
   */
  perfilEmpresa: string;

  /**
   * Perfil de recinto fiscalizado estratégico.
   */
  perfilRecintoFiscalizadoEstrategico: string;

  /**
   * Perfil de autotransportista terrestre.
   */
  perfilAutoTransportistaTerrestre: string;

  /**
   * Perfil de transportista ferroviario.
   */
  perfilTransportistaFerroviario: string;

  /**
   * Perfil de recinto fiscalizado.
   */
  perfilRecintoFiscalizado: string;

  /**
   * Perfil de empresa de mensajería y paquetería.
   */
  perfilMensajeriaYPaqueteria: string;

  /**
   * Perfil de almacén general de depósito.
   */
  perfilAlmacenGeneral: string;
}

/**
 * Representa la estructura de datos para el control de inventarios en la tabla.
 *
 * Esta interfaz define los campos necesarios para registrar la información
 * de los sistemas de control de inventarios utilizados por la empresa.
 */
export interface ControlInventariosTabla {
  /**
   * Identificador único del registro.
   */
  id: number;

  /**
   * Nombre del sistema de control de inventarios.
   */
  nombreSistema: string;

  /**
   * Lugar de radicación del sistema.
   */
  lugarRadicacion: string;

  /**
   * Indica si el sistema cumple con el Anexo 24.
   */
  cumpleAnexo24: boolean;
}

/**
 * Representa la estructura de datos para agregar un miembro a la tabla de empresa.
 *
 * Esta interfaz define los atributos requeridos y opcionales que describen
 * a un miembro, incluyendo información personal, fiscal y de empresa.
 */
export interface AgregarMiembroEmpresaTabla {
  /**
   * Identificador único del miembro.
   */
  id: number;

  /**
   * Tipo de persona (ej. Física o Moral).
   */
  tipoPersona: string;

  /**
   * Nombre del miembro.
   */
  nombre: string;

  /**
   * Nombre de la colección (opcional).
   */
  nombreColleccion?: string;

  /**
   * Apellido paterno del miembro.
   */
  apellidoPaterno: string;

  /**
   * Apellido materno del miembro.
   */
  apellidoMaterno: string;

  /**
   * Nombre completo del miembro.
   */
  nombreCompleto: string;

  /**
   * RFC (Registro Federal de Contribuyentes) del miembro.
   */
  rfc: string;

  /**
   * Carácter o rol que desempeña dentro de la empresa.
   */
  caracter: string;

  /**
   * Nacionalidad del miembro.
   */
  nacionalidad: string;

  /**
   * Indica si está obligado a tributar en México.
   */
  obligadoTributarMexico: string;

  /**
   * Nombre de la empresa asociada al miembro.
   */
  nombreEmpresa: string;
}
