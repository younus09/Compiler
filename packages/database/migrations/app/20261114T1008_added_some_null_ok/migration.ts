#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/76ba84eaf21818f95d227f8c04590b394fbde46fd0fdabcd0c9c4fc776abcda5/contract';
import startContract from '../../snapshots/76ba84eaf21818f95d227f8c04590b394fbde46fd0fdabcd0c9c4fc776abcda5/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/effe59e00066f8b74848ede490b4b631041260d040887034598d8c22055eecf0/contract';
import endContract from '../../snapshots/effe59e00066f8b74848ede490b4b631041260d040887034598d8c22055eecf0/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropNotNull({ schema: 'public', table: 'Submission', column: 'exitcode' }),
      this.dropNotNull({ schema: 'public', table: 'Submission', column: 'stdErr' }),
      this.dropNotNull({ schema: 'public', table: 'Submission', column: 'stdIn' }),
      this.dropNotNull({ schema: 'public', table: 'Submission', column: 'stdOut' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
