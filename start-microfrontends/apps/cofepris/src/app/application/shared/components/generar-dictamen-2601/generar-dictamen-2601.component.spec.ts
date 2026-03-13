import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarDictamen2601Component } from './generar-dictamen-2601.component';

describe('GenerarDictamen2601Component', () => {
  let component: GenerarDictamen2601Component;
  let fixture: ComponentFixture<GenerarDictamen2601Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarDictamen2601Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarDictamen2601Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});