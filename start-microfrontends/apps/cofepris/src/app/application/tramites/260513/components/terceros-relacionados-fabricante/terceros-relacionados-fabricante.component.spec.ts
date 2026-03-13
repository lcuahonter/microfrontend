// Mock the JSON dependencies used in TercerosRelacionadosComponent
jest.mock('@libs/shared/theme/assets/json/260501/fabricante-select-options-data.json', () => ({
  __esModule: true,
  default: {
    paisSelectData: [],
    localidadSelectData: [],
    municipioSelectData: [],
    codigoPostalSelectData: [],
    coloniaSelectData: [],
  }
}));
jest.mock('@libs/shared/theme/assets/json/260501/nacionalidad-options.json', () => ({
  __esModule: true,
  default: []
}));
jest.mock('@libs/shared/theme/assets/json/260501/tipo-persona-options.json', () => ({
  __esModule: true,
  default: []
}));
jest.mock('@libs/shared/theme/assets/json/260501/tipo-persona-tres-options.json', () => ({
  __esModule: true,
  default: []
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosFabricanteComponent } from './terceros-relacionados-fabricante.component';
import { CommonModule } from '@angular/common';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-fabricante/terceros-fabricante.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TercerosRelacionadosFabricanteComponent', () => {
  let component: TercerosRelacionadosFabricanteComponent;
  let fixture: ComponentFixture<TercerosRelacionadosFabricanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TercerosRelacionadosComponent,
        TercerosRelacionadosFabricanteComponent,
        HttpClientTestingModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosFabricanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});