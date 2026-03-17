import {
  BtnContinuarComponent,
  Catalogo,
  CatalogoSelectComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud80316State, Tramite80316Store } from '../../estados/tramite80316.store';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite80316Query } from '../../estados/tramite80316.query';

/**
 * Componente `TipoDePersonaComponent` utilizado para gestionar y mostrar los datos relacionados con el tipo de persona.
 * Este componente es independiente (standalone) y utiliza formularios reactivos, catálogos y navegación.
 */
@Component({
  selector: 'app-tipo-de-persona',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    BtnContinuarComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './tipo-de-persona.component.html',
  styleUrl: './tipo-de-persona.component.scss',
})
export class TipoDePersonaComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para gestionar los datos del tipo de persona.
   * Contiene los campos necesarios para capturar el tipo de persona y el RFC del importador/exportador.
   * 
   * @type {FormGroup}
   */
  tipoDePersonaForm!: FormGroup;

  /**
   * Observable para notificar la destrucción del componente.
   * Se utiliza para cancelar suscripciones activas y evitar fugas de memoria.
   * 
   * @type {Subject<void>}
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual del trámite.
   * Contiene los datos relacionados con el tipo de persona.
   * 
   * @type {Solicitud80316State}
   */
  public derechoState: Solicitud80316State = {} as Solicitud80316State;

  /**
   * Catálogo de tipos de persona.
   * Contiene las opciones disponibles para seleccionar un tipo de persona.
   * 
   * @type {Catalogo[]}
   */
  tipoDePersona!: Catalogo[];

  /**
   * Constructor del componente `TipoDePersonaComponent`.
   * Inicializa los servicios necesarios para gestionar el estado del trámite, los datos del tipo de persona y la navegación.
   * 
   * @param {SolicitudService} solicitudService - Servicio para gestionar las solicitudes.
   * @param {Router} router - Servicio para gestionar la navegación entre rutas.
   * @param {FormBuilder} fb - Servicio para crear formularios reactivos.
   * @param {Tramite80316Store} tramite80316Store - Store para gestionar el estado del trámite.
   * @param {Tramite80316Query} tramite80316Query - Query para consultar el estado del trámite.
   */
  constructor(
    public solicitudService: SolicitudService,
    private router: Router,
    private fb: FormBuilder,
    private tramite80316Store: Tramite80316Store,
    private tramite80316Query: Tramite80316Query
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario, carga los datos del tipo de persona y los catálogos necesarios.
   */
  ngOnInit(): void {
    this.tramite80316Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.derechoState = {
            ...this.derechoState,
            ...seccionState,
          };
        })
      )
      .subscribe();
    this.inicializarFormulario();
    this.inicializaCatalogos();
  }

  /**
   * Inicializa el formulario reactivo con los valores actuales del estado.
   */
  inicializarFormulario(): void {
    this.tipoDePersonaForm = this.fb.group({
      tipoDePersona: [this.derechoState?.tipoDePersona, Validators.required],
      RFCImpExp: [this.derechoState?.RFCImpExp, Validators.required]
    });
  }

  /**
   * Método que registra la modificación del tipo de persona.
   * Si el formulario es válido, redirige a la ruta de registro de modificación.
   * Si no es válido, marca todos los campos como tocados para mostrar los errores.
   */
  registroModificacion(): void {
    const CURRENT_URL = this.router.url;
    if (this.tipoDePersonaForm.invalid) {
      this.tipoDePersonaForm.markAllAsTouched();
    } else {
      if (CURRENT_URL.includes('se')) {
        this.router.navigate(['/se/modificaciones-immex/registro-modificacion']);
      }
      if (CURRENT_URL.includes('pago')) {
        this.router.navigate(['/pago/modificaciones-immex/registro-modificacion']);
      }
    }
  }

  /**
   * Inicializa los catálogos necesarios para el formulario.
   * Carga los datos del catálogo de tipos de persona desde el servicio.
   */
  private inicializaCatalogos(): void {
    const TIPO_DE_PERSONA$ = this.solicitudService.getTipoDePersona().pipe(
      map((resp) => {
        this.tipoDePersona = resp.data;
      })
    );

    merge(
      TIPO_DE_PERSONA$
    )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe();
  }

  /**
   * Método que se ejecuta cuando se selecciona un tipo de persona.
   * Actualiza el estado del trámite con el tipo de persona seleccionado.
   */
  tipoDePersonaSeleccion(): void {
    const TIPO_DE_PERSONA = this.tipoDePersonaForm.get('tipoDePersona')?.value;
    this.tramite80316Store.setActividadProductiva(TIPO_DE_PERSONA);
  }

  /**
   * Establece valores en el store del trámite.
   * 
   * @param {FormGroup} form - Formulario reactivo.
   * @param {string} campo - Nombre del campo en el formulario.
   * @param {keyof Tramite80316Store} metodoNombre - Nombre del método en el store.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite80316Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite80316Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.unsubscribe(); // Cancela cualquier suscripción activa.
  }
}
