import { CatalogosSelect, ConfiguracionColumna } from "@libs/shared/data-access-user/src";
import { ControladasTable, Domicillio, Empresa, EnlaceOperativo, EntidadFederativa, Querella, RecibirNotificaciones, TransportistasTable } from "../models/adace.model";

/** Opciones para el radio tipo 01. */
export const RADIO_01 = [
  { label: 'Sí', value: 'si' },
  { label: 'No', value: 'no' },
];

/** Opciones para el radio tipo 07. */
export const RADIO_07 = [
  { label: 'Sí', value: 'si' },
  { label: 'No', value: 'no' },
];

/** Opciones para el radio tipo 08. */
export const RADIO_08 = [
  { label: 'Sí', value: 'si' },
  { label: 'No', value: 'no' },
];

/** Opciones para el radio de autorización. */
export const RADIO_AUTORIZO = [
  { label: 'Si Autorizo', value: 'si_autorizo' },
  { label: 'No Autorizo', value: 'no_autorizo' },
];

/** Opciones para el radio de clasificación. */
export const RADIO_CLASIFICACION = [
  { label: 'Pública', value: 'publica' },
  { label: 'Privada', value: 'privada' },
];

/** Configuración para la fecha inicial. */
export const FECHA_INICIAL = {
  /** Etiqueta para la fecha inicial. */
  labelNombre: 'Fecha de elaboración del dictamen',
  /** Indica si el campo es obligatorio. */
  required: true,
  /** Indica si el campo está habilitado. */
  habilitado: true,
};

/** Configuración para la fecha de pago. */
export const FECHA_PAGO = {
  /** Etiqueta para la fecha de pago. */
  labelNombre: 'Fecha de pago',
  /** Indica si el campo es obligatorio. */
  required: false,
  /** Indica si el campo está habilitado. */
  habilitado: true,
};

/** Catálogo de sector productivo. */
export const SECTOR_PRODUCTIVO: CatalogosSelect = {
  /** Etiqueta para el catálogo de años. */
  labelNombre: 'Sector Productivo',
  /** Indica si el campo es obligatorio. */
  required: true,
  /** Texto de la primera opción del catálogo. */
  primerOpcion: 'Selecciona un valor',
  /** Lista de elementos del catálogo. */
  catalogos: [],
};

/** Catálogo de servicio. */
export const SERVICIO_CATALOGO: CatalogosSelect = {
  /** Etiqueta para el catálogo de meses. */
  labelNombre: 'Servicio',
  /** Indica si el campo es obligatorio. */
  required: true,
  /** Texto de la primera opción del catálogo. */
  primerOpcion: 'Selecciona un valor',
  /** Lista de elementos del catálogo. */
  catalogos: [],
};

/** Catálogo de biomestre. */
export const BIOMESTRE_CATALOGO: CatalogosSelect = {
  /** Etiqueta para el catálogo de bimestres. */
  labelNombre: 'Biomestre',
  /** Indica si el campo es obligatorio. */
  required: true,
  /** Texto de la primera opción del catálogo. */
  primerOpcion: 'Selecciona un valor',
  /** Lista de elementos del catálogo. */
  catalogos: [],
};

/** Catálogo de domicilio. */
export const DOMICILIO_CATALOGO: CatalogosSelect = {
  /** Etiqueta para el catálogo de Domicillio. */
  labelNombre: '',
  /** Indica si el campo es obligatorio. */
  required: true,
  /** Texto de la primera opción del catálogo. */
  primerOpcion: 'Selecciona un valor',
  /** Lista de elementos del catálogo. */
  catalogos: [],
};

/** Catálogo de tipo de instalación. */
export const TIPO_INSTALACION_CATALOGO: CatalogosSelect = {
  labelNombre: 'Tipo de instalación',
  /** Indica si el campo es obligatorio. */
  required: true,
  /** Texto de la primera opción del catálogo. */
  primerOpcion: 'Selecciona un valor',
  /** Lista de elementos del catálogo. */
  catalogos: [],
};

/** Catálogo de entidad federativa. */
export const ENTIDAD_CATALOGO: CatalogosSelect = {
  labelNombre: 'Entidad Federativa',
  /** Indica si el campo es obligatorio. */
  required: true,
  /** Texto de la primera opción del catálogo. */
  primerOpcion: 'Selecciona un valor',
  /** Lista de elementos del catálogo. */
  catalogos: [],
};

