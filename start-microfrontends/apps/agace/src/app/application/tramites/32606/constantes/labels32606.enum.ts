export enum ControladoraLabelEnum {
    /** Texto para confirmar cumplimiento de la regla 7.1.4. */
    CONFIRME = 'Conforme a la regla 7.1.4 primer párrafo, fracciones I a la IV, acredite lo siguiente:',
    /** Texto para operaciones de comercio exterior. */
    OPERACIONES_COMERCIO_EXTERIOR = 'Señale si ha realizado operaciones de comercio exterior durante los últimos dos años anteriores a su solicitud e indique la fecha de inicio de operaciones de comercio exterior.',
    /** Texto para pago de derecho correspondiente. */
    PAGO_DERECHO = 'Señale si ha efectuado el pago del derecho correspondiente a la fecha de presentación de la solicitud, a que se refiere el artículo 40, inciso m) de la LFD, en relación con el Anexo 19 de la RMF vigente a la fecha de presentación de la solicitud del registro.',
    /** Texto para indicar si cuenta con programa IMMEX. */
    CUENTA_PROGRAMA_IMMEX = 'Señale si cuenta con un programa IMMEX.',
    /** Texto para transportistas autorizados. */
    TRANSPORTISTAS = 'Reportar el nombre y clave en el RFC de las empresas transportistas autorizadas para efectuar el traslado de las mercancías de comercio exterior.',
    /** Texto para indicar si cuenta con registro IVA e IEPS. */
    CUENTA_REGISTRO_IVA_IEPS = 'Señale si cuenta con el Registro en el Esquema de Certificación de Empresas en la Modalidad IVA e IEPS conforme la normatividad vigente.',
    /** Texto para modalidad IVA e IEPS. */
    MODALIDAD_IVA_IEPS = 'Modalidad I V A e I E P S',
    /** Texto para fecha de registro. */
    FECHA_REGISTRO = 'Fecha De Registro',
    /** Texto para número de autorización. */
    NUMERO_AUTORIZACION = 'Número de autorización',
    /** Texto para relación de sociedades controladas. */
    RELACION_SOCIEDADES_CONTROLADAS = 'Haga una relación de las sociedades controladas.',
    /** Texto sobre reconocimiento mutuo SAFE. */
    RECONOCIMIENTO_MUTUO = 'La adopción de México de las normas establecidas en el Marco Normativo SAFE de la OMA para Asegurar y Facilitar el Comercio Global publicado por la OMA, donde se incorporan prácticas y normas en materia de seguridad, tiene como uno de sus objetivos, alcanzar el Reconocimiento Mutuo" con aquellos países que cuentan con un programa similar en materia de seguridad, que cumplen con la condición de Operadores Económicos Autorizados de acuerdo al "Marco SAFE" y la legislación de cada país.',
    /** Texto para clasificación de información. */
    CLASIFICACION_INFORMACION = 'La información proporcionada, durante este trámite para el Registro de Certificación de Empresas es clasificada por la empresa como:',
    /** Texto para anexar documento de la SE. */
    ANEXAR_DOCUMENTO = 'Anexar documento emitido por la SE, mediante el cual se acredite que han sido designadas como sociedades controladoras para mejorar las operaciones de manufactura o maquin de dos o más sociedades controladas, respecto de las cuales la controladora participará en materia directa o indirecta y sea administrativa, contraria o capital, cuando una tercera empresa se reserva dicha participación directa o indirecta sobre las otras controladas y la controladora, o bien, cuando una tercera empresa ya sea residente en territorio nacional en el escritorio electrónico directo o indirectamente en la administración, control o en el capital tanto de la sociedad controladora como de las sociedades controladas.',
    /** Texto para anexar diagrama de estructura accionaria. */
    ANEXAR_DOCUMENTO_2 = 'Anexar un diagrama de la estructura accionaria y corporativa, así como copia certificada de las escrituras públicas, en las que conste la participación accionaria de la sociedad controladora y de las sociedades controladas.',
    /** Texto para estrategia de facilitación y control. */
    ESTRATEGIA = 'Por lo tanto, como parte de la estrategia para evitar la duplicación de controles de seguridad y contribuir de manera significativa a la facilitación y control de las mercancías que circulan en la cadena de suministro internacional, es necesario contar con la participación de aquellos que logren obtener el Registro en el Esquema de Certificación de Empresas y autorizar el intercambio de información que permita enriquecer los sistemas informáticos, eliminar y/o reducir la redundancia y/o duplicación de esfuerzos en el proceso de inscripción.',
    /** Texto para autorización de compartir información. */
    AUTORIZACION = 'Por lo anterior y de conformidad con lo dispuesto en el artículo 117 de Ley Federal de Transparencia y Acceso a la Información Pública, autorizo al sujeto obligado denominado SAT, a través de la AGACE, a compartir, difundir o distribuir con otras autoridades nacionales o extranjeras los datos personales y demás información de la empresa que represento, y que se genere durante el transcurso en que la misma se encuentre inscrita en el Registro en el Esquema de Certificación de Empresas'
}

