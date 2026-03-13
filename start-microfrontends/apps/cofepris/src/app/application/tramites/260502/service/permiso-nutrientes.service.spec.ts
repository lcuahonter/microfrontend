import { TestBed } from '@angular/core/testing';
import { Tramite260502Query } from '../../../estados/queries/260502/tramite260502.query';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { PROC_260502 } from '../server/api-route';
import { PermisoVegetalesNutrientesService } from './permiso-nutrientes.service';

describe('PermisoVegetalesNutrientesService', () => {
  let service: PermisoVegetalesNutrientesService;
  let queryMock: jest.Mocked<Tramite260502Query>;
  let httpCoreMock: jest.Mocked<HttpCoreService>;

  beforeEach(() => {
    queryMock = {
      allStoreData$: of({} as any)
    } as any;

    httpCoreMock = {
      post: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PermisoVegetalesNutrientesService,
        { provide: Tramite260502Query, useValue: queryMock },
        { provide: HttpCoreService, useValue: httpCoreMock },
      ],
    });

    service = TestBed.inject(PermisoVegetalesNutrientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllState()', () => {
    it('should return observable from query.allStoreData$', (done) => {
      service.getAllState().subscribe(result => {
        expect(result).toEqual({});
        done();
      });
    });
  });

  describe('guardarDatosPost()', () => {
    it('should call httpService.post with correct route and body', () => {
      const mockBody = { test: 'value' };

      httpCoreMock.post.mockReturnValue(of({ ok: true }) as any);

      service.guardarDatosPost(mockBody).subscribe();

      expect(httpCoreMock.post).toHaveBeenCalledWith(
        PROC_260502.GUARDAR,
        { body: mockBody }
      );
    });
  });
});
