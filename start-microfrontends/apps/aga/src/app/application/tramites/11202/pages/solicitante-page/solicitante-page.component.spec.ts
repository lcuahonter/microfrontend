import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitantePageComponent } from './solicitante-page.component';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SeccionQuery } from '../../../../core/queries/seccion.query';
import { SeccionStore } from '../../../../core/estados/seccion.store';

describe('SolicitantePageComponent', () => {
  let component: SolicitantePageComponent;
  let fixture: ComponentFixture<SolicitantePageComponent>;
  let mockSeccionQuery: any;
  let mockSeccionStore: any;

  beforeEach(async () => {
    mockSeccionQuery = {
      selectSeccionState$: of({}),
    };

    mockSeccionStore = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [SolicitantePageComponent],
      providers: [
        { provide: SeccionQuery, useValue: mockSeccionQuery },
        { provide: SeccionStore, useValue: mockSeccionStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitantePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should set indice on seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should update indice and call wizardComponent methods on getValorIndice', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();

    component.getValorIndice({ accion: 'prev', valor: 1 });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should call getValorIndice with the correct parameters when continuar is called', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
    const getValorIndiceSpy = jest.spyOn(component, 'getValorIndice');
    component.indice = 2;
    component.continuar();
    expect(getValorIndiceSpy).toHaveBeenCalledWith({ accion: 'cont', valor: 3 });
  });

  it('should call wizardComponent.siguiente when continuar is called and action is "cont"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
    const wizardSiguienteSpy = jest.spyOn(component.wizardComponent, 'siguiente');
    component.indice = 2;
    component.continuar();
    expect(wizardSiguienteSpy).toHaveBeenCalled();
  });
});