import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TercerosRelacionadosFebService } from './tereceros-relacionados-feb.service';

describe('TercerosRelacionadosFebService', () => {
  let service: TercerosRelacionadosFebService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TercerosRelacionadosFebService]
    });
    service = TestBed.inject(TercerosRelacionadosFebService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener los datos de terceros relacionados', () => {
    service.getData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Tercero' }]);
    });
    const req = httpMock.expectOne('assets/json/cofepris/terceros-relacionados.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Tercero' }]);
  });

  it('debería obtener los datos de países', () => {
    service.getPaisData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'México' }]);
    });
    const req = httpMock.expectOne('assets/json/cofepris/pais.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'México' }]);
  });

  it('debería obtener los datos de municipios', () => {
    service.getMunicipioData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Municipio' }]);
    });
    const req = httpMock.expectOne('assets/json/cofepris/municipio.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Municipio' }]);
  });

  it('debería obtener los datos de códigos postales', () => {
    service.getCodigoPostalData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'CP' }]);
    });
    const req = httpMock.expectOne('assets/json/cofepris/codigo-postal.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'CP' }]);
  });

  it('debería obtener los datos de colonias', () => {
    service.getColoniaData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Colonia' }]);
    });
    const req = httpMock.expectOne('assets/json/cofepris/colonia.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Colonia' }]);
  });

  it('debería obtener los datos de localidades', () => {
    service.getLocalidadData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Localidad' }]);
    });
    const req = httpMock.expectOne('assets/json/cofepris/localidad.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Localidad' }]);
  });

  it('debería obtener los encabezados de la tabla', () => {
    service.getEncabezadoDeTabla().subscribe(data => {
      expect(data).toEqual({ columns: ['Col1', 'Col2'] });
    });
    const req = httpMock.expectOne('assets/json/cofepris/encabezado-de-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush({ columns: ['Col1', 'Col2'] });
  });

  it('debería obtener el formulario de fabricante', () => {
    service.getFabricanteForm().subscribe(data => {
      expect(data).toEqual({ rfc: 'RFC1' });
    });
    const req = httpMock.expectOne('assets/json/cofepris/fabricante-form.json');
    expect(req.request.method).toBe('GET');
    req.flush({ rfc: 'RFC1' });
  });

  it('debería obtener el formulario de destinatario', () => {
    service.getDestinatarioForm().subscribe(data => {
      expect(data).toEqual({ rfc: 'RFC2' });
    });
    const req = httpMock.expectOne('assets/json/cofepris/destinatario-form.json');
    expect(req.request.method).toBe('GET');
    req.flush({ rfc: 'RFC2' });
  });

  it('debería obtener el formulario de proveedor', () => {
    service.getProveedorForm().subscribe(data => {
      expect(data).toEqual({ rfc: 'RFC3' });
    });
    const req = httpMock.expectOne('assets/json/cofepris/proveedor-form.json');
    expect(req.request.method).toBe('GET');
    req.flush({ rfc: 'RFC3' });
  });

  it('debería obtener el formulario de facturador', () => {
    service.getFacturadorForm().subscribe(data => {
      expect(data).toEqual({ rfc: 'RFC4' });
    });
    const req = httpMock.expectOne('assets/json/cofepris/facturador-form.json');
    expect(req.request.method).toBe('GET');
    req.flush({ rfc: 'RFC4' });
  });

  it('debería obtener los datos de la tabla de fabricantes', () => {
    service.getFabricanteTabla().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Fabricante' }]);
    });
    const req = httpMock.expectOne('assets/json/260905/fabricante.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Fabricante' }]);
  });

  it('debería obtener los datos de la tabla de otros', () => {
    service.getOtrosTabla().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Otro' }]);
    });
    const req = httpMock.expectOne('assets/json/260905/otros.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Otro' }]);
  });
});