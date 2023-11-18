interface ConnectionConfig {
    /** 数据库连接名 */
    name: string,
    /** 数据库类型(仅支持mysql) */
    type: 'mysql',
    /** 服务器地址 */
    hostname: string,
    /** 数据库名 */
    database: string,
    /** 数据库用户名 */
    username: string,
    /** 数据库密码 */
    password: string,
    /** 数据库连接端口 */
    hostport: string,
}

export interface ORMConfig {
    /** 默认的数据库连接配置 */
    default: string,
    /** 数据库连接配置列表 */
    connections: ConnectionConfig[]
}

