/**
 * datos-retorno-autorizacion.component.ts
 * Componente que gestiona los datos de retorno de autorización para el trámite 630303.
 * Permite inicializar formularios, obtener datos de catálogos y manejar el estado del formulario.
 */


import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ModeloDeFormaDinamica } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Tramite630303State, Tramite630303Store } from '../../estados/tramite630303.store';
import { CommonModule } from '@angular/common';
import { FORMULARIO_DATOS_AUTORIZACION } from '../../enum/retorno-importacion-temporal.enum';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';
import { Tramite630303Query } from '../../estados/tramite630303.query';
/**
 * Componente que gestiona los datos de retorno de autorización para el trámite 630303.
 * Permite inicializar formularios, obtener datos de catálogos y manejar el estado del formulario.
 */
@Component({
  selector: 'app-datos-retorno-autorizacion',
  standalone: true,
  imports: [
    CommonModule,
    FormasDinamicasComponent
  ],
  templateUrl: './datos-retorno-autorizacion.component.html',
  styleUrl: './datos-retorno-autorizacion.component.scss',
})
export class DatosRetornoAutorizacionComponent implements OnInit, OnDestroy {

  /**
   * Indica si el formulario está en modo solo lectura.
   */
  esSoloLectura!: boolean;
  /**
   * Formulario dinámico para gestionar los datos de autorización.
   */
  formularioDatosAutorizacion: ModeloDeFormaDinamica[] = FORMULARIO_DATOS_AUTORIZACION;

  /**
   * Estado seleccionado del trámite 630303.
   */
  estadoSeleccionado!: Tramite630303State;

  /**
   * Formulario reactivo para gestionar los datos de la autorización de retorno.
   */
  datosImportacionRetornoAutorizacionGeneralFormulario!: FormGroup;

  /**
   * Marca todos los controles del formulario como tocados para mostrar errores de validación.
   */
  public marcarTodosLosControlesComoTocados(): void {
    if (this.datosImportacionRetornoAutorizacionGeneralFormulario) {
      Object.keys(this.datosImportacionRetornoAutorizacionGeneralFormulario.controls).forEach(controlName => {
        const CONTROL = this.datosImportacionRetornoAutorizacionGeneralFormulario.get(controlName);
        if (CONTROL) {
          CONTROL.markAsTouched({ onlySelf: true });
        }
      });
    }
  }

  /**
   * Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

   /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Tramite630303State;

  /**
   * Constructor del componente.
   * Inicializa las dependencias necesarias y crea el formulario reactivo base para 
   * la gestión de datos de retorno de autorización.
   * 
   * @param fb - Constructor de formularios reactivos de Angular para crear y manejar formularios.
   * @param retornoImportacionTemporalService - Servicio para obtener datos de catálogos relacionados con importación temporal.
   * @param tramite630303Store - Store para actualizar y mantener el estado del trámite 630303.
   * @param tramite630303Query - Query para observar y consultar el estado del trámite 630303.
   * @param consultaioQuery - Query para obtener el estado de consulta y determinar el modo de solo lectura.
   * @memberof DatosRetornoAutorizacionComponent
   */
  constructor(
    private fb: FormBuilder,
    private retornoImportacionTemporalService: RetornoImportacionTemporalService,
    private tramite630303Store: Tramite630303Store,
    private tramite630303Query: Tramite630303Query,
    private consultaioQuery: ConsultaioQuery,
  ) {
     this.datosImportacionRetornoAutorizacionGeneralFormulario = this.fb.group({
    });
  }

  /**
   * Guarda los datos del formulario y ajusta el estado de solo lectura.
   * Deshabilita o habilita los campos según corresponda.
   */
  guardarDatosFormulario(): void {
    if (!this.datosImportacionRetornoAutorizacionGeneralFormulario) {
      return;
    }
    
    if (this.esSoloLectura) {
      this.datosImportacionRetornoAutorizacionGeneralFormulario.disable();
    } else {
      this.datosImportacionRetornoAutorizacionGeneralFormulario.enable();
    }
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa el formulario y obtiene datos de catálogos.
   */
  ngOnInit(): void {
    this.getValorStore();
    this.obtenerEstadoValor();
    this.getAduanaDeIngreso();
    this.getSeccionAduanera();
  }

  /**
   * Obtiene y observa el estado de consulta para determinar el modo de solo lectura del formulario.
   * Se suscribe al observable del estado de consulta y actualiza la propiedad esSoloLectura
   * según el valor de la propiedad readonly del estado. Automáticamente aplica los cambios
   * al formulario de datos de retorno de autorización mediante el método guardarDatosFormulario.
   * 
   * @description Este método establece la reactividad del componente al estado de consulta,
   * permitiendo que el formulario de autorización se adapte dinámicamente entre modo edición 
   * y solo lectura según las condiciones del trámite de retorno de importación temporal.
   * @returns {void}
   * @memberof DatosRetornoAutorizacionComponent
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
   * Obtiene las opciones de aduanas de ingreso desde el servicio.
   */
  getAduanaDeIngreso(): void {
    this.retornoImportacionTemporalService.getAduanaDeIngreso()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const ADUANA_DE_INGRESO = this.formularioDatosAutorizacion.find((item) => item.id === 'aduanaDeIngreso');
        if (ADUANA_DE_INGRESO) {
          ADUANA_DE_INGRESO.opciones = data;
        }
      });
  }

  /**
   * Obtiene las opciones de secciones aduaneras desde el servicio.
   */
  getSeccionAduanera(): void {
    this.retornoImportacionTemporalService.getSeccionAduanera()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const SECCION_ADUANERA = this.formularioDatosAutorizacion.find((item) => item.id === 'seccionAduanera');
        if (SECCION_ADUANERA) {
          SECCION_ADUANERA.opciones = data;
        }
      });
  }

  /**
   * Actualiza un valor específico en el store del trámite.
   * 
   * @param $event - Evento que contiene el campo y el valor a actualizar.
   */
  establecerCambioDeValor($event: { campo: string; valor: unknown }): void {
    if (!$event || typeof $event !== 'object' || !$event.campo) {
      return;
    }

    if (typeof $event.valor === 'object' && $event.valor !== null && 'id' in $event.valor) {
      this.tramite630303Store.setTramite630303State($event.campo, ($event.valor as { id: unknown }).id);
    } else {
      this.tramite630303Store.setTramite630303State($event.campo, $event.valor);
    }
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
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}