import { BIOMESTRE_CATALOGO, RADIO_01, SECTOR_PRODUCTIVO, SERVICIO_CATALOGO } from '../../constantes/adace32606.enum';
import { Catalogo, CatalogoSelectComponent, ConsultaioQuery, ConsultaioState, InputRadioComponent, Notificacion, NotificacionesComponent, Pedimento, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Solicitud32606State, Tramite32606Store } from '../../state/tramite32606.store';
import { CommonModule } from '@angular/common';
import { DatosLabelEnum } from '../../constantes/labels32606.enum';
import { DomicillioComponent } from '../domicillio/domicillio.component';
import { EconomicoService } from '../../services/economico.service';
import { MiembroComponent } from '../miembro/miembro.component';
import { QuerellaComponent } from '../querella/querella.component';
import { Tramite32606Query } from '../../state/tramite32606.query';

/** Componente para la sección de datos comunes del trámite 32606. */
@Component({
  selector: 'app-datos-comunes',
  standalone: true,
  imports: [CommonModule, CatalogoSelectComponent, InputRadioComponent, ReactiveFormsModule,
    DomicillioComponent, QuerellaComponent, MiembroComponent, TituloComponent, NotificacionesComponent],
  templateUrl: './datos-comunes.component.html',
  styleUrl: './datos-comunes.component.scss',
})
export class DatosComunesComponent implements OnInit, OnDestroy {
  /** Catálogo de sector productivo. */
  public sectorProductivo = SECTOR_PRODUCTIVO;
  /** Catálogo de servicio. */
  public servicioCatalogo = SERVICIO_CATALOGO;
  /** Catálogo de biomestre. */
  public biomestreCatalogo = BIOMESTRE_CATALOGO;
  /** Opciones para el radio tipo 01. */
  radioOpcions01 = RADIO_01;
  /** Formulario reactivo principal de datos comunes. */
  public datosComunesForm!: FormGroup;
  /** Valor seleccionado en los radios. */
  valorSeleccionado!: string;
  /** Notificación para el modal principal. */
  public nuevaNotificacion!: Notificacion;
  /** Notificación para el segundo modal. */
  public nuevaNotificacion2!: Notificacion;
  /** Índice del elemento a eliminar en la lista principal. */
  public elementoParaEliminar!: number;
  /** Índice del elemento a eliminar en la segunda lista. */
  public elementoParaEliminar2!: number;
  /** Lista de pedimentos. */
  public pedimentos: Array<Pedimento> = [];
  /** Indica si el formulario está en modo solo lectura. */
  soloLectura: boolean = false;
  /** Estado actual de la solicitud. */
  public solicitudState!: Solicitud32606State;
  /** Observable para controlar la destrucción de suscripciones. */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** Estado de consulta actual. */
  consultaDatos!: ConsultaioState;
  /** Etiquetas para los campos del formulario. */
  enumEtiquetas = DatosLabelEnum;

    /**
   * Constructor del componente DatosComunesComponent.
   * Se utiliza para la inyección de dependencias y la suscripción al estado de consulta,
   * lo que permite determinar si el formulario debe estar en modo solo lectura y actualizar su estado inicial.
   *
   * @param economico Servicio para operaciones económicas y obtención de catálogos.
   * @param query Servicio para consultar el estado actual del trámite 32606.
   * @param store Almacén global para gestionar el estado del trámite 32606.
   * @param fb Constructor de formularios reactivos.
   * @param validacionesService Servicio para validar campos del formulario.
   * @param consultaioQuery Servicio para consultar el estado de la sección y determinar el modo de solo lectura.
   */
  constructor(private economico: EconomicoService,
    public query: Tramite32606Query,
    public store: Tramite32606Store,
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
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
      .subscribe()
  }

  /** Inicializa el formulario y obtiene catálogos al iniciar el componente. */
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
    this.obtenerSectorProductivo();
    this.obtenerServicio();
    this.obtenerBimestre();
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
      this.datosComunesForm.disable();
    } else {
      this.datosComunesForm.enable();
    }
  }

  /** Cambia el valor del radio y abre el modal si corresponde. */
  cambiarRadio(value: string | number): void {
    this.valorSeleccionado = value as string;
    if (value === 'si') {
      this.abrirModal();
    }
  }

  /** Cambia el valor del segundo radio y abre el modal si corresponde. */
  cambiarRadio2(value: string | number): void {
    this.valorSeleccionado = value as string;
    if (value === 'no') {
      this.abrirModal();
    }
  }

  /** Obtiene el catálogo de sector productivo desde el servicio. */
  obtenerSectorProductivo(): void {
    this.economico
      .obtenerSectorProductivo()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.sectorProductivo.catalogos = resp as Catalogo[];
      });
  }

  /** Obtiene el catálogo de servicio desde el servicio. */
  obtenerServicio(): void {
    this.economico
      .obtenerServicio()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.servicioCatalogo.catalogos = resp as Catalogo[];
      });
  }

  /** Obtiene el catálogo de biomestre desde el servicio. */
  obtenerBimestre(): void {
    this.economico
      .obtenerBimestre()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.biomestreCatalogo.catalogos = resp as Catalogo[];
      });
  }

  /** Elimina un pedimento de la lista principal si borrar es true. */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /** Abre el modal de notificación y guarda el índice del elemento. */
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Es un requisito obligatorio para acceder al Registro en el Esquema de Certificación de Empresas, de conformidad con la regla 7.1.1. de las RGCE.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    }
    this.elementoParaEliminar = i;
  }

  /** Elimina un pedimento de la segunda lista si borrar es true. */
  eliminarPedimento2(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /** Valida si un campo del formulario es válido usando el servicio de validaciones. */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /** Marca todos los campos del formulario como tocados si es inválido. */
  validarDestinatarioFormulario(): void {
    if (this.datosComunesForm.invalid) {
      this.datosComunesForm.markAllAsTouched();
    }
  }

  /**
   * Actualiza un valor en el store usando el nombre del método.
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
    this.datosComunesForm = this.fb.group({
      sectorProductivo: [{ value: this.solicitudState?.sectorProductivo, disabled: this.soloLectura }, [Validators.required]],
      servicio: [{ value: this.solicitudState?.servicio, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio01: [{ value: this.solicitudState?.tipoRadio01, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio02: [{ value: this.solicitudState?.tipoRadio02, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio03: [{ value: this.solicitudState?.tipoRadio03, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio04: [{ value: this.solicitudState?.tipoRadio04, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio05: [{ value: this.solicitudState?.tipoRadio05, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio06: [{ value: this.solicitudState?.tipoRadio06, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio07: [{ value: this.solicitudState?.tipoRadio07, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio08: [{ value: this.solicitudState?.tipoRadio08, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio09: [{ value: this.solicitudState?.tipoRadio09, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio10: [{ value: this.solicitudState?.tipoRadio10, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio11: [{ value: this.solicitudState?.tipoRadio11, disabled: this.soloLectura }, [Validators.required]],
      domicilio: [{ value: this.solicitudState?.domicilio, disabled: this.soloLectura }, [Validators.required]],
      biomestre: [{ value: this.solicitudState?.biomestre, disabled: this.soloLectura }, [Validators.required]],
      numeroEmpleados: [{ value: this.solicitudState?.numeroEmpleados, disabled: this.soloLectura }, [Validators.required]]
    });
  }

  /** Libera recursos y completa el observable destroyed$ al destruir el componente. */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}