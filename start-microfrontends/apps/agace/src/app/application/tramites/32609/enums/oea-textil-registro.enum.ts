
import {
  AgregarMiembroEmpresaTabla,
  ControlInventariosTabla,
  DomiciliosRfcSolicitanteTabla,
  EmpresaDelGrupo,
  InstalacionesInterface,
  NumeroEmpleadosTabla,
  TablaEnlaceOperativo,
  TablaPersonasNotificaciones,
  TransportistasTable,
} from '../modelos/oea-textil-registro.model';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

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
  SECTOR_PRODUCTIVO: '<strong>Nota:</strong> Si no encuadra en los sectores o los servicios de los catálogos, deberá seleccionar el más cercano a sus actividades.'

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


export const REGISTRO_ESQUEMA_CERTIFICACION_OPTIONS = [
    {
      label: 'Si Autorizo',
      value: '1',
    },
    {
      label: 'No Autorizo',
      value: '0',
    }
  ]
  export const INFORMACION_EMPRESA_OPTIONS = [
    {
      label: 'Pública',
      value: '1',
    },
    {
      label: 'Privada',
      value: '0',
    }
  ]
  export const FECHA_DE_PAGO = {
  labelNombre: '',
  required: false,
  habilitado: true,
};

export const FECHA_DE_INICIO = {
  labelNombre: 'Fecha de Inicio de Operaciones de Comercio Exterior',
  required: false,
  habilitado: true,
};

export const FECHA_DELA_ULTIMA_OPERACION = {
  labelNombre: 'Fecha de la última operación',
  required: false,
  habilitado: true,
}

export const EMPRESA_DEL_GRUPO = [
    {
        encabezado: 'RFC',
        clave: (ele: EmpresaDelGrupo): string => ele.rfcEnclaveOperativo,
        orden: 1,
    },
    {
        encabezado: 'Denominación o Razón social',
        clave: (ele: EmpresaDelGrupo): string => ele.denominacionRazonsocial,
        orden: 2,
    },
    {
        
        encabezado: 'Domicilio',
        clave: (ele: EmpresaDelGrupo): string => ele.domicilio,
        orden: 3,
    }
];
export const EMPRESA_DEL_GRUPO_CON_FECHA = [
    {
        encabezado: 'RFC',
        clave: (ele: EmpresaDelGrupo): string => ele.rfcEnclaveOperativo,
        orden: 1,
    },
    {
        encabezado: 'Denominación o Razón social',
        clave: (ele: EmpresaDelGrupo): string => ele.denominacionRazonsocial,
        orden: 2,
    },
    {
        encabezado: 'Domicilio',
        clave: (ele: EmpresaDelGrupo): string => ele.domicilio,
        orden: 3,
    },
    {
        encabezado: 'Fecha de la última operación',
        clave: (ele: EmpresaDelGrupo): string => ele.inputfechaDeLaUltimaOperacion,
        orden: 4,
    }
];

/**
 * Define los paneles colapsables para diferentes secciones en la interfaz de solicitud de donación.
 */
export const PANELS = [
    { label: 'Empresas del Grupo', isCollapsed: false },
   
];

export const PANELS1 = [
    { label: 'Transportistas', isCollapsed: false },
   
];

export const TRANSPORTISTAS_CONFIGURACION: ConfiguracionColumna<TransportistasTable>[] =
  [
    
    {
      encabezado: 'RFC',
      clave: (item: TransportistasTable) => item.rfcEnclaveOperativo,
      orden: 1,
    },

    {
      encabezado: 'Denominación o Razón social',
      clave: (item: TransportistasTable) => item.denominacionRazonsocial,
      orden: 2,
    },

    {
      encabezado: 'Domicilio',
      clave: (item: TransportistasTable) => item.domicilio,
      orden: 3,
    },


    {
      encabezado: 'Registro CAAT vigente',
      clave: (item: TransportistasTable) => item.ccat,
      orden: 4,
    },
  ];


  export const ENLACE_OPERATIVO_TABLA = [
  {
    /** Columna para el Registro Federal de Contribuyentes */
    encabezado: 'RFC',
    clave: (ele: TablaEnlaceOperativo): string => ele.rfc,
    orden: 1,
  },
  {
    /** Columna para el Nombre */
    encabezado: 'Nombre',
    clave: (ele: TablaEnlaceOperativo): string => ele.nombre,
    orden: 2,
  },
  {
    /** Columna para el Apellido Paterno */
    encabezado: 'Apellido Paterno',
    clave: (ele: TablaEnlaceOperativo): string => ele.apellidoPaterno,
    orden: 3,
  },
  {
    /** Columna para el Apellido Materno */
    encabezado: 'Apellido Materno',
    clave: (ele: TablaEnlaceOperativo): string => ele.apellidoMaterno,
    orden: 4,
  },
  {
    /** Columna para Ciudad/Estado */
    encabezado: 'Cuidad o Estado de Residencia',
    clave: (ele: TablaEnlaceOperativo): string => ele.cuidad,
    orden: 5,
  },
  {
    /** Columna para Cargo/Puesto */
    encabezado: 'Cargo o Puesto',
    clave: (ele: TablaEnlaceOperativo): string => ele.cargo,
    orden: 6,
  },
  {
    /** Columna para Teléfono */
    encabezado: 'Teléfono',
    clave: (ele: TablaEnlaceOperativo): string => ele.telefono,
    orden: 7,
  },
  {
    /** Columna para Correo Electrónico */
    encabezado: 'Correo Electrónico',
    clave: (ele: TablaEnlaceOperativo): string => ele.correoElectronico,
    orden: 8,
  },
  {
    /** Columna para Suplente */
    encabezado: 'Suplente',
    clave: (ele: TablaEnlaceOperativo): string => (ele.suplente ? 'Sí' : 'No'),
    orden: 9,
  },
];

