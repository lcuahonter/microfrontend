import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelCertificadoComponent } from './datos-del-certificado.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Agregar220401Store } from '../../../../estados/tramites/agregar220401.store';
import { AgregarQuery } from '../../../../estados/queries/agregar.query';
import { Pantallas220401Service } from '../pantallas220401.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

describe('DatosDelCertificadoComponent', () => {
  let component: DatosDelCertificadoComponent;
  let fixture: ComponentFixture<DatosDelCertificadoComponent>;
  let agregar220401StoreMock: any;
  let agregarQueryMock: any;
  let pantallas220401ServiceMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    agregar220401StoreMock = {
      setDelegaciones: jest.fn(),
      setOtraPropiedad: jest.fn(),
     
    };

    agregarQueryMock = {
      selectSolicitud$: of({
        osia: 'OSIA-TEST',
        datoscertificado: 'DATOS-CERT',
        certificada: 'CERTIFICADA',
      }),
    };

    pantallas220401ServiceMock = {
      getDelegacionesData: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Opción 1' }])),
      getState: jest.fn().mockReturnValue(of({ delegacionesControl: 'valor1', delegacionesControl2: 'valor2', delegacionesControl3: 'valor3', delegacionesControl4: 'valor4' })),
      setState: jest.fn(),
        // ✅ Add this line below to fix the pipe error:
  getEspecieData: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Especie 1' }])),
       
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,DatosDelCertificadoComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: Agregar220401Store, useValue: agregar220401StoreMock },
        { provide: AgregarQuery, useValue: agregarQueryMock },
        { provide: Pantallas220401Service, useValue: pantallas220401ServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelCertificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe llamar inicializarCertificadoFormulario', () => {
    const spy = jest.spyOn(component, 'inicializarCertificadoFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('inicializarCertificadoFormulario debe llamar guardarDatosFormulario si es solo lectura', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarCertificadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('inicializarCertificadoFormulario debe llamar inicializarFormulario si no es solo lectura', () => {
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarCertificadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('guardarDatosFormulario debe deshabilitar los formularios si es solo lectura', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.datosdelForm.disabled).toBe(true);
    expect(component.formGroup1.disabled).toBe(true);
  });

  it('guardarDatosFormulario debe habilitar los formularios si no es solo lectura', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.datosdelForm.enabled).toBe(true);
    expect(component.formGroup1.enabled).toBe(true);
  });

  it('inicializarFormulario debe crear los formularios y cargar delegaciones', () => {
    const spy = jest.spyOn(component, 'loaddataDelegacionesData');
    component.inicializarFormulario();
    expect(component.datosdelForm).toBeDefined();
    expect(component.formGroup1).toBeDefined();
    expect(spy).toHaveBeenCalled();
  });

  it('onValueChange debe actualizar selectedValue', () => {
    component.onValueChange('nuevoValor');
    expect(component.selectedValue).toBe('nuevoValor');
  });

  it('loaddataDelegacionesData debe cargar delegaciones y actualizar catalogConfigs', () => {
    component.loaddataDelegacionesData();
    expect(component.delegacionesJson).toEqual([{ id: 1, descripcion: 'Opción 1' }]);
    component.catalogConfigs.forEach(config => {
      expect(config.catalogo).toEqual([{ id: 1, descripcion: 'Opción 1' }]);
    });
  });

  it('updateCatalogConfigs debe actualizar los catálogos de catalogConfigs', () => {
    component.delegacionesJson = [{ id: 2, descripcion: 'Opción 2' }];
    component.updateCatalogConfigs();
    component.catalogConfigs.forEach(config => {
      expect(config.catalogo).toEqual([{ id: 2, descripcion: 'Opción 2' }]);
    });
  });

  it('getDelegaciones debe llamar setState para cada control de delegaciones', () => {
    component.inicializarFormulario();
    component.formGroup1.get('delegacionesControl')?.setValue('valor1');
    component.formGroup1.get('delegacionesControl2')?.setValue('valor2');
    component.formGroup1.get('delegacionesControl3')?.setValue('valor3');
    component.formGroup1.get('delegacionesControl4')?.setValue('valor4');
    component.getDelegaciones();
    expect(pantallas220401ServiceMock.setState).toHaveBeenCalledWith('delegacionesControl', 'valor1');
    expect(pantallas220401ServiceMock.setState).toHaveBeenCalledWith('delegacionesControl2', 'valor2');
    expect(pantallas220401ServiceMock.setState).toHaveBeenCalledWith('delegacionesControl3', 'valor3');
    expect(pantallas220401ServiceMock.setState).toHaveBeenCalledWith('delegacionesControl4', 'valor4');
  });
  it('ngOnDestroy debe limpiar el subject destroyNotifier$', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('tableColumns debe contener las columnas correctas', () => {
    expect(component.tableColumns).toEqual([
      'No. partida',
      'Fracción arancelaria',
      'Descripción de la fracción',
      'Unidad de medida de tarifa (UMT)',
      'Cantidad (UMT)',
      'Unidad de medida de comercialización (UMC)',
      'Cantidad (UMC)',
    ]);
  });

  it('mercanciasData debe contener datos de ejemplo', () => {
    expect(component.mercanciasData.length).toBeGreaterThan(0);
    expect(component.mercanciasData[0].tbodyData.length).toBeGreaterThan(0);
  });
});