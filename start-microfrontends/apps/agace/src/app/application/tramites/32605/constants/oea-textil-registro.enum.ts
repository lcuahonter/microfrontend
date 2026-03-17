import {
  AgregarMiembroEmpresaTabla,
  ControlInventariosTabla,
  DomiciliosRfcSolicitanteTabla,
  InstalacionesInterface,
  NumeroEmpleadosTabla,
} from '../models/oea-textil-registro.model';

/**
 * Objeto que contiene varias notas utilizadas en la aplicación.
 *
 * Cada nota proporciona información o instrucciones específicas:
 */
export const NOTA = {
  /**
   * @property {string} REQUISITO_OBLIGATORIO_PARA_ACCEDER_NOTA
   * Mensaje que indica que es obligatorio cumplir con la regla 7.1.1. de las RGCE
   * para poder acceder al Registro en el Esquema de Certificación de Empresas.
   */
  REQUISITO_OBLIGATORIO_PARA_ACCEDER_NOTA:
    'Es un requisito obligatorio para acceder al Registro en el Esquema de Certificación de Empresas, de conformidad con la regla 7.1.1. de las RGCE.',
  /**
   * @property {string} CONFIRMACION_NUMEROEMPLEADOS
   * Mensaje de confirmación mostrado al guardar correctamente los datos de empleados.
   */
  CONFIRMACION_NUMEROEMPLEADOS: 'Datos guardados correctamente',
  /*
   * @property {string} DOMICILIO_REGISTRADOS
   * Nota que informa sobre la visualización de los domicilios registrados
   * ante la Secretaría de Economía en caso de contar con un programa IMMEX activo,
   * así como la posibilidad de agregar otros relacionados con el RFC del solicitante.
   */
  DOMICILIO_REGISTRADOS:
    '<strong>Nota:</strong> De contar con un programa IMMEX activo y vigente al momento de ingresar la solicitud, se mostraran los domicilios registrados ante la Secretaria de Economía. Así mismo, podrá incluir otros domicilios que se encuentren relacionados con el RFC del solicitante, dando click en el boton "Agregar" y seleccionado la Entidad Federativa.',
  /**
   * @property {string} EMPLEADO_REQUISITO_RGCE
   * Mensaje que establece que es requisito obligatorio contar con empleados
   * (propios o subcontratados) para acceder al Registro en el Esquema de Certificación
   * de Empresas, conforme a la regla 7.1.1. de las RGCE.
   */
  EMPLEADO_REQUISITO_RGCE:
    'Es un requisito obligatorio el contar con algún tipo de empleado, ya sea propio o subcontratado para acceder al Registro en el Esquema de Certificación de Empresas, de conformidad con la regla 7.1.1. de las RGCE.',

  /**
   * @property {string} DEBE_CAPTURAR
   * Mensaje de advertencia que indica que todos los campos obligatorios deben ser capturados.
   */
  DEBE_CAPTURAR: 'Debe capturar todos los datos marcados como obligatorios.',
  /*
   * @property {string} CUMPLE_ANEXO24
   * Instrucción para indicar si se cuenta con un sistema de control de inventarios
   * de acuerdo con las disposiciones del Anexo 24.
   */
  CUMPLE_ANEXO24:
    'Indique, si cuenta con un sistema de control de inventarios de conformidad con las disposiciones previstas por el Anexo 24.',
  /**
   * @property {string} SECTOR_PRODUCTIVO
   * Nota que aclara que, en caso de no encuadrar en los sectores o servicios
   * de los catálogos, se debe seleccionar la opción más cercana a las actividades
   * de la empresa.
   */
  SECTOR_PRODUCTIVO:
    '<strong>Nota:</strong> Si no encuadra en los sectores o los servicios de los catálogos, deberá seleccionar el más cercano a sus actividades.',
};

/**
 * Mensaje genérico de validación.
 *
 * Se utiliza cuando el usuario no ha proporcionado información obligatoria.
 */
export const MENSAJE_DE_VALIDACION =
  'No se ha proporcionado información que es requerida';

