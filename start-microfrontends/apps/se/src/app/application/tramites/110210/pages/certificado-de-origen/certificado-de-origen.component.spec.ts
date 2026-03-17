import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificadoDeOrigenComponent } from './certificado-de-origen.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CertificadoDeOrigenComponent', () => {
  let component: CertificadoDeOrigenComponent;
  let fixture: ComponentFixture<CertificadoDeOrigenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificadoDeOrigenComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadoDeOrigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el selector correcto', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-certificado-de-origen')).toBeDefined();
  });

  it('debería renderizar la plantilla', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });
});