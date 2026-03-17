import { ConfiguracionColumna, REGEX_NUMERO_15_ENTEROS_4_DECIMALES, REGEX_SOLO_NUMEROS } from "@libs/shared/data-access-user/src";
import { DatosMercanciaModalTabla, EnvasesTabla, InsumosTabla } from "../models/panallas110101.model";
import { ErrorValidacion } from "../models/response/archivo-mercancia-response.model";
import { ProcesoSolicitado } from "../models/response/validar-fraccion-response.model";

/**
 * @constant RADIO_OPCIONS
 * @description Opciones de radio.
 */
export const RADIO_OPCIONS = [
  { label: 'Programa IMMEX vigente', value: 'CEXPA.01' },
  { label: 'Haber exportador al menos una ocasionya sea en el ultimo ano fiscal o en los ultimos 12 meses anteriores immediatos a partir de la fecha de la solicitud', value: 'CEXPA.02' },
  { label: 'La mercancia a exportar es un producto perecedero', value: 'CEXPA.03' },
  { label: 'La mercancia a exportar es un producto artesanal', value: 'CEXPA.04' }
];

/**
 * @constant RADIO_OPCIONS_EXP_AUT
 * @description Opciones de radio para exportador autorizado.
 */
export const RADIO_OPCIONS_EXP_AUT = [
  { label: 'Mercancia Exportador Autorizado Programa Immex', value: 'CEXPA.01' },
  { label: 'Mercancia Exportador Autorizado Dolares Exportados', value: 'CEXPA.02' },
  { label: 'Mercancia Exportador Autorizado Producto Perecedero', value: 'CEXPA.03' },
  { label: 'Mercancia Exportador Autorizado Producto Artesanal', value: 'CEXPA.04' }
];

/**
 * @constant OPCIONES
 * @description Opciones de selección si/no.
 */
export const OPCIONES = [
  { label: 'Sí', value: 'si' },
  { label: 'No', value: 'no' }
]

/**
 * @constante ERROR_FORMA_ALERT
 * @tipo {string}
 * @exportado
 * @descripcion
 * Template HTML para mostrar mensajes de error cuando faltan campos obligatorios en formularios.
 * 
 * @estructura_html
 * Utiliza clases de Bootstrap 4/5 para:
 * - **d-flex**: Contenedor flex para centrado
 * - **justify-content-center**: Alineación horizontal al centro
 * - **text-center**: Alineación de texto al centro
 * - **col-md-12**: Ancho completo en pantallas medianas y superiores
 * 
 * @mensaje_contenido
 * "Faltan campos por capturar."
 * - Mensaje claro e informativo
 * - Lenguaje directo y comprensible
 * - Orienta al usuario sobre la acción necesaria
 * - Evita tecnicismos innecesarios
 * 
 * @casos_uso
 * - **Validación de formularios**: Mostrado cuando hay campos vacíos requeridos
 * - **Alertas modales**: Contenido de modales de error
 * - **Mensajes toast**: Notificaciones temporales de error
 * - **Validaciones en tiempo real**: Feedback inmediato al usuario
 * 
 * @patron_centrado
 * El diseño centrado es ideal para:
 * - Atraer atención del usuario al mensaje
 * - Proporcionar simetría visual en la interfaz
 * - Mantener consistencia con otros mensajes de error
 * - Facilitar lectura en diferentes tamaños de pantalla
 * 
 * @integracion_angular
 * ```typescript
 * // Uso con innerHTML
 * this.alertContainer.nativeElement.innerHTML = ERROR_FORMA_ALERT;
 * 
 * // Uso con DomSanitizer
 * this.alertHtml = this.sanitizer.bypassSecurityTrustHtml(ERROR_FORMA_ALERT);
 * ```
 * 
 * @responsive_design
 * - Se adapta a diferentes tamaños de pantalla
 * - Mantiene centrado en dispositivos móviles
 * - Compatible con grid system de Bootstrap
 * 
 * @accesibilidad
 * Considerar agregar:
 * - Atributos ARIA para lectores de pantalla
 * - Roles semánticos (role="alert")
 * - Contraste de colores apropiado
 * 
 * @personalización
 * Template base que permite:
 * - Modificar clases CSS según el theme
 * - Agregar iconos de error
 * - Incluir animaciones de entrada/salida
 * - Adaptar a diferentes frameworks CSS
 */
export const ERROR_FORMA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Faltan campos por capturar.
    </div>
  </div>
