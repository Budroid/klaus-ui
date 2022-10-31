import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsPaneComponent } from './sessions-pane.component';

describe('SessionsPaneComponent', () => {
  let component: SessionsPaneComponent;
  let fixture: ComponentFixture<SessionsPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionsPaneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionsPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