/**
 * Matriz de opciones para botones de radio.
 *
 * Cada objeto representa una opción de botón de radio con:
 * - `label`: El texto mostrado a la usuaria.
 * - `value`: El valor correspondiente de la opción.
 */
export const OPCIONES_DE_BOTON_DE_RADIO = [
  {
    label: 'Sí',
    value: '1',
  },
  {
    label: 'No',
    value: '0',
  },
];

/**
 * Matriz de datos para la tabla de número de empleados.
 *
 * Cada objeto define un encabezado, una clave para acceder al valor del objeto,
 * y un orden para la visualización en la tabla.
 */
export const NUMERO_EMPLEADOS_TABLA_DATOS = [
  {
    encabezado: 'Denominacion Social',
    clave: (item: NumeroEmpleadosTabla): string => item.denominacionSocial,
    orden: 1,
  },
  {
    encabezado: 'RFC',
    clave: (item: NumeroEmpleadosTabla): string => item.rfc,
    orden: 2,
  },
  {
    encabezado: 'Numero de Empleados',
    clave: (item: NumeroEmpleadosTabla): number => item.numeroDeEmpleados,
    orden: 3,
  },
  {
    encabezado: 'Bimestre',
    clave: (item: NumeroEmpleadosTabla): string => item.bimestre,
    orden: 4,
  },
];

/**
 * Matriz de datos para la tabla de instalaciones.
 *
 * Cada objeto define un encabezado, una clave para acceder al valor del objeto,
 * y un orden para la visualización en la tabla.
 */
export const INSTALACIONES_TABLA_DATOS = [
  {
    encabezado: 'Entidad Federativa',
    clave: (item: InstalacionesInterface): string => item.entidadFederativa,
    orden: 1,
  },
  {
    encabezado: 'Municipio o delegación',
    clave: (item: InstalacionesInterface): string => item.municipio,
    orden: 2,
  },
  {
    encabezado: 'Colonia, calle y número',
    clave: (item: InstalacionesInterface): string => item.direccion,
    orden: 3,
  },
  {
    encabezado: 'Código postal',
    clave: (item: InstalacionesInterface): string => item.codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Registro ante SE/SAT',
    clave: (item: InstalacionesInterface): string => item.registro,
    orden: 5,
  },
];

/**
 * Matriz de datos para la tabla de domicilios RFC del solicitante.
 *
 * Cada objeto define un encabezado, una clave para acceder al valor del objeto,
 * y un orden para la visualización en la tabla.
 */
export const DOMICILIOS_RFC_SOLICITANTE_TABLA_DATOS = [
  {
    encabezado: '*Instalaciones principales',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.InstalacionesPrincipales,
    orden: 1,
  },
  {
    encabezado: '*Tipo de instalación',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.tipoInstalacion,
    orden: 2,
  },
  {
    encabezado: 'Entidad federativa',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.entidadFederativa,
    orden: 3,
  },
  {
    encabezado: 'Municipio o delegación',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.municipioAlcaldia,
    orden: 4,
  },
  {
    encabezado: 'Colonia, calle y número',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.coloniaCalleNumero,
    orden: 5,
  },
  {
    encabezado: 'Código Postal',
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.codigoPostal,
    orden: 6,
  },
  {
    encabezado: 'Registro ante SE/SAT',
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.registroSESAT,
    orden: 7,
  },
  {
    encabezado: 'Proceso Productivo',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.procesoProductivo,
    orden: 8,
  },
  {
    encabezado: 'Acredita el uso y Goce del Inmueble',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.acreditaUsoGoceInmueble,
    orden: 9,
  },
  {
    encabezado: 'Realiza operaciones de Comercio Exterior',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.realizaActividadComercioExterior,
    orden: 10,
  },
  {
    encabezado: 'Reconocimiento Mutuo (Instalación CTPAT)',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.reconocimientoMutuoCTPAT,
    orden: 11,
  },
  {
    encabezado: 'Perfil de la empresa',
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.perfilEmpresa,
    orden: 12,
  },
  {
    encabezado: 'Perfil del Recinto Fiscalizado Estrategico',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.perfilRecintoFiscalizadoEstrategico,
    orden: 13,
  },
  {
    encabezado: 'Perfil del Auto Transportista Terrestre',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.perfilAutoTransportistaTerrestre,
    orden: 14,
  },
  {
    encabezado: 'Perfil del Transportista Ferroviario',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.perfilTransportistaFerroviario,
    orden: 15,
  },
  {
    encabezado: 'Perfil del Recinto Fiscalizado',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.perfilRecintoFiscalizado,
    orden: 16,
  },
  {
    encabezado: 'Perfil de Mensajeria y Paqueteria',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.perfilMensajeriaYPaqueteria,
    orden: 17,
  },
  {
    encabezado: 'Perfil Almace General',
    clave: (item: DomiciliosRfcSolicitanteTabla): string =>
      item.perfilAlmacenGeneral,
    orden: 18,
  },
];

