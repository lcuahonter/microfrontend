/**
 * Componente que representa la descripción detallada de un cupo.
 * Se encarga de mostrar información específica sobre el cupo y su configuración.
*/
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tramite120402State, Tramite120402Store } from '../../estados/tramites/tramite120402.store';
import { AsignacionDirectaCupoPersonasFisicasPrimeraVezService } from '../../services/asignacion-directa-cupo-personas-fisicas-primera-vez.service';
import { CommonModule } from '@angular/common';
import { DescripcionDelCupo } from '../../models/asignacion-directa-cupo.model';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite120402Query } from '../../estados/queries/tramite120402.query';
import { takeUntil } from 'rxjs';

/**
 * Componente que representa la descripción detallada de un cupo.
 * Se encarga de mostrar información específica sobre el cupo y su configuración.
 */
@Component({
  selector: 'app-descripcion-del-cupo',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
  templateUrl: './descripcion-del-cupo.component.html',
  styleUrl: './descripcion-del-cupo.component.scss',
})
export class DescripcionDelCupoComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo que contiene la información de la descripción del cupo.
   */
  form!: FormGroup;
  /**
   * Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();
   /**
   * Carga la información de la descripción del cupo desde el servicio y la asigna al formulario.
   */
  
  public data: DescripcionDelCupo = {
    claveDelCupo: '',
    mecanismoDeAsignacion: '',
    descripcionDelProducto: '',
    unidadDeMedida: '',
    regimenAduanero: '',
    fechaDeInicioDeVigenciaDelCupo: '',
    fechaDeFinDeVigenciaDelCupo: '',
    fraccionesArancelarias: '',
    tratadoAcuerdo: '',
    paises: '',
  };

  /** Estado del trámite 120402.
   */
  public state!: Tramite120402State;


  /**
   * Constructor del componente.
   * @param fb FormBuilder para la creación del formulario.
   * @param service Servicio para obtener la información de la descripción del cupo.
   */
  constructor(
    private fb: FormBuilder,
    private service: AsignacionDirectaCupoPersonasFisicasPrimeraVezService,
    private tramite120402Store: Tramite120402Store,
    private tramite120402Query: Tramite120402Query,
  ) {
    this.tramite120402Query.tramiteState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state: Tramite120402State) => {
        if (state) {
          this.state = state;
        }
      });
    this.crearFormulario();
  }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.loadDescripcionDelCupo();
    
  }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }


  /**
   * Crea e inicializa el formulario con campos deshabilitados por defecto.
   */
crearFormulario(): void {
 this.form = this.fb.group({
      claveDelCupo: [{ value: this.data.claveDelCupo || '', disabled: true }],
      mecanismoDeAsignacion: [{ value: this.state?.descriptionCupo?.mecanismoAsignacion || '', disabled: true }],
      descripcionDelProducto: [{ value: this.state?.descriptionCupo?.nombreProducto || '', disabled: true }],
      unidadDeMedida: [{ value: this.state?.descriptionCupoDisponible?.mecanismoAsignacion?.cupo?.unidadMedidaComercializacion, disabled: true }],
      regimenAduanero: [{ value: this.state?.descriptionCupoDisponible?.mecanismoAsignacion?.cupo?.regimen || '', disabled: true }],
      fechaDeInicioDeVigenciaDelCupo: [{ value: this.state?.descriptionCupoDisponible?.mecanismoAsignacion?.fechaInicioVigencia || '', disabled: true }],
      fechaDeFinDeVigenciaDelCupo: [{ value: this.state?.descriptionCupoDisponible?.mecanismoAsignacion?.fechaFinVigencia || '', disabled: true }],
      fraccionesArancelarias: [{ value: this.state?.descriptionCupo?.fracciones || '', disabled: true }],
      tratadoAcuerdo: [{ value: this.state?.descriptionCupo?.idTratadoAcuerdo || '', disabled: true }],
      paises: [{ value: this.state?.descriptionCupoDisponible?.clavePais || '', disabled: true }]
    });
}

     

 
  /**
   * Carga la información de la descripción del cupo desde el servicio y crea el formulario.
   */
  loadDescripcionDelCupo(): void {
    this.service.getDescripcionDelCupo(this.data)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: DescripcionDelCupo) => {
        this.data = data;
        this.crearFormulario();
      });


  }
  
}
