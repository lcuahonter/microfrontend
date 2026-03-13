import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerarDictamen2604Component } from './generar-dictamen-2604.component';

describe('GenerarDictamen2604Component', () => {
  let component: GenerarDictamen2604Component;
  let fixture: ComponentFixture<GenerarDictamen2604Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarDictamen2604Component],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerarDictamen2604Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
