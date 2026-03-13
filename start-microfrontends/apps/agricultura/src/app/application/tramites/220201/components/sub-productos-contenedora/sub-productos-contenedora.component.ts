/**
 * @file SubProductosContenedoraComponent
 * @description Componente contenedor para la gestión de sub-productos en el trámite 220201.
 * Proporciona la lógica para cargar catálogos, manejar el formulario y actualizar el estado.
 */

import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ProductoDetallaEventos, ProductosCatalogosDatos } from '../../../../shared/models/datos-de-la-solicitue.model';
import { Subject, map, takeUntil, } from 'rxjs';
import { AgriculturaApiService } from '../../services/220201/agricultura-api.service';
import { CatalogosService } from '../../services/220201/catalogos/catalogos.service'
import { CommonModule } from '@angular/common';
import { FilaSolicitud } from '../../models/220201/capturar-solicitud.model';
import { SubProductosComponent } from '../../../../shared/components/sub-productos/sub-productos.component';
import { ZoosanitarioQuery } from '../../queries/220201/zoosanitario.query';
import { ZoosanitarioStore } from '../../estados/220201/zoosanitario.store';

/**
 * @componente SubProductosContenedoraComponent
 * @descripcion
 * Componente contenedor especializado para la gestión completa de sub-productos 
 * en el trámite 220201 del módulo de agricultura.
 * 
 * @responsabilidades
 * - Carga y gestión de catálogos de datos para sub-productos
 * - Procesamiento de formularios de solicitud de sub-productos
 * - Actualización del estado global del store fitosanitario
 * - Manejo de suscripciones RxJS con limpieza automática
 * - Comunicación bidireccional con componentes padre e hijo
 * 
 * @patron_arquitectonico
 * - Container/Presentation Pattern: Actúa como contenedor que maneja lógica de negocio
 * - State Management: Integración con Akita store para manejo de estado
 * - Reactive Programming: Uso de observables RxJS para flujo de datos
 * 
 * @dependencias_clave
 * - AgriculturaApiService: Para carga de catálogos desde JSON
 * - ZoosanitarioQuery: Para consulta reactiva del estado
 * - ZoosanitarioStore: Para actualización del estado global
 * 
 * @flujo_de_datos
 * 1. Carga inicial de catálogos desde API
 * 2. Suscripción a cambios en el estado del store
 * 3. Procesamiento de eventos del formulario hijo
 * 4. Actualización del estado global
 * 
 * @casos_de_uso
 * - Registro de nuevos sub-productos en solicitudes
 * - Edición de sub-productos existentes
 * - Validación de datos de sub-productos
 * - Navegación entre diferentes tipos de productos
 */
@Component({
  selector: 'app-sub-productos-contenedora',
  standalone: true,
  imports: [CommonModule, SubProductosComponent],
  templateUrl: './sub-productos-contenedora.component.html',
  styleUrl: './sub-productos-contenedora.component.css',
})
export class SubProductosContenedoraComponent implements OnDestroy {

  /**
   * @propiedad catalogosDatos
   * @tipo {ProductosCatalogosDatos}
   * @publico
   * @descripcion
   * Objeto que almacena todos los catálogos de datos necesarios para el formulario de sub-productos.
   * 
   * @estructura_completa
   * @contiene
   * - tipoRequisitoList: Tipos de requisitos disponibles para sub-productos
   * - requisitoList: Lista de requisitos específicos por tipo
   * - fraccionArancelariaList: Fracciones arancelarias aplicables
   * - nicoList: Códigos NICO (Nomenclatura de Identificación Comercial)
   * - umtList: Unidades de Medida de Transporte
   * - umcList: Unidades de Medida Comercial
   * - especieList: Especies vegetales permitidas
   * - usoList: Usos destinados para los sub-productos
   * - paisOrigenList: Países de origen autorizados
   * - paisDeProcedenciaList: Países de procedencia válidos
   * - sexoList: Clasificaciones de sexo (si aplica)
   * - presentacionList: Formas de presentación del producto
   * - cantidadPresentacionList: Cantidades estándar de presentación
   * - tipoPresentacionList: Tipos de presentación comercial
   * - tipoPlantaList: Clasificaciones de tipos de planta
   * - plantaAutorizadaOrigenList: Plantas autorizadas por origen
   * 
   * @inicializacion
   * Se inicializa con arrays vacíos que se llenan mediante la carga de 'productos.json'
   * desde el servicio AgriculturaApiService en el constructor.
   * 
   * @uso_en_template
   * Utilizado para poblar dropdowns, selects y otros controles de formulario
   * que requieren opciones predefinidas.
   */
  public catalogosDatos: ProductosCatalogosDatos = {
    tipoRequisitoList: [],
    requisitoList: [],
    fraccionArancelariaList: [],
    nicoList: [],
    umtList: [],
    umcList: [],
    especieList: [],
    usoList: [],
    paisOrigenList: [],
    paisDeProcedenciaList: [],
    sexoList: [],
    presentacionList: [],
    cantidadPresentacionList: [],
    tipoPresentacionList: [],
    tipoPlantaList: [],
    plantaAutorizadaOrigenList: []
  }

