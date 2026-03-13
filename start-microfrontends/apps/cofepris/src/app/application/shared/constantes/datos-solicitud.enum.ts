import {
  DetalleMercancia,
  DetalleMercanciaEstupefacientes,
} from '../models/detalle-mercancia.model';
import {
  TablaMercanciaClaveConfig,
  TablaMercanciasDatos,
  TablaOpcionConfig,
  TablaScianConfig,
} from '../models/datos-solicitud.model';

/**
 * @const OPCION_TABLA
 * @description Configuración de las opciones de la tabla utilizada en la aplicación.
 * Contiene los encabezados, claves y el orden de las columnas de la tabla.
 *
 * @property {string} encabezado - El nombre del encabezado de la columna.
 * @property {(ele: TablaOpcionConfig) => string} clave - Función que retorna el valor correspondiente
 * a la clave de la columna basada en el objeto `TablaOpcionConfig`.
 * @property {number} orden - El orden en el que se debe mostrar la columna en la tabla.
 *
 */
export const OPCION_TABLA = [
  {
    encabezado: 'Fecha creación',
    clave: (ele: TablaOpcionConfig): string | number | undefined => ele.fecha_creacion,
    orden: 1,
  },
  {
    encabezado: 'Mercancía',
    clave: (ele: TablaOpcionConfig): string => ele.mercancia,
    orden: 2,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: TablaOpcionConfig): number | string => ele.cantidad,
    orden: 3,
  },
  {
    encabezado: 'Proveedor',
    clave: (ele: TablaOpcionConfig): string => ele.proveedor,
    orden: 4,
  },
];

/**
 * @const SCIAN_TABLA
 * @description Configuración de la tabla utilizada para mostrar información relacionada con el S.C.I.A.N.
 * Contiene los encabezados, claves y el orden de las columnas de la tabla.
 *
 * @property {string} encabezado - El nombre del encabezado de la columna.
 * @property {(ele: TablaScianConfig) => string} clave - Función que retorna el valor correspondiente
 * a la clave de la columna basada en el objeto `TablaScianConfig`.
 * @property {number} orden - El orden en el que se debe mostrar la columna en la tabla.
 */
export const SCIAN_TABLA = [
  {
    encabezado: 'Clave S.C.I.A.N.',
    clave: (ele: TablaScianConfig): string => ele.clave,
    orden: 1,
  },
  {
    encabezado: 'Descripción del S.C.I.A.N.',
    clave: (ele: TablaScianConfig): string => ele.descripcion,
    orden: 1,
  },
];

/**
 * @const DATOS_MERCANCIA_CLAVE_TABLA
 * @description Configuración de la tabla utilizada para mostrar información relacionada con la clave de mercancía.
 * Contiene los encabezados, claves y el orden de las columnas de la tabla.
 *
 * @property {string} encabezado - El nombre del encabezado de la columna.
 * @property {(ele: TablaMercanciaClaveConfig) => string} clave - Función que retorna el valor correspondiente
 * a la clave de la columna basada en el objeto `TablaMercanciaClaveConfig`.
 * @property {number} orden - El orden en el que se debe mostrar la columna en la tabla.
 */
export const DATOS_MERCANCIA_CLAVE_TABLA = [
  {
    encabezado: 'Clave de los lotes',
    clave: (ele: TablaMercanciaClaveConfig): string => ele.clave,
    orden: 1,
  },
  {
    encabezado: 'Fecha de fabricacio',
    clave: (ele: TablaMercanciaClaveConfig): string => ele.fabricacion,
    orden: 1,
  },
  {
    encabezado: 'Fecha de caducidad',
    clave: (ele: TablaMercanciaClaveConfig): string => ele.caducidad,
    orden: 1,
  },
];

/**
 * @const SCIAN_TABLA_DATA
 * @description Datos de ejemplo para la tabla S.C.I.A.N.
 * Contiene una lista de objetos que representan las claves y descripciones del S.C.I.A.N.
 *
 * @property {string} clave - Clave del S.C.I.A.N.
 * @property {string} descripcion - Descripción del S.C.I.A.N.
 */
export const SCIAN_TABLA_DATA: TablaScianConfig[] = [
  { clave: '001', descripcion: 'Descripción 1' },
  { clave: '002', descripcion: 'Descripción 2' },
];

/**
 * @const ALERTA_OPCIONS
 * @description
 * Este constante contiene una plantilla HTML que representa un mensaje de alerta.
 * El mensaje informa al usuario que al dar doble clic en una solicitud, los datos
 * de dicha solicitud se copiarán en la solicitud actual.
 *
 * @uso
 * Esta constante puede ser utilizada en componentes o vistas donde se requiera
 * mostrar esta alerta como parte de un flujo de trabajo relacionado con solicitudes.
 */
export const ALERTA_OPCIONS = `<p style="text-align: center;">Al dar doble-clic en una Solicitud, se copiarán sus datos en esta Solicitud.</p>`;

/**
 * @const ALERTA_DE_MANIFESTO_Y_DECLARACIONES
 * @description
 * Este constante contiene una plantilla HTML que representa un mensaje de alerta
 * relacionado con manifiestos y declaraciones. Incluye un checkbox para la selección
 * del manifiesto y un párrafo que describe los requisitos y normatividad aplicable.
 *
 * @detalle
 * - El checkbox permite al usuario confirmar que cumple con los requisitos y normatividad aplicable.
 * - El párrafo informa al usuario sobre las posibles verificaciones de la autoridad sanitaria
 *   y las sanciones por falsedad de declaraciones.
 * - También se menciona que la notificación del trámite se realizará a través de la Ventanilla
 *   Única de Comercio Exterior.
 *
 * @uso
 * Esta constante puede ser utilizada en componentes o vistas donde se requiera mostrar
 * esta alerta como parte de un formulario o proceso de declaración.
 */
