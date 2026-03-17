import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CertificadoTecnicoJaponService } from '../../service/certificadoTecnicoJapon.service';
import { REGEX_NUMEROS_DECIMALES } from '@libs/shared/data-access-user/src';
import { REG_X } from '@libs/shared/data-access-user/src';

import { Tramite110218Query } from '../../estados/queries/tramite110218.query';
import { Tramite110218Store } from '../../estados/tramites/tramite110218.store';

import { Component, EventEmitter,Input, OnDestroy, OnInit, Output } from '@angular/core';
import { OnChanges } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Solicitud110218State } from '../../estados/tramites/tramite110218.store';
import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs';

/**
 * Componente para el formulario de mercancías seleccionadas.
 *
 * Este componente permite a los usuarios ingresar y modificar los detalles de las mercancías seleccionadas,
 * incluyendo información como nombres, marcas, valores, cantidades y detalles de la factura.
 */
@Component({
  selector: 'app-mercancias-seleccionadas-form',
  standalone: true,
  imports: [CommonModule, CatalogoSelectComponent, ReactiveFormsModule],
  templateUrl: './mercancias-seleccionadas-form.component.html',
  styleUrl: './mercancias-seleccionadas-form.component.scss',
})
export class MercanciasSeleccionadasFormComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Evento para enviar los datos modificados al padre y cerrar el modal.
   */
  @Input() selectedRow!: import('../../models/certificado-tecnico-japon.enum').CompliMentaria;
  /**
   * Evento para enviar los datos modificados al padre.
   */
  @Output() datosModificados = new EventEmitter<import('../../models/certificado-tecnico-japon.enum').CompliMentaria>();
  /**
   * Evento para cerrar el modal.
   */
  @Output() closeModalEvent = new EventEmitter<void>();
  /**
   * Opciones para la unidad de medida de comercialización.
   * Contiene un arreglo de objetos de tipo `Catalogo`.
   */

  unidaddeMedidadeComercializacionOptions: Catalogo[] = [];

  /**
   * Opciones para el tipo de factura.
   * Contiene un arreglo de objetos de tipo `Catalogo`.
   */
  tipodeFacturaOptions: Catalogo[] = [];

  /**
   * Formulario reactivo para modificar los datos del certificado.
   * Contiene campos como nombre comercial, marca, valor de mercancía, etc.
   */
  modifydatosdelcertificado!: FormGroup;

  /**
   * Estado seleccionado del trámite 110218.
   * Contiene los valores actuales almacenados en el estado global.
   */
  estadoSeleccionado!: Solicitud110218State;

  /**
   * Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Datos recibidos para la tabla.
   * Contiene un arreglo de objetos con información como nombre comercial y nombre en inglés.
   */
  receivedData: { nombreComercial: string; nombreIngles: string }[] | null = null;

  /**
   * Evento que se emite cuando la modificación se realiza con éxito.
   * Emite un valor booleano indicando el éxito de la operación.
   */
  @Output() modificarÉxitoBtn = new EventEmitter<boolean>();

  /**
   * Constructor del componente.
   *
   * @param formBuilder - Constructor de formularios reactivos.
   * @param service - Servicio para obtener datos del certificado técnico de Japón.
   * @param tramite110218Query - Query para consultar el estado del trámite 110218.
   * @param tramite110218Store - Store para manejar el estado del trámite 110218.
   * @param router - Servicio de enrutamiento.
   */
  constructor(
    public formBuilder: FormBuilder,
    private service: CertificadoTecnicoJaponService,
    private tramite110218Query: Tramite110218Query,
    private tramite110218Store: Tramite110218Store,
    private router: Router
  ) {}

  /**
   * Inicializa el formulario reactivo con valores predeterminados y validaciones.
   * Los campos incluyen nombre comercial, marca, valor de mercancía, cantidad, etc.
   */
  inicializarFormulario(): void {
    this.modifydatosdelcertificado = this.formBuilder.group({
      /**
       * Nombre comercial de la mercancía.
       * Campo de solo lectura.
       */
      nombreComercial: [{ value: '', disabled: true }],
      /**
       * Nombre en inglés de la mercancía.
       * Campo de solo lectura.
       */
      nombreIngles: [{ value: '', disabled: true }],
      /**
       * Complemento de la descripción de la mercancía.
       * Campo obligatorio.
       */
      complementoDelaDescripcion: [
        this.estadoSeleccionado?.complementoDelaDescripcion,
        [Validators.required],
      ],
      /**
       * Marca de la mercancía.
       * Campo obligatorio.
       */
      marca: [this.estadoSeleccionado?.marca, [Validators.required]],
      /**
       * Valor de la mercancía.
       * Campo obligatorio, solo permite números con hasta 4 decimales.
       */
      valorMercancia: [
        this.estadoSeleccionado?.valorMercancia,
        [Validators.required, Validators.pattern(REGEX_NUMEROS_DECIMALES)],
      ],
      /**
       * Cantidad de la mercancía.
       * Campo de solo lectura.
       */
      cantidad: [{ value: '', disabled: true }],
      /**
       * Unidad de medida de comercialización.
       * Campo obligatorio, selección de lista desplegable.
       */
      unidaddeMedidadeComercializacion: [
        this.estadoSeleccionado?.unidaddeMedidadeComercializacion,
        Validators.required,
      ],
      /**
       * Número de factura.
       * Campo obligatorio, solo permite valores alfanuméricos.
       */
      numerodeFactura: [
        this.estadoSeleccionado?.numerodeFactura,
        [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)],
      ],
      /**
       * Tipo de factura.
       * Campo obligatorio, selección de lista desplegable.
       */
      tipodeFactura: [
        this.estadoSeleccionado?.tipodeFactura,
        Validators.required,
      ],
      /**
       * Fecha de la factura.
       * Campo de solo lectura.
       */
      fechadelaFactura: [{ value: '', disabled: true }],
    });
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Obtiene los datos necesarios y configura el formulario.
   */
  ngOnInit(): void {
    this.unidadMedidaData();
    this.tipoDeFactura();
    this.getValorStore();
    this.inicializarFormulario();
    if (this.selectedRow) {
      this.modifydatosdelcertificado.patchValue({
        nombreComercial: this.selectedRow.nombreComercial,
        nombreIngles: this.selectedRow.nombreIngles,
        cantidad: this.selectedRow.cantidad,
        fechadelaFactura: this.selectedRow.fechadelaFactura,
      });
    }
  }
  /**
   * Detecta cambios en las propiedades de entrada del componente.
   * Actualiza el formulario con los datos de la fila seleccionada si están disponibles.
   */

    ngOnChanges(): void {
    if (this.selectedRow && this.modifydatosdelcertificado) {
      this.modifydatosdelcertificado.patchValue({
        nombreComercial: this.selectedRow.nombreComercial,
        nombreIngles: this.selectedRow.nombreIngles,
        cantidad: this.selectedRow.cantidad,
        fechadelaFactura: this.selectedRow.fechadelaFactura,
      });
    }
  }

  /**
   * Obtiene los datos de la unidad de medida desde el servicio.
   * Actualiza las opciones disponibles en el formulario.
   */
  unidadMedidaData(): void {
    this.service
      .getUnidadMedida()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: Catalogo[]) => {
        this.unidaddeMedidadeComercializacionOptions = data;
      });
  }

  /**
   * Obtiene los datos del tipo de factura desde el servicio.
   * Actualiza las opciones disponibles en el formulario.
   */
  tipoDeFactura(): void {
    this.service
      .getTipodeFctura()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: Catalogo[]) => {
        this.tipodeFacturaOptions = data;
      });
  }

  /**
   * Establece los valores de los datos de la tabla en el formulario.
   * Actualiza campos como nombre comercial, nombre en inglés, cantidad y fecha de la factura.
   */
  tableDataValues(): void {
    if (this.selectedRow) {
      this.modifydatosdelcertificado.patchValue({
        nombreComercial: this.selectedRow.nombreComercial,
        nombreIngles: this.selectedRow.nombreIngles,
        cantidad: this.selectedRow.cantidad,
        fechadelaFactura: this.selectedRow.fechadelaFactura,
      });
    }
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Redirige al usuario a la pantalla de validación del certificado técnico de Japón.
   * Emite un evento indicando que la modificación fue exitosa.
   */
  modificarSuccess(): void {
    this.modificarÉxitoBtn.emit(true);
  }

  /**
   * Actualiza un valor específico en el store del trámite.
   *
   * @param FormGroup - Formulario reactivo.
   * @param control - Nombre del control cuyo valor se actualizará en el store.
   */
  setValorStore(FormGroup: FormGroup, control: string): void {
    const VALOR = FormGroup.get(control)?.value;
    this.tramite110218Store.setTramite110218State({
      [control]: VALOR,
    });
  }

  /**
   * Obtiene el estado actual del trámite desde el store.
   * Suscribe al observable del estado y actualiza la propiedad `estadoSeleccionado`.
   */
  getValorStore(): void {
    this.tramite110218Query.selectTramite110218State$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoSeleccionado = data;
      });
  }

  /**
   * Cierra el modal emitiendo el evento correspondiente.
   */
  closeModal(): void {
    this.closeModalEvent.emit();
  }

  /**
   * Envía los datos modificados al padre y cierra el modal.
   */
  modificarYCerrar(): void {
    if (this.modifydatosdelcertificado.valid) {
      // Emitir un objeto que combine la fila seleccionada y los valores del formulario
      const VALORES_FORM = this.modifydatosdelcertificado.getRawValue();
      const DATOS_COMPLETOS = {
        ...this.selectedRow,
        ...VALORES_FORM
      };
      this.datosModificados.emit(DATOS_COMPLETOS);
      this.closeModal();
    } else {
      this.modifydatosdelcertificado.markAllAsTouched();
    }
  }
}