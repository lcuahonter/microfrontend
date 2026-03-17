import {
  ConfiguracionAporteColumna,
  ConfiguracionColumna,
  InputFecha,
  TablaCampoSeleccion,
} from '@libs/shared/data-access-user/src';
import {
  Domicilios,
  EnlaceOperativo,
  Inventarios,
  NumeroDeEmpleados,
  RecibirNotificaciones,
  SeccionSociosIC,
  TransportistasTable,
} from '../models/empresas-comercializadoras.model';
import { Instalaciones } from './agregar.model';

/**
 * Interface para representar un registro extraído del archivo Excel
 */
export interface RegistroExcel {
  id: number;
  nombre: string;
  descripcion: string;
}

/**
 * Interface para representar el libro de trabajo Excel
 */
export interface LibroTrabajoExcel {
  NombresHojas: string[];
  Hojas: Record<string, unknown>;
}

/**
 * Arreglo de objetos que representa los pasos de un proceso o trámite.
 * 
 * Cada objeto contiene:
 * - `indice`: Número que indica el orden del paso.
 * - `titulo`: Descripción del paso.
 * - `activo`: Indica si el paso está activo actualmente.
 * - `completado`: Indica si el paso ya ha sido completado.
 * 
 * Este arreglo se utiliza para controlar y mostrar el avance en la captura y gestión de solicitudes.
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
 * Texto informativo que se muestra al usuario cuando una solicitud ha sido registrada.
 * Indica que el número proporcionado es temporal y no tiene validez legal, 
 * sirviendo únicamente para identificar la solicitud hasta que se firme y se le asigne un folio oficial.
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/** Configuración de columnas para Recibir Notificaciones */
export const RECIBIR_NOTIFICACIONES_CONFIGURACION: ConfiguracionColumna<RecibirNotificaciones>[] =
  [
    {
      /** RFC del destinatario de la notificación */
      encabezado: 'RFC',
      clave: (item: RecibirNotificaciones) => item.rfc,
      orden: 1,
    },
    {
      /** CURP del destinatario de la notificación */
      encabezado: 'CURP',
      clave: (item: RecibirNotificaciones) => item.curp,
      orden: 2,
    },
    {
      /** Nombre del destinatario de la notificación */
      encabezado: 'Nombre',
      clave: (item: RecibirNotificaciones) => item.nombre,
      orden: 3,
    },
    {
      /** Primer apellido del destinatario */
      encabezado: 'Apellido paterno',
      clave: (item: RecibirNotificaciones) => item.apellidoPaterno,
      orden: 4,
    },
    {
      /** Segundo apellido del destinatario */
      encabezado: 'Apellido materno',
      clave: (item: RecibirNotificaciones) => item.apellidoMaterno,
      orden: 5,
    },
  ];
/**
 * Configuración de columnas para la tabla de Enlace Operativo.
 * Cada objeto en el arreglo define los detalles de una columna.
 * La clave indica el valor que se mostrará, y el orden define la posición de la columna en la tabla.
 */
export const ENLACE_OPERATIVO_CONFIGURACION: ConfiguracionColumna<EnlaceOperativo>[] =
  [
    /**
     * Configuración para la columna "RFC".
     * Muestra el RFC de cada enlace operativo.
     */
    {
      encabezado: 'RFC',
      clave: (item: EnlaceOperativo) => item.rfc,
      orden: 1,
    },

    /**
     * Configuración para la columna "Nombre".
     * Muestra el nombre de cada enlace operativo.
     */
    {
      encabezado: 'Nombre',
      clave: (item: EnlaceOperativo) => item.nombre,
      orden: 1,
    },

    /**
     * Configuración para la columna "Apellido Paterno".
     * Muestra el apellido paterno de cada enlace operativo.
     */
    {
      encabezado: 'Apellido Paterno',
      clave: (item: EnlaceOperativo) => item.apellidoPaterno,
      orden: 1,
    },

    /**
     * Configuración para la columna "Apellido Materno".
     * Muestra el apellido materno de cada enlace operativo.
     */
    {
      encabezado: 'Apellido Materno',
      clave: (item: EnlaceOperativo) => item.apellidoMaterno,
      orden: 1,
    },

    /**
     * Configuración para la columna "Ciudad o Estado de Residencia".
     * Muestra la ciudad o estado de residencia de cada enlace operativo.
     */
    {
      encabezado: 'Ciudad o Estado de Residencia',
      clave: (item: EnlaceOperativo) => item.ciudadestado || item.ciudad,
      orden: 1,
    },

    /**
     * Configuración para la columna "Cargo".
     * Muestra el cargo de cada enlace operativo.
     */
    {
      encabezado: 'Cargo o Puesto',
      clave: (item: EnlaceOperativo) => item.cargo,
      orden: 1,
    },

    /**
     * Configuración para la columna "Teléfono".
     * Muestra el número de teléfono de cada enlace operativo.
     */
    {
      encabezado: 'Teléfono',
      clave: (item: EnlaceOperativo) => item.telefono,
      orden: 1,
    },

    /**
     * Configuración para la columna "Correo".
     * Muestra el correo electrónico de cada enlace operativo.
     */
    {
      encabezado: 'Correo Electrónico',
      clave: (item: EnlaceOperativo) => item.correo,
      orden: 1,
    },

    /**
     * Configuración para la columna "Suplente".
     * Muestra si el enlace operativo es suplente.
     */
    {
      encabezado: 'Suplente',
      clave: (item: EnlaceOperativo) => item.suplente,
      orden: 1,
    },
  ];

