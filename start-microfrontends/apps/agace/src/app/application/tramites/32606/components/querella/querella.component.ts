import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, InputCheckComponent, InputRadioComponent, Notificacion, NotificacionesComponent, Pedimento, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QUERELLA_TABLA, RADIO_08 } from '../../constantes/adace32606.enum';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Solicitud32606State, Tramite32606Store } from '../../state/tramite32606.store';
import { CommonModule } from '@angular/common';
import { EconomicoService } from '../../services/economico.service';
import { Modal } from 'bootstrap';
import { Querella } from '../../models/adace.model';
import { QuerellaLabelEnum } from '../../constantes/labels32606.enum';
import { Tramite32606Query } from '../../state/tramite32606.query';

/** Componente para la sección de querella del trámite 32606. */
@Component({
  selector: 'app-querella',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, InputRadioComponent, InputCheckComponent,
    TablaDinamicaComponent, NotificacionesComponent
  ],
  templateUrl: './querella.component.html',
  styleUrl: './querella.component.scss',
})
export class QuerellaComponent implements OnInit, OnDestroy {
  /** Formulario reactivo principal de querella. */
  public querellaForm!: FormGroup;
  /** Opciones para el radio tipo 08. */
  radioOpcions08 = RADIO_08;
  /** Referencia a la tabla de selección. */
  TablaSeleccion = TablaSeleccion;
  /** Configuración de la tabla de querella. */
  public querellaTabla = QUERELLA_TABLA;
  /** Referencia al modal de alerta. */
  @ViewChild('modalAlerta') modalElement!: ElementRef;
  /** Lista de pedimentos. */
  public pedimentos: Array<Pedimento> = [];
  /** Índice del elemento a eliminar. */
  public elementoParaEliminar!: number;
  /** Notificación para el modal. */
  public nuevaNotificacion!: Notificacion;
  /** Datos de la tabla de querella. */
  public querellaDatos: Querella[] = [];
  /** Observable para controlar la destrucción de suscripciones. */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** Indica si el formulario está en modo solo lectura. */
  soloLectura: boolean = false;
  /** Estado actual de la solicitud. */
  public solicitudState!: Solicitud32606State;
  /** Estado de consulta actual. */
  consultaDatos!: ConsultaioState;
   /** Etiquetas para los campos del formulario. */
    enumEtiquetas = QuerellaLabelEnum;

 /**
   * Constructor del componente QuerellaComponent.
   * Se utiliza para la inyección de dependencias y la suscripción al estado de consulta,
   * lo que permite determinar si el formulario debe estar en modo solo lectura y actualizar su estado inicial.
   *
   * @param economico Servicio para operaciones económicas y obtención de catálogos.
   * @param query Servicio para consultar el estado actual del trámite 32606.
   * @param store Almacén global para gestionar el estado del trámite 32606.
   * @param fb Constructor de formularios reactivos.
   * @param consultaioQuery Servicio para consultar el estado de la sección y determinar el modo de solo lectura.
   */
  constructor(private economico: EconomicoService,
    public query: Tramite32606Query,
    public store: Tramite32606Store,
    private fb: FormBuilder,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /** Inicializa el formulario y sus valores según el modo solo lectura. */
  ngOnInit(): void {
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.donanteDomicilio();
    this.inicializarEstadoFormulario();
    this.obtenerTablaQuerella();
  }

  /** Establece el estado inicial del formulario según soloLectura. */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.donanteDomicilio();
    }
  }

  /** Habilita o deshabilita el formulario según soloLectura. */
  guardarDatosFormulario(): void {
    this.donanteDomicilio();
    if (this.soloLectura) {
      this.querellaForm.disable();
    } else {
      this.querellaForm.enable();
    }
  }

  /** Muestra el modal para agregar y abre la notificación. */
  public seleccionarAgregar(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
    this.abrirModal();
  }

  /** Elimina un pedimento de la lista si borrar es true. */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /** Abre el modal y configura la notificación para eliminar un pedimento. */
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Datos guardados correctamente.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    }
    this.elementoParaEliminar = i;
  }

  /** Obtiene los datos de la tabla de querella desde el servicio. */
  public obtenerTablaQuerella(): void {
    this.economico
      .obtenerTablaQuerella()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.querellaDatos = data;
      });
  }

  /** Marca todos los campos del formulario como tocados si es inválido. */
  validarDestinatarioFormulario(): void {
    if (this.querellaForm.invalid) {
      this.querellaForm.markAllAsTouched();
    }
  }

  /**
   * Actualiza un valor en el estado global utilizando el almacén.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Nombre del método en el almacén para actualizar el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32606Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /** Inicializa el formulario con los valores del estado de la solicitud. */
  donanteDomicilio(): void {
    this.querellaForm = this.fb.group({
      tipoRadio18: [{ value: this.solicitudState?.tipoRadio18, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio19: [{ value: this.solicitudState?.tipoRadio19, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio20: [{ value: this.solicitudState?.tipoRadio20, disabled: this.soloLectura }, [Validators.required]],
      sistemaIdentificacion: [{ value: this.solicitudState?.sistemaIdentificacion, disabled: this.soloLectura }, [Validators.required]],
      lugarRadicacion: [{ value: this.solicitudState?.lugarRadicacion, disabled: this.soloLectura }, [Validators.required]],
      sistemaControlInventarios: [{ value: this.solicitudState?.sistemaControlInventarios, disabled: this.soloLectura }, [Validators.required]],
    });
  }

  /** Libera recursos y completa el observable destroyed$ al destruir el componente. */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}