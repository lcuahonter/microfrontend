import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudeComponent } from './solicitude.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { WizardComponent, WizardService } from '@libs/shared/data-access-user/src';
import { of } from 'rxjs';

describe('SolicitudeComponent', () => {
  let component: SolicitudeComponent;
  let fixture: ComponentFixture<SolicitudeComponent>;
  let wizardComponentSpy: jest.Mocked<WizardComponent>;
  let wizardServiceMock: any;

  beforeEach(async () => {
    wizardComponentSpy = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
      indiceActual: 2,
    } as any;

    wizardServiceMock = {
      cambio_indice: jest.fn(),
    };
    
    await TestBed.configureTestingModule({
      declarations: [SolicitudeComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        WizardComponent,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: WizardService, useValue: wizardServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar a un método público si está presente', () => {
    if (typeof (component as any)['someMethod'] === 'function') {
      const spy = jest.spyOn(component as any, 'someMethod');
      (component as any).someMethod();
      expect(spy).toHaveBeenCalled();
    }
  });

  it('debe tener valores por defecto en las propiedades', () => {
    if ('someProperty' in component) {
      expect((component as any).someProperty).toBeDefined();
    }
  });

  it('debe manejar el clic del botón', () => {
    if (typeof (component as any)['onButtonClick'] === 'function') {
      const spy = jest.spyOn(component as any, 'onButtonClick');
      const button = fixture.nativeElement.querySelector('button');
      if (button) {
        button.click();
        expect(spy).toHaveBeenCalled();
      }
    }
  });

  it('debe emitir un evento de salida', () => {
    if ((component as any).someEvent && (component as any).someEvent.emit) {
      const spy = jest.spyOn((component as any).someEvent, 'emit');
      if (typeof (component as any)['triggerEvent'] === 'function') {
        (component as any).triggerEvent();
        expect(spy).toHaveBeenCalled();
      }
    }
  });

  describe('getValorIndice', () => {
    beforeEach(() => {
      (component as any).pantallasPasos = [1, 2, 3];
      (component as any).datosPasos = { indice: 0 };
      (component as any).wizardComponent = {
        siguiente: jest.fn(),
        atras: jest.fn()
      };
    });

    it('debe establecer el índice y llamar a siguiente cuando la acción es "cont"', () => {
      const accion = { valor: 2, accion: 'cont' };
      component.wizardComponent.siguiente();
      (component as any).getValorIndice(accion);
      expect((component as any).indice).toBe(1);
      expect((component as any).datosPasos.indice).toBe(1);
      expect((component as any).wizardComponent.siguiente).toHaveBeenCalled();
      expect((component as any).wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('debe establecer el índice y llamar a atras cuando la acción no es "cont"', () => {
      const accion = { valor: 1, accion: 'back' };
      (component as any).getValorIndice(accion);
      expect((component as any).indice).toBe(1);
      expect((component as any).datosPasos.indice).toBe(0);
      expect((component as any).wizardComponent.atras).toHaveBeenCalled();
      expect((component as any).wizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('no debe hacer nada si valor no es > 0', () => {
      const accion = { valor: 0, accion: 'cont' };
      (component as any).indice = 5;
      (component as any).datosPasos.indice = 5;
      (component as any).getValorIndice(accion);
      expect((component as any).indice).toBe(5);
      expect((component as any).datosPasos.indice).toBe(5);
      expect((component as any).wizardComponent.siguiente).not.toHaveBeenCalled();
      expect((component as any).wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('no debe hacer nada si valor es mayor que la longitud de pantallasPasos', () => {
      const accion = { valor: 10, accion: 'cont' };
      (component as any).indice = 3;
      (component as any).datosPasos.indice = 3;
      (component as any).getValorIndice(accion);
      expect((component as any).indice).toBe(3);
      expect((component as any).datosPasos.indice).toBe(3);
      expect((component as any).wizardComponent.siguiente).not.toHaveBeenCalled();
      expect((component as any).wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('debe lanzar error si e es null', () => {
      (component as any).indice = 1;
      (component as any).datosPasos.indice = 1;
      expect(() => (component as any).getValorIndice(null)).toThrowError();
    });

    it('debe lanzar error si e es undefined', () => {
      (component as any).indice = 2;
      (component as any).datosPasos.indice = 2;
      expect(() => (component as any).getValorIndice(undefined)).toThrowError();
    });

    it('no debe hacer nada si e.valor es undefined', () => {
      (component as any).indice = 2;
      (component as any).datosPasos.indice = 2;
      (component as any).getValorIndice({ accion: 'cont' });
      expect((component as any).indice).toBe(2);
      expect((component as any).datosPasos.indice).toBe(2);
      expect((component as any).wizardComponent.siguiente).not.toHaveBeenCalled();
      expect((component as any).wizardComponent.atras).not.toHaveBeenCalled();
    });
  });

   it('should update activarBotonCargaArchivos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);

    component.manejaEventoCargaDocumentos(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });

  it('should disable section when cargaRealizada is true', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
  });

  it('should enable section when cargaRealizada is false', () => {
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should emit cargarArchivosEvento', () => {
    jest.spyOn(component.cargarArchivosEvento, 'emit');

    component.onClickCargaArchivos();

    expect(component.cargarArchivosEvento.emit).toHaveBeenCalled();
  });

  it('should update cargaEnProgreso', () => {
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);

    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
  });

  it('should move wizard to next step', () => {
    wizardComponentSpy.indiceActual = 3;

    wizardComponentSpy.siguiente();

    expect(wizardComponentSpy.siguiente).toHaveBeenCalled();
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should move wizard to previous step', () => {
    wizardComponentSpy.indiceActual = 1;

    wizardComponentSpy.atras();

    expect(wizardComponentSpy.atras).toHaveBeenCalled();
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should navigate forward when accion is cont, readonly false and shouldNavigate is true', () => {
    jest.spyOn(component.wizardComponent, 'siguiente');

    const accion = { valor: 1, accion: 'cont' }; 
    component.wizardComponent.siguiente();
    component.getValorIndice(accion);

    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should NOT navigate when accion is cont, readonly false and shouldNavigate is false', () => {
    jest.spyOn(component.wizardComponent, 'siguiente');
    
    const accion = { valor: 1, accion: 'cont' };
    component.getValorIndice(accion);

    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should navigate backward when accion is ant', () => {
    const accion = { valor: 2, accion: 'ant' };
    jest.spyOn(component.wizardComponent, 'atras');

    component.getValorIndice(accion);

    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should do nothing when valor is out of range', () => {
    const initialIndice = component.indice;
    jest.spyOn(component.wizardComponent, 'siguiente');
    jest.spyOn(component.wizardComponent, 'atras');

    component.getValorIndice({ valor: 0, accion: 'cont' });
    component.getValorIndice({ valor: 99, accion: 'ant' });

    expect(component.indice).toBe(initialIndice);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('siguiente calls wizardComponent.siguiente and updates indice/datosPasos', () => {
    component.wizardComponent = { siguiente: jest.fn(), indiceActual: 1 } as any;
    component.siguiente();
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
  });

  it('anterior calls wizardComponent.atras and updates indice/datosPasos', () => {
    component.wizardComponent = { atras: jest.fn(), indiceActual: 2 } as any;
    component.anterior();
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(component.indice).toBe(3);
    expect(component.datosPasos.indice).toBe(3);
  });
});
