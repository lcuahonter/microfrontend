import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SolicitudService } from './registro-solicitud-anual.service';
import { ReporteFechas } from '../models/programas-reporte.model';
import { SolicitudDeReporteComponent } from '../pages/registro-solicitud-anual/solicitud-de-reporte.component';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { Solicitud150101Query } from '../estados/solicitud150101.query';
import { PROC_150101 } from '../servers/api-route';
import { Solicitud150101State } from '../estados/solicitud150101.store';

describe('SolicitudService', () => {
  let service: SolicitudService;
  let httpMock: HttpTestingController;
  let httpCoreServiceMock: any;
  let queryMock: any;

  let fixture: ComponentFixture<SolicitudDeReporteComponent>;
  let component: SolicitudDeReporteComponent;
  
  beforeEach(() => {
    httpCoreServiceMock = { post: jest.fn() };
    queryMock = { allStoreData$: of({ saldo: 1000 }) };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SolicitudService,
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        { provide: HttpCoreService, useValue: httpCoreServiceMock },
        { provide: Solicitud150101Query, useValue: queryMock },
      ],
    });

    service = TestBed.inject(SolicitudService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SolicitudDeReporteComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (component && typeof component.ngOnDestroy === 'function') {
      component.ngOnDestroy();
    }
    fixture?.destroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch reporte-fechas data', () => {
    const mockReporteFechas: ReporteFechas = {
      reporteAnualFechaInicio: '2023-01',
      reporteAnualFechaFin: '2023-12',
    };

    service.obtenerReporteFechas().subscribe((data) => {
      expect(data).toEqual(mockReporteFechas);
    });

    const req = httpMock.expectOne('assets/json/150101/reporte-fechas.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockReporteFechas);
  });

  it('should fetch registro-solicitud-anual.json data', () => {
    const mockData = { id: 101, nombre: 'Reporte Anual' };

    service.getRegistroSolicitudDatos().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/150101/registro-solicitud-anual.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should return all state data from store', (done) => {
    service.getAllState().subscribe((data) => {
      expect(data).toEqual({ saldo: 1000 });
      done();
    });
  });

  it('should send POST request in guardarDatosPost', () => {
    const mockBody = { key: 'value' };
    const mockResponse = { success: true };

    httpCoreServiceMock.post.mockReturnValue(of(mockResponse));

    service.guardarDatosPost(mockBody).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpCoreServiceMock.post).toHaveBeenCalledWith(PROC_150101.GUARDAR, { body: mockBody });
  });

  it('should correctly build reporteAnual object', () => {
    const mockState: Solicitud150101State = {
      saldo: 5000,
      porcentajeExportacion: 20,
      ventasTotales: 10000,
      totalExportaciones: 8000,
      totalImportaciones: 2000,
    } as unknown as Solicitud150101State;

    const result = service.buildReporteAnual(mockState);

    expect(result).toEqual({
      saldo: 5000,
      porcentaje: 20,
      ventasTotales: 10000,
      totalExportaciones: 8000,
      totalImportaciones: 2000,
      totalPersonalAdmin1: 0,
      totalPersonalAdmin2: 0,
      totalPersonalObrero1: 0,
      totalPersonalObrero2: 0,
    });
  });


});
