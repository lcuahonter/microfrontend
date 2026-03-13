import { CARACTER_CATALOGO, EMPRESA_TABLA, NACIONALIDAD_CATALOGO, RADIO_08 } from '../../constantes/adace32606.enum';
import { Catalogo, CatalogoSelectComponent, ConsultaioQuery, ConsultaioState, InputRadioComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Solicitud32606State, Tramite32606Store } from '../../state/tramite32606.store';
import { CommonModule } from '@angular/common';
import { EconomicoService } from '../../services/economico.service';
import { MiembroLabelEnum } from '../../constantes/labels32606.enum';
import { Modal } from 'bootstrap';
import { Tramite32606Query } from '../../state/tramite32606.query';

/** Componente para la sección de miembros del trámite 32606. */
@Component({
  selector: 'app-miembro',
  standalone: true,
  imports: [CommonModule, TituloComponent, TablaDinamicaComponent, ReactiveFormsModule, InputRadioComponent,
    CatalogoSelectComponent
  ],
  templateUrl: './miembro.component.html',
  styleUrl: './miembro.component.scss',
})
export class MiembroComponent implements OnInit, OnDestroy {
  /** Formulario reactivo principal de miembros. */
  public miembroForm !: FormGroup;
  /** Opciones para el radio tipo 08. */
  radioOpcions08 = RADIO_08;
  /** Referencia a la tabla de selección. */
  TablaSeleccion = TablaSeleccion;
  /** Configuración de la tabla de empresa. */
  public empresaTabla = EMPRESA_TABLA;
  /** Referencia al modal para agregar miembro. */
  @ViewChild('modalAgregar') modalElement!: ElementRef;
  /** Referencia al botón de cerrar modal. */
  @ViewChild('closeModal') closeModalButton!: ElementRef;
  /** Catálogo de carácter. */
  public caracterCatalogo = CARACTER_CATALOGO;
  /** Catálogo de nacionalidad. */
  public nacionalidadCatalogo = NACIONALIDAD_CATALOGO;
  /** Observable para controlar la destrucción de suscripciones. */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** Indica si el formulario está en modo solo lectura. */
  soloLectura: boolean = false;
  /** Estado actual de la solicitud. */
  public solicitudState!: Solicitud32606State;
  /** Estado de consulta actual. */
  consultaDatos!: ConsultaioState;
  /** Etiquetas para los campos del formulario. */
  enumEtiquetas = MiembroLabelEnum;

  /**
 * Constructor del componente MiembroComponent.
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
    private consultaioQuery: ConsultaioQuery) {
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
    this.obtenerCaracter();
    this.obtenerNacionalidad();
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
      this.miembroForm.disable();
    } else {
      this.miembroForm.enable();
    }
  }

  /** Muestra el modal para agregar miembro. */
  agregarMiembro(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /** Obtiene el catálogo de carácter desde el servicio. */
  obtenerCaracter(): void {
    this.economico
      .obtenerCaracter()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.caracterCatalogo.catalogos = resp as Catalogo[];
      });
  }

  /** Obtiene el catálogo de nacionalidad desde el servicio. */
  obtenerNacionalidad(): void {
    this.economico
      .obtenerNacionalidad()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.nacionalidadCatalogo.catalogos = resp as Catalogo[];
      });
  }

  /** Marca todos los campos del formulario como tocados si es inválido. */
  validarDestinatarioFormulario(): void {
    if (this.miembroForm.invalid) {
      this.miembroForm.markAllAsTouched();
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
    this.miembroForm = this.fb.group({
      tipoRadio14: [{ value: this.solicitudState?.tipoRadio14, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio15: [{ value: this.solicitudState?.tipoRadio15, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio16: [{ value: this.solicitudState?.tipoRadio16, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio17: [{ value: this.solicitudState?.tipoRadio17, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio34: [{ value: this.solicitudState?.tipoRadio34, disabled: this.soloLectura }, [Validators.required]],
      caracter: [{ value: this.solicitudState?.caracter, disabled: this.soloLectura }, [Validators.required]],
      nacionalidad: [{ value: this.solicitudState?.nacionalidad, disabled: this.soloLectura }, [Validators.required]],
    });
  }

  /** Libera recursos y completa el observable destroyed$ al destruir el componente. */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}