import { Route } from '@angular/router';
import { FeatureConfig } from '../models';

export interface RouteVersionConfig {
  path: string;
  key: string;
  components: FeatureConfig[];
  data?: Route['data'];
}
