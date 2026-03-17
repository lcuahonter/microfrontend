/**
 * @archivo certificado-zoosanitario.enum.ts
 * @modulo certificadoZoosanitarioEnum
 * @descripcion
 * Archivo de constantes centralizadas para el trámite 220201 de Certificado Zoosanitario.
 * Contiene todas las configuraciones, textos, mensajes y valores reutilizables del módulo.
 * 
 * @proposito
 * - Centralizar configuraciones y constantes para mantener consistencia
 * - Facilitar el mantenimiento y modificación de textos y valores
 * - Proporcionar una única fuente de verdad para configuraciones del trámite
 * - Mejorar la mantenibilidad mediante separación de lógica y datos
 * 
 * @contenido_principal
 * - Configuración de pasos del proceso de trámite
 * - Textos de ayuda e instrucciones para el usuario
 * - Configuraciones de formularios y validaciones
 * - Mensajes de éxito y alertas del sistema
 * - Valores por defecto y configuraciones de fechas
 * - Contenido de avisos legales y de privacidad
 * 
 * @arquitectura
 * Utiliza el patrón de Constants Module para:
 * - Separar datos de configuración de lógica de negocio
 * - Facilitar testing mediante valores predecibles
 * - Permitir personalización sin modificar código funcional
 * - Mejorar legibilidad y mantenimiento del código
 * 
 * @uso_recomendado
 * Importar constantes específicas en lugar de todo el módulo:
 * ```typescript
 * import { PASOS, TEXTOS_REQUISITOS } from './certificado-zoosanitario.enum';
 * ```
 * 
 * @consideraciones_i18n
 * Aunque actualmente está en español, la estructura permite
 * futura implementación de internacionalización (i18n).
 */

/**
 * @constante PASOS
 * @tipo {Array<{indice: number, titulo: string, activo: boolean, completado: boolean}>}
 * @exportado
 * @descripcion
 * Configuración de los pasos del proceso de trámite del certificado zoosanitario.
 * Define la secuencia completa del flujo de trabajo del usuario.
 * 
 * @estructura_elemento
 * Cada objeto del array contiene:
 * - **indice**: Número secuencial del paso (1, 2, 3...)
 * - **titulo**: Descripción textual mostrada al usuario
 * - **activo**: Indica si el paso está actualmente disponible para interacción
 * - **completado**: Indica si el paso ha sido finalizado exitosamente
 * 
 * @flujo_del_proceso
 * 1. **Capturar solicitud**: Paso inicial donde se ingresan datos básicos
 * 2. **Anexar requisitos**: Carga de documentos requeridos
 * 3. **Firmar solicitud**: Firma digital y finalización del trámite
 * 
 * @estados_posibles
 * - **activo: true, completado: false**: Paso actual en progreso
 * - **activo: false, completado: true**: Paso finalizado exitosamente
 * - **activo: false, completado: false**: Paso no disponible aún
 * 
 * @uso_en_ui
 * - Renderizado de breadcrumbs o stepper components
 * - Control de navegación entre pasos
 * - Validación de acceso a secciones específicas
 * - Indicadores visuales de progreso
 * 
 * @configuracion_inicial
 * Por defecto, solo el primer paso está activo y completado,
 * indicando que es el punto de entrada del proceso.
 * 
 * @modificacion_dinamica
 * Estos valores pueden actualizarse dinámicamente durante
 * el flujo para reflejar el progreso del usuario.
 */
export const PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  }
];

/**
 * @constante TEXTOS_REQUISITOS
 * @tipo {{INSTRUCCIONES: string, ADJUNTAR: string}}
 * @exportado
 * @descripcion
 * Objeto que contiene textos de ayuda e instrucciones para la sección de requisitos.
 * Proporciona orientación clara al usuario sobre el proceso de adjuntar documentos.
 * 
 * @propiedades
 * **INSTRUCCIONES**: Mensaje principal con reglas y orientaciones generales
 * - Explica que algunos documentos pueden ser obligatorios según el caso
 * - Informa sobre la opción de eliminar documentos no requeridos
 * - Describe cómo agregar múltiples documentos del mismo tipo
 * 
 * **ADJUNTAR**: Instrucción específica para adjuntar nuevos documentos
 * - Guía para seleccionar la opción de adjuntar nuevo documento
 * - Indicaciones sobre el botón de acción correspondiente
 * 
 * @formato_contenido
 * Utiliza HTML embebido para:
 * - Estructuración semántica con encabezados `<h6>`
 * - Organización en párrafos `<p>` para mejor legibilidad
 * - Presentación consistente con el diseño de la aplicación
 * 
 * @contexto_uso
 * - Mostrado en tooltips o secciones de ayuda
 * - Renderizado como innerHTML en componentes de Angular
 * - Guía contextual durante el proceso de carga de documentos
 * 
 * @consideraciones_ux
 * - Textos concisos pero informativos
 * - Lenguaje claro y directo para usuarios no técnicos
 * - Instrucciones paso a paso para reducir errores de usuario
 * 
 * @mantenimiento
 * Centralizar estos textos facilita:
 * - Actualizaciones de contenido sin modificar componentes
 * - Revisiones de UX Writing de forma centralizada
 * - Implementación futura de internacionalización
 */
