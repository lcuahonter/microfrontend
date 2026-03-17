import { Component,EventEmitter,OnInit,Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@ng-mf/data-access-user';
@Component({
  selector: 'app-agregar-destinatoria',
  templateUrl: './agregar-destinatoria.component.html',
  styleUrl: './agregar-destinatoria.component.scss',
  standalone: true,
  imports: [TituloComponent, CatalogoSelectComponent,FormsModule,ReactiveFormsModule,CommonModule]
})
export class AgregarDestinatoriaComponent implements OnInit {


  destinatarioForm!: FormGroup;
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
   * @constructor
   * @description Constructor de la clase AgregarDestinatoriaComponent.
   */
  constructor(private fb: FormBuilder) { 
    //
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama al método `getPais()` para obtener la información de países necesaria para el componente.
   */
  ngOnInit(): void {
    this.getPais();
      this.destinatarioForm = this.fb.group({
      tipoPersona: ['fisica'],
      nombre: ['',Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      denominacion: ['', Validators.required],
      pais: [''],
      domicilio: [''],
      lada: ['', [Validators.pattern('^[0-9]{4}$'), Validators.maxLength(4)]],
      telefono: ['',Validators.pattern(/^\+?[0-9\s\-]{7,15}$/)],
      correoElectronico: ['', [Validators.email]],
    });
  }

  /**
   * @description getPais se utiliza para obtener los datos de los paises
   */

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
  public entradaSeleccionada(checkBoxName: string): void {
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