export const ALERTA_DE_MANIFESTO_Y_DECLARACIONES = `Cumplo con los requisitos y normatividad aplicable, sin que me eximan de que la autoridad sanitaria verifique su
      cumplimiento, esto sin perjuicio de las sanciones en que puedo incurrir por falsedad de declaraciones dadas a una
      autoridad. Asimismo acepto que la notificación de este trámite, sea a través de la Ventanilla Única de Comercio
      Exterior por los mecanismos de la misma.`;

/**
 * Represents a constant array `PRODUCTO_TABLA` that defines the structure of a product table.
 * Each object in the array contains the following properties:
 *
 * - `encabezado`: A string representing the header of the column.
 * - `clave`: A function that takes an object of type `TablaMercanciasDatos` and returns the value of the corresponding key.
 * - `orden`: A number representing the order of the column in the table.
 *
 * @constant
 * @type {Array<{ encabezado: string; clave: (ele: TablaMercanciasDatos) => any; orden: number }>}
 */
export const PRODUCTO_TABLA = [
  {
    encabezado: 'Clasificación del producto',
    clave: (ele: TablaMercanciasDatos): string => ele.clasificacionProducto, // Reemplaza 'ele.clasificacionProducto' con la clave correcta
    orden: 1,
  },
  {
    encabezado: 'Especificar clasificación del producto',
    clave: (ele: TablaMercanciasDatos): string =>
      ele.especificarClasificacionProducto, // Reemplaza 'ele.especificarClasificacionProducto' con la clave correcta
    orden: 2,
  },
  {
    encabezado: 'Denominación específica del producto',
    clave: (ele: TablaMercanciasDatos): string | undefined =>
      ele.denominacionEspecificaProducto, // Reemplaza 'ele.denominacionEspecificaProducto' con la clave correcta
    orden: 3,
  },
  {
    encabezado: 'Denominación distintiva',
    clave: (ele: TablaMercanciasDatos): string | undefined =>
      ele.denominacionDistintiva, // Reemplaza 'ele.denominacionDistintiva' con la clave correcta
    orden: 4,
  },
  {
    encabezado: 'Denominación común, nombre común o nombre científico',
    clave: (ele: TablaMercanciasDatos): string | undefined =>
      ele.denominacionComun, // Reemplaza 'ele.denominacionComun' con la clave correcta
    orden: 5,
  },
  {
    encabezado: 'Forma farmacéutica',
    clave: (ele: TablaMercanciasDatos): string => ele.formaFarmaceutica, // Reemplaza 'ele.formaFarmaceutica' con la clave correcta
    orden: 6,
  },
  {
    encabezado: 'Estado físico',
    clave: (ele: TablaMercanciasDatos): string => ele.estadoFisico, // Reemplaza 'ele.estadoFisico' con la clave correcta
    orden: 7,
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: TablaMercanciasDatos): string => ele.fraccionArancelaria, // Reemplaza 'ele.fraccionArancelaria' con la clave correcta
    orden: 8,
  },
  {
    encabezado: 'Descripción de la fracción',
    clave: (ele: TablaMercanciasDatos): string | undefined =>
      ele.descripcionFraccion, // Reemplaza 'ele.descripcionFraccion' con la clave correcta
    orden: 9,
  },
  {
    encabezado: 'Unidad de medida de comercialización (UMC)',
    clave: (ele: TablaMercanciasDatos): string | undefined =>
      ele.cantidadUMC, // Reemplaza 'ele.unidadMedidaComercializacion' con la clave correcta
    orden: 10,
  },
  {
    encabezado: 'Cantidad UMC',
    clave: (ele: TablaMercanciasDatos): string | undefined => ele.cantidadUmcValor, // Reemplaza 'ele.cantidadUMC' con la clave correcta
    orden: 11,
  },
  {
    encabezado: 'Unidad de medida de tarifa (UMT)',
    clave: (ele: TablaMercanciasDatos): string => ele.unidadMedidaTarifa, // Reemplaza 'ele.unidadMedidaTarifa' con la clave correcta
    orden: 12,
  },
  {
    encabezado: 'Cantidad UMT',
    clave: (ele: TablaMercanciasDatos): string => ele.cantidadUMT, // Reemplaza 'ele.cantidadUMT' con la clave correcta
    orden: 13,
  },
  {
    encabezado: 'Presentación',
    clave: (ele: TablaMercanciasDatos): string => ele.presentacion, // Reemplaza 'ele.Presentación' con la clave correcta
    orden: 14,
  },
  {
    encabezado: 'Número de registro sanitario',
    clave: (ele: TablaMercanciasDatos): string => ele.numeroRegistroSanitario, // Reemplaza 'ele.numeroRegistroSanitario' con la clave correcta
    orden: 15,
  },
  {
    encabezado: 'País de origen',
    clave: (ele: TablaMercanciasDatos): string => ele.paisOrigen, // Reemplaza 'ele.paisOrigen' con la clave correcta
    orden: 16,
  },
  {
    encabezado: 'País de procedencia',
    clave: (ele: TablaMercanciasDatos): string => ele.paisProcedencia, // Reemplaza 'ele.paisProcedencia' con la clave correcta
    orden: 17,
  },
  {
    encabezado: 'Tipo producto',
    clave: (ele: TablaMercanciasDatos): string => ele.tipoProducto, // Reemplaza 'ele.tipoProducto' con la clave correcta
    orden: 18,
  },
  {
    encabezado: 'Uso especifico',
    clave: (ele: TablaMercanciasDatos): string => ele.usoEspecifico, // Reemplaza 'ele.usoEspecifico' con la clave correcta
    orden: 19,
  }
];
export const PRODUCTO_TABLA_218 = [
  {
    encabezado: 'Clasificación del producto',
    clave: (ele: TablaMercanciasDatos): string => ele.clasificacionProducto,
    orden: 1,
  },
  {
    encabezado: 'Especificar clasificación del producto',
    clave: (ele: TablaMercanciasDatos): string =>
      ele.especificarClasificacionProducto,
    orden: 2,
  },
  {
    encabezado: 'Denominación específica del producto',
    clave: (ele: TablaMercanciasDatos): string | undefined =>
      ele.denominacionEspecificaProducto,
    orden: 3,
  },
  {
    encabezado: 'Denominación distintiva',
    clave: (ele: TablaMercanciasDatos): string | undefined =>
      ele.denominacionDistintiva,
    orden: 4,
  },
  {
    encabezado: 'Denominación común, nombre común o nombre científico',
    clave: (ele: TablaMercanciasDatos): string | undefined =>
      ele.denominacionComun,
    orden: 5,
  },
  {
    encabezado: 'Forma farmacéutica',
    clave: (ele: TablaMercanciasDatos): string => ele.formaFarmaceutica,
    orden: 6,
  },
  {
    encabezado: 'Estado físico',
    clave: (ele: TablaMercanciasDatos): string => ele.estadoFisico,
    orden: 7,
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: TablaMercanciasDatos): string => ele.fraccionArancelaria,
    orden: 8,
  },
  {
    encabezado: 'Descripción de la fracción',
    clave: (ele: TablaMercanciasDatos): string | undefined =>
      ele.descripcionFraccion,
    orden: 9,
  },
  {
    encabezado: 'Unidad de medida de comercialización (UMC)',
    clave: (ele: TablaMercanciasDatos): string | undefined =>
      ele.unidadMedidaComercializacion,
    orden: 10,
  },
  {
    encabezado: 'Cantidad UMC',
    clave: (ele: TablaMercanciasDatos): string => ele.cantidadUMC,
    orden: 11,
  },
  {
    encabezado: 'Unidad de medida de tarifa (UMT)',
    clave: (ele: TablaMercanciasDatos): string => ele.unidadMedidaTarifa,
    orden: 12,
  },
  {
    encabezado: 'Cantidad UMT',
    clave: (ele: TablaMercanciasDatos): string => ele.cantidadUMT,
    orden: 13,
  },
  {
    encabezado: 'Presentación',
    clave: (ele: TablaMercanciasDatos): string => ele.presentacion,
    orden: 14,
  },
  {
    encabezado: 'Número de registro sanitario',
    clave: (ele: TablaMercanciasDatos): string => ele.numeroRegistroSanitario,
    orden: 15,
  },
  {
    encabezado: 'País de origen',
    clave: (ele: TablaMercanciasDatos): string => ele.paisOrigen,
    orden: 16,
  },
  {
    encabezado: 'País de procedencia',
    clave: (ele: TablaMercanciasDatos): string => ele.paisProcedencia,
    orden: 17,
  },
  {
    encabezado: 'Tipo producto',
    clave: (ele: TablaMercanciasDatos): string => ele.tipoProducto,
    orden: 18,
  },
  {
    encabezado: 'Uso específico',
    clave: (ele: TablaMercanciasDatos): string => ele.usoEspecifico,
    orden: 19,
  },
  {
    encabezado: 'Fecha de caducidad',
    clave: (ele: TablaMercanciasDatos): string => ele.caducidad ?? '',
    orden: 20,
  },
];

