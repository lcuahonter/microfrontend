import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatosExportadorComponent } from '../datos-exportador/datos-exportador.component';
import { DatosMercanciaComponent } from '../datos-mercancia/datos-mercancia.component';
import { DatosProductorComponent } from '../datos-productor/datos-productor.component';
import { DocumentoExportacionComponent } from '../documento-exportacion/documento-exportacion.component';
import { RepresentacionFederalComponent } from '../representacion-federal/representacion-federal.component';
import { TramiteRealizerComponent } from '../tramite_realizer/tramite_realizer.component';

/**
 * @component
 * @name DatosGeneralesComponent
 * @description
 * [Compodoc] Componente principal para la sección de datos generales en el trámite 130120.
 * Este componente agrupa y muestra los subcomponentes relacionados con la información
 * general requerida para el trámite, incluyendo datos del exportador, productor, mercancía,
 * documentos de exportación y representación federal.
 *
 * @imports
 * - CommonModule
 * - TramiteRealizerComponent
 * - DatosMercanciaComponent
 * - DocumentoExportacionComponent
 * - DatosProductorComponent
 * - DatosExportadorComponent
 * - RepresentacionFederalComponent
 *
 * @selector app-datos-generales
 * @standalone true
 * @template ./datos-generales.component.html
 * @style ./datos-generales.component.css
 */
@Component({
  selector: 'app-datos-generales',
  standalone: true,
  imports: [CommonModule, TramiteRealizerComponent, DatosMercanciaComponent, DocumentoExportacionComponent, DatosProductorComponent, DatosExportadorComponent, RepresentacionFederalComponent],
  templateUrl: './datos-generales.component.html',
  styleUrl: './datos-generales.component.scss',
})
export class DatosGeneralesComponent {}
