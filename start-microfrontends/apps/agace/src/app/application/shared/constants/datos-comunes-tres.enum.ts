import { ConfiguracionAporteColumna, ConfiguracionColumna, TablaCampoSeleccion } from "@libs/shared/data-access-user/src";
import { Domicilios, Inventarios, NumeroDeEmpleados, PrincipalesInstalaciones, SeccionSociosIC } from "../models/datos-comunes-tres.model";

export const DATOS_COMUNES = [
  {
    id: 'catseleccionados',
    labelNombre: 'Sector Productivo',
    campo: 'catseleccionados',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0
  },
  {
    id: 'servicio',
    labelNombre: 'Servicio',
    campo: 'servicio',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: '',
    labelNombre: '',
    campo: '',
    clase: 'col-md-12',
    tipoInput: 'custom-html',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 5,
    templateKey: 'customSection1',
  },
  {
    id: 'senaleAduaneras',
    labelNombre: 'Señale si al momento de ingresar su solicitud si se encuentra al corriente en el cumplimiento de sus obligaciones fiscales y aduaneras',
    campo: 'senaleAduaneras',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true
  },
  {
    id: 'indiqueSiAutorizo',
    labelNombre: 'Indique si autorizó al S A T hacer pública su opinión positiva sobre el cumplimiento de obligaciones fiscales',
    campo: 'indiqueSiAutorizo',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true
  },
  {
    id: 'senaleSiCuenta',
    labelNombre: 'Señale si cuenta con empleados propios para realizar el proceso productivo o la prestación de servicios, registrado ante elIMSS',
    campo: 'senaleSiCuenta',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true
  },
  {
    id: 'cualEsElNumero',
    labelNombre: 'Cual es el número de empleados propios con los que contó en el último bimestre anterior a su solicitud',
    campo: 'cualEsElNumero',
    clase: 'col-md-12',
    tipoInput: 'label-only',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 5,
    mostrar: false,
  },
  {
    id: 'empleados',
    labelNombre: 'Número de empleados',
    campo: 'empleados',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    mostrar: false,
  },
   {
    id: 'bimestre',
    labelNombre: 'Bimestre',
    campo: 'bimestre',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    opciones: [],
    mostrar: false,
  },
  {
    id: 'cumpleConLaObligacion',
    labelNombre: 'Cumple con la obligación de retener y enterar el I S R de los trabajadores',
    campo: 'cumpleConLaObligacion',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true
  },
  {
    id: 'acreditaRealizar',
    labelNombre: 'Acredita realizar el pago de cuotas obrero patronales',
    campo: 'acreditaRealizar',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true
  },
  {
    id: 'senaleEspecializadas',
    labelNombre: 'Señale si al momento de ingresar su solicitud la empresa solicitante cuenta con subcontratación de servicios especializados o de ejecución de obras especializadas',
    campo: 'senaleEspecializadas',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true
  },
  {
    id: '',
    labelNombre: '',
    campo: '',
    clase: 'col-md-12',
    tipoInput: 'custom-html',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 5,
    templateKey: 'customSection2',
  },
  {
    id: 'enSuCasoLFT',
    labelNombre: 'En su caso, acredite cumplir con el registro y estar en el padrón a que se refiere el artículo 15 de la LFT.',
    campo: 'enSuCasoLFT',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true,
    mostrar: false,
  },
  {
    id: 'senaleSiAlMomentoFraccionVI',
    labelNombre: 'Señale si al momento de ingresar su solicitud se encuentra en el listado de empresas publicadas por el SAT en términos del artículo 69, con excepción de lo dispuesto en la fracción VI.',
    campo: 'senaleSiAlMomentoFraccionVI',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true,
  },
  {
    id: 'delMismoModo',
    labelNombre: 'Del mismo modo, indique si al momento de ingresar su solicitud se encuentra en el listado de empresas publicadas por el SAT en términos del artículo 69-B, cuarto párrafo del CFF.',
    campo: 'delMismoModo',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true,
  },
  {
    id: 'senaleSiSeEncuentraCFF',
    labelNombre: 'Señale si se encuentra en el listado de empresas publicadas por el SAT en términos del artículo 69-B Bis noveno párrafo del CFF.',
    campo: 'senaleSiSeEncuentraCFF',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true,
  },
  {
    id: 'senaleSiSusCertificados',
    labelNombre: 'Señale si sus certificados de sellos digitales están vigentes.',
    campo: 'senaleSiSusCertificados',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true,
  },
  {
    id: 'enCasoAfirmativoSenale',
    labelNombre: 'En caso afirmativo señale si se infringió alguno de los supuestos previstos en el artículo 17-H Bis del CFF, durante los últimos doce meses.',
    campo: 'enCasoAfirmativoSenale',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true,
  },
  {
    id: 'indiqueTodos',
    labelNombre: '',
    campo: 'indiqueTodos',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    opciones: []
  },
  {
    id: 'indiqueTodosLosDomicilios',
    labelNombre: 'Indique todos los domicilios registrados ante el RFC del solicitante e indique aquellos en que se desarrollen actividades relacionadas con su proceso productivo y/o la prestación de servicios.',
    campo: 'indiqueTodosLosDomicilios',
    clase: 'col-md-12',
    tipoInput: 'label-only',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3,
  },
  {
    id: '',
    labelNombre: '',
    campo: '',
    clase: 'col-md-12',
    tipoInput: 'custom-html',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3,
    templateKey: 'customSection3',
  },
  {
    id: 'senalesiTieneCFF',
    labelNombre: 'Señale si tiene actualizado sus medios de contacto para efectos del buzón tributario en términos del penúltimo párrafo del artículo 17-K del CFF.',
    campo: 'senalesiTieneCFF',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true,
  },
  {
    id: 'senalesiSeSectorial',
    labelNombre: 'Señale si se encuentra suspendida en el Padron de Importadores o en el Padrón de Importadores de Sectores Específicos o Padrón de Exportadores Sectorial',
    campo: 'senalesiSeSectorial',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true,
  },
];

