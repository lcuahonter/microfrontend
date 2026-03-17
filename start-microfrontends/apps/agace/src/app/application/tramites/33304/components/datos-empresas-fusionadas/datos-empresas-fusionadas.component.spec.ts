import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosEmpresasFusionadasComponent } from './datos-empresas-fusionadas.component';

describe('DatosEmpresasFusionadasComponent', () => {
  let component: DatosEmpresasFusionadasComponent;
  let fixture: ComponentFixture<DatosEmpresasFusionadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosEmpresasFusionadasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosEmpresasFusionadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
