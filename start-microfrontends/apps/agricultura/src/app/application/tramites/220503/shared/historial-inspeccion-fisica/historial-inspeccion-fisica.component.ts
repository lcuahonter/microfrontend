import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableComponent, TituloComponent } from '@ng-mf/data-access-user';
import { HistorialInspeccionFisica } from '../../models/solicitud-pantallas.model';


/** Componente para gestionar el historial de inspección física */
@Component({
  selector: 'app-historial-inspeccion-fisica',
  standalone: true,
  imports: [TituloComponent, TableComponent],
  templateUrl: './historial-inspeccion-fisica.component.html',
  styleUrl: './historial-inspeccion-fisica.component.scss',
})
/** Componente para gestionar el historial de inspección física */
export class HistorialInspeccionFisicaComponent implements OnChanges {
  /** Matriz para contener etiquetas de encabezado para la tabla */
  @Input() tablaHeadData: string[] = [];

  /** Matriz para contener datos para cada fila de la tabla */
  @Input() tablaFilaDatos: HistorialInspeccionFisica[] = [];

  /**
   * Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado!: boolean;

  /**
   * Indica el número de procedimiento.
   */
  @Input() procedimiento!: number;

  /** Matriz para contener datos para cada fila de la tabla */
  tableData = {
    tableBody: [],
    tableHeader: [],
  };

  /**
   * @description
   * ngOnChanges se utiliza para detectar cambios en la tabla de la componente
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
