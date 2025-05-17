import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeamManagerDialogComponent } from './add-team-manager-dialog.component';

describe('AddTeamManagerDialogComponent', () => {
  let component: AddTeamManagerDialogComponent;
  let fixture: ComponentFixture<AddTeamManagerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTeamManagerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTeamManagerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