/**
 * Configuración de columnas para la tabla de Número de Empleados.
 * Cada objeto en el arreglo define los detalles de una columna.
 * La clave indica el valor que se mostrará y el orden define la posición de la columna en la tabla.
 */
export const NUMERO_DE_EMPLEADOS_CONFIGURACION: ConfiguracionColumna<NumeroDeEmpleados>[] =
  [
    {
      encabezado: 'Denominacion Social',
      clave: (item: NumeroDeEmpleados) => item.denominacion,
      orden: 1,
    },
    {
      encabezado: 'RFC',
      clave: (item: NumeroDeEmpleados) => item.RFC,
      orden: 2,
    },
    {
      encabezado: 'Numero de Empleados',
      clave: (item: NumeroDeEmpleados) => item.numeroDeEmpleados,
      orden: 3,
    },
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
        encabezado: 'Instalaciones principales',
        clave: (item: Domicilios) => item.instalacionPrincipal,
        orden: 1,
      },
      {
        encabezado: 'Tipo de instalación',
        clave: (item: Domicilios) => item.tipoInstalacion,
        orden: 2,
      },
      {
        encabezado: 'Entidad federativa',
        clave: (item: Domicilios) => item.entidadFederativa,
        orden: 3,
      },
      {
        encabezado: 'Municipio o delegación',
        clave: (item: Domicilios) => item.municipioDelegacion,
        orden: 4,
      },
      {
        encabezado: 'Colonia, calle y número',
        clave: (item: Domicilios) => item.direccion,
        orden: 5,
      },
      {
        encabezado: 'Código postal',
        clave: (item: Domicilios) => item.codigoPostal,
        orden: 6,
      },
      {
        encabezado: 'Registro ante SE/SAT',
        clave: (item: Domicilios) => item.registroSESAT,
        orden: 7,
      },
      {
        encabezado: 'Proceso Productivo',
        clave: (item: Domicilios) => item.procesoProductivo,
        orden: 8,
      },
      {
        encabezado: 'Acredita el uso y Goce del Inmueble',
        clave: (item: Domicilios) => item.acreditaInmueble,
        orden: 9,
      },
      {
        encabezado: 'Realiza operaciones de Comercio Exterior',
        clave: (item: Domicilios) => item.operacionesCExt,
        orden: 10,
      },
      {
        encabezado: 'Reconocimiento Mutuo (Instalación C-TPAT)',
        clave: (item: Domicilios) => item.instalacionCtpat,
        orden: 11,
      },
      {
        encabezado: 'Perfil de la empresa',
        clave: (item: Domicilios) => item.instalacionPerfil,
        orden: 12,
      },
      {
        encabezado: 'Perfil del Recinto Fiscalizado Estratégico',
        clave: (item: Domicilios) => item.instalacionPerfilRFE,
        orden: 13,
      },
      {
        encabezado: 'Perfil del Auto Transportista Terrestre',
        clave: (item: Domicilios) => item.instalacionPerfilAuto,
        orden: 14,
      },
      {
        encabezado: 'Perfil del Transportista Ferroviario',
        clave: (item: Domicilios) => item.instalacionPerfilFerro,
        orden: 15,
      },
      {
        encabezado: 'Perfil del Recinto Fiscalizado',
        clave: (item: Domicilios) => item.instalacionPerfilRf,
        orden: 16,
      },
      {
        encabezado: 'Perfil de Mensajería y Paquetería',
        clave: (item: Domicilios) => item.instalacionPerfilMensajeria,
        orden: 17,
      },
    ];