export const TEXTOS_REQUISITOS = {
  INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, selecciónalo y elimínalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,
  ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};

/**
 * @constante MENSAJE_DE_EXITO_ETAPA_UNO
 * @tipo {string}
 * @exportado
 * @descripcion
 * Mensaje de confirmación mostrado al usuario cuando la primera etapa del trámite se completa exitosamente.
 * 
 * @contenido_del_mensaje
 * - **Confirmación de registro**: Informa que la solicitud ha sido registrada exitosamente
 * - **Número temporal**: Proporciona el número de identificación temporal (202758511)
 * - **Aclaración legal**: Especifica que este número no tiene validez legal oficial
 * - **Propósito del número**: Explica que sirve únicamente para identificación interna
 * - **Proceso siguiente**: Indica que el folio oficial se asignará al firmar la solicitud
 * 
 * @importancia_comunicacion
 * Este mensaje es crucial porque:
 * - Tranquiliza al usuario confirmando que su acción fue exitosa
 * - Establece expectativas claras sobre el número temporal
 * - Evita confusiones sobre la validez legal del número mostrado
 * - Orienta sobre los próximos pasos del proceso
 * 
 * @aspectos_legales
 * - Aclara explícitamente que el número temporal NO tiene validez legal
 * - Informa sobre cuándo se asigna el folio oficial (al firmar)
 * - Protege tanto al usuario como a la institución de malentendidos
 * 
 * @contexto_uso
 * - Mostrado en modales de confirmación
 * - Presentado en páginas de resultado exitoso
 * - Incluido en notificaciones de estado del sistema
 * 
 * @experiencia_usuario
 * - Proporciona retroalimentación inmediata y clara
 * - Reduce ansiedad del usuario con confirmación explícita
 * - Educa sobre el proceso institucional
 * 
 * @numero_ejemplo
 * El número 202758511 es un ejemplo representativo que sigue
 * el patrón de numeración temporal del sistema.
 */
export const MENSAJE_DE_EXITO_ETAPA_UNO = `La solicitud ha quedado registrada con el número temporal 202758511. Este no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.`;

/**
 * @constante ZOOSANITARIO_SOLICITANTE_FISICA_NACIONAL
 * @tipo {Array<ConfiguracionCampoFormulario>}
 * @exportado
 * @descripcion
 * Configuración completa de campos para el formulario de solicitante persona física nacional.
 * Define la estructura, validaciones y presentación de cada campo del formulario.
 * 
 * @estructura_campo
 * Cada objeto de configuración contiene:
 * - **labelNombre**: Etiqueta visible para el usuario
 * - **campo**: Nombre del campo en el modelo de datos
 * - **class**: Clases CSS de Bootstrap para layout responsivo
 * - **tipo_input**: Tipo de input HTML (text, email, date, etc.)
 * - **disabled**: Estado de habilitación del campo
 * - **tooltip**: Texto de ayuda contextual (opcional)
 * - **validators**: Array de validaciones requeridas
 * - **placeholder**: Texto de ejemplo en el campo (si aplica)
 * 
 * @campos_configurados
 * 
 * **RFC (Registro Federal de Contribuyentes)**:
 * - Campo deshabilitado (pre-poblado desde autenticación)
 * - Validación requerida
 * - Layout: 4 columnas en pantallas medianas
 * 
 * **Denominación o Razón Social**:
 * - Campo deshabilitado (datos del SAT)
 * - Validación requerida
 * - Layout: 8 columnas (ocupa mayor espacio)
 * 
 * **Actividad Económica Preponderante**:
 * - Campo deshabilitado (información del SAT)
 * - Validación requerida
 * - Layout: 12 columnas (ancho completo)
 * 
 * **Correo Electrónico**:
 * - Campo deshabilitado (desde perfil de usuario)
 * - Validación requerida
 * - Layout: 4 columnas
 * 
 * @patron_disabled
 * Todos los campos están marcados como `disabled: true` porque:
 * - Los datos provienen de sistemas externos (SAT, VUCEM)
 * - Se pre-llenan automáticamente al autenticarse
 * - No deben ser modificables por el usuario en este contexto
 * - Mantienen consistencia con datos oficiales
 * 
 * @uso_en_componentes
 * ```typescript
 * // Iteración sobre la configuración
 * ZOOSANITARIO_SOLICITANTE_FISICA_NACIONAL.forEach(config => {
 *   this.formBuilder.control(config.campo, this.getValidators(config.validators))
 * });
 * ```
 * 
 * @validaciones_implementadas
 * - **required**: Validación de campo obligatorio
 * - Extensible para agregar validaciones personalizadas
 * 
 * @responsive_design
 * Utiliza sistema de grid de Bootstrap:
 * - `col-md-4`: 4/12 columnas en pantallas medianas+
 * - `col-md-8`: 8/12 columnas en pantallas medianas+
 * - `col-md-12`: Ancho completo en pantallas medianas+
 */
