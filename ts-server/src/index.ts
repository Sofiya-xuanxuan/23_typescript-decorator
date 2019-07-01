import * as Koa from 'koa'
import * as bodify from 'koa-body'
import * as serve from 'koa-static'
import * as timing from 'koa-xtime'
import { load } from './utils/decors'
import { resolve } from 'path'
import { Sequelize } from 'sequelize-typescript'

const database = new Sequelize({
    host: 'localhost',
    port: 3306,
    database: 'test',
    username: 'root',
    password: 'QXFY105729',
    dialect: 'mysql',
    modelPaths: [`${__dirname}/model`],
    operatorsAliases: false
})
const router = load(resolve(__dirname, './routes'))
const app = new Koa();

app.use(timing())
app.use(serve(`${__dirname}/public`))

app.use(
    bodify({
        multipart: true,
        //使用非严格模式，解析delete请求的请求体
        strict: false
    })
)

app.use(router.routes());

app.listen(3000, () => {
    console.log('启动成功');
})