export const CONTROL_INVENTARIOS = [
  {
    id: 'indiqueSiCuentaFraccionI',
    labelNombre: 'Indique si cuenta con un sistema de control de inventarios, para el registro de sus operaciones de comercio exterior de conformidad con el artículo 59, fracción I de la Ley.',
    campo: 'indiqueSiCuentaFraccionI',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true
  },
  {
    id: 'identificacion',
    labelNombre: 'Nombre del sistema o datos para su identificación',
    campo: 'identificacion',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0
  },
  {
    id: 'lugarDeRadicacion',
    labelNombre: 'Lugar de radicación',
    campo: 'lugarDeRadicacion',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0
  },
  {
    id: 'indiqueAnexo24',
    labelNombre: 'Indique, si cuenta con un sistema de control de inventarios de conformidad con las disposiciones previstas por el Anexo 24.',
    campo: 'indiqueAnexo24',
    clase: 'col-md-12',
    tipoInput: 'checkbox',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 3
  },
]

/**
 * Configuración de las columnas para la visualización de la información de inventarios.
 * Cada columna representa una propiedad de la entidad `Inventarios` y se configura con
 * detalles como la clave, el encabezado, y el tipo de entrada en la tabla.
 */
export const INVENTARIOS_CONFIGURACION: ConfiguracionAporteColumna<Inventarios>[] =
  [
    {
      encabezado: 'Nombre del sistema o datos para su identificación',
      llave: '',
      clave: (item: Inventarios) => item.nombre,
      orden: 1,
      opcionDeEntrada: TablaCampoSeleccion.NONE,
    },
    {
      encabezado: 'Lugar de radicación',
      llave: '',
      clave: (item: Inventarios) => item.lugarRadicacion,
      orden: 2,
      opcionDeEntrada: TablaCampoSeleccion.NONE,
    },
    {
      encabezado:
        'Indique, si cuenta con un sistema de control de inventarios de conformidad con las disposiciones previstas por el Anexo 24.',
      llave: '',
      clave: (item: Inventarios) => item.anexo24,
      orden: 3,
      opcionDeEntrada: TablaCampoSeleccion.CHECKBOX,
    },
  ];

