import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SolicitudPageComponent } from './solicitud-page.component';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudPageComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('seleccionaTab', () => {
    it('should update indice when seleccionaTab is called', () => {
      component.indice = 1;
      component.seleccionaTab(2);
      expect(component.indice).toBe(2);
    });
  });

  describe('getValorIndice', () => {
    it('should update indice and call wizardComponent.siguiente for accion "cont"', () => {
      component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
      const e = { valor: 2, accion: 'cont' };
      component.getValorIndice(e as any);
      expect(component.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });
    it('should update indice and call wizardComponent.atras for accion not "cont"', () => {
      component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
      const e = { valor: 3, accion: 'back' };
      component.getValorIndice(e as any);
      expect(component.indice).toBe(3);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });
    it('should not update indice or call wizardComponent if valor is out of range', () => {
      component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
      component.indice = 1;
      const e = { valor: 0, accion: 'cont' };
      component.getValorIndice(e as any);
      expect(component.indice).toBe(1);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });
  });
});
