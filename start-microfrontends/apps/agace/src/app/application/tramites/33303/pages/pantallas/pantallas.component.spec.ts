import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallasComponent } from './pantallas.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AccionBoton } from '../../models/aviso.model';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;

  const wizardMock = {
    siguiente: jest.fn(),
    atras: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallasComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    component.wizardComponent = wizardMock as any;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call siguiente() when accion is "cont"', () => {
    const accion: AccionBoton = { valor: 2, accion: 'cont' };
    component.getValorIndice(accion);
    expect(component.indice).toBe(2);
    expect(wizardMock.siguiente).toHaveBeenCalled();
  });

  it('should call atras() when accion is not "cont"', () => {
    const accion: AccionBoton = { valor: 3, accion: 'back' };
    component.getValorIndice(accion);
    expect(component.indice).toBe(3);
    expect(wizardMock.atras).toHaveBeenCalled();
  });

});
