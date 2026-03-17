import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroCaatNavieroPageComponent } from './registro-caat-naviero-page.component';
import { SeccionLibQuery, SeccionLibStore, WizardComponent } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RegistroCaatNavieroPageComponent', () => {
  let component: RegistroCaatNavieroPageComponent;
  let fixture: ComponentFixture<RegistroCaatNavieroPageComponent>;
  let mockSeccionQuery: jest.Mocked<SeccionLibQuery>;
  let mockSeccionStore: jest.Mocked<SeccionLibStore>;

  beforeEach(async () => {
    mockSeccionQuery = {
      selectSeccionState$: jest.fn().mockReturnValue(of({ paso1: true, paso2: false })),
    } as unknown as jest.Mocked<SeccionLibQuery>;

    mockSeccionStore = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn(),
    } as unknown as jest.Mocked<SeccionLibStore>;

    await TestBed.configureTestingModule({
      declarations: [RegistroCaatNavieroPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: SeccionLibQuery, useValue: mockSeccionQuery },
        { provide: SeccionLibStore, useValue: mockSeccionStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroCaatNavieroPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign sections to the store', () => {

    component.asignarSecciones();
    expect(mockSeccionStore.establecerSeccion).toHaveBeenCalledWith([true, true]);
    expect(mockSeccionStore.establecerFormaValida).toHaveBeenCalledWith([false, false]);
  });

  it('should change the active tab index', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should update the index and navigate forward in the wizard', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    const accionBoton = { accion: 'cont', valor: 3 };
    component.getValorIndice(accionBoton);

    expect(component.indice).toBe(3);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should update the index and navigate backward in the wizard', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    const accionBoton = { accion: 'back', valor: 2 };
    component.getValorIndice(accionBoton);

    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should toggle modal button visibility based on the current tab', () => {
    component.pestanaCambiado(2);
    expect(component.mostrarBotonParaModal).toBeTruthy();

    component.pestanaCambiado(1);
    expect(component.mostrarBotonParaModal).toBeFalsy();
  });

  it('should unsubscribe from observables on component destruction', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const destroyCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyCompleteSpy).toHaveBeenCalled();
  });
});