export interface RespuestaTabla {
  /**
   * Código de respuesta.
   */
  código: number;
  /**
   * Datos de la tabla NICO.
   */
  datos: NicoInfo[];
  /**
   * Mensaje de la respuesta.
   */
  mensaje: string;
}
/**
 * Interfaz que define la estructura de la información NICO.
 * 
 * Esta interfaz se utiliza para modelar la información de las claves y descripciones
 * del Sistema de Clasificación Industrial de América del Norte (S.C.I.A.N.).
 */
export interface NicoInfo {
    /** Clave del S.C.I.A.N. */
    clave_Scian: string;
    /** Descripción asociada a la clave del S.C.I.A.N. */
    descripcion_Scian: string;
  }
   
  /**
   * Configuración de la tabla para la visualización de datos NICO.
   * 
   * Esta constante define las columnas y el orden en que se mostrarán los datos.
   */
  export const NICO_TABLA = [
    {
      /** Encabezado para la clave del S.C.I.A.N. */
      encabezado: 'Clave S.C.I.A.N.',
      /** Función que obtiene la clave del elemento */
      clave: (ele: NicoInfo): string => ele.clave_Scian,
      /** Orden de visualización de la columna */
      orden: 1,
    },
    {
      /** Encabezado para la descripción del S.C.I.A.N. */
      encabezado: 'Descripción del S.C.I.A.N.',
      /** Función que obtiene la descripción del elemento */
      clave: (ele: NicoInfo): string => ele.descripcion_Scian,
      /** Orden de visualización de la columna */
      orden: 2,
    },
  ];

  export interface MercanciasTabla {
    /**
     * Código de respuesta.
     */
    código: number;
    /**
     * Datos de la tabla de mercancías.
     */
    datos: MercanciasInfo[];
    /**
     * Mensaje de la respuesta.
     */
    mensaje: string;
  }
   
  /**
   * Interfaz que define la estructura de la información de mercancías.
   * 
   * Esta interfaz se utiliza para modelar todos los atributos relacionados con las mercancías,
   * incluyendo clasificación, denominaciones, medidas, procedencia y caducidad.
   */
  export interface MercanciasInfo {
    /** Clasificación del producto */
    clasificacion: string;
    /** Especificación de la clasificación */
    especificar: string;
    /** Denominación específica del producto */
    denominacionEspecifica: string;
    /** Denominación distintiva del producto */
    denominacionDistintiva: string;
    /** Denominación común o científica */
    denominacionComun: string;
    /** Forma farmacéutica del producto */
    formaFarmaceutica: string;
    /** Estado físico del producto */
    estadoFisico: string;
    /** Fracción arancelaria asociada */
    fraccionArancelaria: string;
    /** Descripción de la fracción arancelaria */
    descripcionFraccion: string;
    /** Unidad de medida de comercialización (UMC) */
    unidad: string;
    /** Cantidad correspondiente a la UMC */
    cantidadUMC: string;
    /** Unidad de medida de tarifa (UMT) */
    unidadUMT: string;
    /** Cantidad correspondiente a la UMT */
    cantidadUMT: string;
    /** Presentación del producto */
    presentacion: string;
    /** Número de registro sanitario del producto */
    numeroRegistro: string;
    /** País de origen del producto */
    paisDeOrigen: string;
    /** País de procedencia del producto */
    paisDeProcedencia: string;
    /** Tipo de producto */
    tipoProducto: string;
    /** Uso específico del producto */
    usoEspecifico: string;
    /** Fecha de caducidad del producto */
    fechaCaducidad: string;
  }
   
  /**
   * Configuración de la tabla para la visualización de datos de mercancías.
   * 
   * Esta constante define las columnas y el orden en que se mostrarán los datos.
   */
  export const MERCANCIAS_DATA = [
    {
      encabezado: 'Clasificación del producto',
      clave: (ele: MercanciasInfo): string => ele.clasificacion,
      orden: 1,
    },
    {
      encabezado: 'Especificar clasificación del producto',
      clave: (ele: MercanciasInfo): string => ele.especificar,
      orden: 2,
    },
    {
      encabezado: 'Denominación específica del producto',
      clave: (ele: MercanciasInfo): string => ele.denominacionEspecifica,
      orden: 3,
    },
    {
      encabezado: 'Denominación distintiva',
      clave: (ele: MercanciasInfo): string => ele.denominacionDistintiva,
      orden: 4,
    },
    {
      encabezado: 'Denominación común, nombre común o nombre científico',
      clave: (ele: MercanciasInfo): string => ele.denominacionComun,
      orden: 5,
    },
    {
      encabezado: 'Forma farmacéutica',
      clave: (ele: MercanciasInfo): string => ele.formaFarmaceutica,
      orden: 6,
    },
    {
      encabezado: 'Estado físico',
      clave: (ele: MercanciasInfo): string => ele.estadoFisico,
      orden: 7,
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: MercanciasInfo): string => ele.fraccionArancelaria,
      orden: 8,
    },
    {
      encabezado: 'Descripción de la fracción',
      clave: (ele: MercanciasInfo): string => ele.descripcionFraccion,
      orden: 9,
    },
    {
      encabezado: 'Unidad de medida de comercialización (UMC)',
      clave: (ele: MercanciasInfo): string => ele.unidad,
      orden: 10,
    },
    {
      encabezado: 'Cantidad UMC',
      clave: (ele: MercanciasInfo): string => ele.cantidadUMC,
      orden: 11,
    },
    {
      encabezado: 'Unidad de medida de tarifa (UMT)',
      clave: (ele: MercanciasInfo): string => ele.unidadUMT,
      orden: 12,
    },
    {
      encabezado: 'Cantidad UMT',
      clave: (ele: MercanciasInfo): string => ele.cantidadUMT,
      orden: 13,
    },
    {
      encabezado: 'Presentación',
      clave: (ele: MercanciasInfo): string => ele.presentacion,
      orden: 14,
    },
    {
      encabezado: 'Número de registro sanitario',
      clave: (ele: MercanciasInfo): string => ele.numeroRegistro,
      orden: 15,
    },
    {
      encabezado: 'País de origen',
      clave: (ele: MercanciasInfo): string => ele.paisDeOrigen,
      orden: 16,
    },
    {
      encabezado: 'País de procedencia',
      clave: (ele: MercanciasInfo): string => ele.paisDeProcedencia,
      orden: 17,
    },
    {
      encabezado: 'Tipo producto',
      clave: (ele: MercanciasInfo): string => ele.tipoProducto,
      orden: 18,
    },
    {
      encabezado: 'Uso específico',
      clave: (ele: MercanciasInfo): string => ele.usoEspecifico,
      orden: 19,
    },
    {
      encabezado: 'Fecha de caducidad',
      clave: (ele: MercanciasInfo): string => ele.fechaCaducidad,
      orden: 20,
    },
  ];

  /**
   * Configuración de la tabla para la visualización de datos de mercancías.
   * 
   * Esta constante define las columnas y el orden en que se mostrarán los datos.
   */
  export const MERCANCIA_DATA = [
    {
      encabezado: 'Clasificación del producto',
      clave: (ele: MercanciasInfo): string => ele.clasificacion,
      orden: 1,
    },
    {
      encabezado: 'Especificar clasificación del producto',
      clave: (ele: MercanciasInfo): string => ele.especificar,
      orden: 2,
    },
    {
      encabezado: 'Denominación específica del producto',
      clave: (ele: MercanciasInfo): string => ele.denominacionEspecifica,
      orden: 3,
    },
    {
      encabezado: 'Marca',
      clave: (ele: MercanciasInfo): string => ele.denominacionEspecifica,
      orden: 4,
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: MercanciasInfo): string => ele.fraccionArancelaria,
      orden: 5,
    },
    {
      encabezado: 'Descripción de la fracción',
      clave: (ele: MercanciasInfo): string => ele.descripcionFraccion,
      orden: 6,
    },
    {
      encabezado: 'Unidad de medida de comercialización (UMC)',
      clave: (ele: MercanciasInfo): string => ele.unidad,
      orden: 7,
    },
    {
      encabezado: 'Cantidad UMC',
      clave: (ele: MercanciasInfo): string => ele.cantidadUMC,
      orden: 8,
    },
    {
      encabezado: 'Unidad de medida de tarifa (UMT)',
      clave: (ele: MercanciasInfo): string => ele.unidadUMT,
      orden: 9,
    },
    {
      encabezado: 'Cantidad UMT',
      clave: (ele: MercanciasInfo): string => ele.cantidadUMT,
      orden: 10,
    },
    {
      encabezado: 'País de origen',
      clave: (ele: MercanciasInfo): string => ele.paisDeOrigen,
      orden: 11,
    },
    {
      encabezado: 'País de procedencia',
      clave: (ele: MercanciasInfo): string => ele.paisDeProcedencia,
      orden: 12,
    },
    {
      encabezado: 'Tipo producto',
      clave: (ele: MercanciasInfo): string => ele.tipoProducto,
      orden: 13,
    },
    {
      encabezado: 'Uso específico',
      clave: (ele: MercanciasInfo): string => ele.usoEspecifico,
      orden: 14,
    },
   
  ];


  /**
   * Representa el formulario completo que contiene la información de la solicitud,
   * el agente y las mercancías.
   *
   * @property solicitudForm - Información del domicilio del establecimiento.
   * @property formAgente - Información del agente asociado.
   * @property formMercancias - Información relacionada con las mercancías.
   */
  export interface CompleteForm {
    solicitudForm: DomicilioEstablecimiento;
    formAgente: AgenteForm;
    formMercancias: MercanciasForm;
  }

  /**
   * Representa la información del domicilio de un establecimiento.
   *
   * @property razonSocial - Razón social del establecimiento.
   * @property correoElectronico - Correo electrónico de contacto.
   * @property codigoPostal - Código postal del domicilio.
   * @property estado - Estado donde se ubica el establecimiento.
   * @property municipio - Municipio donde se ubica el establecimiento.
   * @property localidad - Localidad donde se ubica el establecimiento.
   * @property colonia - Colonia donde se ubica el establecimiento.
   * @property calle - Calle del domicilio.
   * @property lada - Clave LADA del teléfono.
   * @property telefono - Número de teléfono de contacto.
   * @property avisoCheckbox - Indicador de aceptación de aviso.
   * @property licenciaSanitaria - Número de licencia sanitaria.
   * @property regimen - Régimen del establecimiento.
   * @property aduana - Aduana relacionada.
   * @property manifesto - Manifesto correspondiente.
   * @property hacerlosPublicos - Indicador para hacer públicos los datos.
   */
  export interface DomicilioEstablecimiento {
    razonSocial: string;
    correoElectronico: string;
    codigoPostal: string;
    estado:string;
    municipio:string;
    localidad:string;
    colonia:string;
    calle:string;
    lada:string;
    telefono: string;
    avisoCheckbox:string;
    licenciaSanitaria:string;
    regimen:string;
    aduana:string;
    manifesto:string;
    hacerlosPublicos:string;
  }

  /**
   * Representa el formulario de un agente con información relacionada al SCian.
   *
   * @property claveScianModal - Clave SCian seleccionada en el modal.
   * @property claveDescripcionModal - Descripción asociada a la clave SCian en el modal.
   */
  export interface AgenteForm {
    claveScianModal:string;
    claveDescripcionModal:string;
  }

  /**
   * Representa el formulario de mercancías con información detallada sobre el producto.
   *
   * @property {string} clasificacion - Clasificación general de la mercancía.
   * @property {string} especificarClasificacionProducto - Detalle adicional sobre la clasificación del producto.
   * @property {string} especifique - Campo para especificar información adicional relevante.
   * @property {string} denominacionEspecifica - Denominación específica del producto.
   * @property {string} marca - Marca de la mercancía.
   * @property {string} especifiqueTipo - Especificación del tipo de producto.
   * @property {string} fraccionArancelaria - Fracción arancelaria correspondiente.
   * @property {string} descripcionFraccion - Descripción de la fracción arancelaria.
   * @property {string} cantidadUMT - Cantidad en la Unidad de Medida de Tarifa (UMT).
   * @property {string} UMT - Unidad de Medida de Tarifa.
   * @property {string} cantidadUMC - Cantidad en la Unidad de Medida Comercial (UMC).
   * @property {string} UMC - Unidad de Medida Comercial.
   * @property {string} claveDeLosLotes - Clave identificadora de los lotes.
   * @property {string} fechaCaducidad - Fecha de caducidad del producto (formato string).
   * @property {string} fechaFabricacion - Fecha de fabricación del producto (formato string).
   * @property {string} tipoDeProducto - Tipo de producto especificado.
   */
  export interface MercanciasForm {
    clasificacion: string;
    especificarClasificacionProducto: string;
    especifique: string;
    denominacionEspecifica: string;
    marca: string;
    especifiqueTipo: string;
    fraccionArancelaria: string;
    descripcionFraccion: string;
    cantidadUMT: string;
    UMT: string;
    cantidadUMC: string;
    UMC: string;
    claveDeLosLotes: string;
    fechaCaducidad: string;
    fechaFabricacion: string;
    tipoDeProducto: string;
  }
   