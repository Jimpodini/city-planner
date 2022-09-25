import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetOfActivitiesDialogComponent } from './set-of-activities-dialog.component';

describe('SetOfActivitiesDialogComponent', () => {
  let component: SetOfActivitiesDialogComponent;
  let fixture: ComponentFixture<SetOfActivitiesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetOfActivitiesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetOfActivitiesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
