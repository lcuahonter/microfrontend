import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { PASOS, WizardComponent } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        WizardComponent,
        BtnContinuarComponent,
        PasoUnoComponent,
        PasoTresComponent,
        CommonModule,
        SolicitudPageComponent
      ],
      providers: [ provideHttpClient(),
        provideHttpClientTesting(),],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

 

  it('should run #seleccionaTab()', () => {
    component.seleccionaTab(1);
    expect(component.indice).toBe(1);
  });

  it('should run #getValorIndice()', () => {
    component.wizardComponent = component.wizardComponent || {} as WizardComponent;
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();

    component.getValorIndice({ valor: 1, accion: 'prev' });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  describe('seleccionaTab', () => {
    it('should update the current tab index', () => {
      component.seleccionaTab(2);
      expect(component.indice).toBe(2);
    });
  });

  describe('getValorIndice', () => {
    let wizardComponentSpy: jest.SpyInstance;

    beforeEach(() => {
      wizardComponentSpy = jest.spyOn(component.wizardComponent, 'siguiente');
    });

    it('should call alEventoHijo and update the index when action is "cont"', () => {
      const alEventoHijoSpy = jest.spyOn(component, 'alEventoHijo');
      const mockEvent = { accion: 'cont', valor: 3 };

      component.getValorIndice(mockEvent);

      expect(component.indice).toBe(3);
      expect(component.nombre).toBe(1);
      expect(wizardComponentSpy).toHaveBeenCalled();
    });

    it('should call wizardComponent.atras when action is not "cont"', () => {
      const wizardAtrasSpy = jest.spyOn(component.wizardComponent, 'atras');
      const mockEvent = { accion: 'back', valor: 2 };

      component.getValorIndice(mockEvent);

      expect(component.indice).toBe(2);
      expect(wizardAtrasSpy).toHaveBeenCalled();
    });

    it('should not update the index if the value is out of range', () => {
      const mockEvent = { accion: 'cont', valor: 6 };

      component.getValorIndice(mockEvent);

      expect(component.indice).toBe(1); 
    });
  });

  describe('alEventoHijo', () => {
    it('should update the nombre property', () => {
      component.alEventoHijo(5);
      expect(component.nombre).toBe(5);
    });
  });
});