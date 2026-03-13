import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { Notificacion, NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite303Store, Tramite303StoreService } from '../../../../core/estados/tramites/tramite303.store';
import { AgenteAduanal } from '../../../../core/models/303/agente-aduanal.model';
import { CommonModule } from '@angular/common';
import { TipoFiguraSeleccionada } from '../../../../core/enums/303/figuras.enum';
import { TipoFiguraService } from '../../../../core/services/303/tipo-figura.service';
import { Tramite303Query } from '../../../../core/queries/tramite303.query';

@Component({
  selector: 'app-registro-figura',
  standalone: true,
  imports: [CommonModule, ModalModule, ReactiveFormsModule, NotificacionesComponent],
  templateUrl: './registro-figura.component.html',
  styleUrl: './registro-figura.component.scss',
})
export class RegistroFiguraComponent implements OnChanges, OnInit, OnDestroy {
  /** Título del modal */
  @Input() titulo: string = '';
  /**Variable para mostrar el modal */
  public mostrarModal: boolean = false;
  /** Referencia al modal */
  @ViewChild('modal', { static: false }) modal?: ModalDirective;
  /** Indica si se debe abrir el modal */
  @Input() abrirModal: boolean = false;
  /** Evento que se emite al cerrar el modal */
  @Output() cerrar = new EventEmitter<void>();
  /** Formulario para la figura */
  public FormFigura!: FormGroup;
  /** Estado del trámite 303 consultado */
  public tramiteConsultado?: Tramite303Store;
  /** Notificador para destruir las suscripciones y evitar fugas de memoria */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Tipo de figura seleccionada */
  tipoFiguraSeleccionada: string = '';
  /** Texto de la sección */
  public nuevaNotificacion!: Notificacion;
  /** Lista de figuras aduanales */
  private listaFiguras: AgenteAduanal[] = [];
  constructor(
    private tramite303State: Tramite303StoreService,
    private tramite303Query: Tramite303Query,
    private figuraService: TipoFiguraService,
    private fb: FormBuilder
  ) {
    this.crearFormFigura();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Suscribe a los cambios en la solicitud del trámite 303 y asigna el estado a la variable `tramiteConsultado`.
   * También crea los formularios para buscar una figura y para la figura.
   */
  ngOnInit(): void {
    this.tramite303Query.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.tramiteConsultado = seccionState;
          this.tipoFiguraSeleccionada = this.tramiteConsultado?.tipoFigura || '';
          this.listaFiguras = this.tramiteConsultado?.listaFiguras || [];
          this.asignarTitulo();
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
   * Método que se ejecuta al detectar cambios en las propiedades de entrada.
   * @param changes Cambios detectados en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abrirModal'] && changes['abrirModal'].currentValue) {
      if (this.abrirModal) {
        this.mostrarModal = true;
      }
    }
  }

  /**
   * Asigna el título del modal según el tipo de figura seleccionada.
   */
  asignarTitulo(): void {
    switch (this.tipoFiguraSeleccionada) {
      case '1':
        this.titulo = 'Registro de Agentes Aduanales';
        break;
      case '2':
        this.titulo = 'Registro de Apoderados Aduanales';
        break;
      case '3':
        this.titulo = 'Registro de Agencias Aduanales';
        break;
      default:
        this.titulo = '';
    }
  }
  /**
   * Crea el formulario para la figura.
   * Este formulario contiene campos para el nombre, primer apellido, segundo apellido y número de patente.
   * Los campos están deshabilitados inicialmente.
   */
  crearFormFigura(): void {
    this.FormFigura = this.fb.group({
      idNumPatenteModal: ['', [Validators.required]],
      rfcModal: ['', [Validators.pattern('^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$')]], // RFC con formato específico
      nombreAgente: [{ value: '', disabled: true }],
      apellidoPaternoAgente: [{ value: '', disabled: true }],
      apellidoMaternoAgente: [{ value: '', disabled: true }],
      patente: [{ value: '', disabled: true }],
      razonSocial: []
    });
  }

