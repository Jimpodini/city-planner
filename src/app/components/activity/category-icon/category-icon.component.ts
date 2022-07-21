import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-icon',
  templateUrl: './category-icon.component.html',
  styleUrls: ['./category-icon.component.scss'],
})
// TODO - make single file component
export class CategoryIconComponent implements OnInit {
  @Input() category!: string;

  constructor() {}

  ngOnInit(): void {}
}