/**
 * Constante que representa los datos de la tabla de mercancías para productos.
 *
 * @const
 * @type {TablaMercanciasDatos[]}
 * @description Contiene un arreglo con la información inicial de un producto, incluyendo su clasificación, denominación, forma farmacéutica, estado físico, fracción arancelaria, unidad de medida, cantidad, presentación, número de registro sanitario, país de origen, país de procedencia, tipo de producto y uso específico.
 */
export const PRODUCTO_TABLA_DATA: TablaMercanciasDatos[] = [
  {
    clasificacionProducto: '1',
    especificarClasificacionProducto: '',
    denominacionEspecificaProducto: 'QA',
    denominacionDistintiva: 'QA',
    denominacionComun: 'QA',
    formaFarmaceutica: '',
    estadoFisico: '',
    fraccionArancelaria: '',
    descripcionFraccion: '',
    unidadMedidaComercializacion: '',
    cantidadUMC: '',
    unidadMedidaTarifa: '',
    cantidadUMT: '',
    presentacion: '',
    numeroRegistroSanitario: '',
    paisOrigen: '',
    paisProcedencia: '',
    tipoProducto: '',
    usoEspecifico: '',
  },
];

/** "t" se utiliza para continuar el botón que se usa globalmente para el procedimiento 230401 */
export const CONTINUAR: string = 't';

/**
 * @const CROSLISTA_DE_PAISES
 * @description Lista de países representados como cadenas de texto.
 * Esta constante contiene nombres de países con sus respectivas denominaciones oficiales.
 *
 * @type {string[]}
 */
export const CROSLISTA_DE_PAISES: string[] = [
  'AFGANISTÁN (EMIRATO ISLÁMICO)',
  'ALBANIA (REPÚBLICA DE)',
  'ALEMANIA (REPÚBLICA FEDERAL DE)',
  'ANDORRA (PRINCIPADO DE)',
  'ANGOLA (REPÚBLICA DE)',
  'ANGUILLA',
  'ANTIGUA Y BARBUDA',
  'ARABIA SAUDITA (COMUNIDAD ECONÓMICA EUROPEA)',
  'ARGELIA (REPÚBLICA DEMOCRÁTICA Y POPULAR DE)',
  'ARGENTINA (REPÚBLICA)',
  'AUSTRALIA (COMMONWEALTH OF)',
  'AUSTRIA (REPUBLIC OF)',
  'BAHAMAS (COMMONWEALTH OF THE)',
  'BAHRAIN (KINGDOM OF)',
  "BANGLADESH (PEOPLE'S REPUBLIC OF)",
  'BARBADOS',
  'BELGIUM (KINGDOM OF)',
  'BELIZE',
  'BENIN (REPUBLIC OF)',
  'BHUTAN (KINGDOM OF)',
];

/**
 * @const CROSLISTA_DE_FORMAS_FARMACEUTICAS
 * @description Lista de países representados como cadenas de texto.
 * Esta constante contiene nombres de países con sus respectivas denominaciones oficiales.
 *
 * @type {string[]}
 */

