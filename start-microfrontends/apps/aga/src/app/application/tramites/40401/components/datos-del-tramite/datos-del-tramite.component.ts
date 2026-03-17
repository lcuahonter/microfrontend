import {
  Catalogo,
  CatalogoSelectComponent,
  TituloComponent,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite40401State,
  Tramite40401Store,
} from '../../../../core/estados/tramites/tramite40401.store';
import { CatalogoLista } from '../../models/certi-registro.model';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { RegistroCaatAereoService } from '../../services/RegistroCaatAereoController.service';
import { Tramite40401Query } from '../../../../core/queries/tramite40401.query';

/**
 * Componente `DatosDelTramiteComponent`.
 *
 * Este componente es responsable de gestionar el formulario de datos del trámite 40401,
 * cargar información desde servicios externos (catálogos), validar reglas de negocio
 * y actualizar el estado del trámite en el store en tiempo real.
 */
@Component({
  selector: 'datos-del-tramite',
  templateUrl: './datos-del-tramite.component.html',
  styleUrls: ['./datos-del-tramite.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
  ],
})
export class DatosDelTramiteComponent implements OnInit, OnDestroy {

  /**
   * Expresión regular para validar el formato del código IATA/ICAO.
   * Permite letras, números, guiones y espacios.
   */
  readonly REGEX_CODIGO_CAAT = /^[A-Za-z0-9ÑñÁÉÍÓÚáéíóúÄËÏÖÜäëïöü\- ]*$/;

  /**
   * Formulario reactivo del trámite.
   */
  datosDelTramiteForm!: FormGroup;

  /**
   * Catálogo Tipo CAAT Aéreo.
   */
  optionsTipoCaat!: Catalogo[];

  /**
   * Catálogo Código IATA / ICAO.
   */
  optionsCodigoIataIcao!: Catalogo[];

  /**
   * Subject para limpiar suscripciones.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual del trámite.
   */
  public solicitudState!: Tramite40401State;

  /**
   * Indica si el formulario es solo lectura.
   */
  readonly: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private registroCaatAereoService: RegistroCaatAereoService,
    public store: Tramite40401Store,
    public tramiteQuery: Tramite40401Query,
    private validacionesService: ValidacionesFormularioService,
    private consultaQuery: ConsultaioQuery
  ) {}

  /* =====================================================
   * CICLO DE VIDA
   * ===================================================== */

  ngOnInit(): void {

    // 1. Suscripción al estado del trámite (Recuperar datos previos)
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.solicitudState = state;
        })
      )
      .subscribe();

    // 2. Inicialización
    this.initializeForm();
    this.cargarCatalogos();

    // 3. Suscripción a modo readonly (Consulta)
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          if (state.readonly) {
            this.readonly = true;
            this.datosDelTramiteForm.disable();
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /* =====================================================
   * FORMULARIO
   * ===================================================== */

  /**
   * Inicializa el formulario reactivo con validaciones.
   */
  private initializeForm(): void {
    this.datosDelTramiteForm = this.formBuilder.group({
      tipoCaat: [
        this.solicitudState?.tipoCaat ?? '',
        [Validators.required],
      ],
      codigoIataIcao: [
        this.solicitudState?.codigoIataIcao ?? '',
        [Validators.required],
      ],
      codigo: [ // Campo de texto manual (3 caracteres)
        this.solicitudState?.codigo ?? '',
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.minLength(3),
          Validators.pattern(this.REGEX_CODIGO_CAAT)
        ],
      ],
    });
  }

  /**
   * Valida campos del formulario (Legacy support).
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }

  /**
   * Helper para validaciones en template (Moderna).
   */
  esControlValido(control: string): boolean {
    const formControl = this.datosDelTramiteForm.get(control);
    return !!(formControl?.invalid && (formControl?.dirty || formControl?.touched));
  }

  /* =====================================================
   * CATÁLOGOS
   * ===================================================== */

  /**
   * Carga los catálogos desde el servicio Backend.
   */
  cargarCatalogos(): void {
    // 1. Tipo CAAT Aéreo (TAGA)
    this.registroCaatAereoService
      .obtenerCAATAereo()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.optionsTipoCaat = datos.datos;
      });

    // 2. Código IATA / ICAO (CODTA)
    this.registroCaatAereoService
      .obtenerCodigoIataIcao()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.optionsCodigoIataIcao = datos.datos;
      });
  }

  /* =====================================================
   * STORE
   * ===================================================== */

  /**
   * Actualiza valores en el store Akita.
   * Contiene lógica para mapear IDs a Claves y forzar mayúsculas.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite40401Store
  ): void {
    let valor = form.get(campo)?.value;

    // LÓGICA 1: Si es el selector 'tipoCaat', buscar el objeto y guardar la CLAVE (ej. TAGA.ETP)
    // Esto es necesario porque el componente visual retorna el ID.
    if (campo === 'tipoCaat' && this.optionsTipoCaat) {
        const item = this.optionsTipoCaat.find((opt: any) => opt.id == valor);
        if (item && (item as any).codigo) { // Nota: Usamos 'codigo' según tu interfaz CatalogoItem
             valor = (item as any).codigo;
        } else if (item && (item as any).clave) { // Fallback por si la propiedad se llama clave
             valor = (item as any).clave;
        }
    }

    // LÓGICA 2: Si es el selector 'codigoIataIcao', buscar el objeto y guardar la CLAVE (ej. CODTA.IATA)
    else if (campo === 'codigoIataIcao' && this.optionsCodigoIataIcao) {
        const item = this.optionsCodigoIataIcao.find((opt: any) => opt.id == valor);
        if (item && (item as any).codigo) {
             valor = (item as any).codigo;
        } else if (item && (item as any).clave) {
             valor = (item as any).clave;
        }
    }

    // LÓGICA 3: Si es el campo de texto 'codigo', forzar MAYÚSCULAS
    else if (campo === 'codigo' && typeof valor === 'string') {
        valor = valor.toUpperCase();
        // Actualizamos visualmente el input sin disparar el evento de nuevo
        form.get(campo)?.setValue(valor, { emitEvent: false });
    }

    // Guardar en el Store el valor final procesado
    (this.store[metodoNombre] as (value: unknown) => void)(valor);
  }

  /**
   * Limpia el formulario y sincroniza el store con valores vacíos.
   */
  limpiar(): void {
    this.datosDelTramiteForm.reset();

    // Limpia estados de validación visual (bordes rojos)
    this.datosDelTramiteForm.markAsPristine();
    this.datosDelTramiteForm.markAsUntouched();

    // Actualiza el store para reflejar que está vacío
    this.setValoresStore(this.datosDelTramiteForm, 'tipoCaat', 'setTipoCaat');
    this.setValoresStore(
      this.datosDelTramiteForm,
      'codigoIataIcao',
      'setCodigoIataIcao'
    );
    this.setValoresStore(
      this.datosDelTramiteForm,
      'codigo',
      'setCodigo'
    );
  }
}