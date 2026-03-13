import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumeroDeEmpleadosComponent } from './numero-de-empleados.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { RegistrosDeComercioExteriorService } from '../../services/registros-de-comercio-exterior.service';
import { of } from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('NumeroDeEmpleadosComponent', () => {
  let component: NumeroDeEmpleadosComponent;
  let fixture: ComponentFixture<NumeroDeEmpleadosComponent>;
  let registrosDeComercioExteriorService: any;
  let modalServiceMock: any;

  beforeEach(async () => {
    registrosDeComercioExteriorService = {
      getAnterioresDatos: jest.fn().mockReturnValue(of([])),
      getBancoDatos: jest.fn().mockReturnValue(of({ data: [] })),
    };

    modalServiceMock = {
      show: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [NumeroDeEmpleadosComponent,HttpClientTestingModule],
      providers: [
        { provide: RegistrosDeComercioExteriorService, useValue: registrosDeComercioExteriorService },
        { provide: BsModalService, useValue: modalServiceMock },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NumeroDeEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data on ngOnInit', () => {
    const getAnterioresTablaDatosSpy = jest.spyOn(component, 'getAnterioresTablaDatos');
    const crearAgregarFormSpy = jest.spyOn(component, 'crearAgregarForm');
    const getBancoCatalogDatosSpy = jest.spyOn(component, 'getBancoCatalogDatos');

    component.ngOnInit();

    expect(getAnterioresTablaDatosSpy).toHaveBeenCalled();
    expect(crearAgregarFormSpy).toHaveBeenCalled();
    expect(getBancoCatalogDatosSpy).toHaveBeenCalled();
  });

  it('should fetch previous table data', () => {
    component.getAnterioresTablaDatos();
    expect(registrosDeComercioExteriorService.getAnterioresDatos).toHaveBeenCalled();
    expect(component.numeroDeEmpleadosDatos).toEqual([]);
  });

  it('should initialize agregarForm with correct controls', () => {
    component.crearAgregarForm();
    expect(component.agregarForm.contains('rfc')).toBeTruthy();
    expect(component.agregarForm.contains('numeroUno')).toBeTruthy();
    expect(component.agregarForm.contains('numeroDos')).toBeTruthy();
    expect(component.agregarForm.contains('numeroTres')).toBeTruthy();
    expect(component.agregarForm.contains('agregarCatalogoUno')).toBeTruthy();
    expect(component.agregarForm.contains('agregarCatalogoDos')).toBeTruthy();
    expect(component.agregarForm.contains('agregarCatalogoTres')).toBeTruthy();
  });

  it('should fetch catalog data and assign to bimesters', () => {
    component.getBancoCatalogDatos();
    expect(registrosDeComercioExteriorService.getBancoDatos).toHaveBeenCalled();
    expect(component.bimestreUnoCatalogo).toEqual([]);
    expect(component.bimestreDosCatalogo).toEqual([]);
    expect(component.bimestreTresCatalogo).toEqual([]);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });
});
