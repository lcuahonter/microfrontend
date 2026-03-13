import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { TramitesAsociadosSeccionComponent } from './tramites-asociados-seccion.component';
import { EstablecimientoService } from '../../services/establecimiento.service';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { Asociados } from '../../models/datos-de-la-solicitud.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('TramitesAsociadosSeccionComponent', () => {
  let componente: TramitesAsociadosSeccionComponent;
  let fixture: ComponentFixture<TramitesAsociadosSeccionComponent>;
  let mockEstablecimientoService: jest.Mocked<EstablecimientoService>;

  beforeEach(async () => {
    mockEstablecimientoService = {
      enListaDeAsociados: jest.fn(),
    } as unknown as jest.Mocked<EstablecimientoService>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, TramitesAsociadosSeccionComponent],
      declarations: [],
      providers: [{ provide: EstablecimientoService, useValue: mockEstablecimientoService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesAsociadosSeccionComponent);
    componente = fixture.componentInstance;

    // Mock del Subject destroy$ para evitar errores en ngOnDestroy
    componente['destroy$'] = new Subject<void>();

    // Mock del método enListaDeAsociados para devolver un observable con datos simulados
    mockEstablecimientoService.enListaDeAsociados.mockReturnValue(of([
      { id: 1, folioTramite: 'FT123', tipoTramite: 'Tipo 1', estatus: 'Activo', fechaAltaDeRegistro: '2025-04-09' },
    ]));

    fixture.detectChanges();
  });

  afterEach(() => {
    // Asegura que el Subject destroy$ se complete para evitar memory leaks
    componente['destroy$'].next();
    componente['destroy$'].complete();

    fixture.destroy();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar la configuración de la tabla', () => {
    expect(componente.configuracionTablaTramites).toEqual([
      { encabezado: '', clave: expect.any(Function), orden: 1 },
      { encabezado: 'Folio trámite', clave: expect.any(Function), orden: 2 },
      { encabezado: 'Tipo trámite', clave: expect.any(Function), orden: 3 },
      { encabezado: 'Estatus', clave: expect.any(Function), orden: 4 },
      { encabezado: 'Fecha alta de registro', clave: expect.any(Function), orden: 5 },
    ]);
  });

  it('debería llamar a obtenerListaDeAsociados en ngOnInit', () => {
    const spyObtenerLista = jest.spyOn(componente, 'obtenerListaDeAsociados');
    componente.ngOnInit();
    expect(spyObtenerLista).toHaveBeenCalled();
  });

  it('debería obtener y asignar los datos de asociados a la tabla', () => {
    componente.obtenerListaDeAsociados();

    expect(componente.acuseTablaDatos).toEqual([
      { id: 1, folioTramite: 'FT123', tipoTramite: 'Tipo 1', estatus: 'Activo', fechaAltaDeRegistro: '2025-04-09' },
    ]);
    expect(mockEstablecimientoService.enListaDeAsociados).toHaveBeenCalled();
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const spyNext = jest.spyOn(componente['destroy$'], 'next');
    const spyComplete = jest.spyOn(componente['destroy$'], 'complete');

    componente.ngOnDestroy();

    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});