export enum CtpatLabelEnum {
    /** Texto para regla de acreditación. */
    REGLA_ACREDITAR = 'El sistema señala que Conforme a la regla 7.1.4. tercer párrafo y a la 7.1.5., fracción I, segundo párrafo, el solicitante debe acreditar lo siguiente:',
    /** Texto para incluir en anexos. */
    INCLUIR_ANEXOS = 'Incluir en sección de anexos:',
    /** Texto para reporte de validación. */
    REPORTE_VALIDACION = 'El reporte de validación emitido en un periodo no mayor a 3 años a la fecha que se presente la solicitud, a través del cual acredite a la solicitante como socio del programa CBP (CTPAT), con estatus certificado-validado, para cada una de las instalaciones validadas por CBP (CTPAT), así como anexar su correspondiente traducción simple al español. ',
    /** Texto para carta de presentación. */
    CARTA_PRESENTACION = 'Carta de presentación (Cover Letter) original y traducción simple al español',
    /** Texto para autorización de compartir información con CBP. */
    AUTORIZA_COMPARTIR = 'Señale si autorizá a CBP (CTPAT) a compartir información con México, a través de su portal de CTPAT o del mecanismo que la autoridad de dicho país haya definido.',
    /** Texto para cumplimiento de estándares mínimos. */
    CUMPLE_ESTANDARES = 'Señale si las instalaciones que cuentan con la certificación de CBP (CTPAT) y de las cuales no se deberá de presentar el "Perfil de Auto Transportista Terrestre", "Perfil de la empresa" o el "Perfil del Recinto Fiscalizado Estratégico", según corresponda, cumplen con los estándares mínimos en materia de seguridad.',
    /** Texto para suspensión o cancelación por CBP. */
    SUSPENSION_CANCELACION = 'Señale si a la fecha de la presentación de su solicitud se encuentra sujeta a un proceso de suspensión o cancelación por parte de CBP (CTPAT)'
}

