import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SanidadAcuicolaImportacionComponent } from './sanidad-acuicola-importacion.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SanidadAcuicolaImportacionComponent', () => {
  let component: SanidadAcuicolaImportacionComponent;
  let fixture: ComponentFixture<SanidadAcuicolaImportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SanidadAcuicolaImportacionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    }).compileComponents();

    fixture = TestBed.createComponent(SanidadAcuicolaImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe actualizar el índice y llamar a siguiente en el wizard', () => {
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    const evento = { valor: 2, accion: 'cont' };
    component.getValorIndice(evento as any);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('debe actualizar el índice y llamar a atras en el wizard', () => {
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    const evento = { valor: 2, accion: 'back' };
    component.getValorIndice(evento as any);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('no debe actualizar el índice si el valor es inválido', () => {
    component.indice = 1;
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    const evento = { valor: 0, accion: 'cont' };
    component.getValorIndice(evento as any);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});