import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitud80316State, Tramite80316Store } from '../../estados/tramite80316.store';
import { Subject,filter,take, takeUntil } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite80316Query } from '../../estados/tramite80316.query';

/**
 * Componente `DatosCertificacionComponent` utilizado para gestionar y mostrar los datos relacionados con la certificación.
 * Este componente es independiente (standalone) y utiliza formularios reactivos para manejar los datos.
 */
@Component({
  selector: 'app-datos-certificacion',
  templateUrl: './datos-certificacion.component.html',
  styleUrl: './datos-certificacion.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, TituloComponent],
})
export class DatosCertificacionComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para la certificación.
   * Este formulario contiene los campos relacionados con la certificación, como el estado de certificación,
   * la fecha de inicio y la fecha de vigencia.
   * 
   * @type {FormGroup}
   */
  certificionForm!: FormGroup;

   /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud80316State;

  /**
   * Notificador para limpiar suscripciones al destruir el componente.
   */
  private destroyNotifier$ = new Subject<void>();

   /**
   * Buscar ID de la solicitud
   * @type {string[]}
   */
  buscarIdSolicitud!: string[];
  /**
   * Constructor del componente `DatosCertificacionComponent`.
   * Inicializa el formulario reactivo `certificionForm` con valores predeterminados y deshabilitados.
   * 
   * @param {FormBuilder} fb - Instancia de `FormBuilder` utilizada para crear formularios reactivos.
   */
  constructor(private fb: FormBuilder, public solicitudService: SolicitudService, private tramite80316Store: Tramite80316Store
    , private tramite80316Query: Tramite80316Query
  ) {
     this.tramite80316Query.selectSolicitud$
          .pipe(
            takeUntil(this.destroyNotifier$),
            filter((solicitud) => Boolean(solicitud?.buscarIdSolicitud?.length)),
            take(1)
          )
          .subscribe((solicitud) => {
            this.buscarIdSolicitud = solicitud?.buscarIdSolicitud || [];
    
            if (this.buscarIdSolicitud.length > 0) {
            this.loadDatosCertificacion(solicitud.loginRfc);
            }
          });

  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario, carga los datos de modificación y los datos de la tabla.
   */
  ngOnInit(): void {
      this.certificionForm = this.fb.group({
      /**
       * Campo `certificion`:
       * Representa el estado de certificación. Por defecto, tiene el valor "Si" y está deshabilitado.
       */
      certificion: [{ value: this.solicitudState?.certificion, disabled: true }],

      /**
       * Campo `fechaInicio`:
       * Representa la fecha de inicio de la certificación. Por defecto, está vacío y deshabilitado.
       */
      fechaInicio: [{ value: this.solicitudState?.fechaInicio, disabled: true }],

      /**
       * Campo `fechaVigencia`:
       * Representa la fecha de vigencia de la certificación. Por defecto, está vacío y deshabilitado.
       */
      fechaVigencia: [{ value: this.solicitudState?.fechaVigencia, disabled: true }]
    });
      }
  
  /**
   * Método que obtiene los datos de certificación SAT desde el servicio.
   * Asigna el dato obtenido a la variable `certificacionSAT`.
   * @param rfc RFC para buscar los datos de certificación SAT.
   */
  loadDatosCertificacion(rfc: string): void {
    this.solicitudService
      .obtenerDatosCertificacionSAT(rfc)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {

         (this.tramite80316Store.setDatosCertificacion as (valor: unknown) => void)(respuesta);
        if (respuesta) {
          this.certificionForm.patchValue({
            certificion: respuesta.datos?.certificacionSAT || '',
          });
        }
        this.tramite80316Store.setCertificacionSAT(respuesta.datos?.certificacionSAT || '');
      });
  }
  
  /**
   * Limpia las suscripciones activas al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
  
}
