import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableComponent, TituloComponent } from '@ng-mf/data-access-user';
import { CarrosDeFerrocarril } from '../../models/solicitud-pantallas.model';


/** Componente para gestionar los datos de los carros de ferrocarril */
@Component({
  selector: 'app-carros-de-ferrocarril',
  standalone: true,
  imports:[TituloComponent, TableComponent],
  templateUrl: './carros-de-ferrocarril.component.html',
  styleUrl: './carros-de-ferrocarril.component.scss'
})
/** Componente para gestionar los datos de los carros de ferrocarril */
export class CarrosDeFerrocarrilComponent implements OnChanges {
   /** Matriz para contener datos para cada fila de la tabla */
  @Input() tablaFilaDatos: CarrosDeFerrocarril[] = [];

  /** Matriz para contener etiquetas de encabezado para la tabla */
  @Input() tablaHeadData: string[] = [];

  /** Matriz para contener datos para cada fila de la tabla */
  tableData = {
    tableBody: [],
    tableHeader: [],
  };

  /**
   * Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado!: boolean;

  /**
   * Indica el número de procedimiento.
   */
  @Input() procedimiento!: number;

  /**
   *  ngOnChanges se utiliza para detectar cambios en la tabla de la componente 
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
      const TBODYKEY = 'tablaHeadData';
      const TBODYDATA = 'tablaFilaDatos';
      if (changes[TBODYKEY]?.currentValue) {
        this.tableData.tableHeader = changes[TBODYKEY]?.currentValue;
      }
      if (changes[TBODYDATA]?.currentValue) {
        this.tableData.tableBody = changes[TBODYDATA]?.currentValue;
      }
    }
}
