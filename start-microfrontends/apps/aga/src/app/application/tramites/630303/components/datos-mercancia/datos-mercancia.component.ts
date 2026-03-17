/**
 * Componente que gestiona los datos de la mercancía para el trámite 630303.
 * Permite inicializar formularios, obtener datos del estado y manejar el estado del formulario.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ModeloDeFormaDinamica } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Tramite630303State, Tramite630303Store } from '../../estados/tramite630303.store';
import { CommonModule } from '@angular/common';
import { FORMULARIO_DATOS_MERCANCIA } from '../../enum/retorno-importacion-temporal.enum';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { Tramite630303Query } from '../../estados/tramite630303.query';
/**
 * Componente que gestiona los datos de la mercancía para el trámite 630303.
 */
@Component({
  selector: 'app-datos-mercancia',
  standalone: true,
  imports: [CommonModule, FormasDinamicasComponent],
  templateUrl: './datos-mercancia.component.html',
  styleUrl: './datos-mercancia.component.scss',
})
export class DatosMercanciaComponent implements OnInit, OnDestroy {

   /**
   * Indica si el formulario está en modo solo lectura.
   */
  esSoloLectura!: boolean;

  /**
   * Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Estado seleccionado del trámite 630303.
   */
  estadoSeleccionado!: Tramite630303State;

  /**
   * Formulario reactivo para gestionar los datos de la mercancía.
   */
  datosMercancia!: FormGroup;

  /**
   * Formulario dinámico que define la estructura del formulario de datos de mercancía.
   */
  formularioDatosMercancia: ModeloDeFormaDinamica[] = FORMULARIO_DATOS_MERCANCIA;

   /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Tramite630303State;

  /**
   * Constructor del componente.
   * 
   * @param formBuilder - Constructor de formularios reactivos de Angular para crear y manejar formularios.
   * @param retornoImportacionTemporalService - Servicio para obtener datos de catálogos relacionados con importación temporal.
   * @param tramite630303Store - Store para actualizar y mantener el estado del trámite 630303.
   * @param tramite630303Query - Query para observar y consultar el estado del trámite 630303.
   * @param consultaioQuery - Query para obtener el estado de consulta y determinar el modo de solo lectura.
   */
  constructor(
    private formBuilder: FormBuilder,
    private tramite630303Store: Tramite630303Store,
    private tramite630303Query: Tramite630303Query,
    private consultaioQuery: ConsultaioQuery
  ) {
     this.datosMercancia = this.formBuilder.group({});
  }

   /**
   * Guarda los datos del formulario y ajusta el estado de solo lectura.
   * Deshabilita o habilita los campos según corresponda.
   */
  guardarDatosFormulario(): void {
    if (!this.datosMercancia) {
      return;
    }
    
    if (this.esSoloLectura) {
      this.datosMercancia.disable();
    } else {
      this.datosMercancia.enable();
    }
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa el formulario y obtiene el estado del trámite.
   */
  ngOnInit(): void {
    this.getValorStore();
    this.obtenerEstadoValor();
  }

  /**
   * Obtiene y observa el estado de consulta para determinar el modo de solo lectura del formulario.
   * Se suscribe al observable del estado de consulta y actualiza la propiedad esSoloLectura
   * según el valor de la propiedad readonly del estado. Automáticamente aplica los cambios
   * al formulario de datos de mercancía mediante el método guardarDatosFormulario.
   * 
   * @description Este método establece la reactividad del componente al estado de consulta,
   * permitiendo que el formulario de mercancía se adapte dinámicamente entre modo edición 
   * y solo lectura según las condiciones del trámite.
   * @returns {void}
   * @memberof DatosMercanciaComponent
   * @private
   */
  obtenerEstadoValor(): void {
   this.consultaioQuery.selectConsultaioState$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((estadoConsulta) => {
      this.esSoloLectura = estadoConsulta.readonly;
      this.guardarDatosFormulario()
    });
  }

  /**
   * Obtiene el estado actual del trámite desde el store.
   */
  getValorStore(): void {
    this.tramite630303Query.selectTramite630303State$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoSeleccionado = data;
      });
  }

  /**
   * Establece un cambio de valor en el store basado en un evento.
   * 
   * @param $event - Evento que contiene el campo y el valor a actualizar.
   */
  establecerCambioDeValor($event: { campo: string; valor: unknown }): void {
    if (!$event || typeof $event !== 'object' || !$event.campo) {
      return;
    }

    this.tramite630303Store.setTramite630303State($event.campo, $event.valor);
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}