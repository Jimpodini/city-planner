import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStatePlaceholderComponent } from './empty-state-placeholder.component';

describe('EmptyStatePlaceholderComponent', () => {
  let component: EmptyStatePlaceholderComponent;
  let fixture: ComponentFixture<EmptyStatePlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyStatePlaceholderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyStatePlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
