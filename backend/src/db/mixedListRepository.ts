import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BookListItem } from './entities/bookListItemEntity';
import { Like } from './entities/likeEntity';
import { BookListStatusWithAll } from '../bookList/dto/bookList.dto';
import { PaginationOptions } from '../pagination/paginated.dto';

@Injectable()
export class MixedListRepository {
  constructor(
    @InjectRepository(BookListItem)
    private readonly bookListRepo: Repository<BookListItem>,
    @InjectRepository(Like)
    private readonly likeRepo: Repository<Like>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getMixedOlids(
    userId: number,
    opts: {
      type: BookListStatusWithAll;
      liked?: boolean;
      pagination?: PaginationOptions;
    },
  ): Promise<{ olids: string[]; total: number }> {
    const { baseSql, params } = this.buildSql(userId, opts.type, opts.liked);

    const countRows: { count: number }[] = await this.dataSource.query(
      `SELECT COUNT(*)::int AS count FROM (${baseSql}) AS sub`,
      params,
    );
    const total = countRows[0]?.count ?? 0;

    if (total === 0) return { olids: [], total: 0 };

    let dataSql = baseSql;
    const dataParams = [...params];
    if (opts.pagination?.take !== undefined) {
      dataSql += ` LIMIT $${dataParams.length + 1}`;
      dataParams.push(opts.pagination.take);
    }
    if (opts.pagination?.skip !== undefined) {
      dataSql += ` OFFSET $${dataParams.length + 1}`;
      dataParams.push(opts.pagination.skip);
    }

    const rows: { bookOlid: string }[] = await this.dataSource.query(
      dataSql,
      dataParams,
    );
    return { olids: rows.map((r) => r.bookOlid), total };
  }

  private buildSql(
    userId: number,
    type: BookListStatusWithAll,
    liked?: boolean,
  ): { baseSql: string; params: unknown[] } {
    const bl = `"BookListItem"`;
    const lk = `"Like"`;

    if (type !== 'All') {
      return this.buildTypedSql(userId, type, liked, bl, lk);
    }

    const params = [userId];

    if (liked === true) {
      return {
        baseSql: `SELECT ${lk}."bookOlid" FROM ${lk} WHERE ${lk}."userId" = $1`,
        params,
      };
    }

    if (liked === false) {
      return {
        baseSql: `SELECT ${bl}."bookOlid" FROM ${bl} WHERE ${bl}."userId" = $1 AND NOT EXISTS (SELECT 1 FROM ${lk} WHERE ${lk}."bookOlid" = ${bl}."bookOlid" AND ${lk}."userId" = ${bl}."userId")`,
        params,
      };
    }

    return {
      baseSql: `SELECT ${bl}."bookOlid" FROM ${bl} WHERE ${bl}."userId" = $1 UNION SELECT ${lk}."bookOlid" FROM ${lk} WHERE ${lk}."userId" = $1`,
      params,
    };
  }

  private buildTypedSql(
    userId: number,
    type: string,
    liked: boolean | undefined,
    bl: string,
    lk: string,
  ): { baseSql: string; params: unknown[] } {
    const params = [userId, type];

    if (liked === true) {
      return {
        baseSql: `SELECT ${bl}."bookOlid" FROM ${bl} INNER JOIN ${lk} ON ${lk}."bookOlid" = ${bl}."bookOlid" AND ${lk}."userId" = ${bl}."userId" WHERE ${bl}."userId" = $1 AND ${bl}."status" = $2`,
        params,
      };
    }

    if (liked === false) {
      return {
        baseSql: `SELECT ${bl}."bookOlid" FROM ${bl} LEFT JOIN ${lk} ON ${lk}."bookOlid" = ${bl}."bookOlid" AND ${lk}."userId" = ${bl}."userId" WHERE ${bl}."userId" = $1 AND ${bl}."status" = $2 AND ${lk}."id" IS NULL`,
        params,
      };
    }

    return {
      baseSql: `SELECT ${bl}."bookOlid" FROM ${bl} WHERE ${bl}."userId" = $1 AND ${bl}."status" = $2`,
      params,
    };
  }
}
