/**
 * Este componente maneja el formulario de registro de mercancía.
 */

import { Catalogo, CatalogoServices, InputFecha, REGEX_PATRON_ALFANUMERICO, REGEX_PATRON_DECIMAL_15_4 } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite110209State, Tramite110209Store } from '../../estados/stores/tramite110209.store';
import { CatalogoSelectComponent } from "@ng-mf/data-access-user";
import { CommonModule } from '@angular/common';
import { FECHA_FACTURA } from '../../constantes/certificado-sgp.enum';
import { InputFechaComponent } from "@ng-mf/data-access-user";
import { MercanciasService } from '../../services/mercancias/mercancias.service';
import { REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL} from '@ng-mf/data-access-user';
import { Router } from '@angular/router';
import { Tramite110209Query } from '../../estados/queries/tramite110209.query';

/**
 * Este componente maneja el formulario de registro de mercancía.
 */
@Component({
  selector: 'app-registro-de-mercancia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CatalogoSelectComponent, InputFechaComponent],
  templateUrl: './registro-de-mercancia.component.html',
  styleUrl: './registro-de-mercancia.component.scss',
})
export class RegistroDeMercanciaComponent implements OnInit, OnDestroy {

  /**
   * Formulario para el registro de mercancía.
   * @type {FormGroup}
   */
  mercanciaFrom!: FormGroup;

  /**
   * Opciones de tipo de factura.
   * @type {Catalogo[]}
   */
  tipoFacturaOptions!: Catalogo[];

  /**
   * Opciones de unidad de medida.
   * @type {Catalogo[]}
   */
  unidadOptions!: Catalogo[];

  /**
   * Subject que emite un evento cuando el componente es destruido,
   * permitiendo la desuscripción de observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();


  fechaDeLaFacturaInput: InputFecha = FECHA_FACTURA;
  /**
   * Evento que se emite cuando se modifica la mercancía.
   * @type {EventEmitter<boolean>}
   */
  @Output() modificarEventMercancia: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  /**
   * Identificador único del trámite asociado a este componente.
   * @default '110203'
   */
  tramites: string = '110209';

  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**  
  * Contiene el estado actual de la solicitud del trámite 110209.  
  * Permite acceder y manipular los datos relacionados con el flujo del trámite.  
  */
  public solicitudState!: Tramite110209State;

  /**
   * Constructor del componente.
   * Servicio para la creación de formularios reactivos y para obtener datos de mercancías.
   * @param {FormBuilder} fb - Servicio para la creación de formularios reactivos.
   * @param {MercanciasService} service - Servicio para obtener datos de mercancías.
   * @param {Router} router - Servicio para la navegación.
   * @param {Tramite110209Query} tramite110209Query - Servicio para consultar el estado del trámite.
   */
  constructor(private fb: FormBuilder, private service: MercanciasService, private router: Router, private tramite110209Query: Tramite110209Query,private tramite110209Store:Tramite110209Store, private catalogoService: CatalogoServices,) {
    this.mercanciaFrom = this.fb.group({
      nombreComercial: [{ value: '', disabled: true }],
      nombreIngles: [{ value: '', disabled: true }],
      descripcion: ['', Validators.pattern(REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL)],
      marca: ['', Validators.pattern(REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL)],
      valorMercancia: ['', Validators.pattern(REGEX_PATRON_DECIMAL_15_4)],
      cantidad: [{ value: '', disabled: true }, Validators.pattern(REGEX_PATRON_DECIMAL_15_4)],
      unidadMedida: [''],
      numeroFactura: ['', Validators.pattern(REGEX_PATRON_ALFANUMERICO)],
      tipoFactura: [''],
      fechaFactura: [{ value: '', disabled: true }]
    });
  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Obtiene las opciones de tipo de factura, unidad de medida y los valores de las mercancías.
   */
  ngOnInit(): void {
    this.getMercanciasValor();
    this.obtenerUnidadComercializacion();
    this.obtenerTipoFactura();
  }

  /**
   * Obtiene los valores de las mercancías desde el store y los asigna al formulario.
   */
    getMercanciasValor(): void {
    this.tramite110209Query.selectTramite110209$
    .pipe(
      takeUntil(this.destroyed$),
            map((seccionState) => {
            this.solicitudState = seccionState as Tramite110209State;
            })
          )
          .subscribe();
      
        this.mercanciaFrom = this.fb.group({
          nombreComercial: this.solicitudState.mercanciasSeleccionadas.nombreComercial,
          nombreIngles: this.solicitudState.mercanciasSeleccionadas.nombreIngles,
          descripcion:this.solicitudState.descripcion,
          marca:this.solicitudState.marca,
          valorMercancia:this.solicitudState.valorMercancia,
          cantidad: this.solicitudState.cantidad,
          unidadMedida:this.solicitudState.unidadMedida,
          numeroFactura:this.solicitudState.numeroFactura,
          tipoFactura:this.solicitudState.tipoFactura,
          fechaFactura: this.solicitudState.fechaFactura
        });

        if (this.mercanciaFrom.get('nombreComercial')) {
          this.mercanciaFrom.get('nombreComercial')?.disable();
        }
        if (this.mercanciaFrom.get('nombreIngles')) {
          this.mercanciaFrom.get('nombreIngles')?.disable();
        }
      }


    /**
     * Establece el valor en Tramite110209Store para el campo especificado del formulario.
     * 
     * @param {FormGroup} form - El grupo de formularios que contiene el campo.
     * @param {string} campo - El nombre del campo a obtener y guardar en el store.
     * @returns {void}
     */
    setValoresStore(form: FormGroup, campo: string): void {
      const VALOR = form.get(campo)?.value;
      this.tramite110209Store.setTramite110209({ [campo]: VALOR });
    }
  
 /*
   * Consulta el catálogo de unidades de medida de comercialización basado en los trámites actuales.
   * El resultado se almacena en la propiedad `comercializacion`.
   * Se cancela automáticamente la suscripción al destruir el componente.
   */
  obtenerUnidadComercializacion(): void {
    this.catalogoService.unidadesMedidaComercialCatalogo(this.tramites)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          this.unidadOptions = response?.datos ?? [];
        }
      });
  }

    /*
   * Consulta el catálogo de tipos de factura según los trámites actuales.
   * El resultado se almacena en la propiedad `tipoDatos`.
   * La suscripción se gestiona automáticamente al destruir el componente para evitar fugas de memoria.
   */
  obtenerTipoFactura(): void {
    this.catalogoService.tipoFacturaCatalogo(this.tramites)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          this.tipoFacturaOptions = response?.datos ?? [];
        }
      });
  }

  /**
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject destroyed$ para desuscribirse de todos los observables.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}