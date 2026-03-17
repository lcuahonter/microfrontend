import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NacionalRegistroDelCafeExportadoresService } from './nacional-registro-del-cafe-exportadores.service';
describe('NacionalRegistroDelCafeExportadoresService', () => {
  let service: NacionalRegistroDelCafeExportadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(NacionalRegistroDelCafeExportadoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
