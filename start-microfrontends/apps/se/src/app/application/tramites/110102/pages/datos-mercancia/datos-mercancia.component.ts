/**
 * datos-mercancia.component.ts
 */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map,takeUntil } from 'rxjs';
import { Tramite110102State } from '../../estados/store/tramite110102.store';

import { ComercializadoresProductosResponse } from '../../models/response/comercializadores-productos-response.model';
import { DatosDeLaMercanciaComponent } from '../../components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { ExportadorAutorizadoService } from '../../service/exportador-autorizado.service';
import { RepresentacionFederalComponent } from '../../components/representacion-federal/representacion-federal.component';
import { Tramite110102Query } from '../../estados/queries/tramite110102.query';

/**
 * Este componente representa la sección de datos de la mercancía.
 * Gestiona la interacción con el estado global y la obtención de datos del servidor.
 */
@Component({
  selector: 'app-datos-mercancia',
  templateUrl: './datos-mercancia.component.html',
  standalone: false, // Indica que este componente no es un componente independiente (standalone).
})
export class DatosMercanciaComponent implements OnInit, OnDestroy {

  /**
   * Evento emitido al cambiar de pestaña.
   * @event tabChanged
   * @type {EventEmitter<number>}
   */
  @Output() tabChanged = new EventEmitter<number>();

  /**
   * @property Mercancia - Referencia al componente `DatosDeLaMercanciaComponent` encargado de manejar
   *                      la lógica y validación relacionada con la mercancia del trámite.
   * @command El decorador `@ViewChild` permite acceder al componente hijo para interactuar con sus métodos y propiedades.
   */
  @ViewChild('mercanciaRef', { static: false }) mercanciaView!: DatosDeLaMercanciaComponent;

  /**
   * @property Mercancia - Referencia al componente `RepresentacionFederalComponent` encargado de manejar
   *                      la lógica y validación relacionada con representacion del trámite.
   * @command El decorador `@ViewChild` permite acceder al componente hijo para interactuar con sus métodos y propiedades.
   */
  @ViewChild('representacionRef', { static: false }) representacionView!: RepresentacionFederalComponent;

  /**
   * Indica si los datos de respuesta del servidor están disponibles.
   */
  public datosRespuestaDisponibles: boolean = false;

  /**
   * Subject para notificar la destrucción del componente y desuscribirse de observables.
   */
  private notificadorDestruccion$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta.
   */
  public estadoConsulta!: ConsultaioState;

  /**
   * Representa el estado actual del solicitante para el trámite 110102.
   * Esta propiedad contiene toda la información relevante y el estado del solicitante.
  */
  public solicitudeState!: Tramite110102State;

  /**
   * Índice de la pestaña actualmente seleccionada.
   * Inicializado a 1 por defecto.
   */
  public indicePestana: number = 1;

  /* Valor del RFC obtenido del estado de login.*/
  @Input() rfcValor!: string;

  /** Mercancía del comercializador de productos. */
  mercancia!: ComercializadoresProductosResponse;

  /** Indica si la vista actual es para autorizar dictamen. */
  esAutorizarDictamen: boolean = false;

  /**
   * Constructor del componente.
   * @param {ExportadorAutorizadoService} servicioExportador - Servicio para gestionar datos de exportadores autorizados.
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado de la consulta.
   */
  constructor(
    private servicioExportador: ExportadorAutorizadoService,
    private consultaQuery: ConsultaioQuery,
     private tramiteQuery: Tramite110102Query
  ) {
    this.tramiteQuery.selectTramite110102$.pipe(takeUntil(this.notificadorDestruccion$), map((seccionState) => {
      this.solicitudeState = seccionState;
    })).subscribe();
  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Configura las suscripciones necesarias y verifica si se deben obtener datos del servidor.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((estadoSeccion) => {
        this.estadoConsulta = estadoSeccion;
         this.esAutorizarDictamen = this.estadoConsulta?.parameter === 'AutorizarDictamen';
      });

    if (this.estadoConsulta.update) {
      this.obtenerDatosBandejaSolicitudes();
    } else {
      this.datosRespuestaDisponibles = true;
    }
  }

  /**
   * Obtiene los datos de la bandeja de solicitudes desde el servidor.
   */
  obtenerDatosBandejaSolicitudes(): void {
    this.servicioExportador.obtenerRegistro()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((respuesta: Tramite110102State) => {
        if (respuesta) {
          this.datosRespuestaDisponibles = true;
          this.servicioExportador.actualizarRegistro(respuesta);
        }
      });
  }

  /**
   * Recibe la mercancía del comercializador de productos.
   * @param {ComercializadoresProductosResponse} event - La mercancía recibida.
  */ 
  recibirMercancia(event: ComercializadoresProductosResponse): void {
   this.mercancia = event;
  }

  /**
   * Selecciona una pestaña específica.
   * @param {number} indice - El índice de la pestaña a seleccionar.
   */
  seleccionarPestana(indice: number): void {
    this.indicePestana = indice;
    this.tabChanged.emit(indice);
  }

  /**
 * @description Valida los formularios de los componentes hijos según la pestaña (tab) actual del trámite.
 * Evalúa la validez de los formularios de `tratados` y `mercancia`, y realiza la navegación al siguiente paso
 * si las validaciones son correctas. Si algún formulario es inválido, marca los campos correspondientes
 * y mantiene la pestaña actual.
 * @method validarFormularios
 * @returns {boolean | undefined} Retorna `true` si el formulario actual es válido, `false` si es inválido,
 * y `undefined` si el componente aún no está cargado.
 */
public validarFormularios(): boolean | undefined{
  switch (this.indicePestana) {
     case 1:
      return this.validarTabSolicitante();
    case 2:
      return this.validarDatosMercancia();
    default:
      return false;
  }
}

/**
 * @method validarTabSolicitante
 * @description
 * Valida el contenido del tab de **Solicitante** y, al ser siempre válido, avanza automáticamente al siguiente tab.
 * @returns {boolean} Retorna `true` indicando que el tab es válido.
 */
  private validarTabSolicitante(): boolean {
    this.seleccionarPestana(2);
    return true;
  }

/**
 * @method validarDatosMercancia
 * @description
 * Valida ambos formularios del tab de **Mercancía** y **Representación**.
 * Ejecuta ambas validaciones aunque uno de los componentes aún no esté disponible.
 * @returns {boolean | undefined} 
 *  - `true` si ambos formularios son válidos  
 *  - `false` si alguno es inválido  
 *  - `undefined` si faltan componentes requeridos
 */
private validarDatosMercancia(): boolean | undefined {
  let esValidoMercancia: boolean | undefined = undefined;
  let esValidoRepresentacion: boolean | undefined = undefined;

  // Validación de mercancia
  if (this.mercanciaView?.validarFormularioMercancia) {
    esValidoMercancia = this.mercanciaView.validarFormularioMercancia();
  }

  // Validación de representación
  if (this.representacionView?.validarFormulario) {
    esValidoRepresentacion = this.representacionView.validarFormulario();
  }

  // Si faltarón componentes, retornar undefined
  if (esValidoMercancia === undefined || esValidoRepresentacion === undefined) {
    return undefined;
  }

  // Si mercancia es inválido
  if (!esValidoMercancia) {
    this.seleccionarPestana(2);
    return false;
  }

  // Si representación es inválida
  if (!esValidoRepresentacion) {
    this.seleccionarPestana(2);
    return false;
  }

  return true;
}


  /**
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject `notificadorDestruccion$` para desuscribirse de todos los observables.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}