/** Configuración de columnas para la tabla de domicilio. */
export const DOMICILLIO_TABLA: ConfiguracionColumna<Domicillio>[] = [
  {
    /** Instalaciones principales de la empresa. */
    encabezado: 'Instalaciones principales',
    clave: (item: Domicillio) => item.instalacionPrincipal,
    orden: 1,
  },
  {
    /** Tipo de instalación de la empresa. */
    encabezado: 'Tipo de instalación',
    clave: (item: Domicillio) => item.tipoInstalacion,
    orden: 2,
  },
  {
    /** Entidad federativa donde está ubicada la instalación. */
    encabezado: 'Entidad federativa',
    clave: (item: Domicillio) => item.entidadFederativa,
    orden: 3,
  },
  {
    /** Municipio o delegación donde se encuentra la instalación. */
    encabezado: 'Municipio o delegación',
    clave: (item: Domicillio) => item.municipioDelegacion,
    orden: 4,
  },
  {
    /** Dirección completa del domicilio, incluyendo colonia, calle y número. */
    encabezado: 'Colonia, calle y número',
    clave: (item: Domicillio) => item.direccion,
    orden: 5,
  },
  {
    /** Código postal correspondiente al domicilio. */
    encabezado: 'Código postal',
    clave: (item: Domicillio) => item.codigoPostal,
    orden: 6,
  },
  {
    /** Registro del domicilio ante la Secretaría de Economía (SE) o el Servicio de Administración Tributaria (SAT). */
    encabezado: 'Registro ante SE/SAT',
    clave: (item: Domicillio) => item.registroSESAT,
    orden: 7,
  },
  {
    /** Proceso productivo que se realiza en la instalación. */
    encabezado: 'Proceso Productivo',
    clave: (item: Domicillio) => item.procesoProductivo,
    orden: 8,
  },
  {
    /** Indica si el domicilio acredita el uso y goce del inmueble. */
    encabezado: 'Acredita el uso y Goce del Inmueble',
    clave: (item: Domicillio) => item.acreditaInmueble,
    orden: 9,
  },
  {
    /** Indica si la instalación realiza operaciones de Comercio Exterior. */
    encabezado: 'Realiza operaciones de Comercio Exterior',
    clave: (item: Domicillio) => item.operacionesCExt,
    orden: 10,
  },
  {
    /** Reconocimiento mutuo para la instalación C-TPAT. */
    encabezado: 'Reconocimiento Mutuo (Instalación C-TPAT)',
    clave: (item: Domicillio) => item.instalacionCtpat,
    orden: 11,
  },
  {
    /** Perfil de la empresa correspondiente a la instalación. */
    encabezado: 'Perfil de la empresa',
    clave: (item: Domicillio) => item.instalacionPerfil,
    orden: 12,
  },
  {
    /** Perfil del Recinto Fiscalizado Estratégico. */
    encabezado: 'Perfil del Recinto Fiscalizado Estratégico',
    clave: (item: Domicillio) => item.instalacionPerfilRFE,
    orden: 13,
  },
  {
    /** Perfil del Auto Transportista Terrestre. */
    encabezado: 'Perfil del Auto Transportista Terrestre',
    clave: (item: Domicillio) => item.instalacionPerfilAuto,
    orden: 14,
  },
  {
    /** Perfil del Transportista Ferroviario. */
    encabezado: 'Perfil del Transportista Ferroviario',
    clave: (item: Domicillio) => item.instalacionPerfilFerro,
    orden: 15,
  },
  {
    /** Perfil del Recinto Fiscalizado. */
    encabezado: 'Perfil del Recinto Fiscalizado',
    clave: (item: Domicillio) => item.instalacionPerfilRf,
    orden: 16,
  },
  {
    /** Perfil de Mensajería y Paquetería. */
    encabezado: 'Perfil de Mensajería y Paquetería',
    clave: (item: Domicillio) => item.instalacionPerfilMensajeria,
    orden: 17,
  },
];

