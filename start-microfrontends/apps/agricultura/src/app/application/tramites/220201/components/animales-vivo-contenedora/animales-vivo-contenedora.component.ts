import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

import { AnimalesEventos } from '../../../../shared/models/datos-de-la-solicitue.model';
import { AnimalesVivoDetallesComponent } from '../../../../shared/components/animales-vivo-detalles/animales-vivo-detalles.component';
import { CatalogosService } from '../../services/220201/catalogos/catalogos.service'
import { CertificadoZoosanitarioServiceService } from '../../services/220201/certificado-zoosanitario.service';
import { DatosDeLaSolicitud } from '../../../../shared/models/datos-de-la-solicitue.model';
import { FilaSolicitud } from '../../models/220201/capturar-solicitud.model';
import { ZoosanitarioQuery } from '../../queries/220201/zoosanitario.query';
import { ZoosanitarioStore } from '../../estados/220201/zoosanitario.store';

/**
 * @componente AnimalesVivoContenedoraComponent
 * @descripcion
 * Componente contenedor que gestiona los formularios y datos relacionados con animales vivos.
 * 
 * @responsabilidades
 * - Gestión de formularios de animales vivos
 * - Manejo de catálogos de datos de solicitud
 * - Comunicación con el servicio de certificados zoosanitarios
 * - Actualización del estado global del trámite
 * - Control del ciclo de vida de suscripciones
 * 
 * @modulo Agricultura
 * @submodulo Trámites 220201
 * 
 * @ejemplo
 * ```html
 * <app-animales-vivo-contenedora
 *   (cerrar)="onCerrarFormulario()">
 * </app-animales-vivo-contenedora>
 * ```
 * 
 * @version 1.0.0
 * @autor Equipo de Desarrollo VUCEM
 */
@Component({
  selector: 'app-animales-vivo-contenedora',
  standalone: true,
  imports: [CommonModule, AnimalesVivoDetallesComponent],
  templateUrl: './animales-vivo-contenedora.component.html',
  styleUrl: './animales-vivo-contenedora.component.scss',
})
export class AnimalesVivoContenedoraComponent implements OnDestroy {
  /**
   * @propiedad catalogosDatos
   * @tipo {DatosDeLaSolicitud}
   * @publico
   * @descripcion
   * Almacena todos los catálogos necesarios para el formulario de animales vivos.
   * 
   * @contiene
   * - tipoRequisitoList: Lista de tipos de requisitos disponibles
   * - requisitoList: Lista de requisitos específicos
   * - fraccionArancelariaList: Catálogo de fracciones arancelarias
   * - nicoList: Lista de códigos NICO
   * - umtList: Unidades de medida de transporte
   * - umcList: Unidades de medida comerciales
   * - especieList: Catálogo de especies animales
   * - usoList: Lista de usos destinados
   * - paisOrigenList: Países de origen disponibles
   * - paisDeProcedenciaList: Países de procedencia
   * - sexoList: Opciones de sexo para animales
   * 
   * @inicializacion Se inicializa con arrays vacíos y se llena mediante llamada al servicio
   */
  public catalogosDatos: DatosDeLaSolicitud = {
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
    sexoList: []
  }


  /**
   * @propiedad destroyNotifier$
   * @tipo {Subject<void>}
   * @publico
   * @descripcion
   * Subject utilizado para el patrón de destrucción de suscripciones RxJS.
   * 
   * @proposito
   * Gestiona la limpieza automática de todas las suscripciones activas cuando 
   * el componente se destruye, evitando fugas de memoria.
   * 
   * @patron takeUntil
   * Se utiliza con el operador `takeUntil` para cancelar automáticamente
   * todas las suscripciones cuando el componente se destruye.
   * 
   * @ejemplo
   * ```typescript
   * this.miObservable$.pipe(
   *   takeUntil(this.destroyNotifier$)
   * ).subscribe();
   * ```
   */
  public destroyNotifier$ = new Subject<void>();

  /**
   * @propiedad formularioSolicitud
   * @tipo {FilaSolicitud}
   * @publico
   * @descripcion
   * Almacena los datos del formulario de solicitud actualmente seleccionado.
   * 
   * @comportamiento
   * - Se actualiza automáticamente cuando se selecciona un elemento de la tabla
   * - Contiene toda la información necesaria para mostrar en el formulario
   * - Se utiliza para prellenar campos en modo edición
   * 
   * @estado
   * - undefined: Cuando no hay selección activa
   * - FilaSolicitud: Cuando hay datos seleccionados de la tabla
   * 
   * @vinculacion
   * Se vincula automáticamente con los datos seleccionados a través del state observable
   */
  public formularioSolicitud!: FilaSolicitud;

