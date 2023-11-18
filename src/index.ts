import { ORMConfig } from "./types";

export class DatabaseORM {
    /**
     * @protected
     * 数据库信息
     */
    protected config: ORMConfig;

    /**
     * @protected
     * 当前默认数据库
     */
    protected default: string;

    /** 设置数据库连接信息 */
    public setConfig(config: ORMConfig) {
        this.config = config
        this.default = this.config.default
    }


}