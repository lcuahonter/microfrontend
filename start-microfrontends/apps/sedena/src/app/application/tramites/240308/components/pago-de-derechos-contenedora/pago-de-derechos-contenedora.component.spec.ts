import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PagoDeDerechosContenedoraComponent } from './pago-de-derechos-contenedora.component';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

describe('PagoDeDerechosContenedoraComponent', () => {
  let component: PagoDeDerechosContenedoraComponent;
  let fixture: ComponentFixture<PagoDeDerechosContenedoraComponent>;
  let mockTramiteQuery: any;
  let mockTramiteStore: any;
  let mockConsultaQuery: any;

  beforeEach(async () => {
    mockTramiteQuery = {
      getPagoDerechos$: of({ pago: 123 })
    };
    mockTramiteStore = {
      updatePagoDerechosFormState: jest.fn()
    };
    mockConsultaQuery = {
      selectConsultaioState$: of({ soloLectura: true })
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, PagoDeDerechosContenedoraComponent],
      providers: [
        { provide: 'Tramite240308Query', useValue: mockTramiteQuery },
        { provide: 'Tramite240308Store', useValue: mockTramiteStore },
        { provide: 'ConsultaioQuery', useValue: mockConsultaQuery },
        { provide: DatosSolicitudService, useValue: { obtenerBancos: jest.fn(() => of([])) } } 
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(PagoDeDerechosContenedoraComponent, {
        set: {
          providers: [
            { provide: 'Tramite240308Query', useValue: mockTramiteQuery },
            { provide: 'Tramite240308Store', useValue: mockTramiteStore },
            { provide: 'ConsultaioQuery', useValue: mockConsultaQuery }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería suscribirse a getPagoDerechos$ y establecer pagoDerechoFormState', () => {
    expect(component.pagoDerechoFormState).toEqual({
      banco: "",
      cadenaDependencia: "",
      claveReferencia: "",
      fechaPago: "",
      importePago: "",
      llavePago: ""
    });
  });

  it('debería limpiar unsubscribe$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).unsubscribe$, 'next');
    const completeSpy = jest.spyOn((component as any).unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
