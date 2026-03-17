import { AgregarMiembroEmpresaTabla, ControlInventariosTabla, DomiciliosRfcSolicitanteTabla, InstalacionesInterface, NumeroEmpleadosTabla } from "../models/oea-textil-registro.model";

/**
 * Objeto que contiene varias notas utilizadas en la aplicación.
 *
 * Cada nota proporciona información o instrucciones específicas:
 */
export const NOTA = {
  REQUISITO_OBLIGATORIO_PARA_ACCEDER_NOTA: 'Es un requisito obligatorio para acceder al Registro en el Esquema de Certificación de Empresas, de conformidad con la regla 7.1.1. de las RGCE.',
  CONFIRMACION_NUMEROEMPLEADOS: 'Datos guardados correctamente',
  DOMICILIO_REGISTRADOS: '<strong>Nota:</strong> Be contar con un programa IMMEX activo y vigente al momento de ingresar la solicitud, se mostrarán lus domicilios registradus ante la Secretaria de Ecoonmia. Así mismo, podrá incluir utres domicilios que se encuentren relacionados con el RFC del solicitante, dando click en el botón "Agregar y seleccionado la Entidad Federativa.',
  EMPLEADO_REQUISITO_RGCE: 'Es un requisito obligatorio el contar con algún tipo de empleado, ya sea propio o subcontratado para acceder al Registro en el Esquema de Certificación de Empresas, de conformidad con la regla 7.1.1. de las RGCE.',
  DEBE_CAPTURAR: 'Debe capturar todos los datos marcados como obligatorios.',
  CUMPLE_ANEXO24: 'Indique, si cuenta con un sistema de control de inventarios de conformidad con las disposiciones previstas por el Anexo 24.',
  SECTOR_PRODUCTIVO: '<strong>Nota:</strong> Si no encuadra en los sectores o los servicios de los catálogos, deberá seleccionar el más cercano a sus actividades.',
  REQUISITO_OBLIGATORIO_ESQUEMA_CERTIFICACION: 'Este requisito es obligatorio para acceder al Registro en el Esquema de Certificación de Empresas, de conformidad con las reglas de las RGCE.'
};

export const MENSAJE_DE_VALIDACION = "No se ha proporcionado información que es requerida"

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
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.InstalacionesPrincipales,
    orden: 1,
  },
  {
    encabezado: '*Tipo de instalación',
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.tipoInstalacion,
    orden: 2,
  },
  {
    encabezado: 'Entidad federativa',
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.entidadFederativa,
    orden: 3,
  },
  {
    encabezado: 'Municipio o delegación',
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.municipioAlcaldia,
    orden: 4,
  },
  {
    encabezado: 'Colonia, calle y número',
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.coloniaCalleNumero,
    orden: 5,
  },
  {
    encabezado: 'Código Postal',
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.codigoPostal,
    orden: 6,
  },
  {
    encabezado: 'Registro SE/SAT',
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.registroSESAT,
    orden: 7,
  },
  {
    encabezado: 'Proceso Productivo',
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.procesoProductivo,
    orden: 8,
  },
  {
    encabezado: 'Acredita el uso y Goce del Inmueble',
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.acreditaUsoGoceInmueble,
    orden: 9,
  },
   {
    encabezado: 'Realiza operaciones de Comercio Exterior',
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.realizaActividadComercioExterior,
    orden: 10,
  },
  {
    encabezado: 'Reconocimiento Mutuo (Instalación CTPAT)',
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.reconocimientoMutuoCTPAT,
    orden: 11,
  },
  {
    encabezado: 'Perfil de la empresa',
    clave: (item: DomiciliosRfcSolicitanteTabla): string => item.perfilEmpresa,
    orden: 12,
  },
];

export const CONTROL_INVESTARIOS_TABLA_DATOS = [
  {
    encabezado: 'Nombre del sistema o datos para su identificación',
    clave: (item: ControlInventariosTabla): string => item.nombreSistema,
    orden: 1,
  },
  {
    encabezado: 'Lugar de radicación',
    clave: (item: ControlInventariosTabla): string => item.lugarRadicacion,
    orden: 2,
  },
  {
    encabezado: 'Indique, si cuenta con un sistema de control de inventarios de conformidad con las disposiciones previstas por el Anexo 24.',
    clave: (item: ControlInventariosTabla): string => {
      const CHECKED_TEXT = item.cumpleAnexo24 ? 'Sí' : 'No';
      return `${CHECKED_TEXT}`;
    },
    orden: 3,
    isHtml: true,
  },
];

export const EMPRESA_MIEMBRO_TABLA_DATOS = [
  {
    encabezado: 'Tipo de Persona',
    clave: (item: AgregarMiembroEmpresaTabla): string => item.tipoPersona,
    orden: 1,
  },
  {
    encabezado: 'Nombre',
    clave: (item: AgregarMiembroEmpresaTabla): string => item.nombreColleccion ?? '',
    orden: 2,
  },
  {
    encabezado: 'RFC',
    clave: (item: AgregarMiembroEmpresaTabla): string => item.rfc,
    orden: 3,
  },
  {
    encabezado: 'En su carácter de',
    clave: (item: AgregarMiembroEmpresaTabla): string => item.caracter,
    orden: 4,
  },
  {
    encabezado: 'Nacionalidad',
    clave: (item: AgregarMiembroEmpresaTabla): string => item.nacionalidad,
    orden: 5,
  },
  {
    encabezado: 'Obligado a tributar en México',
    clave: (item: AgregarMiembroEmpresaTabla): string => item.obligadoTributarMexico,
    orden: 6,
  },
   {
    encabezado: 'Nombre de la empresa',
    clave: (item: AgregarMiembroEmpresaTabla): string => item.nombreEmpresa,
    orden: 7,
  },
  
];