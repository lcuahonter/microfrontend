import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FloraFaunaService } from './flora-fauna.service';
import { Tramite250101Store } from '../estados/tramite250101.store';

describe('FloraFaunaService', () => {
  let service: FloraFaunaService;
  let httpMock: HttpTestingController;
  let storeMock: any;

  beforeEach(() => {
    storeMock = {
      establecerTipoAduana: jest.fn(),
      establecerTipoInspectoria: jest.fn(),
      establecerTipoMunicipio: jest.fn(),
      establecerDestinatarioDenominacion: jest.fn(),
      establecerDestinatarioPais: jest.fn(),
      establecerDestinatarioEstado: jest.fn(),
      establecerDestinatarioCodigoPostal: jest.fn(),
      establecerDestinatarioDomicilio: jest.fn(),
      establecerAgenteAduanalNombre: jest.fn(),
      establecerAgenteAduanalPrimerApellido: jest.fn(),
      establecerAgenteAduanalSegundoApellido: jest.fn(),
      establecerAgenteAduanalPatente: jest.fn(),
      establecerDestinatario: jest.fn(),
      establecerAgenteAduanal: jest.fn(),
      setClave: jest.fn(),
      setBanco: jest.fn(),
      setLlave: jest.fn(),
      setFecha: jest.fn(),
      setImporte: jest.fn(),
      setRevisados: jest.fn(),
      setMedio: jest.fn(),
      setIdentificacion: jest.fn(),
      setEconomico: jest.fn(),
      setPlaca: jest.fn(),
      setNumero: jest.fn(),
      setFechas: jest.fn(),
      setRequisito: jest.fn(),
      setArancelaria: jest.fn(),
      setCantidad: jest.fn(),
      setMedida: jest.fn(),
      setGenero: jest.fn(),
      setEspecie: jest.fn(),
      setComun: jest.fn(),
      setOrigen: jest.fn(),
      setProcedencia: jest.fn(),
      setDescripcion: jest.fn(),
      setFraccion: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Tramite250101Store, useValue: storeMock }
      ]
    });
    service = TestBed.inject(FloraFaunaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener los datos de registro toma muestras mercancías', () => {
    const mockData = { clave: 'test' } as any;
    service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/250101/flora-fauna-consulta.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería llamar a todos los setters del store en actualizarEstadoFormulario', () => {
    const datos = {
      tipoAduana: 'aduana',
      tipoInspectoria: 'inspectoria',
      tipoMunicipio: 'municipio',
      destinatarioDenominacion: 'denom',
      destinatarioPais: 'pais',
      destinatarioEstado: 'estado',
      destinatarioCodigoPostal: 'cp',
      destinatarioDomicilio: 'dom',
      agenteAduanalNombre: 'nombre',
      agenteAduanalPrimerApellido: 'ap1',
      agenteAduanalSegundoApellido: 'ap2',
      agenteAduanalPatente: 'patente',
      destinatarioRowData: [],
      agenteAduanalRowData: [],
      clave: 'clave',
      banco: 'banco',
      llave: 'llave',
      fecha: 'fecha',
      importe: 'importe',
      revisados: true,
      medio: 'medio',
      identificacion: 'id',
      economico: 'eco',
      placa: 'placa',
      numero: 'num',
      fechas: 'fechas',
      requisito: 'req',
      arancelaria: 'arancel',
      cantidad: 'cant',
      medida: 'med',
      genero: 'gen',
      especie: 'esp',
      comun: 'com',
      origen: 'ori',
      procedencia: 'proc',
      descripcion: 'desc',
      fraccion: 'frac'
    } as any;

    service.actualizarEstadoFormulario(datos);

    expect(storeMock.establecerTipoAduana).toHaveBeenCalledWith('aduana');
    expect(storeMock.establecerTipoInspectoria).toHaveBeenCalledWith('inspectoria');
    expect(storeMock.establecerTipoMunicipio).toHaveBeenCalledWith('municipio');
    expect(storeMock.establecerDestinatarioDenominacion).toHaveBeenCalledWith('denom');
    expect(storeMock.establecerDestinatarioPais).toHaveBeenCalledWith('pais');
    expect(storeMock.establecerDestinatarioEstado).toHaveBeenCalledWith('estado');
    expect(storeMock.establecerDestinatarioCodigoPostal).toHaveBeenCalledWith('cp');
    expect(storeMock.establecerDestinatarioDomicilio).toHaveBeenCalledWith('dom');
    expect(storeMock.establecerAgenteAduanalNombre).toHaveBeenCalledWith('nombre');
    expect(storeMock.establecerAgenteAduanalPrimerApellido).toHaveBeenCalledWith('ap1');
    expect(storeMock.establecerAgenteAduanalSegundoApellido).toHaveBeenCalledWith('ap2');
    expect(storeMock.establecerAgenteAduanalPatente).toHaveBeenCalledWith('patente');
    expect(storeMock.establecerDestinatario).toHaveBeenCalledWith([]);
    expect(storeMock.establecerAgenteAduanal).toHaveBeenCalledWith([]);
    expect(storeMock.setClave).toHaveBeenCalledWith('clave');
    expect(storeMock.setBanco).toHaveBeenCalledWith('banco');
    expect(storeMock.setLlave).toHaveBeenCalledWith('llave');
    expect(storeMock.setFecha).toHaveBeenCalledWith('fecha');
    expect(storeMock.setImporte).toHaveBeenCalledWith('importe');
    expect(storeMock.setRevisados).toHaveBeenCalledWith(true);
    expect(storeMock.setMedio).toHaveBeenCalledWith('medio');
    expect(storeMock.setIdentificacion).toHaveBeenCalledWith('id');
    expect(storeMock.setEconomico).toHaveBeenCalledWith('eco');
    expect(storeMock.setPlaca).toHaveBeenCalledWith('placa');
    expect(storeMock.setNumero).toHaveBeenCalledWith('num');
    expect(storeMock.setFechas).toHaveBeenCalledWith('fechas');
    expect(storeMock.setRequisito).toHaveBeenCalledWith('req');
    expect(storeMock.setArancelaria).toHaveBeenCalledWith('arancel');
    expect(storeMock.setCantidad).toHaveBeenCalledWith('cant');
    expect(storeMock.setMedida).toHaveBeenCalledWith('med');
    expect(storeMock.setGenero).toHaveBeenCalledWith('gen');
    expect(storeMock.setEspecie).toHaveBeenCalledWith('esp');
    expect(storeMock.setComun).toHaveBeenCalledWith('com');
    expect(storeMock.setOrigen).toHaveBeenCalledWith('ori');
    expect(storeMock.setProcedencia).toHaveBeenCalledWith('proc');
    expect(storeMock.setDescripcion).toHaveBeenCalledWith('desc');
    expect(storeMock.setFraccion).toHaveBeenCalledWith('frac');
  });
});
