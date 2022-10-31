import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractivePaneComponent } from './interactive-pane.component';

describe('InteractivePaneComponent', () => {
  let component: InteractivePaneComponent;
  let fixture: ComponentFixture<InteractivePaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractivePaneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractivePaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
