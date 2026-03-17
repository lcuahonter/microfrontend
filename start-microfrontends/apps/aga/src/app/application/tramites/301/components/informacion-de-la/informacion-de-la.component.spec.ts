
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { InformacionDeLaComponent } from './informacion-de-la.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BtnContinuarComponent, CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';

describe('InformacionDeLaComponent', () => {
  let component: InformacionDeLaComponent;
  let fixture: ComponentFixture<InformacionDeLaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ReactiveFormsModule,
        CommonModule,
        BtnContinuarComponent,
        CatalogoSelectComponent,
        TituloComponent,
        InformacionDeLaComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionDeLaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.informacionDeLaform).toBeDefined();
    expect(component.informacionDeLaform.get('fraccionArancelaria')?.value).toBe('');
    expect(component.informacionDeLaform.get('descripcionFraccion')?.value).toBe('');
    expect(component.informacionDeLaform.get('nico')?.value).toBe('');
    expect(component.informacionDeLaform.get('descripcionNico')?.value).toBe('');
    expect(component.informacionDeLaform.get('nombreQuimico')?.value).toBe('');
    expect(component.informacionDeLaform.get('nombreComercial')?.value).toBe('');
    expect(component.informacionDeLaform.get('numeroCAS')?.value).toBe('');
    expect(component.informacionDeLaform.get('estadoFisico')?.value).toBe('');
    expect(component.informacionDeLaform.get('acondicionamiento')?.value).toBe('');
  });
});