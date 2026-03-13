// @ts-nocheck
import { CUSTOM_ELEMENTS_SCHEMA, Directive, Input, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SanidadAcuicolaCertificadoComponent } from './sanidadAcuicolaCertificado.component';

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('SanidadAcuicolaCertificadoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SanidadAcuicolaCertificadoComponent],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [

      ]
    }).overrideComponent(SanidadAcuicolaCertificadoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SanidadAcuicolaCertificadoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function () { };
    fixture.destroy();
  });

  it('debe crear el componente', async () => {
    expect(component).toBeTruthy();
  });

  it('debe ejecutar getValorIndice()', async () => {
    component.validarTodosFormulariosPasoUno = jest.fn();
    component.pasos = component.pasos || {};
    component.datosPasos = component.datosPasos || {};
    component.datosPasos.indice = 'indice';
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({
      accion: {},
      valor: {}
    });
  });

  it('debe ejecutar validarTodosFormulariosPasoUno()', async () => {
    component.pasoUnoComponent = component.pasoUnoComponent || {};
    component.pasoUnoComponent.validarFormularios = jest.fn();
    component.validarTodosFormulariosPasoUno();
  });

});
