import { Injectable } from '@angular/core';

export type ModalType = 'activities' | 'setsOfActivities';
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  showModal = false;
  date = '';
  modalType!: ModalType;

  constructor() {}

  openModal(date: string, modalType: ModalType = 'setsOfActivities') {
    this.showModal = true;
    this.date = date;
    this.modalType = modalType;
  }
}
