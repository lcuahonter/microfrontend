import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfiguracionColumna, TablaDinamicaComponent,TablePaginationComponent } from '@libs/shared/data-access-user/src';
import { Asociados } from '../../models/datos-de-la-solicitud.model';
import { EstablecimientoService } from '../../services/establecimiento.service';

import { Subject, map, takeUntil } from 'rxjs';
import { TRAMITES_ASOCIADOS } from '../../constantes/aviso-de-funcionamiento.enum';

/**
 * Componente `TramitesAsociadosSeccionComponent`
 * 
 * Este componente es independiente (`standalone`) y se utiliza para mostrar una tabla dinámica
 * con información relacionada con trámites asociados. Obtiene los datos desde un servicio y
 * los presenta en una tabla configurable.
 */
@Component({
  selector: 'app-tramites-asociados-seccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaDinamicaComponent, TablePaginationComponent],
  templateUrl: './tramites-asociados-seccion.component.html',
  styleUrl: './tramites-asociados-seccion.component.scss',
})
export class TramitesAsociadosSeccionComponent implements OnInit, OnDestroy {

  /**
   * @property {number} idProcedimiento
   * @description Identificador del procedimiento para el cual se obtendrán los trámites asociados.
   */
  @Input() idProcedimiento!: number;

  /**
   * @property {string} folio
   * @description Folio del trámite principal para filtrar los trámites asociados.
   */
  @Input() folio!: string;
 /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;
  // Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
  private destroy$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * establecimientoService Servicio para interactuar con los datos de trámites asociados.
   */
  constructor(private establecimientoService: EstablecimientoService,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
         .pipe(
           takeUntil(this.destroy$),
           map((seccionState) => {
             this.esFormularioSoloLectura = seccionState.readonly;
         
           })
         )
         .subscribe();
  }

  /**
   * Ciclo de vida de Angular: se ejecuta al inicializar el componente.
   * Llama al método `obtenerListaDeAsociados` para cargar los datos iniciales.
   */
  ngOnInit(): void {
    this.obtenerListaDeAsociados();
  }

  // Propiedad que almacena los datos que se mostrarán en la tabla dinámica.
  public acuseTablaDatos: Asociados[] = [];

  // Configuración de las columnas de la tabla dinámica.
  public configuracionTablaTramites: ConfiguracionColumna<Asociados>[] = TRAMITES_ASOCIADOS

  /**
   * Método para obtener la lista de trámites asociados desde el servicio.
   * Los datos obtenidos se asignan a la propiedad `acuseTablaDatos`.
   */
  obtenerListaDeAsociados(): void {
    if(this.idProcedimiento){
      this.establecimientoService.obtenerTramitesAsociados(this.idProcedimiento, this.folio)
      .pipe(
        takeUntil(this.destroy$),
        map((data) => {
          // Suponiendo que la respuesta tiene una propiedad 'datos' que contiene el arreglo de Asociados
          if (data.codigo === "00") {
            // Agrega id a cada objeto en datos
            const DATOS = (data.datos as Asociados[]).map((obj: Asociados, i: number) => ({
              ...obj,
              id: i + 1
            }));
            return DATOS;
          }
          return [];
        })
      )
      .subscribe((datosConId: Asociados[]) => {
        this.acuseTablaDatos = datosConId;
      });
    }else{
      this.establecimientoService.enListaDeAsociados()
      .pipe(takeUntil(this.destroy$)) // Cancela la suscripción al destruir el componente.
      .subscribe((data: Asociados[]) => {
        this.acuseTablaDatos = data; // Asigna los datos obtenidos a la tabla dinámica.
      });
    }
    
  }

  /**
   * Ciclo de vida de Angular: se ejecuta al destruir el componente.
   * Emite un valor en el `Subject` `destroy$` y lo completa para cancelar todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}