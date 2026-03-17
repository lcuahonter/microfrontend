import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TituloComponent } from '@libs/shared/data-access-user/src';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
/**
 * @component SolicitanteComponent
 * @description
 * Este componente se encarga de gestionar los datos del formulario de solicitud. 
 * Proporciona métodos para inicializar el formulario y establecer valores predeterminados.
 * Este formulario incluye campos relacionados con datos personales y empresariales.
 *
 * @example
 * <app-solicitante></app-solicitante>
 */
@Component({
  selector: 'app-solicitante',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
  templateUrl: './solicitante.component.html',
  styleUrl: './solicitante.component.scss',
})
export class SolicitanteComponent implements OnInit {
  /**
   * @property {FormGroup} solicitudForm
   * @description
   * Este formulario reactivo almacena y gestiona los datos del solicitante.
   * Contiene campos deshabilitados que se rellenan con valores predeterminados.
   */
  public solicitudForm!: FormGroup;

  /**
   * @constructor
   * @description
   * Inicializa el componente y configura la estructura inicial del formulario.
   * @param {FormBuilder} fb - Proporciona métodos para crear y gestionar formularios.
   */
  constructor(private fb: FormBuilder) {
    this.establecerSolicitudForm();
  }

  /**
   * @lifecycle ngOnInit
   * @description
   * Hook del ciclo de vida que se ejecuta después de crear el componente.
   * Llama a un método para establecer los valores iniciales del formulario.
   */
  ngOnInit(): void {
    this.establecerValoresDeFormulario();
  }

  /**
   * @method establecerSolicitudForm
   * @description
   * Define la estructura y los controles del formulario `solicitudForm`.
   * Todos los campos están deshabilitados inicialmente.
   */
  public establecerSolicitudForm(): void {
    this.solicitudForm = this.fb.group({
      rfc: [{ value: '', disabled: true },[Validators.required, Validators.maxLength(30)]],
      denominacion: [{ value: '', disabled: true },[Validators.required, Validators.maxLength(120)]],
      actividadEconomica: [{ value: '', disabled: true },[Validators.required, Validators.maxLength(120)]],
      correoElectronico: [{ value: '', disabled: true },[Validators.required, Validators.email, Validators.maxLength(30)]],
      pais: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(30)]],
      codigoPostal: [{ value: '', disabled: true },[Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      estado: [{ value: '', disabled: true },[Validators.required, Validators.maxLength(30)]],
      municipioAlcaldia: [{ value: '', disabled: true },[Validators.required, Validators.maxLength(30)]],
      localidad: [{ value: '', disabled: true },[Validators.required, Validators.maxLength(68)]],
      colonia: [{ value: '', disabled: true },[Validators.required, Validators.maxLength(68)]],
      calle: [{ value: '', disabled: true },[Validators.required, Validators.maxLength(68)]],
      numeroExterior: [{ value: '', disabled: true },[Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      numeroInterior: [{ value: '', disabled: true }, [Validators.maxLength(15)]],
      lada: [{ value: '', disabled: true },[Validators.pattern('^[0-9]*$')]],
      telefono: [{ value: '', disabled: true },[Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(15)],],
    });
  }

  /**
   * @method establecerValoresDeFormulario
   * @description
   * Rellena los campos del formulario `solicitudForm` con valores predeterminados.
   * Estos valores simulan datos reales para los solicitantes.
   */
  public establecerValoresDeFormulario(): void {
    this.solicitudForm.get('rfc')?.setValue('AAL0409235E6');
    this.solicitudForm
      .get('denominacion')
      ?.setValue('INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV');
    this.solicitudForm
      .get('actividadEconomica')
      ?.setValue('Siembra, cultivo y cosecha de otros cultivos');
    this.solicitudForm
      .get('correoElectronico')
      ?.setValue('luz.arellano@sat.gob.mx');
    this.solicitudForm.get('pais')?.setValue('ESTADOS UNIDOS MEXICANOS');
    this.solicitudForm.get('codigoPostal')?.setValue('81210');
    this.solicitudForm.get('estado')?.setValue('SINALOA');
    this.solicitudForm.get('municipioAlcaldia')?.setValue('AHOME');
    this.solicitudForm.get('localidad')?.setValue('LOS MOCHIS');
    this.solicitudForm.get('colonia')?.setValue('MIGUEL HIDALGO');
    this.solicitudForm.get('calle')?.setValue('CAMINO VIEJO');
    this.solicitudForm.get('numeroExterior')?.setValue('1353');
  }
}