/** Configuración de columnas para Sección de Socios IC */
export const SECCION_SOCIOSIC_CONFIGURACION_COLUMNAS: ConfiguracionColumna<SeccionSociosIC>[] = [
  {
    encabezado: 'Tipo de Persona',
    clave: (item: SeccionSociosIC) => item.tipoPersonaMuestra,
    orden: 1,
  },
  {
    encabezado: 'Nombre',
    clave: (item: SeccionSociosIC) => item.nombreCompleto,
    orden: 1,
  },
  {
    encabezado: 'RFC',
    clave: (item: SeccionSociosIC) => item.rfc,
    orden: 1,
  },
  {
    encabezado: 'En su carácter de',
    clave: (item: SeccionSociosIC) => item.caracterDe,
    orden: 1,
  },
  {
    encabezado: 'Nacionalidad',
    clave: (item: SeccionSociosIC) => item.nacionalidad,
    orden: 1,
  },

  {
    encabezado: 'Obligado a tributar en México',
    clave: (item: SeccionSociosIC) => item.tributarMexico,
    orden: 1,
  },
  {
    encabezado: 'Nombre de la empresa',
    clave: (item: SeccionSociosIC) => item.nombreEmpresa,
    orden: 1,
  },
];

export const MIEMBRO_DE_LA_EMPRESA = [
  {
    id: 'manifiesteSiSusSocios',
    labelNombre: 'Manifieste si sus socios o accionistas, según corresponda, representantes legales con facultad para actos de dominio e integrantes de la administración, no se encuentren vinculados con alguna empresa a la que se le hubiere cancelado su Registro en el Esquema de Certificación de Empresas, de conformidad con la regla 7.2.4., apartado A, fracciones V, VI y VII y apartado B, fracciones II, y III y V y/o de la regla 7.2.5., fracciones VI, VII y XI.',
    campo: 'manifiesteSiSusSocios',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 3,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    gridLayout: true
  },
  {
    id: 'unaVezManifestado',
    labelNombre: 'Una vez manifestado lo anterior, se solicita al SAT, a través de AGACE, que realice las inspecciones a que hace referencia la fracción IX de la regla 7.1.1, a las instalaciones señaladas en las que se realizan las operaciones de comercio exterior con el  de verificar la información plasmada en la presente solicitud del Registro en el Esquema Integral de Certificación.',
    campo: 'unaVezManifestado',
    clase: 'col-md-12',
    tipoInput: 'checkbox',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 3
  },
  {
    id: 'bajoProtestaDeDecir',
    labelNombre: 'Bajo protesta de decir verdad, manifiesto que los datos asentados en el presente documento son ciertos y que las facultades  me fueron otorgadas para representar al solicitante no me han sido modificadas y/ o revocadas.',
    campo: 'bajoProtestaDeDecir',
    clase: 'col-md-12',
    tipoInput: 'checkbox',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 3
  },
] 

export const NUMERO_DE_EMPLEADOS = [
  {
    id: 'subcontrataRFCBusqueda',
    labelNombre: 'RFC',
    campo: 'subcontrataRFCBusqueda',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    row: 1,
  },
  {
    id: 'Buscar',
    labelNombre: 'Buscar',
    campo: 'buscar',
    clase: 'col-md-8',
    tipoInput: 'button',
    desactivado: false,
    marginTop: 5,
    row: 1
  },
  {
    id: 'subcontrataRFC',
    labelNombre: 'Registro Federal de Contribuyentes',
    campo: 'subcontrataRFC',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 3,
    row: 2,
  },
  {
    id: 'subcontrataRazonSocial',
    labelNombre: 'Razon Social',
    campo: 'subcontrataRazonSocial',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    row: 3,
  },
  {
    id: 'subcontrataEmpleados',
    labelNombre: 'Número de empleados',
    campo: 'subcontrataEmpleados',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    row: 4,
  },
  {
    id: 'subcontrataBimestre',
    labelNombre: 'Bimestre',
    campo: 'subcontrataBimestre',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [],
    row: 5,
  },
]

export const PRINCIPALES_INSTALACIONES = [
  {
    id: 'entidadFederativa',
    labelNombre: 'Entidad Federativa',
    campo: 'entidadFederativa',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: []
  },
  {
    id: '',
    labelNombre: '',
    campo: '',
    clase: 'col-md-12',
    tipoInput: 'custom-html',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 5,
    templateKey: 'customSection4',
  },
]

