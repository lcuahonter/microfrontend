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
  CatalogoServices,
  TablaDinamicaComponent,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DETALLE_MERCANCIA_TABLA } from '../../constantes/datos-solicitud.enum';
import { DatosDomicilioLegalQuery } from '../../estados/queries/datos-domicilio-legal.query';
import { DatosDomicilioLegalStore } from '../../estados/stores/datos-domicilio-legal.store';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { DetalleMercancia } from '../../models/detalle-mercancia.model';

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
export class DetalleMercanciaComponent implements OnInit, OnDestroy {
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
@Output() agregarDetalleMercancia = new EventEmitter<DetalleMercancia>();
  /**
   * Emite el evento cuando se elimina una lista de mercancías.
   */
  @Output() eliminarMercancia: EventEmitter<DetalleMercancia[]> =
    new EventEmitter<DetalleMercancia[]>(true);
    /**
     * Suscripción para manejar observables.
     */
    private subscription: Subscription = new Subscription();
     /**
   * Identificador del trámite asociado a la ampliación de 3Rs.
   */
  tramiteID: string = '260203';
    /**
   * Notificador para gestionar la destrucción o desuscripción de observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    public datosSolicitudService: DatosSolicitudService,
    private catalogoServices: CatalogoServices,
    private datosDomicilioLegalStore: DatosDomicilioLegalStore,
    private datosDomicilioLegalQuery: DatosDomicilioLegalQuery,
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
    this.obtenerdatosFormFormaceutica();
    // this.datosSolicitudService.obtenerRespuestaPorUrl(
    //   this,
    //   'datosFormFormaceutica',
    //   '/cofepris/formaFarmaceutica.json'
    // );
  }

    /**
   * Obtiene la lista de sectores para selección.
   */
  obtenerdatosFormFormaceutica(): void {
    this.subscription.add(this.catalogoServices.formaFarmaceuticaCatalogo(this.tramiteID).pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe((data) => {
      const DATOS = data.datos as Catalogo[];
      if (data) {
            this.datosFormFormaceutica = DATOS;
          }
    }));
  }
  /**
   * Valida si el campo de un formulario no contiene errores
   * @param {AbstractControl} control  : Control del formulario
   * @param {string} campo  : Nombre del campo a validar, si el control es un FormGroup
   * @returns {boolean | null} : Retorna true si el campo contiene errores y ha sido tocado, de lo contrario retorna false
   */
  // eslint-disable-next-line class-methods-use-this
  public isValid(control: AbstractControl, campo?: string): boolean | null {
    if (control instanceof FormGroup && campo) {
      return control.controls[campo].errors && control.controls[campo].touched;
    }
    return control.errors && control.touched;
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
    const SELECTED_FORMA = this.datosFormFormaceutica.find(
      (ele) => ele.clave === this.formaDetalleMercancia.value.formaFormaceutica
    );

    const NEW_DETALLE: DetalleMercancia = {
      formaFormaceutica: SELECTED_FORMA ? SELECTED_FORMA.descripcion : '',
      numeroDeRegistro: this.formaDetalleMercancia.value.numeroDeRegistro,
      marcasDistintivas: this.formaDetalleMercancia.value.marcasDistintivas,
      tipoDeEnvase: this.formaDetalleMercancia.value.tipoDeEnvase,
    };

    // Emit the new detalle
    this.agregarMercanciaSellecion.emit(NEW_DETALLE);

    // Emit the detalle for agregarDetalleMercancia
    const DETALLE: DetalleMercancia = this.formaDetalleMercancia.getRawValue();
    console.log('Emitting detalle:', DETALLE);
    this.agregarDetalleMercancia.emit(DETALLE);

    // Update the observable for the table
    this.datosTablaDetalleMercancia = new Observable((observer) => {
      const CURRENT_DATA = (this.datosTablaDetalleMercancia as any)?.source?.value || [];
      observer.next([...CURRENT_DATA, NEW_DETALLE]);
      observer.complete();
    });

    // Reset the form
    this.formaDetalleMercancia.reset();
    this.formaDetalleMercancia.patchValue({ formaFormaceutica: '' });
  } else {
    this.formaDetalleMercancia.markAllAsTouched();
    console.error('Detalle Mercancía form is invalid');
  }
}
    ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
