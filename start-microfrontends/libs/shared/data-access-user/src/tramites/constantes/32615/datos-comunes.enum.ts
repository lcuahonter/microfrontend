import { InstalacionesPrincipalesTablaInfo, InventariosInfo, MercanciasInfo, PersonasInfo } from "../../../core/models/32615/dato-comunes.model";

/**
 * Contiene textos de alerta o nota utilizados en la vista de la solicitud,
 * como instrucciones o advertencias relacionadas con domicilios y programas IMMEX.
 */
export const ALERTA_COM = {
    inst: `<h6>Nota: Si no encuadra en los sectores o los servicios de los catálogos, deberá seleccionar el más cercano a sus actividades.</h6>`,
    nota: `<h6>Nota:</h6> De contar con un programa IMMEX activo y vigente al momento de ingresar la solicitud, se mostrarán los domicilios registrados ante la Secretaria de Economía, es necesario eliminar aquellos domicilios que no tengan alguna relación con la presente solicitud. Así mismo, podrá incluir otros domicilios que se encuentren relacionados con el RFC del solicitante, dando click en el botón "Agregar" y seleccionado la Entidad Federativa.`,
    nota2: `Deberá anexar un archivo con el reporte de saldos de mercancía de importación temporal o de mercancías objeto de operaciones de comercio exterior, de un periodo de un mes, que se encuentre dentro de los tres meses anteriores a la presentación de la solicitud.`
  }; 
  
  /**
   * Opciones utilizadas en botones de selección tipo radio para respuestas "Sí" o "No".
   */
  export const OPCIONES_DE_BOTON_DE_RADIO = [
    {
      label: 'Si',
      value: '1',
    },
    {
      label: 'No',
      value: '0',
    }
  ];
  
  /**
   * Opciones de autorización del reconocimiento para el trámite.
   */
  export const OPCIONES_RECONOCIMIENTO = [
    {
      label: 'si Autorizo',
      value: '1',
    },
    {
      label: 'No Autorizo',
      value: '0',
    }
  ];
  
  /**
   * Opciones para definir si la información proporcionada es pública o privada.
   */
  export const OPCIONES_INFORMACION = [
    {
      label: 'Pública',
      value: '1',
    },
    {
      label: 'Privada',
      value: '0',
    }
  ];
  
  /**
   * Configuración para el campo de fecha de factura (etiqueta, requerido, habilitación).
   */
  export const FECHA_DE_FACTURA = {
    labelNombre: 'Fecha de pago',
    required: true,
    habilitado: true,
  };

  /**
   * Configuración para el campo de fecha de inicio (etiqueta, requerido, habilitación).
   */
  export const FECHA_DE_INICIO = {
    labelNombre: 'Fecha de inicio de la prestación del servicio',
    required: false,
    habilitado: true,
  };

  /**
   * Configuración para el campo de fecha de inicio (etiqueta, requerido, habilitación).
   */
  export const FECHA_DE_VIGENCIA = {
    labelNombre: 'Fecha de fin de vigencia',
    required: false,
    habilitado: true,
  };

   /**
   * Configuración para el campo de fecha de inicio (etiqueta, requerido, habilitación).
   */
  export const VIGENCIA = {
    labelNombre: 'Vigencia',
    required: false,
    habilitado: true,
  };
  
  /**
   * Columnas configuradas para la tabla que muestra información de mercancías.
   */
  export const MERCANCIA_TABLA = [
      {
          encabezado: 'Denominacion Social',
          clave: (ele: MercanciasInfo): string => ele.denominacion_social,
          orden: 1,
      },
      {
          encabezado: 'RFC',
          clave: (ele: MercanciasInfo): string => ele.rfc,
          orden: 2,
      },
      {
          encabezado: 'Numero de Empleados',
          clave: (ele: MercanciasInfo): string => ele.numero_de_empleados,
          orden: 3,
      },
      {
          encabezado: 'Bimestre',
          clave: (ele: MercanciasInfo): string => ele.bimestre,
          orden: 4,
      }
  ];

  /**
   * Columnas configuradas para la tabla de instalaciones principales.
   */
  export const INSTALACIONES_PRINCIPALES_TABLA = [
      {
          encabezado: '*Instalaciones principales',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.instalaciones_principales,
          orden: 1,
      },
      {
          encabezado: '*Tipo de instalación',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.tipo_de_instalacion,
          orden: 2,
      },
      {
          encabezado: 'Entidad federativa',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.entidad_federativa,
          orden: 3,
      },
      {
          encabezado: 'Municipio o delegación',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.municipio_o_delegacion,
          orden: 4,
      },
      {
          encabezado: 'Colonia, calle y número',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.colonia,
          orden: 5,
      },
      {
          encabezado: 'Código postal',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.codigo_postal,
          orden: 6,
      },
      {
          encabezado: 'Registro ante SE/SAT',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.registro_ante_se_sat,
          orden: 7,
      },
      {
          encabezado: 'Proceso Productivo',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.proceso_productivo,
          orden: 8,
      },
      {
          encabezado: 'Acredita el uso y Goce del Inmueble',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.acredita_el_uso_y_goce_del_inmueble,
          orden: 9,
      },
      {
          encabezado: 'Realiza operaciones de Comercio Exterior',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.realiza_operaciones_de_comercio_exterior,
          orden: 10,
      },
      {
          encabezado: 'Reconocimiento Mutuo (Instalación C-TPAT)',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.reconocimiento_mutuo_instalacion_c_tpat,
          orden: 11,
      },
      {
          encabezado: 'Perfil de la empresa',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.perfil_de_la_empresa,
          orden: 12,
      },
      {
          encabezado: 'Perfil del Recinto Fiscalizado Estratégico',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.perfil_del_recinto_fiscalizado_estrategico,
          orden: 13,
      },
      {
          encabezado: 'Perfil del Auto Transportista Terrestre',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.perfil_del_auto_transportista_terrestre,
          orden: 14,
      },
      {
          encabezado: 'Perfil del Transportista Ferroviario',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.perfil_del_transportista_ferroviario,
          orden: 15,
      },
      {
          encabezado: 'Perfil del Recinto Fiscalizado',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.perfil_del_recinto_fiscalizado,
          orden: 16,
      },
      {
          encabezado: 'Perfil de Mensajeria y Paqueteria',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.perfil_de_mensajeria_y_paqueteria,
          orden: 17,
      },
      {
          encabezado: 'Perfil Almacen General',
          clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.perfil_almacen_general,
          orden: 18,
      }
  ];

  /**
   * Columnas configuradas para la tabla de personas.
   */
  export const PERSONAS_TABLA = [
      {
          encabezado: 'RFC',
          clave: (ele: PersonasInfo): string => ele.rfc,
          orden: 1,
      },
      {
          encabezado: 'CURP',
          clave: (ele: PersonasInfo): string => ele.curp,
          orden: 2,
      },
      {
          encabezado: 'Nombre',
          clave: (ele: PersonasInfo): string => ele.nombre,
          orden: 3,
      },
      {
          encabezado: 'Apellido Paterno',
          clave: (ele: PersonasInfo): string => ele.apellidoPaterno,
          orden: 4,
      },
      {
          encabezado: 'Apellido Materno',
          clave: (ele: PersonasInfo): string => ele.apellidoMaterno,
          orden: 5,
      }
  ];

  /**
 * Columnas configuradas para la tabla de inventarios.
 */
export const INVENTARIOS_TABLA = [
    {
        encabezado: 'Nombre del sistema o datos para su identificación',
        clave: (ele: InventariosInfo): string => ele.nombre,
        orden: 1,
    },
    {
        encabezado: 'Lugar de radicación',
        clave: (ele: InventariosInfo): string => ele.lugarRadicacion,
        orden: 2,
    },
    {
        encabezado: 'Indique, si cuenta con un sistema de control de inventarios de conformidad con las disposiciones previstas por el Anexo 24.',
        clave: (ele: InventariosInfo): string => ele.sistemaControlInventarios,
        orden: 3,
    }
];