/** Configuración de columnas para Sección de Socios IC */
export const PRINCIPALES_INSTALACIONES_COLUMNA: ConfiguracionColumna<PrincipalesInstalaciones>[] = [
  {
    encabezado: 'Entidad federativa',
    clave: (item: PrincipalesInstalaciones) => item.entidadFederativa,
    orden: 1,
  },
  {
    encabezado: 'Municipio o delegación',
    clave: (item: PrincipalesInstalaciones) => item.municipioDelegacion,
    orden: 2,
  },
  {
    encabezado: 'Colonia, calle y número',
    clave: (item: PrincipalesInstalaciones) => item.colonio,
    orden: 3,
  },
  {
    encabezado: 'Código postal',
    clave: (item: PrincipalesInstalaciones) => item.codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Registro ante SE/SAT',
    clave: (item: PrincipalesInstalaciones) => item.registro,
    orden: 5,
  }
]; 

export const MODIFICAR_INSTALACIONES = [
  {
    id: 'principales',
    labelNombre: 'Instalaciones principales',
    campo: 'principales',
    clase: 'col-md-8',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    layout: 'horizontal'
  },
  {
    id: 'municipio',
    labelNombre: 'Municipio o alcaldía',
    campo: 'municipio',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0
  },
  {
    id: 'tipoDeInstalacion',
    labelNombre: 'Tipo de instalación',
    campo: 'tipoDeInstalacion',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: []
  },
  {
    id: 'modificar_entidadFederativa',
    labelNombre: 'Entidad federativa',
    campo: 'entidadFederativaModificar',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0
  },
  {
    id: 'registroSESAT',
    labelNombre: 'Registro ante SE/SAT',
    campo: 'registroSESAT',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0
  },
  {
    id: 'coloniaDescripcion',
    labelNombre: 'Colonia, calle y número',
    campo: 'coloniaDescripcion',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0
  },
  {
    id: 'modificarCodigoPostal',
    labelNombre: 'Código postal',
    campo: 'modificarCodigoPostal',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0
  },
  {
    id: 'procesoProductivo',
    labelNombre: 'Proceso productivo',
    campo: 'procesoProductivo',
    clase: 'col-md-4',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    layout: 'horizontal'
  },
  {
    id: 'goceDelInmueble',
    labelNombre: 'Acreditación del uso y goce del inmueble',
    campo: 'goceDelInmueble',
    clase: 'col-md-8',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    layout: 'horizontal'
  },
  {
    id: 'empresa',
    labelNombre: 'Perfil de la empresa',
    campo: 'empresa',
    clase: 'col-md-4',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    layout: 'horizontal'
  },
]

export const MODAL_MIEMBRO_DE_LA_EMPRESA = [
  {
    id: 'miembroCaracterDe',
    labelNombre: 'En su caracter de',
    campo: 'miembroCaracterDe',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [],
    row: 1
  },
  {
    id: 'miembroRfc',
    labelNombre: 'RFC',
    campo: 'miembroRfc',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    row: 1,
    mostrar: false
  },
  {
    id: 'Buscar',
    labelNombre: 'Buscar',
    campo: 'buscar',
    clase: 'col-md-4',
    tipoInput: 'button',
    desactivado: false,
    marginTop: 5,
    row: 1,
    mostrar: false
  },
  {
    id: 'miembroTributarMexico',
    labelNombre: 'Obligado a tributar en México',
    campo: 'miembroTributarMexico',
    clase: 'col-md-4',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        label: 'Si',
        value: 'Si',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    layout: 'horizontal',
    row: 2
  },
   {
    id: 'miembroRegistroFederal',
    labelNombre: 'Registro Federal de Contribuyentes',
    campo: 'miembroRegistroFederal',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    row: 2,
    mostrar: false
  },
  {
    id: 'miembroTipoPersonaMuestra',
    labelNombre: 'Tipo de persona',
    campo: 'miembroTipoPersonaMuestra',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [
      {
        id: 1,
        descripcion: "Física"
      },
      {
        id: 2,
        descripcion: "Moral"
      }
    ],
    row: 1,
    mostrar: false
  },
  {
    id: 'miembroNombre',
    labelNombre: 'Nombre (s)',
    campo: 'miembroNombre',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    row: 2,
    mostrar: false
  },
  {
    id: 'miembroNombreEmpresa',
    labelNombre: 'Nombre de la empresa',
    campo: 'miembroNombreEmpresa',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    row: 2,
    mostrar: false
  },
  {
    id: 'miembroNacionalidad',
    labelNombre: 'Nacionalidad',
    campo: 'miembroNacionalidad',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    opciones: [],
    row: 3
  },
  {
    id: 'miembroApellidoPaterno',
    labelNombre: 'Apellido paterno',
    campo: 'miembroApellidoPaterno',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    row: 3,
    mostrar: false
  },
  {
    id: 'miembroApellidoMaterno',
    labelNombre: 'Apellido materno',
    campo: 'miembroApellidoMaterno',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    row: 3,
    mostrar: false
  },
  {
    id: 'miembroNombreCompleto',
    labelNombre: 'Nombre completo',
    campo: 'miembroNombreCompleto',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marcadorDePosicion: '',
    marginTop: 0,
    row: 3,
    mostrar: false
  },
]

