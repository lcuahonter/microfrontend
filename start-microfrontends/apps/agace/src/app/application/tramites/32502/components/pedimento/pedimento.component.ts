/* eslint-disable no-alert */
/* eslint-disable dot-notation */
import { Component, Input, OnChanges, SimpleChanges, output } from '@angular/core';
import { DatosComponentePedimento, Pedimento } from '../../../../core/models/32502/tramite32502.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BooleanoSiNoPipe } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@ng-mf/data-access-user';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';

/**
 * @Component - PedimentoComponent
 *
 * Este componente proporciona funcionalidad para gestionar los pedimentos.
 * Incluye un formulario para capturar el número de pedimento y una tabla para mostrar los pedimentos agregados.
 */
@Component({
  selector: 'c-pedimento',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SharedModule, BooleanoSiNoPipe],
  templateUrl: './pedimento.component.html',
  styleUrl: './pedimento.component.scss',
})
export class PedimentoComponent implements OnChanges {
  /**
   * Indica si la validación está habilitada.
   */
  @Input({ required: true }) validacion!: boolean;

  /**
   * Datos del componente pedimento.
   */
  @Input({ required: true }) datosNroPedimento!: DatosComponentePedimento;

  /**
   * Evento para validar campos.
   */
  validaCampos = output<void>();

  /**
   * Control de formulario para el campo de número de pedimento.
   */
  pedimentoForm: FormControl = new FormControl('', [Validators.maxLength(7)]);

  /**
   * Encabezados de la tabla de pedimentos.
   */
  hTabla: Array<string> = [
    'Patente',
    'Pedimento',
    'Aduana',
    'Tipo de pedimento',
    'Número(s)',
    'Comprobante Valor',
    'Pedimento Validado',
    'Accion',
  ];

  /**
   * Lista de pedimentos agregados.
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * Constructor para PedimentoComponent.
   * @param validacionesService - Servicio de validaciones de formulario.
   */
  constructor(private validacionesService: ValidacionesFormularioService) {
    // do nothing
  }

  /**
   * Verifica si el formulario de pedimento es válido.
   * 
   * @returns `true` si el formulario tiene errores y ha sido tocado, `false` en caso contrario.
   */
  get isValid(): boolean | null {
    return this.pedimentoForm.errors && this.pedimentoForm.touched;
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando se detectan cambios en las propiedades vinculadas a datos.
   * 
   * @param changes - Objeto que contiene los cambios detectados.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['validacion']) {
      this.validacion = changes['validacion'].currentValue;
    }

    if (changes['datosNroPedimento']) {
      this.datosNroPedimento = changes['datosNroPedimento'].currentValue;
    }
  }

  /**
   * Agrega un pedimento a la lista de pedimentos.
   */
  agregaPedimento(): void {
    this.validaCampos.emit();
    this.acciones();
  }

  /**
   * Realiza las acciones necesarias para agregar un pedimento.
   */
  acciones(): void {
    if (this.validacion) {
      const NROPEDIMENTO = this.pedimentoForm.value
        ? parseInt(this.pedimentoForm.value, 10)
        : 0;

      if (NROPEDIMENTO !== 0) {
        const PEDIMENTO = {
          patente: this.datosNroPedimento.patente,
          pedimento: NROPEDIMENTO,
          aduana: this.datosNroPedimento.idAduana,
          idTipoPedimento: 0,
          descTipoPedimento: 'Por evaluar',
          numero: '',
          comprobanteValor: '',
          pedimentoValidado: false,
        };
        this.pedimentos.push(PEDIMENTO);
      } else {
        alert('Necesita agregar un número de pedimento');
      }

      // 'No se pudo validar el pedimento, favor de capturar los datos de pedimento faltante y anexar documento.'
    } else {
      alert(
        'Necesita seleccionar una aduana de despacho y agregar un número de pedimento'
      );
    }
  }

  /**
   * Elimina un pedimento de la lista de pedimentos.
   * 
   * @param i - El índice del pedimento a eliminar.
   */
  eliminar(i: number): void {
    this.pedimentos.splice(i, 1);
    //modal de confirmacion de elimincacion
  }
}