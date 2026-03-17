import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarDestinatarioFinalContenedoraComponent } from './agregar-destinatario-final-contenedora.component';
import { Tramite240308Store } from '../../../240308/estados/tramite240308Store.store';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { of } from 'rxjs';

describe('AgregarDestinatarioFinalContenedoraComponent', () => {
  let component: AgregarDestinatarioFinalContenedoraComponent;
  let fixture: ComponentFixture<AgregarDestinatarioFinalContenedoraComponent>;
  let mockTramiteStore: jest.Mocked<Tramite240308Store>;
  let mockHttpClient: any;
  let mockDatosSolicitudService: any;

  beforeEach(async () => {
    mockTramiteStore = {
      updateDestinatarioFinalTablaDatos: jest.fn()
    } as any;

    mockHttpClient = {};
    mockDatosSolicitudService = {
      obtenerListaCodigosPostales: jest.fn().mockReturnValue(of([])),
      obtenerListaPaises: jest.fn().mockReturnValue(of([])),
      obtenerListaEstados: jest.fn().mockReturnValue(of([])),
      obtenerListaMunicipios: jest.fn().mockReturnValue(of([])),
      obtenerListaLocalidades: jest.fn().mockReturnValue(of([])),
      obtenerListaColonias: jest.fn().mockReturnValue(of([])),
      obtenerBancos: jest.fn().mockReturnValue(of([])),
      obtenerFraccionesCatalogo: jest.fn().mockReturnValue(of([])),
      obtenerUMCCatalogo: jest.fn().mockReturnValue(of([])),
      obtenerMonedaCatalogo: jest.fn().mockReturnValue(of([])),
      obtenerRegistroTomarMuestrasDatos240118: jest.fn().mockReturnValue(of({})),
      obtenerRegistroTomarMuestrasDatosQuimacs: jest.fn().mockReturnValue(of({})),
      obtenerRegistroTomarMuestrasDatos: jest.fn().mockReturnValue(of({})),
      obtenerRespuestaPorUrl: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AgregarDestinatarioFinalContenedoraComponent],
      providers: [
        { provide: Tramite240308Store, useValue: mockTramiteStore },
        { provide: DatosSolicitudService, useValue: mockDatosSolicitudService },
        { provide: '_HttpClient', useValue: mockHttpClient }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarDestinatarioFinalContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe emitir el evento cerrar', () => {
    jest.spyOn(component.cerrar, 'emit');
    component.cerrar.emit();
    expect(component.cerrar.emit).toHaveBeenCalled();
  });

  it('debe llamar a tramiteStore.updateDestinatarioFinalTablaDatos al ejecutar updateDestinatarioFinalTablaDatos', () => {
    const destinatariosPrueba = [{ id: 1, nombre: 'Destinatario' }] as any;
    component.updateDestinatarioFinalTablaDatos(destinatariosPrueba);
    expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith(destinatariosPrueba);
  });
});