/** Tabla con el número de empleados registrados, RFC y bimestre correspondiente. */
export const NUMERO_DE_EMPLEADOS_TABLA = [
  {
    denominacion: 'SINE S.A. de C.V.',
    RFC: 'SIN123456789',
    numeroDeEmpleados: '25',
    bimestre: 'Enero-Febrero'
  }
]

/** Tabla con los domicilios registrados ante el RFC y relacionados con el proceso productivo o prestación de servicios. */
export const DOMICILIO_TABLA = [
  {
    instalacionPrincipal: 'Planta principal',
    cveTipoInstalacion: '01',
    tipoInstalacion: 'Fábrica',
    cveEntidadFederativa: '09',
    entidadFederativa: 'Ciudad de México',
    cveDelegacionMunicipio: '001',
    municipioDelegacion: 'Benito Juárez',
    direccion: 'Av. Insurgentes Sur 1234, Col. Del Valle',
    codigoPostal: '03100',
    registroSESAT: 'REG123456',
    procesoProductivo: 'Manufactura de autopartes',
    acreditaInmueble: 'Contrato de arrendamiento',
    operacionesCExt: 'Sí',
    instalacionCtpat: 'No',
    instalacionPerfil: 'Industrial',
    instalacionPerfilRFE: 'No',
    instalacionPerfilAuto: 'Sí',
    instalacionPerfilFerro: 'No',
    instalacionPerfilRf: 'No',
    instalacionPerfilMensajeria: 'No',
    noExterior: '1234',
    noInterior: '2B',
    cveColonia: '045',
    calle: 'Av. Insurgentes Sur',
    descCol: 'Colonia Del Valle',
    idRecinto: 'REC001'
  }
]

/** Tabla con los datos de los miembros de la empresa. */
export const MIEMBRO_DE_LA_EMPRESA_TABLA = [
  {
    idMiembroEmpresa: '1',
    idSolicitud: 'SOL123',
    tipoPersona: 'Física',
    tipoPersonaMuestra: 'Física',
    nombreCompleto: 'Juan Pérez Ramírez',
    rfc: 'PERJ800101ABC',
    caracterDe: 'Representante Legal',
    nacionalidad: 'Mexicana',
    tipoCaracter: 'Principal',
    paisClave: 'MX',
    tributarMexico: 'Sí',
    nombreEmpresa: 'SINE S.A. de C.V.',
    nombre: 'Juan',
    apellidoPaterno: 'Pérez',
    apellidoMaterno: 'Ramírez',
    razonSocial: 'SINE S.A. de C.V.'
  }
]

/** Opciones para seleccionar entre "Sí" y "No" en formularios. */
export const SI_NO_OPCIONES = [
  {
      "label": "Sí",
      "value": 1
    },
    {
      "label": "No",
      "value": 2
    }
]