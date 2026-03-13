import { Catalogo, CatalogoSelectComponent, ConsultaioQuery, TituloComponent } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoServices } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosEmpresaService } from '../../services/datos-empresa.service';
import { Tramite120602Query } from '../../estados/tramite-120602.query';
import { Tramite120602Store } from '../../estados/tramite-120602.store';
/**
 * Componente que representa los datos de la solicitud en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,    
    CatalogoSelectComponent,
    ReactiveFormsModule
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrls: ['./datos-de-la-solicitud.component.scss'],
})
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {

  /**
   * El formulario para los datos de la solicitud.
   */
  public solicitudForm!: FormGroup;

  /**
   * La lista de tipos de empresa.
   */
  public tipoDeEmpresa!: Catalogo[];

  /**
   * Subject para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Indica si el formulario es de solo lectura.
   *
   * @type {boolean}
   * @memberof RegistroParaLaComponent
   */
  esFormularioSoloLectura: boolean = false; 

  /**
   * Identificador del trámite actual.
   * 
   * @remarks
   * Este valor representa el código único asociado al trámite que se está gestionando en el componente.
   */
  private tramites:string='120602';

  /** Notificador utilizado para cancelar suscripciones al destruir el componente.  
 *  Ayuda a prevenir fugas de memoria en flujos observables. */
  private destroyNotifier$: Subject<void> = new Subject();


  /**
   * Constructor de DatosDeLaSolicitudComponent.
   * @param fb El servicio FormBuilder.
   */
  constructor(private fb: FormBuilder, private store: Tramite120602Store, private query: Tramite120602Query, private service: DatosEmpresaService, private consultaioQuery: ConsultaioQuery,private catalogoService: CatalogoServices) {
    // Initialization logic can be added here if needed
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe()
  }

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {

    this.crearFormulario();
    // this.getTipoDeEmpresa();
    this.obtenerTipoDeEmpresa();

    this.query.selectTipoDeEmpresa$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((data)=>{
      this.solicitudForm.patchValue({
        tipoDeEmpresa: data
      })
    });

    this.query.selectActividadEconomicaClave$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((data)=>{
      this.solicitudForm.patchValue({
        actividadEconomicaClave: data
      });
    });


    if(this.esFormularioSoloLectura) {
      this.solicitudForm.get('tipoDeEmpresa')?.disable();
        this.solicitudForm.get('actividadEconomicaClave')?.disable();
    }else{
      this.solicitudForm.get('tipoDeEmpresa')?.enable();
        this.solicitudForm.get('actividadEconomicaClave')?.enable();
    }
  }

  /**
   * @description Verifica si un control del formulario es inválido.
   * @param nombreControl El nombre del control a verificar.
   * @returns Verdadero si el control es inválido y está tocado o modificado, de lo contrario, falso.
   */
  esInvalido(nombreControl: string): boolean {
    const CONTROL = this.solicitudForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * Crea el formulario para los datos de la solicitud.
   */
  crearFormulario(): void {
    this.solicitudForm = this.fb.group({
      tipoDeEmpresa: ['', Validators.required],
      denominacionExposicion: [{ value: '', disabled: true }, Validators.maxLength(120)],
      actividadEconomicaClave: ['', Validators.required],
      actividadEconomicaDescripcion: [{ value: '', disabled: true }]
    });
  }

  /**
   * Maneja la selección de un documento.
   * @param _e El objeto del evento.
   */
  
  public docSeleccionado(_e: Event): void {
    // Esta es una función dinámica; una vez que tengamos la API, la implementaremos.
    this.store.setTipoDeEmpresa(this.solicitudForm.get('tipoDeEmpresa')?.value);
  }

  /**
   * Actualiza la clave de actividad económica en el store.
   * 
   * @method setActividadEconomicaClave
   * @description Obtiene el valor actual del campo 'actividadEconomicaClave' del formulario
   *              y lo establece en el store mediante el método setActividadEconomicaClave.
   */
  public setActividadEconomicaClave(): void {
    this.store.setActividadEconomicaClave(this.solicitudForm.get('actividadEconomicaClave')?.value);
  }

/**
 * @description Obtiene el catálogo de tipos de empresa desde el servicio y asigna los datos a la variable `tipoDeEmpresa`.
 * @returns {void} No devuelve ningún valor, solo actualiza el estado del componente.
 */
obtenerTipoDeEmpresa(): void {
      this.catalogoService.obtenerTipoEmpresaCatalogo(this.tramites)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          this.tipoDeEmpresa = response?.datos ?? [];
        }
      });
}

/**
   * @method crearFormCombinacion
   * @description Método para crear el formulario formCombinacion.
   */ 
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
