import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponseSolicitante } from '../../models/registro-muestras-mercancias.model';
import { Tramite40101Query } from '../../estado/tramite40101.query';
import { Tramite40101Service } from '../../estado/tramite40101.service';
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
  solicitudForm!: FormGroup;

  /**
   * Datos del solicitante obtenidos del estado.
   */
  solicitudData = {} as ApiResponseSolicitante['datos'];

  /**
  * Subject para destruir las suscripciones y evitar fugas de memoria de los datos del solicitante.
  */
  private destroy$ = new Subject<void>();

  /**
   * Constructor para inyectar las dependencias necesarias.
   * @param fb - Servicio FormBuilder para crear formularios reactivos.
   */
  // eslint-deshabilitar-la-siguiente-línea-sin-función-vacía
  // eslint-disable-next-line no-empty-function
  constructor(private fb: FormBuilder, private modificarTerrestreService: modificarTerrestreService, private tramite40101Service: Tramite40101Service, private tramite40101Query: Tramite40101Query) { }

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
      this.tramite40101Service.updateSolicitante(data.datos);
    });

    this.tramite40101Query.solicitanteData$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.solicitudData = data;
      this.setFormValues();
    })
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}