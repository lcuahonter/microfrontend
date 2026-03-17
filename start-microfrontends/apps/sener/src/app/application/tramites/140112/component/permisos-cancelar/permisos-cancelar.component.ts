import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PermisosCancelar } from '../../models/permisos-cancelar.model';
import { PermisosCancelarData } from '../../models/permisos-cancelar.model';

import { PermisosCancelarService } from '../../service/permisos-cancelar.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { Tramite140112Query } from '../../estados/tramite-140112.query';
import { Tramite140112Store } from '../../estados/tramite-140112.store';
import { Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-permisos-cancelar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TablaDinamicaComponent,
  ],
  providers: [PermisosCancelarService],
  templateUrl: './permisos-cancelar.component.html',
  styleUrls: ['./permisos-cancelar.component.scss'],
})
export class PermisosCancelarComponent implements OnInit, OnDestroy {
   /**
   * Indica si el formulario es de solo lectura.
   * @property {boolean} esSoloLectura
   */
  esSoloLectura!: boolean;
  update!: boolean;

  /** Enum para el tipo de selección de tabla */
  public TablaSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /** Configuración para las columnas de la tabla */
  configuracionTabla: ConfiguracionColumna<PermisosCancelar>[] = [
    { encabezado: '', clave: (item: PermisosCancelar) => item.id, orden: 1 },
    { encabezado: 'Folio trámite ', clave: (item: PermisosCancelar) => item.folioTramite, orden: 2 },
    { encabezado: 'Tipo solicitud ', clave: (item: PermisosCancelar) => item.tipoSolicitud, orden: 3 },
    { encabezado: 'Régimen ', clave: (item: PermisosCancelar) => item.regimen, orden: 4 },
    { encabezado: 'Clasificación régimen ', clave: (item: PermisosCancelar) => item.clasificacionRegimen, orden: 5 },
    { encabezado: 'Condición de la mercancía', clave: (item: PermisosCancelar) => item.condicionDeLaMercancia, orden: 6 },
    { encabezado: 'Fracción arancelaria ', clave: (item: PermisosCancelar) => item.fraccionArancelaria, orden: 7 },
  ];

  /** Array para almacenar la respuesta de permisos cancelar */
  permisosCancelar: PermisosCancelar[] = [];

  /** Subject para notificar la destrucción del componente */
  public destroy$ = new Subject<void>();

  /** Texto del manifiesto de veracidad */
  public manifestoDeVeracidad = 'De conformidad con el artículo 57, fracción I I, y 58 de la ley Federal de Procedimiento Administrativo Manifiesto decir verdad';

  /** Cuadro de texto para motivo desistimiento */
  public motivoDesistimientotextBox = '';

  /** Variable para almacenar las filas seleccionadas */
  public obtenerFilasSeleccionadas: PermisosCancelarData[] = [];

  /** Texto de confirmación de veracidad */
  public confirmarVeracidad = '';

  /** Booleano para verificar si la casilla declaracionEstaMarcado */
  public declaracionEstaMarcado = false;

  private destroyed$ = new Subject<void>();

  /** Grupo de formulario para motivo desistimiento */
  solicitud: FormGroup = this.fb.group({
    descripcionClobGenerica1: ['', [Validators.required]],
    declaracionBoolean: [false, Validators.requiredTrue]
  });

  /**
   * Constructor para inyectar dependencias
   * @param PermisosCancelarService Servicio para manejar operaciones de permisos cancelar
   * @param store Almacén para gestionar el estado del trámite
   * @param query Consulta para seleccionar el estado del trámite
   * @param fb FormBuilder para crear grupos de formularios
   */
  constructor(
    private store: Tramite140112Store,
    private query: Tramite140112Query,
    private PermisosCancelarService: PermisosCancelarService,
    private fb: FormBuilder, private consultaQuery: ConsultaioQuery
  ) {
    //constructer
     this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((estadoConsulta) => {
        this.esSoloLectura = estadoConsulta.readonly;
        this.update = estadoConsulta.update;
        if (this.esSoloLectura) {
          this.solicitud.disable();
        } else {
          this.solicitud.enable();
        }
      })
  }

  /**
   * Gancho de ciclo de vida OnInit
   */
  ngOnInit(): void {
    this.loadPermisoCancelar();
    this.query.selectDesistimiento$?.pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      this.solicitud?.patchValue({
        descripcionClobGenerica1: data.descripcionClobGenerica1,
        declaracionBoolean:data.declaracionBoolean
      });
    });
  
  }

/**
   * Cargar datos de permisos cancelar
   */
  loadPermisoCancelar(): void {
    this.PermisosCancelarService.getPermisosCancelar()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.permisosCancelar = response;
      });
  }

  /**
   * Gancho de ciclo de vida OnDestroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
     * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
     * @param form - El formulario reactivo.
     * @param campo - El nombre del campo en el formulario.
     */
    setValoresStore(form: FormGroup | null, campo: string): void {
      if (!form) {
        return;
      }
      const CONTROL = form.get(campo);
      if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
        this.store.establecerDatos({ [campo]: CONTROL.value });
      }
    }

  /**
     * Validar campo del formulario
     * @param field Nombre del campo
     * @returns Booleano que indica si el campo es válido
     */
  isValid(field: string): boolean {
    return Boolean(PermisosCancelarService.isValid(this.solicitud, field));
  }
}
