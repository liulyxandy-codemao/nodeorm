import { ORMConfig } from "./types";
import mysql from "mysql";

class BaseQuery {
    protected connection: mysql.Connection;
    protected _table: string;
    protected _primaryKey: string;
    protected _fields: string[];
    protected _where: string;
    protected _order: string;
    protected _limit: string;
    protected _offset: string;
    protected _sql: string;
    protected _type: 'SELECT'|'INSERT'|'UPDATE'|'DELETE';
    protected _values: any[];

    /**
     * @param connection 数据库连接
     */
    constructor(connection: mysql.Connection) {
        this.connection = connection;
    }

    public table(table: string) {
        this._table = table;
        return this;
    }

    public field(fields: string[]) {
        this._fields = fields;
        return this;
    }

    public where(key:string, condition: string, value: any) {
        if(this._where) this._where += ` AND ${key} ${condition} ${value}`;
        else this._where = `${key} ${condition} ${value}`;
        return this;
    }

    public order(order: string) {
        this._order = order;
        return this;
    }

    public limit(limit: number) {
        this._limit = limit.toString();
        return this;
    }

    public offset(offset: number) {
        this._offset = offset.toString();
        return this;
    }

    public generateSQL() {
        if(this._type === 'SELECT') {
            this._sql = `SELECT ${this._fields.join(',')} FROM ${this._table}`;
            if(this._where) this._sql += ` WHERE ${this._where}`;
            if(this._order) this._sql += ` ORDER BY ${this._order}`;
            if(this._limit) this._sql += ` LIMIT ${this._limit}`;
            if(this._offset) this._sql += ` OFFSET ${this._offset}`;
        }
        else if(this._type === 'INSERT') {
            this._sql = `INSERT INTO ${this._table}`;
            if(this._fields) this._sql += ` (${this._fields.join(',')})`;
            this._sql += ` VALUES (${this._values.join(',')})`;
        }
        else if(this._type === 'UPDATE') {
            this._sql = `UPDATE ${this._table} SET ${this._values.join(',')}`;
            if(this._where) this._sql += ` WHERE ${this._where}`;
        }
        else if(this._type === 'DELETE') {
            this._sql = `DELETE FROM ${this._table}`;
            if(this._where) this._sql += ` WHERE ${this._where}`;
        }
        return this;
    }

    public excute(sql?: string) {
        if(!sql) sql = this._sql;
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (err, result) => {
                if(err) reject(err);
                resolve(result);
            })
        })
    }
    
    public find() {
        this._type = 'SELECT';
        this._limit = "1";
        return this.generateSQL().excute();
    }

    public select() {
        this._type = 'SELECT';
        return this.generateSQL().excute();
    }

    public insert(values: any[]) {
        this._type = 'INSERT';
        this._values = values;
        return this.generateSQL().excute();
    }

    public update(values: any[]) {
        this._type = 'UPDATE';
        this._values = values;
        return this.generateSQL().excute();
    }

    public delete() {
        this._type = 'DELETE';
        return this.generateSQL().excute();
    }
}

export class DatabaseORM {
    /**
     * @protected
_     * 数据库信息
     */
    protected config: ORMConfig;

    /**
     * @protected
_     * 当前默认数据库
     */
    protected default: string;

    /** 设置数据库连接信息 */
    public setConfig(config: ORMConfig) {
        this.config = config
        this.default = this.config.default
    }

    /** 连接数据库 */
    public connect(name: string = this.default): Promise<BaseQuery> {
        const connection = mysql.createConnection({
            host: this.config.connections[name].host,
            user: this.config.connections[name].username,
            password: this.config.connections[name].password,
            database: this.config.connections[name].database,
            port: this.config.connections[name].hostport
        })
        return new Promise((resolve, reject) => {
            connection.connect((err) => {
                if(err) reject(err);
                resolve(new BaseQuery(connection));
            })
        })

    }
}