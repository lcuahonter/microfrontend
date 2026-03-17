import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RADIO_OPCIONS } from '../../constants/constante110102.enums';
import { Subject } from 'rxjs';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { takeUntil } from 'rxjs/operators';

import { Tramite110102State, Tramite110102Store } from '../../estados/store/tramite110102.store';
import { Tramite110102Query } from '../../estados/queries/tramite110102.query';

@Component({
  selector: 'app-informacion-opcional',
  standalone: true,
  imports: [CommonModule, TituloComponent, TooltipModule, ReactiveFormsModule],
  templateUrl: './informacion-opcional.component.html',
  styleUrl: './informacion-opcional.component.scss'
})


export class InformacionOpcionalComponent implements OnInit, OnDestroy{ 

  /**
   * Representa el formulario del componente.
   * Se espera que esta propiedad sea del tipo 'FormGroup'.
   *
   * @property {FormGroup} formularioInformacionOpcional - El formulario del componente.
   */

  public formularioInformacionOpcional!: FormGroup;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Opciones disponibles para el grupo de radio.
   * 
   */
  public radioOpcions = RADIO_OPCIONS;

  /**
    * Estado actual del trámite.
  */
  estadoTramite!: Tramite110102State;
  
  /**
   * @description
   * Subject que emite un evento cuando el componente es destruido, permitiendo la desuscripción de observables.
   */
  private destruido$ = new Subject<void>();

  /**
   * @description Constructor del componente
   * @param fb 
   */
  constructor(private fb: FormBuilder,
    private tramiteStore: Tramite110102Store,
    private consultaTramite: Tramite110102Query
    )
  {
    this.consultaTramite.selectTramite110102$
      .pipe(takeUntil(this.destruido$))
      .subscribe((estado) => {
        this.estadoTramite = estado;
      });
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * @returns {void}
   */
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  /**
   * Inicializa el formulario reactivo del componente con los valores por defecto
   */
  public inicializarFormulario(): void {
    this.formularioInformacionOpcional = this.fb.group({
      informacionRadios: [this.estadoTramite?.informacionRadios],
      metodoSeparacion: [Boolean(this.estadoTramite?.metodoSeparacion)],
      exportadorAutorizado: [Boolean(this.estadoTramite?.exportadorAutorizado)]
    });
  }

  /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite110102Store, campoStore?: string): void {
    const VALOR = form.get(campo)?.value;
    if (metodoNombre === 'setValor') {
      const CAMPO = (campoStore) as keyof Tramite110102State;
      this.tramiteStore.setValor(CAMPO, VALOR);
    } else {
      (this.tramiteStore[metodoNombre] as (value: unknown) => void)(VALOR);
    }
  }

    /**
   * @description
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject `destruido$` para desuscribirse de todos los observables.
   */
  ngOnDestroy(): void {
    this.destruido$.next();
    this.destruido$.complete();
  }
}