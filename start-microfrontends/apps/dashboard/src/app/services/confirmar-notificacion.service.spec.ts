import { TestBed } from '@angular/core/testing';

import { ConfirmarNotificacionService } from './confirmar-notificacion.service';

describe('ConfirmarNotificacionService', () => {
  let service: ConfirmarNotificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmarNotificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
