import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AereoService } from '../service/aereo-service';
import { BusquedaAereoResponse } from '../service/model/response/busqueda-response';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatosAereoResponse } from '../service/model/response/busqueda-response';
import { FiltrosAereoRequest } from '../service/model/resquest/filtros-request';
import { FormsModule } from '@angular/forms';
import { PaginacionResponse } from '../service/model/response/busqueda-response';
import { ReactiveFormsModule } from '@angular/forms';

import {
  TableComponent,
  TablePaginationComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';


@Component({
  selector: 'caat-aereo',
  standalone: true,
  imports: [TituloComponent, TableComponent, TablePaginationComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})

/**
 * Componente Angular para la gestión y consulta de registros CAAT Aéreo.
 * 
 * Este componente permite a los usuarios buscar registros de CAAT Aéreo mediante un formulario reactivo,
 * aplicar filtros, manejar la paginación de resultados y visualizar la información obtenida desde el servicio backend.
 */

export class InicioAereoComponent implements OnInit, OnDestroy {

  /**
   * Formulario reactivo para la búsqueda de registros CAAT Aéreo
   */
  buscarFormulario!: FormGroup;

  /**
   * Lista de resultados de la consulta CAAT Aéreo
   */
  listConsultaCAATAereo: DatosAereoResponse[] = [];

  /**
   * Objeto de la solicitud que contiene los filtros
   * Se utiliza para crear y enviar parámetros de filtrado a la API de backend.
   * @type {FiltrosAereoRequest} 
   */
  filtrosRequest: FiltrosAereoRequest = new FiltrosAereoRequest();

  /**
   * Total numero de elemento
   */
  totalElementos: number = 0;

  /**
   * Número de elementos a mostrar por página en la paginación.
   * @type {number}
   */
  elementosPagina: number = 5;

  /**
   * Número de página actual para paginación.
   * @type {number}
   * @default 1
   */

  /**
   * Número de página actual para paginación.
   */
  paginaActual: number = 1;

  /**
   * Subject para manejar la destrucción del componente y cancelar suscripciones a observables.
   */
  private destroy$ = new Subject<void>();

  constructor(private aereoService: AereoService,
    public fb: FormBuilder
  ) {
    this.buscarFormulario = this.fb.group({
      denominacion: ['', Validators.required],
      rfc: ['', Validators.required],
      caat: ['', Validators.required]
    });
  }

  /**
   * Actualiza al objeto de la solicitud con valores del formulario de búsqueda.
   * Asigna el valor del formulario a las propiedades denominacion, rfc y caat
   */
  envio(): void {
    this.filtrosRequest.denominacion = this.buscarFormulario.value.denominacion;
    this.filtrosRequest.rfc = this.buscarFormulario.value.rfc;
    this.filtrosRequest.caat = this.buscarFormulario.value.caat;
  }

  /**
   * Inicializa el componente y realiza una búsqueda inicial de registros CAAT Aéreo.
   * @returns {void}
   */
  ngOnInit(): void {
    this.buscar();
  }

  /**
   * Busca registros de CAAT Aéreo según los filtros y parámetros de paginación actuales
   * Actualiza la lista de consultas y la información de paginación con los datos de respuesta
   * Se cancela automáticamente la suscripción cuando se destruye el componente.
   * 
   * @returns {void}
   */
  buscar(): void {
    this.aereoService
      .getRegistrosByFiltros<BusquedaAereoResponse>(this.paginaActual, this.elementosPagina)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.listConsultaCAATAereo = resp.datos?.registros || [];
          this.updatePagination(resp.datos?.paginacion);
        },
        error: (error) => {
          console.error('Error al buscar:', error);
        }
      });

  }

  /**
   * Actualiza el estado de paginación con la respuesta de paginación proporcionada.
   * @param paginacion - Respuesta de paginación opcional que contiene el número de página, el tamaño de página y el total de elementos
   * Si no se proporciona, solo la página actual se restablece a 1.
   * @returns void
   */
  updatePagination(paginacion?: PaginacionResponse): void {
    this.paginaActual = paginacion?.num_pag || 1;
    this.elementosPagina = paginacion?.tam_pag || this.elementosPagina;
    this.totalElementos = paginacion?.total_elementos || 0;
  }

  /**
   * Maneja los cambios de paginación actualizando la página actual y refrescando los resultados de la búsqueda.
   * @param page - El número de página a la que navegar
   */
  cambioPagina(page: number): void {
    this.paginaActual = page;
    this.buscar();
  }

  /**
   * Maneja los cambios en la cantidad de elementos mostrados por página.
   * Restablece la página actual a 1 y actualiza el estado de paginación.
   * @param elementosPagina - El nuevo número de elementos a mostrar por página
   */
  elementosPaginaCambio(elementosPagina: number): void {
    this.elementosPagina = elementosPagina;
    this.paginaActual = 1;
    this.updatePagination();
  }

  /**
   * Completa el tema de destrucción para cancelar la suscripción a todos los observables
   * limpia los recursos
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}