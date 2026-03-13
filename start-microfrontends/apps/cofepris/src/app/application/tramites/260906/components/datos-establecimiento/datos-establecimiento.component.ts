import { AL_DAR, AlertComponent, InputRadioComponent, Notificacion, NotificacionesComponent, Pedimento, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sanitario260906Store, Solicitud260906State } from '../../../../estados/tramites/sanitario260906.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomicilloComponent } from '../domicillo/domicillo.component';
import { ManifiestosComponent } from '../manifiestos/manifiestos.component';
import { Permiso260906Query } from '../../../../estados/queries/permiso260906.query';
import { RepresentanteLegalComponent } from '../representante-legal/representanteLegal.component';
import tipoOperacion from '@libs/shared/theme/assets/json/260906/tipoOperacion.json';

/**
 * Componente responsable de gestionar y mostrar los datos principales del formulario,
 * incluyendo domicilio, manifiestos y representante legal.
 */
@Component({
  selector: 'app-datos-establecimiento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    TituloComponent,
    DomicilloComponent,
    ManifiestosComponent,
    RepresentanteLegalComponent,
    InputRadioComponent,
    NotificacionesComponent
  ],
  templateUrl: './datos-establecimiento.component.html',
  styleUrls: ['./datos-establecimiento.component.css'],
})
export class DatosEstablecimientoComponent implements OnInit, OnDestroy {

  /** Lista de pedimentos asociados */
  pedimentos: Array<Pedimento> = [];
  
  /** Índice del elemento a eliminar */
  elementoParaEliminar!: number;
  
  /** Configuración para nueva notificación */
  public nuevaNotificacion!: Notificacion;

  /** Indica si un campo es requerido o no */
  noRequerido: boolean = false;

  /** Estado de la solicitud */
  public solicitudState!: Solicitud260906State;

  /** Notificador para destruir observables y evitar memory leaks */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Grupo de formularios principal */
  public forma!: FormGroup;

  /** Opciones para los radio buttons */
  radioOptions = tipoOperacion;

  /** Indica si la sección es colapsable */
  public colapsable: boolean = true;

  /** Constantes con textos importantes y advertencias */
  public TEXTOS = AL_DAR;
  
  /** Estado actual de la consulta */
  consultaDatos!: ConsultaioState;
  
  /** Indica si el formulario está en modo solo lectura */
  public soloLectura: boolean;

  /**
   * Constructor que inyecta dependencias necesarias
   * 
   * @param fb Servicio para construir formularios reactivos
   * @param tramite260906Store Store para gestionar el estado del trámite
   * @param tramite260906Query Consulta para obtener datos del estado del trámite
   * @param consultaioQuery Consulta para obtener datos de la consulta
   */
  constructor(
    public readonly fb: FormBuilder,
    private tramite260906Store: Sanitario260906Store,
    private tramite260906Query: Permiso260906Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    // Inicialización adicional si es necesario
    this.soloLectura = false;
  }

  /**
   * Método del ciclo de vida que se llama al inicializar el componente.
   * Configura observables para el estado de la solicitud y consulta.
   */
  ngOnInit(): void {
    this.tramite260906Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.inicializarFormGroup();
    
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el grupo de formularios con validadores y valores iniciales
   */
  inicializarFormGroup(): void {
    this.forma = this.fb.group({
      tipoOperacion: [
        this.solicitudState?.tipoOperacion,
        [Validators.required]
      ],
      tipoOperacionJustificacion: [
        this.solicitudState?.tipoOperacionJustificacion,
        [Validators.required]
      ],
      rfcResponsableSanitario: [
        this.solicitudState?.rfcResponsableSanitario
      ],
      denominacion: [
        this.solicitudState?.denominacion,
        Validators.required
      ],
      correo: [
        this.solicitudState?.correo,
        Validators.required
      ]
    });
    this.inicializarEstadoFormulario();
  }

  /**
   * Alterna el estado colapsable de la sección del formulario
   */
  public mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Habilita todos los controles del formulario si están deshabilitados
   * y muestra una notificación
   */
  public toggleFormControls(): void {
    this.abrirModal();
    Object.keys(this.forma.controls).forEach((controlName) => {
      const CONTROL = this.forma.get(controlName);
      if (CONTROL?.disabled) {
        CONTROL.enable();
      }
    });
  }

  /**
   * Establece valores en el store del trámite
   * 
   * @param form Grupo de formulario que contiene el campo
   * @param campo Nombre del campo a actualizar
   * @param metodoNombre Nombre del método en el store que actualiza el valor
   */
  public setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Sanitario260906Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite260906Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Actualiza el valor de "tipoOperacion" en el Store
   * 
   * @param evento Valor seleccionado para la propiedad
   */
  setTipoOperacion(evento: string | number): void {
    this.tramite260906Store.setTipoOperacion(evento);
  }

  /**
   * Método del ciclo de vida que se llama al destruir el componente
   * Limpia las suscripciones activas
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Configura y abre un modal de notificación informativa
   */
  abrirModal(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Por el momento no hay comunicación con el Sistema de COFEPRIS, favor de capturar su establecimiento.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Inicializa el estado del formulario según el modo de solo lectura
   * @private
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.forma?.disable();
    } else {
      this.forma?.enable();
    }
  }
}