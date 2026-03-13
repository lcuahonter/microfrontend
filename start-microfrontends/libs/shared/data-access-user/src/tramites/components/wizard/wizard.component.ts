import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaPasosWizard } from '../../../core/models/shared/datos-generales.model';
import { WizardService } from '../../../core/services/shared/wizard/wizard.service';

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.scss',
  host: {}
})
export class WizardComponent implements OnChanges {
  @Input() listaPasos: Array<ListaPasosWizard> = [];
  @Output() indice = new EventEmitter<number>();

  indiceActual: number = 0;
  estadoInicial: boolean = false;
  lista: Array<ListaPasosWizard> = [];
  maximo: number = 0;

  wizardService = inject(WizardService);

  /**
   * Detecta cambios en las propiedades de entrada y actualiza las validaciones
   * o el estado del control del formulario según corresponda.
   *
   * @param changes - Objeto que contiene los cambios en las propiedades de entrada.
   * @returns void
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['listaPasos'].currentValue !== undefined &&
      changes['listaPasos'].currentValue !== null
    ) {
      this.listaPasos = changes['listaPasos'].currentValue;
      this.lista = []; // AÑADE ESTA LÍNEA: Borra la matriz antes de insertar
      this.listaPasos.forEach((element, index) => {
        this.estadoInicial = index === 0 ? true : false;
        this.lista.push({
          indice: index,
          titulo: element.titulo,
          activo: element.activo,
          completado: element.completado,
        });
      });

      this.maximo = this.lista.length - 1;
    }
  }

  /**
   * Avanza al siguiente índice en la lista y actualiza su estado.
   * 
   * @param activo - Indica si el elemento actual debe estar activo (por defecto `true`).
   * @returns void
   */
  siguiente(activo: boolean = true): void {
    this.indiceActual = this.indiceActual === this.maximo ? this.indiceActual : this.indiceActual + 1;
    this.lista[this.indiceActual].activo = activo;

    if (this.indiceActual === (this.maximo)) {
      this.lista[this.indiceActual].completado = activo;
    }
  }

  /**
   * Navega directamente al segundo paso del wizard y lo marca como activo.
   *
   * Este método establece el índice actual (`indiceActual`) en 1 (correspondiente al segundo paso, ya que es 0-based),
   * y marca ese paso como activo. Si el paso es el último de la lista, también lo marca como completado.
   *
   * @param activo - Indica si el paso debe estar activo (por defecto `true`).
   * @returns void
   */
  siguienteGuardar(activo: boolean = true): void {
    this.indiceActual = 1;
    this.lista[this.indiceActual].activo = activo;

    if (this.indiceActual === (this.maximo)) {
      this.lista[this.indiceActual].completado = activo;
    }
  }

  /**
   * Retrocede al paso anterior en la lista de trámites.
   * Marca el paso actual como inactivo y no completado.
   * 
   * @returns {void} No retorna ningún valor.
   */
  atras(): void {
    this.lista[this.indiceActual].activo = false;
    this.lista[this.indiceActual].completado = false;
    this.indiceActual = this.indiceActual === 0 ? 0 : this.indiceActual - 1;
  }
}
