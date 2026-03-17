import { TestBed } from '@angular/core/testing';
import { PermisoImportacionService } from './permiso-importacion.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PermisoImportacionStore } from '../estados/permiso-importacion.store';
import { DatosGrupos } from '../models/permiso-importacion-modification.model';
  describe('PermisoImportacionService', () => {
    let service: PermisoImportacionService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          PermisoImportacionService,
          { provide: PermisoImportacionStore, useValue: { update: jest.fn() } }
        ]
      });
      service = TestBed.inject(PermisoImportacionService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should fetch registro tomar muestras datos', () => {
      const mockDatos: DatosGrupos = { /* mock properties here */ } as DatosGrupos;

      service.obtenerRegistroTomarMuestrasDatos().subscribe((data) => {
        expect(data).toEqual(mockDatos);
      });

      const req = httpMock.expectOne('assets/json/130120/respuestaDeActualizacionDe.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockDatos);
    });
    it('should update the store with the provided datos', () => {
      const mockDatos: DatosGrupos = { campo1: 'valor1', campo2: 2 } as unknown as DatosGrupos;
      const store = TestBed.inject(PermisoImportacionStore);
      const updateSpy = jest.spyOn(store, 'update');
      service.actualizarEstadoFormulario(mockDatos);
      expect(updateSpy).toHaveBeenCalledWith(expect.any(Function));
      const prevState = { campo1: 'old', campo2: 1 };
      const updater = updateSpy.mock.calls[0][0] as (state: any) => any;
      expect(typeof updater).toBe('function');
      expect(updater(prevState)).toEqual({ ...prevState, ...mockDatos });
    });
  });
