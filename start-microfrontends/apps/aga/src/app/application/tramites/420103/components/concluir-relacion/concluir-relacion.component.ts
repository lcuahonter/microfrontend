import {
  CONFIGURACION_FECHA_FINAL,
  CONFIGURACION_FECHA_INICIAL,
  CONFIGURACION_TABLA,
} from '../../enum/concluir-relacion.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, ConsultaioQuery, TablaSeleccion } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subscription, map, takeUntil } from 'rxjs';
import { Tramite420103State, Tramite420103Store } from '../../estados/tramite420103.store';
import { ConcluirRelacionService } from '../../services/concluir-relacion.service';
import { DetallesDelMercancia } from '@libs/shared/data-access-user/src/core/models/420103/concluir-relacion.model';
import { InputFecha } from '@ng-mf/data-access-user';
import { Tramite420103Query } from '../../estados/tramite420103.query';

/**
 * Componente que gestiona la funcionalidad de concluir relación en el trámite 420103.
 * Permite capturar datos como RFC, fecha inicial y fecha final, y muestra una tabla dinámica con los datos obtenidos.
 */
@Component({
  selector: 'app-concluir-relacion',
  templateUrl: './concluir-relacion.component.html',
  styleUrls: ['./concluir-relacion.component.scss'],
})
export class ConcluirRelacionComponent implements OnInit, OnDestroy {
  /**
   * Estado actual del trámite 420103.
   */
  estadoTramite420103!: Tramite420103State;

  /**
   * Formulario reactivo que gestiona los datos de la relación a concluir.
   */
  formularioConcluirRelacion!: FormGroup;

  /**
   * Configuración de la tabla dinámica para la selección de datos.
   */
  seleccionTabla = TablaSeleccion.RADIO;

  /**
   * Datos que se mostrarán en la tabla dinámica.
   */
  datosTabla: DetallesDelMercancia[] = [];

  /**
   * Configuración de las columnas de la tabla dinámica.
   */
  configuracionTabla: ConfiguracionColumna<DetallesDelMercancia>[] = CONFIGURACION_TABLA;

  /**
   * Configuración para el campo de fecha inicial.
   */
  configuracionFechaInicial: InputFecha = CONFIGURACION_FECHA_INICIAL;

  /**
   * Configuración para el campo de fecha final.
   */
  configuracionFechaFinal: InputFecha = CONFIGURACION_FECHA_FINAL;

  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destruido$: ReplaySubject<boolean> = new ReplaySubject(1);
  
  /**
   * Suscripción a los cambios en el formulario reactivo.
   */
  private subscription: Subscription = new Subscription();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente. Inicializa las dependencias necesarias.
   *
   * formBuilder - Servicio para construir formularios reactivos.
   * servicioConcluirRelacion - Servicio que gestiona las operaciones relacionadas con concluir relación.
   * consultaTramite420103 - Servicio para consultar el estado del trámite 420103.
   * almacenamientoTramite420103 - Servicio para gestionar el estado del trámite 420103.
   * consultaioQuery - Servicio para consultar el estado de la consulta de entrada/salida.
   */
  constructor(
    private formBuilder: FormBuilder,
    private servicioConcluirRelacion: ConcluirRelacionService,
    private consultaTramite420103: Tramite420103Query,
    private almacenamientoTramite420103: Tramite420103Store,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destruido$),
      map((seccionState) => {
        this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario y sus valores iniciales.
   */
  ngOnInit(): void {
     this.consultaTramite420103.selectSeccionState$
    .pipe(takeUntil(this.destruido$))
    .subscribe((estado: Tramite420103State) => {
      this.estadoTramite420103 = estado;
      this.crearFormularioConcluirRelacion(); 
      this.inicializarEstadoFormulario(); 
    });
  }

  
  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormularioConcluirRelacion();
    }
  }

  /**
   * @method
   * @name guardarDatosFormulario
   * @description
   * Inicializa los formularios y obtiene los datos de la tabla.
   * Dependiendo del modo de solo lectura (`esFormularioSoloLectura`),
   * deshabilita o habilita todos los formularios del componente.
   * Si el formulario está en modo solo lectura, todos los formularios se deshabilitan para evitar modificaciones.
   * Si no está en modo solo lectura, todos los formularios se habilitan para permitir la edición.
   *
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    this.crearFormularioConcluirRelacion();
    if (this.esFormularioSoloLectura) {
      this.formularioConcluirRelacion.disable();
    } else {
      this.formularioConcluirRelacion.enable();
    }
  }

  /**
   * Crea el formulario reactivo para capturar los datos de la relación a concluir.
   */
  crearFormularioConcluirRelacion(): void {
    this.formularioConcluirRelacion = this.formBuilder.group({
     rfc: [
    '',
    [
      Validators.required,
      Validators.pattern(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/) // RFC pattern
    ]
  ],
    fechaInicial: [this.estadoTramite420103?.fechaInicial],
    fechaFinal: [this.estadoTramite420103?.fechaFinal],
  });
  }

  /**
   * Busca los datos relacionados con la relación a concluir y los muestra en la tabla dinámica.
   */
  buscarDatosRelacion(): void {
  const RFC_VALOR = this.formularioConcluirRelacion.get('rfc')?.value;
  if (RFC_VALOR) {
    if (RFC_VALOR === 'AAL0409235E6') {
      this.servicioConcluirRelacion
        .getDetallesDelMercanciaDatos()
        .pipe(takeUntil(this.destruido$))
        .subscribe((datos: DetallesDelMercancia) => {
          this.datosTabla = [datos];
        });
    } else {
      this.datosTabla = [];
    }
  }
}

  /**
   * Actualiza el valor del RFC en el formulario y en el estado del trámite.
   *
   * valor - Nuevo valor del RFC.
   */
  actualizarFechaFinVigencia(event: Event): void {
    const VALOR = (event.target as HTMLInputElement).value;
    this.formularioConcluirRelacion.patchValue({
      rfc: VALOR,
    });
    this.almacenamientoTramite420103.actualizarEstado({ rfc: VALOR });
  }

  /**
   * Método para cambiar la fecha final.
   * @param nuevo_valor Nuevo valor de la fecha final.
   */
  cambioFechaFinal(nuevo_valor: string): void {
    this.formularioConcluirRelacion.patchValue({
      fechaFinal: nuevo_valor,
    });
  }


  /**
   * Método que se ejecuta al destruir el componente.
   * Libera los recursos y completa el Subject `destruido$`.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destruido$.next(true);
    this.destruido$.complete();
  }
}