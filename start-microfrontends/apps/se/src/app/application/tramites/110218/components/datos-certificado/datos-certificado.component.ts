import { CommonModule } from '@angular/common';

import { Component, ElementRef, ViewChild } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';

import { TablaDinamicaComponent, TablePaginationComponent } from '@libs/shared/data-access-user/src';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';

import {ConsultaioQuery } from "@ng-mf/data-access-user";

import { CertificadoTecnicoJaponService } from '../../service/certificadoTecnicoJapon.service';

import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';

import { Tramite110218Query } from '../../estados/queries/tramite110218.query';

import { Solicitud110218State, Tramite110218Store } from '../../estados/tramites/tramite110218.store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';

import { CERTIFICADO_TABLA } from '../../models/certificado-tecnico-japon.enum';
import { CompliMentaria } from '../../models/certificado-tecnico-japon.enum';
import { MercanciasSeleccionadasFormComponent } from '../mercancias-seleccionadas-form/mercancias-seleccionadas-form.component';
import { Modal } from 'bootstrap';

/**
 * Componente para mostrar y manejar los datos del certificado técnico de Japón.
 *
 * Este componente permite a los usuarios interactuar con los datos del certificado,
 * incluyendo la visualización de datos en una tabla dinámica, la selección de filas
 * y la navegación a otras secciones de la aplicación.
 */
@Component({
  selector: 'app-datos-certificado',
  standalone: true,
  imports: [CommonModule, TituloComponent, 
    ReactiveFormsModule, TablaDinamicaComponent,
    MercanciasSeleccionadasFormComponent,
    TablePaginationComponent],
  templateUrl: './datos-certificado.component.html',
  styleUrl: './datos-certificado.component.scss',
})
export class DatosCertificadoComponent implements OnInit, OnDestroy {
  /**
   * Referencia al modal de alerta de selección de mercancía
   */
  @ViewChild('modalSeleccionMercancia') modalSeleccionMercanciaElemento!: ElementRef;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Si es verdadero, el usuario no puede editar los campos del formulario.
   */
  esSoloLectura!: boolean;
  /**
   * Formulario para los datos del certificado.
   * Contiene campos como lugar y observaciones.
   */
  datosDelCertificado!: FormGroup;

  /**
   * Estado seleccionado del trámite 110218.
   * Contiene los valores actuales almacenados en el estado global.
   */
  estadoSeleccionado!: Solicitud110218State;

  /**
   * Configuración para la tabla de datos del certificado.
   * Define las columnas y propiedades de la tabla.
   */
  arregloConfiguracionTabla = CERTIFICADO_TABLA;

  /**
   * Tipo de selección de la tabla (radio).
   * Define el tipo de selección que se puede realizar en la tabla.
   */
  radioDeMesa = TablaSeleccion.RADIO;

  /**
   * Datos para la tabla.
   * Contiene un arreglo de objetos de tipo `CompliMentaria`.
   */
  datos: CompliMentaria[] = [];

  /**
   * Lista de filas seleccionadas en la tabla.
   * Contiene todas las filas seleccionadas por el usuario.
   */
  filaSeleccionada!: CompliMentaria;

  /**
   * Catálogo para el tipo de factura.
   * Contiene un arreglo de objetos de tipo `Catalogo`.
   */
  tipodeFactura: Catalogo[] = [];

  /**
   * Catálogo para la unidad de medida de comercialización.
   * Contiene un arreglo de objetos de tipo `Catalogo`.
   */
  unidaddeMedidadeComercializacion: Catalogo[] = [];

  /**
   * Subject para la destrucción del componente.
   * Utilizado para manejar la limpieza de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Datos seleccionados previamente en la tabla, obtenidos desde el store.
   */
  tablaSeleccionadaDeLaTienda: CompliMentaria | null = null;

  /**
   * Índice utilizado para propósitos internos del componente.
   */
  indice: number = 5;


  /**
   * Referencia al elemento del DOM identificado como 'mercanciasSeleccionadas'.
   * Utilizado para acceder y manipular directamente el elemento desde el componente.
   * 
   */
  @ViewChild('mercanciasSeleccionadas') mercanciasSeleccionadasElemento!: ElementRef;

  /**
   * Constructor del componente.
   *
   * formBuilder - Constructor de formularios reactivos.
   * service - Servicio para manejar operaciones relacionadas con certificados.
   * tramite110218Store - Store para manejar el estado relacionado con el Trámite 110218.
   * tramite110218Query - Query para recuperar datos relacionados con el Trámite 110218.
   */
  constructor(
    public formBuilder: FormBuilder,
    private service: CertificadoTecnicoJaponService,
    private tramite110218Store: Tramite110218Store,
    private tramite110218Query: Tramite110218Query,
    private consultaQuery: ConsultaioQuery,
  ) {}

