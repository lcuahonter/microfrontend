import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SolicitudPageComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            params: {},
            queryParams: {}
          }
        }
      }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
  });

  it('debe crearse', () => {
    expect(component).toBeDefined();
  });

  it('debe actualizar el índice y llamar a siguiente en getValorIndice con acción "cont"', () => {
    // Mock the wizardComponent and service
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.service = { collectFormValues: jest.fn().mockReturnValue({ datosSolicitud: [{ test: 1 }] }) } as any;

    const event = { valor: 2, accion: 'cont' };
    component.getValorIndice(event as any);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.service.collectFormValues).toHaveBeenCalled();
    expect(component.payload).toEqual({ datosSolicitud: [{ test: 1 }] });
  });

  it('debe actualizar el índice y llamar a atras en getValorIndice con acción distinta de "cont"', () => {
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.service = { collectFormValues: jest.fn().mockReturnValue({ datosSolicitud: [{ test: 2 }] }) } as any;

    const event = { valor: 3, accion: 'atras' };
    component.getValorIndice(event as any);
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(component.service.collectFormValues).toHaveBeenCalled();
    expect(component.payload).toEqual({ datosSolicitud: [{ test: 2 }] });
  });

  it('no debe cambiar el índice si valor está fuera de rango', () => {
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.service = { collectFormValues: jest.fn().mockReturnValue({ datosSolicitud: [{ test: 3 }] }) } as any;
    component.indice = 1;

    const event = { valor: 0, accion: 'cont' };
    component.getValorIndice(event as any);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});