/**
 * Configuración de la tabla de control de inventarios.
 *
 * Define los encabezados de las columnas, el valor a mostrar para cada
 * registro de la tabla y el orden de visualización.
 */
export const CONTROL_INVESTARIOS_TABLA_DATOS = [
  {
    /**
     * Columna que muestra el nombre del sistema o datos de identificación.
     */
    encabezado: 'Nombre del sistema o datos para su identificación',
    clave: (item: ControlInventariosTabla): string => item.nombreSistema,
    orden: 1,
  },
  {
    /**
     * Columna que muestra el lugar de radicación del sistema.
     */
    encabezado: 'Lugar de radicación',
    clave: (item: ControlInventariosTabla): string => item.lugarRadicacion,
    orden: 2,
  },
  {
    /**
     * Columna que indica si el sistema de inventarios cumple con las
     * disposiciones del Anexo 24.
     *
     * Muestra "Sí" cuando `cumpleAnexo24` es `true`, de lo contrario "No".
     */
    encabezado:
      'Indique, si cuenta con un sistema de control de inventarios de conformidad con las disposiciones previstas por el Anexo 24.',
    clave: (item: ControlInventariosTabla): string => {
      const CHECKED_TEXT = item.cumpleAnexo24 ? 'Sí' : 'No';
      return `${CHECKED_TEXT}`;
    },
    orden: 3,
    isHtml: true,
  },
];

/**
 * Configuración de la tabla de miembros de la empresa.
 *
 * Define los encabezados, el valor asociado a cada columna y el orden
 * en el que deben mostrarse dentro de la tabla dinámica.
 */
export const EMPRESA_MIEMBRO_TABLA_DATOS = [
  {
    /**
     * Columna que muestra el tipo de persona (física o moral).
     */
    encabezado: 'Tipo de Persona',
    clave: (item: AgregarMiembroEmpresaTabla): string => item.tipoPersona,
    orden: 1,
  },
  {
    /**
     * Columna que muestra el nombre o la colección asociada.
     */
    encabezado: 'Nombre',
    clave: (item: AgregarMiembroEmpresaTabla): string =>
      item.nombreColleccion ?? '',
    orden: 2,
  },
  {
    /**
     * Columna que muestra el RFC del miembro de la empresa.
     */
    encabezado: 'RFC',
    clave: (item: AgregarMiembroEmpresaTabla): string => item.rfc,
    orden: 3,
  },
  {
    /**
     * Columna que indica el carácter en el que participa dentro de la empresa.
     */
    encabezado: 'En su carácter de',
    clave: (item: AgregarMiembroEmpresaTabla): string => item.caracter,
    orden: 4,
  },
  {
    /**
     * Columna que muestra la nacionalidad del miembro.
     */
    encabezado: 'Nacionalidad',
    clave: (item: AgregarMiembroEmpresaTabla): string => item.nacionalidad,
    orden: 5,
  },
  {
    /**
     * Columna que indica si el miembro está obligado a tributar en México.
     */
    encabezado: 'Obligado a tributar en México',
    clave: (item: AgregarMiembroEmpresaTabla): string =>
      item.obligadoTributarMexico,
    orden: 6,
  },
  {
    /**
     * Columna que muestra el nombre de la empresa asociada.
     */
    encabezado: 'Nombre de la empresa',
    clave: (item: AgregarMiembroEmpresaTabla): string => item.nombreEmpresa,
    orden: 7,
  },
];
