import {
  BodyTablaAcuses,
  BodyTablaResolucion,
  HeaderTablaAcuses,
  HeaderTablaResolucion,
} from '../../../../core/models/shared/consulta-generica.model';
import {
  CONSULTA_ACUSES,
  CONSULTA_RESOLUCIONES,
} from '../../../../core/enums/consulta-generica.enum';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { AcusesResolucionResponse } from '../../../../core/models/shared/consulta-acuses-response.model';
import { AcusesService } from '../../../../core/services/consultagenerica/acuses-service';
import { CommonModule } from '@angular/common';
import { ResolucionesService } from '../../../../core/services/consultagenerica/resoluciones-service';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-acuses-resoluciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './acuses-resoluciones.component.html',
  styleUrl: './acuses-resoluciones.component.scss',
})
export class AcusesResolucionesComponent
  implements OnChanges, OnDestroy {
  /**
   * Título del componente.
   * @type {string}
   */
  @Input() titulo!: string;

  /**
   * Texto de alerta que se muestra en el componente.
   * @type {string}
   */
  @Input() txtAlerta!: string;

  /**
   * Lista de acuses de resolución.
   * @type {AcusesResolucionResponse[]}
   */
  @Input() acusesResolucion!: AcusesResolucionResponse;

  /**
   * Subtítulo del componente.
   * @type {string}
   */
  @Input() subtitulo!: string;

  /**
   * URL utilizada para realizar acciones relacionadas con el componente.
   * @type {string}
   */
  @Input() url!: string;

  /**
   * Encabezado de la tabla de acuses.
   * Contiene las columnas que se mostrarán en la tabla de acuses.
   * @type {HeaderTablaAcuses[]}
   */
  readonly encabezadoTablaAcuse: HeaderTablaAcuses[] = CONSULTA_ACUSES.encabezadoTablaAcuse;

  /**
   * Encabezado de la tabla de resoluciones.
   * Contiene las columnas que se mostrarán en la tabla de resoluciones.
   * @type {HeaderTablaResolucion[]}
   */
  readonly encabezadoTablaResolucion: HeaderTablaResolucion[] = CONSULTA_RESOLUCIONES.encabezadoTablaResolucion;

  /**
   * Datos de la tabla de acuses.
   * Contiene los registros que se mostrarán en la tabla de acuses.
   * @type {BodyTablaAcuses[]}
   */
  datosTablaAcuse: BodyTablaAcuses[] = [];

  /**
   * Datos de la tabla de resoluciones.
   * Contiene los registros que se mostrarán en la tabla de resoluciones.
   * @type {BodyTablaResolucion[]}
   */
  datosTablaResolucion: BodyTablaResolucion[] = [];

  /**
   * Subject utilizado para manejar la cancelación de suscripciones.
   * @type {Subject<void>}
   */
  public unsubscribe$ = new Subject<void>();

  /**
   * Método para descargar el PDF de un acuse.
   */
  public descargarPdfAcuse = AcusesResolucionesComponent.descargarPdfAcuse;

  /**
   * Método para descargar el PDF de una resolución.
   */
  public descargarPdfResolucion = AcusesResolucionesComponent.descargarPdfResolucion;

  constructor(
    private router: Router,
    private acusesService: AcusesService,
    private resolucionesService: ResolucionesService
  ) { }

  /**
   * Método que se ejecuta cuando uno o más inputs del componente cambian.
   *
   * @param changes - Objeto que contiene los cambios de los inputs del componente.
   * @returns void
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['acusesResolucion'] && changes['acusesResolucion'].currentValue) {
      this.getAcuses();
      this.getResolucion();
    } else {
      this.acusesService
        .getAcuses()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data) => {
          this.datosTablaAcuse = data;
        });
      this.resolucionesService
        .getResoluciones()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data) => {
          this.datosTablaResolucion = data;
        });
    }
  }
  /**
   * Método `ngOnDestroy()`.
   * Este método se ejecuta cuando el componente se destruye y realiza las siguientes acciones:
   * - Desuscribe la suscripción a los cambios en el formulario reactivo.
   *
   * @memberof AcusesResolucionesComponent
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Método para obtener los documentos desde el servicio.
   * unsubscribe$ - Subject para manejar la cancelación de suscripciones.
   * suscribe - Se suscribe al observable del servicio para obtener los datos.
   */
  getAcuses(): void {
    this.datosTablaAcuse = this.acusesResolucion.acuses.map((ac, index) => ({
      id: index + 1,
      idDocumento: ac.id_documento_oficial.toString(),
      documento: ac.desc_documento,
      urlPdf: ac.documento_minio ?? '',
    }));
  }

  /**
   * Método para obtener los documentos desde el servicio.
   * unsubscribe$ - Subject para manejar la cancelación de suscripciones.
   * suscribe - Se suscribe al observable del servicio para obtener los datos.
   */
  getResolucion(): void {
    this.datosTablaResolucion = this.acusesResolucion.documentos_oficiales.map((doc, index) => ({
      id: index + 1,
      idDocumento: doc.id_documento_oficial.toString(),
      documento: doc.desc_documento,
      urlPdf: doc.documento_minio ?? '',
    }));
  }

  /**
   * Abre un archivo PDF en una nueva pestaña del navegador.
   *
   * @param {string} url - La URL del archivo PDF que se va a abrir.
   * @returns {void}
   */
  static descargarPdfAcuse(url: string): void {
    window.open(url, '_blank');
  }
  /**
   * Abre un archivo PDF en una nueva pestaña del navegador.
   *
   * @param {string} url - La URL del archivo PDF que se va a abrir.
   * @returns {void}
   */
  static descargarPdfResolucion(url: string): void {
    window.open(url, '_blank');
  }
  verDetalleResolucion(id: number): void {
    /**
     * Lógica para abrir el detalle de la resolución
     * @param id Número de identificación de la resolución
     * Modificar la ruta según tu configuración de rutas
     */
    this.router.navigate(['/lib-detalle-resolucion', id]);
  }
  verDetalleAcuse(id: number): void {
    /**
     * Lógica para abrir el detalle del acuse
     * @param id Número de identificación del acuse
     * Modificar la ruta según tu configuración de rutas
     */
    this.router.navigate(['/lib-detalle-acuse', id]);
  }
}
