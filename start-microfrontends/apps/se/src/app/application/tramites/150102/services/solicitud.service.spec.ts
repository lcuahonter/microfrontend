import { SolicitudService } from './solicitud.service';

describe('SolicitudService', () => {
  let service: SolicitudService;
  let httpMock: any;
  let storeMock: any;
  let queryMock: any;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
      post: jest.fn(),
    };
    storeMock = {
      actualizarInicio: jest.fn(),
      actualizarFin: jest.fn(),
      actualizarFolioPrograma: jest.fn(),
      actualizarModalidad: jest.fn(),
      actualizarTipoPrograma: jest.fn(),
      actualizarEstatus: jest.fn(),
      actualizarVentasTotales: jest.fn(),
      actualizarTotalExportaciones: jest.fn(),
      actualizarTotalImportaciones: jest.fn(),
      actualizarSaldo: jest.fn(),
      actualizarPorcentajeExportacion: jest.fn(),
    };
    queryMock = {};
    service = new SolicitudService(httpMock, storeMock, queryMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerProgramasReporte should call http.get with correct url', () => {
    const rfc = 'RFC123';
    const mockResponse = { data: [] };
    httpMock.get.mockReturnValueOnce({ subscribe: jest.fn() });
    service.obtenerProgramasReporte(rfc).subscribe?.();
    expect(httpMock.get).toHaveBeenCalledWith(expect.stringContaining(rfc));
  });

  it('obtenerReporteFechas should call http.get with correct url', () => {
    httpMock.get.mockReturnValueOnce({ subscribe: jest.fn() });
    service.obtenerReporteFechas().subscribe?.();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/150102/reporte-fechas.json');
  });

  it('obtenerProducidosDatos should call http.get with correct url', () => {
    httpMock.get.mockReturnValueOnce({ subscribe: jest.fn() });
    service.obtenerProducidosDatos().subscribe?.();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/150102/producidos-datos.json');
  });

  it('guardarDatosFormulario should call http.get with correct url', () => {
    httpMock.get.mockReturnValueOnce({ subscribe: jest.fn() });
    service.guardarDatosFormulario().subscribe?.();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/150102/guardar-datos-formulario.json');
  });

  it('actualizarEstadoFormulario should update all store fields', () => {
    const resp = {
      inicio: '2023-01-01',
      fin: '2023-12-31',
      folioPrograma: 'FP123',
      modalidad: 'MOD',
      tipoPrograma: 'TIPO',
      estatus: 'ESTATUS',
      ventasTotales: 100,
      totalExportaciones: 50,
      totalImportaciones: 30,
      saldo: 20,
      porcentajeExportacion: 10,
    };
    service.actualizarEstadoFormulario(resp as any);
    expect(storeMock.actualizarInicio).toHaveBeenCalledWith(resp.inicio);
    expect(storeMock.actualizarFin).toHaveBeenCalledWith(resp.fin);
    expect(storeMock.actualizarFolioPrograma).toHaveBeenCalledWith(resp.folioPrograma);
    expect(storeMock.actualizarModalidad).toHaveBeenCalledWith(resp.modalidad);
    expect(storeMock.actualizarTipoPrograma).toHaveBeenCalledWith(resp.tipoPrograma);
    expect(storeMock.actualizarEstatus).toHaveBeenCalledWith(resp.estatus);
    expect(storeMock.actualizarVentasTotales).toHaveBeenCalledWith(resp.ventasTotales);
    expect(storeMock.actualizarTotalExportaciones).toHaveBeenCalledWith(resp.totalExportaciones);
    expect(storeMock.actualizarTotalImportaciones).toHaveBeenCalledWith(resp.totalImportaciones);
    expect(storeMock.actualizarSaldo).toHaveBeenCalledWith(resp.saldo);
    expect(storeMock.actualizarPorcentajeExportacion).toHaveBeenCalledWith(resp.porcentajeExportacion);
  });

  it('guardar should call http.post and map response', (done) => {
    const body = { foo: 'bar' };
    const mockResponse = { ok: true };
    httpMock.post.mockReturnValueOnce({
      pipe: jest.fn((...args) => {
        // Simulate RxJS pipe(map, catchError)
        const mapFn = args[0];
        return {
          subscribe: (cb: any) => {
            cb(mapFn(mockResponse));
            done();
          },
        };
      }),
    });
    service.guardar(body).subscribe((res: any) => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpMock.post).toHaveBeenCalled();
  });

  it('guardar should handle error and throw', (done) => {
    const body = { foo: 'bar' };
    httpMock.post.mockReturnValueOnce({
      pipe: jest.fn((mapFn, catchErrorFn) => {
        return {
          subscribe: (_cb: any, errCb: any) => {
            // Simulate error
            const errorObs = catchErrorFn();
            errorObs.subscribe?.(null, (err: any) => {
              expect(err).toBeInstanceOf(Error);
              done();
            });
          },
        };
      }),
    });
    service.guardar(body).subscribe(
      () => {},
      (err: any) => {
        expect(err).toBeInstanceOf(Error);
        done();
      }
    );
  });
});