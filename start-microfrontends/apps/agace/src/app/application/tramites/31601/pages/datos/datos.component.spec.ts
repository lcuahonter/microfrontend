import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite31601Query } from '../../../../estados/queries/tramite31601.query';
import { Solocitud31601Service } from '../../services/service31601.service';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;

  let mockConsultaQuery: any;
  let mockTramiteQuery: any;
  let mockSolicitudService: any;

  beforeEach(async () => {
    mockConsultaQuery = {
      selectConsultaioState$: of({ update: false })
    };

    mockTramiteQuery = {
      selectSolicitud$: of({
        regimen_0: true,
        regimen_1: false,
        regimen_2: false,
        regimen_3: false
      })
    };

    mockSolicitudService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ someData: true })),
      actualizarEstadoFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
        { provide: Tramite31601Query, useValue: mockTramiteQuery },
        { provide: Solocitud31601Service, useValue: mockSolicitudService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown component selectors like <app-catalogo-select>
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize consultaState and esDatosRespuesta correctly', () => {
    expect(component.consultaState).toBeDefined();
    expect(component.esDatosRespuesta).toBe(true); // because update: false
  });

  it('should show IMMEX Sensibles section if regimen_0 is true', () => {
    expect(component.showIMMEXSensiblesSection).toBe(true);
    expect(component.showDepositoFiscalSection).toBe(false);
  });

  it('should update estado formulario when consultaState.update is true', () => {
    mockConsultaQuery.selectConsultaioState$ = of({ update: true });
    mockTramiteQuery.selectSolicitud$ = of({});
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalledTimes(1);
  });

  it('should clean up subscriptions on destroy', () => {
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
