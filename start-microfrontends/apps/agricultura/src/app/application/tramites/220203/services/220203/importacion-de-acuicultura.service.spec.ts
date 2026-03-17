// importacion-de-acuicultura.service.spec.ts
import { of } from 'rxjs';
import { AcuiculturaStore } from '../../estados/220203/sanidad-certificado.store';
import { ImportacionDeAcuiculturaService } from './importacion-de-acuicultura.service';

describe('ImportacionDeAcuiculturaService', () => {
  let servicio: ImportacionDeAcuiculturaService;
  let httpClienteMock: any;
  let acuiculturaStoreMock: any;
  let seccionStoreMock: any;

  beforeEach(() => {
    httpClienteMock = {
      get: jest.fn()
    };

    acuiculturaStoreMock = {
      _select: jest.fn(),
      actualizarPagoDeDerechos: jest.fn(),
      actualizarFormularioMovilizacion: jest.fn(),
      actualizarDatosMercancia: jest.fn(),
      limpiarFormulario: jest.fn(),
      actualizarTodoElEstado: jest.fn(),
      actualizarSoloRealizarGroup: jest.fn(),
      updateTercerosRelacionados: jest.fn(),
    };

    seccionStoreMock = {
      // simular métodos necesarios aquí (actualmente ninguno llamado)
    };

    servicio = new ImportacionDeAcuiculturaService(
      httpClienteMock,
      acuiculturaStoreMock,
      seccionStoreMock
    );
  });

  it('debería crearse', () => {
    expect(servicio).toBeTruthy();
  });

  it('obtenerDetallesDelCatalogo debe llamar a http.get con la url correcta', () => {
    const archivo = 'catalogo.json';
    const respuestaMock = { datos: 'prueba' };
    httpClienteMock.get.mockReturnValue(of(respuestaMock));

    servicio.obtenerDetallesDelCatalogo(archivo).subscribe(respuesta => {
      expect(respuesta).toEqual(respuestaMock);
    });

    expect(httpClienteMock.get).toHaveBeenCalledWith('assets/json/220203/' + archivo);
  });

  it('obtenerDatos debe retornar observable del store', () => {
    const datosMock = { algo: 'estado' };
    acuiculturaStoreMock._select.mockReturnValue(of(datosMock));

    const obs$ = servicio.obtenerDatos();
    obs$.subscribe(datos => {
      expect(datos).toEqual(datosMock);
    });

    expect(acuiculturaStoreMock._select).toHaveBeenCalled();
  });

  it('actualizarPagoDeDerechos debe llamar al método del store', () => {
    const pago = { monto: 1000 };
    servicio.actualizarPagoDeDerechos(pago as any);
    expect(acuiculturaStoreMock.actualizarPagoDeDerechos).toHaveBeenCalledWith(pago);
  });

  it('actualizarFormularioMovilizacion debe llamar al método del store', () => {
    const movilizacion = { campo: 'valor' };
    servicio.actualizarFormularioMovilizacion(movilizacion as any);
    expect(acuiculturaStoreMock.actualizarFormularioMovilizacion).toHaveBeenCalledWith(movilizacion);
  });

  it('actualizarDatosMercancia debe llamar al método del store', () => {
    const grupo = { grupo: 'datos' };
    servicio.actualizarDatosMercancia(grupo as any);
    expect(acuiculturaStoreMock.actualizarDatosMercancia).toHaveBeenCalledWith(grupo);
  });

  it('limpiarFormulario debe llamar a limpiarFormulario del store', () => {
    servicio.limpiarFormulario();
    expect(acuiculturaStoreMock.limpiarFormulario).toHaveBeenCalled();
  });

  it('getAcuiculturaData debe llamar a http.get con la url correcta', () => {
    const respuestaMock = { datos: 'mock' };
    httpClienteMock.get.mockReturnValue(of(respuestaMock));
    servicio.getAcuiculturaData().subscribe(datos => {
      expect(datos).toEqual(respuestaMock);
    });
    expect(httpClienteMock.get).toHaveBeenCalledWith('assets/json/220203/acuicultura_forma.json');
  });

  it('actualizarEstadoFormulario debe esperar a actualizarTodoElEstado del store', async () => {
    acuiculturaStoreMock.actualizarTodoElEstado.mockResolvedValue(undefined);

    await servicio.actualizarEstadoFormulario({} as any);
    expect(acuiculturaStoreMock.actualizarTodoElEstado).toHaveBeenCalledWith({});
  });

  it('actualizarSoloRealizarGroup debe llamar a actualizarSoloRealizarGroup del store', () => {
    const grupo = { grupo: 'realizar' };
    servicio.actualizarSoloRealizarGroup(grupo as any);
    expect(acuiculturaStoreMock.actualizarSoloRealizarGroup).toHaveBeenCalledWith(grupo);
  });

  it('updateTercerosRelacionado debe llamar a updateTercerosRelacionados del store', () => {
    const terceros = [{ id: 1 }, { id: 2 }];
    servicio.updateTercerosRelacionado(terceros as any);
    expect(acuiculturaStoreMock.updateTercerosRelacionados).toHaveBeenCalledWith(terceros);
  });

  it('getAllDatosForma debe retornar observable del store', () => {
    const estadoMock = { claveEstado: 'valor' };
    acuiculturaStoreMock._select.mockReturnValue(of(estadoMock));
    servicio.getAllDatosForma().subscribe(res => {
      expect(res).toEqual(estadoMock);
    });
    expect(acuiculturaStoreMock._select).toHaveBeenCalled();
  });
});
