import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleOpinionComponent } from "../consulta-detalle-opinion/detalle-opinion.component";
import { FolioQuery } from '../../../../core/queries/folio.query';
import { OpinionComponent } from "../consulta-opinion/opiniones.component";

@Component({
  selector: 'lib-opiniones',
  standalone: true,
  imports: [CommonModule, DetalleOpinionComponent, OpinionComponent],
  templateUrl: './opiniones.component.html',
  styleUrl: './opiniones.component.scss',
})
export class OpinionesComponent implements OnInit {
  /**
   * Variable para almacenar el folio recuperado desde el store.
   * @type {string}
   */
  public folio!: string;

  /**
   * Índice de la pestaña seleccionada.
   * @type {number}
   */
  public indice: number = 1;

  /**
   * Constructor de la clase OpinionesComponent.
   * @param folioQuery Consulta del folio desde el store.
   */
  constructor(private folioQuery: FolioQuery) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Recupera el folio desde el store.
   */
  ngOnInit(): void {
    /** 
     * Recuperar el folio desde el store.
     */
    this.folioQuery.getFolio().subscribe((folio) => {
      this.folio = folio || '';
    });
  }

  /**
   * Método para seleccionar la pestaña.
   * @param {number} i - Número de la pestaña seleccionada.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
}