import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpCoreService } from '@libs/shared/data-access-user/src';

import { ImmexAmpliacionSensiblesService } from './immex-ampliacion-sensibles.service';

describe('ImmexAmpliacionSensiblesService', () => {
  let service: ImmexAmpliacionSensiblesService;
  let httpCoreServiceMock: any;

  beforeEach(() => {
    httpCoreServiceMock = {
      post: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ImmexAmpliacionSensiblesService,
        { provide: HttpCoreService, useValue: httpCoreServiceMock }
      ]
    });
    
    service = TestBed.inject(ImmexAmpliacionSensiblesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have httpService property', () => {
    expect(service.httpService).toBeTruthy();
  });

});