  /**
   * @propiedad cuerpoTabla
   * @tipo {FilaSolicitud[]}
   * @publico
   * @descripcion
   * Arreglo que contiene los datos principales de la tabla de solicitudes.
   * 
   * @estructura
   * - Array de objetos FilaSolicitud
   * - Cada elemento representa una fila de la tabla
   * - Incluye información completa de cada solicitud
   * 
   * @funcionalidad
   * - Alimenta los datos de la tabla de visualización
   * - Se actualiza dinámicamente según filtros aplicados
   * - Permite selección de elementos para edición
   * 
   * @operaciones
   * - Carga inicial desde API
   * - Filtrado por criterios de búsqueda
   * - Actualización tras modificaciones
   */
  cuerpoTabla: FilaSolicitud[] = [];
  /**
   * @evento cerrar
   * @tipo {EventEmitter<void>}
   * @output
   * @descripcion
   * Evento emitido cuando se solicita cerrar el componente contenedor.
   * 
   * @proposito
   * - Notifica al componente padre sobre la intención de cierre
   * - Permite limpiar estado y realizar operaciones de limpieza
   * - Facilita la navegación entre componentes
   * 
   * @uso
   * ```typescript
   * <animales-vivo-contenedora (cerrar)="manejarCierre()">
   * </animales-vivo-contenedora>
   * ```
   * 
   * @cuando_se_emite
   * - Al finalizar operaciones de formulario
   * - En cancelación de procesos
   * - Al completar acciones requeridas
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * El número total de registros a mostrar o procesar.
   * 
   * @notas
   * Esta propiedad de entrada permite que el componente padre especifique la cantidad de registros
   * relevante para el contexto actual, como el número de animales vivos en una contenedora.
   * 
   * @valorPorDefecto 0
   */
  @Input() cantidadRegistros: number = 0;
  /**
   * @constructor
   * @descripcion
   * Constructor del componente AnimalesVivoContenedoraComponent.
   * Inyecta las dependencias necesarias para el funcionamiento del componente.
   * 
   * @dependencias_inyectadas
   * @param {CertificadoZoosanitarioServiceService} agriculturaApiService - Servicio para operaciones de API del módulo agricultura
   * @param {ZoosanitarioQuery} fitosanitarioQuery - Query service para acceso a datos fitosanitarios del store
   * @param {ZoosanitarioStore} fitosanitarioStore - Store service para manejo de estado fitosanitario
   * 
   * @proposito_dependencias
   * - agriculturaApiService: Comunicación con backend para CRUD de datos
   * - fitosanitarioQuery: Consulta reactiva de estado de la aplicación
   * - fitosanitarioStore: Gestión centralizada del estado de datos
   * 
   * @patron_arquitectonico
   * Implementa el patrón de inyección de dependencias de Angular
   * con arquitectura de estado centralizado usando Akita
   */
  constructor(public agriculturaApiService: CertificadoZoosanitarioServiceService,
    public fitosanitarioQuery: ZoosanitarioQuery,
    public fitosanitarioStore: ZoosanitarioStore,
    private catalogoService: CatalogosService

  ) {
    /**
     * @inicializacion_catalogos
     * @descripcion
     * Carga inicial de catálogos de datos desde el archivo de configuración.
     * 
     * @operacion
     * - Obtiene datos desde 'animales-vivo.json'
     * - Asigna respuesta completa a catalogosDatos
     * - Inicializa listas de opciones para formularios
     * 
     * @datos_cargados
     * - razaList: Catálogo de razas disponibles
     * - umcList: Unidades de medida y control
     * - especieList: Especies de animales permitidas
     * - usoList: Tipos de uso para animales
     * - paisOrigenList: Países de origen válidos
     * - paisDeProcedenciaList: Países de procedencia
     * - sexoList: Opciones de sexo para animales
     */


    this.catalogoService.obtieneCatalogoSexosActivos(220201).subscribe((data) => {
      this.catalogosDatos.sexoList = data.datos ?? [];
    });

    this.catalogoService.obtieneCatalogoConsultaPaises(220201).subscribe((data) => {
      this.catalogosDatos.paisOrigenList = data.datos ?? [];
      this.catalogosDatos.paisDeProcedenciaList = data.datos ?? [];
    });

    this.catalogoService.obtieneCatalogoEspecies(220201).subscribe((data) => {
      this.catalogosDatos.especieList = data.datos ?? [];
    });

    this.catalogoService.obtieneCatalogoUnidadesMedidaComerciales(220201).subscribe((data) => {
      this.catalogosDatos.umcList = data.datos ?? [];
    });

    this.catalogoService.obtieneCatalogoUsosMercancia(220201).subscribe((data) => {
      this.catalogosDatos.usoList = data.datos ?? [];
    });

    this.catalogoService.obtieneCatalogoFraccionesArancelarias(220201).subscribe((data) => {
      this.catalogosDatos.fraccionArancelariaList = data.datos ?? [];
    });

    this.catalogoService.obtieneCatalogoRestricciones(220201).subscribe((data) => {
      this.catalogosDatos.tipoRequisitoList = data.datos ?? [];
    });

    this.catalogoService.obtieneCatalogoNico(220201).subscribe((data) => {
      this.catalogosDatos.nicoList = data.datos ?? [];
    });

    /**
     * @suscripcion_estado
     * @descripcion
     * Suscripción reactiva al estado del store fitosanitario.
     * 
     * @patron_rxjs
     * Utiliza el patrón takeUntil para gestión automática de suscripciones
     * y prevenir memory leaks al destruir el componente.
     * 
     * @flujo_datos
     * 1. Escucha cambios en seleccionarState$
     * 2. Actualiza cuerpoTabla con datos de la tabla
     * 3. Procesa primer elemento seleccionado si existe
     * 4. Crea formulario a partir del valor seleccionado
     * 
     * @transformaciones
     * - map(): Procesa datos del estado y actualiza propiedades
     * - takeUntil(): Gestiona limpieza automática de suscripción
     * 
     * @efectos_secundarios
     * - Actualiza this.cuerpoTabla
     * - Actualiza this.formularioSolicitud cuando hay selección
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
            this.formularioSolicitud = AnimalesVivoContenedoraComponent.createFormularioFromValor(DATA);
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
   * Método estático para crear un objeto de formulario a partir de datos seleccionados.
   * 
   * @parametros
   * @param {FilaSolicitud} VALOR - Datos de la fila seleccionada de la tabla
   * 
   * @retorna {FilaSolicitud} Objeto formulario completo con todos los campos procesados
   * 
   * @proposito
   * - Centraliza la lógica de creación de formularios
   * - Separa campos básicos y adicionales para mejor organización
   * - Garantiza consistencia en la estructura del formulario
   * 
   * @proceso
   * 1. Obtiene campos básicos mediante getBasicFields()
   * 2. Obtiene campos adicionales mediante getAdditionalFields()
   * 3. Combina ambos conjuntos de datos usando spread operator
   * 4. Retorna objeto FilaSolicitud completo
   * 
   * @beneficios
   * - Código más legible y mantenible
   * - Facilita testing unitario
   * - Reutilizable en otras partes del componente
   */
  private static createFormularioFromValor(VALOR: FilaSolicitud): FilaSolicitud {
    const BASIC_FIELDS = AnimalesVivoContenedoraComponent.getBasicFields(VALOR);
    const ADDITIONAL_FIELDS = AnimalesVivoContenedoraComponent.getAdditionalFields(VALOR);
    return { ...BASIC_FIELDS, ...ADDITIONAL_FIELDS } as FilaSolicitud;
  }

  /**
   * @metodo getBasicFields
   * @estatico
   * @privado
   * @descripcion
   * Extrae y procesa los campos básicos de una FilaSolicitud.
   * 
   * @parametros
   * @param {FilaSolicitud} VALOR - Objeto fuente con datos completos
   * 
   * @retorna {Partial<FilaSolicitud>} Objeto con solo los campos básicos procesados
   * 
   * @campos_extraidos
   * - animal: Información base del animal
   * - especie: Tipo de especie del animal
   * - raza: Raza específica del animal
   * - sexo: Sexo del animal
   * - paisOrigen: País de origen del animal
   * - edad: Edad del animal
   * - pesoKg: Peso en kilogramos
   * - cantidad: Cantidad de animales
   * 
   * @validaciones
   * - Asegura que todos los campos tengan valores por defecto
   * - Convierte tipos de datos según sea necesario
   * - Maneja valores null/undefined de forma segura
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
      sensibles: Array.isArray(VALOR.sensibles) ? VALOR.sensibles : undefined,
      modificado: VALOR.modificado || false
    };
  }

  /**
   * @metodo getAdditionalFields
   * @estatico
   * @privado
   * @descripcion
   * Extrae y procesa los campos adicionales específicos para animales vivos.
   * 
   * @parametros
   * @param {FilaSolicitud} VALOR - Objeto fuente con datos completos
   * 
   * @retorna {Partial<FilaSolicitud>} Objeto con campos adicionales procesados
   * 
   * @campos_adicionales
   * - cantidadUMT: Cantidad en Unidad de Medida de Transporte (como string)
   * - umt: Unidad de Medida de Transporte
   * - cantidadUMC: Cantidad en Unidad de Medida Comercial (como string)
   * - umc: Unidad de Medida Comercial
   * - especie: Especie del animal
   * - uso: Uso destinado del animal
   * - paisDeOrigen: País de origen del animal
   * - paisDeProcedencia: País de procedencia del animal
   * 
   * @conversiones_tipo
   * - cantidadUMT y cantidadUMC se convierten a string para consistencia de formulario
   * - Todos los demás campos mantienen su tipo original
   * 
   * @valores_predeterminados
   * Proporciona cadenas vacías como valores por defecto para evitar errores de formulario
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
    };
  }

  /**
   * @metodo agregarDatosFormulario
   * @publico
   * @descripcion
   * Procesa y agrega los datos del formulario de solicitud al store de estado.
   * 
   * @parametros
   * @param {AnimalesEventos} valor - Objeto de evento que contiene los datos del formulario
   * 
   * @proceso
   * 1. Extrae datos del formulario desde valor.formulario
   * 2. Crea objeto FilaSolicitud mediante createDatosFromFormulario()
   * 3. Actualiza el store con los nuevos datos
   * 
   * @funcionalidad
   * - Valida y procesa datos de entrada
   * - Transforma formato de formulario a formato de datos
   * - Mantiene consistencia del estado global
   * 
   * @efectos_secundarios
   * - Actualiza el store fitosanitario
   * - Notifica a componentes suscritos sobre cambios
   * - Puede disparar re-renderizado de la tabla
   * 
   * @manejo_errores
   * Delega validación a métodos auxiliares para garantizar robustez
   */
  agregarDatosFormulario(valor: AnimalesEventos): void {
    const DATOS = AnimalesVivoContenedoraComponent.createDatosFromFormulario(valor.formulario);
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
   * Convierte datos de formulario parcial en un objeto FilaSolicitud completo.
   * 
   * @parametros
   * @param {Partial<FilaSolicitud>} formulario - Datos parciales del formulario
   * 
   * @retorna {FilaSolicitud} Objeto completo para almacenar en el store
   * 
   * @arquitectura
   * - Utiliza patrón de composición para combinar datos
   * - Separa lógica en métodos especializados
   * - Garantiza integridad de datos mediante validaciones
   * 
   * @proceso_construccion
   * 1. Obtiene campos básicos mediante getBasicDataFields()
   * 2. Obtiene campos adicionales mediante getAdditionalDataFields()
   * 3. Combina ambos conjuntos usando spread operator
   * 4. Asegura tipo FilaSolicitud mediante casting
   * 
   * @beneficios
   * - Código modular y testeable
   * - Separación clara de responsabilidades
   * - Facilita mantenimiento y extensión
   */
  private static createDatosFromFormulario(formulario: Partial<FilaSolicitud>): FilaSolicitud {
    const BASIC_DATA = AnimalesVivoContenedoraComponent.getBasicDataFields(formulario);
    const ADDITIONAL_DATA = AnimalesVivoContenedoraComponent.getAdditionalDataFields(formulario);
    return { ...BASIC_DATA, ...ADDITIONAL_DATA } as FilaSolicitud;
  }

  /**
   * @metodo getBasicDataFields
   * @estatico
   * @privado
   * @descripcion
   * Extrae y valida campos básicos del formulario para crear datos del store.
   * 
   * @parametros
   * @param {Partial<FilaSolicitud>} formulario - Datos parciales del formulario
   * 
   * @retorna {Partial<FilaSolicitud>} Campos básicos validados y con valores por defecto
   * 
   * @campos_procesados
   * - id: Identificador único (generado automáticamente si no existe)
   * - noPartida: Número de partida (inicializado vacío)
   * - tipoRequisito: Tipo de requisito seleccionado
   * - requisito: Descripción del requisito
   * - numeroCertificadoInternacional: Número de certificado
   * - fraccionArancelaria: Fracción arancelaria aplicable
   * - descripcionFraccion: Descripción de la fracción
   * - nico: Código NICO del producto
   * - descripcionNico: Descripción del código NICO
   * - descripcion: Descripción general del producto
   * 
   * @generacion_id
   * Si no existe ID, genera uno aleatorio entre 1 y 1,000,000
   * para garantizar unicidad temporal durante la sesión
   */
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
      sensibles: Array.isArray(formulario.sensibles) ? formulario.sensibles : undefined,
      modificado: formulario.modificado || false
    };
  }