  /**
  * Método que se ejecuta al buscar una figura.
  * Realiza una consulta a la API para obtener los datos de la figura según el número de patente y RFC proporcionados.
  * Si no se encuentra la figura, muestra una notificación al usuario.
  */
  buscarFigura(): void {
    const NUMERO_PATENTE = this.FormFigura.get('idNumPatenteModal')?.value;
    const NUMERO_RFC = this.FormFigura.get('rfcModal')?.value;
    if (!NUMERO_PATENTE) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'info',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe ingresar el número de patente.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
    else {
      if (this.tipoFiguraSeleccionada === TipoFiguraSeleccionada.AgenteAduanal) {
        this.figuraService.consultaAgenteAduanal(NUMERO_PATENTE, NUMERO_RFC)
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe((figura) => {
            if (figura) {
              this.FormFigura.patchValue({
                nombreAgente: figura.nombreAgente,
                apellidoPaternoAgente: figura.apellidoPaternoAgente,
                apellidoMaternoAgente: figura.apellidoMaternoAgente,
                idNumPatenteModal: figura.patente,
                rfcModal: figura.rfcModal,
                patente: figura.patente
              });
            } else {
              this.nuevaNotificacion = {
                tipoNotificacion: 'alert',
                categoria: 'warning',
                modo: 'action',
                titulo: '',
                mensaje: 'No se encontró el agente aduanal con los datos proporcionados.',
                cerrar: true,
                txtBtnAceptar: 'Aceptar',
                txtBtnCancelar: '',
              };
            }
          });
      }
      if (this.tipoFiguraSeleccionada === TipoFiguraSeleccionada.ApoderadoAduanal) {
        this.figuraService.consultaApoderadoAduanal(NUMERO_PATENTE, NUMERO_RFC)
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe((figura) => {
            if (figura) {
              this.FormFigura.patchValue({
                nombreAgente: figura.nombreAgente,
                apellidoPaternoAgente: figura.apellidoPaternoAgente,
                apellidoMaternoAgente: figura.apellidoMaternoAgente,
                idNumPatenteModal: figura.patente,
                rfcModal: figura.rfcModal,
                patente: figura.patente
              });
            } else {
              this.nuevaNotificacion = {
                tipoNotificacion: 'alert',
                categoria: 'warning',
                modo: 'action',
                titulo: '',
                mensaje: 'No se encontró la patente.',
                cerrar: true,
                txtBtnAceptar: 'Aceptar',
                txtBtnCancelar: '',
              };
            }
          });
      }
    }
  }

  /**
  * Método que se ejecuta al destruir el componente.
  * Limpia el notifier de destrucción para evitar fugas de memoria.
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Limpia los formularios de búsqueda y figura, y vuelve a crear los formularios.
   */
  limpiarFigura(): void {
    this.FormFigura.reset();
    this.crearFormFigura();
  }

  /**
  * Muestra una notificación de alerta al usuario cuando no hay información para guardar.
  */
  notificacionAlert(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: 'No hay información para guardar',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Método que se ejecuta al agregar una figura.
   * Valida los campos del formulario según el tipo de figura seleccionada.
   * Si los campos son válidos, agrega la figura a la lista de figuras y navega a la página de registro.
   */
  agregarFigura(): void {
    if (this.tipoFiguraSeleccionada === TipoFiguraSeleccionada.AgenteAduanal || this.tipoFiguraSeleccionada === TipoFiguraSeleccionada.ApoderadoAduanal) {
      const NOMBRE = this.FormFigura.get('nombreAgente')?.value?.trim();
      const APELLIDO_PATERNO = this.FormFigura.get('apellidoPaternoAgente')?.value?.trim();
      const APELLIDO_MATERNO = this.FormFigura.get('apellidoMaternoAgente')?.value?.trim();
      const PATENTE = this.FormFigura.get('patente')?.value?.trim();
      if (!NOMBRE || !APELLIDO_PATERNO || !APELLIDO_MATERNO || !PATENTE) {
        this.notificacionAlert();
        return;
      }
    }
    if (this.tipoFiguraSeleccionada === TipoFiguraSeleccionada.AgenciaAduanal) {
      const RAZON_SOCIAL = this.FormFigura.get('razonSocial')?.value?.trim();
      const PATENTE = this.FormFigura.get('idNumPatenteModal')?.value?.trim();
      if (!RAZON_SOCIAL || !PATENTE) {
        this.notificacionAlert();
        return;
      }
    }
    this.habilitarCampos();
    const FORM_VALUE = this.FormFigura.value;
    const FIGURA: AgenteAduanal = {
      nombreAgente: FORM_VALUE.nombreAgente,
      apellidoPaternoAgente: FORM_VALUE.apellidoPaternoAgente,
      apellidoMaternoAgente: FORM_VALUE.apellidoMaternoAgente,
      patente: FORM_VALUE.patente,
      rfcModal: FORM_VALUE.rfcModal,
      razonSocial: FORM_VALUE.razonSocial
    };
    const YA_EXISTE = this.listaFiguras.some(e => e.patente === FIGURA.patente);
    if (YA_EXISTE) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'La figura ya existe',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    this.listaFiguras = [...this.listaFiguras, FIGURA];
    this.tramite303State.setListaFiguras(this.listaFiguras);
    this.FormFigura.reset();
    this.mostrarModal = false;
    this.cerrar.emit();
  }

  /**
   * Habilita los campos del formulario.
   */
  habilitarCampos(): void {
    this.FormFigura.get('nombreAgente')?.enable();
    this.FormFigura.get('apellidoPaternoAgente')?.enable();
    this.FormFigura.get('apellidoMaternoAgente')?.enable();
    this.FormFigura.get('patente')?.enable();
    this.FormFigura.get('rfcModal')?.enable();
    this.FormFigura.get('razonSocial')?.enable();
  }

  /**
   * Cancela la figura y navega de vuelta a la página de registro.
   */
  cancelarFigura(): void {
    this.mostrarModal = false;
    this.cerrar.emit();
  }

  /**
   * Método que se ejecuta al ocultar el modal.
   */
  onHidden(): void {
    this.mostrarModal = false;
  }
}
