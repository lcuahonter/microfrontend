
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DatosMercanciaContenedoraComponent } from './datos-mercancia-contenedora.component';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { of } from 'rxjs';

describe('DatosMercanciaContenedoraComponent', () => {
  let component: DatosMercanciaContenedoraComponent;
  let fixture: ComponentFixture<DatosMercanciaContenedoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosMercanciaContenedoraComponent],
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
            obtenerListaCodigosPostales: jest.fn().mockReturnValue(of([])),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosMercanciaContenedoraComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', async () => {
    fixture.detectChanges();
    await fixture.whenStable();  
    fixture.detectChanges();     
    expect(component).toBeTruthy();
  });
});
