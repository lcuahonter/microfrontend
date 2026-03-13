import { CommonModule } from '@angular/common';

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatosCriterioResumenResponse } from '../../models/response/tratado-criterio-resumen-response.model';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TituloComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-resumen-valores-formulario',
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './resumen-valores-formulario.component.html',
  styleUrl: './resumen-valores-formulario.component.scss',
})
export class ResumenValoresFormularioComponent implements OnChanges { 

  /**
   * Una instancia de FormGroup que representa el formulario para mostrar el resumen de valores.
   */
  public formResumenValores!: FormGroup;

  /** 
   * Recibe desde el componente padre los valores del resumen de criterios,
   * que contienen los datos a mostrar en el formulario o tabla de resumen.
   */
  @Input() valoresRecibidosResumen!: DatosCriterioResumenResponse;

  /**
   * Constructor del componente encargado de inicializar el formulario reactivo
   * `formResumenValores`, el cual muestra los distintos campos de resumen
   * de valores económicos y técnicos relacionados con los criterios tratados.
   * @param fb 
   */
  constructor(private fb: FormBuilder) {
    this.formResumenValores = this.fb.group({
      impInsumosOriginarios: [{value: '', disabled: true}],
      impInsumosNoOriginarios: [{value: '', disabled: true}],
      impEnvasesOriginarios: [{value: '', disabled: true}], 
      impEnvasesNoOriginarios: [{value: '', disabled: true}],
      impInsumosEnvOriginarios: [{value: '', disabled: true}],
      impInsumosEnvNoOriginarios: [{value: '', disabled: true}],
      ptcValorNoOriginarios: [{value: '', disabled: true}],
      ptcPesoTotalFibras: [{value: '', disabled: true}],
      ptcPesoTotalMercancia: [{value: '', disabled: true}],
      calAprobadaDictaminador: [{value: '', disabled: true}],
      precioFrancoFabrica: [{value: '', disabled: true}],
      valorTransaccion: [{value: '', disabled: true}],
      valorTransaccionFOB: [{value: '', disabled: true}],
      costoNeto: [{value: '', disabled: true}],
      costoNetoAP: [{value: '', disabled: true}],
      pesoAcumulado: [{value: '', disabled: true}],
      volumenAcumulado: [{value: '', disabled: true}],
      descripcionUMT: [{value: '', disabled: true}],  
      descripcionUMC: [{value: '', disabled: true}]
    });  
  }

  /** Conjunto que almacena los nombres de los campos que tienen valores no nulos o no vacíos. */
  camposVisibles = new Set<string>();

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * @method ngOnInit
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['valoresRecibidosResumen']?.currentValue) {
    const DATOS = changes['valoresRecibidosResumen'].currentValue;

    this.camposVisibles = new Set(
      Object.entries(DATOS)
        .filter(([_, valor]) => valor !== null && valor !== '' && valor !== undefined)
        .map(([key]) => key)
    );

    this.formResumenValores.patchValue({
      impInsumosOriginarios: DATOS?.imp_insumos_originarios,
      impInsumosNoOriginarios: DATOS?.imp_insumos_no_originarios,
      impEnvasesOriginarios: DATOS?.imp_envases_originarios,
      impEnvasesNoOriginarios: DATOS?.imp_envases_no_originarios,
      impInsumosEnvOriginarios: DATOS?.imp_insu_env_originarios,
      impInsumosEnvNoOriginarios: DATOS?.imp_insu_env_no_originarios,
      ptcValorNoOriginarios: DATOS?.pct_valor_no_originarios,
      ptcPesoTotalFibras: DATOS?.pct_peso_total_fibras,
      ptcPesoTotalMercancia: DATOS?.pct_peso_total_mercancia,
      precioFrancoFabrica: DATOS?.precio_franco_fabrica,
      valorTransaccion: DATOS?.valor_transaccion,
      valorTransaccionFOB: DATOS?.valor_transaccion_fob,
      costoNeto: DATOS?.costo_neto,
      costoNetoAP: DATOS?.costo_neto_ap,
      pesoAcumulado: DATOS?.peso_acumulado,
      volumenAcumulado: DATOS?.volumen_acumulado,
      descripcionUMT: DATOS?.descripcion_umt,
      descripcionUMC: DATOS?.descripcion_umc
      });
    }
  }

}
