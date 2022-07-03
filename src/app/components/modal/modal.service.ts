import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  showModal = false;
  date = '';

  constructor() {}

  openModal(date: string) {
    this.showModal = true;
    this.date = date;
  }
}
