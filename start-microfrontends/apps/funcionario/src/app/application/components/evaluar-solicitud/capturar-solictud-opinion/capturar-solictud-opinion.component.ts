import { Catalogo, CatalogoSelectComponent, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Subject, takeUntil } from 'rxjs';
import { OpinionesStates, SolicitudOpinionesState } from '../../../estados/evaluacion-solicitud/opiniones.store';
import { CommonModule } from '@angular/common';
import { CONFIGURACION_ENCABEZADO_OPINIONES } from '../../../core/enums/opiniones.enum';
import data from '@libs/shared/theme/assets/json/funcionario/cat-dependencias.json';
import { ListaOpiniones } from '../../../core/models/lista-opiniones.model';
import { Router } from '@angular/router';
import { SolicitudOpinionesQuery } from '../../../estados/queries/opiniones.query';

@Component({
  selector: 'app-capturar-solictud-opinion',
  standalone: true,
  imports: [CommonModule, CatalogoSelectComponent, ReactiveFormsModule, TablaDinamicaComponent, NotificacionesComponent],
  templateUrl: './capturar-solictud-opinion.component.html',
  styleUrl: './capturar-solictud-opinion.component.scss',
})
export class CapturarSolictudOpinionComponent implements OnInit, OnDestroy {

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
      dependencia: ['', [Validators.required]],
      justificacion: ['', [Validators.required, Validators.maxLength(1000)]]
    });
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
    const DEPENDENCIA_ID = this.formCapturaOpinion.get('dependencia')?.value;
    const JUSTIFICACION = this.formCapturaOpinion.get('justificacion')?.value?.trim();

    if (!DEPENDENCIA_ID || !JUSTIFICACION) {
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
    const DEPENDENCIA_OBJ = this.catDependencia.find(dep => dep.id === Number(DEPENDENCIA_ID));

    const NUEVA_TABLA_OPINIONES = [...this.listadoOpiniones];
    NUEVA_TABLA_OPINIONES.push({
      idDependencia: String(DEPENDENCIA_ID),
      dependencia: DEPENDENCIA_OBJ?.descripcion || 'Desconocido',
      Justificación: JUSTIFICACION,
      estadoRequerimento: 'Capturada'
    });
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
    this.visualizaTabla = true;
    this.visualizaBotones = true;
    this.limpiarFormulario();
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
    this.listadoOpiniones = this.listadoOpiniones.filter(
      opinion => opinion.idDependencia !== OPINION_SELECCIONADA.idDependencia
    );

    // Actualizar el estado global
    this.opinionesStates.setSolicitudOpiniones(this.listadoOpiniones);

    // Cargar valores al formulario para editar
    this.formCapturaOpinion.patchValue({
      dependencia: OPINION_SELECCIONADA.idDependencia,
      justificacion: OPINION_SELECCIONADA.Justificación,
    });

    // Limpiar selección
    this.opinionesSeleccionados = [];
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
