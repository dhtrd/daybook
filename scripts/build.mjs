#!/usr/bin/env node
/* يبني dist/ لاستضافة المعاينة: apps/* → dist/، و shared/ → dist/shared. بلا اعتماديات خارجية. */
import { cpSync, rmSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

if (!existsSync(join(root, 'apps', 'index.html'))) { console.error('✗ apps/index.html غير موجود'); process.exit(1); }
cpSync(join(root, 'apps'), dist, { recursive: true });
cpSync(join(root, 'shared'), join(dist, 'shared'), { recursive: true });

const apps = readdirSync(join(root, 'apps'), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
console.log('✓ dist جاهز — التطبيقات:', apps.join('، '));
