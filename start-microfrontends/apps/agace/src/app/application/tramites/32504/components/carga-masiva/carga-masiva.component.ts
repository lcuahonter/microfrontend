import {
  AlertComponent,
  SolicitanteQuery,
  descargarArchivoDeBase64,
} from '@ng-mf/data-access-user';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  DatosEmpresa,
  GuardarMasivoT32504Request,
} from '../../models/aviso.model';
import { PLANTILLA_NOMBRE_ARCHIVO, TEXTOS } from '../../constants/aviso.enum';
import { CatalogoT32504Service } from '../../services/catalogo-t32504.service';
import { CommonModule } from '@angular/common';
import { GuardarServiceT32504 } from '../../services/guardar-t32504.service';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite32504Query } from '../../estados/tramite32504.query';
import { Tramite32504Store } from '../../estados/tramite32504.store';

@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrl: './carga-masiva.component.scss',
  imports: [TituloComponent, AlertComponent, CommonModule],
  standalone: true,
})
export class CargaMasivaComponent implements OnInit {
  /** referencia a input de archivo */
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  /**
   * Archivo seleccionado para carga masiva.
   * @property {File | null} archivoMasivo - Archivo seleccionado o null si no hay ninguno.
   */
  archivoMasivo: File | null = null;
  
  /**
   * Mensaje de error para mostrar al usuario.
   * @property {string} mensajeError - Mensaje de error.
   */
  mensajeError: string = '';

  /**
   * Datos de la empresa obtenidos del estado del trámite.
   * @property {DatosEmpresa} datosEmpresa - Datos de la empresa.
   */
  datosEmpresa!: DatosEmpresa;

  /**
   * Objeto con las instrucciones.
   * @property {string} TEXTOS
   */
  TEXTOS = TEXTOS;
  

  constructor(
    private service: CatalogoT32504Service,
    private guardarService: GuardarServiceT32504,
    private tramiteQuery: Tramite32504Query,
    private tramiteStore: Tramite32504Store,
    private solicitanteQuery: SolicitanteQuery
  ) {}

  ngOnInit(): void {
    this.tramiteQuery.selectDatosEmpresa$.subscribe((res) => {
      this.datosEmpresa = res;
    });
  }

  /**
   * Descargar la plantilla para carga másiva del trámite.
   */
  plantillaClick(): void {
    this.service.obtenerPlantilla().subscribe((response) => {
      descargarArchivoDeBase64(response.codigo, {
        fileName: PLANTILLA_NOMBRE_ARCHIVO,
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
    });
  }

  /**
   * Manejar el cambio de archivo en el input.
   * @param event evento del cambio de archivo.
   */
  onFileChange(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    if (INPUT.files && INPUT.files.length > 0) {
      this.archivoMasivo = INPUT.files[0];
    }
  }

  /**
   * Cargar el archivo seleccionado.
   */
  cargarArchivo(): void {
    this.mensajeError = '';
    const PAYLOAD: GuardarMasivoT32504Request = {
      id_solicitud: null,
      solicitante: {
        rfc: 'AAL0409235E6',
        nombre: 'Juan Pérez',
        es_persona_moral: true,
        certificado_serial_number: 'string',
      },
      cve_rol_capturista: 'PersonaMoral',
      cve_usuario_capturista: 'AAL981209G67',
      numero_programa_immex: this.datosEmpresa.numero_programa_immex,
      clave_permiso_sedena: this.datosEmpresa.clave_permiso_sedena,
      ide_generica2: this.datosEmpresa.ide_generica2,
      ide_generica3: this.datosEmpresa.ide_generica3,
      tipo_llenado: '1',
      adace: '',
      tipo_carga: this.datosEmpresa.tipo_carga,
      representacion_federal: {
        cve_unidad_administrativa: '9915',
      },
    };

    const EXT = ['xls'];
    const FILE_EXT = this.archivoMasivo?.name.split('.').pop()?.toLowerCase();

    if (!this.archivoMasivo || !FILE_EXT || !EXT.includes(FILE_EXT)) {
      this.mensajeError = 'Inserte un archivo con formato xls.';
    } else {
      this.guardarService
        .postGuardarMasivo(PAYLOAD,this.archivoMasivo)
        .subscribe({
          next: (response) => {
            this.tramiteStore.update({
              idSolicitud: response.datos?.id_solicitud || null,
            });
            if (response.datos?.validacion_archivo) {
              this.mensajeError = response.datos.validacion_archivo;
              this.archivoMasivo = null;
              this.fileInput.nativeElement.value = '';
            }
          },
          error: (error) => {
            console.error('Error al cargar el archivo:', error);
            this.mensajeError = 'Ocurrió un error al cargar el archivo.';
          },
        });
    }
  }

  /**
   * Limpiar el archivo seleccionado.
   */
  limpiarArchivo(): void {
    this.archivoMasivo = null;
    this.fileInput.nativeElement.value = '';
    this.mensajeError = '';
  }
}
