import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoDeDerechosContenedoraComponent } from './pago-de-derechos-contenedora.component';
import { of } from 'rxjs';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { ActivatedRoute } from '@angular/router';

describe('PagoDeDerechosContenedoraComponent', () => {
  let component: PagoDeDerechosContenedoraComponent;
  let fixture: ComponentFixture<PagoDeDerechosContenedoraComponent>;

  beforeEach(async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    await TestBed.configureTestingModule({
      imports: [PagoDeDerechosContenedoraComponent],
        providers: [
              {
                provide: ActivatedRoute,
                useValue: {
                  params: of({}),
                  queryParams: of({}),
                  data: of({}),
                },
              },
             {
  provide: DatosSolicitudService,
  useValue: {
    obtenerFraccionesCatalogo: jest.fn().mockReturnValue(of([])),
    obtenerUMCCatalogo: jest.fn().mockReturnValue(of([])),
    obtenerMonedaCatalogo: jest.fn().mockReturnValue(of([])),
    obtenerBancos: jest.fn().mockReturnValue(of([])),
  },
}

            ],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
