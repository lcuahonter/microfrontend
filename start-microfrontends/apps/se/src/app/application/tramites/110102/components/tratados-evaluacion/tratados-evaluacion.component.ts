import { CategoriaMensaje, ConfiguracionColumna, ConsultaioQuery, ConsultaioState, Notificacion, NotificacionesComponent, TabEvaluarTratadosResponse, TablaDinamicaComponent, TablaSeleccion } from '@ng-mf/data-access-user';
import { DatosCriterioResumenResponse } from '../../models/response/tratado-criterio-resumen-response.model';
import { EvaluacionTratadosService } from '../../service/evaluacion-tratados.service';

import { EmpaqueResponse, InsumoResponse } from '../../models/response/insumos-empaques-response.model';

import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { CommonModule } from '@angular/common';
import { EvaluarTratadosResponse } from '../../models/response/tratados-evaluar-response.model';
import { GenerarDictamenClasificacionService } from '../../../../shared/services/generar-dictamen-clasificacion.service';
import { Modal } from 'bootstrap';
import { ResumenValoresFormularioComponent } from '../resumen-valores-formulario/resumen-valores-formulario.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { TratadosEvaluarService } from '../../service/tratados-solicitud.service';

@Component({
  selector: 'app-tratados-evaluacion',
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    NotificacionesComponent,
    ResumenValoresFormularioComponent],
  templateUrl: './tratados-evaluacion.component.html',
  styleUrl: './tratados-evaluacion.component.scss',
})
export class TratadosEvaluacionComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para gestionar los tratados.
   * 
   * @property {FormGroup} dictaminador - El formulario reactivo que contiene los campos para los tratados.
   */
  dictaminador!: FormGroup;

  /**
   * @property {boolean} esCalificacionBandera
   * @description Indica si se está mostrando boton de calificación con bandera.
   * Por defecto es false.
   */
  @Input() esCalificacionBandera: boolean = false;

  /**
   * Evento que se emite cuando los tratados son actualizados.
   * Se utiliza para notificar al componente padre sobre los cambios en los tratados.
   */
  @Output() tratadosActualizados = new EventEmitter<TabEvaluarTratadosResponse[]>();

  /**
  * Notificación actual que se muestra en el componente.
  *
  * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
  * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
  */
  public nuevaNotificacion!: Notificacion;

  /**
   * Registro seleccionado en la tabla de tratados.
   */
  public registroSeleccionado: EvaluarTratadosResponse | null = null;

  /**
   * Verifica si un item está seleccionado.
   * @param item EvaluarTratadosResponse que se desea verificar si está seleccionado.
   * @returns true si el item está seleccionado, false en caso contrario.
   */
  isSelected(item: EvaluarTratadosResponse): boolean {
    return this.registroSeleccionado?.id_criterio_tratado === item.id_criterio_tratado;
  }

  /**
   * Alterna la selección de una fila en la tabla de tratados.
   * @param item EvaluarTratadosResponse que se desea alternar su selección.
   */
  toggleFila(item: EvaluarTratadosResponse): void {
    if (this.isSelected(item)) {
      this.registroSeleccionado = null;
      this.tratadoSeleccionado = [];
    } else {
      this.registroSeleccionado = item;
      this.tratadoSeleccionado = [item];
    }
  }

  /**
   * Se ejecuta al hacer clic en el checkbox de una fila.
   * @param event Evento del clic en el checkbox.
   * @param item EvaluarTratadosResponse asociado al checkbox.
   */
  toggleCheckbox(event: Event, item: EvaluarTratadosResponse): void {
    event.stopPropagation(); 
    this.registroSeleccionado = item;
    this.tratadoSeleccionado = [item];
  }

  /**
   * Configuración de la tabla de tratados seleccionados.
   * 
   * Define las columnas que se mostrarán en la tabla de evaluación de tratados,
   * incluyendo encabezado, clave de acceso a los datos y orden de despliegue.
   * 
   * Cada columna se representa mediante un objeto de tipo `ConfiguracionColumna<EvaluarTratadosResponse>`.
 */
  public tablaSeleccionada: ConfiguracionColumna<EvaluarTratadosResponse>[] = [
    { encabezado: 'País o bloque', clave: (item) => item.pais_bloque_nombre, orden: 1 },
    { encabezado: "Tratado o Acuerdo", clave: (item) => item.tratado_acuerdo, orden: 2 },
    { encabezado: "Criterio de origen", clave: (item) => item.criterio_origen, orden: 3 },
    { encabezado: "Norma de origen", clave: (item) => item.norma_origen, orden: 4 },
    { encabezado: "Requisito especifico", clave: (item) => item.requisito_especifico, orden: 5 },
    { encabezado: "Calificación sistema", clave: (item) => item.cal_aprobada_sistema ? 'APROBADA' : 'NO APROBADA', orden: 6 },
    { encabezado: "Calificación dictaminador", clave: (item) => item.cal_aprobada_dictaminador ? 'APROBADA' : 'NO APROBADA', orden: 7 },
    { encabezado: "Otras instancias", clave: (item) => item.otras_instancias, orden: 8 },
    { encabezado: "Proceso de transformación", clave: (item) => item.proceso_transformacion ?? '', orden: 9 }];

  /**
   * Configuración de la tabla que muestra la información detallada de los insumos
   * utilizados en la evaluación de mercancías.
   *
   * Cada columna corresponde a un campo del objeto {@link InsumoResponse}.
   */
  public tablaInsumos: ConfiguracionColumna<InsumoResponse>[] = [
    { encabezado: "Nombre Técnico", clave: (item) => item.nombre, orden: 1 },
    { encabezado: "Proveedor", clave: (item) => item.proveedor, orden: 2 },
    { encabezado: "Fabricante y/o Productor", clave: (item) => item.fabricante_productor, orden: 3 },
    { encabezado: "RFC Fabricante y/o Productor", clave: (item) => item.rfc_fabricante_productor, orden: 4 },
    { encabezado: "Fracción Arancelaria", clave: (item) => item.clave_fraccion_arancelaria, orden: 5 },
    { encabezado: 'Descripción de la Fracción Arancelaria', clave: (item) => item.descripcion_fraccion, orden: 6 },
    { encabezado: "Capitulo", clave: (item) => item.capitulo, orden: 7 },
    { encabezado: "Descripción Capitulo", clave: (item) => item.nombre_capitulo, orden: 8 },
    { encabezado: "Partida", clave: (item) => item.partida, orden: 9 },
    { encabezado: "Descripción Partida", clave: (item) => item.nombre_partida, orden: 10 },
    { encabezado: "Subpartida", clave: (item) => item.subpartida, orden: 11 },
    { encabezado: "Descripción Subpartida", clave: (item) => item.nombre_subpartida, orden: 12 },
    { encabezado: "Valor en Dólares", clave: (item) => item.valor, orden: 13 },
    { encabezado: "Originario/No originario", clave: (item) => item.es_originario, orden: 14 },
    { encabezado: "País de Origen", clave: (item) => item.pais_origen, orden: 15 },
    { encabezado: "Peso", clave: (item) => item.peso, orden: 16 },
    { encabezado: "Volumen", clave: (item) => item.volumen, orden: 17 }];

  /**
   * Configuración de la tabla que presenta la información de los empaques
   * empleados en la mercancía evaluada.
   *
   * Cada columna corresponde a un campo del objeto {@link EmpaqueResponse}.
   */
  public tablaEmpaques: ConfiguracionColumna<EmpaqueResponse>[] = [
    { encabezado: 'Nombre Técnico', clave: (item) => item.nombre, orden: 1 },
    { encabezado: "Proveedor", clave: (item) => item.proveedor, orden: 2 },
    { encabezado: "Fabricante y/o Productor", clave: (item) => item.fabricante_productor, orden: 3 },
    { encabezado: "Fracción Arancelaria", clave: (item) => item.clave_fraccion_arancelaria, orden: 4 },
    { encabezado: "Valor en Dólares", clave: (item) => item.valor, orden: 5 },
    { encabezado: "Originario/No originario", clave: (item) => item.es_originario, orden: 6 }];

  /**
   * Datos de la tabla de evaluación de tratados.
   * Este array contiene objetos de tipo `EvaluarTratadosResponse` que representan
   * el resultado de la evaluación de los tratados ingresados.
   */
  public tratadosEvaluacionTablaDatos: EvaluarTratadosResponse[] = [];

  /**
  * Tipo de selección utilizado en la tabla, definido como casillas de verificación (checkbox).
  * @type {TablaSeleccion}
  */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /** Almacena las filas seleccionadas de la tabla */
  public tratadoSeleccionado: EvaluarTratadosResponse[] = [];

  /**
  * **Subject utilizado para manejar la destrucción de suscripciones**
  * 
  * Este `Subject` se emite en `ngOnDestroy` para notificar y completar todas las
  * suscripciones activas, evitando posibles fugas de memoria en el componente.
  */
  private destroy$ = new Subject<void>();

  /**
   * Referencia al elemento modal para agregar mercancías.
  */
  @ViewChild('modalAgregar', { static: false }) modalElement!: ElementRef;

  /**
   * Referencia al elemento modal para agregar insumos y empaques de la mercancía.
  */
  @ViewChild('modalInsumoEmpaques', { static: false }) modalElementInsumosEmpaques!: ElementRef;

  /**
   * Referencia al elemento modal para mostrar el resumen de valores.
  */
  @ViewChild('modalResumenValores', { static: false }) modalElementResumenValores!: ElementRef;

  /**
  * Referencia al elemento modal para mostrar el Requisito de proceso.
  */
  @ViewChild('modalRequisitoProceso', { static: false }) modalRequisitoProceso!: ElementRef;

  /**Variable para asociar la respuesta del modal */
  valoresFormularioResumen!: DatosCriterioResumenResponse;

  /**
   * Datos de la tabla de insumos.
   * Este array contiene objetos de tipo `InsumoResponse` que representan
   * el resultado de los insumos de la mercancía.
   */
  public tratadosInsumosTablaDatos: InsumoResponse[] = []

  /**
   * Datos de la tabla de empaques.
   * Este array contiene objetos de tipo `EmpaqueResponse` que representan
   * el resultado de los empaques de la mercancía.
   */
  public tratadosEmpaquesTablaDatos: EmpaqueResponse[] = [];

  /**
   * Texto que describe el requisito del proceso.
  */
  public textoRequisitoProceso!: string;

  /** Bandera de aladi */
  public noAceptada!: boolean | null;

  /**
   * Instancia del modal de Bootstrap utilizada para abrir y cerrar el diálogo de agregar o editar mercancías.
   * Se inicializa al abrir el modal y se utiliza para controlar su visibilidad desde el componente.
   *
   * @type {Modal}
   * @private
   * @memberof DatosMercanciaComponent
   * @example
   * this.modalInstance.show();
   * this.modalInstance.hide();
  */
  private modalInstance!: Modal;

  /** Estado de la consulta */
  public consultaState!: ConsultaioState;

  /** Suscripción para manejo de observables */
  private subscription!: Subscription;
  /**
      * Inicializa el TratadosComponent.
      * @param fb - Servicio FormBuilder utilizado para crear y gestionar formularios reactivos.
      * @param consultaioQuery - Servicio query para acceder al estado de consultaio.
      * 
      * Se suscribe al observable `selectConsultaioState$` para actualizar la propiedad `esFormularioSoloLectura`
      * e inicializar el formulario de tratados cada vez que cambia el estado de consultaio. La suscripción se
      * cancela automáticamente cuando el componente es destruido.
      */
  constructor(
    private fb: FormBuilder,
    private tratadosSolicitudService: TratadosEvaluarService,
    private consultaioQuery: ConsultaioQuery,
    private evaluacionTratadosService: EvaluacionTratadosService,
    private generarDictamenClasificacionService: GenerarDictamenClasificacionService
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.evaluacionTablaTratados(() => {
            this.noAceptada = this.generarDictamenClasificacionService.getNoAceptadaActual();
            this.modificarRegistrosAladi();
          });
        })
      )
      .subscribe();

    this.dictaminador = this.fb.group({
      opcionSeleccionada: [''],
    });
  }
  ngOnInit(): void {
    this.subscription = this.generarDictamenClasificacionService.noAceptada$.subscribe(valor => {
      this.noAceptada = valor;
      if (valor !== null) {
        this.modificarRegistrosAladi();
      }
    });
  }

  /**
   * Maneja el cambio de selección de la tabla tratados.
   * @param tratadoSeleccionado 
  */
  onSeleccionChangeEvaluacion(tratadoSeleccionado: EvaluarTratadosResponse[]): void {
    this.tratadoSeleccionado = [...tratadoSeleccionado];
  }

  /**
   * @method CriterioTratadoResumen
   * @description Consulta el resumen de valores de un criterio tratado por su identificador.
   * @returns {void}
  */
  criterioTratadoResumen(): void {
    if (this.tratadoSeleccionado.length === 0 || this.tratadoSeleccionado.length > 1) {
      this.abrirModalTratadosEvaluacion();
      return;
    }

    const CRITERIO_ORIGEN = this.tratadoSeleccionado[0].cve_grupo_criterio
    if (CRITERIO_ORIGEN === 'OTROS' || CRITERIO_ORIGEN === 'OTRASINST') {


      this.tratadosSolicitudService.getCriterioTratadoResumen(this.tratadoSeleccionado[0].id_criterio_tratado.toString())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.codigo === CodigoRespuesta.EXITO) {
              this.modalInstance = new Modal(this.modalElementResumenValores.nativeElement);
              this.modalInstance?.show();
              this.valoresFormularioResumen = response.datos ?? {} as DatosCriterioResumenResponse;
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: response?.error || 'Error en la consulta de resumen de criterio tratado.',
                mensaje: response?.causa || response?.mensaje || 'Error en la consulta de resumen de criterio tratado.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
            }
          },
          error: (err) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const MENSAJE = err?.error?.error || 'Error en la consulta de resumen de criterio tratado.';
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: 'error',
              modo: 'action',
              titulo: '',
              mensaje: MENSAJE,
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            }
          }
        });
    } else {
      this.abrirModalGlobalAccion();
    }
  }

  /**
  * @method InsumosEmpaques
  * @description Consulta los insumos y/o empaques asociados a una solicitud a través del servicio.
  * @returns {void}
  */
  insumosEmpaques(): void {
    if (this.tratadoSeleccionado.length === 0 || this.tratadoSeleccionado.length > 1) {
      this.abrirModalTratadosEvaluacion();
      return;
    }
    const TRATADO = this.tratadoSeleccionado[0];
    const CRITERIO_ORIGEN = TRATADO.cve_grupo_criterio?.trim() ?? '';
    const CVE_PAIS = TRATADO.cve_pais?.trim() ?? '';
    const TRATADO_ACUERDO = TRATADO.tratado_acuerdo?.trim() ?? '';
    if (
      !(
        CRITERIO_ORIGEN === 'OTROS' ||
        CRITERIO_ORIGEN === 'B' ||
        CRITERIO_ORIGEN === 'OTRASINST' ||
        (CVE_PAIS === 'PAN' && TRATADO_ACUERDO === '505')
      )
    ) {
      this.abrirModalGlobalAccion();
      return;
    }
    this.tratadosSolicitudService.getInsumosEmpaques(this.consultaState.id_solicitud, this.tratadoSeleccionado[0].id_tratado_acuerdo.toString(),
      this.tratadoSeleccionado[0].id_bloque ?? null, this.tratadoSeleccionado[0].cve_pais)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            const INSUMOS = response.datos?.insumos ?? [];
            const EMPAQUES = response.datos?.empaques ?? [];

            if (INSUMOS.length > 0 || EMPAQUES.length > 0) {
              this.tratadosInsumosTablaDatos = INSUMOS;
              this.tratadosEmpaquesTablaDatos = EMPAQUES;

              this.modalInstance = new Modal(this.modalElementInsumosEmpaques.nativeElement);
              this.modalInstance?.show();
            } else {
              this.abrirModalGlobalAccion();
            }
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response?.error || 'Error en la consulta de insumos empaques.',
              mensaje: response?.causa || response?.mensaje || 'Error en la consulta de insumos empaques.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const MENSAJE = err?.error?.error || 'Error en la consulta de insumos empaques.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }


  /**
   * @method abrirModalDictaminador
   * @description Método para abrir el modal de confirmación de eliminación de facturas.
   * Muestra el modal y prepara la interfaz para que el usuario confirme o cancele la eliminación.
   */
  abrirModalDictaminador(): void {
    if (!this.tratadoSeleccionado || this.tratadoSeleccionado.length === 0) {
      this.abrirModal();
      return;
    }

    if (this.tratadoSeleccionado[0].cal_aprobada_dictaminador === false) {
      this.abrirModalErrorDictaminador();
      return;
    }
    const RADIOSELECCIONADO = this.tratadoSeleccionado &&
      this.tratadoSeleccionado.length > 0 &&
      this.tratadoSeleccionado.every(item => item.id_criterio_tratado);

    if (!RADIOSELECCIONADO) {
      this.abrirModal();
      return;
    }

    if (this.modalElement && this.modalElement.nativeElement) {
      if (this.modalInstance) {
        this.modalInstance?.hide?.();
      }
      this.modalInstance = new Modal(this.modalElement.nativeElement);
      this.modalInstance?.show();
    }
  }

  /**
  * @method modificarRegistros
  * @description Este método modifica los registros seleccionados en la tabla de evaluación de tratados.
  * Actualiza la calificación dictaminada según la opción seleccionada en el formulario.
  * Si no hay tratados seleccionados, muestra una advertencia en la consola.
  * Finalmente, refresca la tabla y cierra el diálogo modal.
  * @returns void
  */
  modificarRegistros(): void {
    if (!this.tratadoSeleccionado) {
      return;
    }

    const OPCION = this.dictaminador.get('opcionSeleccionada')?.value;
    const APROBADO = OPCION === 'true';

    // Actualiza solo los tratados seleccionados dentro de la tabla completa
    this.tratadosEvaluacionTablaDatos = this.tratadosEvaluacionTablaDatos.map(tratado => {
      // Si este tratado está dentro de los seleccionados, actualiza
      if (this.tratadoSeleccionado.some(sel => sel.id_criterio_tratado === tratado.id_criterio_tratado)) {
        return {
          ...tratado,
          cal_aprobada_dictaminador: APROBADO,
          calificacion_dictaminador: APROBADO ? 'APROBADA' : 'NO APROBADA'
        };
      }
      return { ...tratado };
    });

    // Refresca la tabla
    this.tratadosEvaluacionTablaDatos = [...this.tratadosEvaluacionTablaDatos];
    this.tratadosActualizados.emit(this.tratadosEvaluacionTablaDatos);

    this.limpiarSeleccion();
    this.cerrarDialogo();
  }

  /**
   * @method modificarRegistrosAladi
   * @description Este método modifica los registros ALADI en la tabla de evaluación de tratados.
   * Establece como no aprobados los tratados con IDs específicos restringidos.
   * @returns void
   */
  modificarRegistrosAladi(): void {
    if (this.noAceptada === null) {
      return;
    }

    const IDS_RESTRINGIDOS = [102, 103, 104, 105, 106];
    this.tratadosEvaluacionTablaDatos.forEach(item => {
      if (IDS_RESTRINGIDOS.includes(item.id_tratado_acuerdo)) {
        if (this.noAceptada === false) {
          item.cal_aprobada_dictaminador = false;
          item.calificacion_dictaminador = 'NO APROBADO';
        } else {
          item.cal_aprobada_dictaminador = true;
          item.calificacion_dictaminador = 'APROBADA';
        }
      }
    });
    this.noAceptada = null;
    this.tratadosEvaluacionTablaDatos = [...this.tratadosEvaluacionTablaDatos];
    this.tratadosActualizados.emit(this.tratadosEvaluacionTablaDatos);
  }

  /**
   * Obtiene la evaluación de tratados para la solicitud actual y actualiza la tabla de evaluación.
   *
   * Este método llama al servicio `evaluacionTratadosService.getEvaluarTratados` pasando el ID de la solicitud.
   * - Si la respuesta es exitosa (`CodigoRespuesta.EXITO`), actualiza `tratadosEvaluacionTablaDatos`.
   * - Si ocurre un error o la respuesta es incorrecta, muestra una notificación de error.
   */
  evaluacionTablaTratados(callback?: () => void): void {
    this.evaluacionTratadosService.getEvaluarTratados(this.consultaState.id_solicitud)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.tratadosEvaluacionTablaDatos = response.datos ?? [];
            this.tratadosActualizados.emit(this.tratadosEvaluacionTablaDatos);
            callback?.();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error obtener tratados.',
              mensaje: response.causa || response.mensaje || 'Error obtener tratados.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const MENSAJE = err?.error?.error || 'Error obtener tratados.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }


  /**
  * @method limpiarSeleccion
  * @description Limpia la selección de tratados en la tabla de evaluación.
  */
  limpiarSeleccion(): void {
    this.tratadoSeleccionado = [];
  }

  /**
   * Cierra el modal de agregar o editar mercancías.
   * Utiliza la instancia del modal de Bootstrap para ocultar el diálogo actualmente abierto.
   *
   * @example
   * this.cerrarDialogo();
   * // El modal se oculta.
   */
  cerrarDialogo(): void {
    this.modalInstance?.hide();
  }

  /**
   * Abre el modal de error para tratados en evaluación.
   * 
   * Este método configura los datos de la notificación que se mostrará en el modal
   * cuando no se ha seleccionado un país, bloque-tratado o acuerdo.
   */
  abrirModalTratadosEvaluacion(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe seleccionar un País/bloque-tratado/acuerdo',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Abre el modal de error.
   */
  abrirModalGlobalAccion(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'La acción no es permitida para este tipo de criterio',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Abre el modal de confirmación para eliminar un pedimento.
   *
   * Este método configura los datos de la notificación que se mostrará en el modal
   * de confirmación. También almacena el índice del elemento que se desea eliminar.
   *
   */
  abrirModal(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Seleccione un país/tratado/criterio',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
* Abre el modal de error dictaminador aladi.
*/
  abrirModalErrorDictaminadorAladi(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'No es posible modificar la calificación ya que la descripción es "No Aceptada".',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Abre el modal de error dictaminador.
   */
  abrirModalErrorDictaminador(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'No es posible modificar la calificación  ya que la calificación  del sistema es "NO APROBADA".',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
 * **Ciclo de vida: OnDestroy**
 * 
 * Este método se ejecuta cuando el componente se destruye. 
 * Se utiliza para limpiar las suscripciones y evitar fugas de memoria.
 * 
 * - Envía un valor a `destroy$` para notificar a los observables que deben completarse.
 * - Completa `destroy$` para liberar los recursos asociados.
 */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }
}
