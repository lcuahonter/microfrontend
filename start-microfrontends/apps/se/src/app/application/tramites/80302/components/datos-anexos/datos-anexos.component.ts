/**
 * @fileoverview Componente para gestión de datos de anexos del trámite 80302 (IMMEX).
 * 
 * Este archivo contiene el componente responsable de la visualización y gestión
 * de anexos relacionados con el trámite 80302 para modificaciones del programa IMMEX.
 * Maneja tres tipos principales de anexos:
 * 
 * - Anexos de exportación: Productos y mercancías para exportación
 * - Anexos de importación: Insumos y materias primas para importación
 * - Anexos sensibles: Documentos que requieren tratamiento especial
 * 
 * El componente se integra con el sistema VUCEM para obtener y mostrar
 * información detallada de anexos usando tablas dinámicas configurables.
 * 
 * @version 1.0.0
 * @author Equipo de Desarrollo VUCEM
 * @since 2024
 */

import { Anexo, AnexoImportacion, ProductoExportacion } from '../../estados/models/plantas-consulta.model';
import { CONFIGURACION_ANEXOS_IMPORTACION, CONFIGURACION_ANEXOS_SENSIBLES, CONFIGURACION_ANEXOS_TABLA } from '../../constantes/modificacion.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, TablaDinamicaComponent, doDeepCopy, esValidArray, esValidObject } from '@ng-mf/data-access-user';
import { Solicitud80302State, Tramite80302Store } from '../../../../estados/tramites/tramite80302.store';
import { Subject, map, takeUntil } from 'rxjs';
import { SolicitudService } from '../../service/solicitud.service';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { Tramite80302Query } from '../../../../estados/queries/tramite80302.query';

/**
 * @class DatosAnexosComponent
 * @description
 * Componente para visualización y gestión de anexos del trámite 80302 (IMMEX).
 * 
 * Este componente maneja la presentación de datos de anexos asociados al programa IMMEX,
 * organizando la información en tres categorías principales:
 * 
 * **Funcionalidades principales:**
 * - Visualización de productos de exportación en tabla dinámica
 * - Gestión de anexos de importación con configuración específica
 * - Manejo de documentos sensibles con tratamiento especial
 * - Integración con servicios VUCEM para obtención de datos
 * - Actualización automática del store de Akita con datos obtenidos
 * 
 * **Flujo de operación:**
 * 1. Obtiene ID de solicitud del programa IMMEX
 * 2. Carga anexos de exportación e importación
 * 3. Filtra datos válidos y actualiza store
 * 4. Presenta información en tablas configurables
 * 
 * **Gestión de estado:**
 * - Utiliza Akita store para persistencia de datos
 * - Implementa patrón takeUntil para gestión de suscripciones
 * - Maneja errores con notificaciones Toastr
 * 
 * @implements {OnInit}
 * @implements {OnDestroy}
 * 
 * @example
 * ```typescript
 * // Uso en template
 * <app-datos-anexos></app-datos-anexos>
 * 
 * // Configuración de tabla personalizada
 * configuracionTablaAnexo = CONFIGURACION_ANEXOS_TABLA;
 * 
 * // Acceso a datos filtrados
 * const anexosValidos = this.datosAnexo.filter(anexo => anexo.estado === 'ACTIVO');
 * ```
 * 
 * @see {@link ProductoExportacion} - Modelo para productos de exportación
 * @see {@link AnexoImportacion} - Modelo para anexos de importación
 * @see {@link Anexo} - Modelo base para anexos sensibles
 * @see {@link SolicitudService} - Servicio para operaciones de solicitud
 * @see {@link Tramite80302Store} - Store de Akita para gestión de estado
 * @see {@link TablaDinamicaComponent} - Componente para visualización tabular
 */