export enum DatosLabelEnum {
    /** Texto para sector productivo o servicio. */
    SECTOR_PRODUCTIVO_SERVICIO = 'Señale el sector productivo o servicio al que pertenece',
    /** Nota sobre selección de sector. */
    NOTA_SECTOR = ' Si no encuadra en los sectores o los servicios de los catálogos, deberá seleccionar el más cercano a sus actividades.',
    /** Texto para obligaciones fiscales y aduaneras. */
    OBLIGACIONES_FISCALES = 'Señale si al momento de ingresar su solicitud si se encuentra al corriente en el cumplimiento de sus obligaciones fiscales y aduaneras',
    /** Texto para autorización de opinión SAT. */
    AUTORIZA_OPINION_SAT = 'Indique si autorizó al S A T hacer pública su opinión positiva sobre el cumplimiento de obligaciones fiscales',
    /** Texto para empleados propios registrados ante IMSS. */
    EMPLEADOS_PROPIOS = 'Señale si cuenta con empleados propios para realizar el proceso productivo o la prestación de servicios, registrado ante el I M S S',
    /** Texto para número de empleados propios. */
    NUMERO_EMPLEADOS = 'Cual es el número de empleados propios con los que contó en el último bimestre anterior a su solicitud',
    /** Texto para cumplimiento de ISR de trabajadores. */
    ISR_TRABAJADORES = 'Cumple con la obligación de retener y enterar el I S R de los trabajadores',
    /** Texto para pago de cuotas obrero patronales. */
    CUOTAS_OBRERO_PATRONALES = 'Acredita realizar el pago de cuotas obrero patronales',
    /** Texto para subcontratación de servicios especializados. */
    SUBCONTRATACION = 'Señale si al momento de ingresar su solicitud la empresa solicitante cuenta con subcontratación de servicios especializados o de ejecución de obras especializadas',
    /** Texto para listado de empresas artículo 69. */
    LISTADO_ART_69 = 'Señale si al momento de ingresar su solicitud se encuentra en el listado de empresas publicadas por el SAT en términos del artículo 69, con excepción de lo dispuesto en la fracción VI.',
    /** Texto para listado de empresas artículo 69-B. */
    LISTADO_ART_69B = 'Del mismo modo indique si al momento de ingresar su solicitud se encuentra en el listado de empresas publicadas por el SAT en términos del artículo 69-B, cuarto párrafo del CFF.',
    /** Texto para listado de empresas artículo 69-B Bis. */
    LISTADO_ART_69B_BIS = 'Señale si se encuentra en el listado de empresas publicadas por el SAT en términos del artículo 69-B Bis noveno párrafo del CFF.',
    /** Texto para certificados de sellos digitales vigentes. */
    SELLOS_VIGENTES = 'Señale si sus certificados de sellos digitales están vigentes.',
    /** Texto para supuestos del artículo 17-H Bis. */
    SUPUESTOS_17H_BIS = 'En caso afirmativo señale si se infringió alguno de los supuestos previstos en el artículo 17-H Bis del CFF, durante los últimos doce meses.',
}

export enum DomicillioLabelEnum {
    /** Texto para seleccionar domicilios registrados. */
    SELECCIONE_DOMICILIO = 'Indique todos los domicilios registrados ante el RFC del solicitante e indique aquellos en que se desarrollen actividades relacionadas con su proceso productivo y/o la prestación de servicios.',
    /** Nota sobre domicilios IMMEX y adicionales. */
    NOTA_DOMICILIO = 'De contar con un programa IMMEX activo y vigente al momento de ingresar la solicitud, se mostrarán los domicilios registrados ante la Secretaria de Economía. Así mismo, podrá incluir otros domicilios que se encuentren relacionados con el RFC del solicitante, dando click en el botón "Agregar" y seleccionado la Entidad Federativa.',
    /** Texto para acreditación del inmueble. */
    ACREDITACION_INMUEBLE = 'Acreditación del uso y goce del inmueble *:',
    /** Texto para perfil de la empresa. */
    PERFIL_EMPRESA = 'Perfil de la empresa :',
    /** Texto para actividad de comercio exterior. */
    ACTIVIDAD_COMERCIO_EXTERIOR = 'Realiza actividad economica de comercio exterior *:',
    /** Texto para reconocimiento mutuo CTPAT. */
    RECONOCIMIENTO_MUTUO = 'Reconocimiento Mutuo (Instalación C-TPAT) *:',
    /** Texto para actualización de buzón tributario. */
    ACTUALIZADO_BUZON = 'Señale si tiene actualizado sus medios de contacto para efectos del buzón tributario en términos del penúltimo párrafo del artículo 17-K del CFF.',
    /** Texto para suspensión en padrón de importadores/exportadores. */
    SUSPENDIDA_PADRON = 'Señale si se encuentra suspendida en el Padrón de Importadores o en el Padrón de Importadores de Sectores Específicos o Padrón de Exportadores Sectorial.',
    /** Texto para clientes y proveedores en el extranjero. */
    CLIENTES_PROVEEDORES_EXTRANJERO = 'Anexe un archivo que contenga el nombre y dirección de sus clientes y proveedores en el extranjero directa o indirectamente vinculados con el régimen aduanero con el que se solicita el registro, con los que realizó operaciones de comercio exterior durante los últimos doce meses',
    /** Texto para descargar plantilla de clientes/proveedores extranjeros. */
    DESCARGAR_PLANTILLA_EXTRANJERO = 'Para descargar plantilla del archivo de excel de click',
    /** Texto para registros actuales. */
    REGISTROS_ACTUALES = 'Registros que existen actualmente.',
    /** Texto para proveedores nacionales. */
    PROVEEDORES_NACIONAL = 'Anexe un archivo que contenga el nombre y clave en el R F C de sus proveedores de insumos adquiridos en territorio nacional, vinculados al proceso bajo el régimen que solicita, de los últimos 6 meses',
}

