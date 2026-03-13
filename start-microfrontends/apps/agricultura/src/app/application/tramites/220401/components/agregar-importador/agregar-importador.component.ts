import { Component,EventEmitter,OnInit,Output } from '@angular/core';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { TituloComponent } from '@ng-mf/data-access-user';

@Component({
  selector: 'app-agregar-importador',
  standalone: true,
  imports: [TituloComponent, CatalogoSelectComponent],
  templateUrl: './agregar-importador.component.html',
  styleUrl: './agregar-importador.component.scss'
})
export class AgregarImportadorComponent implements OnInit{
  /**
   * @property pais
   * @type {Catalogo[]}
   * @description Arreglo que almacena los datos de los países.
   */
  public pais!: Catalogo[];
   /**
   * @property fisica
   * @type {boolean}
   * @description Indica si la persona es física.
   */
  public fisica: boolean = true;
    /**
   * @property moral
   * @type {boolean}
   * @description Indica si la persona es moral.
   */
  public moral: boolean = false;

   /** 
   * Evento que se emite para cerrar el componente.
   */
  @Output() cerrar = new EventEmitter<void>();
  
    /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama al método `getPais()` para obtener la información de países necesaria para el componente.
   */
  ngOnInit(): void {
    this.getPais();
  }
   /**
   * @descripcion getPais se utiliza para obtener los datos de los países.
   */
  public getPais(): void {
    this.pais = [
      {
        id: 1,
        descripcion: 'Opción 1',
      },
      {
        id: 2,
        descripcion: 'Opción 1',
      }
    ];
  }
  /**
   * 
   * @param  checkBoxName, que acepta datos de tipo cadena
   * @description inputChecked se utiliza para verificar si el checkbox está seleccionado
   */
  public inputChecked(checkBoxName: string): void {
    if (checkBoxName === 'fisica') {
      this.fisica = true;
      this.moral = false;
    } else {
      this.fisica = false;
      this.moral = true;
    }
  }

   /**
   * Cierra el modal emitiendo el evento `cerrar`.
   */
   public cerrarModal(): void {
    this.cerrar.emit();
  }
}
