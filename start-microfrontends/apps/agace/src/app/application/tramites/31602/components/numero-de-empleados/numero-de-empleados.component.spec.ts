import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumeroDeEmpleadosComponent } from './numero-de-empleados.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { ComercioExteriorService } from '../../services/comercio-exterior.service';
import { of } from 'rxjs';

describe('NumeroDeEmpleadosComponent', () => {
  let component: NumeroDeEmpleadosComponent;
  let fixture: ComponentFixture<NumeroDeEmpleadosComponent>;
  let comercioExteriorServiceMock: any;
  let modalServiceMock: any;

  beforeEach(async () => {
    comercioExteriorServiceMock = {
      getAnterioresDatos: jest.fn().mockReturnValue(of([])),
      getBancoDatos: jest.fn().mockReturnValue(of({ data: [] })),
    };

    modalServiceMock = {
      show: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [NumeroDeEmpleadosComponent],
      providers: [
        { provide: ComercioExteriorService, useValue: comercioExteriorServiceMock },
        { provide: BsModalService, useValue: modalServiceMock },
        FormBuilder,
      ],
    }).overrideComponent(NumeroDeEmpleadosComponent, {
  set: {
    providers: [
      { provide: BsModalService, useValue: modalServiceMock }
    ]
  }
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
    expect(comercioExteriorServiceMock.getAnterioresDatos).toHaveBeenCalled();
    expect(component.numeroDeEmpleadosDatos).toEqual([]);
  });

  it('should open modal with the provided template', () => {
    const templateMock: any = {};
    component.abrirModal(templateMock);
    expect(modalServiceMock.show).toHaveBeenCalledWith(templateMock, { class: 'modal-lg' });
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
    expect(comercioExteriorServiceMock.getBancoDatos).toHaveBeenCalled();
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
