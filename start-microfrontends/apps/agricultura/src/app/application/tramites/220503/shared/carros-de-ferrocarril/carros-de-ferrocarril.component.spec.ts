import { CarrosDeFerrocarrilComponent } from './carros-de-ferrocarril.component';
import { ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TituloComponent } from '@ng-mf/data-access-user';
import { CarrosDeFerrocarril } from '../../models/solicitud-pantallas.model';


describe('CarrosDeFerrocarrilComponent', () => {
  let component: CarrosDeFerrocarrilComponent;
  let fixture: ComponentFixture<CarrosDeFerrocarrilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ],
      imports: [ CarrosDeFerrocarrilComponent, TituloComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrosDeFerrocarrilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have tablaHeadData as input', () => {
    const TESTHEADDATA = ['Número de parcialidad/remesa', 'Cantidad de carros de ferrocarril'];
    component.tablaHeadData = TESTHEADDATA;
    fixture.detectChanges();
    expect(component.tablaHeadData).toEqual(TESTHEADDATA);
  });

  it('should have tablaFilaDatos as input', () => {
    const TESTFILADATOS: CarrosDeFerrocarril[] = [
      { 
        idInspeccionFisica: 1, 
        numeroAutorizacion: 'P001', 
        numeroPartidaMercancia: '10', 
        numeroTotalCarros: 1,
      },
      { 
        idInspeccionFisica: 2, 
        numeroAutorizacion: 'P002', 
        numeroPartidaMercancia: '15', 
        numeroTotalCarros: 1,
      },
    ];
    component.tablaFilaDatos = TESTFILADATOS;
    fixture.detectChanges();
    expect(component.tablaFilaDatos).toEqual(TESTFILADATOS);
  });

  it('should update tableData.tableHeader when tablaHeadData changes', () => {
    const changes = {
      tablaHeadData: {
        currentValue: ['Columna 1', 'Columna 2'],
        previousValue: [],
        firstChange: false,
        isFirstChange: () => false
      }
    };
    component.ngOnChanges(changes);
    expect(component.tableData.tableHeader).toEqual(['Columna 1', 'Columna 2']);
  });

  it('should update tableData.tableBody when tablaFilaDatos changes', () => {
    const filaDatos: CarrosDeFerrocarril[] = [
      { idInspeccionFisica: 1, numeroAutorizacion: 'A', numeroPartidaMercancia: 'X', numeroTotalCarros: 2 }
    ];
    const changes = {
      tablaFilaDatos: {
        currentValue: filaDatos,
        previousValue: [],
        firstChange: false,
        isFirstChange: () => false
      }
    };
    component.ngOnChanges(changes);
    expect(component.tableData.tableBody).toEqual(filaDatos);
  });

  it('should not update tableData if changes do not contain tablaHeadData or tablaFilaDatos', () => {
    component.tableData.tableHeader = [];
    component.tableData.tableBody = [];
    const changes = {};
    component.ngOnChanges(changes);
    expect(component.tableData.tableHeader).toEqual([]);
    expect(component.tableData.tableBody).toEqual([]);
  });

  it('should accept formularioDeshabilitado as input', () => {
    component.formularioDeshabilitado = true;
    fixture.detectChanges();
    expect(component.formularioDeshabilitado).toBe(true);
    component.formularioDeshabilitado = false;
    fixture.detectChanges();
    expect(component.formularioDeshabilitado).toBe(false);
  });
});