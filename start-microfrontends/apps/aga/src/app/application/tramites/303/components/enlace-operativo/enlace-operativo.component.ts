import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { Notificacion, NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite303Store, Tramite303StoreService } from '../../../../core/estados/tramites/tramite303.store';
import { CommonModule } from '@angular/common';
import { EnlaceOperativo } from '../../../../core/models/303/enlace-operativo.model';
import { EnlaceOperativoService } from '../../../../core/services/303/enlace-operativo.service';
import { Router } from '@angular/router';
import { Tramite303Query } from '../../../../core/queries/tramite303.query';

/**
 * Componente para gestionar el enlace operativo.
 */
@Component({
  selector: 'app-enlace-operativo',
  standalone: true,
  imports: [CommonModule, ModalModule, ReactiveFormsModule, NotificacionesComponent],
  templateUrl: './enlace-operativo.component.html',
  styleUrls: ['./enlace-operativo.component.scss'],
})
export class EnlaceOperativoComponent implements OnChanges, OnInit {
  /** Título del modal */
  @Input() titulo: string = 'Enlace Operativo';
  /** Estado del modal */
  @Input() abrirModal: boolean = false;
  /** Evento emitido al seleccionar un archivo */
  @Output() archivoSeleccionado = new EventEmitter<File>();
  /** Evento emitido al cerrar el modal */
  @Output() cerrar = new EventEmitter<void>();
  /** Estado del modal */
  public mostrarModal: boolean = false;
  /** Referencia al modal */
  @ViewChild('modal', { static: false }) modal?: ModalDirective;
  /** Formulario de enlace operativo */
  public FormEnlaceOperativo!: FormGroup;
  /** Indicador de envío del formulario */
  public formSubmitted = false;
  /** Texto de la sección */
  public nuevaNotificacion!: Notificacion;
  /** Lista de enlaces operativos */
  public listaEnlaces: EnlaceOperativo[] = [];
  /** Notificador para destruir las suscripciones y evitar fugas de memoria */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Estado de la solicitud del trámite */
  private tramiteEnlace?: Tramite303Store;
  /** Enlace operativo a modificar */
  public enlaceOperativoModificar?: EnlaceOperativo;
  /** Modo de edición del formulario */
  public modoEdicion = false;

