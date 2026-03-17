import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProyectoImmexVistaComponent } from './proyecto-immex-vista.component';
import { ProyectoImmexEncabezado } from '../../../../shared/models/nuevo-programa-industrial.model';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { PROYECTO_IMMEX_CONFIG } from '../../../../shared/constantes/anexo-dos-y-tres.enum';
import { PROYECTO_DATOS } from '../../constantes/autorizacion-programa-nuevo.enum';

describe('ProyectoImmexVistaComponent', () => {
  let component: ProyectoImmexVistaComponent;
  let fixture: ComponentFixture<ProyectoImmexVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoImmexVistaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProyectoImmexVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default proyectoImmexDatos', () => {
    expect(component.proyectoImmexDatos).toEqual(PROYECTO_DATOS);
  });

  it('should have default proyectoImmexConfiguartion', () => {
    expect(component.proyectoImmexConfiguartion).toEqual({
      proyectoImmexSeleccionCheckBox: TablaSeleccion.CHECKBOX,
      proyectoImmexTabla: PROYECTO_IMMEX_CONFIG,
    });
  });

  it('should have proyectoImmexTablaLista as empty array', () => {
    expect(component.proyectoImmexTablaLista).toEqual([]);
  });

  it('should emit cerrarPopup event', () => {
    const spy = jest.spyOn(component.cerrarPopup, 'emit');
    component.cerrarPopup.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should update proyectoImmexTablaLista on obtenerProyectoTablaDevolverLaLlamada', () => {
    const mockData: ProyectoImmexEncabezado[] = [{ 
        encabezadoFraccion: 'cdcvhd',
        encabezadoTipoDocument: 'svhgsvchgcgha',
        encabezadoDescripcionOtro: 'cvhgsa',
        encabezadoFechaFirma: 'savc',
        encabezadoFechaVigencia: 'tyutyut',
        encabezadoRfc: 'noinin',
        encabezadoRazonFirmante: 'jbdhjcdcb',
        estatus: true
     }];
    component.obtenerProyectoTablaDevolverLaLlamada(mockData);
    expect(component.proyectoImmexTablaLista).toEqual(mockData);
  });

  it('should call ngOnInit and update proyectoImmexDatos', () => {
    const datosParaNavegar = {
      encabezadoDescripcionComercial: 'desc',
      encabezadoFraccion: 'frac'
    };
    // Mock selectDatosParaNavegar$ observable
    (component as any).query = {
      selectDatosParaNavegar$: {
        pipe: () => ({
          subscribe: (cb: any) => cb(datosParaNavegar)
        })
      }
    };
    component.ngOnInit();
    expect(component.proyectoImmexDatos.descripcion).toBe('desc');
    expect(component.proyectoImmexDatos.fraccionArancelaria).toBe('frac');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
describe('ProyectoImmexVistaComponent - Extended', () => {
  let component: ProyectoImmexVistaComponent;
  let mockQuery: any;
  let mockStore: any;

  beforeEach(() => {
    mockQuery = {
      selectDatosParaNavegar$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn()
      }
    };
    mockStore = {
      setProyectoImmexTablaLista: jest.fn()
    };
    component = new ProyectoImmexVistaComponent(mockQuery, mockStore);
  });

  it('should initialize proyectoImmexDatos with default value', () => {
    expect(component.proyectoImmexDatos).toEqual(PROYECTO_DATOS);
  });

  it('should initialize proyectoImmexConfiguartion correctly', () => {
    expect(component.proyectoImmexConfiguartion).toEqual({
      proyectoImmexSeleccionCheckBox: TablaSeleccion.CHECKBOX,
      proyectoImmexTabla: PROYECTO_IMMEX_CONFIG,
    });
  });

  it('should initialize proyectoImmexTablaLista as empty array', () => {
    expect(component.proyectoImmexTablaLista).toEqual([]);
  });

  it('should emit cerrarPopup event', () => {
    const spy = jest.spyOn(component.cerrarPopup, 'emit');
    component.cerrarPopup.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should subscribe and update proyectoImmexDatos on ngOnInit', () => {
    const datosParaNavegar = {
      encabezadoDescripcionComercial: 'desc',
      encabezadoFraccion: 'frac'
    };
    mockQuery.selectDatosParaNavegar$.pipe = jest.fn(() => ({
      subscribe: (cb: any) => cb(datosParaNavegar)
    }));
    component.ngOnInit();
    expect(component.proyectoImmexDatos.descripcion).toBe('desc');
    expect(component.proyectoImmexDatos.fraccionArancelaria).toBe('frac');
  });

  it('should update proyectoImmexTablaLista and call store on obtenerProyectoTablaDevolverLaLlamada', () => {
    const mockData: ProyectoImmexEncabezado[] = [{ 
              encabezadoFraccion: 'cdcvhd',
        encabezadoTipoDocument: 'svhgsvchgcgha',
        encabezadoDescripcionOtro: 'cvhgsa',
        encabezadoFechaFirma: 'savc',
        encabezadoFechaVigencia: 'tyutyut',
        encabezadoRfc: 'noinin',
        encabezadoRazonFirmante: 'jbdhjcdcb',
        estatus: true
     }];
    component.obtenerProyectoTablaDevolverLaLlamada(mockData);
    expect(component.proyectoImmexTablaLista).toEqual(mockData);
    expect(mockStore.setProyectoImmexTablaLista).toHaveBeenCalledWith(mockData);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});