export const CROSLISTA_DE_FORMAS_FARMACEUTICAS: string[] = [
  'AEROSOL',
  'CAPSULAS',
  'COMPRIMIDOS',
  'CREMA',
  'EMULSIÓN',
];

/**
 * @const TABLA_OPCION_DATA
 * @description Configuración de opciones para la tabla de datos de solicitud.
 * Contiene información sobre la fecha de creación, mercancía, cantidad y proveedor.
 *
 * @type {TablaOpcionConfig[]}
 * @property {string} fechaCreacion - Fecha y hora de creación del registro en formato 'YYYY-MM-DD HH:mm:ss.S'.
 * @property {string} mercancia - Descripción de la mercancía, especificando restricciones o características.
 * @property {string} cantidad - Cantidad asociada a la mercancía.
 * @property {string} proveedor - Nombre del proveedor relacionado con la mercancía.
 */
export const TABLA_OPCION_DATA: TablaOpcionConfig[] = [
  {
    fechaCreacion: '2024-01-15',
    mercancia: 'Medicamentos',
    cantidad: '100',
    proveedor: 'Farmacéutica ABC S.A.',
    rfcSanitario: 'FAR840315ABC',
    denominacionRazon: 'Farmacéutica ABC S.A. de C.V.',
    correoElectronico: 'contacto@farmabc.com',
    codigoPostal: '01000',
    estado: '101',
    municipioAlcaldia: 'Álvaro Obregón',
    localidad: 'Santa Fe',
    colonia: 'Santa Fe Centro',
    calleYNumero: 'Av. Santa Fe 495',
    calle: 'Av. Santa Fe',
    lada: '55',
    telefono: '12345678',
    aviso: 'AV-2024-001',
    licenciaSanitaria: 'LS-2024-001',
    regimen: '101',
    adunasDeEntradas: '101',
    aeropuerto: true,
    aeropuertoDos: false,
    publico: 'Si',
    representanteRfc: 'REP840315XYZ',
    representanteNombre: 'Juan Carlos',
    apellidoPaterno: 'García',
    apellidoMaterno: 'López',
    regimenLaMercancia: 'Importación',
    aduana: 'México - Aeropuerto Internacional',
    mercancias: [
      {
        clasificacionProducto: 'Dispositivo Médico',
        especificarClasificacionProducto: 'Instrumental Médico',
        denominacionEspecificaProducto: 'Estetoscopio Digital',
        formaFarmaceutica: 'N/A',
        estadoFisico: 'Sólido',
        fraccionArancelaria: '9018.11.01',
        unidadMedidaComercializacion: 'Piezas',
        cantidadUMC: '25',
        unidadMedidaTarifa: 'Piezas',
        cantidadUMT: '25',
        presentacion: 'Piezas',
        numeroRegistroSanitario: 'REG-002-2024',
        paisOrigen: 'Alemania',
        paisProcedencia: 'Estados Unidos',
        tipoProducto: 'Dispositivo Médico',
        usoEspecifico: 'Diagnóstico médico'
      },
    ],
    scian: [
      {
        clave: '325412',
        descripcion: 'Fabricación de preparaciones farmacéuticas'
      }
    ],
    manifesto: 'MAN-2024-001',
    manifiestosCasillaDeVerificacion: true
  },
  {
    fechaCreacion: '2024-02-20',
    mercancia: 'Dispositivos Médicos',
    cantidad: '50',
    proveedor: 'Medtech Solutions Ltd.',
    rfcSanitario: 'MED850420DEF',
    denominacionRazon: 'Medtech Solutions México S.A.',
    correoElectronico: 'importaciones@medtech.mx',
    codigoPostal: '64000',
    estado: '101',
    municipioAlcaldia: 'Monterrey',
    localidad: 'Centro',
    colonia: 'Centro Histórico',
    calleYNumero: 'Morelos 123',
    calle: 'Morelos',
    lada: '81',
    telefono: '87654321',
    aviso: 'AV-2024-002',
    licenciaSanitaria: 'LS-2024-002',
    regimen: '101',
    adunasDeEntradas: '101',
    aeropuerto: false,
    aeropuertoDos: true,
    publico: 'Si',
    representanteRfc: 'REP850420ABC',
    representanteNombre: 'María Elena',
    apellidoPaterno: 'Rodríguez',
    apellidoMaterno: 'Martínez',
    regimenLaMercancia: 'Importación Temporal',
    aduana: 'Nuevo Laredo - Terrestre',
    mercancias: [ {
      clasificacionProducto: 'Dispositivo Médico',
      especificarClasificacionProducto: 'Instrumental Médico',
      denominacionEspecificaProducto: 'Estetoscopio Digital',
      formaFarmaceutica: 'N/A',
      estadoFisico: 'Sólido',
      fraccionArancelaria: '9018.11.01',
      unidadMedidaComercializacion: 'Piezas',
      cantidadUMC: '25',
      unidadMedidaTarifa: 'Piezas',
      cantidadUMT: '25',
      presentacion: 'Piezas',
      numeroRegistroSanitario: 'REG-002-2024',
      paisOrigen: 'Alemania',
      paisProcedencia: 'Estados Unidos',
      tipoProducto: 'Dispositivo Médico',
      usoEspecifico: 'Diagnóstico médico'
    },
    {
      clasificacionProducto: 'Dispositivo Médico',
      especificarClasificacionProducto: 'Instrumental Médico',
      denominacionEspecificaProducto: 'Estetoscopio Digital',
      formaFarmaceutica: 'N/A',
      estadoFisico: 'Sólido',
      fraccionArancelaria: '9018.11.01',
      unidadMedidaComercializacion: 'Piezas',
      cantidadUMC: '25',
      unidadMedidaTarifa: 'Piezas',
      cantidadUMT: '25',
      presentacion: 'Piezas',
      numeroRegistroSanitario: 'REG-002-2024',
      paisOrigen: 'Alemania',
      paisProcedencia: 'Estados Unidos',
      tipoProducto: 'Dispositivo Médico',
      usoEspecifico: 'Diagnóstico médico'
    },
    ],
    scian: [
      {
        clave: '334510',
        descripcion: 'Fabricación de instrumentos y aparatos de medición'
      }
    ],
    manifesto: 'MAN-2024-002',
    manifiestosCasillaDeVerificacion: false
  },
  {
    fechaCreacion: '2024-03-10',
    mercancia: 'Suplementos Alimenticios',
    cantidad: '200',
    proveedor: 'NutriHealth Corp.',
    rfcSanitario: 'NUT860512GHI',
    denominacionRazon: 'NutriHealth México S.A. de C.V.',
    correoElectronico: 'legal@nutrihealth.mx',
    codigoPostal: '44100',
    estado: '101',
    municipioAlcaldia: 'Guadalajara',
    localidad: 'Zona Centro',
    colonia: 'Centro',
    calleYNumero: 'Juárez 456',
    calle: 'Juárez',
    lada: '33',
    telefono: '11223344',
    aviso: 'AV-2024-003',
    licenciaSanitaria: 'LS-2024-003',
    regimen: '101',
    adunasDeEntradas: '101',
    aeropuerto: true,
    aeropuertoDos: true,
    publico: 'Si',
    representanteRfc: 'REP860512DEF',
    representanteNombre: 'Carlos Alberto',
    apellidoPaterno: 'Hernández',
    apellidoMaterno: 'Silva',
    regimenLaMercancia: 'Importación',
    aduana: 'Guadalajara - Aeropuerto',
    mercancias: [
      {
        clasificacionProducto: 'Dispositivo Médico',
        especificarClasificacionProducto: 'Instrumental Médico',
        denominacionEspecificaProducto: 'Estetoscopio Digital',
        formaFarmaceutica: 'N/A',
        estadoFisico: 'Sólido',
        fraccionArancelaria: '9018.11.01',
        unidadMedidaComercializacion: 'Piezas',
        cantidadUMC: '25',
        unidadMedidaTarifa: 'Piezas',
        cantidadUMT: '25',
        presentacion: 'Piezas',
        numeroRegistroSanitario: 'REG-002-2024',
        paisOrigen: 'Alemania',
        paisProcedencia: 'Estados Unidos',
        tipoProducto: 'Dispositivo Médico',
        usoEspecifico: 'Diagnóstico médico'
      },
    ],
    scian: [
      {
        clave: '311999',
        descripcion: 'Elaboración de otros alimentos'
      }
    ],
    manifesto: 'MAN-2024-003',
    manifiestosCasillaDeVerificacion: true
  }
];
/**
 * @const PROCEDIMIENTOS_NO_PARA_ELEMENTO_COLAPSABLE
 * @description Lista de identificadores de procedimientos que no deben ser utilizados
 *              para elementos colapsables en la aplicación.
 * @type {number[]}
 */