@Component({
  selector: 'app-datos-anexos',
  templateUrl: './datos-anexos.component.html',
  styleUrl: './datos-anexos.component.scss',
  standalone: true,
  imports: [TablaDinamicaComponent, TituloComponent],
})
export class DatosAnexosComponent implements OnInit, OnDestroy {
  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Subject para notificar la destrucción del componente y prevenir memory leaks.
   * 
   * Este Subject se utiliza como mecanismo de notificación para cancelar
   * automáticamente todas las suscripciones activas cuando el componente
   * se destruye, evitando así posibles memory leaks.
   * 
   * Se implementa siguiendo el patrón takeUntil para gestión limpia
   * de observables en Angular, especialmente importante dado que este
   * componente realiza múltiples llamadas a servicios asincrónicos.
   * 
   * @private
   * @default new Subject<void>()
   * 
   * @example
   * ```typescript
   * // Uso en suscripciones
   * this.solicitudService.obtenerAnexoExportacion(params)
   *   .pipe(takeUntil(this.destroyNotifier$))
   *   .subscribe(data => {
   *     // Lógica de procesamiento
   *   });
   * 
   * // En ngOnDestroy
   * this.destroyNotifier$.next();
   * this.destroyNotifier$.complete();
   * ```
   * 
   * @see {@link takeUntil} - Operador RxJS para cancelación de suscripciones
   * @see {@link ngOnDestroy} - Método donde se completa este Subject
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {string} buscarIdSolicitud
   * @description
   * Identificador de la solicitud del programa IMMEX procesado.
   * 
   * Esta propiedad almacena el ID único de la solicitud obtenido del servicio
   * de solicitudes, el cual se utiliza como parámetro para consultar todos
   * los anexos relacionados con el trámite 80302.
   * 
   * El ID se procesa para:
   * - Eliminar espacios en blanco y valores vacíos
   * - Filtrar IDs con valor cero
   * - Formatear como cadena separada por comas si hay múltiples IDs
   * 
   * Este identificador es fundamental para establecer la relación entre
   * la solicitud del programa IMMEX y sus anexos correspondientes.
   * 
   * @example
   * ```typescript
   * // El ID se establece automáticamente desde el servicio
   * this.buscarIdSolicitud = "12345,67890";
   * 
   * // Se utiliza en consultas de anexos
   * const params = { idSolicitud: this.buscarIdSolicitud };
   * this.solicitudService.obtenerAnexoExportacion(params);
   * ```
   * 
   * @see {@link obtenerSolicitudId} - Método que establece este valor
   * @see {@link obteneComplimentaria} - Método que utiliza este ID
   * @see {@link obtenerAnexoImportacion} - Método que utiliza este ID
   */
  buscarIdSolicitud!: string;

  /**
   * @property {ConfiguracionColumna<ProductoExportacion>[]} configuracionTablaAnexo
   * @description
   * Configuración de columnas para la tabla de productos de exportación.
   * 
   * Esta propiedad define la estructura y comportamiento de la tabla que muestra
   * los productos de exportación del programa IMMEX. La configuración incluye:
   * 
   * - Definición de columnas visibles y su orden
   * - Tipos de datos y formateadores específicos
   * - Opciones de ordenamiento y filtrado
   * - Acciones disponibles por fila
   * - Estilos y validaciones de celdas
   * 
   * La configuración se basa en la constante `CONFIGURACION_ANEXOS_TABLA`
   * que establece los estándares para la visualización de productos de exportación
   * en el contexto del programa IMMEX.
   * 
   * @default CONFIGURACION_ANEXOS_TABLA
   * 
   * @example
   * ```typescript
   * // Personalizar configuración de columnas
   * this.configuracionTablaAnexo = [
   *   {
   *     campo: 'fraccionArancelaria',
   *     titulo: 'Fracción Arancelaria',
   *     tipo: 'texto',
   *     ancho: '200px'
   *   },
   *   // más columnas...
   * ];
   * 
   * // Usar en template
   * <app-tabla-dinamica 
   *   [configuracion]="configuracionTablaAnexo"
   *   [datos]="datosAnexo">
   * </app-tabla-dinamica>
   * ```
   * 
   * @see {@link ConfiguracionColumna} - Interface para configuración de columnas
   * @see {@link ProductoExportacion} - Modelo de datos que maneja la tabla
   * @see {@link CONFIGURACION_ANEXOS_TABLA} - Configuración base predefinida
   * @see {@link TablaDinamicaComponent} - Componente que utiliza esta configuración
   */
  configuracionTablaAnexo: ConfiguracionColumna<ProductoExportacion>[] =
    CONFIGURACION_ANEXOS_TABLA as ConfiguracionColumna<ProductoExportacion>[];

