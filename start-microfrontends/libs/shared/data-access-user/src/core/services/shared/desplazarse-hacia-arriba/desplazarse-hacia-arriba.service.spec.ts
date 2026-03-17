import { TestBed } from '@angular/core/testing';

import { DesplazarseHaciaArribaService } from './desplazarse-hacia-arriba.service';

describe('DesplazarseHaciaArribaService', () => {
  let service: DesplazarseHaciaArribaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesplazarseHaciaArribaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
