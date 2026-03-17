/**
 * @constant CONFIGURACION_TECNOLOGIA
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_TECNOLOGIA = [
    {
        id: 'politicasSeguridad',
        row: 1,
        labelNombre: 'Las políticas y los procedimientos de Tecnologías de la Información y seguridad cibernética deben revisarse anualmente y actualizarse derivado de algún ataque o de acuerdo a situaciones que puedan poner en riesgo los sistemas del Agente Aduanal.',
        campo: 'politicasSeguridad',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'describirMedidas',
        row: 2,
        labelNombre: 'Describir las medidas de seguridad que utiliza para permitir a sus empleados conectarse de forma remota a una red (VPN), para permitir que los empleados accedan a la intranet de la empresa de forma remota cuando se encuentran fuera de la oficina.',
        campo: 'describirMedidas',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
      id: 'empleadosDispositivos',
      row: 3,
      labelNombre: 'Indique si permite que los empleados usen dispositivos personales para realizar el trabajo de la empresa, dichos dispositivos deben cumplir con las políticas y procedimientos de seguridad cibernética de la empresa, las actualizaciones de seguridad deben ser periódicas y contar con método para acceder de forma segura a la red de la empresa.',
      campo: 'empleadosDispositivos',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'comerciales',
      row: 4,
      labelNombre: 'Señalar si los socios comerciales tienen acceso a los sistemas informáticos del Agente Aduanal. En su caso, indique qué programas y cómo controlan el acceso a los mismos.',
      campo: 'comerciales',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [],
      marcadorDePosicion: '',
    },
    {
      id: 'equiposComputo',
      row: 5,
      labelNombre: 'Indique si el equipo de cómputo cuenta con un sistema de respaldo de suministro eléctrico que permita la continuidad del negocio.',
      campo: 'equiposComputo',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [],
      layout: 'horizontal',
      marcadorDePosicion: '',
        opciones: [
          {
          "label": "Si",
          "value": "Si"
         },
          {
          "label": "No",
          "value": "No"
         }
      ]
    },
    {
      id: 'almacenan',
      row: 6,
      labelNombre: 'Cómo y por cuánto tiempo se almacenan los datos (los datos deberían respaldarse una vez a la semana o según corresponda).',
      campo: 'almacenan',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [],
      marcadorDePosicion: '',
    },
    {
      id: 'continuidad',
      row: 7,
      labelNombre: 'Indique el plan de continuidad del negocio en caso de incidente y de cómo recuperar la información.',
      campo: 'continuidad',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [],
      marcadorDePosicion: '',
    },
    {
      id: 'frecuencia',
      row: 8,
      labelNombre: 'Indique la frecuencia y localización de las copias de seguridad y de la información archivada.',
      campo: 'frecuencia',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [],
      marcadorDePosicion: '',
    },
    {
      id: 'almacenan',
      row: 9,
      labelNombre: 'Si las copias de seguridad se almacenan en sitios alternativos a las instalaciones donde se encuentra el centro de proceso de datos.',
      campo: 'almacenan',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [],
      marcadorDePosicion: '',
    },
    {
      id: 'almacenan',
      row: 10,
      labelNombre: 'Indique las pruebas que realiza para la validez de la recuperación de los datos a partir de copias de seguridad.',
      campo: 'almacenan',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [],
      marcadorDePosicion: '',
    },

]

/**
 * @constant CONFIGURACION_TECNOLOGIA_DOS
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_TECNOLOGIA_DOS = [
    {
        id: 'procedimientos',
        row: 1,
        labelNombre: 'Describa los procedimientos referentes a la protección de la información del Agente Aduanal.',
        campo: 'procedimientos',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'politicaPara',
        row: 2,
        labelNombre: 'Enuncie la politica para la protección de los sistemas informáticos del Agente Aduanal de accesos no autorizados y destrucción deliberada o pérdida de la información. Todos los datos sensibles y confidenciales deben almacenarse en un formato cifrado o encriptado.',
        campo: 'politicaPara',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'sistemasMultiples',
        row: 3,
        labelNombre: 'Detalle si opera con sistemas múltiples (sedes/sitios) y cómo se controlan dichos sistemas.',
        campo: 'sistemasMultiples',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'responsableDeLaProteccion',
        row: 4,
        labelNombre: 'Mencione quién es responsable de la protección del sistema informático del Agente Aduanal (la responsabilidad no debería estar limitada a una persona, sino a varias, de forma que cada uno pueda controlar las acciones del resto).',
        campo: 'responsableDeLaProteccion',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'asignarseguridad',
        row: 5,
        labelNombre: 'El acceso de cada usuario debe asignarse a través de cuentas individuales y estar restringido según la descripción del trabajo o las tareas asignadas. Por lo anterior, describa cómo se conceden autorizaciones de acceso y nivel de acceso a los sistemas informáticos (el acceso a la información sensible debe estar limitado al personal autorizado a realizar modificaciones y uso de la información). El acceso autorizado debe monitorearse por parte del área responsable de concederlo, para verificar o en su caso reportar que el acceso a los sistemas confidenciales se basa en los requisitos del trabajo.',
        campo: 'asignarseguridad',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'formatoContrasenas',
        row: 6,
        labelNombre: 'Indicar los elementos o formato que deben tener las contraseñas para el acceso a sistemas de Tecnología de la Información y equipos de cómputo, frecuencia de cambios, si existen otros métodos de autenticación y quién o qué área proporciona esas contraseñas.',
        campo: 'formatoContrasenas',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'nombreDelCortafuego',
        row: 7,
        labelNombre: 'Indicar el nombre del cortafuego "firewall" y anti-virus utilizados (incluir lo relacionado al licenciamiento), debiendo evidenciar que este software de seguridad está activo y recibe actualizaciones periódicas.',
        campo: 'nombreDelCortafuego',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'indiqueLasMedidas',
        row: 8,
        labelNombre: 'Indique las medidas para prevenir el uso de productos tecnológicos falsificados o con licencias incorrectas (software y hardware).',
        campo: 'indiqueLasMedidas',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'todosLosEquipos',
        row: 9,
        labelNombre: 'Todos los equipos de cómputo, medios electrónicos (discos duros, teléfonos celulares, etcétera) y hardware de tecnologías de la información que contengan información confidencial relacionada con el proceso de importación y exportación, deben contabilizarse mediante inventarios periódicos y contar con dicha evidencia. Cuando estos equipos tecnológicos se tengan que desechar, debe existir un procedimiento documentado que incluya como deben formatearse, desinfectarse o destruirse adecuadamente para evitar fuga de información.',
        campo: 'todosLosEquipos',
        clase: 'col-md-12',
        tipoInput: 'radio',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'describaElProcedimiento',
        row: 10,
        labelNombre: 'Describa el procedimiento en el cual indique cómo deben formatearse, desinfectarse o destruirse adecuadamente todos los equipos de cómputo que contengan información confidencial relacionada con el proceso de importación y exportación.',
        campo: 'describaElProcedimiento',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
    },
    {
        id: 'bajaDelPersonal',
        row: 11,
        labelNombre: 'En caso de baja de personal, indique el procedimiento para eliminar al momento de la separacion del empleado, el acceso equipos de cómputo, telecomunicaciones y red, esto incluye cuentas de correo electrónico, cuentas de accesos a sistemas, software, programas, etcétera.',
        campo: 'bajaDelPersonal',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
    },
    {
        id: 'medidasPrevistas',
        row: 12,
        labelNombre: 'Indique las medidas previstas para tratar incidentes en caso de que el sistema se vea comprometido.',
        campo: 'medidasPrevistas',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
    },

]