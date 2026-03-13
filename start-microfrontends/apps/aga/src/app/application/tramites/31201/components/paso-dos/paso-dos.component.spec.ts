import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CommonModule } from '@angular/common';
import { TituloComponent, AnexarDocumentosComponent, AlertComponent, TEXTOS } from '@libs/shared/data-access-user/src';
import { provideHttpClient } from '@angular/common/http'; 

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoDosComponent, CommonModule, TituloComponent, AnexarDocumentosComponent, AlertComponent],
      declarations: [],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have TEXTOS property initialized', () => {
    expect(component.TEXTOS).toBe(TEXTOS);
  });

  it('should render the title with "Requisitos opcionales"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('ng-titulo');
    expect(titleElement?.getAttribute('titulo')).toBe('Requisitos opcionales');
  });

  it('should render anexar-documentos component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const anexarDocumentosElement = compiled.querySelector('anexar-documentos');
    expect(anexarDocumentosElement).toBeTruthy();
  });
});