/**
 * Etiqueta del campo de fecha de inicio de operaciones de comercio exterior.
 * Esta etiqueta se mostrará en el formulario junto al campo correspondiente.
 */
export const FECHA_DE_INICIO: InputFecha = {
  /**
   * Etiqueta del campo de fecha de inicio de operaciones de comercio exterior.
   * Esta etiqueta se mostrará en el formulario junto al campo correspondiente.
   */
  labelNombre: 'Fecha de Inicio de Operaciones de Comercio Exterior',

  /**
   * Indica si el campo es obligatorio.
   * En este caso, el campo no es obligatorio.
   */
  required: false,

  /**
   * Indica si el campo está habilitado.
   * En este caso, el campo está habilitado para la interacción del usuario.
   */
  habilitado: true,
};

/**
 * Etiqueta del campo de fecha de pago.
 * Esta etiqueta se mostrará junto al campo correspondiente en el formulario.
 */
export const FECHA_DE_PAGO: InputFecha = {
  /**
   * Etiqueta del campo de fecha de fin de vigencia.
   */
  labelNombre: '',
  /**
   * Indica si el campo es obligatorio.
   */
  required: false,
  /**
   * Indica si el campo está habilitado.
   */
  habilitado: true,
};

/**
 * Configuración de columnas para la tabla de Transportistas.
 * Cada objeto en el arreglo define los detalles de una columna.
 * La clave indica el valor que se mostrará, y el orden define la posición de la columna en la tabla.
 */
export const TRANSPORTISTAS_CONFIGURACION: ConfiguracionColumna<TransportistasTable>[] =
  [
    /**
     * Configuración para la columna "RFC".
     * Muestra el RFC de cada transportista.
     */
    {
      encabezado: 'RFC',
      clave: (item: TransportistasTable) => item.transportistaRFCModifTrans,
      orden: 1,
    },

    /**
     * Configuración para la columna "Denominación o Razón Social".
     * Muestra la razón social o denominación del transportista.
     */
    {
      encabezado: 'Denominación o Razón social',
      clave: (item: TransportistasTable) => item.transportistaRazonSocial,
      orden: 2,
    },

    /**
     * Configuración para la columna "Domicilio".
     * Muestra la dirección del transportista.
     */
    {
      encabezado: 'Domicilio',
      clave: (item: TransportistasTable) => item.transportistaDomicilio,
      orden: 3,
    },

    /**
     * Configuración para la columna "Registro CAAT vigente".
     * Muestra si el transportista tiene el registro CAAT vigente.
     */
    {
      encabezado: 'Registro CAAT vigente',
      clave: (item: TransportistasTable) => item.transportistaCaat,
      orden: 4,
    },
  ];

/**
 * Configuración de columnas para la tabla de Número de Empleados.
 * Cada objeto en el arreglo define los detalles de una columna.
 * La clave indica el valor que se mostrará y el orden define la posición de la columna en la tabla.
 */
