#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/1977491ccc38fcffd6ef7d28d4ebe66ca34a35c552937363e7f37c46473289c0/contract';
import startContract from '../../snapshots/1977491ccc38fcffd6ef7d28d4ebe66ca34a35c552937363e7f37c46473289c0/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/76ba84eaf21818f95d227f8c04590b394fbde46fd0fdabcd0c9c4fc776abcda5/contract';
import endContract from '../../snapshots/76ba84eaf21818f95d227f8c04590b394fbde46fd0fdabcd0c9c4fc776abcda5/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Submission',
        columns: [
          col('compileTimeMs', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('execTimeMs', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('exitcode', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('language', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('memoryUsageKB', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('srcCode', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('QUEUED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('stdErr', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('stdIn', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('stdOut', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Submission_language_check_239dbbef',
            sql`"language" IN ('c', 'js', 'py')`,
          ),
          checkExpression(
            'Submission_status_check_401003df',
            sql`"status" IN ('QUEUED', 'RUNNING', 'COMPLETED', 'ERROR')`,
          ),
        ],
      }),
      this.addPrimaryKey({
        schema: 'public',
        table: 'User',
        constraint: 'User_pkey',
        columns: ['id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Submission',
        index: 'Submission_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Submission',
        foreignKey: {
          name: 'Submission_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
