import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Solicitud32505State,
  Tramite32505Store,
} from '../../../../estados/tramites/trimite32505.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AvisoService } from '../../services/aviso.service';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite32505Query } from '../../../../estados/queries/tramite32505.query';

/**
 * Componente para gestionar el formulario del solicitante.
 * 
 * Este componente permite al usuario visualizar y gestionar los datos generales del solicitante,
 * incluyendo información personal, dirección fiscal y datos de contacto.
 */
@Component({
  selector: 'app-solicitante',
  templateUrl: './solicitante.component.html',
  styleUrl: './solicitante.component.scss',
  standalone: true,
  imports: [TituloComponent, FormsModule, ReactiveFormsModule]
})
export class SolicitanteComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para gestionar los datos del solicitante.
   */
  solicitudForm!: FormGroup;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual del trámite 32503.
   * 
   * Contiene toda la información relacionada con el estado del trámite.
   */
  public tramiteState!: Solicitud32505State;

  /**
   * Evento para emitir cuando se desea continuar al siguiente paso.
   */
  @Output() continuarEvento = new EventEmitter<string>();

  /**
   * Constructor del componente.
   * 
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Tramite32503Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite32503Query} tramiteQuery - Query para obtener el estado del trámite.
   * @param {AvisoTrasladoService} avisoTrasladoService - Servicio para obtener datos relacionados con el solicitante.
   */
  constructor(
    public fb: FormBuilder,
    public store: Tramite32505Store,
    public tramiteQuery: Tramite32505Query,
    private avisoService: AvisoService,
  
  ) { 
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Este método suscribe al estado del trámite, carga los datos del solicitante
   * y configura el formulario reactivo.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
    this.cargarDatosSolicitante();
    this.inicializarFormulario();
  }

  /**
   * Inicializa el formulario con los datos del solicitante.
   */
  inicializarFormulario(): void {
    this.solicitudForm = this.fb.group({
      rfc: [this.tramiteState?.datosSolicitante?.rfc],
      denominacion: [this.tramiteState?.datosSolicitante?.denominacion],
      actividadEconomica: [this.tramiteState?.datosSolicitante?.actividadEconomica],
      correoElectronico: [this.tramiteState?.datosSolicitante?.correoElectronico],
      pais: [this.tramiteState?.datosSolicitante?.pais],
      codigoPostal: [this.tramiteState?.datosSolicitante?.codigoPostal],
      entidadFederativa: [this.tramiteState?.datosSolicitante?.entidadFederativa],
      municipio: [this.tramiteState?.datosSolicitante?.municipio],
      localidad: [this.tramiteState?.datosSolicitante?.localidad],
      colonia: [this.tramiteState?.datosSolicitante?.colonia],
      calle: [this.tramiteState?.datosSolicitante?.calle],
      nExt: [this.tramiteState?.datosSolicitante?.nExt],
      nInt: [this.tramiteState?.datosSolicitante?.nInt],
      lada: [this.tramiteState?.datosSolicitante?.lada],
      telefono: [this.tramiteState?.datosSolicitante?.telefono],
      adace: [this.tramiteState?.datosSolicitante?.adace],
    });
  }

  /**
   * Carga los datos del solicitante desde el servicio y los almacena en el store.
   */
  cargarDatosSolicitante(): void {
    this.avisoService.obtenerDatosSolicitante().pipe(
      takeUntil(this.destroyNotifier$)).subscribe((datos) => {
        (this.store.setDatosSolicitante as (valor: unknown) => void)(datos);
        this.inicializarFormulario();
      });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * Libera los recursos y cancela las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}