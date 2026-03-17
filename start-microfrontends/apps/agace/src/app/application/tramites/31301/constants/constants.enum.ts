import { InputFecha } from '@libs/shared/data-access-user/src';

/**
 * Contiene los mensajes informativos relacionados con la presentación
 * de garantías fiscales como pólizas de fianza y cartas de crédito.
 *
 * Estas notas se utilizan para mostrar textos legales o aclaratorios
 * en la interfaz, en función del tipo de garantía seleccionada por el usuario.
 */
export const NOTA_MENSAJE = {
  node_uno: `Es importante señalar que para cumplir con todos los requisitos
          establecidos en la normatividad vigente, para la aceptación de la
          garantía (póliza de fianza), DEBERÁ presentar en las oficinas de la
          AGACE ubicadas en: Avenida Hidalgo, número 77, Módulo III, Planta
          Baja, Colonia Guerrero, Alcaldía Cuauhtémoc, Ciudad de México, CP
          06300, el original de la póliza de fianza en materia de IVA e IEPS
          emitida en papelería oficial o archivo .xml, según sea el caso.`,
  node_dos: `Dicha póliza de fianza deberá ser presentada mediante escrito libre
          que contenga los requisitos establecidos en los artículos 18 y 18-A
          del Código Fiscal de la Federación, y acreditando la personalidad del
          representante legal de conformidad con el artículo 19 del Código
          Fiscal de la Federación`,
  node_tres: `"Es importante señalar que para cumplir con todos los requisitos
          establecidos en la normatividad vigente, para la aceptación de la
          garantía (póliza de fianza), DEBERÁ presentar en las oficinas de la
          AGACE ubicadas en: Avenida Hidalgo, número 77, Módulo IV, Piso 1,
          Colonia Guerrero, Alcaldía Cuauhtémoc, C.P. 06300, Ciudad de México,
          el original de la carta de crédito en materia de IVA e IEPS emitida en
          hoja membretada de la Institución de Crédito emisora.`,
  node_cuatro: ` Dicha póliza de fianza deberá ser presentada mediante escrito libre
          que contenga los requisitos establecidos en los artículos 18 y 18-A
          del Código Fiscal de la Federación, y acreditando la personalidad del
          representante legal de conformidad con el artículo 19 del Código
          Fiscal de la Federación."`,
};

/**
 * Etiquetas de texto utilizadas en los formularios del sistema
 * para guiar al usuario en la captura de información requerida.
 *
 * Cada clave representa un identificador único que se asocia a una
 * sección, campo o mensaje específico del proceso de solicitud.
 *
 * Estas etiquetas son utilizadas en inputs, preguntas cerradas
 * (sí/no), archivos adjuntos y advertencias legales o fiscales.
 */
