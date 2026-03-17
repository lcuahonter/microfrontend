/**
 * @archivo tramite240305Store.store.ts
 * @modulo tramite240305
 * @descripcion
 * Store de Akita que maneja el estado completo del trámite 240305 de SEDENA.
 * Centraliza toda la información del flujo de solicitud de modificación de permiso
 * ordinario para importación de substancias químicas y artificios pirotécnicos.
 * 
 * @patron_arquitectonico
 * Implementa el patrón Store de Akita para:
 * - **Estado centralizado**: Un único punto de verdad para todos los datos del trámite
 * - **Inmutabilidad**: Actualizaciones del estado de forma inmutable y predecible
 * - **Reactividad**: Notificación automática a componentes suscritos sobre cambios
 * - **Persistencia**: Posibilidad de serialización y recuperación del estado
 * 
 * @responsabilidades_store
 * - Gestionar el estado de todas las pestañas del formulario
 * - Mantener la información de destinatarios finales y proveedores
 * - Controlar los datos de pago de derechos y mercancías
 * - Almacenar la justificación del trámite y datos generales
 * - Proporcionar métodos para actualización reactiva del estado
 * 
 * @ciclo_vida_datos
 * 1. **Inicialización**: Estado limpio con valores por defecto
 * 2. **Captura**: Actualización progresiva según avanza el usuario
 * 3. **Validación**: Los datos se validan antes de persistir cambios
 * 4. **Persistencia**: Estado puede guardarse temporalmente o enviarse
 * 5. **Reset**: Capacidad de reiniciar el estado para nuevos trámites
 */