export enum MiembroLabelEnum {
    /** Texto para obligaciones fiscales de socios y representantes. */
    OBLIGACIONES_FISCALES = 'Señale si los socios, accionistas, según corresponda, representante legal con facultad para actos de dominio e integrantes de la administración de conformidad con la constitución de la empresa solicitante, se encuentran al corriente en el cumplimiento de sus obligaciones fiscales.',
    /** Texto para vinculación con empresas canceladas. */
    VINCULACION_CANCELACION = 'Manifieste si sus socios o accionistas, según corresponda, representantes legales con facultad para actos de dominio e integrantes de la administración, no se encuentren vinculados con alguna empresa a la que se le hubiere cancelado su Registro en el Esquema de Certificación de Empresas, de conformidad con la regla 7.2.4., apartado A, fracciones V, VI y VII y apartado B, fracciones II, y III y V y/o de la regla 7.2.5., fracciones VI, VII y XI.',
    /** Texto para solicitud de inspección a instalaciones. */
    SOLICITUD_INSPECCION = 'Una vez manifestado lo anterior, se solicita al SAT, a través de AGACE, que realice las inspecciones a que hace referencia la fracción IX de la regla 7.1.1, a las instalaciones señaladas en las que se realizan las operaciones de comercio exterior con el propósito de verificar la información plasmada en la presente solicitud del Registro en el Esquema Integral de Certificación.',
    /** Texto para protesta de decir verdad. */
    PROTESTA_VERDAD = 'Bajo protesta de decir verdad, manifiesto que los datos asentados en el presente documento son ciertos y que las facultades que me fueron otorgadas para representar al solicitante no me han sido modificadas y/ o revocadas..'
}

export enum QuerellaLabelEnum {
    /** Texto para querella o denuncia penal contra socios o representantes. */
    QUERELLA_SOCIOS = 'Señale si el SAT ha interpuesto querella o denuncia penal en contra de los socios, accionistas, según corresponda, representante legal, e integrantes de la administración de la empresa solicitante o declaratoria de perjuicio, según corresponda, durante los últimos tres años anteriores a la presentación de la solicitud de certificación.',
    /** Texto para sistema de control de inventarios. */
    SISTEMA_CONTROL_INVENTARIOS = 'Indique si cuenta con un sistema de control de inventarios, para el registro de sus operaciones de comercio exterior de conformidad con el artículo 59, fracción I de la Ley.',
    /** Texto para nombre del sistema o datos de identificación. */
    NOMBRE_SISTEMA = 'Nombre del sistema o datos para su identificación',
    /** Texto para lugar de radicación. */
    LUGAR_RADICACION = 'Lugar de radicación',
    /** Texto para indicar cumplimiento de Anexo 24. */
    ANEXO24_CHECK = 'Indique, si cuenta con un sistema de control de inventarios de conformidad con las disposiciones previstas por el Anexo 24.',
    /** Texto para alerta de reporte de saldos. */
    REPORTE_SALDOS_ALERTA = 'Deberá anexar un archivo con el reporte de saldos de mercancía de importación temporal o de mercancías objeto de operaciones de comercio exterior, de un periodo de un mes, que se encuentre dentro de los tres meses anteriores a la presentación de la solicitud.',
    /** Texto para ingreso mensual de información contable. */
    INGRESA_CONTABILIDAD = 'Señale si ingresa mensualmente su información contable a través del portal del SAT, de conformidad con el artículo 28, fracción IV, del CFF y las reglas 2.8.1.5. y la 2.8.1.6. de la RMF.'
}

export enum TercerosLabelEnum {
    /** Texto para RFC del tercero relacionado. */
    RFC_TERCERO = 'Registro Federal de Contribuyentes',
    /** Texto para personas para oír y recibir notificaciones. */
    PERSONAS_NOTIFICACION = 'Personas para oír y recibir notificaciones'
}