export const PROCEDIMIENTOS_NO_PARA_ELEMENTO_COLAPSABLE = [
  260206, 260214, 260216, 260205, 260217, 260218, 260102, 260301, 260208,
  260207, 260209, 260201, 260219, 260302, 260304, 260103,260203,260213
];

/**
 * @const PROCEDIMIENTOS_NO_PARA_ELEMENTO_TABLA
 * @description Lista de identificadores de procedimientos que no deben ser utilizados
 *              para elementos de tabla en la aplicación.
 * @type {number[]}
 */
export const OCULTAR_PROVEEDOR = [260102, 260101,260103];

/**
 * @const OCULTAR_FACTURADOR
 * @description Lista de identificadores de procedimientos para los cuales el elemento "Facturador" debe ser ocultado en la aplicación.
 *
 * @type {number[]}
 */
export const OCULTAR_FACTURADOR = [260102, 260101,260103];

/**
 * @const PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE
 * @description Lista de identificadores de procedimientos específicos para no contribuyentes.
 * @type {number[]}
 * @example
 * // Ejemplo de uso:
 */
export const PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE = [
  260216, 260208, 260209, 260213, 260911
];

/**
 * @const PROCEDIMIENTOS_NO_PARA_ELEMENTO_CORREO_ELECTRONIC
 * @description Lista de identificadores de procedimientos para los cuales el elemento "Correo Electrónico" no debe ser utilizado en la aplicación.
 *
 * @type {number[]}
 * @example
 * // Ejemplo de uso:
 * if (PROCEDIMIENTOS_NO_PARA_ELEMENTO_CORREO_ELECTRONIC.includes(procedimientoId)) {
 *   // Lógica para ocultar o deshabilitar el elemento "Correo Electrónico"
 * }
 */
export const PROCEDIMIENTOS_NO_PARA_ELEMENTO_CORREO_ELECTRONIC = [
  260301, 260302, 260304,
];

/**
 * @const PROCEDIMIENTOS_NO_PARA_ELEMENTO_RFC_DEL_SANITARIO
 * @description Lista de identificadores de procedimientos para los cuales el elemento "RFC del Sanitario" no debe ser utilizado en la aplicación.
 *
 * @type {number[]}
 * @example
 * // Ejemplo de uso:
 * if (PROCEDIMIENTOS_NO_PARA_ELEMENTO_RFC_DEL_SANITARIO.includes(procedimientoId)) {
 *   // Lógica para ocultar o deshabilitar el elemento "RFC del Sanitario"
 * }
 */
export const PROCEDIMIENTOS_NO_PARA_ELEMENTO_RFC_DEL_SANITARIO = [
  260301, 260208, 260302, 260304, 260103, 260213, 260102, 260101,
];

/**
 * @const PROCEDIMIENTOS_NO_PARA_ELEMENTO_CALLE
 * @description Lista de identificadores de procedimientos que no aplican para el elemento "calle".
 * @type {number[]}
 * @example
 * // Uso:
 * if (PROCEDIMIENTOS_NO_PARA_ELEMENTO_CALLE.includes(procedimientoId)) {
 *   // Lógica para manejar procedimientos no aplicables
 * }
 */
export const PROCEDIMIENTOS_NO_PARA_ELEMENTO_CALLE = [260301, 260302, 260304];

