import { TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { PagoLineaDeCapturaComponent } from '../../components/pago-linea-de-captura/pago-linea-de-captura.component';
import { DatosProrrogaMuestrasMercanciasComponent } from '../../components/datos-prorroga-muestras-mercancias/datos-prorroga-muestras-mercancias.component';
import { RegistroRenovacionesMuestrasMercanciasComponent } from '../../components/registro-renovaciones-muestras-mercancias/registro-renovaciones-muestras-mercancias.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Solocitud30901Service } from '../../services/service30901.service';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: any;
  let mockSolocitud30901Service: Partial<Solocitud30901Service>;

  beforeEach(async () => {
    mockSolocitud30901Service = {
       getDatosDeLaSolicitud: jest.fn().mockReturnValue({
        pipe: () => ({
          subscribe: (cb: any) => cb({ foo: 'bar' })
        })
      }),
      actualizarEstadoFormulario: jest.fn(()=> of())
    } as unknown as Partial<Solocitud30901Service>;

    await TestBed.configureTestingModule({
      imports: [
        PasoUnoComponent,
        PagoLineaDeCapturaComponent,
        DatosProrrogaMuestrasMercanciasComponent,
        RegistroRenovacionesMuestrasMercanciasComponent,
        SolicitanteComponent,
        CommonModule,
        HttpClientTestingModule
      ],
      providers:[
        {
          provide: Solocitud30901Service, useValue: mockSolocitud30901Service
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default indice as 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should set indice when seleccionaTab is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);

    component.seleccionaTab(0);
    expect(component.indice).toBe(0);
  });

  it('should set esDatosRespuesta to true if consultaState.update is false on ngOnInit', () => {
    component.consultaState = { update: false } as any;
    jest.spyOn(component as any, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
    expect((component as any).guardarDatosFormulario).not.toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true and call actualizarEstadoFormulario on guardarDatosFormulario with valid response', () => {
    const mockService = {
      getDatosDeLaSolicitud: jest.fn().mockReturnValue({
        pipe: () => ({
          subscribe: (cb: any) => cb({ foo: 'bar' })
        })
      }),
      actualizarEstadoFormulario: jest.fn(()=> of())
    };
    (component as any).importacionOtrosVehiculosUsadosService = mockService;
    component.esDatosRespuesta = false;
    expect(component.esDatosRespuesta).toBe(false);
  });

  it('should set esDatosRespuesta to false on guardarDatosFormulario with falsy response', () => {
    const mockService = {
      getDatosDeLaSolicitud: jest.fn().mockReturnValue({
        pipe: () => ({
          subscribe: (cb: any) => cb(null)
        })
      }),
      actualizarEstadoFormulario: jest.fn(()=> of())
    };
    (component as any).importacionOtrosVehiculosUsadosService = mockService;
    component.esDatosRespuesta = true;
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const destroyNotifier$ = (component as any).destroyNotifier$;
    const spyNext = jest.spyOn(destroyNotifier$, 'next');
    const spyComplete = jest.spyOn(destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});