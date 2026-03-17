import { AlertComponent,TEXTOS,TituloComponent } from '@libs/shared/data-access-user/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-capturar-el-texto-libre',
  standalone: true,
  imports: [ TituloComponent,CommonModule,FormsModule,ReactiveFormsModule,AlertComponent ],
  templateUrl: './capturar-el-texto-libre.component.html',
  styleUrl: './capturar-el-texto-libre.component.css',
})
export class CapturarElTextoLibreComponent {
  /**
   * Constante que contiene los textos utilizados en el componente.
   * Se utiliza para centralizar y reutilizar los textos en la interfaz de usuario.
   */
  TEXTOS = TEXTOS;

  /**
   * Clase CSS utilizada para mostrar una alerta informativa en la interfaz de usuario.
   *
   * @type {string}
   */
  infoAlert = 'alert-info';
}
