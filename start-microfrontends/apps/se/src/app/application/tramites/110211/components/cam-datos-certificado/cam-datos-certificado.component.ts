import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subject,map, takeUntil } from 'rxjs';
import { CamCertificadoService } from '../../services/cam-certificado.service';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosCertificadoDeComponent } from '../../../../shared/components/datos-certificado-de/datos-certificado-de.component';
import { camCertificadoQuery } from '../../estados/cam-certificado.query';
import { camCertificadoStore } from '../../estados/cam-certificado.store';

/**
 * @descripcion
 * El componente `CamDatosCertificadoComponent` es responsable de gestionar los datos y las interacciones
 * relacionadas con el formulario de certificado en el módulo CAM.
 */
@Component({
  selector: 'app-cam-datos-certificado',
  templateUrl: './cam-datos-certificado.component.html',
  styleUrl: './cam-datos-certificado.component.scss',
  standalone: true,
  imports:[DatosCertificadoDeComponent,CommonModule]
})
export class CamDatosCertificadoComponent implements OnDestroy {
  /**
   * @descripcion
   * Indica si el idioma predeterminado está seleccionado.
   */
  idioma: boolean = true;

  /**
   * @descripcion
   * Almacena la lista de idiomas disponibles.
   */
  idiomaDatos: Catalogo[] = [];

  /**
   * @descripcion
   * Almacena la lista de entidades federativas disponibles.
   */
  entidadFederativas: Catalogo[] = [];

  /**
   * @descripcion
   * Almacena la lista de representaciones federales disponibles.
   */
  representacionFederal: Catalogo[] = [];

  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @descripcion
   * Almacena los valores del formulario de datos del certificado.
   */
  formDatosCertificadoValues!: { [key: string]: unknown};


  /**
   * Indica si el formulario debe mostrarse solo en modo de lectura.
   *
   * @type {boolean}
   * @memberof CamDatosCertificadoComponent
   * @see https://compodoc.app/
   */
  esFormularioSoloLectura: boolean = false;

      /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   * const isValid = this.pasoUnoComponent.validateForms();
   * const formsValidity = this.pasoUnoComponent.getAllFormsValidity();
   */
    @ViewChild('datosCertificadoDeRef') datosCertificadoDeComponent!: DatosCertificadoDeComponent;

  /**
   * @descripcion
   * Inicializa el componente con los servicios y dependencias requeridos.
   * @param camCertificadoService - Servicio para obtener datos relacionados con el certificado.
   * @param store - Almacén para gestionar el estado del formulario de certificado.
   */
  constructor(
    private camCertificadoService: CamCertificadoService,
    private store: camCertificadoStore,
    private query: camCertificadoQuery,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.query.formDatosCertificado$.pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe(estado => {
        this.formDatosCertificadoValues = estado;
    });
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
      })
    )
    .subscribe()
    
  }

  /**
 * @descripcion
 * Actualiza el almacén con los datos del formulario de certificado.
 * @param event - Objeto que contiene el nombre del grupo de formulario, el campo, el valor y el nombre del estado del almacén.
 */
setValoresStore(event: { formGroupName: string, campo: string, valor: string | undefined, storeStateName: string }): void {
  const { campo: CAMPO, valor: VALOR } = event;
  this.store.setFormDatosCertificadoGenric({ [CAMPO]: VALOR });
}
  /**
   * @descripcion
   * Actualiza el almacén con los datos del formulario.
   * @param e - Los datos del formulario a almacenar.
   */
  obtenerDatosFormulario(e: unknown): void {
    this.store.setFormDatosCertificado(e as { [key: string]: unknown});
  }

  /**
   * @descripcion
   * Actualiza el almacén con el idioma seleccionado.
   * @param estado - El idioma seleccionado.
   */
  idiomaSeleccion(estado: Catalogo): void {
    this.store.setIdiomaSeleccion(estado);
  }

  /**
   * @descripcion
   * Actualiza el almacén con la entidad federativa seleccionada.
   * @param estado - La entidad federativa seleccionada.
   */
  entidadFederativaSeleccion(estado: Catalogo): void {
    this.store.setEntidadFederativaSeleccion(estado);
  }

  /**
   * @descripcion
   * Actualiza el almacén con la representación federal seleccionada.
   * @param estado - La representación federal seleccionada.
   */
  representacionFederalSeleccion(estado: Catalogo): void {
    this.store.setRepresentacionFederalDatosSeleccion(estado);
  }

  /**
   * @descripcion
   * Actualiza el almacén con el estado de validación del formulario.
   * @param valida - El estado de validación del formulario.
   */
  setFormValida(valida: boolean): void {
    this.store.setFormValida({ datos: valida });
  }
    /**
   * @descripcion
   * Actualiza el almacén con el estado de validación del formulario.
   * @param validarFormularios - El estado de validación del formulario.
   */
  validarFormularios():boolean{
    return this.datosCertificadoDeComponent.validarFormularios();
  }

  /**
   * @descripcion
   * Hook del ciclo de vida que se llama cuando el componente se destruye.
   * Limpia los recursos y suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}