  /**
   * @property {ConfiguracionColumna<AnexoImportacion>[]} configuracionTablaImportacion
   * @description
   * Configuración de columnas para la tabla de anexos de importación.
   * 
   * Esta propiedad define la estructura específica de la tabla que presenta
   * los anexos relacionados con importaciones del programa IMMEX. Incluye:
   * 
   * - Campos específicos para datos de importación (insumos, materias primas)
   * - Columnas para información aduanera y arancelaria
   * - Configuración de validaciones específicas de importación
   * - Formateadores para unidades de medida y valores monetarios
   * - Acciones contextuales para gestión de anexos de importación
   * 
   * La configuración se deriva de `CONFIGURACION_ANEXOS_IMPORTACION`
   * que establece los estándares específicos para el manejo de datos
   * de importación en el programa IMMEX.
   * 
   * @default CONFIGURACION_ANEXOS_IMPORTACION
   * 
   * @example
   * ```typescript
   * // Acceder a configuración específica
   * const columnaFraccion = this.configuracionTablaImportacion
   *   .find(col => col.campo === 'fraccionArancelaria');
   * 
   * // Modificar configuración dinámicamente
   * this.configuracionTablaImportacion.forEach(col => {
   *   if (col.campo === 'valor') {
   *     col.formateador = 'moneda';
   *   }
   * });
   * ```
   * 
   * @see {@link ConfiguracionColumna} - Interface para configuración de columnas
   * @see {@link AnexoImportacion} - Modelo para datos de importación
   * @see {@link CONFIGURACION_ANEXOS_IMPORTACION} - Configuración predefinida
   * @see {@link obtenerAnexoImportacion} - Método que obtiene los datos para esta tabla
   */
  configuracionTablaImportacion: ConfiguracionColumna<AnexoImportacion>[] =
    CONFIGURACION_ANEXOS_IMPORTACION as ConfiguracionColumna<AnexoImportacion>[];

    /**
   * @property {ConfiguracionColumna<Anexo>[]} configuracionTablaSensibles
   * @description
   * Configuración de columnas para la tabla de anexos con información sensible.
   * 
   * Esta propiedad define la estructura especializada de la tabla que maneja
   * documentos y anexos que contienen información clasificada como sensible
   * dentro del programa IMMEX. Características específicas:
   * 
   * - Campos con tratamiento especial para datos confidenciales
   * - Columnas con restricciones de acceso y visualización
   * - Configuración de seguridad para información clasificada
   * - Validaciones adicionales para documentos sensibles
   * - Opciones limitadas de exportación y copia de datos
   * 
   * Los anexos sensibles pueden incluir:
   * - Información comercial confidencial
   * - Datos de seguridad nacional
   * - Documentos con restricciones legales
   * - Información personal protegida
   * 
   * @default CONFIGURACION_ANEXOS_SENSIBLES
   * 
   * @example
   * ```typescript
   * // Verificar configuración de seguridad
   * const columnasSensibles = this.configuracionTablaSensibles
   *   .filter(col => col.restringido === true);
   * 
   * // Aplicar filtros adicionales para datos sensibles
   * const datosVisibles = this.datosSensibles
   *   .filter(anexo => this.tienePermisoVisualizacion(anexo));
   * ```
   * 
   * @see {@link ConfiguracionColumna} - Interface para configuración de columnas
   * @see {@link Anexo} - Modelo base para anexos sensibles
   * @see {@link CONFIGURACION_ANEXOS_SENSIBLES} - Configuración especializada
   * @see {@link datosSensibles} - Array de datos que utiliza esta configuración
   */
  configuracionTablaSensibles: ConfiguracionColumna<Anexo>[] =
    CONFIGURACION_ANEXOS_SENSIBLES;

