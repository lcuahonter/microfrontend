import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, catchError, map, of, takeUntil } from 'rxjs';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Tramite303Service } from '../../../../core/services/303/tramite303.service';

@Component({
  selector: 'pago-derechos',
  templateUrl: './pago-derechos.component.html',
  styleUrls: ['./pago-derechos.component.scss']
})
export class PagoDerechosComponent implements OnInit {
  /** Formulario para la captura de pago de derechos */
  public pagoDerechos!: FormGroup;
  /** Subject para destruir las suscripciones. */
  private destruirSuscripcion$: Subject<void> = new Subject();
  /** Catálogo de números IMMEX. */
  catBancos: Catalogo[] = [];
  /**
   * Constructor para el componente PagoDerechos
   * @param fb FormBuilder para la creación del formulario
   */
  constructor(private fb: FormBuilder,
    private servicios: Tramite303Service
  ) {
    this.crearPagoDerechosForm();
  }

  /**
   * Crea el formulario para la captura de pago de derechos
   */
  crearPagoDerechosForm(): void {
    this.pagoDerechos = this.fb.group({
      claveReferencia: [{ value: '', disabled: true }],
      cadenaDependencia: [{ value: '', disabled: true }],
      banco: [''],
      llavePago: [''],
      fechaPago: ['', Validators.required],
      importePago: [{ value: '', disabled: true }]
    });
  }


  /**
   * Método de ciclo de vida que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.catalogoBancos();
    this.obtenerDatosPago();
  }

  /**
   * Consulta el catálogo de bancos.
   */
  catalogoBancos(): void {
    this.servicios.consultaBanco()
      .pipe(
        map((data) => {
          if (data) {
            this.catBancos = data;
          }
        }),
        catchError((_error) => {
          console.error('Error al consultar catálogo IMMEX', _error);
          return of([]);
        }),
        takeUntil(this.destruirSuscripcion$)
      )
      .subscribe();
  }

  /**
   * Obtiene los datos de pago.
   */
  obtenerDatosPago(): void {
    this.servicios.consultaImportePago()
      .pipe(
        map((data) => {
          if (data) {
            this.pagoDerechos.patchValue(data);
          }
        }),
        catchError((_error) => {
          console.error('Error al consultar importe de pago', _error);
          return of([]);
        }),
        takeUntil(this.destruirSuscripcion$)
      )
      .subscribe();
  }

  /**
   * Borra los datos del formulario de pago de derechos
   */
  borrarDatosPago(): void {
    this.pagoDerechos.reset();
  }
}