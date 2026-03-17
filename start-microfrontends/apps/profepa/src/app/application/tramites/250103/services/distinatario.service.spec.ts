import { TestBed } from '@angular/core/testing';
import { DistinatarioService } from './distinatario.service';

describe('DistinatarioService', () => {
  let service: DistinatarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistinatarioService);
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });
});
