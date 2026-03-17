import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RequirementoComponent } from './requiremento.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CapturarRequerimientoComponent } from '../capturar-requerimiento/capturar-requerimiento.component';
import { SeleccionarDocumentosComponent } from '../seleccionar-documentos/seleccionar-documentos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('RequirementoComponent', () => {
  let component: RequirementoComponent;
  let fixture: ComponentFixture<RequirementoComponent>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(async () => {
    routerSpy = {
      navigate: jest.fn(() =>
        of({
          id: 123,
          name: 'Test',
        })
      ),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        CapturarRequerimientoComponent,
        SeleccionarDocumentosComponent,
        RequirementoComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(RequirementoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set indice when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should navigate to the correct route on continuar', () => {
    component.continuar();
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/agace/manifiesto-aereo/capturar-el-texto-libre',
    ]);
  });

  it('should navigate to the correct route on cancelar', () => {
    component.cancelar();
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/agace/manifiesto-aereo/main',
    ]);
  });
});