export const NUMERO_DE_EMPLEADOS_CONFIGURACION: ConfiguracionColumna<NumeroDeEmpleados>[] =
  [
    /**
     * Configuración para la columna "Denominación Social".
     * Muestra la denominación social de la empresa.
     */
    {
      encabezado: 'Denominacion Social',
      clave: (item: NumeroDeEmpleados) => item.denominacion,
      orden: 1,
    },

    /**
     * Configuración para la columna "RFC".
     * Muestra el RFC de la empresa.
     */
    {
      encabezado: 'RFC',
      clave: (item: NumeroDeEmpleados) => item.RFC,
      orden: 2,
    },

    /**
     * Configuración para la columna "Número de Empleados".
     * Muestra la cantidad de empleados que tiene la empresa.
     */
    {
      encabezado: 'Numero de Empleados',
      clave: (item: NumeroDeEmpleados) => item.numeroDeEmpleados,
      orden: 3,
    },

    /**
     * Configuración para la columna "Bimestre".
     * Muestra el bimestre en el que se reporta la información.
     */
    {
      encabezado: 'Bimestre',
      clave: (item: NumeroDeEmpleados) => item.bimestre,
      orden: 4,
    },
  ];

/**
 * Configuración de las columnas para la visualización de la información de domicilios.
 * Cada columna corresponde a una propiedad de la entidad `Domicilios` y se utiliza para mostrarla en una tabla.
 */
export const DOMICILIOS_CONFIGURACION_COLUMNAS: ConfiguracionColumna<Domicilios>[] =
  [
    {
      /** Instalaciones principales de la empresa. */
      encabezado: '*Instalaciones principales',
      clave: (item: Domicilios) => item.instalacionPrincipal,
      orden: 1,
    },
    {
      /** Tipo de instalación de la empresa. */
      encabezado: 'Tipo de instalación',
      clave: (item: Domicilios) => item.tipoInstalacion,
      orden: 2,
    },
    {
      /** Entidad federativa donde está ubicada la instalación. */
      encabezado: 'Entidad federativa',
      clave: (item: Domicilios) => item.entidadFederativa,
      orden: 3,
    },
    {
      /** Municipio o delegación donde se encuentra la instalación. */
      encabezado: 'Municipio o delegación',
      clave: (item: Domicilios) => item.municipioDelegacion,
      orden: 4,
    },
    {
      /** Dirección completa del domicilio, incluyendo colonia, calle y número. */
      encabezado: 'Colonia, calle y número',
      clave: (item: Domicilios) => item.direccion,
      orden: 5,
    },
    {
      /** Código postal correspondiente al domicilio. */
      encabezado: 'Código postal',
      clave: (item: Domicilios) => item.codigoPostal,
      orden: 6,
    },
    {
      /** Registro del domicilio ante la Secretaría de Economía (SE) o el Servicio de Administración Tributaria (SAT). */
      encabezado: 'Registro ante SE/SAT',
      clave: (item: Domicilios) => item.registroSESAT,
      orden: 7,
    },
    {
      /** Proceso productivo que se realiza en la instalación. */
      encabezado: 'Proceso Productivo',
      clave: (item: Domicilios) => item.procesoProductivo,
      orden: 8,
    },
    {
      /** Indica si el domicilio acredita el uso y goce del inmueble. */
      encabezado: 'Acredita el uso y Goce del Inmueble',
      clave: (item: Domicilios) => item.acreditaInmueble,
      orden: 9,
    },
    {
      /** Indica si la instalación realiza operaciones de Comercio Exterior. */
      encabezado: 'Realiza operaciones de Comercio Exterior',
      clave: (item: Domicilios) => item.operacionesCExt,
      orden: 10,
    },
    {
      /** Reconocimiento mutuo para la instalación C-TPAT. */
      encabezado: 'Reconocimiento Mutuo (Instalación C-TPAT)',
      clave: (item: Domicilios) => item.instalacionCtpat,
      orden: 11,
    },
    {
      /** Perfil de la empresa correspondiente a la instalación. */
      encabezado: 'Perfil de la empresa',
      clave: (item: Domicilios) => item.instalacionPerfil,
      orden: 12,
    },
    {
      /** Perfil del Recinto Fiscalizado Estratégico. */
      encabezado: 'Perfil del Recinto Fiscalizado Estratégico',
      clave: (item: Domicilios) => item.instalacionPerfilRFE,
      orden: 13,
    },
    {
      /** Perfil del Auto Transportista Terrestre. */
      encabezado: 'Perfil del Auto Transportista Terrestre',
      clave: (item: Domicilios) => item.instalacionPerfilAuto,
      orden: 14,
    },
    {
      /** Perfil del Transportista Ferroviario. */
      encabezado: 'Perfil del Transportista Ferroviario',
      clave: (item: Domicilios) => item.instalacionPerfilFerro,
      orden: 15,
    },
    {
      /** Perfil del Recinto Fiscalizado. */
      encabezado: 'Perfil del Recinto Fiscalizado',
      clave: (item: Domicilios) => item.instalacionPerfilRf,
      orden: 16,
    },
    {
      /** Perfil de Mensajería y Paquetería. */
      encabezado: 'Perfil de Mensajería y Paquetería',
      clave: (item: Domicilios) => item.instalacionPerfilMensajeria,
      orden: 17,
    },
    {
      /** Perfil de Almacén General. */
      encabezado: 'Perfil Almacén General',
      clave: (item: Domicilios) => item.instalacionPerfilAlmacen,
      orden: 18,
    },
  ];

