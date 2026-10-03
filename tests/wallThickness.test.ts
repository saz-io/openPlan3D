import { beforeEach, describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { addWall, currentProject, loadProject, setAllWallThickness, undo } from '$lib/stores/project';
import { projectSettings } from '$lib/stores/settings';
import { validWallThickness } from '$lib/utils/wallEditing';
import { roomProject } from './fixtures/project';

const walls = () => get(currentProject)!.floors.flatMap(floor => floor.walls);

beforeEach(() => {
  loadProject(structuredClone(roomProject()));
  projectSettings.update(settings => ({ ...settings, wallThickness: 15 }));
});

describe('global wall thickness', () => {
  it('validates thickness between 0 and 100 cm', () => {
    expect([15, 0.5, 100].every(validWallThickness)).toBe(true);
    expect([0, -1, 100.1, NaN, '15', null].some(validWallThickness)).toBe(false);
  });

  it('uses the configured thickness for new walls and keeps existing walls unchanged', () => {
    const before = walls().map(wall => wall.thickness);
    projectSettings.update(settings => ({ ...settings, wallThickness: 23 }));
    const id = addWall({ x: 0, y: 0 }, { x: 100, y: 0 });
    expect(walls().find(wall => wall.id === id)!.thickness).toBe(23);
    expect(walls().filter(wall => wall.id !== id).map(wall => wall.thickness)).toEqual(before);
  });

  it('falls back to 15 cm when the saved setting is invalid', () => {
    projectSettings.update(settings => ({ ...settings, wallThickness: -4 }));
    const id = addWall({ x: 0, y: 0 }, { x: 100, y: 0 });
    expect(walls().find(wall => wall.id === id)!.thickness).toBe(15);
  });

  it('applies one thickness to every wall as a single undo step', () => {
    const count = walls().length;
    expect(setAllWallThickness(30)).toBe(count);
    expect(walls().every(wall => wall.thickness === 30)).toBe(true);
    expect(setAllWallThickness(30)).toBe(0);
    expect(setAllWallThickness(0)).toBe(0);
    undo();
    expect(walls().some(wall => wall.thickness === 30)).toBe(false);
  });
});