  /**
   * Crea y configura el formulario para los datos del certificado.
   * Contiene los controles 'lugar' y 'observaciones' con sus respectivas validaciones.
   */
  inicializarFormulario(): void {
    this.datosDelCertificado = this.formBuilder.group({
      /**
       * El lugar donde se emite el certificado.
       * Este campo es obligatorio.
       */
      lugar: [this.estadoSeleccionado?.lugar, Validators.required],

      /**
       * Observaciones o comentarios relacionados con el certificado.
       * Este campo es obligatorio.
       */
      observaciones: [this.estadoSeleccionado?.observaciones, Validators.required],
    });
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Obtiene los datos de la tabla, se suscribe a los cambios en el store
   * y configura el formulario.
   */
  ngOnInit(): void {

    this.obtenerDatosDeTabla();
    this.getValorStore();
    this.inicializarFormulario();
     this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((estadoConsulta) => {
        this.esSoloLectura = estadoConsulta.readonly;
        this.habilitarDeshabilitarFormulario();
      });
  }

  /**
   * Habilita o deshabilita el formulario según el modo de solo lectura.
   * Si `esSoloLectura` es verdadero, deshabilita el formulario para evitar ediciones.
   * Si es falso, habilita el formulario para permitir modificaciones.
   */
  habilitarDeshabilitarFormulario(): void {
    if (this.esSoloLectura) {
      this.datosDelCertificado.disable();
    } else {
      this.datosDelCertificado.enable();
    }
  }

  /**
   * Obtiene los datos de la tabla desde el servicio.
   * Actualiza la propiedad `datos` con los datos obtenidos.
   */
  obtenerDatosDeTabla(): void {
    this.service
      .getDatosCertificado()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: { [key: string]: string | number | boolean }) => {
        this.datos = Array.isArray(data) ? (data as CompliMentaria[]) : [];
      });
  }

  /**
   * Maneja la selección de una fila en la tabla.
   * Actualiza la propiedad `filaSeleccionada` con la fila seleccionada.
   *
   * fila - Fila seleccionada en la tabla.
   */
  manejarFilaSeleccionada(fila: CompliMentaria): void {
    this.filaSeleccionada = fila; // Actualiza la fila seleccionada
  }

  /**
   * Navega a la sección de mercancías seleccionadas del formulario.
   * Almacena los valores de la fila seleccionada en el store y emite un evento para modificar el certificado.
   */
  enModificarFormulario(): void {
    if (this.filaSeleccionada) {
      if (this.mercanciasSeleccionadasElemento) {
        const MODAL_INSTANCIA = new Modal(
          this.mercanciasSeleccionadasElemento?.nativeElement,
          { backdrop: false }
        );
        MODAL_INSTANCIA.show();
      }
    }
  }

  /**
   * Nueva función para manejar el click en Modificar, muestra el modal de alerta si no hay selección
   */
  onModificarClick(): void {
    if (!this.filaSeleccionada) {
      const MODAL_ELEMENT = document.getElementById('modalSeleccionMercancia');
      if (MODAL_ELEMENT) {
        const MODAL_INSTANCE = new Modal(MODAL_ELEMENT);
        MODAL_INSTANCE.show();
      }
      return;
    }
    this.enModificarFormulario();
  }

  cerrarSeleccionMercanciaModal(): void {
    // Usar 'this' para cumplir con la regla de estilo
    const MODAL_ELEMENT = this.modalSeleccionMercanciaElemento?.nativeElement;
    if (MODAL_ELEMENT) {
      const MODAL_INSTANCE = Modal.getInstance(MODAL_ELEMENT);
      if (MODAL_INSTANCE) {
        MODAL_INSTANCE.hide();
      }
    }
  }
    /**
   * [ES] Cierra el modal asociado al elemento de registro de mercancía, si existe una instancia activa.
   * Utiliza la instancia del modal obtenida a través del elemento nativo y llama al método `hide()` para ocultarlo.
   */
  modalCancelar(): void {
  const ELEMENTO_MODAL = this.mercanciasSeleccionadasElemento;
  if (ELEMENTO_MODAL) {
    const MODAL_INSTANCIA = Modal.getInstance(ELEMENTO_MODAL.nativeElement);
    if (MODAL_INSTANCIA) {
      MODAL_INSTANCIA.hide();
    }
  }
}

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Limpia las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Actualiza un valor específico en el store del trámite.
   *
   * FormGroup - Formulario reactivo.
   * control - Nombre del control cuyo valor se actualizará en el store.
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
   * Maneja los datos modificados recibidos del formulario hijo y actualiza la tabla.
   */
  onDatosModificados(valores: CompliMentaria): void {
    // Mezclar los datos existentes de la fila seleccionada con los valores modificados del formulario
    if (this.filaSeleccionada) {
      this.filaSeleccionada = {
        ...this.filaSeleccionada,
        ...valores
      };
      
    }
  }
}