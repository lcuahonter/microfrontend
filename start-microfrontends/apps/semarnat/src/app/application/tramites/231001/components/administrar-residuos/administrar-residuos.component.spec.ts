import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministrarResiduosComponent } from './administrar-residuos.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AdministrarResiduosService } from '../../services/administrar-residuos.service';
import { of, Subject } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdministrarResiduosComponent', () => {
  let component: AdministrarResiduosComponent;
  let fixture: ComponentFixture<AdministrarResiduosComponent>;
  let mockService: any;
  let mockQuery: any;

  beforeEach(async () => {
    mockService = {
      getAdministrarResiduos: jest.fn().mockReturnValue(of({
        tableHeader: ['Col1', 'Col2'],
        tableBody: [{ tbodyData: ['A', 'B'] }]
      }))
    };

    mockQuery = {
      selectConsultaioState$: of({ readonly: true })
    };
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AdministrarResiduosComponent, HttpClientTestingModule],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: AdministrarResiduosService, useValue: mockService },
        { provide: ConsultaioQuery, useValue: mockQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrarResiduosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form in ngOnInit', () => {
    expect(component.formularioParaRecuentoTotal).toBeDefined();
    expect(component.formularioParaRecuentoTotal.get('recuentoTotalDeFilas')).toBeDefined();
  });

  it('should set esFormularioSoloLectura from query', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should load table data and update row count', () => {
    component.ngOnInit();
    component.loadAdministrarResiduos();
    fixture.detectChanges();
  
    expect(component.tableHeaderData).toEqual(['Col1', 'Col2']);
    expect(component.tableBodyData).toEqual([{ tbodyData: ['A', 'B'] }]);
    expect(component.formularioParaRecuentoTotal.get('recuentoTotalDeFilas')?.value).toBe(4);
  });

  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn((component as any).destroyed$, 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});