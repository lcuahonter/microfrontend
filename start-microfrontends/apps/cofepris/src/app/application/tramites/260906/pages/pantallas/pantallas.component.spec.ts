
import { PantallasComponent } from './pantallas.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { AccionBoton } from '@libs/shared/data-access-user/src';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'

@Component({
  selector: 'app-wizard',
  template: ''
})
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}


describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallasComponent, MockWizardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as any;

  });

  it('debería crear el component', () => {
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