  /**
   * @metodo getAdditionalDataFields
   * @estatico
   * @privado
   * @descripcion
   * Procesa campos adicionales específicos para animales vivos del formulario.
   * 
   * @parametros
   * @param {Partial<FilaSolicitud>} formulario - Datos parciales del formulario
   * 
   * @retorna {Partial<FilaSolicitud>} Campos adicionales procesados con valores por defecto
   * 
   * @campos_especialzados
   * - umt: Unidad de Medida de Transporte
   * - cantidadUMT: Cantidad en UMT
   * - umc: Unidad de Medida Comercial
   * - cantidadUMC: Cantidad en UMC
   * - especie: Especie del animal
   * - uso: Uso destinado del animal
   * - paisDeOrigen: País de origen
   * - paisDeProcedencia: País de procedencia
   * - tipoDeProducto: Clasificación del producto
   * - numeroDeLote: Identificador del lote
   * - certificadoInternacionalElectronico: Certificado electrónico
   * 
   * @validacion_datos
   * Todos los campos utilizan el operador OR (||) para proporcionar
   * cadenas vacías como valores por defecto, evitando valores undefined
   */
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
      certificadoInternacionalElectronico: formulario.tipoRequisito || '',
      especie: formulario.especie || ''
    };
  }

  /**
   * @metodo updateStoreWithDatos
   * @privado
   * @descripcion
   * Actualiza el store fitosanitario con los datos procesados del formulario.
   * 
   * @parametros
   * @param {FilaSolicitud} DATOS - Objeto completo de datos para actualizar/agregar
   * 
   * @logica_actualizacion
   * 1. Busca el índice del elemento existente por ID
   * 2. Si existe (INDEX !== -1): Actualiza el elemento en su posición
   * 3. Si no existe: Agrega el nuevo elemento al final del array
   * 
   * @operaciones_store
   * - findIndex(): Localiza elemento existente
   * - map(): Actualiza elemento específico manteniendo inmutabilidad
   * - spread operator: Agrega nuevo elemento preservando array original
   * 
   * @inmutabilidad
   * - Crea nueva instancia del estado usando spread operator
   * - Mantiene referencia intacta de otros campos del estado
   * - Asegura que los cambios se detecten correctamente en Angular
   * 
   * @efectos
   * - Dispara notificaciones a todos los observadores del store
   * - Actualiza automáticamente componentes suscritos
   * - Mantiene consistencia del estado global
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
   * @descripcion
   * Método del ciclo de vida de Angular ejecutado al destruir el componente.
   * 
   * @responsabilidades
   * - Limpia suscripciones RxJS activas
   * - Previene memory leaks
   * - Completa correctamente el Subject de destrucción
   * 
   * @patron_cleanup
   * 1. Emite señal de destrucción mediante next()
   * 2. Completa el Subject para liberar recursos
   * 3. Todas las suscripciones con takeUntil se cancelan automáticamente
   * 
   * @importancia
   * - Crítico para prevenir memory leaks en aplicaciones SPA
   * - Asegura limpieza correcta de observables
   * - Libera recursos del sistema apropiadamente
   * 
   * @patron_utilizado
   * Patrón takeUntil para gestión automática de suscripciones RxJS
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
