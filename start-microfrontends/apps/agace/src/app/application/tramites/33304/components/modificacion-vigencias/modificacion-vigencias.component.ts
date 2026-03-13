import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
    InputFecha,
    InputFechaComponent,  
    InputRadioComponent,
    TituloComponent
} from '@libs/shared/data-access-user/src';
import { Solicitud33304State, Solicitud33304Store } from '../../estados/solicitud33304Store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PERFILES_FECHA_INPUT } from '../../../32605/constants/perfiles.enum';
import { RADIO_OPTIONS } from '../../constants/aviso-modificacion-tabla.enum';
import { Solicitud33304Query } from '../../estados/solicitud33304Query';

@Component({
  selector: 'app-modificacion-vigencias',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TituloComponent,
    InputRadioComponent,
    InputFechaComponent
  ],
  templateUrl: './modificacion-vigencias.component.html',
  styleUrls: ['./modificacion-vigencias.component.scss'],
})
export class ModificacionVigenciasComponent implements OnInit, OnDestroy {

  /** Form de este bloque */
  formularioModificacionVigencias!: FormGroup;

  /** Opciones para los radios de selección: "Domicilio nuevo" o "Modificar domicilio" */
  radioOptions = RADIO_OPTIONS;

  /** Config for <input-fecha> */
  fechaInputDatos: InputFecha = PERFILES_FECHA_INPUT;

  /** Readonly flag from Consultaio */
  esFormularioSoloLectura: boolean = false;

  /** App state (optional if you need it) */
  public solicitudState!: Solicitud33304State;

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
      this.formularioModificacionVigencias.disable();
    } else {
      this.formularioModificacionVigencias.enable();
    }
  }

    /** Construye/rehidrata el formulario */
  private crearFormulario(): void {

    this.formularioModificacionVigencias = this.fb.group({
      modificacionVigencias: [this.solicitudState?.modificacionVigencias, Validators.required],
      fechaInicioVigenciaAnterior: [this.solicitudState?.fechaInicioVigenciaAnterior ?? ''],
      fechaFinVigenciaAnterior: [this.solicitudState?.fechaFinVigenciaAnterior ?? ''],
      fechaInicioVigenciaActual: [this.solicitudState?.fechaInicioVigenciaActual ?? ''],
      fechaFinVigenciaActual: [this.solicitudState?.fechaFinVigenciaActual ?? ''],
    });

  }

  /**
   * Actualiza el valor de la fecha de inicio de comercio en el formulario.
   * Establece el valor y marca el campo como no tocado.
   * 
   * param nuevo_valor - Nuevo valor de la fecha en formato string
   */
  actualizarFecha(nuevo_valor: string, compo:string): void {
    this.formularioModificacionVigencias.get(compo)?.setValue(nuevo_valor);
    this.formularioModificacionVigencias.get(compo)?.markAsUntouched();
  }

  /** Generic store setter used in (change) or along with actualizarFecha */
  setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form){
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== undefined) {
      this.solicitud33304Store.actualizarEstado({ [campo]: CONTROL.value });
    }

    if(campo === 'modificacionVigencias'){
      this.applyVigenciaValidators(form.get(campo)?.value === '1');
    }
  }

  /** Add/remove required validators on dates depending on radio selection */
  private applyVigenciaValidators(requiereFechas: boolean): void {
    
    const CONTROLS = [
      'fechaInicioVigenciaAnterior',
      'fechaFinVigenciaAnterior',
      'fechaInicioVigenciaActual',
      'fechaFinVigenciaActual',
    ];

    CONTROLS.forEach(c => {
      const CTRL = this.formularioModificacionVigencias.get(c);
      if (!CTRL){
        return;
      }
      if (requiereFechas) {
        CTRL.setValidators([Validators.required]);
      } else {
        CTRL.clearValidators();
        CTRL.setValue('', { emitEvent: false });
      }
      CTRL.updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
