
import { AlertComponent, Catalogo, CatalogoSelectComponent, CatalogoServices, CategoriaMensaje, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, map, switchMap, takeUntil, tap } from 'rxjs';
import { OpinionesStates, SolicitudOpinionesState } from '@libs/shared/data-access-user/src/core/estados/opiniones.store';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CONFIGURACION_ENCABEZADO_OPINIONES } from '@libs/shared/data-access-user/src/core/enums/opiniones.enum';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { ListaOpiniones } from '@libs/shared/data-access-user/src/core/models/lista-opiniones.model';
import { OpinionService } from '@libs/shared/data-access-user/src/core/services/shared/opinion/opinion.service';
import { Router } from '@angular/router';
import { SolicitudOpinionesQuery } from '@libs/shared/data-access-user/src/core/queries/opiniones.query';

@Component({
  selector: 'app-capturar-solictud-opinion-130',
  standalone: true,
  imports: [CommonModule, CatalogoSelectComponent, ReactiveFormsModule, AlertComponent,TablaDinamicaComponent, NotificacionesComponent],
  templateUrl: './capturar-solictud-opinion-130.component.html',
  styleUrl: './capturar-solictud-opinion-130.component.scss',
})
export class CapturarSolictudOpinion130Component implements OnInit, OnDestroy {

  /**
    * Catálogo de tipo de requerimiento
    */
  catDependencia!: Catalogo[];

  /**
    * Declaración de variable para el formulario
    */
  formCapturaOpinion!: FormGroup;

  /**
   * Declaración de variable para almacenar las opiniones seleccionadas
   * Se utiliza para almacenar las opiniones capturadas por el usuario
   * y mostrarlas en una tabla.
   */
  listadoOpiniones: ListaOpiniones[] = [];
  /**
   * lista de opiniones seleccionadas para eliminar o editar opiniones
   */
  opinionesSeleccionados: ListaOpiniones[] = [];
  /**
   * encabezado de tabla opiniones
   */
  encabezadoDeTablaOpiniones = CONFIGURACION_ENCABEZADO_OPINIONES;

  /** 
   * Declaración de variable para controlar la visualización de la tabla
   * Se utiliza para mostrar u ocultar la tabla de opiniones seleccionadas
   * dependiendo de si hay opiniones capturadas o no.
   */
  visualizaTabla: boolean = true;
  /**
   * Declaración de variable para controlar la visualización de los botones
   * Se utiliza para mostrar u ocultar los botones de enviar y cancelar
   */
  visualizaBotones: boolean = false;

  /**
   * Estado de la opinión.
   */
  public solicitudOpinionesState!: SolicitudOpinionesState;

  /**
    * Notificador para destruir las suscripciones.
    */
  private destroyNotifier$: Subject<void> = new Subject();

  /** 
   * Enum para la selección en la tabla
   */
  tablaSeleccion = TablaSeleccion;

  /** 
   * Notificación para mostrar mensajes al usuario 
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Indice para editar registro seleccionado 
   */
  indiceOpinionEditando: number | null = null;


  /**   * Número de trámite
   */
  @Input() tramite: number = 0;

  /**   * Identificador de la solicitud
   */
  @Input() idSolicitud!: string;
  /**   * Número de folio del trámite
   */
  @Input() numFolioTramite!: string;

  /**   * Estado de consultaio para guardar datos
  */
  @Input() guardarDatos!: ConsultaioState;

  /**   * Servicio de opinión
    */
  private opinionService = inject(OpinionService);

  /**   * Identificador de la opinión
   */
  public id_opinion: number | null = null;

  @Output() triggerSubTabs = new EventEmitter<boolean>();

  esFormaValido: boolean = false;

  /**
 * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
 */
  public formErrorAlert = `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
     <b>Corrija los siguientes errores:</b>
    </div>
    <div class="col-md-12">
     <p>1. Ya existe una solicitud de opinión para la dependencia seleccionada.</p>
    </div>
  </div>
</div>
`

  /**
   * 
   * @param fb FormBuilder
   * Se utiliza para crear formularios reactivos en Angular.
   * El FormBuilder es una clase que ayuda a crear instancias de FormGroup y FormControl
   * de manera más sencilla y legible.
   */
  constructor(
    private fb: FormBuilder,
    private opinionesStates: OpinionesStates,
    private solicitudOpinionesQuery: SolicitudOpinionesQuery,
    private router: Router,
    private catalogoServices: CatalogoServices
  ) {
  }

