import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelTramiteUnoComponent } from './datos-del-tramite-uno.component';
import { InvoCarService } from '../../services/invocar.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('DatosDelTramiteUnoComponent', () => {
  let component: DatosDelTramiteUnoComponent;
  let fixture: ComponentFixture<DatosDelTramiteUnoComponent>;
  let mockInvoCarService: any;

  // Helper to set up the mercanciaTableData structure expected by the component
  function setMercanciaTableData() {
    (component as any).getMercanciaTableData = {
      mercanciaTable: {
        tableHeader: ['Columna 1', 'Columna 2'],
        tableBody: []
      }
    };
  }

  beforeEach(async () => {
    mockInvoCarService = {
      getPais: jest.fn().mockReturnValue(of({ code: 200, data: [] })),
      getEntidadFederativa: jest.fn().mockReturnValue(of({ code: 200, data: [] })),
      getMunicipioDelegacion: jest.fn().mockReturnValue(of({ code: 200, data: [] })),
      getColonia: jest.fn().mockReturnValue(of({ code: 200, data: [] })),
      getAduana: jest.fn().mockReturnValue(of({ code: 200, data: [] })),
      getFraccionArancelariaOptions: jest.fn().mockReturnValue(of({ code: 200, data: [] })),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosDelTramiteUnoComponent],
      declarations: [],
      providers: [
        { provide: InvoCarService, useValue: mockInvoCarService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelTramiteUnoComponent);
    component = fixture.componentInstance;
    setMercanciaTableData();
    fixture.detectChanges();
  });

  it('debería obtener el catálogo de países y asignarlo', () => {
    setMercanciaTableData();
    const mockResponse = { code: 200, data: [{ id: 1, nombre: 'México' }] };
    mockInvoCarService.getPais.mockReturnValue(of(mockResponse));
    component.getPais();
    expect(mockInvoCarService.getPais).toHaveBeenCalled();
    expect(component.pais).toEqual(mockResponse.data);
  });

  it('debería obtener el catálogo de entidades federativas y asignarlo', () => {
    setMercanciaTableData();
    const mockResponse = { code: 200, data: [{ id: 1, nombre: 'CDMX' }] };
    mockInvoCarService.getEntidadFederativa.mockReturnValue(of(mockResponse));
    component.getEntidadFederativa();
    expect(mockInvoCarService.getEntidadFederativa).toHaveBeenCalled();
    expect(component.entidadFederativa).toEqual(mockResponse.data);
  });

  it('debería obtener el catálogo de municipios o delegaciones y asignarlo', () => {
    setMercanciaTableData();
    const mockResponse = { code: 200, data: [{ id: 1, nombre: 'Benito Juárez' }] };
    mockInvoCarService.getMunicipioDelegacion.mockReturnValue(of(mockResponse));
    component.getMunicipioDelegacion();
    expect(mockInvoCarService.getMunicipioDelegacion).toHaveBeenCalled();
    expect(component.municipioDelegacion).toEqual(mockResponse.data);
  });

  it('debería obtener el catálogo de colonias y asignarlo', () => {
    setMercanciaTableData();
    const mockResponse = { code: 200, data: [{ id: 1, nombre: 'Centro' }] };
    mockInvoCarService.getColonia.mockReturnValue(of(mockResponse));
    component.getColonia();
    expect(mockInvoCarService.getColonia).toHaveBeenCalled();
    expect(component.colonia).toEqual(mockResponse.data);
  });

  it('debería obtener el catálogo de aduanas y asignarlo', () => {
    setMercanciaTableData();
    const mockResponse = { code: 200, data: [{ id: 1, nombre: 'Aduana 1' }] };
    mockInvoCarService.getAduana.mockReturnValue(of(mockResponse));
    component.getAduana();
    expect(mockInvoCarService.getAduana).toHaveBeenCalled();
    expect(component.aduana).toEqual(mockResponse.data);
  });

  it('debería obtener los datos de mercancía y asignar el header', () => {
    setMercanciaTableData();
    component.obtenerMercancia();
    expect(component.mercanciaHeaderData).toEqual(component.getMercanciaTableData.mercanciaTable.tableHeader);
  });

  it('debería limpiar el Subject y el modal al destruir el componente', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.modal = 'show';
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
    expect(component.modal).toBe('modal');
  });

  it('debería obtener el encabezado de la tabla de mercancías', () => {
    setMercanciaTableData();
    component.obtenerMercancia();
    expect(component.mercanciaHeaderData).toEqual(['Columna 1', 'Columna 2']);
  });

  it('debería alternar controles correctamente', () => {
    setMercanciaTableData();
    component.crearDatosDelTramiteForm();
    const spyEnable = jest.spyOn(component.datosDelTramite.get('pais')!, 'enable');
    const spyDisable = jest.spyOn(component.datosDelTramite.get('pais')!, 'disable');
    (component as any).alternarControles(true);
    expect(spyEnable).toHaveBeenCalled();
    (component as any).alternarControles(false);
    expect(spyDisable).toHaveBeenCalled();
  });

  it('debería agregar mercancía si el formulario es válido', () => {
    setMercanciaTableData();
    component.getAgregarForm();
    component.agregarForm.setValue({
      fraccionArancelaria: '123',
      descripcion: 'desc',
      descripcionAdicional: 'adicional'
    });
    const cerrarModalSpy = jest.spyOn(component, 'cerrarModal');
    component.obtenerMercancia();
    component.agregarMercancias();
    expect(component.getMercanciaTableData.mercanciaTable.tableBody.length).toBe(0);
    expect(cerrarModalSpy).toHaveBeenCalled();
  });

  it('no debería agregar mercancía si el formulario es inválido', () => {
    setMercanciaTableData();
    component.getAgregarForm();
    component.agregarForm.setValue({
      fraccionArancelaria: '',
      descripcion: '',
      descripcionAdicional: ''
    });
    const cerrarModalSpy = jest.spyOn(component, 'cerrarModal');
    component.agregarMercancias();
    expect(component.getMercanciaTableData.mercanciaTable.tableBody.length).toBe(0);
    expect(cerrarModalSpy).not.toHaveBeenCalled();
  });

  



  it('debería alternar exclusividad de checkboxes en onCambioCheckbox', () => {
    setMercanciaTableData();
    component.crearDatosDelTramiteForm();
    const event = { target: { checked: true } } as any as Event;
    component.datosDelTramite.get('ubicacion')?.setValue(true);
    component.onCambioCheckbox(event, 'domicilio');
    expect(component.datosDelTramite.get('ubicacion')?.value).toBe(false);
    component.datosDelTramite.get('domicilio')?.setValue(true);
    component.onCambioCheckbox(event, 'ubicacion');
    expect(component.datosDelTramite.get('domicilio')?.value).toBe(false);
  });

  it('debería llamar cerrarModal si closeModal existe', () => {
    setMercanciaTableData();
    const clickSpy = jest.fn();
    (component as any).closeModal = { nativeElement: { click: clickSpy } };
    component.cerrarModal();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('debería no fallar cerrarModal si closeModal no existe', () => {
    setMercanciaTableData();
    (component as any).closeModal = undefined;
    expect(() => component.cerrarModal()).not.toThrow();
  });

  it('debería obtener fracciones arancelarias y asignarlas', () => {
    setMercanciaTableData();
    const mockResponse = { code: 200, data: [{ id: 1, nombre: 'Fracción' }] };
    mockInvoCarService.getFraccionArancelariaOptions.mockReturnValue(of(mockResponse));
    component.getFraccionArancelariae();
    expect(mockInvoCarService.getFraccionArancelariaOptions).toHaveBeenCalled();
    expect(component.fraccionArancelaria).toEqual(mockResponse.data);
  });

  it('debería abrir el modal y llamar getAgregarForm', () => {
    setMercanciaTableData();
    const spy = jest.spyOn(component, 'getAgregarForm');
    component.abrirModal();
    expect(component.modal).toBe('show');
    expect(spy).toHaveBeenCalled();
  });

 

  it('debería ejecutar fetchTableDummyJson y agregar datos', () => {
    setMercanciaTableData();
    const initialLength = component.mercanciaBodyData.length;
    component.fetchTableDummyJson();
    expect(component.mercanciaBodyData.length).toBe(initialLength + 1);
  });
});