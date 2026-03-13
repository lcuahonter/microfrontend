import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AMBIENTES } from '../../../../core/ambientes';
import { AcusesResolucionesComponent } from "../bandeja-acuses-resoluciones/acuses-resoluciones.component";
import { BandejaPaso1Component } from '../bandejapaso1/bandeja-paso1.component';
import { CommonModule } from '@angular/common';
import { DetallesdictamenComponent } from '../bandeja-detalles-dictamen/detallesdictamen.component';
import { DocumentosComponent } from "../bandeja-documentos/documentos.component";
import { EnvioDigitalComponent } from '../consulta-envio-digital/envio-digital.component';
import { FolioQuery } from '../../../../core/queries/folio.query';
import { OpinionesComponent } from "../consulta-opiniones/opiniones.component";
import { Requerimientospaso1Component } from "../bandeja-requerimientos/requerimientospaso1.component";
import { RouterModule } from '@angular/router';
import { TITULO_ACUSES } from '../../../../core/enums/consulta-generica.enum';
import { TareasTramiteComponent } from '../bandeja-tareas-tramite/tareas-tramite.component';

@Component({
  selector: 'lib-consulta',
  standalone: true,
  imports: [CommonModule, RouterModule, BandejaPaso1Component, DocumentosComponent, DetallesdictamenComponent, TareasTramiteComponent, AcusesResolucionesComponent, EnvioDigitalComponent, Requerimientospaso1Component, OpinionesComponent],
  templateUrl: './bandeja.component.html',
  styleUrl: './bandeja.component.scss',
})
export class BandejaComponent implements OnInit {
  /**
   * Variable para almacenar el folio recuperado desde el store.
   * @type {string}
   */
  public folio!: string;

  /**
   * Variable para asignar el endpoint de la ruta dependiendo del ambiente.
   * @type {string}
   */
  public ruta: string = '';

  /**
   * Texto de alerta que se muestra en el componente.
   * @type {string}
   */
  txtAlerta!: string;

  /**
   * Subtítulo del componente.
   * @type {string}
   */
  subtitulo = TITULO_ACUSES;

  /**
   * Índice de la pestaña seleccionada.
   * @type {number}
   */
  indice: number = 1;
  /**
     * Subject utilizado para manejar la cancelación de suscripciones.
     * @type {Subject<void>}
     */
    public unsubscribe$ = new Subject<void>();

  /**
   * Constructor de la clase BandejaComponent.
   * @param folioQuery Consulta del folio desde el store.
   */
  constructor(private folioQuery: FolioQuery) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura la ruta dependiendo del ambiente y recupera el folio desde el store.
   */
  ngOnInit(): void {
    /**
   * Configurar la ruta dependiendo del ambiente.
   */
    if (window.location.host.indexOf('localhost') !== -1) {
      this.ruta = AMBIENTES.LOCALHOST;
    } else {
      this.ruta = AMBIENTES.DESARROLLO;
    }

    /**
   * Recuperar el folio desde el store y asignarlo a la variable folio.
   */
    this.folioQuery.getFolio().pipe(takeUntil(this.unsubscribe$)).subscribe((folio) => {
      this.folio = folio || '';
    });
  }

  /**
   * Método para seleccionar la pestaña.
   * @param i Número de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
}