import { DatosDelTramiteFormState, JustificacionTramiteFormState } from '../../../shared/models/datos-del-tramite.model';
import { DestinoFinal } from '../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaDetalle } from '../../../shared/models/datos-del-tramite.model';
import { PagoDerechosFormState } from '../../../shared/models/pago-de-derechos.model';
import { Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * @interface Tramite240305State
 * @descripcion
 * Interfaz que define la estructura completa del estado del trámite 240305.
 * Representa todos los datos que el usuario puede capturar a lo largo del flujo,
 * organizados de manera lógica y tipada para garantizar la integridad de los datos.
 *
 * @estructura_datos
 * El estado se organiza en las siguientes secciones principales:
 * - **Navegación**: Control de pestañas y flujo del usuario
 * - **Terceros**: Información de proveedores y destinatarios finales
 * - **Financiero**: Datos de pago de derechos y referencias bancarias
 * - **Mercancías**: Detalle de productos a importar
 * - **Trámite**: Información general y justificación del procedimiento
 * 
 * @relaciones_modelos
 * Utiliza modelos compartidos del sistema:
 * - **DatosDelTramiteFormState**: Datos generales del procedimiento
 * - **JustificacionTramiteFormState**: Justificación técnica del trámite
 * - **DestinoFinal[]**: Lista de destinatarios finales autorizados
 * - **Proveedor[]**: Lista de proveedores registrados
 * - **PagoDerechosFormState**: Información de pagos realizados
 * - **MercanciaDetalle[]**: Especificaciones de productos a importar
 * 
 * @validaciones_estado
 * - Todos los arrays se inicializan vacíos para evitar errores null/undefined
 * - Los objetos de formulario tienen valores por defecto definidos
 * - La pestaña seleccionada tiene un valor numérico válido
 * - Los datos mantienen consistencia con las validaciones de negocio
 * 
 * @property {number} [tabSeleccionado] - Pestaña actualmente activa en el flujo (1-n).
 * @property {DestinoFinal[]} destinatarioFinalTablaDatos - Lista de destinatarios finales registrados para recibir mercancías.
 * @property {Proveedor[]} proveedorTablaDatos - Lista de proveedores autorizados para suministrar productos.
 * @property {PagoDerechosFormState} pagoDerechos - Información completa del formulario de pago de derechos gubernamentales.
 * @property {MercanciaDetalle[]} merccancialTablaDatos - Lista detallada de mercancías a importar con especificaciones técnicas.
 * @property {DatosDelTramiteFormState} datosDelTramite - Información general del formulario principal de datos del trámite.
 * @property {JustificacionTramiteFormState} justificacionTramiteFormState - Estado del formulario de justificación técnica del procedimiento.
 */
export interface Tramite240305State {
  idSolicitud?: number,
  tabSeleccionado?: number;
  destinatarioFinalTablaDatos: DestinoFinal[];
  proveedorTablaDatos: Proveedor[];
  pagoDerechos: PagoDerechosFormState;
  merccancialTablaDatos: MercanciaDetalle[];
  datosDelTramite: DatosDelTramiteFormState;
  justificacionTramiteFormState: JustificacionTramiteFormState;

  /**
  * Objeto de destinatario que se está modificando actualmente (si aplica).
  */
  modificarDestinarioDatos?: DestinoFinal | null;

  /**
   * Objeto de proveedor que se está modificando actualmente (si aplica).
   */
  modificarProveedorDatos?: Proveedor | null;
}

/**
 * @function createInitialState
 * @descripcion
 * Función factory que crea y retorna el estado inicial limpio para el trámite 240305.
 * Establece valores por defecto seguros y consistentes para todos los campos del formulario,
 * garantizando que la aplicación inicie en un estado válido y predecible.
 * 
 * @proposito_inicializacion
 * - **Estado limpio**: Garantiza que no hay datos residuales de sesiones anteriores
 * - **Valores seguros**: Todos los campos tienen valores por defecto que evitan errores null/undefined
 * - **Configuración inicial**: Establece la pestaña inicial y configuraciones predeterminadas
 * - **Arrays vacíos**: Inicializa colecciones vacías listas para recibir datos del usuario
 * 
 * @valores_por_defecto
 * - **tabSeleccionado: 1**: Inicia en la primera pestaña del flujo
 * - **Arrays vacíos []**: Listas de destinatarios, proveedores y mercancías sin datos
 * - **pagoDerechos**: Objeto con todas las propiedades de pago inicializadas como strings vacíos
 * - **datosDelTramite**: Configuración inicial con valores específicos del trámite
 * - **justificacionTramiteFormState**: Campo de justificación vacío listo para captura
 * 
 * @configuraciones_especificas
 * En datosDelTramite se establecen valores iniciales importantes:
 * - **unoSemestre: "dosSemestre"**: Configuración de período por defecto
 * - **anoEnCurso: true**: Indica que aplica para el año en curso
 * - **aduanasSeleccionadas: []**: Array vacío para selecciones de aduanas
 * 
 * @patron_inmutabilidad
 * Cada llamada a esta función crea un objeto completamente nuevo,
 * garantizando que no hay referencias compartidas que puedan causar efectos secundarios.
 * 
 * @uso_sistema
 * - Llamada automática en el constructor del store
 * - Utilizada en operaciones de reset del formulario
 * - Referenciada en pruebas unitarias para estados conocidos
 * - Base para operaciones de clonación de estado
 * 
 * @returns {Tramite240305State} El estado inicial completo y limpio del store con todos los valores por defecto establecidos.
 */
export function createInitialState(): Tramite240305State {
  return {
    idSolicitud: undefined,
    tabSeleccionado: 1,
    destinatarioFinalTablaDatos: [],
    proveedorTablaDatos: [],
    pagoDerechos: {
      claveReferencia: '',
      cadenaDependencia: '',
      banco: '',
      llavePago: '',
      fechaPago: '',
      importePago: '',
    },
    merccancialTablaDatos: [],
    datosDelTramite: {
      permisoGeneral: '',
      usoFinal: '',
      aduanasSeleccionadas: [],
      paisDestino: '',
      unoSemestre: "dosSemestre",
      anoEnCurso: true
    },
    justificacionTramiteFormState: {
      justificacion: ''
    }
  };
}

/**
 * @class Tramite240305Store
 * @extends Store<Tramite240305State>
 * @descripcion
 * Store principal de Akita que gestiona todo el estado reactivo del trámite 240305.
 * Proporciona una API consistente para que los componentes puedan leer y modificar
 * el estado del formulario de manera controlada y predecible.
 * 
 * @arquitectura_akita
 * Utiliza el patrón Store de Akita que proporciona:
 * - **Estado inmutable**: Todas las actualizaciones crean nuevos estados
 * - **Observables reactivos**: Los componentes se suscriben a cambios automáticamente  
 * - **DevTools**: Integración con Redux DevTools para debugging
 * - **Time Travel**: Capacidad de deshacer/rehacer cambios en desarrollo
 * - **Estado persistente**: Posibilidad de guardar/restaurar estado en localStorage
 * 
 * @configuracion_store
 * - **nombre**: 'tramite240305' - Identificador único en el ecosistema Akita
 * - **resettable**: true - Permite reiniciar el store al estado inicial
 * - **providedIn**: 'root' - Singleton disponible en toda la aplicación
 * 
 * @patrones_actualizacion
 * Todos los métodos de actualización siguen el patrón:
 * 1. Reciben parámetros tipados y validados
 * 2. Usan la función update() de Akita para inmutabilidad
 * 3. Aplican spread operator para preservar estado existente
 * 4. Actualizan solo las propiedades específicas necesarias
 * 
 * @integracion_componentes
 * Los componentes interactúan con el store mediante:
 * - **Inyección de dependencia**: Store inyectado en constructores
 * - **Métodos públicos**: API clara para actualizaciones de estado
 * - **Queries**: Selección específica de datos mediante selectores
 * - **Suscripciones**: Reactividad automática a cambios de estado
 * 
 * @gestion_memoria
 * El store maneja automáticamente:
 * - Limpieza de observables cuando no hay suscriptores
 * - Prevención de memory leaks con operadores RxJS adecuados
 * - Optimización de rendimiento con comparaciones de referencia
 * - Gestión eficiente de actualizaciones masivas de datos
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite240305', resettable: true })
export class Tramite240305Store extends Store<Tramite240305State> {
  /**
   * @constructor
   * @descripcion
   * Inicializa el store con el estado inicial limpio.
   * Llama al constructor padre de Akita Store pasando el estado inicial
   * creado por la función factory createInitialState().
   * 
   * @inicializacion_proceso
   * 1. Ejecuta createInitialState() para obtener estado limpio
   * 2. Pasa el estado al constructor de Store de Akita
   * 3. Configura observables y mecanismos reactivos
   * 4. Registra el store en el ecosistema Akita global
   * 
   * @estado_inicial
   * El store queda listo con:
   * - Pestaña 1 seleccionada por defecto
   * - Todos los arrays vacíos para datos tabulares
   * - Formularios con valores por defecto seguros
   * - Configuraciones específicas del trámite aplicadas
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @method updateTabSeleccionado
   * @descripcion
   * Actualiza la pestaña actualmente seleccionada en el flujo del trámite.
   * Permite la navegación controlada entre las diferentes secciones del formulario,
   * manteniendo el estado de la pestaña activa para la experiencia del usuario.
   * 
   * @funcionalidad_navegacion
   * - **Control de flujo**: Gestiona qué sección del trámite está activa
   * - **Experiencia usuario**: Mantiene la posición del usuario en el flujo
   * - **Validación implícita**: Los componentes pueden usar este valor para validaciones
   * - **Persistencia visual**: La interfaz refleja automáticamente el cambio
   * 
   * @uso_tipico
   * ```typescript
   * // Navegar a la segunda pestaña
   * this.store.updateTabSeleccionado(2);
   * 
   * // Ir a la última pestaña del proceso
   * this.store.updateTabSeleccionado(5);
   * ```
   * 
   * @consideraciones_implementacion
   * - El índice debe corresponder a pestañas existentes en la interfaz
   * - Los componentes deben manejar transiciones entre pestañas apropiadamente
   * - No se valida el rango del número, depende de la lógica del componente
   * 
   * @patron_actualizacion
   * Utiliza el patrón estándar de Akita:
   * 1. Recibe el nuevo valor como parámetro
   * 2. Usa update() para crear nuevo estado inmutable
   * 3. Preserva todo el estado existente con spread operator
   * 4. Actualiza únicamente la propiedad tabSeleccionado
   * 
   * @param {number} tabSeleccionado - Índice de la nueva pestaña seleccionada (típicamente 1-based).
   * @returns {void} No retorna valor, actualiza el estado reactivamente.
   */
  public updateTabSeleccionado(tabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      tabSeleccionado: tabSeleccionado,
    }));
  }

  /**
   * @method updateDatosDelTramiteFormState
   * @descripcion
   * Actualiza el estado completo del formulario de datos generales del trámite.
   * Gestiona la información principal del procedimiento incluyendo permisos, destinos,
   * aduanas seleccionadas y configuraciones temporales del trámite.
   * 
   * @datos_gestionados
   * El formulario incluye campos críticos como:
   * - **permisoGeneral**: Tipo de permiso solicitado
   * - **usoFinal**: Destino final de las substancias químicas
   * - **aduanasSeleccionadas**: Lista de aduanas autorizadas para el trámite
   * - **paisDestino**: País de destino de las mercancías
   * - **unoSemestre/anoEnCurso**: Configuraciones temporales del permiso
   * 
   * @validaciones_negocio
   * Los datos actualizados deben cumplir con:
   * - Normativas SEDENA para importación de substancias controladas
   * - Requisitos legales de permisos ordinarios
   * - Validaciones de países y aduanas permitidas
   * - Consistencia con el tipo de trámite 240305
   * 
   * @impacto_sistema
   * La actualización de estos datos puede afectar:
   * - Validaciones en otros pasos del formulario
   * - Cálculo de aranceles y derechos
   * - Documentos requeridos según el tipo de permiso
   * - Flujo de aprobación según el país destino
   * 
   * @uso_tipico
   * ```typescript
   * const nuevosDatos: DatosDelTramiteFormState = {
   *   permisoGeneral: 'IMPORTACION_ORDINARIA',
   *   usoFinal: 'INDUSTRIAL',
   *   aduanasSeleccionadas: ['ADUANA_MEXICO', 'ADUANA_VERACRUZ'],
   *   paisDestino: 'MEXICO',
   *   unoSemestre: 'primerSemestre',
   *   anoEnCurso: true
   * };
   * this.store.updateDatosDelTramiteFormState(nuevosDatos);
   * ```
   * 
   * @patron_reemplazo_completo
   * Este método reemplaza completamente el objeto datosDelTramite,
   * no hace merge de propiedades individuales. El componente debe
   * enviar el estado completo actualizado.
   * 
   * @param {DatosDelTramiteFormState} datosDelTramiteFormState - Estado completo actualizado del formulario de datos del trámite.
   * @returns {void} No retorna valor, actualiza el estado de forma reactiva.
   */
  public updateDatosDelTramiteFormState(
    datosDelTramiteFormState: DatosDelTramiteFormState
  ): void {
    this.update((state) => ({
      ...state,
      datosDelTramite: datosDelTramiteFormState,
    }));
  }

  /**
   * @method updatePagoDerechosFormState
   * @descripcion
   * Actualiza el estado completo del formulario de pago de derechos gubernamentales.
   * Gestiona toda la información financiera relacionada con el pago de aranceles,
   * tasas y contribuciones requeridas para el trámite de importación.
   * 
   * @informacion_financiera
   * El formulario de pago incluye campos esenciales:
   * - **claveReferencia**: Número de referencia único del pago
   * - **cadenaDependencia**: Cadena de validación de la dependencia receptora  
   * - **banco**: Institución bancaria donde se realizó el pago
   * - **llavePago**: Clave de confirmación bancaria del pago
   * - **fechaPago**: Fecha en que se efectuó el pago
   * - **importePago**: Monto total pagado en moneda nacional
   * 
   * @validaciones_financieras
   * Los datos de pago deben cumplir:
   * - Formato válido de referencia bancaria
   * - Fechas dentro del período de vigencia permitido
   * - Importes que coincidan con las tasas oficiales
   * - Bancos autorizados para recibir pagos gubernamentales
   * - Claves de pago verificables contra sistemas bancarios
   * 
   * @integracion_sistemas
   * Esta información se integra con:
   * - **Sistema bancario**: Validación de pagos realizados
   * - **SAT**: Verificación de contribuciones fiscales
   * - **SEDENA**: Confirmación de derechos pagados
   * - **Sistema contable**: Registro de ingresos por trámites
   * 
   * @impacto_procesamiento
   * Los datos de pago válidos permiten:
   * - Continuación automática del trámite
   * - Generación de comprobantes fiscales
   * - Liberación de restricciones de proceso
   * - Activación de flujos de aprobación
   * 
   * @uso_tipico
   * ```typescript
   * const datosPago: PagoDerechosFormState = {
   *   claveReferencia: 'REF123456789',
   *   cadenaDependencia: 'SEDENA-240305-2024',
   *   banco: 'BANCO_NACIONAL',
   *   llavePago: 'LLV789456123',
   *   fechaPago: '2024-03-15',
   *   importePago: '2500.00'
   * };
   * this.store.updatePagoDerechosFormState(datosPago);
   * ```
   * 
   * @seguridad_datos
   * La información financiera requiere:
   * - Encriptación en tránsito y almacenamiento
   * - Logging de accesos para auditoría
   * - Validación de integridad de datos
   * - Cumplimiento con normativas de protección de datos
   * 
   * @param {PagoDerechosFormState} pagoDerechosFormState - Estado completo actualizado del formulario de pago de derechos.
   * @returns {void} No retorna valor, actualiza el estado reactivamente con la información de pago.
   */
  public updatePagoDerechosFormState(
    pagoDerechosFormState: PagoDerechosFormState
  ): void {
    this.update((state) => ({
      ...state,
      pagoDerechos: pagoDerechosFormState,
    }));
  }
  /**
   * @method updateJustificacionFormulario
   * @descripcion
   * Actualiza el estado del formulario de justificación técnica del trámite.
   * Permite capturar y modificar la justificación detallada que el solicitante
   * debe proporcionar para fundamentar la necesidad de importación de substancias químicas.
   * 
   * @proposito_justificacion
   * La justificación técnica sirve para:
   * - **Fundamentación legal**: Explicar las razones técnicas de la importación
   * - **Evaluación regulatoria**: Permitir a SEDENA evaluar la pertinencia del permiso
   * - **Cumplimiento normativo**: Satisfacer requisitos legales de documentación
   * - **Trazabilidad**: Mantener registro de los motivos de cada solicitud
   * 
   * @contenido_esperado
   * La justificación debe incluir elementos como:
   * - Descripción detallada del uso previsto de las substancias
   * - Justificación técnica de las cantidades solicitadas
   * - Medidas de seguridad y manejo propuestas
   * - Beneficios esperados del uso de las substancias químicas
   * - Cumplimiento con normativas ambientales y de seguridad
   * 
   * @validaciones_contenido
   * El texto de justificación puede requerir:
   * - Longitud mínima para garantizar completitud
   * - Validación de contenido técnico apropiado
   * - Verificación de términos técnicos correctos
   * - Cumplimiento con formato y estructura requeridos
   * 
   * @impacto_evaluacion
   * Una justificación adecuada impacta:
   * - **Tiempo de procesamiento**: Justificaciones claras aceleran revisión
   * - **Probabilidad de aprobación**: Mejor documentación mejora posibilidades
   * - **Requerimientos adicionales**: Puede reducir solicitudes de información adicional
   * - **Precedente regulatorio**: Establece patrones para futuras solicitudes
   * 
   * @uso_tipico
   * ```typescript
   * const justificacion: JustificacionTramiteFormState = {
   *   justificacion: `Se requiere la importación de 500kg de substancia X
   *                  para procesos de manufactura de productos industriales,
   *                  con estricto apego a las normas de seguridad establecidas...`
   * };
   * this.store.updateJustificacionFormulario(justificacion);
   * ```
   * 
   * @consideraciones_legales
   * - La justificación forma parte del expediente legal del trámite
   * - Puede ser utilizada como referencia en auditorías futuras
   * - Debe ser consistente con otros documentos del expediente
   * - Su veracidad es responsabilidad legal del solicitante
   * 
   * @param {JustificacionTramiteFormState} justificacionTramiteFormState - Estado actualizado del formulario de justificación técnica.
   * @returns {void} No retorna valor, actualiza el estado preservando la justificación capturada.
   */
  public updateJustificacionFormulario(
    justificacionTramiteFormState: JustificacionTramiteFormState
  ): void {
    this.update((state) => ({
      ...state,
      justificacionTramiteFormState: justificacionTramiteFormState,
    }));
  }
  /**
   * @method updateDestinatarioFinalTablaDatos
   * @descripcion
   * Agrega nuevos registros a la tabla de destinatarios finales del trámite.
   * Gestiona la lista de entidades autorizadas que pueden recibir las substancias
   * químicas importadas, manteniendo un registro completo y trazable.
   * 
   * @gestion_destinatarios
   * Los destinatarios finales representan:
   * - **Empresas receptoras**: Entidades legalmente autorizadas para recibir productos
   * - **Instalaciones específicas**: Ubicaciones físicas donde se almacenarán las substancias
   * - **Responsables legales**: Personas o entidades responsables del manejo final
   * - **Cadena de custodia**: Registro completo del destino de productos controlados
   * 
   * @informacion_requerida
   * Cada destinatario debe incluir típicamente:
   * - Datos de identificación fiscal (RFC, razón social)
   * - Dirección física completa y verificable
   * - Licencias y permisos aplicables
   * - Persona responsable del recibo de mercancías
   * - Medidas de seguridad y almacenamiento
   * 
   * @validaciones_regulatorias
   * Los destinatarios deben cumplir:
   * - **Registro ante SEDENA**: Estar inscritos en padrones correspondientes
   * - **Capacidad técnica**: Demostrar capacidad de manejo seguro
   * - **Ubicación autorizada**: Estar en zonas permitidas para este tipo de actividades
   * - **Documentación vigente**: Mantener permisos y licencias actualizados
   * 
   * @patron_acumulativo
   * Este método usa el patrón de acumulación:
   * - Preserva todos los destinatarios existentes en el estado
   * - Añade los nuevos destinatarios al final de la lista
   * - Mantiene el orden de inserción para trazabilidad
   * - No valida duplicados (responsabilidad del componente)
   * 
   * @uso_tipico
   * ```typescript
   * const nuevosDestinatarios: DestinoFinal[] = [{
   *   rfc: 'XYZ123456ABC',
   *   razonSocial: 'Empresa Química Industrial S.A.',
   *   direccion: 'Av. Industrial 123, Col. Química, México',
   *   responsable: 'Ing. Juan Pérez',
   *   licencias: ['LIC001', 'LIC002']
   * }];
   * this.store.updateDestinatarioFinalTablaDatos(nuevosDestinatarios);
   * ```
   * 
   * @impacto_cadena_suministro
   * La actualización de destinatarios afecta:
   * - Cálculos de logística y distribución
   * - Validaciones de rutas de transporte
   * - Requisitos de documentación aduanal
   * - Inspecciones y auditorías regulatorias
   * 
   * @trazabilidad_regulatoria
   * Cada destinatario agregado queda registrado para:
   * - Auditorías de cumplimiento normativo
   * - Rastreo de substancias controladas
   * - Verificaciones de destino final
   * - Reportes regulatorios periódicos
   * 
   * @param {DestinoFinal[]} newDestinatarios - Array de nuevos destinatarios finales a agregar a la lista existente.
   * @returns {void} No retorna valor, actualiza el estado agregando los destinatarios de forma acumulativa.
   */
  public updateDestinatarioFinalTablaDatos(
    newDestinatarios: DestinoFinal[]
  ): void {
    this.update((state) => {

      const EXISTING_LIST = state.destinatarioFinalTablaDatos;

      const UPDATED_LIST = [...EXISTING_LIST];

      for (const NEW_DEST of newDestinatarios) {
        const INDEX = EXISTING_LIST.findIndex(
          (existing) => existing.id === NEW_DEST.id
        );

        if (INDEX !== -1) {
          UPDATED_LIST[INDEX] = NEW_DEST;
        } else {
          UPDATED_LIST.push(NEW_DEST);
        }
      }

      return {
        ...state,
        destinatarioFinalTablaDatos: UPDATED_LIST,
        modificarDestinarioDatos: null
      };
    });
  }

  /**
   * @method updateProveedorTablaDatos
   * @descripcion
   * Agrega nuevos registros a la tabla de proveedores autorizados del trámite.
   * Mantiene un registro completo de las entidades comerciales que suministrarán
   * las substancias químicas y artificios pirotécnicos objeto de la importación.
   * 
   * @gestion_proveedores
   * Los proveedores representan:
   * - **Empresas suministradoras**: Entidades comerciales que venden las substancias
   * - **Fabricantes originales**: Productores directos de las substancias químicas
   * - **Distribuidores autorizados**: Intermediarios comerciales certificados
   * - **Responsables de calidad**: Entidades que garantizan especificaciones técnicas
   * 
   * @informacion_proveedor
   * Cada registro de proveedor incluye típicamente:
   * - Identificación comercial completa (razón social, RFC)
   * - País y jurisdicción de origen
   * - Certificaciones de calidad y seguridad
   * - Licencias de fabricación o comercialización
   * - Historial de cumplimiento regulatorio
   * - Datos de contacto y representación legal
   * 
   * @validaciones_comerciales
   * Los proveedores deben cumplir:
   * - **Registro internacional**: Estar inscritos en organismos regulatorios de origen
   * - **Certificaciones**: Contar con certificados de calidad ISO, FDA, u otros aplicables
   * - **Cumplimiento**: Historial limpio de cumplimiento normativo
   * - **Capacidad técnica**: Demostrar capacidad de producción y suministro
   * - **Trazabilidad**: Sistemas de seguimiento de lote y origen
   * 
   * @cadena_suministro
   * La gestión de proveedores impacta:
   * - **Validación de origen**: Verificación de procedencia legal de substancias
   * - **Control de calidad**: Garantías de especificaciones técnicas
   * - **Logística internacional**: Planificación de importación y transporte
   * - **Cumplimiento aduanal**: Documentación requerida para despacho
   * 
   * @patron_acumulativo
   * El método utiliza patrón de acumulación segura:
   * - Preserva todos los proveedores previamente registrados
   * - Añade nuevos proveedores manteniendo orden cronológico
   * - No valida duplicados (delegado al componente)
   * - Permite múltiples actualizaciones incrementales
   * 
   * @uso_tipico
   * ```typescript
   * const nuevosProveedores: Proveedor[] = [{
   *   razonSocial: 'Chemical Supplies International Ltd.',
   *   pais: 'Estados Unidos',
   *   rfc: 'EXT123456789',
   *   certificaciones: ['ISO9001', 'FDA-REG'],
   *   representante: 'John Smith, Director Comercial',
   *   contacto: 'john.smith@chemicalsupplies.com'
   * }];
   * this.store.updateProveedorTablaDatos(nuevosProveedores);
   * ```
   * 
   * @impacto_regulatorio
   * El registro de proveedores permite:
   * - Evaluación de riesgo por país de origen
   * - Aplicación de restricciones comerciales específicas
   * - Validación de tratados comerciales aplicables
   * - Cálculo de aranceles y preferencias arancelarias
   * 
   * @auditoria_seguimiento
   * Cada proveedor queda registrado para:
   * - Auditorías de origen y procedencia
   * - Verificaciones de cumplimiento internacional
   * - Reportes de importación por proveedor
   * - Análisis de patrones de suministro
   * 
   * @param {Proveedor[]} newProveedores - Array de nuevos proveedores a agregar a la lista existente de suministradores autorizados.
   * @returns {void} No retorna valor, actualiza el estado agregando proveedores de forma acumulativa.
   */
  public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => {

      const EXISTING_LIST = state.proveedorTablaDatos;

      const UPDATED_LIST = [...EXISTING_LIST];

      for (const NEW_DEST of newProveedores) {
        const INDEX = EXISTING_LIST.findIndex(
          (existing) => existing.id === NEW_DEST.id
        );

        if (INDEX !== -1) {
          UPDATED_LIST[INDEX] = NEW_DEST;
        } else {
          UPDATED_LIST.push(NEW_DEST);
        }
      }

      return {
        ...state,
        proveedorTablaDatos: UPDATED_LIST,
        modificarProveedorDatos: null
      };
    });
  }

  /**
   * @method updateMercanciaTablaDatos
   * @descripcion
   * Agrega nuevos registros detallados a la tabla de mercancías del trámite.
   * Gestiona el catálogo completo de substancias químicas y artificios pirotécnicos
   * que serán objeto de la importación, con todas sus especificaciones técnicas y regulatorias.
   * 
   * @gestion_mercancia
   * Las mercancías representan el corazón del trámite:
   * - **Substancias químicas**: Compuestos específicos con fórmula y pureza definidas
   * - **Artificios pirotécnicos**: Productos terminados con especificaciones de seguridad
   * - **Materias primas**: Componentes base para manufactura posterior
   * - **Productos controlados**: Substancias sujetas a regulación especial SEDENA
   * 
   * @informacion_detallada
   * Cada mercancía debe incluir:
   * - **Identificación química**: Nombre técnico, fórmula molecular, número CAS
   * - **Especificaciones técnicas**: Pureza, concentración, presentación física
   * - **Clasificación arancelaria**: Fracción arancelaria y nomenclatura TIGIE
   * - **Cantidades**: Peso, volumen, unidades según la naturaleza del producto
   * - **Uso específico**: Aplicación final prevista de cada substancia
   * - **Medidas de seguridad**: Requisitos de manejo, almacenamiento y transporte
   * 
   * @clasificaciones_regulatorias
   * Las mercancías se clasifican según:
   * - **Nivel de control SEDENA**: Substancias con diferentes grados de restricción
   * - **Peligrosidad**: Clasificación según normativas de substancias peligrosas
   * - **Origen**: País de procedencia y regulaciones específicas aplicables
   * - **Uso final**: Industrial, comercial, investigación, otros usos autorizados
   * 
   * @validaciones_tecnicas
   * Cada mercancía debe cumplir:
   * - **Pureza mínima**: Especificaciones técnicas según uso previsto
   * - **Empaque autorizado**: Presentaciones permitidas para transporte internacional
   * - **Etiquetado**: Cumplimiento con normativas de identificación y seguridad
   * - **Documentación**: Hojas de seguridad, certificados de análisis
   * - **Límites cuantitativos**: Cantidades máximas permitidas por tipo de permiso
   * 
   * @impacto_evaluacion
   * El detalle de mercancías determina:
   * - **Tipo de evaluación**: Nivel de revisión técnica requerida
   * - **Documentación adicional**: Estudios, análisis o certificaciones específicas
   * - **Tiempo de procesamiento**: Evaluaciones complejas requieren más tiempo
   * - **Restricciones aplicables**: Limitaciones específicas por tipo de substancia
   * 
   * @patron_acumulativo
   * El método implementa acumulación controlada:
   * - Preserva todas las mercancías previamente registradas
   * - Añade nuevas mercancías respetando orden de captura
   * - No valida duplicados químicos (responsabilidad del componente)
   * - Permite construcción incremental del catálogo
   * 
   * @uso_tipico
   * ```typescript
   * const nuevasMercancias: MercanciaDetalle[] = [{
   *   nombreTecnico: 'Nitrato de Amonio',
   *   formulaQuimica: 'NH4NO3',
   *   numeroCAS: '6484-52-2',
   *   pureza: '99.5%',
   *   cantidad: '1000',
   *   unidad: 'kilogramos',
   *   fraccionArancelaria: '3102.30.01',
   *   usoFinal: 'Fabricación de explosivos industriales',
   *   medidas_seguridad: 'Almacenamiento en área seca y ventilada'
   * }];
   * this.store.updateMercanciaTablaDatos(nuevasMercancias);
   * ```
   * 
   * @consideraciones_seguridad
   * El registro de mercancías requiere:
   * - **Validación química**: Verificación de compatibilidad entre substancias
   * - **Análisis de riesgo**: Evaluación de peligros combinados
   * - **Restricciones de almacenamiento**: Limitaciones de co-almacenamiento
   * - **Planes de contingencia**: Procedimientos para emergencias específicas
   * 
   * @trazabilidad_control
   * Cada mercancía queda registrada para:
   * - Seguimiento individual por lote de producción
   * - Auditorías de uso final y consumo
   * - Reportes regulatorios de substancias controladas
   * - Análisis de patrones de importación por substancia
   * 
   * @param {MercanciaDetalle[]} newMercancia - Array de nuevos registros de mercancías con especificaciones técnicas completas.
   * @returns {void} No retorna valor, actualiza el estado agregando mercancías de forma acumulativa y controlada.
   */
  public updateMercanciaTablaDatos(newMercancia: MercanciaDetalle[]): void {
    this.update((state) => ({
      ...state,
      merccancialTablaDatos: [...state.merccancialTablaDatos, ...newMercancia],
    }));
  }

  /**
* Actualiza el estado con los datos del destinatario proporcionados y limpia los datos del proveedor.
* 
* Esta función se utiliza para establecer nuevos datos del destinatario (`modificarDestinarioDatos`)
* en el estado del store, asegurando que los datos del proveedor se reinicien a `null`.
*
* @param {DestinoFinal} datos - Objeto con la información actualizada del destinatario.
* @returns {void}
*/
  public actualizarDatosDestinatario(datos: DestinoFinal): void {
    this.update((state) => ({
      ...state,
      modificarDestinarioDatos: datos,
      modificarProveedorDatos: null
    }));
  }

  /**
* Elimina un Proveedor de la tabla de Proveedor.
*
* @param proveedorFinal - El Proveedor que se eliminará de la tabla de Proveedor.
* @returns void
*/
  eliminareliminarProveedorFinal(proveedorFinal: Proveedor): void {
    this.update(state => {
      const INDICE_A_ELIMINAR = state.proveedorTablaDatos.findIndex(ele =>
        Object.keys(proveedorFinal).some(key => proveedorFinal[key as keyof Proveedor] === ele[key as keyof Proveedor])
      );

      if (INDICE_A_ELIMINAR !== -1) {
        state.proveedorTablaDatos.splice(INDICE_A_ELIMINAR, 1);
      }

      return {
        ...state,
        proveedorTablaDatos: [...state.proveedorTablaDatos],
        modificarProveedorDatos: null
      };
    });
  }

  /**
  * Elimina una mercancía específica de la lista `merccancialTablaDatos` en el estado.
  *
  * @param datos Los detalles de la mercancía que se desea eliminar.
  *
  * @remarks
  * Esta función actualiza el estado filtrando la mercancía que coincida exactamente con todos los campos de `datos`.
  *
  * @example
  * eliminarMercancias({ id: 1, nombre: 'Producto A', cantidad: 10 });
  */
  eliminarMercancias(datos: MercanciaDetalle): void {
    this.update(state => {
      const MERCANCIAS_ACTUALIZADAS = state.merccancialTablaDatos.filter(ele =>
        !Object.keys(datos).every(
          key => datos[key as keyof MercanciaDetalle] === ele[key as keyof MercanciaDetalle]
        )
      );
      return {
        ...state,
        merccancialTablaDatos: MERCANCIAS_ACTUALIZADAS,
      };
    });
  }

  /**
 * Elimina un destinatario de la tabla de destinatarios.
 *
 * @param destinatarioFinal - El destinatario que se eliminará de la tabla de destinatarios.
 * @returns void
 */
  eliminarDestinatarioFinal(destinatarioFinal: DestinoFinal): void {
    this.update(state => {
      const INDICE_A_ELIMINAR = state.destinatarioFinalTablaDatos.findIndex(ele =>
        Object.keys(destinatarioFinal).some(key => destinatarioFinal[key as keyof DestinoFinal] === ele[key as keyof DestinoFinal])
      );

      if (INDICE_A_ELIMINAR !== -1) {
        state.destinatarioFinalTablaDatos.splice(INDICE_A_ELIMINAR, 1);
      }

      return {
        ...state,
        destinatarioFinalTablaDatos: [...state.destinatarioFinalTablaDatos],
        modificarDestinarioDatos: null
      };
    });
  }

  /**
 * Actualiza el estado con los datos del proveedor proporcionados y limpia los datos del destinatario.
 * 
 * Esta función se utiliza para establecer nuevos datos del proveedor (`modificarProveedorDatos`)
 * en el estado del store, asegurando que los datos del destinatario se reinicien a `null`.
 *
 * @param {Proveedor} datos - Objeto con la información actualizada del proveedor.
 * @returns {void}
 */
  public actualizarDatosProveedor(datos: Proveedor): void {
    this.update((state) => ({
      ...state,
      modificarProveedorDatos: datos,
      modificarDestinarioDatos: null
    }));
  }

  /**
* Actualiza parcialmente el estado del trámite.
* 
* Fusiona el estado actual con los nuevos valores proporcionados,
* permitiendo modificar solo las propiedades necesarias sin afectar
* el resto del estado almacenado.
*
* @param partial - Objeto con los campos del estado que se desean actualizar.
*/
  public updateState(
    partial: Partial<Tramite240305State>
  ): void {
    this.update((state) => ({
      ...state,
      ...partial,
    }));
  }

  /**
* Limpia los datos de terceros del store de trámite.
*/
  public clearTercerosDatos(): void {
    this.update((state) => {
      return {
        ...state,
        modificarDestinarioDatos: null,
        modificarProveedorDatos: null,
      };
    });

  }
}
