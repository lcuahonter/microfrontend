import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodospasosComponent } from './todospasos.component';
import { AccionBoton } from '@libs/shared/data-access-user/src';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'app-wizard',
  template: ''
})
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}

describe('TodospasosComponent', () => {
  let component: TodospasosComponent;
  let fixture: ComponentFixture<TodospasosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodospasosComponent, MockWizardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TodospasosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as any;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar wizardComponent.siguiente si acción es "cont" y valor válido', () => {
    const EVENTO: AccionBoton = { valor: 2, accion: 'cont' };
    component.getValorIndice(EVENTO);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('debería llamar wizardComponent.atras si acción no es "cont" y valor válido', () => {
    const EVENTO: AccionBoton = { valor: 3, accion: 'back' };
    component.getValorIndice(EVENTO);
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('no debería cambiar el índice ni llamar métodos si valor es inválido', () => {
    const EVENTO: AccionBoton = { valor: 0, accion: 'cont' };
    const INDICE_INICIAL = component.indice;
    component.getValorIndice(EVENTO);
    expect(component.indice).toBe(INDICE_INICIAL);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});
