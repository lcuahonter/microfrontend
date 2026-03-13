import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { ENLACE_OPERATIVO_TABLA, PERSONAS_TABLA } from '../../constantes/adace32606.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Solicitud32606State, Tramite32606Store } from '../../state/tramite32606.store';
import { CommonModule } from '@angular/common';
import { EconomicoService } from '../../services/economico.service';
import { RecibirNotificaciones } from '../../models/adace.model';
import { TercerosLabelEnum } from '../../constantes/labels32606.enum';
import { Tramite32606Query } from '../../state/tramite32606.query';


/** Componente para la sección de terceros relacionados del trámite 32606. */
@Component({
  selector: 'app-terceros-relacinados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, TablaDinamicaComponent],
  templateUrl: './terceros-relacinados.component.html',
  styleUrl: './terceros-relacinados.component.scss',
})
export class TercerosRelacinadosComponent implements OnInit, OnDestroy {
  /** Formulario reactivo principal de terceros relacionados. */
  public tercerosRelacionadosForm !: FormGroup;
  /** Referencia a la tabla de selección. */
  TablaSeleccion = TablaSeleccion;
  /** Configuración de la tabla de enlace operativo. */
  public enlaceTabla = ENLACE_OPERATIVO_TABLA;
  /** Configuración de la tabla de personas. */
  public personasTabla = PERSONAS_TABLA;
  /** Lista de personas relacionadas. */
  personasLista: RecibirNotificaciones[] = [] as RecibirNotificaciones[];
  /** Indica si el formulario está en modo solo lectura. */
  soloLectura: boolean = false;
  /** Estado actual de la solicitud. */
  public solicitudState!: Solicitud32606State;
  /** Observable para controlar la destrucción de suscripciones. */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** Estado de consulta actual. */
  consultaDatos!: ConsultaioState;
   /** Etiquetas para los campos del formulario. */
    enumEtiquetas = TercerosLabelEnum;

    /**
   * Constructor del componente TercerosRelacinadosComponent.
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
      this.tercerosRelacionadosForm.disable();
    } else {
      this.tercerosRelacionadosForm.enable();
    }
  }

  /** Marca todos los campos del formulario como tocados si es inválido. */
  validarDestinatarioFormulario(): void {
    if (this.tercerosRelacionadosForm.invalid) {
      this.tercerosRelacionadosForm.markAllAsTouched();
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
    this.tercerosRelacionadosForm = this.fb.group({
      rfcTercero: [{ value: this.solicitudState?.rfcTercero, disabled: this.soloLectura }, [Validators.required]],
      rfc: [{ value: this.solicitudState?.rfc, disabled: this.soloLectura }, [Validators.required]],
      nombre: [{ value: this.solicitudState?.nombre, disabled: this.soloLectura }, [Validators.required]],
      apellidoPaterno: [{ value: this.solicitudState?.apellidoPaterno, disabled: this.soloLectura }, [Validators.required]],
      apellidoMaterno: [{ value: this.solicitudState?.apellidoMaterno, disabled: this.soloLectura }, [Validators.required]],
      telefono: [{ value: this.solicitudState?.telefono, disabled: this.soloLectura }, [Validators.required]],
      correoElectronico: [{ value: this.solicitudState?.correoElectronico, disabled: this.soloLectura }, [Validators.required]],
    });
  }

  /** Libera recursos y completa el observable destroyed$ al destruir el componente. */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}