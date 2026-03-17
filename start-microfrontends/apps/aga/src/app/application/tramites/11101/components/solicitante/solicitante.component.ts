import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import mockData from '@libs/shared/theme/assets/json/11101/solicitante-mockdata.json';

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
export class SolicitanteComponent implements OnInit {

  /**
   * Grupo de formulario para capturar los datos del solicitante.
   * @type {FormGroup}
   */
  solicitudForm!: FormGroup;

  /**
   * Constructor para inyectar las dependencias necesarias.
   * @param {FormBuilder} fb - Servicio FormBuilder para crear formularios reactivos.
   */
  constructor(private fb: FormBuilder) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario reactivo `solicitudForm` con los campos necesarios.
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
   * - `rfc`: El RFC (Registro Federal de Contribuyentes).
   * - `denominacion`: La denominación o razón social.
   * - `actividadEconomica`: La actividad económica.
   * - `correoElectronico`: La dirección de correo electrónico.
   * - `pais`: El país del solicitante.
   * - `codigoPostal`: El código postal.
   * - `estado`: El estado o entidad federativa.
   * - `municipioOAlcadia`: El municipio o alcaldía.
   * - `localidad`: La localidad.
   * - `colonia`: La colonia.
   * - `calle`: La calle.
   * - `numeroExterior`: El número exterior.
   * - `numeroInterior`: El número interior.
   * - `lada`: La lada telefónica.
   * - `telefono`: El número de teléfono.
   * 
   * @remarks
   * Este método asume que `mockData` contiene los campos necesarios
   * y que `solicitudForm` está correctamente inicializado.
   * @returns {void}
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
}