export const LABELS = {
  3500: `Señale si al momento de ingresar su solicitud se encuentra al
          corriente en el cumplimiento de sus obligaciones fiscales y
          aduaneras.`,
  3501: `Indique si autorizó al SAT hacer pública su opinión positiva sobre el
          cumplimiento de obligaciones fiscales.`,
  RFC: `Indique la denominación o razón social de los subcontratistas de
          quienes reciba los servicios especializados o la ejecución de obras
          especializadas.`,
  3502: `Indique si cuenta con la totalidad de personal registrado ante el
          IMSS, del SUA, y realiza el pago de las cuotas obrero patronales, así
          como que cumple con la obligación de retener y enterar el ISR de los
          trabajadores.`,
  3503: `Señale si se encuentra en el listado de empresas publicadas por el SAT en términos del artículo 69 del CFF, con excepción de lo dispuesto en la fracción II y VI del referido artículo.`,
  3504: `Del mismo modo indique si se encuentra en el listado de empresas
          publicadas por el SAT en términos del artículo 69-B, párrafo cuarto
          del CFF.`,
  3505: `Indique si se encuentra en el listado de empresas publicadas por el
          SAT en términos del articulo 69-B Bis noveno párrafo, párrafo cuarto
          del CFF.`,
  3506: `Señale si sus certificados de sellos digitales están vigentes.`,
  3507: `Señale si tiene actualizado sus medios de contacto para efectos del
          buzón tributario en términos del artículo 17-K, penúltimo párrafo del
          CFF.`,
  3508: `Señale si se encuentra suspendida en el Padrón de Importadores o en
          el Padrón de Importadores de Sectores Específicos o Padrón de
          Exportadores Sectorial.`,
  file: `Archivo con la totalidad de sus clientes y proveedores en el
          extranjero, directa o indirectamente vinculados con el régimen
          aduanero con el que se solicita la certificación, con los que haya
          realizado operaciones de comercio exterior durante los últimos 12
          meses.`,
  filedos: `Archivo que contiene el RFC de los proveedores de insumos adquiridos
          en territorio nacional, vinculados al proceso bajo el régimen que
          solicita de los últimos 6 meses.`,
  3511: `Señale si el SAT ha interpuesto querella o denuncia penal en contra de los socios, accionistas, representante legal con facultad para actos de dominio, o integrantes de la administración de la empresa solicitante o, en su caso declaratoria de perjuicio, durante los últimos tres años anteriores a la presentación de la solicitud.`,
  3512: `Indique si cuenta con un sistema de control de inventarios, para el registro de sus operaciones de comercio exterior de conformidad
con el artículo 59, fracción I de la Ley.`,
  3513: `Indique, si cuenta con un sistema de control de inventarios de
          conformidad con las disposiciones previstas por el Anexo 24.`,
  3514: `Señale si lleva la contabilidad en medios electrónicos de conformidad
          con el artículo 28, fracción III, del CFF y la regla 2.8.1.5. de la
          RMF.`,
  alertTres: `En caso de declarar que se cuenta con un sistema de control de
            inventarios conforme al anexo 24, deberá anexar un archivo con el
            reporte de saldos de mercancía de importación temporal de un periodo
            de un mes, que se encuentre dentro de los tres meses anteriores a la
            fecha de la presente solicitud.`,
  3515: `Señale si ingresa mensualmente su información contable a través del
          portal del SAT, de conformidad con el artículo 28, fracción IV, del
          CFF y la regla 2.8.1.6. de la RMF.`,
  3516: `Señale si los socios, accionistas, según corresponda, representante
          legal con facultad para actos de administración o de dominio, e
          integrantes de la administración de conformidad con la constitución de
          la empresa solicitante, se encuentran al corriente en el cumplimiento
          de sus obligaciones fiscales.`,
  textoGenerico3: `Opinión positiva vigente del cumplimiento de obligaciones fiscales de
          la solicitante, los socios, accionistas, representante legal con
          facultad para actos de administración o de dominio, administrador
          único o miembros del consejo de administración, según sea el
          caso.`,
  3517: `Manifieste si sus socios o accionistas, e integrantes de la
          administración, su representante legal con facultad para actos de
          administración o de dominio, o sus partes relacionadas en términos de
          la Ley del ISR no se encuentren vinculados con alguna empresa a la que
          se hubiere cancelado su Registro en el Esquema de Certificación de
          Empresas, de conformidad con las fracciones V, VI y VII del Apartado
          A; II y III del Apartado B de la regla 7.2.4 .; y/o VI, VII y XI de la
          regla 7.2.5.`,
  3518: `Indique si sus proveedores se encuentran en el listado de empresas
          publicadas por el SAT, en términos del 69 del CFF, con excepción de la
          fracción VI, articulo 69-B, párrafo cuarto y 69-B Bis noveno párrafo
          del CFF.`,
  3519: `Manifieste si se le ha determinado algún crédito fiscal firme en los
          doce meses anteriores a la fecha de presentación de la
          solicitud.`,
  3520: `Manifieste si cuenta con inversión en territorio nacional y acredita
          la legal posesión de la misma, sin que sea admisible aquella que se
          obtiene de manera gratuita.`,
  3521: `Señale si previamente contó con la Certificación en materia de IVA e
          IEPS, el Registro en el Esquema de Certificación de Empresas bajo la
          modalidad IVA e IEPS o Garantía del interés fiscal del IVA e
          IEPS.`,
  3522: `En caso afirmativo, señale si se encuentra al corriente en el
          cumplimiento de las obligaciones relativas al Anexo 30 sobre dicho
          registro.`,
  domiciliosLabel: `Indique todos los domicilios registrados ante el SAT de la persona
          moral solicitante e indique aquellos en que se desarrollen actividades
          relacionadas con su proceso productivo y/o la prestación de servicios
          (Se requiere tabla, agregar las filas necesarias de acuerdo al número
          de instalaciones).`,
  3523: `Señale si ha realizado operaciones al amparo de su programa
          IMMEX.`,
  3528: `Señale si al momento de su solicitud cuenta con la infraestructura
          necesaria para realizar la operación, el proceso productivo o de
          servicios, según corresponda al régimen aduanero por el que se
          solicita el registro.`,
  3529: `Manifieste si se le ha emitido resolución de improcedencia de las
          devoluciones del IVA cuyo monto represente más del 20% del total de
          las devoluciones autorizadas y/o que el monto negado resultante supere
          los $5,000,000.00 (cinco millones de pesos 00/100 m.n.) en lo
          individual o en su conjunto, durante los últimos seis meses contados a
          partir de la fecha de presentación de la solicitud.`,
  porcentajeLabel: `En caso afirmativo, señale el porcentaje y el monto que representan
          de la totalidad de solicitudes de devolución autorizadas, aquéllas en
          que la autoridad haya emitido resolución de improcedencia.`,
  3530: `Manifiesta que cuenta con la capacidad financiera para llevar a cabo
          su proyecto productivo o de servicios, a través de solvencia económica
          propia o asumiendo la responsabilidad solidaria.`,
  fileUno: `Archivo con monto anual de las importaciones temporales que realizará
          por fracción arancelaria. El monto deberá ser acorde en su capacidad
          productiva y financiera.`,
  3531: `Indique si durante los últimos doce meses ha importado temporalmente
          mercancías y que, al menos el 50% de las importaciones temporales de
          insumos realizadas durante el mismo período fueron transformadas y
          retoradas, retornadas en su mismo estado, transferidas, destruidas, o
          se les prestó un servicio.`,
  textoGenerico9: `Capture el valor en aduana total en moneda nacional de sus
          importaciones temporales de insumos del periodo requerido conforme al
          parrafo anterior`,
  alertInfoUno: ` En caso de haber declarado que realiza Constancias de Transferencia
            de Mercancías (CTM), anexe un archivo con los nombres y domicilios
            de las empresas a las que les transfirió mercancías mediante
            Constancias de Transferencia de Mercancías (CTM), así como los
            montos en moneda nacional y, en su caso, dos Constancias de
            Transferencia de Mercancías (CTM).`,
  alertInfoDos: `Bajo protesta de decir verdad manifiesto, que
            continúo cumpliendo los requisitos establecidos en la regla 7.4.1.,
            7.4.2., 7.4.3. y 7.4.7.`,
  alertInfoTres: `Bajo protesta de decir la verdad, manifiesto que
            los datos asentados en el presente documento son ciertos y que las
            facultades que me fueron otorgadas para representar al solicitante
            no me han sido modificadas y/o revocadas`,
};

