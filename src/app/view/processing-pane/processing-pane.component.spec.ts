import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingPaneComponent } from './processing-pane.component';

describe('ProcessingPaneComponent', () => {
  let component: ProcessingPaneComponent;
  let fixture: ComponentFixture<ProcessingPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingPaneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessingPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
