import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MercanciaTablaDatos } from '../../models/modificacion-descripcion.model';
import { TituloComponent } from '@ng-mf/data-access-user';

/**
 * Componente `ModificacionMercanciaModeloComponent`.
 *
 * Este componente permite la modificación de la descripción de mercancías seleccionadas
 * mediante un formulario reactivo. También emite los cambios al componente padre.
 *
 * @example
 * <app-modificacion-mercancia-modelo
 *   [mercanciaSeleccionadas]="listaDeMercancias"
 *   (emitMercanciaSeleccionadas)="onMercanciasActualizadas($event)">
 * </app-modificacion-mercancia-modelo>
 */
@Component({
  selector: 'app-modificacion-mercancia-modelo',
  templateUrl: './modificacion-mercancia-modelo.component.html',
  styleUrl: './modificacion-mercancia-modelo.component.scss',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
})
export class ModificacionMercanciaModeloComponent implements OnInit, OnChanges {
  /**
   * Formulario reactivo para capturar los datos de la mercancía.
   *
   * Este formulario incluye campos como el número de folio, cantidad libre, descripción, entre otros.
   */
  mercanciaFormularioModelo!: FormGroup;

  /**
   * Lista de mercancías seleccionadas desde la tabla.
   *
   * @type {MercanciaTablaDatos[]}
   */
  @Input() mercanciaSeleccionadas!: MercanciaTablaDatos[];

  /**
   * Evento que emite las mercancías seleccionadas al componente padre
   * cuando se actualiza la lista.
   *
   * @type {EventEmitter<MercanciaTablaDatos[]>}
   */
  @Output() emitMercanciaSeleccionadas = new EventEmitter<
    MercanciaTablaDatos[]
  >();

  /**
   * Constructor del componente.
   * Se inyecta el servicio `FormBuilder` para la creación de formularios reactivos.
   *
   * @param fb - Servicio de Angular para construir formularios.
   */
  constructor(public fb: UntypedFormBuilder) {
    // Constructor del componente
  }

  /**
   * Método de ciclo de vida de Angular.
   * Se ejecuta al inicializar el componente y configura el formulario.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  /**
   * Inicializa el formulario con los controles requeridos.
   */
  inicializarFormulario(): void {
    this.mercanciaFormularioModelo = this.fb.group({
      descipcionSolicitada: [''],
    });
  }

  /**
   * Método de ciclo de vida de Angular.
   * Detecta cambios en las propiedades de entrada (`@Input`).
   *
   * @param changes - Objeto con los cambios detectados en las entradas.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['mercanciaSeleccionadas'] &&
      changes['mercanciaSeleccionadas'].currentValue
    ) {
      if (this.mercanciaSeleccionadas.length > 0) {
        this.mercanciaFormularioModelo?.patchValue({
          descipcionSolicitada:
            this.mercanciaSeleccionadas[0]?.descripcionSolicitada,
        });
      }
    }
  }

  /**
   * Modifica la descripción de todas las mercancías seleccionadas
   * y emite la lista actualizada al componente padre.
   */
  modificarMercanciaSeleccionadas(): void {
    const DESCRIPCION_SOLICITADA = this.mercanciaFormularioModelo.get(
      'descipcionSolicitada'
    )?.value;

    if (DESCRIPCION_SOLICITADA) {
      this.mercanciaSeleccionadas.forEach((mercancia) => {
        mercancia.descripcionSolicitada = DESCRIPCION_SOLICITADA;
      });
      this.emitMercanciaSeleccionadas.emit(this.mercanciaSeleccionadas);
    }
  }

  /**
   * Cancela la selección de mercancías y limpia el formulario.
   */
  cancelarMercanciaSeleccionadas(): void {
    this.mercanciaSeleccionadas = [];
    this.mercanciaFormularioModelo.reset();
  }
}
