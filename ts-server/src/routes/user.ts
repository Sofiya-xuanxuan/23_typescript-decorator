import * as Koa from 'koa'
import { get, post, myvalidate, middlewares,querystring } from '../utils/decors'
import model from '../model/user'
import { log } from 'util';
import { AfterBulkRestore } from 'sequelize-typescript';
const users = [{ name: 'tom', age: 20 }, { name: 'sofiya', age: 19 }];
const api = {
    findByName(name) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (name === 'sofiya') {
                    reject('用户已存在')
                } else {
                    resolve()
                }
            }, 500)
        })
    }
}
//(target, property) => {
//     //处理成异步
//     process.nextTick(() => {
//         //添加中间件
//         const mws = [];
//         if (options.middlewares) {
//             mws.push(...options.middlewares);
//         }
//         if (target.middlewares) {
//             mws.push(...target.middlewares);
//         }
//         mws.push(target[property]);
//         const url = options.prefix ? options.prefix + path : path;
//         router[method](url, target[property]);
//     });
// }
//类装饰器
// @middlewares([
//     async function guard(ctx: Koa.Context, next: () => Promise<any>) {
//         console.log('guard', ctx.header);
//         if (ctx.header.token) {
//             await next()
//         } else {
//             throw '请登录'
//         }
//     }
// ])

export default class User {
    /**
     * @router get /api/user/list
     * @param {*} ctx 
     */

    @get('/users')
    @querystring({
        age: { type: 'int', required: true, max: 200, convertType: 'int' },
    })
    public async list(ctx: Koa.Context) {
        const users = await model.findAll()
        ctx.body = { ok: 1, data: users }
    }

    
    @post('/users', {
        middlewares: [
            async function validation(ctx: Koa.Context, next: () => Promise<any>) {
                // 用户名必填
                const name = ctx.request.body.name
                if (!name) {
                    throw "请输入用户名";
                }
                // 用户名不能重复
                try {
                    await api.findByName(name);
                    // 校验通过
                    await next();
                } catch (error) {
                    throw error;
                }
            }
        ]
    })
    public add(ctx: Koa.Context) {     
        users.push(ctx.request.body)
        ctx.body = { ok: 1 }
    }
}