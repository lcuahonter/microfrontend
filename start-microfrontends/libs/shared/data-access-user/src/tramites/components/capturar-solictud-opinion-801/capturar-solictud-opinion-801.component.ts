
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaMensaje, Notificacion, NotificacionesComponent } from '../notificaciones/notificaciones.component';
import { OpinionesStates, SolicitudOpinionesState } from '../../../core/estados/opiniones.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CONFIGURACION_ENCABEZADO_OPINIONES } from '../../../core/enums/opiniones.enum';
import { Catalogo } from '../../../core/models/shared/catalogos.model';
import { CatalogoSelectComponent } from '../catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { ListaOpiniones } from '../../../core/models/lista-opiniones.model';
import { Router } from '@angular/router';
import { SolicitudOpinionesQuery } from '../../../core/queries/opiniones.query';
import { TablaDinamicaComponent } from '../tabla-dinamica/tabla-dinamica.component';
import { TablaSeleccion } from '../../../core/enums/tabla-seleccion.enum';
import data from '@libs/shared/theme/assets/json/funcionario/cat-dependencias.json';
import { InputFecha } from '../../../core/models/shared/components.model';
import { InputFechaComponent } from '../input-fecha/input-fecha.component';
import { FECHA_INGRESO } from '../../constantes/80101/consulta.enum';
import { OpinionService } from '../../../core/services/shared/opinion/opinion.service';
import { ConsultaioState } from '../../../core/estados/consulta.store';

@Component({
  selector: 'app-capturar-solictud-opinion-801',
  standalone: true,
  imports: [CommonModule, CatalogoSelectComponent, ReactiveFormsModule, TablaDinamicaComponent, NotificacionesComponent,InputFechaComponent],
  templateUrl: './capturar-solictud-opinion-801.component.html',
  styleUrl: './capturar-solictud-opinion-801.component.scss',
})
export class CapturarSolictudOpinionComponent801 implements OnInit, OnDestroy {

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
   * Representa la fecha de inicio ingresada por el usuario.
   * 
   * @type {InputFecha}
   * @default FECHA_INGRESO
   */
  public fechaIngreso: InputFecha = FECHA_INGRESO;

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

  /**   * Servicio de opinión
   */
  private opinionService = inject(OpinionService);
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

  /**   * Identificador de la opinión
   */
  public id_opinion: number | null = null;
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
    private router: Router
  ) {
  }

  /**
   * Método para inicializar el componente
   * Se utiliza para inicializar el formulario y cargar los datos necesarios.
   * En este caso, se carga el catálogo de dependencias desde un archivo JSON.
   */
  ngOnInit(): void {
    this.catDependencia = data;
    this.crearFormRequerimiento();
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
      fechaIngreso: ['', [Validators.required]],
    });
  }

  /**
   * Método para limpiar el formulario
   * Se utiliza para limpiar los campos del formulario después de guardar una opinión
   * y para reiniciar el formulario al iniciar el componente.
  */
  limpiarFormulario(): void {
    this.formCapturaOpinion.reset({
      fechaIngreso: ''
    });
  }

  /**
   * Método para guardar la opinión
   */
  guardarOpinion(): void {
    // Marcar todos los campos como touched para mostrar mensajes de validación
    this.formCapturaOpinion.markAllAsTouched();
    if (this.formCapturaOpinion.invalid) {
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

    function formatDateToISO(dateStr: string) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const DATA = {
      "id_opinion": null,
      "existe_visita_aga": false,
      "existe_dictamen_central": false,
      "id_solicitud": Number(this.idSolicitud),
      "fecha_visita_se": formatDateToISO(this.formCapturaOpinion.getRawValue().fechaIngreso),
    }

    this.opinionService.postOpcionesEvaluacionAgregar(this.tramite, this.numFolioTramite, DATA)
    .subscribe({
        next: (response: any) => {
          if (response.codigo === '00') {
            this.id_opinion = response.datos.id_opinion;
            this.terminar();
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
    this.limpiarFormulario();
  }

  terminar(): void {
    if (this.id_opinion !== null) {
      const REQUESTBODY = {
        id_accion: this.guardarDatos.action_id,
        clave_usuario: this.guardarDatos.current_user,
        opiniones: [
          {
            id_opinion: this.id_opinion
          }
        ]
      };

      this.opinionService.postSolicitarTramiteGuardar(this.tramite, this.guardarDatos.folioTramite, REQUESTBODY)
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
    } else {
      this.formCapturaOpinion.markAllAsTouched();
    }
  }

   /**
   * Cambia la fecha de ingreso en el formulario de solicitud.
   *
   * @param nuevo_valor - El nuevo valor de la fecha de ingreso en formato de cadena.
   */
  public cambioFechaIngreso(nuevo_valor: string): void {
    this.formCapturaOpinion.get('fechaIngreso')?.setValue(nuevo_valor);
    this.formCapturaOpinion.get('fechaIngreso')?.markAsUntouched();
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
    const IDS_TO_DELETE = this.opinionesSeleccionados.map(opinion => opinion.idDependencia);
    this.listadoOpiniones = this.listadoOpiniones.filter(opinion => !IDS_TO_DELETE.includes(opinion.idDependencia));
    this.opinionesStates.setSolicitudOpiniones(this.listadoOpiniones);
    this.opinionesSeleccionados = [];
  }

  /**
   * Método para enviar registros de opiniones
   */
  enviarOpiniones(): void {
    this.router.navigate(['funcionario/firma-electronica']);
  }
}
