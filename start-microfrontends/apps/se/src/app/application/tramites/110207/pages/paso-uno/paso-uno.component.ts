import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState} from '@ng-mf/data-access-user';
import { FormularioDinamico, JSONResponse, SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { CertificadoOrigenComponent } from '../../components/certificado-origen/certificado-origen.component';
import { CommonModule } from '@angular/common';
import { DatosCertificadoComponent } from '../../components/datos-certificado/datos_certificado.component';
import { DestinatarioDeComponent } from '../../components/destinatario-de/destinatario-de.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroService } from '../../services/registro.service';
import { Tramite110207Query } from '../../state/Tramite110207.query';
import { Tramite110207Store } from '../../state/Tramite110207.store';

/**
 * Componente que representa el primer paso del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SolicitanteComponent,
    CertificadoOrigenComponent,
    DatosCertificadoComponent,
    DestinatarioDeComponent,
  ],
  standalone: true,
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Catálogo de entidades federativas.
   */
  entidadFederativa!: { data: string } | null;
  /**
   * Notificador para destruir observables al destruir el componente.
   * Se utiliza para gestionar la cancelación de suscripciones activas y evitar fugas de memoria.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /**
   * Estado de la consulta obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

  /**
   * Indica si existen datos de respuesta del servidor para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Tipo de persona seleccionada.
   */
  tipoPersona!: number;

  /**
   * Configuración del formulario dinámico para la persona.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Configuración del formulario dinámico para el domicilio fiscal.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Referencia al componente DestinatarioComponent dentro de la vista.
   *
   * Esta propiedad permite acceder a los métodos y propiedades públicos del componente
   * hijo DestinatarioComponent desde el componente padre, facilitando la interacción
   * y manipulación directa del mismo.
   *
   * @see DestinatarioDeComponent
   */
  @ViewChild('destinatario', { static: true })
  destinatarioComponent!: DestinatarioDeComponent;

  /**
   * Componente padre que gestiona la lógica del certificado.
   *
   * @description
   * Este componente contiene la vista y el control del formulario principal,
   * además obtiene una referencia al componente hijo `CertificadoOrigenComponent`
   * mediante `@ViewChild` para invocar métodos y leer propiedades del hijo.
   */
  @ViewChild('certificadoOrigen', { static: true })
  certificadoDeOrigenComponent!: CertificadoOrigenComponent;

  /**
   * Referencia al componente `DatosCertificadoComponent` dentro de la vista.
   *
   * Esta propiedad permite acceder a los métodos y propiedades públicas del componente
   * hijo `DatosCertificadoComponent` desde el componente padre, facilitando la interacción
   * y manipulación de sus datos o comportamientos.
   *
   * @see DatosCertificadoComponent
   */
  @ViewChild('datosCertificado', { static: true })
  datosCertificadoComponent!: DatosCertificadoComponent;

  /**
   * Constructor del componente.
   * @param registro Servicio para obtener datos de catálogos.
   */
  constructor(
    private registro: RegistroService,
    private consultaQuery: ConsultaioQuery,
    public store: Tramite110207Store,
    public tramiteQuery: Tramite110207Query,
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Obtiene el catálogo de entidades federativas y lo procesa.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.update) {
              this.getMostrarDatos(Number(this.consultaState.id_solicitud));
              this.store.setIdSolicitud(Number(this.consultaState.id_solicitud));
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormularios();
    } else {
      this.esDatosRespuesta = true;
    }

    this.registro
      .getCatalogoById(21)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.entidadFederativa = resp;
        const DATA = JSON.parse(this.entidadFederativa.data);
        this.entidadFederativa = DATA?.domicilioFiscal?.entidadFederativa;
      });
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormularios(): void {
    this.registro
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.registro.actualizarEstadoFormulario(resp);
        }
      });
  }
  /**
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Método público para validar todos los formularios del paso uno */
  public validateAll(): boolean {
    let isValid = true;
    if (this.certificadoDeOrigenComponent) {
      if (!this.certificadoDeOrigenComponent.validateAll()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    if (this.datosCertificadoComponent) {
      if (!this.datosCertificadoComponent.validateAll()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    if (this.destinatarioComponent) {
      if (!this.destinatarioComponent.validateAll()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    return isValid;
  }

  /**
   *  Obtiene y establece los datos para mostrar una solicitud específica.
   * @param idSolicitud  Identificador de la solicitud a mostrar.
   */
  getMostrarDatos(idSolicitud: number): void {
      this.registro.getMostrarDatos(idSolicitud).pipe(takeUntil(this.destroyed$)).subscribe((resp: JSONResponse) => {
        if (resp.codigo === '00') {
          this.registro.setMostrarDatos(resp.datos as unknown as Record<string, unknown[]>);
        }
      });
    }

  /**
   * Método que se ejecuta al destruir el componente.
   * Cancela todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
