import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerarDictamen261701Component } from './generar-dictamen-261701.component';

describe('GenerarDictamen261701Component', () => {
  let component: GenerarDictamen261701Component;
  let fixture: ComponentFixture<GenerarDictamen261701Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarDictamen261701Component],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerarDictamen261701Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