  /**
   * Constructor del componente EnlaceOperativoComponent.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param router Router para la navegación.
   * @param servicioServer Servicio para gestionar el enlace operativo.
   * @param tramite303State Estado del trámite 303.
   * @param tramite303Query Consultas del trámite 303.
   */
  constructor(
    private fb: FormBuilder,
    private servicioServer: EnlaceOperativoService,
    private tramite303State: Tramite303StoreService,
    private tramite303Query: Tramite303Query,
  ) {
    this.inicializarFormulario();
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.tramite303Query.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.tramiteEnlace = seccionState;
          this.listaEnlaces = seccionState.listaEnlaces;
          if (seccionState.enlaceOperativoModificar) {
            this.enlaceOperativoModificar = seccionState.enlaceOperativoModificar;
            this.modoEdicion = true;
            this.cargarFormularioModificar(this.enlaceOperativoModificar);
          }
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario de enlace operativo.
   */
  private inicializarFormulario(): void {
    this.FormEnlaceOperativo = this.fb.group({
      rfcBusqueda: [''],
      rfc: [{ value: '', disabled: true }],
      nombre: [{ value: '', disabled: true }],
      apellidoPaterno: [{ value: '', disabled: true }],
      apellidoMaterno: [{ value: '', disabled: true }],
      ciudad: [{ value: '', disabled: true }],
      cargoPuesto: [''],
      telefono: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      correoElectronico: ['', [Validators.email]],
      suplente: [false]
    });
  }

  /**
   * Busca un enlace operativo por su RFC.
   */
  buscarEnlaceOperativo(): void {
    this.formSubmitted = true;
    if (this.FormEnlaceOperativo.get('rfcBusqueda')?.valid) {
      const RFC = this.FormEnlaceOperativo.get('rfcBusqueda')?.value;
      this.servicioServer.buscarEnlacePorRFC(RFC).subscribe({
        next: (data) => {
          if (data) {
            this.FormEnlaceOperativo.patchValue(data);
          } else {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'warning',
              modo: 'action',
              titulo: 'Aviso',
              mensaje: 'No se encontró el enlace operativo',
              cerrar: true,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
          }
        },
      });
    }
  }

  /**
 * Acepta el enlace operativo: agrega uno nuevo o modifica uno existente.
 */
  aceptaEnlace(): void {
    if (!this.FormEnlaceOperativo.valid) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: 'Por favor complete todos los campos requeridos.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.FormEnlaceOperativo.markAllAsTouched();
      return;
    }
    this.habilitarCampos();
    const FORM_VALUE = this.FormEnlaceOperativo.value;
    const ENLACE: EnlaceOperativo = {
      rfc: FORM_VALUE.rfc || '',
      nombre: FORM_VALUE.nombre || '',
      apellidoPaterno: FORM_VALUE.apellidoPaterno || '',
      apellidoMaterno: FORM_VALUE.apellidoMaterno || '',
      ciudad: FORM_VALUE.ciudad || '',
      cargoPuesto: FORM_VALUE.cargoPuesto || '',
      telefono: FORM_VALUE.telefono || '',
      correoElectronico: FORM_VALUE.correoElectronico || '',
      suplente: FORM_VALUE.suplente || false
    };
    if (this.modoEdicion) {
      this.listaEnlaces = this.listaEnlaces.map(e =>
        e.rfc === this.FormEnlaceOperativo.get('rfc')?.value ? this.FormEnlaceOperativo.value : e
      );
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'success',
        modo: 'action',
        titulo: 'Éxito',
        mensaje: 'Enlace operativo modificado correctamente.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else {
      const YA_EXISTE = this.listaEnlaces.some(e => e.rfc === ENLACE.rfc);
      if (YA_EXISTE) {
        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'warning',
          modo: 'action',
          titulo: 'Aviso',
          mensaje: 'Ya existe un enlace operativo con el mismo RFC.',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        return;
      }
      this.listaEnlaces = [...this.listaEnlaces, ENLACE];
    }
    this.tramite303State.setListaEnlaces(this.listaEnlaces);
    this.tramite303State.enlaceOperativoModificar(null as unknown as EnlaceOperativo);
    this.FormEnlaceOperativo.reset();
    this.mostrarModal = false;
    this.cerrar.emit();
  }

  /**
   * Habilita los campos del formulario de enlace operativo.
   */
  habilitarCampos(): void {
    this.FormEnlaceOperativo.get('rfc')?.enable();
    this.FormEnlaceOperativo.get('nombre')?.enable();
    this.FormEnlaceOperativo.get('apellidoPaterno')?.enable();
    this.FormEnlaceOperativo.get('apellidoMaterno')?.enable();
    this.FormEnlaceOperativo.get('ciudad')?.enable();
  }

  /**
   * Cancela la operación actual y navega de regreso al registro.
   */
  cancelar(): void {
    this.FormEnlaceOperativo.reset();
    this.mostrarModal = false;
    this.cerrar.emit();
  }

  /**
   * Carga los datos del enlace operativo en el formulario para su modificación.
   * @param enlaceOperativo El enlace operativo a cargar en el formulario.
   */
  cargarFormularioModificar(enlaceOperativo?: EnlaceOperativo): void {
    if (enlaceOperativo) {
      this.FormEnlaceOperativo.patchValue({
        rfcBusqueda: enlaceOperativo.rfc,
        rfc: enlaceOperativo.rfc,
        nombre: enlaceOperativo.nombre,
        apellidoPaterno: enlaceOperativo.apellidoPaterno,
        apellidoMaterno: enlaceOperativo.apellidoMaterno,
        cargoPuesto: enlaceOperativo.cargoPuesto,
        ciudad: enlaceOperativo.ciudad,
        telefono: enlaceOperativo.telefono,
        correoElectronico: enlaceOperativo.correoElectronico,
        suplente: enlaceOperativo.suplente
      });
    }
  }

  /**
   * Se ejecuta cuando cambian las propiedades de entrada.
   * @param changes Cambios en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abrirModal'] && changes['abrirModal'].currentValue) {
      if (this.abrirModal) {
        this.mostrarModal = true;
      }
    }
  }

  /**
   * Se ejecuta cuando se oculta el modal.
   */
  onHidden(): void {
    this.mostrarModal = false;
  }

  /**
   * Cierra el modal y emite el evento de cierre.
   */
  cerrarModal(): void {
    this.mostrarModal = false;
    this.cerrar.emit();
  }
}