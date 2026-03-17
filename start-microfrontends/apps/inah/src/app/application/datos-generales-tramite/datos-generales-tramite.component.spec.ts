import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TramiteService } from '@libs/shared/data-access-user/src/core/services/tramite.service';
import { of, throwError } from 'rxjs';
import { DatosGeneralesTramiteComponent } from './datos-generales-tramite.component';

describe('DetalleVDictamenComponent', () => {
  let component: DatosGeneralesTramiteComponent;
  let fixture: ComponentFixture<DatosGeneralesTramiteComponent>;

  beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [DatosGeneralesTramiteComponent],
    providers: [provideHttpClient()]
  }).compileComponents();
  
  fixture = TestBed.createComponent(DatosGeneralesTramiteComponent);
  component = fixture.componentInstance;
  
  });
  it('Se crea el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar loadComponent si encuentra el componente en la lista al cambiar de pestaña', async () => {
    const mockComponent = jest.fn();
    const mockListaComponentes = [{ id: 1, componentPath: mockComponent }];
    component.slectTramite = { listaComponentes: mockListaComponentes } as any;
    const spy = jest.spyOn(component, 'loadComponent').mockImplementation(async () => {});
    component.viewChildcambioDePestana({ id: 1 } as any);
    expect(spy).toHaveBeenCalledWith(mockListaComponentes[0]);
    spy.mockRestore();
  });

  it('no debe llamar loadComponent si no encuentra el componente en la lista', () => {
    component.slectTramite = { listaComponentes: [{ id: 2 }] } as any;
    const spy = jest.spyOn(component, 'loadComponent');
    component.viewChildcambioDePestana({ id: 1 } as any);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('selectTramite debe seleccionar el trámite correcto', () => {
    component.selectTramite(2);
    fixture.detectChanges();
    expect(component.tramite).toBe(2);
  });

  it('consultarDatosGeneralesTramite debe asignar los datos al formulario y a tareas', () => {
    // Mock TramiteService
    const tramiteService = TestBed.inject(TramiteService);
    const mockData = {
      numeroDeTramite: '123',
      tipoDeSolicitud: 'Tipo',
      diasHabilesTranscurridos: '5',
      tareasActivas: [{
        tarea: 'A',
        nombreTarea: 'Tarea A',
        asignadoA: 'Usuario X',
        fechaAsignacion: '2024-01-01'
      }]
    };
    jest.spyOn(tramiteService, 'obtenerDatosTramite').mockReturnValue(of(mockData));

    // Inicializar formulario y setear idTramite
    component.inicializaFormTramite();
    component.idTramite = '1';

    component.consultarDatosGeneralesTramite();

    expect(component.FormTramite.get('numeroDeTramite')?.value).toBe('123');
    expect(component.FormTramite.get('tipoDeSolicitud')?.value).toBe('Tipo');
    expect(component.FormTramite.get('diasHabilesTranscurridos')?.value).toBe('5');
  });

  it('consultarDatosGeneralesTramite maneja errores correctamente', () => {
    const tramiteService = TestBed.inject(TramiteService);
    jest.spyOn(tramiteService, 'obtenerDatosTramite').mockReturnValue(throwError(() => new Error('error')));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    component.inicializaFormTramite();
    component.idTramite = '1';

    component.consultarDatosGeneralesTramite();

    expect(consoleSpy).toHaveBeenCalledWith('Error al consultar datos del trámite', expect.any(Error));
    consoleSpy.mockRestore();
  });
  
});