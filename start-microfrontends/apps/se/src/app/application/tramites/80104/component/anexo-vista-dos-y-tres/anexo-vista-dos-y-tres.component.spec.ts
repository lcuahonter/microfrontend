import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AnexoVistaDosYTresComponent } from './anexo-vista-dos-y-tres.component';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { Tramite80101Store } from '../../estados/tramite80101.store';
import { AnexoEncabezado } from '../../../../shared/models/nuevo-programa-industrial.model';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { ANEXO_SERVICIO } from '../../../../shared/constantes/anexo-dos-y-tres.enum';

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom: any;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value: any) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
 transform(value: any) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value: any) { return value; }
}

describe('AnexoVistaDosYTresComponent', () => {
  let fixture: ComponentFixture<AnexoVistaDosYTresComponent>;
  let component: AnexoVistaDosYTresComponent;
  let mockQuery: Partial<Tramite80101Query>;
  let mockStore: Partial<Tramite80101Store>;
  const mockAnexoDos: AnexoEncabezado[] = [{
    encabezadoFraccion: '0101.21.01',
    encabezadoDescripcion: 'Descripción Anexo Dos',
    estatus: true
  }];

  const mockAnexoTres: AnexoEncabezado[] = [{
    encabezadoFraccion: '0202.31.01',
    encabezadoDescripcion: 'Descripción Anexo Tres',
    estatus: false
  }];
  beforeEach(() => {
    mockQuery = {
      anexoDosTableLista$: of(mockAnexoDos),
      anexoTresTablaLista$: of(mockAnexoTres),
    };

    mockStore = {
      setAnnexoDosTableLista: jest.fn(),
      setAnnexoTresTableLista: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, AnexoVistaDosYTresComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
     schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite80101Query, useValue: mockQuery },
        { provide: Tramite80101Store, useValue: mockStore },
      ]
    })
    fixture = TestBed.createComponent(AnexoVistaDosYTresComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('Debería limpiar destroyNotifier$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('Debería inicializar anexoConfig con valores correctos', () => {
    expect(component.anexoConfig.anexoDosTablaSeleccionCheckbox).toBe(TablaSeleccion.CHECKBOX);
    expect(component.anexoConfig.anexoDosEncabezadoDeTabla).toBe(ANEXO_SERVICIO);
    expect(component.anexoConfig.anexoTresTablaSeleccionCheckbox).toBe(TablaSeleccion.CHECKBOX);
    expect(component.anexoConfig.anexoTresEncabezadoDeTabla).toBe(ANEXO_SERVICIO);
  });

    it('Debería establecer anexoDosTablaLista en init si existen datos', () => {
    fixture.detectChanges(); 
    expect(component.anexoDosTablaLista.length).toBe(1);
    expect(component.anexoDosTablaLista[0].encabezadoFraccion).toBe('0101.21.01');
  });

  it('Debería establecer anexoTresTablaLista en init si existen datos', () => {
    fixture.detectChanges(); 
    expect(component.anexoTresTablaLista.length).toBe(1);
    expect(component.anexoTresTablaLista[0].encabezadoFraccion).toBe('0202.31.01');
  });

  it('Debería llamar a store.setAnnexoDosTableLista en obtenerAnexoDosDevolverLaLlamada()', () => {
    const event: AnexoEncabezado[] = [{ encabezadoFraccion: '', encabezadoDescripcion: '', estatus: false }];
    component.obtenerAnexoDosDevolverLaLlamada(event);
    expect(component.anexoDosTablaLista).toEqual(event);
    expect(mockStore.setAnnexoDosTableLista).toHaveBeenCalledWith(event);
  });

  it('Debería llamar a store.setAnnexoTresTableLista en obtenerAnexoTresDevolverLaLlamada()', () => {
    const event: AnexoEncabezado[] = [{ encabezadoFraccion: '', encabezadoDescripcion: '', estatus: false }];
    component.obtenerAnexoTresDevolverLaLlamada(event);
    expect(component.anexoTresTablaLista).toEqual(event);
    expect(mockStore.setAnnexoTresTableLista).toHaveBeenCalledWith(event);
  });

});