  /**
   * @propiedad destroyNotifier$
   * @tipo {Subject<void>}
   * @publico
   * @descripcion
   * Subject utilizado para implementar el patrón de destrucción de suscripciones RxJS.
   * 
   * @patron_utilizado
   * takeUntil Pattern - Patrón estándar para prevenir memory leaks en Angular
   * 
   * @funcionamiento
   * - Se utiliza como señal de terminación para todas las suscripciones
   * - Al destruir el componente, emite una señal que cancela automáticamente todas las suscripciones
   * - Garantiza limpieza adecuada de recursos y prevención de memory leaks
   * 
   * @implementacion
   * ```typescript
   * observable$.pipe(
   *   takeUntil(this.destroyNotifier$)
   * ).subscribe();
   * ```
   * 
   * @limpieza
   * En ngOnDestroy() se ejecuta:
   * - this.destroyNotifier$.next() - Emite señal de destrucción
   * - this.destroyNotifier$.complete() - Completa el Subject
   * 
   * @beneficios
   * - Previene memory leaks automáticamente
   * - Cancela todas las suscripciones de forma centralizada
   * - Mejora el rendimiento de la aplicación
   */
  public destroyNotifier$ = new Subject<void>();

  /**
   * @propiedad formularioSolicitud
   * @tipo {FilaSolicitud}
   * @publico
   * @descripcion
   * Almacena los datos del formulario de solicitud de sub-productos actualmente seleccionado.
   * 
   * @proposito
   * - Mantiene el estado actual del formulario de edición
   * - Se actualiza automáticamente cuando se selecciona un elemento de la tabla
   * - Proporciona datos iniciales para el componente hijo SubProductosComponent
   * 
   * @ciclo_de_vida
   * 1. Se inicializa como undefined (usando el operador !)
   * 2. Se actualiza cuando hay cambios en el selectedDatos del store
   * 3. Se procesa a través de createFormularioFromValor() para estructura adecuada
   * 4. Se pasa al componente hijo para prellenar el formulario
   * 
   * @estructura_datos
   * Contiene todos los campos necesarios para un sub-producto:
   * - Datos básicos: id, tipoRequisito, requisito, certificados
   * - Datos comerciales: fracción arancelaria, NICO, descripción
   * - Datos de medición: UMT, UMC, cantidades
   * - Datos específicos: especie, uso, país origen/procedencia
   * - Datos de producto: tipo, lote, presentación, planta autorizada
   * 
   * @vinculacion_reactiva
   * Se actualiza automáticamente mediante la suscripción al fitosanitarioQuery.seleccionarState$
   */
  public formularioSolicitud!: FilaSolicitud;

  /**
   * @evento cerrar
   * @tipo {EventEmitter<void>}
   * @output
   * @descripcion
   * EventEmitter que notifica al componente padre sobre la solicitud de cierre del contenedor.
   * 
   * @proposito
   * - Facilita la comunicación hacia arriba en la jerarquía de componentes
   * - Permite al componente padre manejar la lógica de cierre/navegación
   * - Implementa el patrón de comunicación unidireccional de Angular
   * 
   * @casos_de_uso
   * - Usuario cancela la edición de sub-productos
   * - Se completa exitosamente una operación de guardado
   * - Navegación hacia otros pasos del proceso
   * - Cierre de modal o panel lateral
   * 
   * @implementacion_padre
   * ```html
   * <app-sub-productos-contenedora 
   *   (cerrar)="manejarCierreSubProductos()">
   * </app-sub-productos-contenedora>
   * ```
   * 
   * @emision
   * Se emite llamando a this.cerrar.emit() desde métodos internos del componente
   * cuando se requiere notificar al padre sobre la necesidad de cierre.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * @propiedad cantidadRegistros
   * @tipo {number}
   * @input
   * @descripcion
   * Recibe desde el componente padre la cantidad total de registros de sub-productos.
   * 
   * @proposito
   * - Permite mostrar información de conteo en el template (por ejemplo, número de sub-productos registrados)
   * - Facilita validaciones o restricciones basadas en el número de registros existentes
   * 
   * @uso_en_template
   * Puede ser utilizado para mostrar mensajes condicionales, habilitar/deshabilitar botones, etc.
   * 
   * @valor_predeterminado
   * Se inicializa en 0 para evitar valores undefined antes de recibir el dato del padre.
   */
  @Input() cantidadRegistros: number = 0;

  cuerpoTabla: FilaSolicitud[] = [];

