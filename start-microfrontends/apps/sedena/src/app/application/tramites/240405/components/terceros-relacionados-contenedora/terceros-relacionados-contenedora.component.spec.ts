import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosContenedoraComponent } from './terceros-relacionados-contenedora.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

describe('TercerosRelacionadosContenedoraComponent', () => {
  let component: TercerosRelacionadosContenedoraComponent;
  let fixture: ComponentFixture<TercerosRelacionadosContenedoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TercerosRelacionadosContenedoraComponent],
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

    fixture = TestBed.createComponent(TercerosRelacionadosContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});