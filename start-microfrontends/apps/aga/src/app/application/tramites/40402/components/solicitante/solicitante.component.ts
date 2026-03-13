import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import mockData from '@libs/shared/theme/assets/json/40402/solicitante-mockdata.json';
/**
 * Componente para gestionar el formulario del solicitante.
 */
@Component({
  selector: 'app-solicitante',
  templateUrl: './solicitante.component.html',
  styleUrl: './solicitante.component.scss',
  standalone: true,
  imports: [TituloComponent, ReactiveFormsModule]
})
export class SolicitanteComponent implements OnInit,OnDestroy {
  /**
   * Marca todos los campos del formulario principal y del modal como tocados para mostrar errores.
   */
  public markAllAsTouched(): void {
    if (this.solicitudForm) {
      this.solicitudForm.markAllAsTouched();
    }
  }

  /**
   * Grupo de formulario para el formulario de solicitud.
   */
  solicitudForm!: FormGroup;

  /**
   * Constructor para inyectar las dependencias necesarias.
   * @param fb - Servicio FormBuilder para crear formularios reactivos.
   * @param cdr - ChangeDetectorRef para detectar cambios en la vista.
   */
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Inicializa el formulario `solicitudForm` con los campos necesarios.
   * @returns {void}
   */
  ngOnInit(): void {
    this.solicitudForm = this.fb.group({
      rfc: [''],
      denominacion: [''],
      actividadEconomica: [''],
      correoElectronico: [''],
      pais: [''],
      codigoPostal: [''],
      estado: [''],
      municipioOAlcadia: [''],
      localidad: [''],
      colonia: [''],
      calle: [''],
      numeroExterior: [''],
      numeroInterior: [''],
      lada: [''],
      telefono: [''],
    });
    this.setFormValues();
  }

  /**
   * Establece los valores del formulario `solicitudForm` utilizando datos simulados.
   * 
   * Este método llena los siguientes campos en el formulario:
   * - rfc: El RFC (Registro Federal de Contribuyentes).
   * - denominacion: La denominación o razón social.
   * - actividadEconomica: La actividad económica.
   * - correoElectronico: La dirección de correo electrónico.
   * 
   * @remarks
   * Este método asume que `mockData` contiene los campos necesarios
   * y que `solicitudForm` está correctamente inicializado.
   */
  setFormValues(): void {
    this.solicitudForm.get('rfc')?.setValue(mockData?.rfc);
    this.solicitudForm.get('denominacion')?.setValue(mockData?.denominacion);
    this.solicitudForm.get('actividadEconomica')?.setValue(mockData?.actividadEconomica);
    this.solicitudForm.get('correoElectronico')?.setValue(mockData?.correoElectronico);
    this.solicitudForm.get('pais')?.setValue(mockData?.pais);
    this.solicitudForm.get('codigoPostal')?.setValue(mockData?.codigoPostal);
    this.solicitudForm.get('estado')?.setValue(mockData?.estado);
    this.solicitudForm.get('municipioOAlcadia')?.setValue(mockData?.municipioOAlcadia);
    this.solicitudForm.get('localidad')?.setValue(mockData?.municipioOAlcadia);
    this.solicitudForm.get('colonia')?.setValue(mockData?.denominacion);
    this.solicitudForm.get('calle')?.setValue(mockData?.calle);
    this.solicitudForm.get('numeroExterior')?.setValue(mockData?.numeroExterior);
    this.solicitudForm.get('numeroInterior')?.setValue(mockData?.numeroInterior);
    this.solicitudForm.get('lada')?.setValue(mockData?.lada);
    this.solicitudForm.get('telefono')?.setValue(mockData?.telefono);
  }

    /**
   * Muestra los errores del formulario principal marcando todos los campos como tocados.
   * 
   * Este método es útil para activar la visualización de errores de validación en el formulario.
   * Se asegura de que todos los campos del formulario principal sean marcados como tocados,
   * lo que desencadena la visualización de mensajes de error para los campos inválidos.
   * 
   * @returns {void}
   */
  public mostrarErrores(): void {
  this.solicitudForm?.markAllAsTouched?.();
  this.cdr.detectChanges();
  }

  /**
   * Método que se ejecuta al destruir el componente.
   *
   * Limpia y reinicia el formulario de solicitud para evitar retención de datos en memoria.
   * Es útil para liberar recursos y asegurar que el formulario no conserve valores previos al destruir el componente.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    if (this.solicitudForm) {
      this.solicitudForm.reset();
    }
  }
}