/**
 * Configuración de las columnas para la visualización de la información de inventarios.
 * Cada columna representa una propiedad de la entidad `Inventarios` y se configura con
 * detalles como la clave, el encabezado, y el tipo de entrada en la tabla.
 */
export const INVENTARIOS_CONFIGURACION: ConfiguracionAporteColumna<Inventarios>[] =
  [
    {
      /**
       * Encabezado que muestra el nombre del sistema o los datos para su identificación.
       * Esta columna muestra el nombre del sistema de inventarios.
       */
      encabezado: 'Nombre del sistema o datos para su identificación',
      llave: '',
      clave: (item: Inventarios) => item.nombre,
      orden: 1,
      opcionDeEntrada: TablaCampoSeleccion.NONE,
    },
    {
      /**
       * Encabezado que muestra el lugar de radicación del inventario.
       * Esta columna indica el lugar donde se encuentra ubicado el inventario.
       */
      encabezado: 'Lugar de radicación',
      llave: '',
      clave: (item: Inventarios) => item.lugarRadicacion,
      orden: 2,
      opcionDeEntrada: TablaCampoSeleccion.NONE,
    },
  ];

/** Configuración de columnas para Sección de Socios IC */
export const SECCION_SOCIOSIC_CONFIGURACION_COLUMNAS: ConfiguracionColumna<SeccionSociosIC>[] =
  [
    {
      /** Tipo de Persona */
      encabezado: 'Tipo de Persona',
      clave: (item: SeccionSociosIC) => item.tipoPersonaMuestra,
      orden: 1,
    },
    {
      /** Nombre completo */
      encabezado: 'Nombre',
      clave: (item: SeccionSociosIC) => item.nombreCompleto,
      orden: 1,
    },
    {
      /** RFC del Socio IC */
      encabezado: 'RFC',
      clave: (item: SeccionSociosIC) => item.rfc,
      orden: 1,
    },
    {
      /** Carácter en que actúa el Socio IC */
      encabezado: 'En su carácter de',
      clave: (item: SeccionSociosIC) => item.caracterDe,
      orden: 1,
    },
    {
      /** Carácter en que actúa el Socio IC */
      encabezado: 'Nacionalidad',
      clave: (item: SeccionSociosIC) => item.nacionalidad,
      orden: 1,
    },

    {
      /** ¿Obligado a tributar en México? */
      encabezado: 'Obligado a tributar en México',
      clave: (item: SeccionSociosIC) => item.tributarMexico,
      orden: 1,
    },
    {
      /** Nombre de la empresa */
      encabezado: 'Nombre de la empresa',
      clave: (item: SeccionSociosIC) => item.nombreEmpresa,
      orden: 1,
    },
  ];

  /**
   * Configuración de las columnas para la tabla de contenedores en el manifiesto.
   *
   * Cada objeto en el arreglo representa una columna de la tabla, especificando:
   * - `encabezado`: El nombre que se mostrará en la cabecera de la columna.
   * - `clave`: Función que extrae el valor correspondiente de un objeto `Instalaciones` para mostrar en la columna.
   * - `orden`: El orden en el que se mostrarán las columnas en la tabla.
   *
   * @type {ConfiguracionColumna<Instalaciones>[]}
   */
  export const ENCABEZADO_TABLA_CONTENEDOR_MANIFIESTO: ConfiguracionColumna<Instalaciones>[] = [
  { encabezado: 'Entidad federativa', clave: (articulo) => articulo.entidadFederativa, orden: 1 },
  { encabezado: 'Municipio o delegación', clave: (articulo) => articulo.municipio, orden: 2 },
  { encabezado: 'Colonia, calle y número', clave: (articulo) => articulo.coloniaCalleNumero, orden: 3 },
  { encabezado: 'Código postal', clave: (articulo) => articulo.codigoPostal, orden: 4 },
  { encabezado: 'Registro ante SE/SAT', clave: (articulo) => articulo.registroAduana, orden: 5 }
];
  