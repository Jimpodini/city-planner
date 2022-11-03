import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-empty-state-placeholder',
  template: `
    <div class="flex justify-center items-center flex-col">
      <img [src]="imageSrc" class="mt-4 mb-4" style="max-width: 80%" />
      <div>
        Create your first <span class="font-bold">{{ entity }}</span>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStatePlaceholderComponent implements OnInit {
  @Input() imageSrc!: string;
  @Input() entity!: string;

  constructor() {}

  ngOnInit(): void {}
}
