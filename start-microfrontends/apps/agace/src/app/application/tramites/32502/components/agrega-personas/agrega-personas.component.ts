import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Notificacion, NotificacionesComponent, ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Solicitud32502State, Tramite32502Store } from '../../../../estados/tramites/tramite32502.store';
import { Persona } from '../../../../core/models/32502/tramite32502.model';
import { SeccionAgaceState } from '../../../../estados/seccion.store';
import { Subject } from 'rxjs';
import { Tramite32502Query } from '../../../../estados/queries/tramite32502.query';

@Component({
  selector: 'agrega-personas',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    NotificacionesComponent],
  templateUrl: './agrega-personas.component.html',
  styleUrl: './agrega-personas.component.scss',
})
export class AgregaPersonasComponent {
  /**
   * Estado de la sección actual.
   */
  private seccion!: SeccionAgaceState;

  /**
   * Estado de la solicitud actual.
   */
  public solicitudState!: Solicitud32502State;

  /**
   * Control de formulario para el campo `gafete`.
   */
  gafete: FormControl = new FormControl('', [Validators.maxLength(25)]);

  /**
   * Formulario para capturar los datos de una persona.
   */
  personaForm: FormGroup = this.fb.group({
    nombre: [{value: this.solicitudState?.nombre, disabled: true }],
    primerApellido: [{ value: this.solicitudState?.primerApellido, disabled: true }],
    segundoApellido: [{ value: this.solicitudState?.segundoApellido, disabled: true }],
  });

  /**
   * Objeto que representa a una persona.
   */
  persona!: Persona;

  /**
   * Lista de personas agregadas.
   */
  personas: Array<Persona> = [];

  /**
   * Sujeto para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  public notificacion?: Notificacion;

  constructor(
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private tramite32502Store: Tramite32502Store,
    private tramite32502Query: Tramite32502Query,
    private seccionQuery: Tramite32502Query
  ) {
    //
  }

  /**
   * Verifica si un campo del formulario es válido.
   * 
   * @param field - El nombre del campo a verificar.
   * @returns `true` si el campo es válido, `false` en caso contrario.
   */
  isValid(field: string): boolean | null {
    return this.validacionesService.isValid(this.personaForm, field);
  }

  /**
   * Verifica si el campo `gafete` es válido.
   * 
   * @returns `true` si el campo `gafete` tiene errores y ha sido tocado, `false` en caso contrario.
   */
  get gafeteIsValid(): boolean | null {
    return this.gafete.errors && this.gafete.touched;
  }

  /**
   * Busca información de una persona por su gafete.
   * 
   * Si no se proporciona un gafete o no se encuentran datos, muestra una alerta.
   */
  buscarGafete(): void {
    const GAFETE = this.gafete.value;

    if (!GAFETE) {
      this.notificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Información requerida',
        mensaje: 'No has proporcionado información que es requerida.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    if (!this.persona) {
      this.notificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: 'No encontrado',
        mensaje: 'No se encontraron datos con el número de gafete, intenta de nuevo o agrega los datos restantes.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.habilitarCamposFormulario();
    }
  }

  /**
   * Habilita todos los campos del formulario y les asigna validadores.
   */
  habilitarCamposFormulario(): void {
    Object.keys(this.personaForm.controls).forEach((campo) => {
      const CONTROL = this.personaForm.get(campo);
      CONTROL?.enable();
      CONTROL?.setValidators([Validators.required, Validators.maxLength(30)]);
      CONTROL?.updateValueAndValidity();
    });
  }

  /**
   * Deshabilita todos los campos del formulario.
   */
  deshabilitarCamposFormulario(): void {
    Object.keys(this.personaForm.controls).forEach((campo) => {
      const CONTROL = this.personaForm.get(campo);
      CONTROL?.disable();
    });
  }

  /**
   * Agrega una persona a la lista de personas.
   * 
   * Si el formulario o el campo `gafete` son inválidos, muestra una alerta y marca todos los campos como tocados.
   * Si ya hay 5 personas en la lista, muestra una alerta indicando que no se pueden agregar más personas.
   */
  agregarPersona(): void {
   this.gafete.setValidators([Validators.required, Validators.maxLength(25)]);
    this.gafete.updateValueAndValidity();

    if (this.gafete.invalid || this.personaForm.invalid) {
      this.notificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Campos obligatorios',
        mensaje: 'Debes capturar todos los datos marcados como obligatorios.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.gafete.markAllAsTouched();
      this.personaForm.markAllAsTouched();
      this.habilitarCamposFormulario();
      return;
    }

    if (this.personas.length >= 5) {
      this.notificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Límite alcanzado',
        mensaje: 'Solo puede agregar hasta 5 personas',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    const RESPONSABLE: Persona = {
      gafete: this.gafete.value,
      nombre: this.personaForm.get('nombre')?.value,
      primerApellido: this.personaForm.get('primerApellido')?.value,
      segundoApellido: this.personaForm.get('segundoApellido')?.value,
    };

    this.personas.push(RESPONSABLE);
    this.personaForm.reset({});
    this.deshabilitarCamposFormulario();
  }

  /**
   * Elimina una persona de la lista de personas.
   * 
   * @param i - El índice de la persona a eliminar.
   */
  eliminar(i: number): void {
    this.personas.splice(i, 1);
    //modal de confirmacion de elimincacion
  }
}