  /**
   * @property {ProductoExportacion[]} datosAnexo
   * @description
   * Array de productos de exportación obtenidos desde el servicio VUCEM.
   * 
   * Esta propiedad almacena la información completa de los productos registrados
   * para exportación en el programa IMMEX. Los datos incluyen:
   * 
   * **Información del producto:**
   * - Fracción arancelaria
   * - Descripción del producto
   * - Unidad de medida
   * - País de origen/destino
   * 
   * **Datos comerciales:**
   * - Valor unitario y total
   * - Cantidad autorizada
   * - Vigencia de autorización
   * 
   * **Información regulatoria:**
   * - Permisos y certificaciones requeridos
   * - Restricciones comerciales
   * - Documentación aduanera
   * 
   * Los datos se filtran automáticamente para mostrar únicamente
   * registros con información válida (no nulos).
   * 
   * @default []
   * 
   * @example
   * ```typescript
   * // Acceder a productos específicos
   * const productosVigentes = this.datosAnexo.filter(
   *   producto => producto.vigencia > new Date()
   * );
   * 
   * // Calcular totales
   * const valorTotal = this.datosAnexo.reduce(
   *   (sum, producto) => sum + producto.valorUnitario * producto.cantidad, 0
   * );
   * ```
   * 
   * @see {@link ProductoExportacion} - Interface que define la estructura de datos
   * @see {@link obteneComplimentaria} - Método que carga estos datos
   * @see {@link configuracionTablaAnexo} - Configuración para mostrar estos datos
   * @see {@link Tramite80302Store.setDatosAnexo} - Método que persiste estos datos
   */
  datosAnexo: ProductoExportacion[] = [];

  /**
   * @property {AnexoImportacion[]} datosImportacion
   * @description
   * Array de anexos relacionados con importaciones del programa IMMEX.
   * 
   * Esta propiedad contiene la información detallada de insumos, materias primas
   * y componentes autorizados para importación temporal bajo el programa IMMEX.
   * 
   * **Estructura de datos incluida:**
   * - Información arancelaria de productos de importación
   * - Datos de proveedores extranjeros autorizados
   * - Cantidades máximas autorizadas para importación
   * - Períodos de vigencia de las autorizaciones
   * - Relación con productos de exportación (trazabilidad)
   * 
   * **Características especiales:**
   * - Vinculación directa con régimen aduanero IMMEX
   * - Validaciones específicas para importación temporal
   * - Filtrado automático de registros con información válida
   * - Integración con sistemas aduaneros mexicanos (VUCEM/SAAI)
   * 
   * Los datos se procesan para eliminar registros vacíos o con valores nulos,
   * asegurando que solo se muestren anexos con información completa y válida.
   * 
   * @default []
   * 
   * @example
   * ```typescript
   * // Filtrar por tipo de insumo
   * const materiasPrimas = this.datosImportacion.filter(
   *   anexo => anexo.tipoInsumo === 'MATERIA_PRIMA'
   * );
   * 
   * // Verificar vigencia de autorizaciones
   * const anexosVigentes = this.datosImportacion.filter(
   *   anexo => new Date(anexo.fechaVigencia) > new Date()
   * );
   * 
   * // Calcular valor total autorizado
   * const valorTotalImportacion = this.datosImportacion
   *   .reduce((total, anexo) => total + anexo.valorMaximo, 0);
   * ```
   * 
   * @see {@link AnexoImportacion} - Interface que define la estructura de datos
   * @see {@link obtenerAnexoImportacion} - Método que carga estos datos
   * @see {@link configuracionTablaImportacion} - Configuración para visualización
   * @see {@link Tramite80302Store.setDatosImportacion} - Método para persistir datos
   */
  datosImportacion: AnexoImportacion[] = [];

