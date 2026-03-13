import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TramitesAsociadosComponent } from './tramites-asociados.component';
import { CertificadosLicenciasService } from '../../services/certificados-licencias.service';
import { of } from 'rxjs';

describe('TramitesAsociadosComponent', () => {
  let component: TramitesAsociadosComponent;
  let fixture: ComponentFixture<TramitesAsociadosComponent>;
  let certificadosLicenciasSvcMock: any;

  beforeEach(async () => {
    certificadosLicenciasSvcMock = {
      getTramitesAsociados: jest.fn().mockReturnValue(of([
        { folioTramite: '123', tipoTramite: 'Type A', estatus: 'Active', fetchAlta: '2023-01-01' },
        { folioTramite: '456', tipoTramite: 'Type B', estatus: 'Inactive', fetchAlta: '2023-02-01' },
      ])),
    };

    await TestBed.configureTestingModule({
      imports: [TramitesAsociadosComponent],
      providers: [
        { provide: CertificadosLicenciasService, useValue: certificadosLicenciasSvcMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TramitesAsociadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar tramitesAsociadosDatos con datos del servicio', () => {
    expect(certificadosLicenciasSvcMock.getTramitesAsociados).toHaveBeenCalled();
    expect(component.tramitesAsociadosDatos.length).toBe(2);
    expect(component.tramitesAsociadosDatos[0].folioTramite).toBe('123');
  });

  it('debería configurar las columnas de la tabla correctamente', () => {
    expect(component.configuracionTabla.length).toBe(4);
    expect(component.configuracionTabla[0].encabezado).toBe('Folio trámite');
    expect(component.configuracionTabla[1].encabezado).toBe('Tipo trámite');
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