/**
 * @const PROCEDIMIENTOS_NO_PARA_ELEMENTO_REGIMEN_Y_ADUNADEENTRADAS
 * @description Lista de identificadores de procedimientos para los cuales los elementos "Régimen" y "Aduana de Entradas" no deben ser utilizados en la aplicación.
 *
 * @type {number[]}
 * @example
 * // Ejemplo de uso:
 * if (PROCEDIMIENTOS_NO_PARA_ELEMENTO_REGIMEN_Y_ADUNADEENTRADAS.includes(procedimientoId)) {
 *   // Lógica para ocultar o deshabilitar los elementos "Régimen" y "Aduana de Entradas"
 * }
 */
export const PROCEDIMIENTOS_NO_PARA_ELEMENTO_REGIMEN_Y_ADUNADEENTRADAS = [
  260301, 260302, 260304, 260103,
];

/**
 * @const PROCEDIMIENTOS_PARA_DESHABILITAR_MUNICIPIO_ALCALDIA
 * @description Lista de procedimientos específicos que requieren deshabilitar
 * el campo de municipio o alcaldía en la interfaz de usuario.
 * @type {number[]}
 * @example
 * // Ejemplo de uso:
 * if (PROCEDIMIENTOS_PARA_DESHABILITAR_MUNICIPIO_ALCALDIA.includes(codigoProcedimiento)) {
 *   deshabilitarCampoMunicipio();
 * }
 */
export const PROCEDIMIENTOS_PARA_DESHABILITAR_MUNICIPIO_ALCALDIA = [260214];

/**
 * @const PROCEDIMIENTOS_PARA_CORREO_ELECTRONICO_EN_MISMA_FILA
 * @description Lista de identificadores de procedimientos para los cuales el elemento "Correo Electrónico" debe estar en la misma fila en la aplicación.
 *
 * @type {number[]}
 * @example
 * // Ejemplo de uso:
 * if (PROCEDIMIENTOS_PARA_CORREO_ELECTRONICO_EN_MISMA_FILA.includes(procedimientoId)) {
 *   // Lógica para mostrar el elemento "Correo Electrónico" en la misma fila
 * }
 */
export const PROCEDIMIENTOS_PARA_CORREO_ELECTRONICO_EN_MISMA_FILA = [
  260208, 260103, 260102, 260101,
];

/**
 * @const REPRESENTANTE_LEGAL
 * @description Arreglo que contiene los identificadores relacionados con el representante legal.
 * @type {number[]}
 */
export const REPRESENTANTE_LEGAL = [260208,260213];

/**
 * @const BANCO
 * @description Lista de identificadores de procedimientos relacionados con el banco.
 *
 * @type {number[]}
 * @example
 * // Ejemplo de uso:
 * if (BANCO.includes(procedimientoId)) {
 *   // Lógica para manejar procedimientos relacionados con el banco
 * }
 */
export const BANCO = [
  260104, 260208, 260209, 260207, 260201, 260219, 260302, 260304, 260103, 260205, 260216,
  260217, 260218, 260214, 260301, 260102, 260202, 260101,260210,260206,260514,260515,260902,260903,260904,260917,260914,260912,260918
];

export const REQUIRED_BANCO = [260902, 260401, 260402];

/**
 * @const DATOS_MERCANCIA_CAMPO
 * @description Arreglo que contiene los identificadores de los campos relacionados con los datos de mercancía.
 * @type {number[]}
 */
export const DATOS_MERCANCIA_CAMPO = [260208, 260209];

/**
 * @const PROCEDIMIENTOS_PARA_DESHABILITAR_APELLIDO_MATERNO
 * @description Lista de identificadores de procedimientos específicos para los cuales
 * el campo de "Apellido Materno" debe ser deshabilitado en la aplicación.
 * @type {number[]}
 * @example
 * // Ejemplo de uso:
 * if (PROCEDIMIENTOS_PARA_DESHABILITAR_APELLIDO_MATERNO.includes(procedimientoId)) {
 *   deshabilitarCampoApellidoMaterno();
 * }
 */
export const PROCEDIMIENTOS_PARA_DESHABILITAR_APELLIDO_MATERNO = [
  260301, 260207, 260201, 260302, 260304, 260103, 260102, 260214, 260217
];

/**
 * @const PROCEDIMIENTOS_PARA_DESHABILITAR_APELLIDO_PATERNO
 * @description Lista de identificadores de procedimientos específicos que requieren deshabilitar el campo de apellido paterno.
 * @type {number[]}
 * @example
 * // Ejemplo de uso:
 * if (PROCEDIMIENTOS_PARA_DESHABILITAR_APELLIDO_PATERNO.includes(procedimientoId)) {
 *   // Lógica para deshabilitar el campo de apellido paterno
 * }
 */
export const PROCEDIMIENTOS_PARA_DESHABILITAR_APELLIDO_PATERNO = [
  260301, 260207, 260201, 260302, 260304, 260103, 260102, 260214, 260202, 260217
];

/**
 * @const PROCEDIMIENTOS_PARA_DESHABILITAR_NOMBRE_RAZON_SOCIAL
 * @description Lista de códigos de procedimientos específicos que requieren deshabilitar el campo de
 * nombre o razón social en el formulario de solicitud.
 * @type {number[]}
 * @example
 * // Ejemplo de uso:
 * if (PROCEDIMIENTOS_PARA_DESHABILITAR_NOMBRE_RAZON_SOCIAL.includes(codigoProcedimiento)) {
 *   deshabilitarCampoNombreRazonSocial();
 * }
 */
export const PROCEDIMIENTOS_PARA_DESHABILITAR_NOMBRE_RAZON_SOCIAL = [
  260301, 260207, 260201, 260302, 260304, 260103, 260102, 260214, 260202, 260217
];

/**
 * @const DESHABILITADA_EN_INIT
 * @description Lista de identificadores de procedimientos que deben ser deshabilitados en la inicialización.
 * @type {number[]}
 */
