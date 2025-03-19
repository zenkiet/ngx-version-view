import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SemanticVersionStrategy {
  private _compareCache = new Map<string, number>();

  compare(a: string, b: string): number {
    const cacheKey = `${a}:${b}`;

    if (this._compareCache.has(cacheKey)) {
      return this._compareCache.get(cacheKey)!;
    }

    const partsA = a.split('.').map(Number);
    const partsB = b.split('.').map(Number);

    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const partA = partsA[i] || 0;
      const partB = partsB[i] || 0;

      if (partA !== partB) {
        const result = partA - partB;
        this._compareCache.set(cacheKey, result);
        return result;
      }
    }

    this._compareCache.set(cacheKey, 0);
    return 0;
  }

  gte(a: string, b: string): boolean {
    return this.compare(a, b) >= 0;
  }

  lt(a: string, b: string): boolean {
    return this.compare(a, b) < 0;
  }

  clearCache(): void {
    this._compareCache.clear();
  }
}
