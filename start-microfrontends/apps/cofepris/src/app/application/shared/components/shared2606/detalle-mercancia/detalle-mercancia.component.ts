import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Catalogo,
  CatalogoSelectComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DETALLE_MERCANCIA_TABLA } from '../../../constantes/shared2606/datos-solicitud.enum';
import { DatosSolicitudService } from '../../../services/shared2606/datos-solicitud.service';
import { DetalleMercancia } from '../../../models/shared2606/detalle-mercancia.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detalle-mercancia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './detalle-mercancia.component.html',
  styleUrl: './detalle-mercancia.component.scss',
})
export class DetalleMercanciaComponent implements OnInit {
  /**
   * Formulario reactivo para el detalle de la mercancía.
   */
  formaDetalleMercancia!: FormGroup;

  /**
   * Datos de detalle de la mercancía recibidos como entrada.
   */
  @Input() datosDetalleMercancia!: DetalleMercancia;

  /**
   * Configuración de la tabla para mostrar los detalles de las mercancías.
   */
  tablaDetalleMercancia = DETALLE_MERCANCIA_TABLA;

  /**
   * Tipo de selección de la tabla (en este caso, selección por checkbox).
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Observable que emite la lista de detalles de mercancías.
   */
  @Input() datosTablaDetalleMercancia!: Observable<DetalleMercancia[]>;

  /**
   * Datos para la forma farmacéutica.
   */
  datosFormFormaceutica: Catalogo[] = [];

  /**
   * Lista de mercancías seleccionadas o detalladas.
   */
  tablaMercanciasLista: DetalleMercancia[] = [];

  /**
   * Emite el evento cuando se agrega una mercancía.
   */
  @Output() agregarMercanciaSellecion: EventEmitter<DetalleMercancia> =
    new EventEmitter<DetalleMercancia>(true);

  /**
   * Emite el evento cuando se elimina una lista de mercancías.
   */
  @Output() eliminarMercancia: EventEmitter<DetalleMercancia[]> =
    new EventEmitter<DetalleMercancia[]>(true);

  constructor(
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    public datosSolicitudService: DatosSolicitudService
  ) {
    this.formaDetalleMercancia = this.fb.group({
      formaFormaceutica: ['', Validators.required],
      numeroDeRegistro: [''],
      marcasDistintivas: ['', Validators.required],
      tipoDeEnvase: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    if (this.datosDetalleMercancia) {
      this.formaDetalleMercancia.patchValue(this.datosDetalleMercancia);
    }
    this.datosSolicitudService.obtenerRespuestaPorUrl(
      this,
      'datosFormFormaceutica',
      '/cofepris/formaFarmaceutica.json'
    );
  }

  /**
   * Valida si el campo de un formulario no contiene errores
   * @param {AbstractControl} control  : Control del formulario
   * @param {string} campo  : Nombre del campo a validar, si el control es un FormGroup
   * @returns {boolean | null} : Retorna true si el campo contiene errores y ha sido tocado, de lo contrario retorna false
   */
  // eslint-disable-next-line class-methods-use-this
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Elimina las mercancías de la lista y emite el evento con los datos.
   */
  eliminarMercancias(): void {
    if (this.tablaMercanciasLista) {
      this.eliminarMercancia.emit(this.tablaMercanciasLista);
    }
  }

  /**
   * Valida el formulario, agrega los datos de la mercancía y emite el evento con la información.
   * Luego, restablece el formulario.
   */
  agregarMercancias(): void {
    if (this.formaDetalleMercancia.valid) {
      const DATOS = {
        ...this.formaDetalleMercancia.value,
        formaFormaceutica: this.datosFormFormaceutica.find(
          (ele) =>
            ele.id.toString() ===
            this.formaDetalleMercancia.value.formaFormaceutica
        )?.descripcion,
      };

      this.agregarMercanciaSellecion.emit(DATOS);
      this.formaDetalleMercancia.reset();
      //Es necesario restablecer el cuadro de selección a -1 para restablecer el formulario
      this.formaDetalleMercancia.patchValue({ formaFormaceutica: -1 });
    }
  }
}
