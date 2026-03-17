import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TituloComponent } from '@libs/shared/data-access-user/src';

@Component({
    selector: 'app-carga-detalle-mercancia',
    standalone: true,
    imports: [CommonModule, TituloComponent],
    templateUrl: './carga-detalle-mercancia.component.html',
    styleUrls: ['./carga-detalle-mercancia.component.scss']
})
export class CargaDetalleMercanciaComponent {
    /**
     * Evento que se emite para cerrar el componente de detalles de animales vivos.
     * Permite al componente padre manejar la acción de cierre del modal o sección.
     * 
     * @type {EventEmitter<void>}
     */
    @Output() cerrar = new EventEmitter<void>();

    private _archivoBase64: string | undefined;

    /**
     * Evento que emite los datos extraídos del archivo cargado masivamente.
     * Permite al componente padre recibir los datos procesados.
     * 
     * @type {EventEmitter<Record<string, string>[]>}
     */
    @Output() listaEmitida = new EventEmitter<Record<string, string>[]>();

    /**
     * Nombre del archivo cargado o seleccionado por el usuario.
     * 
     * @remarks
     * Esta propiedad almacena el nombre del archivo que se utiliza en el proceso de carga masiva de mercancía.
     */
    nombreArchivo: string = '';

    /**
     * Almacena el mensaje de error que se mostrará en la interfaz de usuario.
     * Se utiliza para informar al usuario sobre problemas o validaciones fallidas.
     */
    mensajeError: string = '';

    /**
     * @output accionDelHijo
     * 
     * Evento emitido por el componente hijo para notificar al componente padre que se ha realizado una acción.
     * No envía ningún dato adicional, solo indica que ocurrió una acción.
     */
    @Output() accionDelHijo = new EventEmitter<void>();

    @Output() accionDelHijoLimpiaLista = new EventEmitter<void>();

    constructor(
    private readonly fb: FormBuilder,
    private http: HttpClient

    ) {
    }

/**
 * Agrega animales a la lista actual.
 * 
 * Este método ejecuta la acción correspondiente para agregar animales,
 * llamando internamente al método `ejecutarAccion`.
 * 
 * @remarks
 * Utilizar este método cuando se requiera añadir animales en el flujo de carga masiva de mercancía.
 */
agregarAnimales(): void {
  this.ejecutarAccion();
}

/**
 * Cancela la operación actual.
 *
 * Este método ejecuta la lógica necesaria para cancelar la acción en curso,
 * como cerrar un modal o reiniciar un formulario. Llama a los métodos
 * `ejecutarAccion` y `ejecutarAccionLimpiaLista` para realizar las acciones
 * correspondientes al proceso de cancelación.
 */
cancelar(): void {
  // Implementa aquí la lógica de cancelación, por ejemplo, cerrar el modal o reiniciar el formulario
  this.ejecutarAccion();
  this.ejecutarAccionLimpiaLista();
}

cargarArchivoMasivo(event?: Event): void {
    let archivo: File | null = null;

    // Obtiene la información del archivo seleccionado
    if (event) {
      const TARGET = event.target as HTMLInputElement;
      if (TARGET.files && TARGET.files.length > 0) {
        archivo = TARGET.files[0];
        // Leer el archivo como texto y extraer el contenido separado por comas
        const TEXT_READER = new FileReader();
        TEXT_READER.onload = (): void => {
          const CONTENIDO = TEXT_READER.result as string;
          // Separar el contenido por comas
            // Validar que el archivo contenga la estructura esperada
            const CABECERA_ESPERADA = [
            'Numero de lote',
            'Color/Pelaje',
            'Edad animal',
            'Fase de desarrollo',
            'Función zootécnica',
            'Nombre de la mercancía',
            'Número de identificación',
            'Raza',
            'Nombre científico',
            'Sexo'
            ];
            const LINEAS = CONTENIDO.split(/\r?\n/);
            const CABECERA = LINEAS[0].split(',');
            const ES_VALIDA = CABECERA.length === CABECERA_ESPERADA.length &&
              CABECERA_ESPERADA.every((col, idx) => col.trim() === (CABECERA[idx]?.trim() ?? ''));
            this.mensajeError = '';
            if (!ES_VALIDA) {
            this.mensajeError = 'Error en la linea 0 { El número de columnas es incorrecta }.';
            return;
            }
            // Convertir las líneas (excepto la cabecera) en objetos JSON
            const DATOS_SEPARADOS = LINEAS.slice(1)
              .filter(linea => linea.trim() !== '')
              .map(linea => {
              const VALORES = linea.split(',');
              const OBJETO: Record<string, string> = {};
              CABECERA_ESPERADA.forEach((col, idx) => {
                OBJETO[col] = VALORES[idx]?.trim() ?? '';
              });
              return OBJETO;
              });
          // Emitir los datos al componente padre
          this.listaEmitida.emit(DATOS_SEPARADOS);
        };
        TEXT_READER.readAsText(archivo);
        // Puedes acceder a las propiedades del archivo aquí
        this.nombreArchivo = archivo.name;
        const READER = new FileReader();
        READER.onload = (): void => {
          // Aquí puedes guardar el BASE64 en una variable o enviarlo a un servicio
          const BASE64 = READER.result as string;
          // Ejemplo de uso de 'this' para cumplir con la regla:
          this._archivoBase64 = BASE64;
        };
        READER.readAsDataURL(archivo);
      }
    }

  }

  /**
   * Descarga el archivo de ejemplo para carga masiva.
   * Realiza una petición HTTP para obtener el archivo y lo descarga en el navegador.
   */
  descargarArchivo(): void {
    this.http.get('assets/txt/220201_carga_masiva.txt', { responseType: 'text' })
      .subscribe(contenido => {
        // Crea un Blob con el contenido del archivo
        const BLOB = new Blob([contenido], { type: 'text/plain' });
        // Genera una URL temporal para el Blob
        const URL = window.URL.createObjectURL(BLOB);
        // Crea un elemento <a> para iniciar la descarga
        const A = document.createElement('a');
        A.href = URL;
        A.download = '220201_carga_masiva.txt';
        A.click();
        // Libera la URL temporal creada
        window.URL.revokeObjectURL(URL);
      });
  }

  /**
   * Método que ejecuta una acción y notifica al componente padre.
   * 
   * Este método emite el evento 'accionDelHijo' para informar al componente padre
   * que se ha realizado una acción desde el componente hijo.
   */
  ejecutarAccion(): void {
    // Aquí el hijo "avisa" al padre mediante la emisión del evento
    this.accionDelHijo.emit();
  }

  /**
   * Método que ejecuta una acción para limpiar la lista y notifica al componente padre.
   * 
   * Este método emite el evento 'accionDelHijoLimpiaLista' para informar al componente padre
   * que se debe limpiar la lista desde el componente hijo.
   */
  ejecutarAccionLimpiaLista(): void {
    // Aquí el hijo "avisa" al padre mediante la emisión del evento
    this.accionDelHijoLimpiaLista.emit();
  }

}