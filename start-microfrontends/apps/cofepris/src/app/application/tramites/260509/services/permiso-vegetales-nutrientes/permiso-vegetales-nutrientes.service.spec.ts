import { TestBed } from '@angular/core/testing';

import { PermisoVegetalesNutrientesService } from './permiso-vegetales-nutrientes.service';

describe('PermisoVegetalesNutrientesService', () => {
  let service: PermisoVegetalesNutrientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermisoVegetalesNutrientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
