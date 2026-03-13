import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { of, Subject } from 'rxjs';
import { ConsultaioQuery, SolicitanteComponent } from '@ng-mf/data-access-user';
import { TransportacionMaritimaService } from '../../services/transportacion-maritima/transportacion-maritima.service';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('DatosComponent (Jest)', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let destroyNotifier$: Subject<void>;

  const mockConsultaQuery = {
    selectConsultaioState$: of({
      readonly: false,
      update: true,
    }),
  };

  const mockTransportacionService = {
    getRegistroTomaMuestrasMercanciasData: jest.fn(() => of({ sample: 'data' })),
    actualizarEstadoFormulario: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
        { provide: TransportacionMaritimaService, useValue: mockTransportacionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    destroyNotifier$ = component.destroyNotifier$;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set esDatosRespuesta = true and call guardarDatosFormulario when update is true', () => {
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    fixture.detectChanges();

    expect(component.esDatosRespuesta).toBe(true);
    expect(guardarSpy).toHaveBeenCalled();
  });

  describe('when update is false', () => {
    beforeEach(async () => {
      await TestBed.resetTestingModule().configureTestingModule({
        declarations: [DatosComponent],
        imports: [HttpClientModule ,SolicitanteComponent],
        providers: [
          {
            provide: ConsultaioQuery,
            useValue: {
              selectConsultaioState$: of({
                readonly: false,
                update: false,
              }),
            },
          },
          { provide: TransportacionMaritimaService, useValue: mockTransportacionService },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DatosComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

   it('should set esDatosRespuesta = true when update is false', () => {
  expect(component.esDatosRespuesta).toBe(true);
});

  });

  it('should set indice correctly on seleccionaTab()', () => {
    expect(component.indice).toBe(1);
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should trigger destroy notifier on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(destroyNotifier$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });
});
