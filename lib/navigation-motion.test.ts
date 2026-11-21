import assert from 'node:assert/strict';
import test from 'node:test';
import {
  computeRouteDirection,
  getWin8StaggerDelay,
  normalizeRoutePath,
} from './navigation-motion';

const NAV_PATHS = ['/', '/projects', '/about', '/activity', '/contact'] as const;

test('getWin8StaggerDelay matches WinJS staggerDelay(0, 83, 1, 333)', () => {
  assert.equal(getWin8StaggerDelay(0), 0);
  assert.equal(getWin8StaggerDelay(1), 0.083);
  assert.equal(getWin8StaggerDelay(2), 0.166);
  assert.equal(getWin8StaggerDelay(3), 0.249);
  assert.equal(getWin8StaggerDelay(4), 0.332);
  assert.equal(getWin8StaggerDelay(5), 0.333);
  assert.equal(getWin8StaggerDelay(10), 0.333);
});

test('normalizeRoutePath strips trailing slashes and query/hash fragments', () => {
  assert.equal(normalizeRoutePath('/'), '/');
  assert.equal(normalizeRoutePath('/projects/'), '/projects');
  assert.equal(normalizeRoutePath('/activity/?tab=1#top'), '/activity');
});

test('computeRouteDirection computes forward and backward Pivot navigation direction', () => {
  assert.equal(computeRouteDirection(null, '/', NAV_PATHS), 0);
  assert.equal(computeRouteDirection('/', '/', NAV_PATHS), 0);
  assert.equal(computeRouteDirection('/projects/', '/projects', NAV_PATHS), 0);
  assert.equal(computeRouteDirection('/', '/projects', NAV_PATHS), 1);
  assert.equal(computeRouteDirection('/projects/', '/contact/', NAV_PATHS), 1);
  assert.equal(computeRouteDirection('/contact', '/about', NAV_PATHS), -1);
  assert.equal(computeRouteDirection('/activity/', '/', NAV_PATHS), -1);
});
