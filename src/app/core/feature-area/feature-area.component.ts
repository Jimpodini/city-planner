import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthObject, AuthService } from 'src/app/auth.service';
import { ModalService } from 'src/app/components/modal/modal.service';
import { StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'app-feature-area',
  templateUrl: './feature-area.component.html',
  styleUrls: ['./feature-area.component.scss'],
})
export class FeatureAreaComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public modalService: ModalService,
    private route: ActivatedRoute,
    private router: Router,
    private stayService: StayService
  ) {
    this.getStay();
  }

  ngOnInit() {
    console.log(this.authService.authObject);
  }

  async getStay(): Promise<void> {
    // TODO: implement loader
    this.authService.stayId = this.route.snapshot.params['stayId'];

    const doc = await this.stayService.getStay();
    console.log(doc.data());
    if (!doc.data()) {
      this.router.navigate(['/404']);
    } else {
      this.authService.setAuthObject(<AuthObject>doc.data());
    }
  }

  drop(event: CdkDragDrop<string[]>, date: string) {
    console.log(event);
    moveItemInArray(
      this.authService.authObject.activitiesPerDate[date].activities,
      event.previousIndex,
      event.currentIndex
    );
    this.stayService.saveStay();
  }
}
