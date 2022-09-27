import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ActivityService } from 'src/app/services/activity.service';
import { LocationService } from 'src/app/services/location.service';
import { SetOfActivitiesDialogComponent } from './set-of-activities-dialog/set-of-activities-dialog.component';
@Component({
  selector: 'app-set-of-activities',
  template: `
    <div class="flex items-center flex-col">
      <ng-container *ngIf="dataSource | async as ds; else loader">
        <table
          *ngIf="ds.length > 0"
          mat-table
          multiTemplateDataRows
          [dataSource]="dataSource"
          class="expandable-table"
        >
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef class="bg-orange-500">
              Set of activities
            </th>
            <td mat-cell *matCellDef="let activity">{{ activity.name }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="bg-orange-500"></th>
            <td mat-cell *matCellDef="let activity" class="text-right">
              <button
                (click)="
                  navigateToGoogleUrl(activity); $event.stopPropagation()
                "
                class="mr-4"
                matTooltip="Get directions"
                matTooltipPosition="left"
              >
                <i class="fa-solid fa-map-location-dot"></i>
              </button>
              <button
                (click)="openDialog(activity); $event.stopPropagation()"
                matTooltip="Edit set of activities"
                matTooltipPosition="below"
                class="mr-4"
              >
                <i class="fa-solid fa-pen"></i>
              </button>
              <button
                (appConfirm)="
                  activityService.deleteSetOfActivities(
                    activity.locationId,
                    activity.id
                  );
                  dataSource = activityService.getSetOfActivities(locationId)
                "
                entity="set of activities"
                matTooltip="Delete set of activities"
                matTooltipPosition="right"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </ng-container>

          <ng-container matColumnDef="expandedDetail">
            <td
              mat-cell
              *matCellDef="let setOfActivities"
              [attr.colspan]="displayedColumns.length"
            >
              <div
                class="example-activity-detail overflow-hidden flex flex-col"
                [@detailExpand]="
                  setOfActivities == expandedActivity ? 'expanded' : 'collapsed'
                "
              >
                <label class="block font-bold mt-2">Description</label>
                <span>{{ setOfActivities.description }}</span>
                <div
                  cdkDropList
                  cdkDropListOrientation="vertical"
                  class="drag-and-drop-container"
                  (cdkDropListDropped)="drop($event, setOfActivities)"
                >
                  <div
                    *ngFor="let activityId of setOfActivities.activities"
                    class="bg-orange-100 p-4 max-w-md my-2 rounded-sm cursor-move"
                    cdkDrag
                    cdkDragLockAxis="y"
                    cdkDragBoundary=".drag-and-drop-container"
                  >
                    {{ getActivityName(activityId) }}
                  </div>
                </div>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr
            mat-row
            *matRowDef="let activity; columns: displayedColumns"
            class="cursor-pointer example-activity-row"
            [class.example-expanded-row]="expandedActivity === activity"
            (click)="
              expandedActivity = expandedActivity === activity ? null : activity
            "
          ></tr>
          <tr
            mat-row
            *matRowDef="let activity; columns: ['expandedDetail']"
            class="example-detail-row last:border-b-orange-500 last:border-b-2"
          ></tr>
        </table>
      </ng-container>
    </div>
    <ng-template #loader>
      <mat-spinner class="activities-spinner"></mat-spinner>
    </ng-template>
  `,
  styles: [
    `
      ::ng-deep .mat-progress-spinner.activities-spinner circle,
      .mat-spinner circle {
        stroke: rgb(249 115 22);
      }

      tr.example-detail-row {
        height: 0;
      }

      .example-activity-row td {
        border-bottom-width: 0;
      }

      .drag-and-drop-container {
        display: flex;
        flex-direction: column;
      }

      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
          0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
      }

      .cdk-drag-placeholder {
        opacity: 0.2;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class SetOfActivitiesComponent implements OnInit {
  locationId!: string;
  displayedColumns: string[] = ['name', 'actions'];
  expandedActivity: any | null;
  dataSource!: Observable<any[]>;
  selection = new SelectionModel<any>(true, []);
  destroy = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public activityService: ActivityService,
    private dialog: MatDialog,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params['locationId'];
    this.dataSource = this.activityService.getSetOfActivities(this.locationId);
    // TODO unsubscribe
    this.activityService.reloadActivitiesData.subscribe(
      () =>
        (this.dataSource = this.activityService.getSetOfActivities(
          this.locationId
        ))
    );
  }

  openDialog(setOfActivities: any) {
    const dialogRef = this.dialog.open(SetOfActivitiesDialogComponent, {
      data: {
        setOfActivities,
        locationId: this.locationId,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => {
        if (result === 'submitted') {
          this.dataSource = this.activityService.getSetOfActivities(
            this.locationId
          );
        }
      });
  }

  getActivityName(activityId: string): string {
    return this.activityService.activities.find(
      (activity) => activity.id === activityId
    )?.name;
  }

  drop(event: CdkDragDrop<string[]>, setOfActivities: any) {
    moveItemInArray(
      setOfActivities.activities,
      event.previousIndex,
      event.currentIndex
    );
    this.activityService.editSetOfActivities(this.locationId, setOfActivities);
  }

  navigateToGoogleUrl(setOfActivities: any) {
    const activities = setOfActivities.activities.map((activityId: number) =>
      this.activityService.activities.find(
        (activity) => activity.id === activityId
      )
    );
    window.open(
      this.activityService.getGoogleUrl(
        activities,
        this.locationService.location.city,
        this.locationService.location.address
      ),
      '_blank'
    );
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
