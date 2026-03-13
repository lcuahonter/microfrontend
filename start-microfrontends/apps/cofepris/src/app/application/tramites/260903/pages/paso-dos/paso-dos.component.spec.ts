import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CommonModule } from '@angular/common';
import { AlertComponent, AnexarDocumentosComponent, TEXTOS, TituloComponent } from '@libs/shared/data-access-user/src';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PasoDosComponent,
        CommonModule,
        TituloComponent,
        AnexarDocumentosComponent,
        AlertComponent,
        require('@angular/common/http/testing').HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener la propiedad TEXTOS definida y ser igual a la constante importada', () => {
    expect(component.TEXTOS).toBe(TEXTOS);
  });
});