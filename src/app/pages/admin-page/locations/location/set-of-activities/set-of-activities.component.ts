import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { ActivityService } from 'src/app/services/activity.service';
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
              Name
            </th>
            <td mat-cell *matCellDef="let activity">{{ activity.name }}</td>
          </ng-container>

          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef class="bg-orange-500">
              Category
            </th>
            <td mat-cell *matCellDef="let activity">{{ activity.category }}</td>
          </ng-container>

          <ng-container matColumnDef="deleteActivity">
            <th mat-header-cell *matHeaderCellDef class="bg-orange-500"></th>
            <td mat-cell *matCellDef="let activity" class="text-right">
              <button
                (click)="$event.stopPropagation()"
                matTooltip="Edit activity"
                matTooltipPosition="left"
                class="mr-4"
              >
                <i class="fa-solid fa-pen"></i>
              </button>
              <button
                (appConfirm)="
                  activityService.deleteActivity(
                    activity.locationId,
                    activity.id
                  )
                "
                entity="activity"
                matTooltip="Delete activity"
                matTooltipPosition="right"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </ng-container>

          <ng-container matColumnDef="expandedDetail">
            <td
              mat-cell
              *matCellDef="let activity"
              [attr.colspan]="displayedColumns.length"
            >
              <div
                class="example-activity-detail"
                [@detailExpand]="
                  activity == expandedActivity ? 'expanded' : 'collapsed'
                "
              >
                <div class="py-3">
                  <div>
                    <div class="mt-2">
                      <label class="block font-bold">Description</label>
                      <span>{{ activity.description }}</span>
                    </div>
                    <div class="mt-2">
                      <label class="block font-bold">Google Place ID</label>
                      <span>{{ activity.googlePlaceId }}</span>
                    </div>
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

      .example-activity-detail {
        overflow: hidden;
        display: flex;
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
  displayedColumns: string[] = ['name'];
  expandedActivity: any | null;
  dataSource = of([
    {
      name: 'test',
    },
  ]);
  selection = new SelectionModel<any>(true, []);
  destroy = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public activityService: ActivityService
  ) {}

  ngOnInit(): void {}
}
