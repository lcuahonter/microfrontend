import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFecha, InputFechaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { TramiteState, TramiteStore } from '../../estados/tramite220703.store';
import { map, takeUntil } from 'rxjs';
import { AcuicolaService } from '../../service/acuicola.service';
import { PagoDeDerechos } from '../../modelos/acuicola.model';
import { Subject} from 'rxjs';
import { TramiteStoreQuery } from '../../estados/tramite220703.query';

@Component({
  selector: 'app-pago-derechos',
  standalone: true,
  imports: [
    TituloComponent,
    ReactiveFormsModule,
    InputFechaComponent
  ],
  templateUrl: './pago-derechos.component.html',
  styleUrl: './pago-derechos.component.scss'
})
export class PagoDerechosComponent implements OnInit, OnDestroy {

  /**
    * Formulario reactivo para gestionar los datos del pago de derechos.
    */
  pagosDerechosForm!: FormGroup;

  /**
   * Subject utilizado para gestionar la destrucción de suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
  * @type {TramiteState}
  * @description Variable que almacena el estado inicial de un trámite. Se inicializa como un objeto vacío y se fuerza su tipo a TramiteState.
  */
  tramiteState: TramiteState = {} as TramiteState;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Indica si el campo debe ser deshabilitado.
   * @property {boolean} campoDeshabilitar
   */
  campoDeshabilitar: boolean = false;

  /**
   * Configuración para el campo de fecha de pago (versión estándar).
   * @type {InputFecha}
   */
  fachaDePago: InputFecha = {
    labelNombre: 'Fecha de pago',
    required: false,
    habilitado: false,
  };

  /**
   * Constructor del componente.
   * 
   * @param fb Servicio de FormBuilder para crear formularios reactivos.
   * @param acuicolaService Servicio para interactuar con la lógica de negocio relacionada con la acuicultura.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly acuicolaService: AcuicolaService,
    private tramiteStore: TramiteStore,
    private tramiteStoreQuery: TramiteStoreQuery,
  ) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Inicializa el formulario y carga los datos del pago de derechos.
   */
  ngOnInit(): void {
    this.iniciarFormulario();
    this.pagoDeCargarDatos();

    this.tramiteStoreQuery.selectSolicitudTramite$.pipe(
      takeUntil(this.destroyNotifier$),
      map((datos: TramiteState) => {
        this.tramiteState = datos;
        this.pagosDerechosForm.patchValue({
          fechaDePago: datos.fechaDePago,
          claveDeReferencia: datos.claveDeReferencia,
          cadenaDependencia: datos.cadenaDependencia,
          banco: datos.banco,
          llaveDePago:datos.llaveDePago,
          importeDePago: datos.importeDePago
        });
      })
    )
      .subscribe();
  }

  /**
   * Inicializa el formulario reactivo con los controles necesarios.
   */
  iniciarFormulario(): void {
    this.pagosDerechosForm = this.fb.group({
      claveDeReferencia: [{ value: this.tramiteState.claveDeReferencia, disabled: true }, Validators.required],
      cadenaDependencia: [{ value: this.tramiteState.cadenaDependencia, disabled: true }, Validators.required],
      banco: [{ value: this.tramiteState.banco, disabled: true }, Validators.required],
      llaveDePago: [{ value: this.tramiteState.llaveDePago, disabled: true }, Validators.required],
      fechaDePago: [{ value: this.tramiteState.fechaDePago, disabled: true }, Validators.required],
      importeDePago: [{ value: this.tramiteState.importeDePago, disabled: true }, Validators.required],
    });
  }
  /**
   * Cambia la fecha de pago de derechos en el almacén de trámite.
   * @param {string} nuevo_valor - El nuevo valor de la fecha de pago de derechos.
   * @returns {void} No retorna ningún valor.
   */
  cambioFechaPagoDeDerechos(nuevo_valor: string): void {
    this.tramiteStore.setFechaPagoDeDerechos(nuevo_valor);
  }

  /**
   * Carga los datos del pago de derechos desde el servicio.
   */
  pagoDeCargarDatos(): void {
    this.acuicolaService
      .pagoDeCargarDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: PagoDeDerechos) => {
        this.pagosDerechosForm.patchValue(data);
      })
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Se encarga de liberar las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.unsubscribe();
  }
}
