import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponseSolicitante } from '../../models/registro-muestras-mercancias.model';
import { Chofer40103Store } from '../../estados/chofer40103.store';
import { modificarTerrestreService } from '../services/modificacar-terrestre.service';
/**
 * Componente para gestionar el formulario del solicitante.
 */
@Component({
  selector: 'app-solicitante',
  templateUrl: './solicitante.component.html',
  styleUrl: './solicitante.component.scss',
})
export class SolicitanteComponent implements OnInit, OnDestroy {
  /**
   * Grupo de formulario para el formulario de solicitud.
   */


  /**
  * Subject para destruir las suscripciones y evitar fugas de memoria de los datos del solicitante.
  */
  private destroy$ = new Subject<void>();


  solicitudForm!: FormGroup;
  /**
   * Datos del solicitante obtenidos del estado.
   */
  solicitudData = {} as ApiResponseSolicitante['datos'];

  /**
   * Constructor para inyectar las dependencias necesarias.
   * @param fb - Servicio FormBuilder para crear formularios reactivos.
   */
  constructor(private fb: FormBuilder, private modificarTerrestreService: modificarTerrestreService,private chofer40103Store: Chofer40103Store) { }

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
    this.modificarTerrestreService.obtenerDatosSolicitante().pipe(takeUntil(this.destroy$)).subscribe((data: ApiResponseSolicitante) => {
      if (data.datos) {
        (this.chofer40103Store['setNombre'] as (valor: unknown) => void)(data.datos?.director_general?.nombre);
        (this.chofer40103Store['setPrimerApellido'] as (valor: unknown) => void)(data.datos?.director_general?.primer_apellido);
        (this.chofer40103Store['setSegundoApellido'] as (valor: unknown) => void)(data.datos?.director_general?.segundo_apellido);
        (this.chofer40103Store['setIsShowDirector'] as (valor: unknown) => void)(data.datos?.mostrar_director_general);
        (this.chofer40103Store['setIsCaat'] as (valor: unknown) => void)(data.datos?.caat_existe);
        (this.chofer40103Store['setIdPersonaSolicitud'] as (valor: unknown) => void)(data.datos?.solicitante?.id_persona_solicitud);
      }
      (this.chofer40103Store['setCodigo'] as (valor: unknown) => void)(data.codigo);
      (this.chofer40103Store['setCatErrorMessage'] as (valor: unknown) => void)(data?.error);
      this.solicitudData = data.datos;
      this.setFormValues();
    });
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
    const RFC = this.solicitudForm.get('rfc');
    RFC?.setValue(this.solicitudData.solicitante?.rfc);
    this.solicitudForm.get('denominacion')?.setValue(this.solicitudData.solicitante?.razon_social);
    this.solicitudForm.get('actividadEconomica')?.setValue(this.solicitudData?.solicitante?.descripcion_giro);
    this.solicitudForm.get('correoElectronico')?.setValue(this.solicitudData?.solicitante?.correo_electronico);
    this.solicitudForm.get('pais')?.setValue(this.solicitudData?.solicitante?.domicilio?.pais);
    this.solicitudForm.get('codigoPostal')?.setValue(this.solicitudData?.solicitante?.domicilio?.codigo_postal);
    this.solicitudForm.get('estado')?.setValue(this.solicitudData?.solicitante?.domicilio.estado);
    this.solicitudForm.get('municipioOAlcadia')?.setValue(this.solicitudData?.solicitante?.domicilio.municipio);
    this.solicitudForm.get('localidad')?.setValue(this.solicitudData?.solicitante?.domicilio.localidad);
    this.solicitudForm.get('colonia')?.setValue(this.solicitudData?.solicitante?.domicilio.colonia);
    this.solicitudForm.get('calle')?.setValue(this.solicitudData?.solicitante?.domicilio.calle);
    this.solicitudForm.get('numeroExterior')?.setValue(this.solicitudData?.solicitante?.domicilio.numero_exterior);
    this.solicitudForm.get('numeroInterior')?.setValue(this.solicitudData?.solicitante?.domicilio.numero_interior);
    this.solicitudForm.get('telefono')?.setValue(this.solicitudData?.solicitante?.domicilio.telefono);
  }

  /**
   * Valida el formulario del solicitante.
   * @returns {boolean} true si el formulario es válido, false en caso contrario.
   */
  public validarFormularios(): boolean {
    if (!this.solicitudForm) {
      return false;
    }
    
    // Marcar todos los campos como tocados para mostrar errores
    this.solicitudForm.markAllAsTouched();
    
    // Verificar si el formulario es válido
    return this.solicitudForm.valid;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}