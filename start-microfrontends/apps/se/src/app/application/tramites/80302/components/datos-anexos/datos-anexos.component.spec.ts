import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosAnexosComponent } from './datos-anexos.component';
import { SolicitudService } from '../../service/solicitud.service';
import { of, throwError } from 'rxjs';
import {
  Anexo,
  AnexoImportacion,
  ProductoExportacion,
} from '../../estados/models/plantas-consulta.model';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Tramite80302Store } from '../../../../estados/tramites/tramite80302.store';

describe('DatosAnexosComponent', () => {
  let component: DatosAnexosComponent;
  let fixture: ComponentFixture<DatosAnexosComponent>;
  // allow loose typing for the mocked service to avoid strict JSONResponse typing in tests
  let mockSolicitudService: jest.Mocked<SolicitudService> | any;
  let toastrService: jest.Mocked<ToastrService>;
  let mockTramiteStore: Partial<Tramite80302Store> & { setDatosAnexo?: jest.Mock; setDatosImportacion?: jest.Mock };

  const dummyAnexos: Anexo[] = [
    {
      tipoFraccion: 'Exportación',
      fraccionArancelariaExportacion: '1234.56.78',
      fraccionArancelariaImportacion: '8765.43.21',
      descripcion: 'Descripción de prueba',
      valoresAnteriores: 'Valor 1',
    },
  ];

  const dummyExportResponse = {
    datos: [
      ({
        tipoFraccion: 'Exportación',
        fraccionArancelariaExportacion: '1234.56.78',
        fraccionArancelariaImportacion: '8765.43.21',
        descripcion: 'Descripción de prueba',
        valoresAnteriores: 'Valor 1',
      } as unknown) as ProductoExportacion,
      {
        // all nulls should be filtered out
        tipoFraccion: null,
        fraccionArancelariaExportacion: null,
        fraccionArancelariaImportacion: null,
        descripcion: null,
        valoresAnteriores: null,
      } as unknown as ProductoExportacion,
    ],
  };

  const dummyImportResponse = {
    datos: [
      ({
        tipoFraccion: 'Importación',
        fraccionArancelariaImportacion: '1111.22.33',
        descripcion: 'Importación prueba',
      } as unknown) as AnexoImportacion,
      {
        tipoFraccion: null,
        fraccionArancelariaImportacion: null,
        descripcion: null,
      } as unknown as AnexoImportacion,
    ],
  };

  beforeEach(async () => {
    mockSolicitudService = {
      obtenerAnexo: jest.fn(),
      obtenerAnexoExportacion: jest.fn(),
      obtenerAnexoImportacion: jest.fn(),
    } as unknown as jest.Mocked<SolicitudService>;

    toastrService = {
      error: jest.fn(),
    } as unknown as jest.Mocked<ToastrService>;

    mockTramiteStore = {
      setDatosAnexo: jest.fn(),
      setDatosImportacion: jest.fn(),
    } as unknown as Partial<Tramite80302Store> & {
      setDatosAnexo: jest.Mock; setDatosImportacion: jest.Mock
    };

    await TestBed.configureTestingModule({
      imports: [DatosAnexosComponent, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: ToastrService, useValue: toastrService },
        { provide: Tramite80302Store, useValue: mockTramiteStore },
        {
          provide: '_HttpClient',
          useValue: {} // Mock implementation of _HttpClient
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosAnexosComponent);
    component = fixture.componentInstance;
    
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call obtenerAnexoExportacion and populate datosAnexo and call store.setDatosAnexo', () => {
    mockSolicitudService.obtenerAnexoExportacion.mockReturnValue(of(dummyExportResponse));
    mockSolicitudService.obtenerAnexoImportacion.mockReturnValue(of({ datos: [] }));

  fixture.detectChanges(); // triggers ngOnInit

    expect(mockSolicitudService.obtenerAnexoExportacion).toHaveBeenCalled();
    // the response had one valid entry and one all-null entry, so only one should remain
    expect(component.datosAnexo.length).toBe(1);
    expect(component.datosAnexo[0].tipoFraccion).toBe('Exportación');
    expect((mockTramiteStore.setDatosAnexo as jest.Mock)).toHaveBeenCalledWith(component.datosAnexo);
  });

  it('should call obtenerAnexoImportacion and populate datosImportacion and call store.setDatosImportacion', () => {
    mockSolicitudService.obtenerAnexoExportacion.mockReturnValue(of({ datos: [] }));
    mockSolicitudService.obtenerAnexoImportacion.mockReturnValue(of(dummyImportResponse));

  fixture.detectChanges();

    expect(mockSolicitudService.obtenerAnexoImportacion).toHaveBeenCalled();
    expect(component.datosImportacion.length).toBe(1);
    expect(component.datosImportacion[0].descripcion).toBe('Importación prueba');
    expect(component.datosImportacion[0].tipoFraccion).toBe('Importación');
    expect((mockTramiteStore.setDatosImportacion as jest.Mock)).toHaveBeenCalledWith(component.datosImportacion);
  });

  it('should not set datosAnexo when obtenerAnexoExportacion returns non-object', () => {
    mockSolicitudService.obtenerAnexoExportacion.mockReturnValue(of(null));
    mockSolicitudService.obtenerAnexoImportacion.mockReturnValue(of({ datos: [] }));

    fixture.detectChanges();

    expect(component.datosAnexo).toEqual([]);
    expect((mockTramiteStore.setDatosAnexo as jest.Mock)).not.toHaveBeenCalled();
  });

  it('should show toastr error when obtenerAnexoExportacion fails', () => {
    mockSolicitudService.obtenerAnexoExportacion.mockReturnValue(throwError(() => new Error('fail export')));
    mockSolicitudService.obtenerAnexoImportacion.mockReturnValue(of({ datos: [] }));

    fixture.detectChanges();

    expect((toastrService.error as jest.Mock)).toHaveBeenCalledWith('Error al cargar los anexos de exportación');
  });

  it('should show toastr error when obtenerAnexoImportacion fails', () => {
    mockSolicitudService.obtenerAnexoExportacion.mockReturnValue(of({ datos: [] }));
    mockSolicitudService.obtenerAnexoImportacion.mockReturnValue(throwError(() => new Error('fail import')));

    fixture.detectChanges();

    expect((toastrService.error as jest.Mock)).toHaveBeenCalledWith('Error al cargar los anexos de importación');
  });

  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
