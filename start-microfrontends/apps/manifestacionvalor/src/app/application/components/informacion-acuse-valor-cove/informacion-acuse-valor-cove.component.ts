import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, TablaSeleccion, TituloComponent, TablaDinamicaComponent } from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AcuseDeValor } from '../../shared/models/acuse-de-valor.model';
import { CommonModule } from '@angular/common';
import { RfcConsulta } from '../../shared/models/rfc-consulta.model';

@Component({
  selector: 'informacion-acuse-valor-cove',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent
  ],
  templateUrl: './informacion-acuse-valor-cove.component.html',
  styleUrl: './informacion-acuse-valor-cove.component.css',
})
export class InformacionAcuseValorCoveComponent implements OnInit, OnDestroy {

  /**
   * Formulario reactivo para capturar los datos para la busqueda.
   * @type {FormGroup}
   */
  formularioAgregarCove!: FormGroup;
  /**
   * Tipo de selección para la tabla principal.
   * @type {TablaSeleccion}
   */
  tipoSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;
  /**
   * Configuración de columnas para la tabla de detalles.
   * @type {ConfiguracionColumna<RfcConsulta>[]}
   */
  configuracionColumnas: ConfiguracionColumna<AcuseDeValor>[] = [
    { encabezado: 'Acuse de Valor (COVE)', clave: (fila) => fila.acuseDeValorCove, orden: 1 },
    { encabezado: 'Método Valoración', clave: (fila) => fila.metodoValoracionAduanera, orden: 2 },
    { encabezado: '# Factura', clave: (fila) => fila.numeroFactura, orden: 3 },
    { encabezado: 'Fecha expedición', clave: (fila) => fila.fechaExpedicion, orden: 4 },
    { encabezado: 'Emisor original', clave: (fila) => fila.emisorOriginal, orden: 5 },
    { encabezado: 'Destinatario', clave: (fila) => fila.destinatario, orden: 6 },
  ];
  /**
   * Datos del cuerpo de la tabla de detalles.
   * @type {RfcConsulta[]}
   */
  cuerpoTablaAcuseDeValorConsulta: AcuseDeValor[] = [];


  constructor(
    private readonly fb: FormBuilder,
  ) {
    this.formularioAgregarCove = this.fb.group({
      coveBusqueda: ['', [Validators.required, Validators.maxLength(13)]],
      metodoValoracionAduanera: ['', Validators.required],
    })
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  agregarCove() {
    console.log('agregar cove');
  }

  seleccionTabla() { }

}
