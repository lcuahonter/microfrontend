
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, InputFecha, ModeloDeFormaDinamica } from "@ng-mf/data-access-user";
import { ESTIMADA_RETORNO, FECHA_ESTIMADA_DE_INGRESO, FORMULARIO_FECHA_IMPORTACION } from '../../enums/retorno-importacion-temporal.enum';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from "rxjs";
import { Tramite630104State, Tramite630104Store } from '../../estados/tramites/tramite630104.store';
import { CommonModule } from '@angular/common';
import { EquipoEInstrumentosMusicalesService } from '../../services/equipo-e-instrumentos-musicales.service';
import { FormasDinamicasComponent } from "@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component";
import { TituloComponent } from '@ng-mf/data-access-user';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Tramite630104Query } from '../../estados/queries/tramite630104.query';

/**
 * Componente `FechaDeImportacionComponent`
 * Este componente gestiona la lógica y la interfaz de usuario para la sección de fecha de importación
 * en el trámite 630104. Permite inicializar un formulario dinámico, manejar eventos de cambio de valor
 * y suscribirse al estado del trámite.
 */
@Component({
  selector: 'app-fecha-de-importacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormasDinamicasComponent, TituloComponent, TooltipModule],
  templateUrl: './fecha-de-importacion.component.html',
  styleUrl: './fecha-de-importacion.component.scss',
})
export class FechaDeImportacionComponent implements OnInit, OnDestroy {

  /**
   * Modelo del formulario dinámico para la fecha de importación.
   */
  formularioFechaDeImportacion: ModeloDeFormaDinamica[] = FORMULARIO_FECHA_IMPORTACION;

  /**
   * Formulario reactivo para gestionar los datos de la fecha de importación temporal.
   */
  public forma: FormGroup = new FormGroup({
    FechaDeImportacionTemporalFormulario: new FormGroup({
     
    }),
  });

  /**
   * Datos de la fecha estimada de retorno.
   */
  datosfecha: InputFecha = ESTIMADA_RETORNO;

  /**
   * Datos de la fecha estimada de ingreso.
   */
  datosfechaLimite: InputFecha = FECHA_ESTIMADA_DE_INGRESO;

  /**
   * Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Estado seleccionado del trámite 630104.
   */
  estadoSeleccionado!: Tramite630104State;

  /**
   * Indica si el formulario está en modo solo lectura.
   */
  esSoloLectura!: boolean;

    /**
   * Estado actual de la consulta IO.
   */
  public consultaState!: ConsultaioState;

  /**
   * Constructor del componente.
   * @param fb - Servicio para construir formularios reactivos.
   * @param tramite630104Store - Servicio para gestionar el estado del trámite 630104.
   * @param tramite630104Query - Servicio para consultar el estado del trámite 630104.
    @param consultaioQuery - Servicio para consultar el estado de la consulta de entrada/salida.
    
  */
  constructor(
    private tramite630104Store: Tramite630104Store,
    private tramite630104Query: Tramite630104Query,
    private consultaioQuery: ConsultaioQuery,
    private service: EquipoEInstrumentosMusicalesService
  ) {
   this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida `OnInit`.
   * Se ejecuta al inicializar el componente. Obtiene el valor del estado del store
   * y configura el formulario reactivo.
   */
ngOnInit(): void {
  this.inicializarFormularioFechaImportacion();
}

inicializarFormularioFechaImportacion(): void {
  // Get current values from the store
  const STORE_STATE = this.tramite630104Store.getValue();

  const FECHA_INGRESO_PREDETERMINADA =
    (STORE_STATE['fechaIngreso'] as string) ||
    FORMULARIO_FECHA_IMPORTACION.find(f => f.campo === 'fechaIngreso')?.valorPredeterminado ||
    '';

  const FECHA_LIMITE_RETORNO_PREDETERMINADA =
    (STORE_STATE['fechaLimiteRetorno'] as string) ||
    FORMULARIO_FECHA_IMPORTACION.find(f => f.campo === 'fechaLimiteRetorno')?.valorPredeterminado ||
    '';

  this.forma = new FormGroup({
    FechaDeImportacionTemporalFormulario: new FormGroup({
      fechaIngreso: new FormControl(FECHA_INGRESO_PREDETERMINADA, Validators.required),
      fechaLimiteRetorno: new FormControl(
        { value: FECHA_LIMITE_RETORNO_PREDETERMINADA, disabled: true },
       
      ),
    }),
  });

  // Set initial values in the store if not already set
  if (!STORE_STATE['fechaIngreso']) {
    this.establecerCambioDeValor({ campo: 'fechaIngreso', valor: FECHA_INGRESO_PREDETERMINADA });
  }
  if (!STORE_STATE['fechaLimiteRetorno']) {
    this.establecerCambioDeValor({ campo: 'fechaLimiteRetorno', valor: FECHA_LIMITE_RETORNO_PREDETERMINADA });
  }
}

  get FechaDeImportacionTemporalFormulario(): FormGroup {
  return this.forma.get('FechaDeImportacionTemporalFormulario') as FormGroup;
}

  

  
  /**
   * Obtiene el valor del estado del store y lo asigna a `estadoSeleccionado`.
   */
  getValorStore(): void {
    this.tramite630104Query.selectTramite630104State$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoSeleccionado = data;
      });
  }

  /**
   * Establece un cambio de valor en el estado del trámite.
   * @param $event - Evento que contiene el campo y el valor a actualizar.
   */