  /**
   * @property {Anexo[]} datosSensibles
   * @description
   * Array de anexos que contienen información clasificada como sensible.
   * 
   * Esta propiedad gestiona documentos y datos que requieren tratamiento especial
   * debido a su naturaleza confidencial, comercial o de seguridad nacional.
   * 
   * **Tipos de información sensible incluida:**
   * - Secretos comerciales e industriales
   * - Información técnica propietaria
   * - Datos de seguridad nacional
   * - Información personal protegida (datos personales)
   * - Documentos con restricciones legales o regulatorias
   * - Contratos y acuerdos confidenciales
   * 
   * **Características de seguridad:**
   * - Acceso restringido según perfiles de usuario
   * - Trazabilidad completa de accesos y modificaciones
   * - Cifrado adicional para almacenamiento y transmisión
   * - Auditoría detallada de operaciones realizadas
   * - Controles adicionales de autorización
   * 
   * **Tratamiento especial:**
   * - Visualización condicionada según permisos
   * - Exportación restringida o prohibida
   * - Logs detallados de acceso y manipulación
   * - Tiempo de retención controlado
   * 
   * @default []
   * 
   * @example
   * ```typescript
   * // Verificar permisos antes de mostrar datos sensibles
   * const datosVisibles = this.datosSensibles.filter(anexo => {
   *   return this.usuarioService.tienePermiso('VER_DATOS_SENSIBLES', anexo.nivel);
   * });
   * 
   * // Registrar acceso a datos sensibles
   * this.auditService.registrarAcceso({
   *   usuario: this.usuarioActual,
   *   recurso: 'datos_sensibles_immex',
   *   accion: 'CONSULTA',
   *   timestamp: new Date()
   * });
   * 
   * // Aplicar máscara a datos específicos
   * const datosEnmascarados = this.datosSensibles.map(anexo => ({
   *   ...anexo,
   *   numeroContrato: this.aplicarMascara(anexo.numeroContrato)
   * }));
   * ```
   * 
   * @see {@link Anexo} - Interface base para estructura de anexos
   * @see {@link configuracionTablaSensibles} - Configuración especializada de visualización
   * @see Documentación de seguridad VUCEM para manejo de datos sensibles
   * @see Normativa mexicana de protección de datos personales
   */ 
  datosSensibles: Anexo[] = []; 

  
  /**
   * Estado actual de la solicitud del trámite 80302
   * @type {Solicitud80302State}
   * @description Almacena el estado completo de la solicitud, incluyendo información
   * relevante para el proceso de firma electrónica y validaciones
   */
  public solicitudState!: Solicitud80302State;

  /**
   * @constructor
   * @description
   * Constructor del componente DatosAnexosComponent.
   * 
   * Inicializa el componente inyectando los servicios necesarios para:
   * - Gestión de solicitudes del trámite 80302
   * - Notificaciones al usuario mediante toasts
   * - Gestión del estado global del trámite mediante Akita store
   * 
   * No realiza inicialización de datos en el constructor, siguiendo las
   * mejores prácticas de Angular. La carga de datos se ejecuta en el
   * hook `ngOnInit()` para asegurar que el componente esté completamente
   * inicializado antes de realizar operaciones asíncronas.
   * 
   * @param {SolicitudService} solicitudService - Servicio público para operaciones de solicitud y consulta de anexos del programa IMMEX
   * @param {ToastrService} toastr - Servicio privado para mostrar notificaciones y mensajes al usuario
   * @param {Tramite80302Store} tramite80302Store - Store privado de Akita para gestión centralizada del estado del trámite
   * 
   * @example
   * ```typescript
   * // El constructor se ejecuta automáticamente durante la inyección
   * // No requiere llamada manual
   * 
   * // Los servicios están disponibles para uso en métodos del componente
   * // this.solicitudService -> Operaciones de solicitud
   * // this.toastr -> Notificaciones
   * // this.tramite80302Store -> Gestión de estado
   * ```
   * 
   * @see {@link SolicitudService} - Servicio para operaciones de solicitud
   * @see {@link ToastrService} - Servicio para notificaciones
   * @see {@link Tramite80302Store} - Store para gestión de estado
   * @see {@link ngOnInit} - Hook donde se ejecuta la inicialización de datos
   */
  constructor(
    private solicitudService: SolicitudService,
    private toastr: ToastrService,
    private tramite80302Store: Tramite80302Store,
    private tramite80302Query: Tramite80302Query,
  ) {
       this.tramite80302Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();
  }

