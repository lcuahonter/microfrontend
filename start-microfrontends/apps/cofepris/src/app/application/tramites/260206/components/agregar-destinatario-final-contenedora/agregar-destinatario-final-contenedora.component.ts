import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite260206State, Tramite260206Store } from '../../estados/stores/tramite260206Store.store';
import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { Destinatario } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260206Query } from '../../estados/queries/tramite260206Query.query';

/**
 * @class AgregarDestinatarioFinalContenedoraComponent
 * @description
 * Componente contenedor responsable de gestionar la funcionalidad de agregar destinatarios finales
 * en el trámite 260206. Este componente actúa como intermediario entre la interfaz de usuario y
 * el estado del trámite, facilitando la comunicación bidireccional de datos relacionados con
 * los destinatarios finales.
 * 
 * El componente implementa las interfaces OnInit y OnDestroy para gestionar apropiadamente
 * el ciclo de vida y la limpieza de recursos, especialmente las suscripciones a observables.
 * 
 * @implements {OnInit} - Interfaz para la inicialización del componente
 * @implements {OnDestroy} - Interfaz para la destrucción y limpieza de recursos del componente
 */
@Component({
  selector: 'app-agregar-destinatario-final-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarDestinatarioFinalComponent],
  templateUrl: './agregar-destinatario-final-contenedora.component.html',
  styleUrl: './agregar-destinatario-final-contenedora.component.scss',
})
export class AgregarDestinatarioFinalContenedoraComponent implements OnInit, OnDestroy {
  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Observable tipo Subject utilizado para implementar el patrón de cancelación de suscripciones.
   * Emite una señal cuando el componente está siendo destruido, permitiendo que todas las
   * suscripciones activas se cancelen automáticamente para prevenir memory leaks.
   * 
   * Este observable se utiliza con el operador takeUntil() para gestionar el ciclo de vida
   * de las suscripciones de manera eficiente y segura.
   * 
   * @private
   * @readonly
   * @type {Subject<void>}
   * @memberof AgregarDestinatarioFinalContenedoraComponent
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Tramite260206State} tramiteState
   * @description
   * Propiedad que almacena el estado completo del trámite 260206. Contiene toda la información
   * relevante del trámite incluyendo datos de mercancías, destinatarios, remitentes y demás
   * información necesaria para el procesamiento del trámite.
   * 
   * Esta propiedad se actualiza automáticamente mediante la suscripción al query del trámite
   * y sirve como fuente de datos local para el componente.
   * 
   * @public
   * @type {Tramite260206State}
   * @memberof AgregarDestinatarioFinalContenedoraComponent
   */
  public tramiteState!: Tramite260206State; 

  /**
   * @constructor
   * @description
   * Constructor del componente que inyecta las dependencias necesarias para el funcionamiento
   * del componente. Recibe el store del trámite y el query para gestionar el estado y las
   * consultas relacionadas con el trámite 260206.
   * 
   * @param {Tramite260206Store} tramiteStore - Servicio de almacén de estado que gestiona
   *        todas las operaciones de estado del trámite 260206, incluyendo actualizaciones
   *        de destinatarios finales y otras entidades relacionadas.
   * @param {Tramite260206Query} tramite260206Query - Servicio de consultas que proporciona
   *        acceso a los datos del estado del trámite mediante observables, permitiendo
   *        reactividad en la interfaz de usuario.
   * 
   * @memberof AgregarDestinatarioFinalContenedoraComponent
   */
  constructor(public tramiteStore: Tramite260206Store,
    public tramite260206Query: Tramite260206Query) {}

    /**
   * @method ngOnInit
   * @description
   * Hook del ciclo de vida de Angular que se ejecuta una vez que el componente ha sido
   * inicializado y sus propiedades de entrada han sido establecidas. En este método se
   * configura la suscripción al estado del trámite para mantener sincronizada la información
   * local del componente.
   * 
   * La suscripción utiliza el patrón takeUntil() con destroyNotifier$ para asegurar que
   * se cancele automáticamente cuando el componente sea destruido, previniendo memory leaks.
   * 
   * @implements {OnInit.ngOnInit}
   * @returns {void}
   * @memberof AgregarDestinatarioFinalContenedoraComponent
   */
    ngOnInit(): void {
      this.tramite260206Query.selectTramiteState$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.tramiteState = seccionState;
          })
        )
        .subscribe();
    }

  /**
   * @method updateDestinatarioFinalTablaDatos
   * @description
   * Método público que actualiza la tabla de datos de destinatarios finales en el estado
   * del trámite. Este método actúa como un puente entre el componente hijo
   * (AgregarDestinatarioFinalComponent) y el store del trámite.
   * 
   * Cuando el usuario realiza cambios en la lista de destinatarios finales desde la
   * interfaz de usuario, este método se encarga de propagar esos cambios al estado
   * global del trámite para mantener la consistencia de los datos.
   * 
   * @param {Destinatario[]} event - Array de objetos tipo Destinatario que contiene
   *        la lista actualizada de destinatarios finales. Cada objeto incluye
   *        información completa del destinatario como identificación, nombre,
   *        dirección y demás datos relevantes.
   * 
   * @returns {void}
   * @public
   * @memberof AgregarDestinatarioFinalContenedoraComponent
   * 
   * @example
   * ```typescript
   * const nuevosDestinatarios: Destinatario[] = [
   *   { id: '123', nombre: 'Juan Pérez', rfc: 'JUPE123456789' },
   *   { id: '456', nombre: 'María García', rfc: 'MAGA654321987' }
   * ];
   * this.updateDestinatarioFinalTablaDatos(nuevosDestinatarios);
   * ```
   */
  updateDestinatarioFinalTablaDatos(event: Destinatario[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
  }

  /**
   * @method ngOnDestroy
   * @description
   * Hook del ciclo de vida de Angular que se ejecuta inmediatamente antes de que el
   * componente sea destruido. Este método es crucial para la gestión de memoria y
   * prevención de memory leaks en la aplicación.
   * 
   * Se encarga de completar el Subject destroyNotifier$ que actúa como señal para
   * cancelar todas las suscripciones activas del componente. Primero emite un valor
   * mediante next() para notificar a todas las suscripciones que deben cancelarse,
   * y luego completa el observable con complete() para liberar todos los recursos.
   * 
   * @implements {OnDestroy.ngOnDestroy}
   * @returns {void}
   * @public
   * @memberof AgregarDestinatarioFinalContenedoraComponent
   * 
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
