import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosMercanciaComponent } from './datos-mercancia.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ExportadorAutorizadoService } from '../../service/exportador-autorizado.service';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatosMercanciaComponent', () => {
  let component: DatosMercanciaComponent;
  let fixture: ComponentFixture<DatosMercanciaComponent>;
  let mockConsultaQuery: any;
  let mockExportadorService: any;

  beforeEach(async () => {
    mockConsultaQuery = {
      selectConsultaioState$: of({ update: true })
    };

    mockExportadorService = {
      obtenerRegistro: jest.fn().mockReturnValue(of({ cveRegistroProductor: '123456' })),
      actualizarRegistro: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [DatosMercanciaComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
        { provide: ExportadorAutorizadoService, useValue: mockExportadorService }
      ],
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(DatosMercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe suscribirse a selectConsultaioState$ y obtener datos si update es true', () => {
    const SPY_OBTENER_DATOS = jest.spyOn(component, 'obtenerDatosBandejaSolicitudes');
    component.ngOnInit();
    expect(component.estadoConsulta.update).toBe(true);
    expect(SPY_OBTENER_DATOS).toHaveBeenCalled();
  });

  it('ngOnInit debe establecer datosRespuestaDisponibles en true si update es false', () => {
    mockConsultaQuery.selectConsultaioState$ = of({ update: false });
    component.ngOnInit();
    expect(component.datosRespuestaDisponibles).toBe(true);
  });

  it('obtenerDatosBandejaSolicitudes debe llamar a obtenerRegistro y actualizarRegistro', () => {
    component.obtenerDatosBandejaSolicitudes();
    expect(mockExportadorService.obtenerRegistro).toHaveBeenCalled();
    expect(mockExportadorService.actualizarRegistro).toHaveBeenCalledWith({ cveRegistroProductor: '123456' });
    expect(component.datosRespuestaDisponibles).toBe(true);
  });

  it('seleccionarPestana debe cambiar el índice de la pestaña', () => {
    component.seleccionarPestana(2);
    expect(component.indicePestana).toBe(2);
    component.seleccionarPestana(1);
    expect(component.indicePestana).toBe(1);
  });

  it('ngOnDestroy debe completar el subject notificadorDestruccion$', () => {
    const SPY_NEXT = jest.spyOn((component as any).notificadorDestruccion$, 'next');
    const SPY_COMPLETE = jest.spyOn((component as any).notificadorDestruccion$, 'complete');
    component.ngOnDestroy();
    expect(SPY_NEXT).toHaveBeenCalled();
    expect(SPY_COMPLETE).toHaveBeenCalled();
  });
});