</div>
`

/**
 * @constant SELECCIONAR_TRANSFORMACION
 * @description Opciones para seleccionar el tipo de transformación utilizado en la mercancía.
 */
export const SELECCIONAR_TRANSFORMACION = [
  { label: 'Transformación', value: 'transformacion' },
  { label: 'Ensamble o montaje', value: 'ensamble' }
]


/** Configuración de las columnas para la tabla de insumos en el trámite 110101. */
export const INSUMOS_TABLA: ConfiguracionColumna<InsumosTabla>[] = [
    { encabezado: 'Nombre técnico', clave: (item: InsumosTabla) => item.nombreTecnico ?? undefined, orden: 1 },
    { encabezado: "Proveedor", clave: (item: InsumosTabla) => item.proveedor ?? undefined, orden: 2 },
    { encabezado: "Fabricante o productor", clave: (item: InsumosTabla) => item.fabricanteOProductor ?? undefined, orden: 3 },
    { encabezado: "RFC", clave: (item: InsumosTabla) => item.rfc ?? undefined, orden: 4 },
    { encabezado: "Fracción arancelaria", clave: (item: InsumosTabla) => item.fraccionArancelaria ?? undefined, orden: 5 },
    { encabezado: "Valor en dolares", clave: (item: InsumosTabla) => item.valorEnDolares ?? undefined, orden: 6 },
    { encabezado: "País de origen", clave: (item: InsumosTabla) => item.paisDeOrigen ?? undefined, orden: 7 },
    { encabezado: "Peso", clave: (item: InsumosTabla) => item.peso ?? '', orden: 8 },
    { encabezado: "Volumen", clave: (item: InsumosTabla) => item.volumen ?? '', orden: 9 },
  ];

/** Configuración de las columnas para la tabla de procesos en el trámite 110101. */
export const PROCESO_TABLA: ConfiguracionColumna<ProcesoSolicitado>[] = [
    { encabezado: 'Proceso', clave: (item: ProcesoSolicitado) => item.nombre ?? undefined, orden: 1 },
];

  /** Configuración de las columnas para la tabla de envases en el trámite 110101. */
export const ENVASES_TABLA: ConfiguracionColumna<EnvasesTabla>[] = [
  { encabezado: 'Nombre técnico', clave: (item: EnvasesTabla) => item.nombreTecnico ?? undefined, orden: 1 },
  { encabezado: "Proveedor", clave: (item: EnvasesTabla) => item.proveedor ?? undefined, orden: 2 },
  { encabezado: "Fabricante o productor", clave: (item: EnvasesTabla) => item.fabricanteOProductor ?? undefined, orden: 3 },
  { encabezado: "Fracción arancelaria", clave: (item: EnvasesTabla) => item.fraccionArancelaria ?? undefined, orden: 4 },
  { encabezado: "Valor de transacción", clave: (item: EnvasesTabla) => item.valorEnDolares ?? undefined, orden: 5 },
  { encabezado: "País de origen", clave: (item: EnvasesTabla) => item.paisDeOrigen ?? undefined, orden: 6 }
];

/** Configuración de las columnas para la tabla modal de mercancías en el trámite 110101. */
export const MODAL_TABLA: ConfiguracionColumna<DatosMercanciaModalTabla>[] = [
  { encabezado: 'Tratado o Acuerdo', clave: (item: DatosMercanciaModalTabla) => item.tratado_nombre, orden: 1 },
  { encabezado: "País o bloque", clave: (item: DatosMercanciaModalTabla) => item.nombre_pais_bloque, orden: 2 }
];

/** Configuración de las columnas para la tabla modal de errores csven el trámite 110101. */
export const MODAL_TABLA_ERRORES_CSV: ConfiguracionColumna<ErrorValidacion>[] = [
  { encabezado: 'Linea', clave: (item: ErrorValidacion) => item.numero_linea, orden: 1 },
  { encabezado: "Contenido", clave: (item: ErrorValidacion) => item.contenido_linea, orden: 2 },
  { encabezado: "Errores", clave: (item: ErrorValidacion) => item.mensaje_error, orden: 3 }
];

/** Configuración de los campos del formulario modal para agregar o editar datos de mercancía en el trámite 110101. */
export const DATOS_MERCANCIA_MODAL_FORM = [

  {
    id: 'proveedor',
    labelNombre: 'Proveedor',
    campo: 'proveedor',
    clase: 'col-md-6',
    tipoInput: 'text',
    maxlength: 250,
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  
  {
    id: 'fraccionArancelariaModal',
    labelNombre: 'Fracción arancelaria',
    campo: 'fraccionArancelariaModal',
    clase: 'col-md-6',
    tipoInput: 'text',
    maxlength: 8,
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      { 
        tipo: 'pattern',
        valor: REGEX_SOLO_NUMEROS,
      }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  
  {
    id: 'capitulo',
    labelNombre: 'Capítulo',
    campo: 'capitulo',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: true,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },

  {
    id: 'descripcionCapitulo',
    labelNombre: 'Descripción',
    campo: 'descripcionCapitulo',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: true,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },

  {
    id: 'partida',
    labelNombre: 'Partida',
    campo: 'partida',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: true,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },

  {
    id: 'descripcionPartida',
    labelNombre: 'Descripción',
    campo: 'descripcionPartida',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: true,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },

  {
    id: 'subpartida',
    labelNombre: 'Subpartida',
    campo: 'subpartida',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: true,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },

  {
    id: 'descripcionSubpartida',
    labelNombre: 'Descripción',
    campo: 'descripcionSubpartida',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: true,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },

  {
    id: 'descripcionFraccionArancelaria',
    labelNombre: 'Descripción de la fracción arancelaria',
    campo: 'descripcionFraccionArancelaria',
    clase: 'col-md-12',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: true,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },

  {
    id: 'nombreTecnico',
    labelNombre: 'Nombre técnico',
    campo: 'nombreTecnico',
    clase: 'col-md-12',
    tipoInput: 'text',
    maxlength: 250,
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },

  {
    id: 'valorDolares',
    labelNombre: 'Valor en dólares',
    campo: 'valorDolares',
    clase: 'col-md-12',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_NUMERO_15_ENTEROS_4_DECIMALES,
        mensaje: 'Por favor, escribe un número entero válido',
      }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
];