export const DESHABILITADA_EN_INIT = [260302, 260214, 260202, 260101];

/**
 * @const SIN_ACCION_AL_INICIAR
 * @description Lista de identificadores de procedimientos que no requieren acción al iniciar.
 * @type {number[]}
 */
export const SIN_ACCION_AL_INICIAR = [260304];

/**
 * @const PROCEDIMIENTOS_PARA_COLONIA_O_EQUIVALENTE
 * @description Lista de identificadores numéricos que representan procedimientos específicos
 *              relacionados con colonias o equivalentes en el sistema.
 * @type {number[]}
 */
export const PROCEDIMIENTOS_PARA_COLONIA_O_EQUIVALENTE = [
  260207, 260208, 260209, 260219, 260214,260904, 260902
];

/**
 * @enum {number}
 * @description Enumeración que define los números de trámite utilizados en la aplicación.
 * @name NUMERO_TRAMITE
 * @property {number} TRAMITE_260205 - Representa el número de trámite 260205.
 * @property {number} TRAMITE_260301 - Representa el número de trámite 260301.
 */
export const NUMERO_TRAMITE = {
  TRAMITE_260103: 260103,
  TRAMITE_260201: 260201,
  TRAMITE_260301: 260301,
  TRAMITE_260210: 260210,

}

/**
 * @const DETALLE_MERCANCIA_TABLA
 * @description Constante que define la configuración de la tabla para mostrar los detalles de mercancía.
 * Cada objeto dentro del arreglo representa una columna de la tabla con su encabezado,
 * clave para acceder al valor correspondiente y el orden en el que se mostrará.
 *
 * @property {string} encabezado - El título de la columna que se mostrará en la tabla.
 * @property {Function} clave - Una función que toma un objeto de tipo `DetalleMercancia` y devuelve el valor correspondiente para la columna.
 * @property {number} orden - El orden en el que se mostrará la columna en la tabla.
 *
 */
export const DETALLE_MERCANCIA_TABLA = [
  {
    encabezado: 'Forma farmacéutica',
    clave: (ele: DetalleMercancia): string => ele.formaFormaceutica,
    orden: 1,
  },
  {
    encabezado: 'Número de registro sanitario',
    clave: (ele: DetalleMercancia): string => ele.numeroDeRegistro,
    orden: 2,
  },
  {
    encabezado: 'Marcas Distintivas',
    clave: (ele: DetalleMercancia): string => ele.marcasDistintivas,
    orden: 3,
  },
  {
    encabezado: 'Presentación',
    clave: (ele: DetalleMercancia): string => ele.tipoDeEnvase,
    orden: 4,
  },
];

/**
 * @const DETALLE_MERCANCIA_TABLA_ESTUPEFACIENTES
 * @description Define una tabla de detalles para mercancías relacionadas con estupefacientes.
 * Cada objeto en la tabla representa una columna con su encabezado, clave de acceso y orden.
 *
 * @property {string} encabezado - El título de la columna que se mostrará en la tabla.
 * @property {Function} clave - Una función que toma un objeto de tipo `DetalleMercanciaEstupefacientes`
 * y devuelve el valor correspondiente para esa columna.
 * @property {number} orden - El orden en el que se mostrará la columna en la tabla.
 * .
 */
export const DETALLE_MERCANCIA_TABLA_ESTUPEFACIENTES = [
  {
    encabezado: 'Presentación',
    clave: (ele: DetalleMercanciaEstupefacientes): string => ele.presentacion,
    orden: 1,
  },
  {
    encabezado: 'Número de piezas',
    clave: (ele: DetalleMercanciaEstupefacientes): string =>
      ele.numeroDePiezasAFabricar,
    orden: 2,
  },
  {
    encabezado: 'Descripción del número de piezas a fabricar',
    clave: (ele: DetalleMercanciaEstupefacientes): string =>
      ele.descripcionNumeroDePiezas,
    orden: 3,
  },
  {
    encabezado: 'Registro Sanitario',
    clave: (ele: DetalleMercanciaEstupefacientes): string =>
      ele.numeroRegistroSanitario,
    orden: 4,
  },
];

/**
 * @const STR_NACIONAL
 * @type {string}
 * @description Constante que representa el valor 'Nacional'.
 * @usage Utilizada para identificar solicitudes de ámbito nacional.
 */
export const STR_NACIONAL = 'Nacional';

/**
 * @const DESCRIPCION_FRACCION_DESHABILITADO_VALOR
 * @type {string}
 * @description Constante que representa el valor deshabilitado para la descripción de la fracción.
 * Este valor se utiliza para identificar fracciones específicas que no pueden ser modificadas.
 *
 * @usage Utilizada en formularios o tablas donde se requiera mostrar una descripción fija para una fracción.
 */
export const DESCRIPCION_FRACCION_DESHABILITADO_VALOR =
  'Algodón absorbente o gasas, con sustancias medicinales';

/**
 * @const UMT_DESHABILITADO_VALOR
 * @description Constante que representa el valor deshabilitado de la unidad de medida utilizada en la aplicación.
 * @type {string}
 * @valor "Kilogramo"
 * @uso Utilizada para identificar solicitudes que requieren una unidad de medida específica.
 */

export const UMT_DESHABILITADO_VALOR = 'Kilogramo';

/** Mensaje mostrado cuando no hay fila seleccionada. */
export const MENSAJE_SIN_FILA_SELECCIONADA = 'Selecciona un registro';

/**
 * Mensaje que se muestra cuando el usuario intenta modificar
 * sin haber seleccionado una fila o ha seleccionado más de una.
 */
export const MODIFICADOR_MENSAJE_NO_FILA_SELECCIONADA =
  'Selecciona sólo un registro para modificar.';

/**
 * Mensaje de confirmación que se muestra antes de eliminar un registro.
 */
export const CONFIRMA_ELIMINACION = '¿Confirma la eliminación?';

/**
 * Mensaje que se muestra cuando los datos han sido eliminados correctamente.
 */
