/* eslint-disable @typescript-eslint/no-require-imports */

// eslint-disable-next-line no-undef
const { test, expect } = require('@playwright/test');

// eslint-disable-next-line no-undef
const { sortSegments } = require('../segments');

test('Segment sorting - basic ordering', () => {
  expect(
    sortSegments([
      [0, 3],
      [7, 8],
      [5, 6],
    ]),
  ).toEqual([
    [0, 3],
    [5, 6],
    [7, 8],
  ]);
});

test('Segment sorting - merging overlapping segments', () => {
  expect(
    sortSegments([
      [0, 5],
      [6, 8],
      [4, 6],
    ]),
  ).toEqual([[0, 8]]);
});

test('Segment sorting - merging touching segments', () => {
  expect(
    sortSegments([
      [0, 6],
      [7, 8],
      [4, 6],
    ]),
  ).toEqual([
    [0, 6],
    [7, 8],
  ]);
});

test('Segment sorting - empty array', () => {
  expect(sortSegments([])).toEqual([]);
});

test('Segment sorting - single segment', () => {
  expect(sortSegments([[0, 5]])).toEqual([[0, 5]]);
});

test('Segment sorting - already sorted segments', () => {
  expect(
    sortSegments([
      [0, 2],
      [3, 5],
      [6, 8],
    ]),
  ).toEqual([
    [0, 2],
    [3, 5],
    [6, 8],
  ]);
});

test('Segment sorting - multiple overlapping segments', () => {
  expect(
    sortSegments([
      [0, 3],
      [2, 5],
      [4, 7],
      [6, 9],
    ]),
  ).toEqual([[0, 9]]);
});

test('Segment sorting - segments with same start', () => {
  expect(
    sortSegments([
      [0, 5],
      [0, 3],
      [0, 7],
    ]),
  ).toEqual([[0, 7]]);
});

test('Segment sorting - segments completely contained within another', () => {
  expect(
    sortSegments([
      [0, 10],
      [2, 4],
      [5, 7],
    ]),
  ).toEqual([[0, 10]]);
});

test('Segment sorting - complex mix of overlapping and separate segments', () => {
  expect(
    sortSegments([
      [0, 5],
      [3, 7],
      [10, 15],
      [12, 18],
      [20, 25],
    ]),
  ).toEqual([
    [0, 7],
    [10, 18],
    [20, 25],
  ]);
});

test('Segment sorting - adjacent segments that should not merge', () => {
  expect(
    sortSegments([
      [0, 5],
      [6, 10],
      [11, 15],
    ]),
  ).toEqual([
    [0, 5],
    [6, 10],
    [11, 15],
  ]);
});

test('Segment sorting - segments in reverse order', () => {
  expect(
    sortSegments([
      [9, 10],
      [6, 8],
      [3, 5],
      [0, 2],
    ]),
  ).toEqual([
    [0, 2],
    [3, 5],
    [6, 8],
    [9, 10],
  ]);
});

test('Segment sorting - zero-length segments', () => {
  expect(
    sortSegments([
      [0, 0],
      [1, 1],
      [2, 2],
    ]),
  ).toEqual([
    [0, 0],
    [1, 1],
    [2, 2],
  ]);
});

test('Segment sorting - overlapping zero-length and normal segments', () => {
  expect(
    sortSegments([
      [0, 0],
      [0, 5],
    ]),
  ).toEqual([[0, 5]]);
});

test('Segment sorting - large segment values', () => {
  expect(
    sortSegments([
      [1000, 2000],
      [500, 1500],
      [2500, 3000],
    ]),
  ).toEqual([
    [500, 2000],
    [2500, 3000],
  ]);
});
