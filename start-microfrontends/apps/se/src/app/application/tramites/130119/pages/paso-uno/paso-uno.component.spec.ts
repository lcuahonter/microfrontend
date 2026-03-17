import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatosDeLaSolicitudService } from '../../services/datos-de-la-solicitud/datos-de-la-solicitud.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockDatosDeLaSolicitudService: any;
  let mockConsultaQuery: any;

  beforeEach(async () => {
    mockDatosDeLaSolicitudService = {
      obtenerDatosDeLaSolicitud: jest.fn().mockReturnValue(of({
        descripcion: 'Descripción',
        fraccionArancelaria: 'Fracción',
        umt: 'UMT',
        cantidad: 'Cantidad',
        valorFacturaUSD: 'Valor',
        paisOrigen: 'País Origen',
        paisExportador: 'País Exportador',
        numeroFactura: 'Factura',
        fechaExpedicionFactura: 'Fecha',
        observaciones: 'Observaciones'
      })),
      establecerDatosDeLaSolicitud: jest.fn()
    };

    mockConsultaQuery = {
      selectConsultaioState$: of({ update: true })
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: DatosDeLaSolicitudService, useValue: mockDatosDeLaSolicitudService },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignora errores de elementos desconocidos como solicitante y app-datos-de-la-solicitud
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el índice con el valor predeterminado 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debería actualizar el índice cuando se llama a seleccionaTab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('ngOnInit debería suscribirse a selectConsultaioState$ y obtener datos si update es true', () => {
    const SPY_OBTENER_DATOS = jest.spyOn(component, 'obtenerDatosBandejaSolicitudes');
    component.ngOnInit();
    expect(component.estadoConsulta.update).toBe(true);
    expect(SPY_OBTENER_DATOS).toHaveBeenCalled();
  });

  it('ngOnInit debería establecer datosRespuestaDisponibles en true si update es false', () => {
    mockConsultaQuery.selectConsultaioState$ = of({ update: false });
    component.ngOnInit();
    expect(component.datosRespuestaDisponibles).toBe(true);
  });

  it('obtenerDatosBandejaSolicitudes debería llamar a obtenerDatosDeLaSolicitud y establecerDatosDeLaSolicitud', () => {
    component.obtenerDatosBandejaSolicitudes();
    expect(mockDatosDeLaSolicitudService.obtenerDatosDeLaSolicitud).toHaveBeenCalled();
    expect(mockDatosDeLaSolicitudService.establecerDatosDeLaSolicitud).toHaveBeenCalledWith({
      descripcion: 'Descripción',
      fraccionArancelaria: 'Fracción',
      umt: 'UMT',
      cantidad: 'Cantidad',
      valorFacturaUSD: 'Valor',
      paisOrigen: 'País Origen',
      paisExportador: 'País Exportador',
      numeroFactura: 'Factura',
      fechaExpedicionFactura: 'Fecha',
      observaciones: 'Observaciones'
    });
    expect(component.datosRespuestaDisponibles).toBe(true);
  });

  it('debería renderizar el componente solicitante cuando el índice es 1', () => {
    component.indice = 1;
    fixture.detectChanges();
    const COMPILED = fixture.nativeElement;
    const SOLICITANTE_ELEMENT = COMPILED.querySelector('solicitante');
    expect(SOLICITANTE_ELEMENT).toBeTruthy();
  });

  it('debería renderizar el componente app-datos-de-la-solicitud cuando el índice es 2 y datosRespuestaDisponibles es true', () => {
    component.indice = 2;
    component.datosRespuestaDisponibles = true;
    fixture.detectChanges();
    const COMPILED = fixture.nativeElement;
    const DATOS_DE_LA_SOLICITUD_ELEMENT = COMPILED.querySelector('app-datos-de-la-solicitud');
    expect(DATOS_DE_LA_SOLICITUD_ELEMENT).toBeTruthy();
  });

  it('ngOnDestroy debería completar el subject notificadorDestruccion$', () => {
    const SPY_NEXT = jest.spyOn((component as any).notificadorDestruccion$, 'next');
    const SPY_COMPLETE = jest.spyOn((component as any).notificadorDestruccion$, 'complete');
    component.ngOnDestroy();
    expect(SPY_NEXT).toHaveBeenCalled();
    expect(SPY_COMPLETE).toHaveBeenCalled();
  });
});