establecerCambioDeValor(event: { campo: string; valor: object | string }): void {
  if (!event) { return; }

  let valorParaStore = event.valor;

  // Si el campo es fechaIngreso, normaliza el formato a DD/MM/YYYY
  if (event.campo === 'fechaIngreso') {
    let fechaLimite = '';
    let fechaIngresoFormateada = '';

    // Si es un objeto Date
    if (event.valor instanceof Date) {
      const DD = String(event.valor.getDate()).padStart(2, '0');
      const MM = String(event.valor.getMonth() + 1).padStart(2, '0');
      const YYYY = event.valor.getFullYear();
      fechaIngresoFormateada = `${DD}/${MM}/${YYYY}`;
    }
    // Si es string tipo YYYY-MM-DD
    else if (typeof event.valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(event.valor)) {
      const [YYYY, MM, DD] = event.valor.split('-');
      fechaIngresoFormateada = `${DD}/${MM}/${YYYY}`;
    }
    // Si es string tipo DD/MM/YYYY
    else if (typeof event.valor === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(event.valor)) {
      fechaIngresoFormateada = event.valor;
    }

    // Calcula fechaLimiteRetorno solo si hay fechaIngreso válida
    if (fechaIngresoFormateada) {
      const [DAY, MONTH, YEAR] = fechaIngresoFormateada.split('/');
      const FECHA = new Date(Number(YEAR), Number(MONTH) - 1, Number(DAY));
      if (!isNaN(FECHA.getTime())) {
        FECHA.setMonth(FECHA.getMonth() + 1);
        const DD = String(FECHA.getDate()).padStart(2, '0');
        const MM = String(FECHA.getMonth() + 1).padStart(2, '0');
        const YYYY = FECHA.getFullYear();
        fechaLimite = `${DD}/${MM}/${YYYY}`;
      }
      // Actualiza el control y el store
      this.FechaDeImportacionTemporalFormulario.get('fechaLimiteRetorno')?.setValue(fechaLimite, { emitEvent: false });
      this.tramite630104Store.setTramite630104State('fechaLimiteRetorno', fechaLimite);
    }

    // Actualiza el valor para el store con el formato correcto
    valorParaStore = fechaIngresoFormateada;
  }

  // Siempre actualiza el store con el valor normalizado
  this.tramite630104Store.setTramite630104State(event.campo, valorParaStore);

  this.service.setForm('pagoDeDerechos', this.FechaDeImportacionTemporalFormulario);
}

  /**
   * Método del ciclo de vida `OnDestroy`.
   * Se ejecuta al destruir el componente. Completa el Subject `destroyed$` para liberar recursos.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}