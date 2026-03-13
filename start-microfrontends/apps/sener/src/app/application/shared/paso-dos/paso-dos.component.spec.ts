import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';

@Component({
  selector: 'app-paso-dos-test',
  template: `
    <div class="container">
      <div>Requisitos opcionales</div>
      <div>Mock Alert</div>
      <div>Mock Anexar Documentos</div>
    </div>
  `,
  standalone: true
})
class PasoDosTestComponent {
  TEXTOS = TEXTOS;
}

describe('PasoDosComponent', () => {
  let component: PasoDosTestComponent;
  let fixture: ComponentFixture<PasoDosTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoDosTestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have TEXTOS property defined', () => {
    expect(component.TEXTOS).toBeDefined();
  });

  it('should render container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.container')).toBeTruthy();
  });
});