/**
 * Lista de paneles de configuración para la interfaz de usuario.
 * @description Define los paneles visibles en la pantalla, junto con su estado de colapso.
 */
export const PANELS_CONFIGURACION = [
  {
    /**
     * Etiqueta que se muestra en el encabezado del panel.
     */
    label: 'Enlace Operativo',

    /**
     * Indica si el panel está colapsado por defecto.
     */
    isCollapsed: false,
  },
];


/**
 * Configuración de columnas para la tabla de personas notificaciones.
 * 
 * Define la estructura y propiedades de cada columna que se mostrará
 * en la tabla dinámica de personas para notificaciones, incluyendo
 * encabezados, claves de acceso a datos y orden de visualización.
 * 
 * @description Cada objeto de configuración contiene:
 * - `encabezado`: Texto que se muestra en el encabezado de la columna
 * - `clave`: Función que extrae el valor del objeto de datos
 * - `orden`: Número que determina la posición de la columna
 * 
 * @example
 * ```typescript
 * // Uso en un componente de tabla
 * this.configuracionTabla = PERSONAS_NOTIFICACIONES_TABLA;
 * ```
 * 
 * @constant
 * @type {ConfiguracionColumna<TablaPersonasNotificaciones>[]}
 * @since 1.0.0
 * @author Equipo de Desarrollo VUCEM
 */
export const PERSONAS_NOTIFICACIONES_TABLA = [
    {
        /** Columna para el Registro Federal de Contribuyentes */
        encabezado: 'RFC',
        clave: (ele: TablaPersonasNotificaciones): string => ele.rfc,
        orden: 1,
    },
    {
        /** Columna para la Clave Única de Registro de Población */
        encabezado: 'CURP',
        clave: (ele: TablaPersonasNotificaciones): string => ele.curp,
        orden: 2,
    },
    {
        /** Columna para el nombre de la persona */
        encabezado: 'Nombre',
        clave: (ele: TablaPersonasNotificaciones): string => ele.nombre,
        orden: 3,
    },
    {
        /** Columna para el apellido paterno */
        encabezado: 'Apellido Paterno',
        clave: (ele: TablaPersonasNotificaciones): string => ele.apellidoPaterno,
        orden: 4,
    },
    {
        /** Columna para el apellido materno */
        encabezado: 'Apellido Materno',
        clave: (ele: TablaPersonasNotificaciones): string => ele.apellidoMaterno,
        orden: 5,
    }
];

/**
 * Configuración de paneles colapsables para la interfaz de usuario.
 * 
 * Define los paneles que pueden expandirse o contraerse en la
 * interfaz de personas notificaciones, incluyendo su estado inicial
 * y etiquetas descriptivas.
 * 
 * @description Cada panel contiene:
 * - `label`: Texto descriptivo que se muestra en el encabezado del panel
 * - `isCollapsed`: Estado inicial del panel (true = contraído, false = expandido)
 * 
 * @example
 * ```typescript
 * // Uso en un componente
 * this.panels = PANELS;
 * 
 * // Alternar estado de un panel
 * this.panels[0].isCollapsed = !this.panels[0].isCollapsed;
 * ```
 * 
 * @constant
 * @type {Panel[]}
 * @since 1.0.0
 * @author Equipo de Desarrollo VUCEM
 */
export const PANELS_PRINCIPALES = [
    { 
        /** Panel principal para la gestión de personas notificaciones */
        label: 'Personas para oír y recibir notificaciones', 
        isCollapsed: false
    }
];