/**
 * Opciones disponibles para el tipo de endoso.
 *
 * Contiene las alternativas que el usuario puede seleccionar
 * en relación al tipo de modificación o ampliación de la garantía.
 */
export const TIPO_DE_ENDOSO_OPCION = {
  radioOptions: [
    {
      label: 'Aumento de monto',
      value: 1,
    },
    {
      label: 'Aumento de monto y renovación/ampliación de vigencia',
      value: 2,
    },
    {
      label: 'Modificación de denominación o razón social',
      value: 3,
    },
    {
      label: 'Renovación/ampliación de vigencia',
      value: 4,
    },
  ],
  isRequired: true,
};

/**
 * Opciones disponibles para el tipo de garantía.
 *
 * Define si la garantía será mediante fianza o carta de crédito.
 */
export const TIPO_DE_GARANTIA_OPCION = {
  radioOptions: [
    {
      label: 'Fianza',
      value: 1,
    },
    {
      label: 'Carta de crédito',
      value: 2,
    },
  ],
  isRequired: true,
};

/**
 * Opciones disponibles para la modalidad de la garantía.
 *
 * Define si la garantía es de tipo revolvente o individual.
 */
export const MODALIDAD_DE_LA_GARANTIA_OPCION = {
  radioOptions: [
    {
      label: 'Garantía revolvente',
      value: 1,
    },
    {
      label: 'Garantía individual',
      value: 2,
    },
  ],
  isRequired: true,
};