  /**
   * @constructor
   * @descripcion
   * Constructor del componente SubProductosContenedoraComponent que inicializa las dependencias
   * y establece las suscripciones necesarias para el funcionamiento del componente.
   * 
   * @parametros_inyectados
   * @param {AgriculturaApiService} agriculturaApiService - Servicio para comunicación con API del módulo agricultura
   * @param {ZoosanitarioQuery} fitosanitarioQuery - Servicio de consulta para acceso reactivo al estado fitosanitario
   * @param {ZoosanitarioStore} fitosanitarioStore - Servicio de store para gestión centralizada del estado
   * 
   * @inicializacion_automatica
   * El constructor ejecuta automáticamente dos operaciones críticas:
   * 
   * 1. **Carga de Catálogos**:
   *    - Obtiene datos desde 'productos.json' via agriculturaApiService
   *    - Populate catalogosDatos con listas de opciones para formularios
   *    - Asegura disponibilidad de datos de referencia antes de renderizado
   * 
   * 2. **Suscripción Reactiva al Estado**:
   *    - Se suscribe a fitosanitarioQuery.seleccionarState$
   *    - Procesa cambios en selectedDatos[0] para actualizar formularioSolicitud
   *    - Utiliza takeUntil para gestión automática de limpieza de suscripciones
   *    - Transforma datos mediante createFormularioFromValor()
   * 
   * @patron_inyeccion_dependencias
   * Utiliza el sistema de DI de Angular con modificadores de acceso público
   * para permitir acceso desde el template si es necesario.
   * 
   * @flujo_inicializacion
   * Constructor → Carga catálogos → Establece suscripción → Componente listo
   */
  constructor(
    public agriculturaApiService: AgriculturaApiService,
    public fitosanitarioQuery: ZoosanitarioQuery,
    public fitosanitarioStore: ZoosanitarioStore,
    private catalogoService: CatalogosService
  ) {
    /**
     * @inicializacion_catalogos
     * @descripcion
     * Carga inicial de catálogos desde archivo JSON de configuración.
     * 
     * @operacion
     * - Realiza petición HTTP a 'productos.json'
     * - Asigna respuesta completa al objeto catalogosDatos
     * - Proporciona datos de referencia para todos los controles del formulario
     * 
     * @contenido_productos_json
     * El archivo contiene arrays con opciones para:
     * - Clasificaciones de productos y requisitos
     * - Códigos de comercio exterior (fracciones, NICO)
     * - Unidades de medida y cantidad
     * - Información geográfica (países, procedencias)
     * - Especificaciones técnicas (especies, usos, presentaciones)
     * 
     * @manejo_asincrono
     * La suscripción es automática y no requiere unsubscribe manual
     * ya que es una operación HTTP que se completa automáticamente.
     */


    this.catalogoService.obtieneCatalogoConsultaPaises(220201).subscribe({
      next: (data) => {
        this.catalogosDatos.paisOrigenList = data.datos ?? [];
        this.catalogosDatos.paisDeProcedenciaList = data.datos ?? [];
      }
    });

    this.catalogoService.obtieneCatalogoEspecies(220201).subscribe({
      next: (data) => {
        this.catalogosDatos.especieList = data.datos ?? [];
      }
    });

    this.catalogoService.obtieneCatalogoUnidadesMedidaComerciales(220201).subscribe({
      next: (data) => {
        this.catalogosDatos.umcList = data.datos ?? [];
      }
    });

    this.catalogoService.obtieneCatalogoUsosMercancia(220201).subscribe({
      next: (data) => {
        this.catalogosDatos.usoList = data.datos ?? [];
      }
    });

    this.catalogoService.obtieneCatalogoFraccionesArancelarias(220201).subscribe({
      next: (data) => {
        this.catalogosDatos.fraccionArancelariaList = data.datos ?? [];
      }
    });

    this.catalogoService.obtieneCatalogoRestricciones(220201).subscribe({
      next: (data) => {
        this.catalogosDatos.tipoRequisitoList = data.datos ?? [];
      }
    });

    this.catalogoService.obtieneCatalogoTipoPresentacion(220201).subscribe({
      next: (data) => {
        this.catalogosDatos.presentacionList = data.datos ?? [];
      }
    });

    this.catalogoService.obtieneCatalogoTipoPlanta(220201).subscribe({
      next: (data) => {
        this.catalogosDatos.tipoPlantaList = data.datos ?? [];
      }
    });

    this.catalogoService.obtieneCatalogoSubtipoPresentacion(220201).subscribe({
      next: (data) => {
        this.catalogosDatos.tipoPresentacionList = data.datos ?? [];
      }
    });

    this.catalogoService.obtieneCatalogoNico(220201).subscribe({
      next: (data) => {
        this.catalogosDatos.nicoList = data.datos ?? [];
      }
    });



    /**
     * @suscripcion_estado_reactivo
     * @descripcion
     * Establece suscripción reactiva al estado del store para actualización automática del formulario.
     * 
     * @flujo_de_datos
     * 1. Escucha cambios en fitosanitarioQuery.seleccionarState$
     * 2. Utiliza takeUntil para gestión automática de limpieza
     * 3. Mapea estado para extraer primer elemento seleccionado
     * 4. Si existe VALOR, crea formulario mediante método estático
     * 5. Actualiza formularioSolicitud para uso en template
     * 
     * @transformacion_datos
     * - Extrae selectedDatos[0] del estado
     * - Valida existencia antes de procesamiento
     * - Aplica createFormularioFromValor() para estructura consistente
     * - Garantiza que todos los campos tengan valores por defecto
     * 
     * @patron_rxjs
     * Combina pipe operators para control de flujo:
     * - takeUntil(): Limpieza automática de suscripción
     * - map(): Transformación de datos del estado
     */
    this.fitosanitarioQuery.seleccionarState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((estado) => {

          this.cuerpoTabla = estado?.tablaDatos;
          const VALOR = estado?.selectedDatos[0];
          const DATA = estado?.selectedDatos.find(v => v.id === VALOR?.id);

          if (DATA) {
            DATA.modificado = true; // Establece modificado a true si hay datos seleccionados
            this.formularioSolicitud = SubProductosContenedoraComponent.createFormularioFromValor(DATA);
          }
        })
      )
      .subscribe();
  }

  /**
   * @metodo createFormularioFromValor
   * @estatico
   * @privado
   * @descripcion
   * Método estático que crea un objeto de formulario completo a partir de datos seleccionados del store.
   * 
   * @parametros
   * @param {FilaSolicitud} VALOR - Datos de la fila seleccionada desde el estado del store
   * 
   * @retorna {FilaSolicitud} Objeto FilaSolicitud completo con todos los campos procesados
   * 
   * @estrategia_construccion
   * Utiliza el patrón de composición dividiendo la creación en dos fases:
   * 1. **Campos Básicos**: Información fundamental del producto (getBasicFields)
   * 2. **Campos Adicionales**: Datos específicos y técnicos (getAdditionalFields)
   * 
   * @beneficios_patron
   * - **Separación de Responsabilidades**: Cada método maneja un grupo específico de campos
   * - **Mantenibilidad**: Facilita modificaciones futuras sin afectar toda la lógica
   * - **Testabilidad**: Permite pruebas unitarias específicas para cada grupo de campos
   * - **Legibilidad**: Código más claro y fácil de entender
   * 
   * @proceso_construccion
   * 1. Obtiene campos básicos mediante getBasicFields(VALOR)
   * 2. Obtiene campos adicionales mediante getAdditionalFields(VALOR)
   * 3. Combina ambos conjuntos usando spread operator ({...})
   * 4. Asegura tipo FilaSolicitud mediante casting (as FilaSolicitud)
   * 
   * @inmutabilidad
   * No modifica el objeto VALOR original, sino que crea una nueva instancia
   * con los datos procesados y valores por defecto aplicados.
   */
  private static createFormularioFromValor(VALOR: FilaSolicitud): FilaSolicitud {
    const BASIC_FIELDS = SubProductosContenedoraComponent.getBasicFields(VALOR);
    const ADDITIONAL_FIELDS = SubProductosContenedoraComponent.getAdditionalFields(VALOR);
    return { ...BASIC_FIELDS, ...ADDITIONAL_FIELDS } as FilaSolicitud;
  }

  /**
   * @metodo getBasicFields
   * @estatico
   * @privado
   * @descripcion
   * Extrae y procesa los campos básicos fundamentales de una FilaSolicitud.
   * 
   * @parametros
   * @param {FilaSolicitud} VALOR - Objeto fuente con datos originales
   * 
   * @retorna {Partial<FilaSolicitud>} Objeto parcial con solo campos básicos procesados
   * 
   * @campos_basicos_incluidos
   * - **id**: Identificador único (generado aleatoriamente si no existe)
   * - **tipoRequisito**: Clasificación del tipo de requisito aplicable
   * - **requisito**: Descripción específica del requisito
   * - **numeroCertificadoInternacional**: Número de certificado internacional si aplica
   * - **fraccionArancelaria**: Código de fracción arancelaria para comercio exterior
   * - **descripcionFraccion**: Descripción textual de la fracción arancelaria
   * - **nico**: Código NICO (Nomenclatura de Identificación Comercial)
   * - **descripcionNico**: Descripción del código NICO
   * - **descripcion**: Descripción general del producto
   * 
   * @generacion_id
   * Si no existe ID, genera uno aleatorio usando Math.floor(Math.random() * 1000000)
   * para garantizar unicidad temporal durante la sesión de usuario.
   * 
   * @valores_predeterminados
   * Todos los campos utilizan el operador OR (||) con cadena vacía ('')
   * para evitar valores undefined o null en el formulario.
   * 
   * @proposito_separacion
   * Estos campos representan la información mínima requerida para identificar
   * y clasificar un sub-producto en el sistema.
   */
  private static getBasicFields(VALOR: FilaSolicitud): Partial<FilaSolicitud> {
    return {
      id: VALOR.id || Math.floor(Math.random() * 1000000),
      tipoRequisito: VALOR.tipoRequisito || '',
      requisito: VALOR.requisito || '',
      numeroCertificadoInternacional: VALOR.numeroCertificadoInternacional || '',
      fraccionArancelaria: VALOR.fraccionArancelaria || '',
      descripcionFraccion: VALOR.descripcionFraccion || '',
      nico: VALOR.nico || '',
      descripcionNico: VALOR.descripcionNico || '',
      descripcion: VALOR.descripcion || '',
      detalleProductos: Array.isArray(VALOR.detalleProductos) ? VALOR.detalleProductos : undefined,
      modificado: VALOR.modificado || false,
      cantidadPresentacion: VALOR.cantidadPresentacion || ''
    };
  }

  /**
   * @metodo getAdditionalFields
   * @estatico
   * @privado
   * @descripcion
   * Extrae y procesa los campos adicionales específicos para sub-productos vegetales.
   * 
   * @parametros
   * @param {FilaSolicitud} VALOR - Objeto fuente con datos completos
   * 
   * @retorna {Partial<FilaSolicitud>} Objeto parcial con campos adicionales procesados
   * 
   * @campos_adicionales_incluidos
   * **Medidas y Cantidades:**
   * - cantidadUMT: Cantidad en Unidad de Medida de Transporte (convertida a string)
   * - umt: Código de Unidad de Medida de Transporte
   * - cantidadUMC: Cantidad en Unidad de Medida Comercial (convertida a string)
   * - umc: Código de Unidad de Medida Comercial
   * 
   * **Clasificación Biológica:**
   * - especie: Especie vegetal específica del sub-producto
   * - uso: Uso destinado o finalidad del sub-producto
   * 
   * **Información Geográfica:**
   * - paisDeOrigen: País donde se originó el sub-producto
   * - paisDeProcedencia: País desde donde se envía el sub-producto
   * 
   * **Datos de Control:**
   * - noPartida: Número de partida para control interno
   * - tipoDeProducto: Clasificación específica del tipo de producto
   * - numeroDeLote: Número de lote para trazabilidad
   * - certificadoInternacionalElectronico: Certificado electrónico internacional
   * 
   * **Especificaciones de Producto:**
   * - tipoPresentacion: Forma de presentación comercial del producto
   * - tipoPlanta: Clasificación del tipo de planta origen
   * - plantaAutorizadaOrigen: Planta autorizada donde se originó
   * - presentacion: Descripción específica de la presentación
   * 
   * @conversion_tipos
   * Las cantidades (UMT y UMC) se convierten explícitamente a string
   * para mantener consistencia con los controles de formulario que manejan texto.
   * 
   * @aplicabilidad
   * Estos campos son específicos para sub-productos del sector agrícola
   * y pueden no aplicar a otros tipos de productos del sistema.
   */
  private static getAdditionalFields(VALOR: FilaSolicitud): Partial<FilaSolicitud> {
    return {
      cantidadUMT: String(VALOR.cantidadUMT || ''),
      umt: VALOR.umt || '',
      cantidadUMC: String(VALOR.cantidadUMC || ''),
      umc: VALOR.umc || '',
      especie: VALOR.especie || '',
      uso: VALOR.uso || '',
      paisDeOrigen: VALOR.paisDeOrigen || '',
      paisDeProcedencia: VALOR.paisDeProcedencia || '',
      noPartida: VALOR.noPartida || '',
      tipoDeProducto: VALOR.tipoDeProducto || '',
      numeroDeLote: VALOR.numeroDeLote || '',
      certificadoInternacionalElectronico: VALOR.certificadoInternacionalElectronico || '',
      tipoPresentacion: VALOR.tipoPresentacion || '',
      tipoPlanta: VALOR.tipoPlanta || '',
      id_tipo_planta: VALOR.tipoPlanta || '',
      plantaAutorizadaOrigen: VALOR.plantaAutorizadaOrigen || '',
      id_planta_autorizada_origen: VALOR.plantaAutorizadaOrigen || '',
      presentacion: VALOR.presentacion || ''
    };
  }

  /**
   * @metodo agregarDatosFormulario
   * @publico
   * @descripcion
   * Método principal para procesar y agregar datos del formulario de sub-productos al estado global.
   * 
   * @parametros
   * @param {ProductoDetallaEventos} valor - Evento emitido por el componente hijo SubProductosComponent
   * 
   * @estructura_evento
   * El parámetro valor contiene:
   * - formulario: Datos parciales del formulario de sub-productos
   * - Otros metadatos del evento si los hubiera
   * 
   * @flujo_procesamiento
   * 1. **Extracción**: Obtiene datos del formulario desde valor.formulario
   * 2. **Transformación**: Convierte datos parciales a FilaSolicitud completa via createDatosFromFormulario()
   * 3. **Persistencia**: Actualiza el store global mediante updateStoreWithDatos()
   * 
   * @responsabilidades
   * - Validar estructura de datos de entrada
   * - Coordinar transformación de datos del formulario
   * - Delegar actualización del estado al método especializado
   * - Mantener integridad de datos durante el proceso
   * 
   * @patron_utilizado
   * Command Pattern: El método actúa como comando que encapsula
   * la operación completa de agregar datos al sistema.
   * 
   * @efectos_secundarios
   * - Actualiza el estado global del store fitosanitario
   * - Dispara notificaciones a todos los componentes suscritos
   * - Puede provocar re-renderizado de la tabla de datos
   * - Limpia la selección actual (selectedDatos = [])
   * 
   * @manejo_errores
   * Delega el manejo de errores a los métodos auxiliares especializados.
   */
  agregarDatosFormulario(valor: ProductoDetallaEventos): void {
    const DATOS = SubProductosContenedoraComponent.createDatosFromFormulario(valor.formulario);
    // Elimina el valor anterior si existe
    const VALOR = this.fitosanitarioStore.getValue().tablaDatos;
    const FILTERED_VALOR = VALOR.filter(
      (item) => !this.fitosanitarioStore.getValue().selectedDatos.includes(item)
    );
    this.fitosanitarioStore.update(
      (state) => ({
        ...state,
        tablaDatos: FILTERED_VALOR
      })
    );
    this.updateStoreWithDatos(DATOS);
  }

  /**
   * @metodo createDatosFromFormulario
   * @estatico
   * @privado
   * @descripcion
   * Transforma datos parciales del formulario en un objeto FilaSolicitud completo y válido.
   * 
   * @parametros
   * @param {Partial<FilaSolicitud>} formulario - Datos parciales provenientes del formulario de usuario
   * 
   * @retorna {FilaSolicitud} Objeto FilaSolicitud completo listo para almacenar en el store
   * 
   * @estrategia_transformacion
   * Implementa el patrón de construcción por composición:
   * 1. **Campos Básicos**: Procesa información fundamental mediante getBasicDataFields()
   * 2. **Campos Adicionales**: Procesa información específica mediante getAdditionalDataFields()
   * 3. **Combinación**: Utiliza spread operator para crear objeto unificado
   * 4. **Tipado**: Asegura tipo FilaSolicitud mediante casting explícito
   * 
   * @diferencia_con_createFormularioFromValor
   * - **createFormularioFromValor**: Store → Formulario (para edición)
   * - **createDatosFromFormulario**: Formulario → Store (para persistencia)
   * 
   * @garantias_calidad
   * - Todos los campos tendrán valores válidos (nunca undefined/null)
   * - Estructura consistente independientemente de datos de entrada
   * - Compatibilidad total con el modelo FilaSolicitud
   * - Preservación de datos existentes con valores por defecto para faltantes
   * 
   * @casos_uso_tipicos
   * - Creación de nuevos registros de sub-productos
   * - Actualización de registros existentes
   * - Conversión de datos de formulario para API calls
   * 
   * @validacion_implicita
   * Los métodos auxiliares aplican validaciones y valores por defecto
   * asegurando que el resultado sea siempre válido para el store.
   */
  private static createDatosFromFormulario(formulario: Partial<FilaSolicitud>): FilaSolicitud {
    const BASIC_DATA = SubProductosContenedoraComponent.getBasicDataFields(formulario);
    const ADDITIONAL_DATA = SubProductosContenedoraComponent.getAdditionalDataFields(formulario);
    return { ...BASIC_DATA, ...ADDITIONAL_DATA } as FilaSolicitud;
  }

  /**
   * @metodo getBasicDataFields
   * @estatico
   * @privado
   * @descripcion
   * Procesa campos básicos desde datos de formulario para crear entrada de datos válida en el store.
   * 
   * @parametros
   * @param {Partial<FilaSolicitud>} formulario - Datos parciales del formulario de usuario
   * 
   * @retorna {Partial<FilaSolicitud>} Campos básicos procesados con valores seguros
   * 
   * @campos_procesados
   * - **id**: Utiliza ID existente o genera uno aleatorio para nuevos registros
   * - **noPartida**: Siempre se inicializa como cadena vacía (campo calculado posteriormente)
   * - **tipoRequisito**: Tipo de requisito seleccionado por el usuario
   * - **requisito**: Requisito específico aplicable al sub-producto
   * - **numeroCertificadoInternacional**: Número de certificado si es requerido
   * - **fraccionArancelaria**: Código de fracción arancelaria para exportación
   * - **descripcionFraccion**: Descripción textual de la fracción seleccionada
   * - **nico**: Código NICO del producto
   * - **descripcionNico**: Descripción del código NICO
   * - **descripcion**: Descripción general del sub-producto
   * 
   * @logica_id_generation
   * ```typescript
   * id: formulario.id || Math.floor(Math.random() * 1000000)
   * ```
   * Genera ID aleatorio de 6 dígitos máximo para registros nuevos,
   * manteniendo ID existente para actualizaciones.
   * 
   * @campo_especial_noPartida
   * Se inicializa siempre como cadena vacía porque este valor
   * típicamente se calcula o asigna por el sistema backend.
   * 
   * @robustez_datos
   * Utiliza operador OR (||) para garantizar que ningún campo
   * sea undefined o null, proporcionando cadenas vacías como fallback.
   */
  // eslint-disable-next-line complexity
  private static getBasicDataFields(formulario: Partial<FilaSolicitud>): Partial<FilaSolicitud> {
    return {
      id: formulario.id || Math.floor(Math.random() * 1000000),
      noPartida: formulario.noPartida || '',
      tipoRequisito: formulario.tipoRequisito || '',
      descripcionTipoRequisito: formulario.descripcionTipoRequisito || '',
      descripcionUMT: formulario.descripcionUMT || '',
      descripcionUMC: formulario.descripcionUMC || '',
      descripcionEspecie: formulario.descripcionEspecie || '',
      descripcionPaisDeOrigen: formulario.descripcionPaisDeOrigen || '',
      descripcionPaisDeProcedencia: formulario.descripcionPaisDeProcedencia || '',
      descripcionUso: formulario.descripcionUso || '',
      requisito: formulario.requisito || '',
      numeroCertificadoInternacional: formulario.numeroCertificadoInternacional || '',
      fraccionArancelaria: formulario.fraccionArancelaria || '',
      descripcionFraccion: formulario.descripcionFraccion || '',
      nico: formulario.nico || '',
      descripcionNico: formulario.descripcionNico || '',
      descripcion: formulario.descripcion || '',
      detalleProductos: Array.isArray(formulario.detalleProductos) ? formulario.detalleProductos : undefined,
      tipoPresentacionDescripcion: formulario.tipoPresentacionDescripcion || '',
      modificado: formulario.modificado || false,
      cantidadPresentacion: formulario.cantidadPresentacion || '',
      tipoPresentacion: formulario.tipoPresentacion || ''
    };
  }

  /**
   * @metodo getAdditionalDataFields
   * @estatico
   * @privado
   * @descripcion
   * Procesa campos adicionales específicos para sub-productos desde el formulario hacia el formato de datos del store.
   * 
   * @parametros
   * @param {Partial<FilaSolicitud>} formulario - Datos parciales del formulario completado por el usuario
   * 
   * @retorna {Partial<FilaSolicitud>} Campos adicionales procesados y validados
   * 
   * @campos_especializados_procesados
   * **Unidades de Medida:**
   * - umt: Código de Unidad de Medida de Transporte
   * - cantidadUMT: Cantidad expresada en UMT
   * - umc: Código de Unidad de Medida Comercial  
   * - cantidadUMC: Cantidad expresada en UMC
   * 
   * **Clasificación del Producto:**
   * - uso: Finalidad o uso destinado del sub-producto
   * - tipoDeProducto: Clasificación específica del tipo
   * - numeroDeLote: Identificador del lote para trazabilidad
   * 
   * **Información Geográfica:**
   * - paisDeOrigen: País donde se originó el sub-producto
   * - paisDeProcedencia: País desde donde se realiza el envío
   * 
   * **Certificación y Control:**
   * - certificadoInternacionalElectronico: Certificado electrónico asociado
   * - especie: Especie específica del vegetal
   * 
   * **Especificaciones de Presentación:**
   * - tipoPresentacion: Forma de presentación comercial
   * - tipoPlanta: Clasificación del tipo de planta origen
   * - plantaAutorizadaOrigen: Instalación autorizada donde se procesó
   * - presentacion: Descripción detallada de la presentación
   * 
   * @conservacion_tipos_datos
   * Mantiene los tipos de datos originales del formulario sin conversiones,
   * a diferencia de getAdditionalFields que convierte cantidades a string.
   * 
   * @aplicacion_valores_defecto
   * Cada campo usa operador OR (||) con cadena vacía para evitar
   * valores undefined que podrían causar errores en el store o la UI.
   * 
   * @consistencia_modelo
   * Los campos procesados mantienen exacta correspondencia con
   * el modelo FilaSolicitud para garantizar compatibilidad total.
   */
  // eslint-disable-next-line complexity
  private static getAdditionalDataFields(formulario: Partial<FilaSolicitud>): Partial<FilaSolicitud> {
    return {
      umt: formulario.umt || '',
      cantidadUMT: formulario.cantidadUMT || '',
      umc: formulario.umc || '',
      cantidadUMC: formulario.cantidadUMC || '',
      uso: formulario.uso || '',
      tipoDeProducto: formulario.tipoDeProducto || '',
      numeroDeLote: formulario.numeroDeLote || '',
      paisDeOrigen: formulario.paisDeOrigen || '',
      paisDeProcedencia: formulario.paisDeProcedencia || '',
      certificadoInternacionalElectronico: formulario.certificadoInternacionalElectronico || '',
      especie: formulario.especie || '',
      tipoPresentacion: formulario.tipoPresentacion || '',
      tipoPlanta: formulario.tipoPlanta || '',
      id_tipo_planta: formulario.id_tipo_planta || '',
      plantaAutorizadaOrigen: formulario.plantaAutorizadaOrigen || '',
      presentacion: formulario.presentacion || '',
      id_tipo_presentacion: formulario.id_tipo_presentacion || '',
      id_planta_autorizada: formulario.id_planta_autorizada || '',
      descripcion_planta_autorizada: formulario.descripcion_planta_autorizada || '',
      descripcion_fracción_arancelaria: formulario.descripcionFraccion || '',
      descripcion_nico: formulario.descripcionNico || '',
      cantidadPresentacion: formulario.cantidadPresentacion || '',
      id_fraccion_gubernamental: formulario.id_fraccion_gubernamental ?? 0
    };
  }

  /**
   * @metodo updateStoreWithDatos
   * @privado
   * @descripcion
   * Actualiza el store fitosanitario con los datos procesados, manejando tanto creación como actualización de registros.
   * 
   * @parametros
   * @param {FilaSolicitud} DATOS - Objeto FilaSolicitud completo y validado para persistir
   * 
   * @logica_actualizacion_inteligente
   * Implementa estrategia de upsert (update or insert):
   * 1. **Búsqueda**: Localiza registro existente por ID usando findIndex()
   * 2. **Decisión**: 
   *    - Si INDEX !== -1: Actualiza registro existente manteniendo posición
   *    - Si INDEX === -1: Agrega nuevo registro al final del array
   * 3. **Aplicación**: Actualiza el store con la nueva estructura de datos
   * 
   * @operaciones_de_array_inmutables
   * - **findIndex()**: Localiza posición del registro existente sin modificar array original
   * - **map()**: Para actualizaciones, crea nuevo array reemplazando elemento específico
   * - **spread operator [...]**: Para inserciones, crea nuevo array agregando elemento
   * 
   * @patron_inmutabilidad_akita
   * ```typescript
   * return {
   *   ...state,                    // Preserva resto del estado
   *   tablaDatos: UPDATED_TABLA_DATOS,  // Solo actualiza datos de tabla
   *   selectedDatos: []            // Limpia selección actual
   * }
   * ```
   * 
   * @efectos_del_store_update
   * - Dispara notificaciones automáticas a todos los observadores suscritos
   * - Actualiza componentes que consumen fitosanitarioQuery
   * - Mantiene integridad referencial del estado global
   * - Limpia selectedDatos para evitar inconsistencias de UI
   * 
   * @beneficios_arquitectonicos
   * - **Centralización**: Una única fuente de verdad para datos de sub-productos
   * - **Reactividad**: Cambios se propagan automáticamente a toda la aplicación
   * - **Consistencia**: Estado siempre coherente entre componentes
   * - **Trazabilidad**: Historial de cambios manejado por Akita
   * 
   * @performance_considerations
   * La operación findIndex() es O(n) pero acceptable dado que las listas
   * de sub-productos típicamente no exceden cientos de elementos.
   */
  private updateStoreWithDatos(DATOS: FilaSolicitud): void {
    this.fitosanitarioStore.update(state => {
      const INDEX = state.tablaDatos.findIndex(item => item.id === DATOS.id);
      const UPDATED_TABLA_DATOS =
        INDEX !== -1
          ? state.tablaDatos.map((item, i) => (i === INDEX ? DATOS : item))
          : [...state.tablaDatos, DATOS];
      return {
        ...state,
        tablaDatos: UPDATED_TABLA_DATOS,
        selectedDatos: []
      };
    });
  }

  /**
   * @metodo ngOnDestroy
   * @ciclo_de_vida
   * @publico
   * @descripcion
   * Método del ciclo de vida de Angular ejecutado automáticamente al destruir el componente.
   * 
   * @responsabilidades_limpieza
   * 1. **Emisión de Señal**: Notifica a todas las suscripciones activas sobre la destrucción
   * 2. **Completado de Subject**: Finaliza correctamente el Subject para liberar recursos
   * 
   * @implementacion_takeuntil_pattern
   * ```typescript
   * this.destroyNotifier$.next();     // Emite señal de destrucción
   * this.destroyNotifier$.complete(); // Completa el observable
   * ```
   * 
   * @automatismo_angular
   * - Angular invoca este método automáticamente durante el proceso de destrucción
   * - Se ejecuta antes de que el componente sea removido del DOM
   * - Garantiza que la limpieza ocurra incluso si el usuario navega abruptamente
   * 
   * @prevension_memory_leaks
   * - **Suscripciones RxJS**: Todas las suscripciones con takeUntil se cancelan automáticamente
   * - **Event Listeners**: Se remueven automáticamente al completar el Subject
   * - **Timers/Intervals**: Si los hubiera, se cancelarían mediante esta señal
   * 
   * @patron_best_practice
   * Implementa el patrón recomendado por la comunidad Angular para gestión
   * de suscripciones en componentes, evitando memory leaks en SPAs.
   * 
   * @impacto_rendimiento
   * - Libera memoria ocupada por suscripciones inactivas
   * - Evita ejecución de callbacks en componentes destruidos
   * - Mejora el rendimiento general de la aplicación
   * - Previene errores por acceso a propiedades de componentes destruidos
   * 
   * @orden_ejecucion
   * Se ejecuta después de ngOnDestroy de componentes hijos pero antes
   * de la remoción final del componente del árbol de Angular.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}