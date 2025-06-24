import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
  Type,
} from '@angular/core';
import { ViewService } from '../services';

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
    const comp = this.service.getFeatureComponent(this.key);
    this.component.set(comp);

    if (comp && this.data) {
      const validInputs = this._getComponentInputs(comp);
      const filteredData = Object.fromEntries(
        Object.entries(this.data).filter(([key]) => validInputs.includes(key))
      );
      this.componentInputs.set(filteredData);
    }
  }

  private _getComponentInputs(componentType: Type<any>): string[] {
    const def = (componentType as any).ɵcmp || (componentType as any).ɵdir;
    if (!def?.inputs) return [];

    return Object.entries(def.inputs).map(([propName, inputDef]) =>
      typeof inputDef === 'string' ? inputDef : (inputDef as any)?.alias || propName
    );
  }
}
