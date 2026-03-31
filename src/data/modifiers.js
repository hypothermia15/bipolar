import base from './base.yaml';

const modules = import.meta.glob('./modifiers/*.yaml', { eager: true });

export const MODIFIERS = Object.fromEntries(
  Object.entries(modules)
    .map(([path, mod]) => [
      path.replace('./modifiers/', '').replace('.yaml', ''),
      mod.default ?? mod,
    ])
);

export const BASE = base.default ?? base;