/** Configuración de columnas para la tabla de entidad federativa. */
export const ENTIDAD_TABLA: ConfiguracionColumna<EntidadFederativa>[] = [
  {
    /** Entidad federativa donde está ubicada la instalación. */
    encabezado: 'Entidad federativa',
    clave: (item: EntidadFederativa) => item.entidadFederativa,
    orden: 1,
  },
  {
    /** Municipio o delegación donde se encuentra la instalación. */
    encabezado: 'Municipio o delegación',
    clave: (item: EntidadFederativa) => item.municipioDelegacion,
    orden: 2,
  },
  {
    /** Dirección completa del domicilio, incluyendo colonia, calle y número. */
    encabezado: 'Colonia, calle y número',
    clave: (item: EntidadFederativa) => item.direccion,
    orden: 3,
  },
  {
    /** Código postal correspondiente al domicilio. */
    encabezado: 'Código postal',
    clave: (item: EntidadFederativa) => item.codigoPostal,
    orden: 4,
  },
  {
    /** Registro del domicilio ante la Secretaría de Economía (SE) o el Servicio de Administración Tributaria (SAT). */
    encabezado: 'Registro ante SE/SAT',
    clave: (item: EntidadFederativa) => item.registroSESAT,
    orden: 5,
  }
];

/** Configuración de columnas para la tabla de querella. */
export const QUERELLA_TABLA: ConfiguracionColumna<Querella>[] = [
  {
    /** Instalaciones principales de la empresa. */
    encabezado: 'Nombre del sistema o datos para su identificación',
    clave: (item: Querella) => item.sistemaIdentificacion,
    orden: 1,
  },
  {
    /** Tipo de instalación de la empresa. */
    encabezado: 'Lugar de radicación',
    clave: (item: Querella) => item.lugarRadicacion,
    orden: 2,
  },
  {
    /** Entidad federativa donde está ubicada la instalación. */
    encabezado: 'Indique, si cuenta con un sistema de control de inventarios de conformidad con las disposiciones previstas por el Anexo 24.',
    clave: (item: Querella) => item.indiqueSiCuenta,
    orden: 3,
  }
];

/** Configuración de columnas para la tabla de empresa. */
export const EMPRESA_TABLA: ConfiguracionColumna<Empresa>[] =
  [
    {
      /** Tipo de Persona */
      encabezado: 'Tipo de Persona',
      clave: (item: Empresa) => item.tipoPersonaMuestra,
      orden: 1,
    },
    {
      /** Nombre completo */
      encabezado: 'Nombre',
      clave: (item: Empresa) => item.nombreCompleto,
      orden: 2,
    },
    {
      /** RFC del Socio IC */
      encabezado: 'RFC',
      clave: (item: Empresa) => item.rfc,
      orden: 3,
    },
    {
      /** Carácter en que actúa el Socio IC */
      encabezado: 'En su carácter de',
      clave: (item: Empresa) => item.caracterDe,
      orden: 4,
    },
    {
      /** Carácter en que actúa el Socio IC */
      encabezado: 'Nacionalidad',
      clave: (item: Empresa) => item.nacionalidad,
      orden: 5,
    },

    {
      /** ¿Obligado a tributar en México? */
      encabezado: 'Obligado a tributar en México',
      clave: (item: Empresa) => item.tributarMexico,
      orden: 6,
    },
    {
      /** Nombre de la empresa */
      encabezado: 'Nombre de la empresa',
      clave: (item: Empresa) => item.nombreEmpresa,
      orden: 7,
    },
  ];