  /**
   * Método para inicializar el componente
   * Se utiliza para inicializar el formulario y cargar los datos necesarios.
   * En este caso, se carga el catálogo de dependencias desde un archivo JSON.
   */
  ngOnInit(): void {
    this.crearFormRequerimiento();
    this.getAllDependenciaCatalogo().pipe(
      switchMap(() => this.getEvaluacionTramite())
    ).subscribe();

    this.solicitudOpinionesQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudOpinionesState = seccionState;
          this.visualizaTabla = this.solicitudOpinionesState.parametroDesplegable;
          this.listadoOpiniones = this.solicitudOpinionesState.listaOpciones;
        })
      )
      .subscribe();
  }

  /**
   * Método para destruir el componente
   * Se utiliza para limpiar las suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Método para crear el formulario
   * Se utiliza para inicializar el formulario con los campos requeridos
   * y sus validaciones.
  */
  crearFormRequerimiento(): void {
    this.formCapturaOpinion = this.fb.group({
      dependencia: ['', [Validators.required]],
      justificacion: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  /**
   * Método para obtener el catálogo de dependencias desde el servicio
   */
  getAllDependenciaCatalogo(): Observable<Catalogo[]> {
    return this.catalogoServices
      .dependenciaCatalogo(this.tramite.toString())
      .pipe(
        tap((data: BaseResponse<Catalogo[]>) => {
          this.catDependencia = data.datos as Catalogo[];
        }),
        map((data: BaseResponse<Catalogo[]>) => data.datos as Catalogo[])
      );
  }


  /**
   * Método para limpiar el formulario
   * Se utiliza para limpiar los campos del formulario después de guardar una opinión
   * y para reiniciar el formulario al iniciar el componente.
  */
  limpiarFormulario(): void {
    this.formCapturaOpinion.reset({
      dependencia: null,
      justificacion: ''
    });
    this.indiceOpinionEditando = null;
  }

  /**
   * Método para guardar la opinión
   */
  guardarOpinion(): void {
    // Marcar todos los campos como touched para mostrar mensajes de validación
    if (this.formCapturaOpinion.invalid) {
      this.formCapturaOpinion.markAllAsTouched();
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Alerta',
        mensaje: 'Por favor, compleplete o corrija todos los campos requeridos antes de guardar la opinión.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    if (this.formCapturaOpinion.invalid) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Alerta',
        mensaje: 'Por favor, completa todos los campos requeridos antes de guardar la opinión.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    const DEPENDENCIA_ID = this.formCapturaOpinion.get('dependencia')?.value;
    const OPINION_EXISTENTE = this.listadoOpiniones.find(opinion => opinion?.idDependencia?.toString() === DEPENDENCIA_ID.toString());

    if(OPINION_EXISTENTE && this.opinionesSeleccionados.length === 0){
      this.esFormaValido = true;
    }else if(OPINION_EXISTENTE && this.opinionesSeleccionados.length > 0){
      this.esFormaValido = false;
      this.guardarOpiniones(Number(this.opinionesSeleccionados[0].id_opinion));
    }else{
      this.esFormaValido = false;
      this.guardarOpiniones(null);
    }
  }

  /**
   * Editar registros seleccionados 
   */
  editarOpinion(): void {
    if (!this.opinionesSeleccionados || this.opinionesSeleccionados.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Atención',
        mensaje: 'Selecciona una opinión para editar.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    if (this.opinionesSeleccionados.length > 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: 'Atención',
        mensaje: 'Para editar una opinión, selecciona únicamente un registro de la tabla.',
        cerrar: false,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    const OPINION_SELECCIONADA = this.opinionesSeleccionados[0];

    // Eliminar del listado la opinión seleccionada
    // this.listadoOpiniones = this.listadoOpiniones.filter(
    //   opinion => opinion.idDependencia !== OPINION_SELECCIONADA.idDependencia
    // );

    // Actualizar el estado global
    // this.opinionesStates.setSolicitudOpiniones(this.listadoOpiniones);

    // Cargar valores al formulario para editar
    this.formCapturaOpinion.patchValue({
      dependencia: OPINION_SELECCIONADA.idDependencia,
      justificacion: OPINION_SELECCIONADA.Justificación,
    });
  }

  /**
   * Metodo para eliminar registros dentro de la tabla opiniones
   */
  eliminarOpinion(): void {
    if (!this.opinionesSeleccionados || this.opinionesSeleccionados.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Atención',
        mensaje: 'Selecciona una opinión para eliminar.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    const ID_OPINION = this.opinionesSeleccionados[0].id_opinion;
    this.deleteSolicitarOpinion(Number(ID_OPINION));
  }

  /**
   * Método para enviar registros de opiniones
   */
  guardarOpiniones(id_opinion: number | null): void {
    const DEPENDENCIA_ID = this.formCapturaOpinion.get('dependencia')?.value;
    const JUSTIFICACION = this.formCapturaOpinion.get('justificacion')?.value?.trim();
    const DATA = {
      "id_opinion": id_opinion,
      "existe_visita_aga": false,
      "existe_dictamen_central": false,
      "id_solicitud": Number(this.idSolicitud),
      "id_dependencia": Number(DEPENDENCIA_ID),
      "justificacion": JUSTIFICACION,
      "cve_area_solicitante": ""
    }

    this.opinionService.postOpcionesEvaluacion130Agregar(this.tramite, this.numFolioTramite, DATA)
      .subscribe({
        next: (response: any) => {
          if (response.codigo === '00') {
            this.triggerSubTabs.emit(true);
            const DATOS = response.datos;
            this.id_opinion = response.datos.id_opinion;
            const ID_DEPENDENCIA = DATOS['id_dependencia'] ? DATOS['id_dependencia'] : DATOS['cve_area_solicitante'];
            const DEPENDENCIA_OBJ = this.catDependencia.find(dep => Number(dep.clave) === Number(ID_DEPENDENCIA));
            const NUEVA_TABLA_OPINIONES = [];
            NUEVA_TABLA_OPINIONES.push({
              id_opinion: DATOS['id_opinion'],
              idDependencia: DATOS['id_dependencia'],
              dependencia: DEPENDENCIA_OBJ?.descripcion || '',
              Justificación: DATOS['justificacion'],
              estadoRequerimento: 'Capturada'
            });
            this.listadoOpiniones = [...this.listadoOpiniones, ...NUEVA_TABLA_OPINIONES];
            if (this.indiceOpinionEditando !== null) {
              this.listadoOpiniones = NUEVA_TABLA_OPINIONES;
              this.indiceOpinionEditando = null;
            } else {
              if (this.listadoOpiniones.length === 0) {
                this.listadoOpiniones = [];
              }
              this.listadoOpiniones = NUEVA_TABLA_OPINIONES;
            }
            this.opinionesStates.setSolicitudOpiniones(this.listadoOpiniones);
            this.opinionesStates.setValorDesplegableOpinion(true);
            this.visualizaBotones = true;
            this.opinionesSeleccionados = [];
            this.limpiarFormulario();
          }
        },
        error: (error: any) => {
          console.error('Error al enviar las opiniones:', error);
        }
      });
  }


  deleteSolicitarOpinion(id_opinion: number): void {
    if (id_opinion !== null) {
      this.opinionService.deleteSolicitarOpinion(this.tramite, id_opinion).subscribe({
        next: (response: any) => {
          if (response.codigo === '00') {
            this.listadoOpiniones = this.listadoOpiniones.filter(
              opinion => opinion.id_opinion !== id_opinion
            );
            this.opinionesStates.setSolicitudOpiniones(this.listadoOpiniones);
            this.opinionesSeleccionados = [];
          }
        }
      });
    }
  }


  enviarOpiniones(): void {
    if (this.listadoOpiniones[0].id_opinion !== null) {
      const REQUESTBODY = {
        id_accion: this.guardarDatos.action_id,
        clave_usuario: this.guardarDatos.current_user,
        opiniones: [
          {
            id_opinion: this.listadoOpiniones[0].id_opinion
          }
        ]
      };

      this.opinionService.postSolicitarTramite130Guardar(this.tramite, this.guardarDatos.folioTramite, REQUESTBODY)
        .subscribe({
          next: (response: any) => {
            if (response.codigo === '00') {
              this.router.navigate(['bandeja-de-tareas-pendientes']);
            }
            else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: response.error || 'Error en iniciar evaluar tramite.',
                mensaje:
                  response.causa ||
                  response.mensaje ||
                  response.error ||
                  'Error en opciones de iniciar evaluar tramite.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
            }
          },
          error: (error: any) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: '',
              mensaje: error?.error?.error || 'Error inesperado en iniciar evaluar tramite.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        });
    }
  }

  cancelar(): void {
    this.router.navigate(['bandeja-de-tareas-pendientes']);
  }


  getEvaluacionTramite(): Observable<void> {
    return this.opinionService
      .getSolicitarTramite(this.tramite, this.guardarDatos.folioTramite)
      .pipe(
        tap((response: any) => {
          if (response.codigo === '00') {
            const OPINION = response.datos?.opiniones || [];

            if (OPINION.length > 0) {
              const MOSTRAR_LIST: ListaOpiniones[] = OPINION.map((opcionItem: any) => {
                const DEPENDENCIA_OBJ = this.catDependencia.find(
                  dep => Number(dep.clave) === opcionItem.id_dependencia
                );

                return {
                  id_opinion: opcionItem.id_opinion,
                  idDependencia: opcionItem.id_dependencia.toString(),
                  dependencia: DEPENDENCIA_OBJ?.descripcion || '',
                  Justificación: opcionItem.justificacion,
                  estadoRequerimento: 'Capturada',
                };
              });

              this.opinionesStates.setSolicitudOpiniones(MOSTRAR_LIST);
              this.opinionesStates.setValorDesplegableOpinion(true);
              this.visualizaBotones = true;
            }
          }
        })
      );
  }

}
