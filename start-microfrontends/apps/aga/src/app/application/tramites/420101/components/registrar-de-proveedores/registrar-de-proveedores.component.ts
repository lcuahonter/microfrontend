import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, REGISTRAR_PROVEEDORES_DE_TABLA, REGISTRAR_PROVEEDORES_MANUAL_DE_TABLA } from '../../constants/proveedores.enum';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

import { DatosDelRegistrar, DatosDelRegistrarManual } from '../../models/proveedores.model';
import { map, takeUntil} from 'rxjs';
import { Subject} from 'rxjs';

import { TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite420101State, Tramite420101Store } from '../../estados/tramite420101Store.store';
import { CommonModule } from '@angular/common';
import { Tramite420101Query } from '../../estados/tramite420101Query.query';

@Component({
  selector: 'app-registrar-de-proveedores',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './registrar-de-proveedores.component.html',
  styleUrl: './registrar-de-proveedores.component.scss',
})
export class RegistrarDeProveedoresComponent implements OnInit, OnDestroy {

  /**
  * Arreglo que almacena los datos del registro.
  * @type {DatosDelRegistrar[]}
  */
  datosTabla: DatosDelRegistrar[] = [];

  /**
   * Arreglo que almacena los datos de proveedores registrados manualmente.
   * @type {DatosDelRegistrarManual[]}
   */
  datosProveedoresManual: DatosDelRegistrarManual[] = [];

  /**
   * Configuración de las columnas para la tabla de registro de proveedores.
   * @type {ConfiguracionColumna<DatosDelRegistrar>[]}
   */
  configuracionTablaRegistrar: ConfiguracionColumna<DatosDelRegistrar>[] = REGISTRAR_PROVEEDORES_DE_TABLA;

  /**
   * Configuración de las columnas para la tabla de registro manual de proveedores.
   * @type {ConfiguracionColumna<DatosDelRegistrarManual>[]}
   */
  configuracionTablaRegistrarManual: ConfiguracionColumna<DatosDelRegistrarManual>[] = REGISTRAR_PROVEEDORES_MANUAL_DE_TABLA;

  /**
   * Tipo de selección utilizado en la tabla, definido como casillas de verificación (checkbox).
   * @type {TablaSeleccion}
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Subject privado que notifica la destrucción del componente para liberar recursos.
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false; 


  /**
   * Constructor del componente que inicializa las dependencias necesarias.
   * @param router - Servicio para la navegación entre rutas.
   * @param activatedRoute - Servicio para acceder a la ruta activa actual.
   * @param tramite420101Query - Servicio de consulta para datos relacionados con el trámite 420101.
   * @param tramite420101Store - Servicio de almacenamiento para datos relacionados con el trámite 420101.
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tramite420101Query: Tramite420101Query,
    private tramite420101Store: Tramite420101Store,
    private consultaQuery: ConsultaioQuery
  ) { 
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
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe al observable de datos de proveedores manuales y actualiza `datosProveedoresManual`.
   */
  ngOnInit(): void {
    this.tramite420101Query.getDatosProveedoresManual$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: DatosDelRegistrarManual[]) => {
        this.datosProveedoresManual = datos;
      });
      this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.tramite420101Query.selectTramiteState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state: Tramite420101State) => {
        this.datosTabla = (state.datosTabla as DatosDelRegistrarManual[]).map(item => ({
          ...item,
          id: item.id !== undefined ? item.id : 0
        })) as DatosDelRegistrar[];
      });
    }
  }

  /**
   * Analiza un archivo CSV y mapea sus datos a la estructura de `DatosDelRegistrar`.
   * @param csv - Contenido del archivo CSV como cadena de texto.
   */
  analizarGramaticalmenteCSV(csv: string): void {
    const LINES = csv.split('\n').filter(line => line.trim() !== '');
    const HEADERS = LINES[0].split(',');
    const HEADER_MAP: { [key: string]: string } = {
      'Id': 'id',
      'RFC': 'rfc',
      'Denominación o razón social': 'razonSocial',
      'Nombre completo ': 'nombreCompleto',
      'Domicilio fiscal': 'domicilioFiscal',
      'Norma': 'norma',
      'Número de programa IMMEX': 'numeroProgramaIMMEX',
      'Número de programa PROSEC': 'numeroProgramaPROSEC',
      'Aduana en las que opera': 'aduanasOpera',
    };
    const DATA = LINES.slice(1).map((line) => {
      const VALUES = line.split(',');
      const OBJ: { [key: string]: string } = {};
      HEADERS.forEach((header, index) => {
        const KEY = HEADER_MAP[header.trim()] || header.trim();
        OBJ[KEY] = VALUES[index]?.trim();
      });
      return OBJ;
    });

    this.datosTabla = DATA.map(item => ({
      id: parseInt(item['id'], 10) || 0,
      rfc: item['rfc'] || '-',
      razonSocial: item['razonSocial'] || '-',
      nombreCompleto: item['nombreCompleto'] || '-',
      domicilioFiscal: item['domicilioFiscal'] || '-',
      norma: item['norma'] || '-',
      numeroProgramaIMMEX: item['numeroProgramaIMMEX'] || '-',
      numeroProgramaPROSEC: item['numeroProgramaPROSEC'] || '-',
      aduanasOpera: item['aduanasOpera'] || '-',
    }));
  }

  /**
   * Lee un archivo CSV seleccionado por el usuario y lo procesa mediante `analizarGramaticalmenteCSV`.
   */
  archivo(): void {
    const FILE_INPUT = document.getElementById(
      'cargarArchivo'
    ) as HTMLInputElement;
    const FILE = FILE_INPUT.files?.[0];
    if (FILE) {
      const READER = new FileReader();
      READER.onload = (e): void => {
        const TEXT = e.target?.result as string;
        this.analizarGramaticalmenteCSV(TEXT);
      };
      READER.readAsText(FILE);
    }
  }

  /**
   * Navega a la ruta de registro de proveedores manual.
   */
  navigateRegistroProveedoresManual(): void {
    this.router.navigate(['..', 'registro-de-proveedores-manual'], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Completa el observable `destroyNotifier$` para liberar recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