export const ZOOSANITARIO_SOLICITANTE_FISICA_NACIONAL = [
  {
    labelNombre: 'Registro federal de contribuyentes:',
    campo: 'rfc',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'Registro federal de contribuyentes:',
    validators: ['required'],
    placeholder: '',
  },
  {
    labelNombre: 'Denominación o razón social:',
    campo: 'nombreRazonSocial',
    class: 'col-md-8',
    tipo_input: 'text',
    disabled: true,
    tooltip: 'Denominación o razón social',
    validators: ['required'],
    placeholder: '',
  },
  {
    labelNombre: 'Actividad económica preponderante:',
    campo: 'actEconomica',
    class: 'col-md-12',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
  {
    labelNombre: 'Correo electrónico',
    campo: 'correo',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
];

/**
 * @constante FECHA_DE_PAGO
 * @tipo {{labelNombre: string, required: boolean, habilitado: boolean}}
 * @exportado
 * @descripcion
 * Configuración específica para el campo de fecha de pago en formularios del trámite zoosanitario.
 * 
 * @propiedades_configuracion
 * **labelNombre**: 'Fecha de pago'
 * - Etiqueta descriptiva mostrada al usuario
 * - Texto claro e identificable para el contexto de pagos
 * 
 * **required**: true
 * - Campo obligatorio para completar el trámite
 * - Validación requerida antes de envío del formulario
 * - Crítico para procesos de facturación y contabilidad
 * 
 * **habilitado**: false
 * - Campo deshabilitado por defecto
 * - Posible llenado automático por el sistema
 * - Control administrativo sobre fechas de pago
 * 
 * @contexto_negocio
 * La fecha de pago es fundamental porque:
 * - Determina la vigencia del certificado zoosanitario
 * - Establece tiempos límite para el proceso
 * - Requerida para auditorías y reportes financieros
 * - Necesaria para cálculo de tarifas y recargos
 * 
 * @estado_deshabilitado
 * El campo inicia deshabilitado para:
 * - Prevenir fechas inválidas o futuras
 * - Permitir al sistema asignar fecha automáticamente
 * - Mantener control administrativo sobre fechas oficiales
 * - Evitar errores de captura por parte del usuario
 * 
 * @habilitacion_condicional
 * Se puede habilitar dinámicamente cuando:
 * - El usuario tiene permisos especiales
 * - Se requiere corrección de fecha por parte del solicitante
 * - En modo de edición para administradores
 * 
 * @integracion_formularios
 * ```typescript
 * // Uso en FormBuilder
 * fechaPago: this.fb.control({
 *   value: '', 
 *   disabled: !FECHA_DE_PAGO.habilitado
 * }, FECHA_DE_PAGO.required ? Validators.required : null)
 * ```
 */
export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha de pago',
  required: true,
  habilitado: false,
};

/**
 * @constante TEXTOS
 * @tipo {string}
 * @exportado
 * @descripcion
 * Mensaje informativo para guiar al usuario sobre el requisito mínimo de agregar mercancía.
 * 
 * @proposito_mensaje
 * - Informa al usuario sobre requisitos obligatorios del trámite
 * - Previene errores de envío de formularios incompletos
 * - Guía la continuidad del flujo de trabajo
 * - Establece expectativas claras sobre el proceso
 * 
 * @contexto_aplicacion
 * Se muestra cuando:
 * - El usuario intenta continuar sin agregar mercancía
 * - En validaciones de formulario antes del envío
 * - Como texto de ayuda en secciones relevantes
 * - En mensajes de error o advertencia
 * 
 * @importancia_mercancia
 * La mercancía es fundamental porque:
 * - Es el objeto principal del certificado zoosanitario
 * - Define los requisitos sanitarios aplicables
 * - Determina las validaciones necesarias
 * - Establece el alcance del certificado
 * 
 * @experiencia_usuario
 * - Mensaje claro y directo
 * - Explica la razón del requisito
 * - Orienta sobre la acción necesaria
 * - Previene frustración por errores de validación
 * 
 * @ubicacion_tipica
 * - Secciones de mercancía en formularios
 * - Modales de validación
 * - Tooltips informativos
 * - Mensajes de error de validación
 */
export const TEXTOS =
  'Para continuar con el trámite, deberá agregar por lo menos una mercancía.';

/**
 * @constante TERCEROR_TEXTO_DE_ALERTA
 * @tipo {string}
 * @exportado
 * @descripcion
 * Mensaje de alerta para informar al usuario sobre tablas obligatorias en la sección de terceros.
 * 
 * @contenido_informativo
 * - **Identificación visual**: Menciona el asterisco (*) como indicador de obligatoriedad
 * - **Requisito mínimo**: Especifica que debe agregar al menos un registro
 * - **Contexto de aplicación**: Se refiere específicamente a tablas de terceros
 * - **Acción requerida**: Clarifica qué debe hacer el usuario
 * 
 * @proposito_alerta
 * - Prevenir errores de validación al enviar formularios incompletos
 * - Educar al usuario sobre convenciones de la interfaz (asterisco = obligatorio)
 * - Establecer expectativas claras sobre requisitos mínimos
 * - Guiar la completitud de la información de terceros
 * 
 * @contexto_terceros
 * Los terceros pueden incluir:
 * - Transportistas autorizados
 * - Intermediarios en el proceso
 * - Responsables de mercancía
 * - Entidades certificadoras
 * - Otros participantes en la cadena logística
 * 
 * @importancia_terceros
 * La información de terceros es crítica para:
 * - Trazabilidad completa de la mercancía
 * - Cumplimiento de regulaciones sanitarias
 * - Responsabilidades legales en el proceso
 * - Auditorías y verificaciones posteriores
 * 
 * @patron_ui_asterisco
 * El asterisco (*) es una convención estándar que indica:
 * - Campos o secciones obligatorias
 * - Información requerida para procesar el trámite
 * - Validaciones que se aplicarán al enviar
 * 
 * @ubicacion_mensaje
 * - Headers de secciones de terceros
 * - Tooltips explicativos
 * - Mensajes de validación
 * - Ayuda contextual en formularios
 * 
 * @experiencia_usuario
 * - Reduce errores mediante orientación preventiva
 * - Clarifica requisitos antes de interacción
 * - Mejora comprensión de la interfaz
 */
export const TERCEROR_TEXTO_DE_ALERTA =
  'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';

/**
 * @constante IDDEUSUARIO
 * @tipo {number}
 * @exportado
 * @descripcion
 * Identificador numérico por defecto utilizado para operaciones de desarrollo y testing.
 * 
 * @valor_actual
 * 21 - Identificador numérico fijo para entornos de desarrollo
 * 
 * @casos_uso
 * - **Desarrollo local**: Simular sesiones de usuario sin autenticación completa
 * - **Testing unitario**: Proporcionar ID consistente para pruebas
 * - **Pruebas de integración**: Facilitar testing de flujos completos
 * - **Datos de demostración**: Generar contenido de ejemplo
 * 
 * @consideraciones_seguridad
 * ⚠️ **IMPORTANTE**: Este valor NO debe usarse en producción
 * - Solo para entornos de desarrollo y testing
 * - En producción debe obtenerse del contexto de autenticación
 * - No representa un usuario real del sistema
 * 
 * @reemplazo_produccion
 * ```typescript
 * // Desarrollo
 * const userId = IDDEUSUARIO;
 * 
 * // Producción
 * const userId = this.authService.getCurrentUserId();
 * ```
 * 
 * @ambiente_condicional
 * Uso recomendado con validación de ambiente:
 * ```typescript
 * const userId = environment.production 
 *   ? this.authService.getCurrentUserId()
 *   : IDDEUSUARIO;
 * ```
 * 
 * @proposito_testing
 * - Facilita pruebas reproducibles
 * - Evita dependencias de autenticación en tests
 * - Permite aislamiento de componentes
 * - Simplifica setup de datos de prueba
 * 
 * @migracion_recomendada
 * Para transición a producción:
 * 1. Identificar todos los usos de esta constante
 * 2. Reemplazar con servicios de autenticación apropiados
 * 3. Implementar validaciones de usuario real
 * 4. Remover la constante de builds de producción
 */
export const IDDEUSUARIO = 21;

/**
 * @constante FECHAPAGODATE
 * @tipo {string}
 * @exportado
 * @descripcion
 * Fecha por defecto utilizada para testing y desarrollo en formato DD/MM/YYYY.
 * 
 * @formato_fecha
 * '15/03/2025' - Formato día/mes/año estándar mexicano
 * - **Día**: 15 (mediados de mes)
 * - **Mes**: 03 (marzo)
 * - **Año**: 2025 (año futuro para evitar vencimientos)
 * 
 * @proposito_desarrollo
 * - **Testing**: Fecha consistente para pruebas unitarias
 * - **Desarrollo**: Valor por defecto para formularios de pago
 * - **Demostración**: Fecha de ejemplo en demos y presentaciones
 * - **Fallback**: Valor de respaldo cuando no hay fecha disponible
 * 
 * @consideraciones_formato
 * - Compatible con controles de fecha de Angular Material
 * - Sigue convenciones de fecha mexicanas (DD/MM/YYYY)
 * - Formato esperado por componentes de calendario
 * - Parseado correcto por bibliotecas de fechas (moment.js, date-fns)
 * 
 * @validaciones_fecha
 * Al usar esta fecha considerar:
 * - Validar que no sea fecha pasada al procesar pagos reales
 * - Verificar compatibilidad con rangos de fechas permitidos
 * - Ajustar según políticas de vencimiento de certificados
 * 
 * @conversion_tipica
 * ```typescript
 * // String a Date object
 * const fecha = new Date(FECHAPAGODATE.split('/').reverse().join('-'));
 * 
 * // Para Angular Material DatePicker
 * const fechaMaterial = moment(FECHAPAGODATE, 'DD/MM/YYYY').toDate();
 * ```
 * 
 * @ambiente_produccion
 * En producción reemplazar por:
 * - Fecha actual del sistema
 * - Fecha calculada según políticas de negocio
 * - Fecha ingresada por el usuario
 * - Fecha obtenida de servicios de pago
 * 
 * @actualizacion_anual
 * Considerar actualizar el año periódicamente para:
 * - Mantener fechas futuras válidas
 * - Evitar errores de validación de vencimiento
 * - Asegurar relevancia en demostraciones
 */
export const FECHAPAGODATE = '15/03/2025'

/**
 * @constante SELECCIONADO
 * @tipo {string}
 * @exportado
 * @descripcion
 * Mensaje informativo que explica al usuario la funcionalidad de doble clic para duplicar solicitudes.
 * 
 * @funcionalidad_explicada
 * - **Acción**: Doble clic en registro seleccionado
 * - **Resultado**: Creación de nueva solicitud
 * - **Contenido**: Mismos datos de la solicitud elegida
 * - **Propósito**: Facilitar creación de solicitudes similares
 * 
 * @beneficios_usuario
 * - **Ahorro de tiempo**: Evita re-captura de datos similares
 * - **Consistencia**: Mantiene información común entre solicitudes
 * - **Eficiencia**: Reduce errores de transcripción
 * - **Productividad**: Acelera procesos repetitivos
 * 
 * @contexto_negocio
 * Útil para usuarios que:
 * - Procesan múltiples solicitudes con datos similares
 * - Manejan solicitudes para el mismo solicitante
 * - Requieren variaciones menores en solicitudes base
 * - Trabajan con plantillas de solicitudes frecuentes
 * 
 * @experiencia_usuario
 * - **Instrucción clara**: Explica exactamente qué hacer (doble clic)
 * - **Expectativa definida**: Describe qué sucederá (nueva solicitud)
 * - **Contexto específico**: Se refiere al registro seleccionado
 * - **Beneficio evidente**: "mismos datos" implica ahorro de trabajo
 * 
 * @ubicacion_mensaje
 * - Tooltips en tablas de solicitudes
 * - Ayuda contextual en listados
 * - Mensajes de orientación en interfaces
 * - Documentación de funcionalidades
 * 
 * @patron_interaccion
 * Implementa el patrón común de:
 * - Selección simple → Vista/edición
 * - Doble clic → Acción especial (duplicar)
 * - Consistente con convenciones de software de escritorio
 * 
 * @consideraciones_tecnicas
 * Al implementar esta funcionalidad:
 * - Validar que hay registro seleccionado
 * - Limpiar campos únicos (IDs, números de folio)
 * - Establecer estado apropiado (borrador)
 * - Preservar datos relevantes para duplicación
 */
export const SELECCIONADO = 'Al dar doble clic en el registro seleccionado creara una nueva solicitud con los mismos datos de la solicitud elegida';
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
 * @constante PRIVACY_NOTICE_CONTENT
 * @tipo {string}
 * @exportado
 * @descripcion
 * Contenido HTML completo del aviso de privacidad simplificado para el sistema VUCEM.
 * Contiene información legal requerida sobre el tratamiento de datos personales.
 * 
 * @estructura_legal
 * **Encabezado**: "Aviso de privacidad simplificado"
 * - Identifica claramente el tipo de documento
 * - Cumple con nomenclatura legal estándar
 * - Diferencia del aviso integral
 * 
 * **Responsable**: Servicio de Administración Tributaria (SAT)
 * - Sujeto obligado según la ley
 * - Responsable del tratamiento de datos
 * - Autoridad competente identificada
 * 
 * **Medio de recolección**: Ventanilla Digital Mexicana de Comercio Exterior (VUCEM)
 * - Plataforma oficial de recolección
 * - Sistema autorizado gubernamental
 * - Canal digital oficial
 * 
 * @finalidades_tratamiento
 * Los datos personales se utilizan para:
 * - **Trámites de comercio exterior**: Importaciones, exportaciones, tránsito
 * - **Regulaciones no arancelarias**: Cumplimiento de restricciones específicas
 * - **Consultas de información**: Procedimientos y requisitos
 * - **Notificaciones**: Comunicaciones derivadas de trámites
 * 
 * @transferencias_datos
 * - **Autoridades competentes**: Según Decreto del 14 de enero de 2011
 * - **Titular de la información**: El propio usuario
 * - **Base legal**: Decreto de establecimiento de VUCEM
 * - **Publicación**: Diario Oficial de la Federación
 * 
 * @derechos_titular
 * - **Manifestar negativa**: Para tratamientos que requieren consentimiento
 * - **Consulta de aviso integral**: Disponible en el portal oficial
 * - **Acceso a información completa**: Derechos ARCO implícitos
 * 
 * @estructura_html
 * Utiliza elementos semánticos:
 * - **div.my-4**: Márgenes verticales para espaciado
 * - **h4.mb-4**: Encabezado principal con margen inferior
 * - **p.text-justify**: Párrafos justificados para mejor legibilidad
 * - **div.text-center**: Centrado para enlaces importantes
 * - **a.text-primary**: Enlaces estilizados con color primario
 * 
 * @cumplimiento_normativo
 * - **Ley Federal de Protección de Datos Personales**
 * - **Lineamientos del IFAI/INAI**
 * - **Decretos presidenciales sobre VUCEM**
 * - **Normatividad de comercio exterior**
 * 
 * @interaccion_usuario
 * ```html
 * <!-- Enlace para aviso integral -->
 * <a (click)="seccionStore.establecerSeccion([false])">
 *   Aviso de privacidad integral
 * </a>
 * ```
 * 
 * @consideraciones_implementacion
 * - **innerHTML seguro**: Validar contenido antes del renderizado
 * - **Event binding**: Configurar correctamente clicks en enlaces
 * - **Responsive**: Asegurar legibilidad en dispositivos móviles
 * - **Accesibilidad**: Considerar lectores de pantalla
 * 
 * @actualizaciones_legales
 * Este contenido debe revisarse cuando:
 * - Cambien las leyes de protección de datos
 * - Se modifiquen decretos relacionados con VUCEM
 * - Actualicen las finalidades del tratamiento
 * - Cambien las autoridades responsables
 */
export const PRIVACY_NOTICE_CONTENT = `
  <div class="my-4">
  <div class="text-center">
    <h4 class="mb-4">Aviso de privacidad simplificado</h4>
    </div>
    <div>
    <p class="text-justify">
      El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.
    </p>
    </div>
    <div class="text-center">
      <a class="text-primary" style="cursor: pointer;" (click)="seccionStore.establecerSeccion([false])">
        Aviso de privacidad integral
      </a>
    </div>
  </div>
`;
