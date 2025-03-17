import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { ViewService } from '../services/view.service';

@Component({
  selector: 'ngx-view-component',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `
    @if (component()) {
      <ng-container *ngComponentOutlet="component(); inputs: componentInputs()" />
    } @else {
      <ng-content />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionFeatureComponent implements OnInit {
  private service = inject(ViewService);

  @Input({ required: true }) key = '';
  @Input() data: Record<string, any> = {};

  protected component = signal<any>(null);
  protected componentInputs = signal<Record<string, any>>({});

  ngOnInit() {
    this.component.set(this.service.getApplicableFeature(this.key));
    if (this.data) {
      this.componentInputs.set(this.data);
    }
  }
}
