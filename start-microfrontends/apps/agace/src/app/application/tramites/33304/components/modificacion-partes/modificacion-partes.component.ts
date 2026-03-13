import {
  CatalogoSelectComponent,
  InputFechaComponent,
  InputRadioComponent,
  NotificacionesComponent,
  TableComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Solicitud33304State, Solicitud33304Store } from '../../estados/solicitud33304Store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { RADIO_OPTIONS } from '../../constants/aviso-modificacion-tabla.enum';
import { Solicitud33304Query } from '../../estados/solicitud33304Query';

@Component({
  selector: 'app-modificacion-partes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TituloComponent,
    InputRadioComponent,
    InputFechaComponent,
    CatalogoSelectComponent,
    NotificacionesComponent,
    TableComponent,
  ],
  templateUrl: './modificacion-partes.component.html',
  styleUrls: ['./modificacion-partes.component.scss'],
})
export class ModificacionPartesComponent implements OnInit, OnDestroy {

  /** Form de este bloque */
  formularioModificationPartes!: FormGroup;

  /** App state (optional if you need it) */
  public solicitudState!: Solicitud33304State;

  /** Opciones para los radios de selección: "Domicilio nuevo" o "Modificar domicilio" */
  radioOptions = RADIO_OPTIONS;

  /** Readonly desde Consultaio */
  esFormularioSoloLectura: boolean = false;

  /** Destroy notifier */
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private solicitud33304Store: Solicitud33304Store,
    private solicitud33304Query: Solicitud33304Query,
    private consultaioQuery: ConsultaioQuery,
  ) {

    // Sin condiciones extra: solo gestionar readonly
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
      this.crearFormulario();

  }

  ngOnInit(): void {
 this.solicitud33304Query.selectSolicitud$
       .pipe(
         takeUntil(this.destroy$),
         map((seccionState) => {
           this.solicitudState = seccionState;
 
         })
       )
       .subscribe();
 
     this.inicializarEstadoFormulario();
  }

  /** Readonly vs editable (sin otras condiciones) */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
    this.crearFormulario();
    }
  }

  /** Aplica enable/disable según readonly */
   guardarDatosFormulario(): void {
    this.crearFormulario();
    if (this.esFormularioSoloLectura) {
      this.formularioModificationPartes.disable();
    } else {
      this.formularioModificationPartes.enable();
    }
  }

  /** Construye/rehidrata el formulario */
  private crearFormulario(): void {

    this.formularioModificationPartes = this.fb.group({
      modificacionPartes: [this.solicitudState?.modificacionPartes, Validators.required],

      rfcPartesC2: [
        this.solicitudState?.rfcPartesC2 ?? '',
        [Validators.maxLength(13), Validators.pattern(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i)]
      ],
      rfcPartesCons2: [this.solicitudState?.rfcPartesCons2 ?? ''],
      nombrePartesCons2: [this.solicitudState?.nombrePartesCons2 ?? ''],
      caracterDeCons2: [this.solicitudState?.caracterDeCons2 ?? '', [Validators.maxLength(30)]],
      observaciones2: [this.solicitudState?.observaciones2 ?? '', [Validators.maxLength(500)]],
    });


    // Aplica validadores condicionales según el radio inicial
    this.aplicarValidadoresPorOpcion(this.formularioModificationPartes.get('modificacionPartes')?.value);

    if (this.esFormularioSoloLectura) {
      this.formularioModificationPartes.disable({ emitEvent: false });
    }
  }

  /** Maneja el cambio de radio y guarda en el store */
  verificaRadioDomicilio(valor: string | number): void {
    this.aplicarValidadoresPorOpcion(valor);
    this.setValoresStore(this.formularioModificationPartes, 'modificacionPartes');
  }

  /** Reglas de validación condicionales */
  public aplicarValidadoresPorOpcion(valor: string | number): void {
    const ISOPCION1 = String(valor) === '1';
    const CONTROLSPARTES = ['rfcPartesC2', 'caracterDeCons2'];
    const CONTROLOBS = 'observaciones2';

    // Partes requeridas cuando opción = 1
    CONTROLSPARTES.forEach(c => {
      const CTRL = this.formularioModificationPartes.get(c);
      if (!CTRL){
        return;
      } 
      if (ISOPCION1) {
        // Nota: RFC ya tiene regex; si también debe ser requerido en '1', agrégalo:
        const VALIDATORS = c === 'rfcPartesC2'
          ? [Validators.required, Validators.maxLength(13), Validators.pattern(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i)]
          : [Validators.required, Validators.maxLength(30)];
        CTRL.setValidators(VALIDATORS);
      } else {
        CTRL.clearValidators();
        CTRL.setValue('', { emitEvent: false });
      }
      CTRL.updateValueAndValidity({ emitEvent: false });
    });

    // Observaciones requerida cuando opción = 2 (si aplica)
    const OBSCTRL = this.formularioModificationPartes.get(CONTROLOBS);
    if (OBSCTRL) {
      if (!ISOPCION1) {
        // Si la observación debe ser obligatoria en '2', descomenta:
        // OBSCTRL.setValidators([Validators.required, Validators.maxLength(500)]);
        OBSCTRL.setValidators([Validators.maxLength(500)]);
      } else {
        OBSCTRL.clearValidators();
        OBSCTRL.setValue('', { emitEvent: false });
      }
      OBSCTRL.updateValueAndValidity({ emitEvent: false });
    }
  }

  /** Copia RFC a los campos consultados y pone un nombre de ejemplo */
  cargarDatosrfcPartesC2(): void {
    const RFC = this.formularioModificationPartes.get('rfcPartesC2')?.value || '';
    this.formularioModificationPartes.patchValue({
      rfcPartesCons2: RFC,
      nombrePartesCons2: 'Nombre de la parte (ejemplo)',
    });
    this.setValoresStore(this.formularioModificationPartes, 'rfcPartesC2');
    this.setValoresStore(this.formularioModificationPartes, 'rfcPartesCons2');
    this.setValoresStore(this.formularioModificationPartes, 'nombrePartesCons2');
  }

  /** Limpia los campos de la sección “partes” */
  limpiaCamposParteC(): void {
    this.formularioModificationPartes.patchValue({
      rfcPartesC2: '',
      rfcPartesCons2: '',
      nombrePartesCons2: '',
      caracterDeCons2: '',
    });
  }

    /** Handlers usados por los botones en tu HTML */
  cargarDatosRfcPartesC(): void {
    const RFC = this.formularioModificationPartes.get('rfcPartesC2')?.value || '';
    this.formularioModificationPartes.patchValue({
      rfcPartesCons2: RFC,
      nombrePartesCons2: 'Nombre de la parte (ejemplo)',
    });
    this.setValoresStore(this.formularioModificationPartes, 'rfcPartesCons2');
    this.setValoresStore(this.formularioModificationPartes, 'nombrePartesCons2');
    this.setValoresStore(this.formularioModificationPartes, 'caracterDeCons2');
  }

  /**
   * “Aceptar” en la sección de partes.
   * Aquí puedes enviar al store la fila recién capturada si tienes una lista,
   * o simplemente persistir los campos individuales.
   */
  agregarParteC(): void {
    if (!this.formularioModificationPartes.valid) {
      this.formularioModificationPartes.markAllAsTouched();
    //   return;
    }
    
  }

  /** Setter genérico para el store, usado desde el template */
   setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.solicitud33304Store.actualizarEstado( { [campo]: CONTROL.value } );
    }
    if(campo === 'modificacionPartes') {
      this.aplicarValidadoresPorOpcion(form.get(campo)?.value);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
