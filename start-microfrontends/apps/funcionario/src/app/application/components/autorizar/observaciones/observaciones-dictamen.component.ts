import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TablaDinamicaComponent, TablaSeleccion } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { CONFIGURACION_OBSERVACIONES } from "../../../core/enums/dictamen.enum";
import { ConsultaObservacionesTabla } from "../../../core/models/dictamen.model";
import { DictamenObservacionesService } from '../../../core/service/dictamen-observaciones.service';
import { EncabezadoRequerimientoComponent } from '@libs/shared/data-access-user/src';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-observaciones-dictamen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EncabezadoRequerimientoComponent, TablaDinamicaComponent],
  templateUrl: './observaciones-dictamen.component.html',
  styleUrl: './observaciones-dictamen.component.scss',
})
export class ObservacionesDictamenComponent implements OnInit {
  /**
   * @description Variable que almacena el formulario de dictamen
   */
  public dictamenForm: FormGroup;
  /**
   * @description Variable que almacena las observaciones del dictamen
   */
  public observaciones: ConsultaObservacionesTabla[] = [];

  /**
   * Configuración de la tabla que se utilizará en el componente.
   * @type {any}
   */
  configuracionTabla = CONFIGURACION_OBSERVACIONES;
  /**
   * Selección de la tabla inicializada como indefinida.
   * @type {TablaSeleccion}
   */
  seleccionTabla = TablaSeleccion.UNDEFINED;

  /**
   * Datos que se mostrarán en la tabla.
   * @type {any}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public datosTabla!: any;

  constructor(private fb: FormBuilder, private router: Router, private dictamenObservacionesService: DictamenObservacionesService) {
    this.dictamenForm = this.fb.group({
      cumplimiento: [{ value: '1', disabled: true }],
      mensajeDictamen: ['']
    });
  }

  ngOnInit(): void {
    // Llamamos a los métodos para crear el formulario y obtener el rango de fechas
    this.getObservaciones();
  }

  // Método para obtener la solicitud de cancelación desde el servicio
  getObservaciones(): void {
    this.dictamenObservacionesService.getObservaciones()
      .pipe(
        takeUntilDestroyed(),
        map((data) => {
          this.observaciones = data;
        })
      ).subscribe();
  }

  /**
   * @description Metodo que redirige a la pantalla de Autorizar Dictamen
   */
  navegarAAutorizarDictamen(): void {
    this.router.navigate(['funcionario/autorizar-dictamen']);
  }
  /**
   * @description Metodo que redirige al Guardado de la Observacion
   */
  guardarObservaciones(): void {
    const MENSAJE_DICTAMEN = this.dictamenForm.get('mensajeDictamen')?.value;
    if (MENSAJE_DICTAMEN) {
      const NUEVA_OBSERVACION: ConsultaObservacionesTabla = {
        id: this.observaciones.length + 1,
        detalle: MENSAJE_DICTAMEN,
        fechaAtencion: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        fechaGeneracion: new Date().toISOString().split('T')[0],
        estatus: 'Atendido',
        generadaPor: 'Funcionario 1'
      };
      this.observaciones.push(NUEVA_OBSERVACION);
    }
    // Redirigir al componente BandejaPendientesComponent
    this.router.navigate(['funcionario/bandeja']);
  }
}
