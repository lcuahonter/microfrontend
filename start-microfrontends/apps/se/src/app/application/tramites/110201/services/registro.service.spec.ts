import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { RegistroService } from './registro.service';
import { Tramite110201Store } from '../state/Tramite110201.store';
import { Tramite110201Query } from '../state/Tramite110201.query';

describe('RegistroService', () => {
  let service: RegistroService;
  let httpMock: any;
  let storeMock: any;
    let queryMock: any;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    };
    queryMock = {
      select: jest.fn().mockReturnValue(of({})),
      getValue: jest.fn().mockReturnValue({})
    };
    storeMock = {
      setTratado: jest.fn(),
      setPais: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setNumRegistro: jest.fn(),
      setNomComercial: jest.fn(),
      setFechInicioB: jest.fn(),
      setFechFinB: jest.fn(),
      setArchivo: jest.fn(),
      setObservaciones: jest.fn(),
      setPresica: jest.fn(),
      setPresenta: jest.fn(),
      setIdioma: jest.fn(),
      setEntidad: jest.fn(),
      setRepresentacion: jest.fn(),
      setNombre: jest.fn(),
      setApellidoPrimer: jest.fn(),
      setApellidoSegundo: jest.fn(),
      setNumeroFiscal: jest.fn(),
      setRazonSocial: jest.fn(),
      setCiudad: jest.fn(),
      setCalle: jest.fn(),
      setNumeroLetra: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setFax: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setNacion: jest.fn(),
      setTransporte: jest.fn(),
      setfraccionMercanArancelaria: jest.fn(),
      setnombretecnico: jest.fn(),
      setnomreeningles: jest.fn(),
      setcriterioparaconferir: jest.fn(),
      setmarca: jest.fn(),
      setcantidad: jest.fn(),
      setUMC: jest.fn(),
      setvalordelamercancia: jest.fn(),
      setcomplementodeladescripcion: jest.fn(),
      setmasabruta: jest.fn(),
      setnombrecomercialdelamercancia: jest.fn(),
      setUnidadMedida: jest.fn(),
      setTipoFactura: jest.fn(),
      setFecha: jest.fn(),
      setNFactura: jest.fn(),
      setJustificacion: jest.fn(),
      setCheckbox: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        RegistroService,
        { provide: HttpClient, useValue: httpMock },
        { provide: Tramite110201Query, useValue: queryMock },
        { provide: Tramite110201Store, useValue: storeMock }
      ]
    });
    service = TestBed.inject(RegistroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http.get for getTratado', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getTratado().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110201/tratado.json');
  });

  it('should call http.get for getPais', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getPais().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110201/pais.json');
  });

  it('should call http.get for getIdioma', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getIdioma().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110201/idioma.json');
  });

  it('should call http.get for getPaisDestino', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getPaisDestino().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110201/pais-destino.json');
  });

  it('should call http.get for getTransporte', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getTransporte().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110201/transporte.json');
  });

  it('should call http.get for getEntidad', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getEntidad().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110201/entidad.json');
  });

  it('should call http.get for getRepresentacion', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getRepresentacion().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110201/representacion.json');
  });

  it('should call http.get for getTipoFactura', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getTipoFactura().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110201/tipofactura.json');
  });

  it('should call http.get for getUMC', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getUMC().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110201/umc.json');
  });

  it('should call http.get for getUnidadMedida', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getUnidadMedida().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110201/umc.json');
  });

  it('should call http.get for getCatalogoById', () => {
    httpMock.get.mockReturnValue(of({}));
    service.urlServerCatalogos = 'mockUrl';
    service.getCatalogoById(5).subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('mockUrl/5');
  });

  it('should call http.get for getSolicitudesTabla and handle error', () => {
    httpMock.get.mockReturnValue(of([]));
    service.getSolicitudesTabla().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110201/mercancia-disponsible.json');
    // Error branch
    httpMock.get.mockReturnValue(throwError(() => new Error('fail')));
    service.getSolicitudesTabla().subscribe({ error: () => expect(true).toBeTruthy() });
  });

  it('should call http.get for getSolicitudesDataTabla and handle error', () => {
    httpMock.get.mockReturnValue(of([]));
    service.getSolicitudesDataTabla().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110201/mercancia-seleccionadas.json');
    httpMock.get.mockReturnValue(throwError(() => new Error('fail')));
    service.getSolicitudesDataTabla().subscribe({ error: () => expect(true).toBeTruthy() });
  });

  it('should call all store setters in actualizarEstadoFormulario', () => {
    const datos: any = {
      tratado: [],
      pais: [],
      fraccionArancelaria: '',
      numeroRegistro: '',
      nombreComercial: '',
      fechaInicial: '',
      fechaFinal: '',
      archivo: '',
      observaciones: '',
      presica: '',
      presenta: '',
      idioma: null,
      entidad: null,
      representacion: null,
      nombre: '',
      apellidoPrimer: '',
      apellidoSegundo: '',
      numeroFiscal: '',
      razonSocial: '',
      ciudad: '',
      calle: '',
      numeroLetra: '',
      lada: '',
      telefono: '',
      fax: '',
      correoElectronico: '',
      nacion: null,
      transporte: null,
      fraccionMercanciaArancelaria: '',
      nombreTecnico: '',
      nombreEnIngles: '',
      criterioParaConferir: '',
      marca: '',
      cantidad: '',
      umc: [],
      valorDelaMercancia: '',
      complementoDelaDescripcion: '',
      masaBruta: '',
      nombreComercialDelaMercancia: '',
      unidadMedida: [],
      tipoFactura: [],
      fecha: '',
      numeroFactura: '',
      justificacion: '',
      casillaVerificacion: ''
    };
    service.actualizarEstadoFormulario(datos);
    Object.keys(storeMock).forEach(key => {
      expect(storeMock[key]).toHaveBeenCalled();
    });
  });

  it('should call http.get for getRegistroTomaMuestrasMercanciasData', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getRegistroTomaMuestrasMercanciasData().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110201/registro_toma_muestras_mercancias.json');
  });

  it('should handle error in getRegistroTomaMuestrasMercanciasData', () => {
  httpMock.get.mockReturnValue(throwError(() => new Error('fail')));
  service.getRegistroTomaMuestrasMercanciasData().subscribe({
    error: (err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('fail');
    }
  });
});
});