import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { TituloComponent } from '@libs/shared/data-access-user/src';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RADIO_OPCIONS } from '../../constants/constante110102.enums';
import { Subject } from 'rxjs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { takeUntil } from 'rxjs/operators';


import { Tramite110102State, Tramite110102Store } from '../../estados/store/tramite110102.store';
import { Tramite110102Query } from '../../estados/queries/tramite110102.query';

@Component({
  selector: 'app-exportador-autorizado',
  standalone: true,
  imports: [CommonModule, TituloComponent, TooltipModule, ReactiveFormsModule],
  templateUrl: './exportador-autorizado.component.html',
  styleUrls: ['./exportador-autorizado.component.scss']
})
export class ExportadorAutorizadoComponent implements OnInit{

  /**
   * Representa el formulario del componente.
   * Se espera que esta propiedad sea del tipo 'FormGroup'.
   *
   * @property {FormGroup} formularioExportadorAutorizado - El formulario del componente.
   */
  public formularioExportadorAutorizado!: FormGroup;

  /**
   * Opciones disponibles para el grupo de radio.
   * 
   */
  public radioOpcions = RADIO_OPCIONS;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

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
    this.formularioExportadorAutorizado = this.fb.group({
      informacionRadiosJPN: [this.estadoTramite?.informacionRadiosJPN],
      exportadorAutorizadoJPN: [Boolean(this.estadoTramite?.exportadorAutorizadoJPN)]
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
}
