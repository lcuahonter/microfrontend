import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { RegistrarConfiguracionesComponent } from './registrar.component';
import { RegistrarCertificadosService } from '../../../core/services/certificados/configuraciones/registrarCertificado.service';
import { ListaSelect } from '../../../core/models/certificados/configuracion/registrar/response/listaSelect';

describe('RegistrarConfiguracionesComponent (standalone)', () => {
  let component: RegistrarConfiguracionesComponent;
  let fixture: ComponentFixture<RegistrarConfiguracionesComponent>;
  let registrarService: {
    obtenerListaTramites: jasmine.Spy;
    obtenerListaPais: jasmine.Spy;
  };

  const TRATADOS_MOCK: ListaSelect[] = [
    { value: 'T1', label: 'Tratado 1' }
  ];

  const PAISES_MOCK: ListaSelect[] = [
    { value: 'MX', label: 'México' }
  ];

  beforeEach(async () => {
    registrarService = {
      obtenerListaTramites: jasmine.createSpy('obtenerListaTramites').and.returnValue(of(TRATADOS_MOCK)),
      obtenerListaPais: jasmine.createSpy('obtenerListaPais').and.returnValue(of(PAISES_MOCK))
    };

    await TestBed.configureTestingModule({
      imports: [RegistrarConfiguracionesComponent],
      providers: [
        { provide: RegistrarCertificadosService, useValue: registrarService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarConfiguracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar listaTratados$ desde el servicio', (done) => {
    component.listaTratados$.subscribe(tratados => {
      expect(tratados).toEqual(TRATADOS_MOCK);
      expect(registrarService.obtenerListaTramites).toHaveBeenCalled();
      done();
    });
  });

  it('debe cargar la lista de países al llamar obtenerListaPais()', () => {
    component.obtenerListaPais();

    expect(registrarService.obtenerListaPais).toHaveBeenCalled();
    expect(component.listaBloquePais).toEqual(PAISES_MOCK);
  });

  it('debe asignar el tratado seleccionado y llamar a obtenerListaPais()', () => {
    const tratado: ListaSelect = { value: 'T1', label: 'Tratado 1' };

    component.seleccionarTratado(tratado);

    expect(component.tratadoSeleccionado).toEqual(tratado);
    expect(registrarService.obtenerListaPais).toHaveBeenCalled();
  });

  it('debe actualizar la fecha de inicio', () => {
    component.cambioFechaInicio('2025-01-01');

    expect(component.fechaInicio).toBe('2025-01-01');
  });
});
