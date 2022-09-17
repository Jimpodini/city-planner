import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
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

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef class="bg-orange-500">
              Description
            </th>
            <td mat-cell *matCellDef="let activity">
              {{ activity.description }}
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
                <div>test</div>
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
  displayedColumns: string[] = ['name', 'description'];
  expandedActivity: any | null;
  dataSource!: Observable<any[]>;
  selection = new SelectionModel<any>(true, []);
  destroy = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params['locationId'];
    this.dataSource = this.activityService.getSetOfActivities(this.locationId);
  }
}
