import { Component, OnDestroy } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  FolioTramite,
  FormaRequerimiento,
} from '../../models/datos-tramite.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { AutoridadService } from '../../services/autoridad.service';
import { CapturarRequerimientoComponent } from '../capturar-requerimiento/capturar-requerimiento.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeleccionarDocumentosComponent } from '../seleccionar-documentos/seleccionar-documentos.component';

/**
 * Componente que representa el requerimiento del trámite.
 * Incluye selección de pestañas, navegación y manejo de datos del folio.
 */
@Component({
  /** Selector utilizado para identificar el componente en el HTML */
  selector: 'app-requiremento',
  /** Define el componente como autónomo (standalone) */
  standalone: true,
  /**
   * Importa los módulos y componentes necesarios para el funcionamiento.
   * Incluye formularios reactivos, componentes personalizados y módulos comunes.
   */
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CapturarRequerimientoComponent,
    SeleccionarDocumentosComponent,
  ],
  /** Ruta del archivo HTML que define la estructura del componente */
  templateUrl: './requiremento.component.html',
  /** Ruta del archivo CSS que define los estilos del componente */
  styleUrl: './requiremento.component.css',
})
export class RequirementoComponent implements OnDestroy {
  /** Datos del folio del trámite */
  folioTramite: FolioTramite = {} as FolioTramite;

  /** Índice utilizado para controlar la navegación entre pestañas */
  indice: number = 1;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /**
   * Indicador booleano que determina si el botón del contenedor debe mostrarse.
   * `true` para mostrar el botón, `false` para ocultarlo.
   */
  containerbtn: boolean = true;

  /**
   * Constructor que inyecta los servicios necesarios para navegación y acceso a datos.
   *
   * @param {Router} router - Servicio de Angular para navegar entre rutas.
   * @param {ConsultaioQuery} consultaQuery - Query para consultar datos globales de la solicitud o sesión del usuario.
   * @param {AutoridadService} autoridadService - Servicio para obtener catálogos y datos de autoridad.
   */
  constructor(
    private router: Router,
    private consultaQuery: ConsultaioQuery,
    public autoridadService: AutoridadService
  ) {
    // Constructor vacío, se puede agregar lógica adicional si es necesario
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (
            this.consultaState?.tipoDeTramite ===
            'Registro de solicitud de servicio'
          ) {
            this.containerbtn = false;
          } else {
            this.containerbtn = true;
          }
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.autoridadService
      .agregarRequerimiento()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp: FormaRequerimiento) => {
        if (resp) {
          this.folioTramite = {
            folioTramite: resp.folioTramite,
            tipoTramite: resp.tipoTramite,
          };

          this.esDatosRespuesta = true;
          this.autoridadService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Cambia el índice de pestaña activa
   * @param i Índice de la pestaña seleccionada
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Navega a la página para capturar el texto libre
   */
  continuar(): void {
    this.router.navigate(['/agace/manifiesto-aereo/capturar-el-texto-libre']);
  }

  /**
   * Navega de regreso a la página principal del manifiesto aéreo
   */
  cancelar(): void {
    this.router.navigate(['/agace/manifiesto-aereo/main']);
  }

  /**
   * Método que se ejecuta cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
