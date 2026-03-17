import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { RegistrarSolicitudMcpService } from './registrar-solicitud-mcp.service';
import { FilaData2, ListaClave } from '../../models/fila-modal';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { MercanciaCrossList } from '../../models/mercancia.model';
import { TramitesAsociados } from '../../models/destinatario.model';

describe('RegistrarSolicitudMcpService', () => {
  let service: RegistrarSolicitudMcpService;
  let httpClientSpy: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        RegistrarSolicitudMcpService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(RegistrarSolicitudMcpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get estados data', (done) => {
    const mockData: Catalogo[] = [{ id: 1, descripcion: 'Estado' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.getEstadosData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/json/260702/estado.json');
      done();
    });
  });

  it('should get clave scian data', (done) => {
    const mockData: Catalogo[] = [{ id: 2, descripcion: 'Clave SCIAN' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.getClaveScianData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/json/260702/clavescian.json');
      done();
    });
  });

  it('should get clave descripcion del data', (done) => {
    const mockData: Catalogo[] = [{ id: 3, descripcion: 'Descripcion Del' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.getClaveDescripcionDelData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/json/260702/clavedescripciondel.json');
      done();
    });
  });

  it('should get regimenalque data', (done) => {
    const mockData: Catalogo[] = [{ id: 4, descripcion: 'Regimen' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.getRegimenalqueData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/json/260702/regimen.json');
      done();
    });
  });

  it('should get aduana data', (done) => {
    const mockData: Catalogo[] = [{ id: 5, descripcion: 'Aduana' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.getAduanaData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/json/260702/adauna.json');
      done();
    });
  });

  it('should get banco data', (done) => {
    const mockData: Catalogo[] = [{ id: 6, descripcion: 'Banco' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.getBancoData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/json/260702/banco.json');
      done();
    });
  });

  it('should get pais data', (done) => {
    const mockData: Catalogo[] = [{ id: 7, descripcion: 'Pais' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.getPaisData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/json/260702/pais.json');
      done();
    });
  });

  it('should get tramites asociados', (done) => {
    const mockData: TramitesAsociados[] = [{} as TramitesAsociados];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.getTramitesAsociados().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/json/260702/tramitesasociados.json');
      done();
    });
  });

  it('should get mercancias data', (done) => {
    const mockData: FilaData2[] = [{
      id: 1,
      clasificaionProductos: 'Clasificacion 1',
      especificarProducto: 'Especificar 1',
      nombreProductoEspecifico: 'Nombre Especifico 1',
      marca: 'Marca 1',
      tipoProducto: 'Tipo 1',
      fraccionArancelaria: 'Fraccion 1',
      descripcionFraccionArancelaria: 'Descripcion Fraccion 1',
      cantidadUMT: 'Cantidad UMT 1',
      umt: 'UMT 1',
      cantidadUMC: 'Cantidad UMC 1',
      umc: 'UMC 1',
      paisDeOrigen: 'Pais De Origen 1',
      paisDeProcedencia: 'Pais De Procedencia 1',
      usoEspecifico: 'Uso Especifico 1'
    }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.getMercanciasData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/json/260702/mercanciatabla.json');
      done();
    });
  });

  it('should get clasificacion del producto data', (done) => {
    const mockData: Catalogo[] = [{ id: 8, descripcion: 'Clasificacion' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.getClasificacionDelProductoData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/json/260702/delproducto.json');
      done();
    });
  });

  it('should get espificar data', (done) => {
    const mockData: Catalogo[] = [{ id: 9, descripcion: 'Espificar' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.getEspificarData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/json/260702/espicificar.json');
      done();
    });
  });

  it('should get tipo producto data', (done) => {
    const mockData: Catalogo[] = [{ id: 10, descripcion: 'Tipo Producto' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.getTipoProductoData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/json/260702/tipoproducto.json');
      done();
    });
  });

  it('should get lista clave data', (done) => {
    const mockData: ListaClave[] = [{ 
  id: 1,
  claveDeLosLotes: 'A',
  fechaDeFabricacion: '2023-01-01',
  fechaDeCaducidad: '2024-01-01'
    } as ListaClave];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.getListaClaveData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/json/260702/lista-clave.json');
      done();
    });
  });

  it('should get mercancia crosslist data', (done) => {
    const mockCrossList = {} as any; // Replace with appropriate mock object if needed
    const mockData: MercanciaCrossList[] = [{ 
          paisOrigenCrossList: mockCrossList,
          paisProcedencisCrossList: mockCrossList,
          usoEspecificoCrossList: mockCrossList,
     } as MercanciaCrossList];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.getMercanciaCrosslistData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('./assets/json/260702/mercancia-crosslist.json');
      done();
    });
  });
});