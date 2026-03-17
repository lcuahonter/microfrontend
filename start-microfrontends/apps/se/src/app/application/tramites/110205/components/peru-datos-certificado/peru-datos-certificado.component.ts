import { Catalogo, ConsultaioQuery } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { DatosCertificadoDeComponent } from '../../../../shared/components/datos-certificado-de/datos-certificado-de.component';
import { FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PeruCertificadoService } from '../../services/peru-certificado.service';
import { Tramite110205Query } from '../../estados/tramite110205.query';
import { Tramite110205Store } from '../../estados/tramite110205.store';


/**
 * @descripcion
 * El componente `PeruDatosCertificadoComponent` es responsable de gestionar los datos y las interacciones
 * relacionadas con el formulario de certificado en el módulo PERU.
 */
@Component({
  selector: 'app-peru-datos-certificado',
  templateUrl: './peru-datos-certificado.component.html',
  styleUrl: './peru-datos-certificado.component.scss',
})
export class PeruDatosCertificadoComponent implements OnInit, OnDestroy {
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

  /**
   * @property {string} idProcedimiento
   * @description Identificador del procedimiento, utilizado para la gestión del trámite.
   */
  public idProcedimiento = 110205;

  /**
   * @private
   * Sujeto utilizado como notificador para destruir suscripciones y evitar fugas de memoria.
   * Este observable se completa cuando el componente se destruye.
   *
   * @command Utilice `this.destroyNotifier$.next()` seguido de `this.destroyNotifier$.complete()`
   * en el método `ngOnDestroy` para liberar recursos.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @descripcion
   * Almacena los valores del formulario de datos del certificado.
   */
  formDatosCertificadoValues!: { [key: string]: unknown };

  /**
   * @descripcion
   * Indica si el formulario de mercancía se encuentra en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Referencia al componente hijo DatosCertificadoDeComponent
   * Permite acceder al formulario y métodos del componente hijo
   */
  @ViewChild(DatosCertificadoDeComponent) datosCertificadoDeRef!: DatosCertificadoDeComponent;

  /**
   * @descripcion
   * Inicializa el componente con los servicios y dependencias requeridos.
   * @param fb - Instancia de FormBuilder para gestionar formularios.
   * @param peruCertificadoService - Servicio para obtener datos relacionados con el certificado.
   * @param store - Almacén para gestionar el estado del formulario de certificado.
   */
  constructor(
    private readonly fb: FormBuilder,
    private peruCertificadoService: PeruCertificadoService,
    private store: Tramite110205Store,
    private query: Tramite110205Query,
    private consultaQuery: ConsultaioQuery
  ) {
    this.query.formDatosCertificado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((estado) => {
        this.formDatosCertificadoValues = estado;
      });
  }

  /**
   * @descripcion
   * Hook del ciclo de vida que se llama después de inicializar el componente.
   * Obtiene los datos iniciales para el formulario.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * @descripcion
   * Actualiza el almacén con los datos del formulario de certificado.
   * @param event - Objeto que contiene el nombre del grupo de formulario, el campo, el valor y el nombre del estado del almacén.
   */
  setValoresStore(event: {
    formGroupName: string;
    campo: string;
    valor: undefined;
    storeStateName: string;
  }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormDatosCertificado({ [CAMPO]: VALOR });
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
   * Método público para validar todos los formularios del componente datos-certificado.
   * Valida el formulario del componente hijo DatosCertificadoDeComponent y actualiza el estado.
   * @returns boolean indicando si todos los formularios son válidos
   */
  public validateAll(): boolean {
    let valid = true;

    // Validar el componente hijo datos-certificado-de
    if (this.datosCertificadoDeRef) {
      // Usar el método validarFormularios del componente hijo que marca los campos como touched
      const IS_CHILD_FORM_VALID =
        this.datosCertificadoDeRef.validarFormularios();
      if (!IS_CHILD_FORM_VALID) {
        valid = false;
      }
      // Actualizar el estado de validez en el store
      this.setFormValida(IS_CHILD_FORM_VALID);
    }

    return valid;
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