export const DATOS_ELIMINADOS_CORRECTAMENTE = 'Datos eliminados correctamente';

export const MENSAJE_EMERGENTE_DE_CONFIRMACION =
  '¿Estás seguro que deseas eliminar los registros marcados?';
/**
 * @description
 *  Identificadores de notificación.
 */
export const MOSTRAR_NOTIFICACION = [
  260219, 260302, 260304, 260206, 260201, 260103, 260203, 260214, 260301,
  260209, 260205, 260204, 260202,
];

export const ENABLE_FIELDS = [ 260209, 260210, 260208, 260218, 260213 ];

/**
 * Enumera los tipos de actualización que se pueden realizar.
 *
 * - `AGREGAR`: Representa la acción de agregar un nuevo elemento.
 * - `ELIMINAR`: Representa la acción de eliminar un elemento existente.
 */
export enum TIPO_ACTUALIZACION {
  AGREGAR = 'Agregar',
  ELIMINAR = 'Eliminar',
}

/**
 * Constante que representa el identificador para productos especiales.
 *
 * @remarks
 * Utilice esta constante para identificar solicitudes relacionadas con productos de tipo especial.
 */
export const TIPO_PRODUCTO_ESPECIAL = '137';

/**
 * Constante que representa los procedimientos que no son aplicables para manifiestos y declaraciones.
 *
 * @remarks
 * Esta constante se utiliza para filtrar procedimientos que no deben ser considerados en el contexto de manifiestos y declaraciones.
 */
export const PROCEDIMIENTOS_NO_PARA_MANIFIESTOS_Y_DECLARACIONES = [
  260217, 260210, 260218, 260208, 260209, 260301, 260219, 260216, 260302,
  260304, 260205, 260203,
];

/**
 * @const ES_PUNTO_Y_COMA
 * @description Lista de identificadores de procedimientos para los cuales se utiliza punto y coma.
 */
export const ES_PUNTO_Y_COMA = [260210, 260209];

/**
 * Constante que representa el texto del manifiesto y declaraciones.
 *
 * @remarks
 * Este texto se utiliza para informar al usuario sobre los requisitos y normatividad aplicable,
 * así como las sanciones por falsedad de declaraciones.
 */

export const TEXTO_MANIFESTO_Y_DECLARACIONES = `Cumplo con los requisitos y normatividad aplicable, sin que me eximan de que la autoridad sanitaria verifique su
      cumplimiento, esto sin perjuicio de las sanciones en que puedo incurrir por falsedad de declaraciones dadas a una
      autoridad. Asimismo acepto que la notificación de este trámite, sea a través de la Ventanilla Única de Comercio
      Exterior por los mecanismos de la misma.`;

/**
 * Constante que representa los procedimientos para los cuales se debe adjuntar un texto específico.
 */
export const PROCEDIMIENTOS_PARA_TEXTO_ADJUNTAR = [260217, 260218, 260301];


/**
 * @compo
 * @description
 * Arreglo de identificadores de procedimientos para los cuales se debe ocultar el botón "Agregar".
 * Si el procedimiento actual coincide con alguno de estos valores, el botón no será mostrado en la interfaz.
 */
export const PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR = [260904,260911,260203,260204, 260205, 260206,260213, 260215, 260216, 260208, 260201, 260202, 260218, 260210, 260214,260902, 260905, 260217, 260207,260209,260513,260515,260903, 260905,260917,260915,260212,260914,260912, 260918]

/**
 * Constante que representa el código AIFA.
 * @type {string}
 * @value '104'
 * @description Código utilizado para identificar AIFA en el sistema.
 * @remarks Utilice esta constante para referirse a AIFA en diferentes partes de la aplicación.
 */
export const AIFA = '104';

/**
 * Constante que representa el código AICM.
 * @type {string}
 * @value '103'
 * @description Código utilizado para identificar AICM en el sistema.
 * @remarks Utilice esta constante para referirse a AICM en diferentes partes de la aplicación.
 */
export const AICM = '103';

/**
 * Lista de nombres de campos clave utilizados en el formulario de mercancía.
 *
 * @constant
 * @type {string[]}
 * @default ['claveDeLos', 'fechaDeFabricacio', 'fechaDeCaducidad']
 */
export const CAMPOS_CLAVE = [
  'claveDeLos',
  'fechaDeFabricacio',
  'fechaDeCaducidad',
];

/**
 * Lista de identificadores de procedimientos en los que
 * el campo de **Representante Legal** debe inicializarse.
 *
 * Actualmente solo aplica para el procedimiento **260101**.
 *
 * @constant
 * @type {number[]}
 * @example
 * if (REPRESENTANTE_LEGAL_EN_INIT.includes(this.idProcedimiento)) {
 *   // Deshabilitar o aplicar lógica específica al campo Representante Legal
 * }
 */
export const REPRESENTANTE_LEGAL_EN_INIT = [260101,260209,260210,260202,260203,260204,260213, 260218, 260216];



/**
 * @const REPRESENTANTE_LEGAL
 * @description Arreglo que contiene los identificadores relacionados con el representante legal.
 * @type {number[]}
 */
export const FEACCION_AFRACCION_ARANCELARIA_CATALOG = [260213];

/**
 * @const CAMPOS_DESHABILITAR_EN_ELIMINAR_PEDIMENTO
 * @description Mapeo de procedimientos a los campos que deben ser deshabilitados al eliminar un pedimento.
 * Cada clave en el objeto representa un identificador de procedimiento, y su valor asociado es un arreglo
 */
export const PROCEDIMIENTOS_DESHABILITAR_REPRESENTANTE = [260203, 260204, 260205, 260206];

/**
 * @const ES_VALIDO_REGISTRO_O_VENCIMIENTO
 * @description Lista de identificadores de procedimientos para los cuales es válido el registro o vencimiento.
 * @type {number[]}
 */
export const ES_VALIDO_REGISTRO_O_VENCIMIENTO = [260208, 260218];

export const DETALLE_MERCANCIA = [260203];

export const ENABLE_CURP = [260912]