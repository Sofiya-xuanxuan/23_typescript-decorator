import * as glob from 'glob'//用于文件夹遍历
import * as Koa from 'koa'
import * as KoaRouter from 'koa-router'


type HTTPMethod = 'get' | 'put' | 'del' | 'post' | 'patch'

type LoadOptions = {
    extname?: string
}

type RouterOptions = {
    /**
     * 适用于某个请求比较特殊，需要单独制定前缀的情形
     */
    prefix?: string;
    /**
     * 给当前路由添加一个或多个中间件
     */
    middlewares?: Array<Koa.Middleware>
}
const router = new KoaRouter();

const decorate = (method: HTTPMethod, path: string, options: RouterOptions = {}, router: KoaRouter) => {
    return (target, property: string) => {
        //处理成异步
        process.nextTick(() => {
            console.log(target);
            console.log('---------------------');
            
            console.log(property);
            
            
            //添加中间件
            const mws = [];
            if (options.middlewares) {
                mws.push(...options.middlewares)
            }
            if(target.middlewares) {
                mws.push(...target.middlewares)
            }
            mws.push(target[property])
            const url = options.prefix ? options.prefix + path : path
            router[method](url, target[property])
        })
    }
}

const method = method => (path: string, options?: RouterOptions) => decorate(method, path, options, router)
export const get = method('get');
//get：(path, options) => decorate(method, path, options, router)
export const post = method('post');
export const put = method('put');
export const del = method('del');



export const load = (folder: string, options: LoadOptions = {}): KoaRouter => {
    const extname = options.extname || '.{js,ts}'
    glob.sync(require('path').join(folder, `./**/*${extname}`)).forEach(item => require(item));
    return router;
}

export const middlewares = (middlewares: Koa.middlewares[]) => {
    return target => {
        target.prototype.middlewares = middlewares;
    }
}