  /**
   * @method ngOnInit
   * @description
   * Hook del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * Este método inicia el proceso de carga de datos del componente ejecutando
   * la obtención del ID de solicitud, que desencadena en cascada la carga
   * de todos los anexos relacionados con el trámite 80302.
   * 
   * **Secuencia de inicialización:**
   * 1. Ejecuta `obtenerSolicitudId()` para obtener el ID de solicitud
   * 2. Con el ID obtenido, se ejecutan automáticamente:
   *    - `obteneComplimentaria()` para anexos de exportación
   *    - `obtenerAnexoImportacion()` para anexos de importación
   * 3. Los datos se filtran y almacenan en el store de Akita
   * 4. Las tablas se actualizan automáticamente con los datos obtenidos
   * 
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Se ejecuta automáticamente por Angular
   * // No requiere llamada manual
   * 
   * // Flujo de ejecución:
   * // ngOnInit() 
   * //   ↓
   * // obtenerSolicitudId() 
   * //   ↓
   * // obteneComplimentaria() + obtenerAnexoImportacion()
   * //   ↓
   * // Actualización de tablas
   * ```
   * 
   * @see {@link obtenerSolicitudId} - Método que se ejecuta primero
   * @see {@link obteneComplimentaria} - Carga anexos de exportación  
   * @see {@link obtenerAnexoImportacion} - Carga anexos de importación
   * @see {@link OnInit} - Interface de Angular para este hook
   */
  ngOnInit(): void {
     this.obtenerSolicitudId();
  }