/** Configuración de columnas para la tabla de enlace operativo. */
export const ENLACE_OPERATIVO_TABLA: ConfiguracionColumna<EnlaceOperativo>[] =
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
      orden: 2,
    },

    /**
     * Configuración para la columna "Apellido Paterno".
     * Muestra el apellido paterno de cada enlace operativo.
     */
    {
      encabezado: 'Apellido Paterno',
      clave: (item: EnlaceOperativo) => item.apellidoPaterno,
      orden: 3,
    },

    /**
     * Configuración para la columna "Apellido Materno".
     * Muestra el apellido materno de cada enlace operativo.
     */
    {
      encabezado: 'Apellido Materno',
      clave: (item: EnlaceOperativo) => item.apellidoMaterno,
      orden: 4,
    },

    /**
     * Configuración para la columna "Ciudad o Estado de Residencia".
     * Muestra la clave de la ciudad o estado de residencia de cada enlace operativo.
     */
    {
      encabezado: 'Ciudad o Estado de Residencia',
      clave: (item: EnlaceOperativo) => item.claveCiudad,
      orden: 5,
    },

    /**
     * Configuración para la columna "Ciudad".
     * Muestra la ciudad de cada enlace operativo.
     */
    {
      encabezado: 'Ciudad',
      clave: (item: EnlaceOperativo) => item.ciudad,
      orden: 6,
    },

    /**
     * Configuración para la columna "Cargo".
     * Muestra el cargo de cada enlace operativo.
     */
    {
      encabezado: 'Cargo',
      clave: (item: EnlaceOperativo) => item.cargo,
      orden: 7,
    },

    /**
     * Configuración para la columna "Teléfono".
     * Muestra el número de teléfono de cada enlace operativo.
     */
    {
      encabezado: 'teléfono',
      clave: (item: EnlaceOperativo) => item.telefono,
      orden: 8,
    },

    /**
     * Configuración para la columna "Correo".
     * Muestra el correo electrónico de cada enlace operativo.
     */
    {
      encabezado: 'Correo',
      clave: (item: EnlaceOperativo) => item.correo,
      orden: 9,
    },

    /**
     * Configuración para la columna "Suplente".
     * Muestra si el enlace operativo es suplente.
     */
    {
      encabezado: 'Suplente',
      clave: (item: EnlaceOperativo) => item.suplente,
      orden: 10,
    },

    /**
     * Configuración para la columna "Calle".
     * Muestra la calle de la dirección de cada enlace operativo.
     */
    {
      encabezado: 'Calle',
      clave: (item: EnlaceOperativo) => item.calle,
      orden: 11,
    },

    /**
     * Configuración para la columna "Número Exterior".
     * Muestra el número exterior de la dirección de cada enlace operativo.
     */
    {
      encabezado: 'Numero Exterior',
      clave: (item: EnlaceOperativo) => item.numeroExterior,
      orden: 12,
    },

    /**
     * Configuración para la columna "Número Interior".
     * Muestra el número interior de la dirección de cada enlace operativo.
     */
    {
      encabezado: 'Numero Interior',
      clave: (item: EnlaceOperativo) => item.numeroInterior,
      orden: 13,
    },

    /**
     * Configuración para la columna "Colonia".
     * Muestra la colonia de la dirección de cada enlace operativo.
     */
    {
      encabezado: 'Colonia',
      clave: (item: EnlaceOperativo) => item.colonia,
      orden: 14,
    },

    /**
     * Configuración para la columna "Código Postal".
     * Muestra el código postal de la dirección de cada enlace operativo.
     */
    {
      encabezado: 'Codigo Postal',
      clave: (item: EnlaceOperativo) => item.codigoPostal,
      orden: 15,
    },

    /**
     * Configuración para la columna "Localidad".
     * Muestra la localidad de la dirección de cada enlace operativo.
     */
    {
      encabezado: 'Localidad',
      clave: (item: EnlaceOperativo) => item.localidad,
      orden: 16,
    },

    /**
     * Configuración para la columna "Delegación o Municipio".
     * Muestra la delegación o municipio de la dirección de cada enlace operativo.
     */
    {
      encabezado: 'Delegacion Municipio',
      clave: (item: EnlaceOperativo) => item.delegacionMunicipio,
      orden: 17,
    },
  ];

/** Configuración de columnas para la tabla de personas relacionadas. */
export const PERSONAS_TABLA: ConfiguracionColumna<RecibirNotificaciones>[] =
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

/** Configuración de columnas para la tabla de transportistas. */
export const TRANSPORTISTAS_TABLA: ConfiguracionColumna<TransportistasTable>[] =
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

/** Configuración de columnas para la tabla de empresas controladas. */
export const CONTROLADAS_TABLA: ConfiguracionColumna<ControladasTable>[] = [
  {
    encabezado: 'RFC',
    clave: (item: ControladasTable) => item.rfc,
    orden: 1,
  },
  {
    encabezado: 'Denominación o Razón social',
    clave: (item: ControladasTable) => item.razonSocial,
    orden: 2,
  },
  {
    encabezado: 'Domicilio',
    clave: (item: ControladasTable) => item.domicilio,
    orden: 3,
  },

  {
    encabezado: 'Participación Accionaria',
    clave: (item: ControladasTable) => item.accinaria,
    orden: 4,
  },
  {
    encabezado: 'Importaciones',
    clave: (item: ControladasTable) => item.importaciones,
    orden: 5,
  },
  {
    encabezado: 'Exportaciones',
    clave: (item: ControladasTable) => item.exportaciones,
    orden: 6,
  },
];

/** Catálogo de carácter. */
export const CARACTER_CATALOGO: CatalogosSelect = {
  labelNombre: 'Eu su carácter de',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
};

/** Catálogo de nacionalidad. */
export const NACIONALIDAD_CATALOGO: CatalogosSelect = {
  labelNombre: 'Nacionalidad',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
};