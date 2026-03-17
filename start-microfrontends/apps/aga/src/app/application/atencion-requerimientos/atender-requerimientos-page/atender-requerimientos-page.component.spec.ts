import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtenderRequerimientosPageComponent } from './atender-requerimientos-page.component';

describe('AtenderRequerimientosPageComponent', () => {
  let component: AtenderRequerimientosPageComponent;
  let fixture: ComponentFixture<AtenderRequerimientosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtenderRequerimientosPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AtenderRequerimientosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
