import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressPaneComponent } from './progress-pane.component';

describe('ProgressPaneComponent', () => {
  let component: ProgressPaneComponent;
  let fixture: ComponentFixture<ProgressPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressPaneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
