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
} from '../models/solicitud.model';

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
      encabezado: 'Primer apellido',
      clave: (item: RecibirNotificaciones) => item.apellidoPaterno,
      orden: 4,
    },
    {
      /** Segundo apellido del destinatario */
      encabezado: 'Segundo apellido',
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
     * Muestra la clave de la ciudad o estado de residencia de cada enlace operativo.
     */
    {
      encabezado: 'Ciudad o Estado de Residencia',
      clave: (item: EnlaceOperativo) => item.claveCiudad,
      orden: 1,
    },

    /**
     * Configuración para la columna "Ciudad".
     * Muestra la ciudad de cada enlace operativo.
     */
    {
      encabezado: 'Ciudad',
      clave: (item: EnlaceOperativo) => item.ciudad,
      orden: 1,
    },

    /**
     * Configuración para la columna "Cargo".
     * Muestra el cargo de cada enlace operativo.
     */
    {
      encabezado: 'Cargo',
      clave: (item: EnlaceOperativo) => item.cargo,
      orden: 1,
    },

    /**
     * Configuración para la columna "Teléfono".
     * Muestra el número de teléfono de cada enlace operativo.
     */
    {
      encabezado: 'teléfono',
      clave: (item: EnlaceOperativo) => item.telefono,
      orden: 1,
    },

    /**
     * Configuración para la columna "Correo".
     * Muestra el correo electrónico de cada enlace operativo.
     */
    {
      encabezado: 'Correo',
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

    /**
     * Configuración para la columna "Calle".
     * Muestra la calle de la dirección de cada enlace operativo.
     */
    {
      encabezado: 'Calle',
      clave: (item: EnlaceOperativo) => item.calle,
      orden: 1,
    },

    /**
     * Configuración para la columna "Número Exterior".
     * Muestra el número exterior de la dirección de cada enlace operativo.
     */
    {
      encabezado: 'Numero Exterior',
      clave: (item: EnlaceOperativo) => item.numeroExterior,
      orden: 1,
    },

    /**
     * Configuración para la columna "Número Interior".
     * Muestra el número interior de la dirección de cada enlace operativo.
     */
    {
      encabezado: 'Numero Interior',
      clave: (item: EnlaceOperativo) => item.numeroInterior,
      orden: 1,
    },

    /**
     * Configuración para la columna "Colonia".
     * Muestra la colonia de la dirección de cada enlace operativo.
     */
    {
      encabezado: 'Colonia',
      clave: (item: EnlaceOperativo) => item.colonia,
      orden: 1,
    },

    /**
     * Configuración para la columna "Código Postal".
     * Muestra el código postal de la dirección de cada enlace operativo.
     */
    {
      encabezado: 'Codigo Postal',
      clave: (item: EnlaceOperativo) => item.codigoPostal,
      orden: 1,
    },

    /**
     * Configuración para la columna "Localidad".
     * Muestra la localidad de la dirección de cada enlace operativo.
     */
    {
      encabezado: 'Localidad',
      clave: (item: EnlaceOperativo) => item.localidad,
      orden: 1,
    },

    /**
     * Configuración para la columna "Delegación o Municipio".
     * Muestra la delegación o municipio de la dirección de cada enlace operativo.
     */
    {
      encabezado: 'Delegacion Municipio',
      clave: (item: EnlaceOperativo) => item.delegacionMunicipio,
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
  labelNombre: 'Fecha de pago',
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
      clave: (item: TransportistasTable) => item.rfc,
      orden: 1,
    },

    /**
     * Configuración para la columna "Denominación o Razón Social".
     * Muestra la razón social o denominación del transportista.
     */
    {
      encabezado: 'Denominación o Razón social',
      clave: (item: TransportistasTable) => item.razonSocial,
      orden: 2,
    },

    /**
     * Configuración para la columna "Domicilio".
     * Muestra la dirección del transportista.
     */
    {
      encabezado: 'Domicilio',
      clave: (item: TransportistasTable) => item.domicilio,
      orden: 3,
    },

    /**
     * Configuración para la columna "Registro CAAT vigente".
     * Muestra si el transportista tiene el registro CAAT vigente.
     */
    {
      encabezado: 'Registro CAAT vigente',
      clave: (item: TransportistasTable) => item.caat,
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
      encabezado: 'Instalaciones principales',
      clave: (item: Domicilios) => item.instalacionPrincipal,
      orden: 1,
    },
    {
      /** Tipo de instalación de la empresa. */
      encabezado: 'Tipo de instalación',
      clave: (item: Domicilios) => item.tipoInstalacion,
      orden: 1,
    },
    {
      /** Entidad federativa donde está ubicada la instalación. */
      encabezado: 'Entidad federativa',
      clave: (item: Domicilios) => item.entidadFederativa,
      orden: 1,
    },
    {
      /** Municipio o delegación donde se encuentra la instalación. */
      encabezado: 'Municipio o delegación',
      clave: (item: Domicilios) => item.municipioDelegacion,
      orden: 1,
    },
    {
      /** Dirección completa del domicilio, incluyendo colonia, calle y número. */
      encabezado: 'Colonia, calle y número',
      clave: (item: Domicilios) => item.direccion,
      orden: 1,
    },
    {
      /** Código postal correspondiente al domicilio. */
      encabezado: 'Código postal',
      clave: (item: Domicilios) => item.codigoPostal,
      orden: 1,
    },
    {
      /** Registro del domicilio ante la Secretaría de Economía (SE) o el Servicio de Administración Tributaria (SAT). */
      encabezado: 'Registro ante SE/SAT',
      clave: (item: Domicilios) => item.registroSESAT,
      orden: 1,
    },
    {
      /** Proceso productivo que se realiza en la instalación. */
      encabezado: 'Proceso Productivo',
      clave: (item: Domicilios) => item.procesoProductivo,
      orden: 1,
    },
    {
      /** Indica si el domicilio acredita el uso y goce del inmueble. */
      encabezado: 'Acredita el uso y Goce del Inmueble',
      clave: (item: Domicilios) => item.acreditaInmueble,
      orden: 1,
    },
    {
      /** Indica si la instalación realiza operaciones de Comercio Exterior. */
      encabezado: 'Realiza operaciones de Comercio Exterior',
      clave: (item: Domicilios) => item.operacionesCExt,
      orden: 1,
    },
    {
      /** Reconocimiento mutuo para la instalación C-TPAT. */
      encabezado: 'Reconocimiento Mutuo (Instalación C-TPAT)',
      clave: (item: Domicilios) => item.instalacionCtpat,
      orden: 1,
    },
    {
      /** Perfil de la empresa correspondiente a la instalación. */
      encabezado: 'Perfil de la empresa',
      clave: (item: Domicilios) => item.instalacionPerfil,
      orden: 1,
    },
    {
      /** Perfil del Recinto Fiscalizado Estratégico. */
      encabezado: 'Perfil del Recinto Fiscalizado Estratégico',
      clave: (item: Domicilios) => item.instalacionPerfilRFE,
      orden: 1,
    },
    {
      /** Perfil del Auto Transportista Terrestre. */
      encabezado: 'Perfil del Auto Transportista Terrestre',
      clave: (item: Domicilios) => item.instalacionPerfilAuto,
      orden: 1,
    },
    {
      /** Perfil del Transportista Ferroviario. */
      encabezado: 'Perfil del Transportista Ferroviario',
      clave: (item: Domicilios) => item.instalacionPerfilFerro,
      orden: 1,
    },
    {
      /** Perfil del Recinto Fiscalizado. */
      encabezado: 'Perfil del Recinto Fiscalizado',
      clave: (item: Domicilios) => item.instalacionPerfilRf,
      orden: 1,
    },
    {
      /** Perfil de Mensajería y Paquetería. */
      encabezado: 'Perfil de Mensajería y Paquetería',
      clave: (item: Domicilios) => item.instalacionPerfilMensajeria,
      orden: 1,
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
    {
      /**
       * Encabezado que pregunta si se cuenta con un sistema de control de inventarios
       * conforme a las disposiciones del Anexo 24.
       * Esta columna contiene un campo de tipo checkbox.
       */
      encabezado:
        'Indique, si cuenta con un sistema de control de inventarios de conformidad con las disposiciones previstas por el Anexo 24.',
      llave: '',
      clave: (item: Inventarios) => item.anexo24,
      orden: 3,
      opcionDeEntrada: TablaCampoSeleccion.CHECKBOX,
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
