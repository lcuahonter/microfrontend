import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Asociados } from '../../models/consulta.model';
import { CommonModule } from '@angular/common';
import { ConsultaService } from '../../service/consulta.service';
import { DESTINATARIO_TABLA } from '../../constantes/consulta.enum';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';

/**
 * Componente para mostrar y administrar los trámites asociados.
 *
 * Este componente se encarga de obtener y mostrar la tabla de trámites asociados,
 * utilizando el servicio de consulta para cargar los datos y definiendo la configuración
 * de las columnas para la tabla.
 */
@Component({
  selector: 'app-tramites-asociados',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent,ReactiveFormsModule],
  templateUrl: './tramites-asociados.component.html',
  styleUrls: ['./tramites-asociados.component.css']
})
export class TramitesAsociadosComponent implements OnInit, OnDestroy {
/**
   * Subject para destruir notificador.
   */
  consultaDatos!: ConsultaioState;
   /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;
  /**
   * Subject que emite un valor cuando el componente se destruye.
   * Se utiliza para cancelar suscripciones y evitar fugas de memoria.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Datos de los trámites asociados (destinatarios) que se mostrarán en la tabla.
   */
  public datosDestinatario: Asociados[] = [];

  /**
   * Constante que representa el tipo de selección de la tabla.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de las columnas para la tabla de trámites asociados.
   */
  destinatarioConfiguracionTabla = DESTINATARIO_TABLA;
  /**
   * Formulario reactivo para los trámites asociados.
   * Se utiliza para manejar los datos del formulario de manera reactiva.
   */
  tramitesForm!: FormGroup;

  /**
   * Constructor del componente.
   * Inyecta el servicio ConsultaService para obtener los datos de la tabla de trámites.
   * @param consulta Servicio para realizar consultas.
   */
  constructor(private consulta: ConsultaService,private consultaioQuery: ConsultaioQuery) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   *
   * Se encarga de llamar a la función para obtener la tabla de trámites asociados.
   */
  ngOnInit(): void {
    this.obtenerTablaTramites();
    this.inicializarEstadoFormulario();
  }
/**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.guardarDatosFormulario();
    } 
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    if (this.soloLectura) {
      this.tramitesForm.disable();
    } else {
      this.tramitesForm.enable();
    }
  }
  /**
   * Obtiene los datos de la tabla de trámites asociados mediante el servicio ConsultaService.
   *
   * Los datos obtenidos se asignan a la propiedad 'datosDestinatario'.
   */
  public obtenerTablaTramites(): void {
    this.consulta
      .obtenerTablaTramites()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.datosDestinatario = data;
      });
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   *
   * Emite un valor para finalizar las suscripciones y prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