/**
 * Opciones disponibles para el tipo de sector.
 *
 * Permite seleccionar si la garantía corresponde al sector productivo o de servicios.
 */
export const TIPO_SECTOR_OPCION = {
  radioOptions: [
    {
      label: 'Sector productivo',
      value: 1,
    },
    {
      label: 'Sector servicio',
      value: 2,
    },
  ],
  isRequired: true,
};

/**
 * Catálogo de instituciones de fianza actuales.
 *
 * Contiene la lista de instituciones disponibles para seleccionar en la póliza de fianza actual.
 */
export const SINO_OPCION = {
  radioOptions: [
    {
      label: 'Si',
      value: 1,
    },
    {
      label: 'No',
      value: 2,
    },
  ],
  isRequired: true,
};

/**
 * Catálogo de instituciones de fianza anteriores.
 *
 * Contiene la lista de instituciones que emitieron pólizas de fianza previas.
 */
export const NOMBRE_INSTITUCION_CATALOGO = {
  labelNombre: 'Datos de la póliza de fianza actual',
  required: false,
  primerOpcion: 'Seleccione una opción',
  catalogos: [],
};

/**
 * Catálogo de instituciones de fianza actuales.
 *
 * Similar al catálogo general pero enfocado en la póliza actual.
 */
export const NOMBRE_INSTITUCION_ANTERIOR_CATALOGO = {
  labelNombre: 'Nombre de la institucion de fianza que emite el documento',
  required: false,
  primerOpcion: 'Seleccione una opción',
  catalogos: [],
};

/**
 * Configuración del campo de fecha de fin de vigencia para ampliación.
 */
export const NOMBRE_INSTITUCION_ACTUAL_CATALOGO = {
  labelNombre: 'Datos de la póliza de fianza actual',
  required: false,
  primerOpcion: 'Seleccione una opción',
  catalogos: [],
};

/**
 * Configuración del campo de fecha de inicio de vigencia para ampliación.
 */
export const CONFIGURACION_FECHA_FIN_VIGENCIA: InputFecha = {
  labelNombre: 'Fecha fin de la ampliacion',
  required: true,
  habilitado: false,
};

/**
 * Configuración del campo de fecha de fin de vigencia anterior.
 */
export const CONFIGURACION_FECHA_INICIO_VIGENCIA: InputFecha = {
  labelNombre: 'Fecha inicio de la ampliación',
  required: true,
  habilitado: false,
};

/**
 * Configuración del campo de fecha de inicio de vigencia anterior.
 */
export const CONFIGURACION_FECHA_FIN_ANTERIOR_VIGENCIA: InputFecha = {
  labelNombre: 'Fecha de fin de vigencia',
  required: false,
  habilitado: false,
};

/**
 * Configuración del campo de fecha de fin de vigencia actual.
 */
export const CONFIGURACION_FECHA_INICIO_ANTERIOR_VIGENCIA: InputFecha = {
  labelNombre: 'Fecha de inicio de vigencia',
  required: false,
  habilitado: false,
};

/**
 * Configuración del campo de fecha de fin de vigencia actual.
 */
export const CONFIGURACION_FECHA_FIN_ACTUAL_VIGENCIA: InputFecha = {
  labelNombre: 'Fecha de fin de vigencia',
  required: false,
  habilitado: false,
};

/**
 * Configuración del campo de fecha de inicio de vigencia actual.
 */
export const CONFIGURACION_FECHA_INICIO_ACTUAL_VIGENCIA: InputFecha = {
  labelNombre: 'Fecha de inicio de vigencia',
  required: false,
  habilitado: false,
};
