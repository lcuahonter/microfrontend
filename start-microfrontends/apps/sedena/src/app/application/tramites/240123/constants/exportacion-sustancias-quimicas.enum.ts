import { Proveedor } from "../../../shared/models/terceros-relacionados.model";

/**
 * @constant
 * @name PASOS
 * @type {Array}
 * @description Arreglo que define los pasos del trámite. Cada paso incluye un índice, título, 
 * y dos banderas: `activo` (indica si el paso está disponible para ser realizado) y `completado` 
 * (indica si el paso ya ha sido completado).
 * 
 * **Estructura de cada paso:**
 * - `indice`: Número que representa el orden del paso en el flujo del trámite.
 * - `titulo`: Título del paso, que describe la acción que debe realizar el usuario.
 * - `activo`: Booleano que indica si el paso está activo para ser realizado.
 * - `completado`: Booleano que indica si el paso ha sido completado.
 */
export const PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * @constant
 * @name TITULOMENSAJE
 * @type {string}
 * @description Título para el mensaje relacionado con la solicitud de exportación de sustancias químicas.
 * Este valor es utilizado para mostrar un mensaje de confirmación o notificación en el sistema.
 */
export const TITULOMENSAJE =
  'Solicitud Aviso de exportación de sustancias químicas';

/**
 * @constant
 * @name TEXTOS_REQUISITOS
 * @type {string}
 * @description Contiene los textos de los requisitos necesarios para el trámite de importación de sustancias químicas.
 * Actualmente se encuentra vacío, pero está preparado para almacenar información relevante sobre los requisitos necesarios.
 * 
 * **Uso esperado:** Se podrá llenar este campo con los requisitos específicos relacionados con el trámite.
 */
export const TEXTOS_REQUISITOS =
  '';

/**
 * @constant
 * @name ID_PROCEDIMIENTO
 * @type {number}
 * @description Identificador único del procedimiento asociado al trámite de exportación de sustancias químicas.
 * Este valor se utiliza para relacionar el trámite con su configuración y datos específicos en el sistema.
 */
export const ID_PROCEDIMIENTO = 240123;

/**
 * @constant
 * @name DATOS_ESTATICOS
 * @type {Proveedor[]}
 * @description Arreglo que contiene los datos estáticos de proveedores. Este valor se utiliza para prellenar 
 * información de proveedores en el sistema. Cada objeto de tipo `Proveedor` incluye datos como el nombre o razón 
 * social, RFC, CURP, teléfono, correo electrónico, dirección, entre otros.
 * 
 * **Estructura del objeto `Proveedor`:**
 * - `nombreRazonSocial`: Nombre o razón social del proveedor.
 * - `rfc`: Registro Federal de Contribuyentes del proveedor.
 * - `curp`: Clave Única de Registro de Población (opcional).
 * - `telefono`: Número de teléfono del proveedor.
 * - `correoElectronico`: Correo electrónico del proveedor.
 * - `calle`: Calle de la dirección del proveedor.
 * - `numeroExterior`: Número exterior de la dirección del proveedor.
 * - `numeroInterior`: Número interior de la dirección (si aplica).
 * - `pais`: País de residencia del proveedor.
 * - `colonia`: Colonia del proveedor.
 * - `municipioAlcaldia`: Municipio o alcaldía del proveedor.
 * - `localidad`: Localidad del proveedor.
 * - `entidadFederativa`: Estado o entidad federativa del proveedor.
 * - `estadoLocalidad`: Estado o localidad específica (si aplica).
 * - `codigoPostal`: Código postal de la dirección del proveedor.
 * 
 * **Uso:** Se utiliza para prellenar o autocompletar datos de proveedores en formularios o interfaces de usuario.
 */
export const DATOS_ESTATICOS: Proveedor[] = [
  {
    nombreRazonSocial: 'INTEGRADORA DEURBANIZACIONES SIGNUM S DE RL DE CV',
    rfc: 'AAL0409235E6',
    curp: '',
    telefono: '55-98764532',
    correoElectronico: 'vucem2.5@hotmail.com',
    calle: 'CAMINO',
    numeroExterior: '123',
    numeroInterior: '',
    pais: '',
    cve_pais: '',
    colonia: '',
    municipioAlcaldia: '',
    localidad: '',
    entidadFederativa: '',
    estadoLocalidad: '',
    codigoPostal: '',
  }
];
