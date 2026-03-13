// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContenedorDePasosComponent } from './contenedor-de-pasos.component';

// Mock constant TITULOMENSAJE
jest.mock('./contenedor-de-pasos.component', () => {
  const originalModule = jest.requireActual('./contenedor-de-pasos.component');
  return {
    ...originalModule,
    TITULOMENSAJE: 'TITULOMENSAJE'
  };
});

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

describe('ContenedorDePasosComponent', () => {
  let fixture: ComponentFixture<ContenedorDePasosComponent>;
  let component: ContenedorDePasosComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ContenedorDePasosComponent],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ContenedorDePasosComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = () => {};
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab()', () => {
    component.seleccionaTab({});
    // No expectations as logic is unknown
  });

  describe('#getValorIndice', () => {
    beforeEach(() => {
      component.wizardComponent = {
        siguiente: jest.fn(),
        atras: jest.fn()
      };
    });

    it('should call siguiente and set title when accion is "cont"', () => {
      const accion = { valor: 2, accion: 'cont' };
      component.getValorIndice(accion);

      expect(component.indice).toBe(2);
      expect(component.tituloMensaje).toBe('Cargar requisitos');
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should call atras and set title when accion is not "cont"', () => {
      const accion = { valor: 3, accion: 'back' };
      component.getValorIndice(accion);

      expect(component.indice).toBe(3);
      expect(component.tituloMensaje).toBe('Firmar');
      expect(component.wizardComponent.atras).toHaveBeenCalled();
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('should not call anything if valor is out of range', () => {
      const accion = { valor: 10, accion: 'cont' };
      component.getValorIndice(accion);

      expect(component.indice).not.toBe(10);
      
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });
  });

  describe('obtenerNombreDelTítulo', () => {
    it('should return "Cargar requisitos" for valor 2', () => {
      expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(2)).toBe('Cargar requisitos');
    });

    it('should return "Firmar" for valor 3', () => {
      expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(3)).toBe('Firmar');
    });

    it('should return default TITULOMENSAJE for unknown valor', () => {
      expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(99)).toBe( "Permiso sanitario de importación de dispositivos médicos para uso personal");
    });

    it('should return TITULOMENSAJE for valor 1', () => {
      expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(1)).toBe( "Permiso sanitario de importación de dispositivos médicos para uso personal");
    });

    it('should return TITULOMENSAJE for default case (0)', () => {
      expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(0)).toBe( "Permiso sanitario de importación de dispositivos médicos para uso personal");
    });
  });
});