  /**
   * @method obteneComplimentaria
   * @description
   * Obtiene los anexos complementarios de exportación desde el servicio VUCEM.
   * 
   * Este método consulta el servicio de solicitudes para obtener información
   * detallada sobre productos de exportación autorizados en el programa IMMEX.
   * 
   * **Proceso de obtención:**
   * 1. Construye parámetros de consulta usando el ID de solicitud
   * 2. Ejecuta llamada al servicio `obtenerAnexoExportacion`
   * 3. Valida y procesa la respuesta del servidor
   * 4. Filtra registros con datos válidos (no nulos)
   * 5. Actualiza el store de Akita con los datos obtenidos
   * 6. Maneja errores con notificaciones al usuario
   * 
   * **Validaciones aplicadas:**
   * - Verificación de validez del objeto respuesta
   * - Validación de array de datos no vacío
   * - Filtrado de objetos con al menos un campo no nulo
   * - Gestión de errores con rollback automático
   * 
   * La suscripción se gestiona con `takeUntil` para prevenir memory leaks
   * cuando el componente se destruye.
   * 
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Llamada directa del método
   * this.obteneComplimentaria();
   * 
   * // Se ejecuta automáticamente desde obtenerSolicitudId()
   * // después de obtener el ID de solicitud
   * 
   * // Los datos se almacenan en:
   * // - this.datosAnexo (para visualización)
   * // - tramite80302Store (para persistencia)
   * ```
   * 
   * @throws {Error} Muestra notificación de error si falla la consulta al servicio
   * 
   * @see {@link SolicitudService.obtenerAnexoExportacion} - Servicio utilizado
   * @see {@link ProductoExportacion} - Modelo de datos obtenidos
   * @see {@link Tramite80302Store.setDatosAnexo} - Método para persistir datos
   * @see {@link esValidObject} - Función de validación de objetos
   * @see {@link esValidArray} - Función de validación de arrays
   * @see {@link doDeepCopy} - Función para copia profunda de objetos
   */
  obteneComplimentaria(): void {
    const PARAMS = { idSolicitud: this.buscarIdSolicitud };
    this.solicitudService.obtenerAnexoExportacion(PARAMS)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosAnexo = RESPONSE.datos.filter(
                (obj: ProductoExportacion) => Object.values(obj).some(value => value !== null)
              ); // Almacena los datos de operaciones.
              this.tramite80302Store.setDatosAnexo(this.datosAnexo);
            }
          }
        },
        () => {
          this.toastr.error('Error al cargar los anexos de exportación');
        }
      );
  }

  /**
   * @method obtenerAnexoImportacion
   * @description
   * Obtiene los anexos de importación desde el servicio VUCEM para el programa IMMEX.
   * 
   * Este método consulta específicamente los anexos relacionados con importaciones
   * temporales autorizadas bajo el programa IMMEX, incluyendo insumos, materias primas
   * y componentes necesarios para la producción de productos de exportación.
   * 
   * **Características de los datos obtenidos:**
   * - Información arancelaria de productos de importación
   * - Datos de proveedores extranjeros autorizados
   * - Cantidades máximas y períodos de vigencia
   * - Vinculación con productos de exportación (trazabilidad)
   * - Documentación aduanera requerida
   * 
   * **Proceso de obtención:**
   * 1. Construye parámetros usando el ID de solicitud obtenido
   * 2. Ejecuta consulta al servicio `obtenerAnexoImportacion`
   * 3. Valida estructura y contenido de la respuesta
   * 4. Filtra anexos con información válida y completa
   * 5. Actualiza el store con datos procesados
   * 6. Maneja errores con notificaciones descriptivas
   * 
   * **Validaciones específicas:**
   * - Verificación de respuesta válida del servidor
   * - Validación de estructura de datos de importación
   * - Filtrado de registros con al menos un campo poblado
   * - Validación de integridad de datos aduaneros
   * 
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Ejecutado automáticamente desde obtenerSolicitudId()
   * this.obtenerAnexoImportacion();
   * 
   * // Los datos se procesan y almacenan en:
   * // - this.datosImportacion (visualización en tabla)
   * // - tramite80302Store.datosImportacion (persistencia global)
   * 
   * // Ejemplo de filtrado posterior
   * const insumosPrincipales = this.datosImportacion.filter(
   *   anexo => anexo.categoriaInsumo === 'PRINCIPAL'
   * );
   * ```
   * 
   * @throws {Error} Muestra notificación de error específica para importación
   * 
   * @see {@link SolicitudService.obtenerAnexoImportacion} - Servicio específico utilizado
   * @see {@link AnexoImportacion} - Modelo de datos para importaciones IMMEX
   * @see {@link Tramite80302Store.setDatosImportacion} - Persistencia en store
   * @see {@link configuracionTablaImportacion} - Configuración de visualización
   * @see Documentación IMMEX sobre importación temporal
   */
  obtenerAnexoImportacion(): void {
    const PARAMS = { idSolicitud: this.buscarIdSolicitud };
    this.solicitudService.obtenerAnexoImportacion(PARAMS)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datosImportacion = RESPONSE.datos.filter(
                (obj: AnexoImportacion) => Object.values(obj).some(value => value !== null)
              ); // Almacena los datos de operaciones.
              this.tramite80302Store.setDatosImportacion(this.datosImportacion);
            }
          }
        },
        () => {
          this.toastr.error('Error al cargar los anexos de importación');
        }
      );
  }

    /**
     * @method obtenerSolicitudId
     * @description
     * Obtiene el identificador único de la solicitud del programa IMMEX desde el servicio.
     * 
     * Este método es el punto de entrada para la carga de datos del componente.
     * Consulta el servicio para obtener el ID de solicitud usando los parámetros
     * del programa IMMEX y desencadena la carga en cascada de todos los anexos.
     * 
     * **Parámetros de consulta:**
     * - `idPrograma`: "105639" (identificador específico del programa IMMEX)
     * - `tipoPrograma`: "TICPSE.IMMEX" (tipo de programa en VUCEM)
     * 
     * **Procesamiento del ID:**
     * 1. Obtiene la respuesta del servicio con IDs de solicitud
     * 2. Procesa el campo `buscaIdSolicitud` que puede contener múltiples IDs
     * 3. Separa IDs por comas y elimina espacios
     * 4. Filtra IDs vacíos o con valor cero
     * 5. Reconstruye la cadena con IDs válidos
     * 
     * **Flujo subsecuente:**
     * Una vez obtenido el ID válido, ejecuta automáticamente:
     * - `obteneComplimentaria()` para anexos de exportación
     * - `obtenerAnexoImportacion()` para anexos de importación
     * 
     * **Gestión de errores:**
     * - Validación de respuesta del servidor
     * - Manejo de errores con notificación al usuario
     * - Rollback automático en caso de fallo
     * 
     * @returns {void}
     * 
     * @example
     * ```typescript
     * // Se ejecuta automáticamente desde ngOnInit()
     * this.obtenerSolicitudId();
     * 
     * // Ejemplo de resultado procesado:
     * // Respuesta del servidor: "12345, 67890, 0, , 11111"
     * // ID procesado: "12345,67890,11111"
     * 
     * // Flujo completo:
     * // obtenerSolicitudId() → buscarIdSolicitud = "12345,67890"
     * //   ↓
     * // obteneComplimentaria() + obtenerAnexoImportacion()
     * //   ↓
     * // Carga completa de anexos
     * ```
     * 
     * @throws {Error} Muestra notificación de error si falla la obtención del ID
     * 
     * @see {@link SolicitudService.obtenerSolicitudId} - Servicio utilizado
     * @see {@link obteneComplimentaria} - Método ejecutado con el ID obtenido
     * @see {@link obtenerAnexoImportacion} - Método ejecutado con el ID obtenido
     * @see {@link buscarIdSolicitud} - Propiedad que almacena el ID procesado
     * @see Documentación VUCEM sobre identificadores de programa IMMEX
     */
    obtenerSolicitudId(): void {
      const PAYLOAD = {
        "idPrograma": this.solicitudState.selectedIdPrograma,
        "tipoPrograma": this.solicitudState.selectedTipoPrograma
      };
      this.solicitudService
        .obtenerSolicitudId(PAYLOAD) // Llama al servicio para obtener los datos de operaciones.
        .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
        .subscribe(
          (data) => {
            if(esValidObject(data)) {
              const RESPONSE = doDeepCopy(data);
              this.buscarIdSolicitud = RESPONSE.datos?.buscaIdSolicitud.split(',')
              .map((id:string) => id.trim())
              .filter((id:string) => id !== '' && id !== '0') // remove empty and zero
              .join(',');
              this.obteneComplimentaria(); // Carga los anexos complementarios.
              this.obtenerAnexoImportacion(); // Carga los anexos de importación.
            }
          },
          () => {
            this.toastr.error('Error al cargar las operaciones'); // Manejo de errores.
          }
        );
    }

  /**
   * @method ngOnDestroy
   * @description
   * Hook del ciclo de vida de Angular que se ejecuta cuando el componente va a ser destruido.
   * 
   * Este método implementa la limpieza necesaria para prevenir memory leaks
   * y asegurar que todas las suscripciones activas se cancelen correctamente
   * antes de que el componente sea removido del DOM.
   * 
   * **Proceso de limpieza:**
   * 1. Emite señal de finalización a través de `destroyNotifier$`
   * 2. Cancela automáticamente todas las suscripciones activas que usan `takeUntil`
   * 3. Completa el Subject para liberar memoria y recursos
   * 4. Permite que el garbage collector limpie referencias
   * 
   * **Suscripciones gestionadas:**
   * - `obtenerSolicitudId()` - Consulta de ID de solicitud
   * - `obteneComplimentaria()` - Carga de anexos de exportación
   * - `obtenerAnexoImportacion()` - Carga de anexos de importación
   * 
   * **Importancia de la implementación:**
   * - Previene memory leaks en aplicaciones SPA
   * - Evita suscripciones "fantasma" que continúan ejecutándose
   * - Libera recursos del sistema de manera ordenada
   * - Cumple con las mejores prácticas de Angular
   * 
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Se ejecuta automáticamente por Angular
   * // No requiere llamada manual
   * 
   * // Patrón usado en suscripciones:
   * this.solicitudService.obtenerAnexos()
   *   .pipe(takeUntil(this.destroyNotifier$)) // ← Se cancela aquí
   *   .subscribe(data => {
   *     // Esta suscripción se cancela automáticamente
   *   });
   * 
   * // Al ejecutarse ngOnDestroy():
   * // 1. this.destroyNotifier$.next() → cancela suscripciones
   * // 2. this.destroyNotifier$.complete() → libera memoria
   * ```
   * 
   * @implements {OnDestroy}
   * 
   * @see {@link destroyNotifier$} - Subject utilizado para notificación
   * @see {@link takeUntil} - Operador RxJS para cancelación automática
   * @see {@link OnDestroy} - Interface de Angular para este hook
   * @see Documentación Angular sobre gestión de suscripciones y memory leaks
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.complete(); // Finaliza el Subject para evitar fugas de memoria.
  }
}
