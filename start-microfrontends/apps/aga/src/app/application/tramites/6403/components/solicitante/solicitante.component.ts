import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { RetornoDePartesService } from '../../services/retorno-de-partes.service';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite6403Query } from '../../estados/tramite6403.query';
import { Tramite6403State } from '../../estados/tramite6403.store';
import { Tramite6403Store } from '../../estados/tramite6403.store';

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
   * Estado actual del trámite 6403.
   * 
   * Contiene toda la información relacionada con el estado del trámite.
   */
  public tramiteState!: Tramite6403State;

  /**
   * Evento para emitir cuando se desea continuar al siguiente paso.
   */
  @Output() continuarEvento = new EventEmitter<string>();

  /**
   * Constructor del componente.
   * 
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Tramite6403Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite6403Query} tramiteQuery - Query para obtener el estado del trámite.
   * @param {AutorizacionImportacionService} autorizacionImportacionService - Servicio para obtener datos relacionados con el solicitante.
   */
  constructor(
    public fb: FormBuilder,
    public store: Tramite6403Store,
    public tramiteQuery: Tramite6403Query,
    public retornoDePartesService: RetornoDePartesService
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
    this.retornoDePartesService.obtenerDatosSolicitante().pipe(
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