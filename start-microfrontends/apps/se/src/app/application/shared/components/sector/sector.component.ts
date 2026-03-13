import { Component, Input, OnDestroy } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { SECTOR } from '../../constantes/complementaria.enum';
import { SectorTabla } from '../../models/complementaria.model';

/**
 * Componente que representa la sección de "Sector".
 * Este componente utiliza una tabla dinámica para mostrar información relacionada con sectores.
 */
@Component({
  selector: 'app-sector',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent, TituloComponent],
  templateUrl: './sector.component.html',
  styleUrl: './sector.component.scss',
})
export class SectorComponent implements OnDestroy {
  /**
   * Enumeración que define las opciones de selección para la tabla.
   * Se utiliza para configurar el comportamiento de la tabla dinámica.
   */
  tablaSeleccion = TablaSeleccion;

  /**
   * Constante que contiene los datos de configuración para la tabla de sectores.
   * Esta constante se importa desde el archivo de constantes.
   */
  public SectorTabla = SECTOR;

  /**
   * Arreglo que almacena los datos de la tabla de sectores.
   * Este arreglo se utiliza para mostrar la información dinámica en la tabla.
   */
 @Input() sectorTablaDatos: SectorTabla[] = [];
 /**
   * Subject para destruir notificador.
   */
  consultaDatos!: ConsultaioState;
   /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;
  
/** Sujeto para manejar la destrucción del componente. */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
   /**
   * Constructor del componente.
   * @param certificadoService Servicio para gestionar certificados.
   * @param fb Constructor de formularios.
   * @param validacionesService Servicio para validar formularios.
   * @param store Almacén de datos del trámite.
   * @param query Consulta de datos del trámite.
   */
  constructor(private consultaioQuery: ConsultaioQuery) {
    // El constructor se utiliza para la inyección de dependencias.
     this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
        })
      )
      .subscribe()
  }
 
    /**
     * Método que se ejecuta al destruir el componente.
     * Se utiliza para limpiar los recursos y evitar fugas de memoria.
     */
    ngOnDestroy(): void {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    }
}