const mongoose = require("mongoose");
mongoose.Promise = global.Promise;//为了解决过期的问题
const Schema = mongoose.Schema;
const log = console.log.bind(console)
//开启调试模式
mongoose.set('debug', true);
//自增长主键
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);


//后期改成config.js引入数据库名
const dbname = 'node'
//
const getDb =  () => {
    const url = `mongodb://localhost:27017/${dbname}`
    const db=  mongoose.connect(url ,{useMongoClient: true,});
    return db
}
//连接数据库
getDb()

class Model {
    static _fields() {
        const f = [
            // [字段名, 类型, 值]
            ['deleted', 'Boolean', false],
            ['created_time', 'Number', 0],
            ['updated_time', 'Number', 0],
        ]
        return f
    }
    //将fields改成下面的形式
    //     // name: {
    //     //     type: String,
    //            default: 0
    //     // },
    // })
    static initSchema(){
        const data = this._fields()
        const schema = {}
        for (let f of data) {
            schema[`${f[0]}`] = {
                'type' : f[1] ,
                'default' : `${f[2]}`
            }
        }
        return schema
    }
    // static initdata(){
    //     const data = this._fields()
    //     const type = {}
    //     const oseform = {}
    //     for (let f of data) {
    //         type[`${f[0]}`] = `${f[1]}`
    //         oseform[`${f[0]}`] = `${f[2]}`
    //     }
    //     return {type , oseform}
    // }
    static getDocument(){
        const schema = this.initSchema()
        const classname = this.name.toLowerCase()
        const modelschema = new Schema(schema, {
            versionKey: false,
            collection: classname
        });
        //主键自增长
        modelschema.plugin(autoIncrement.plugin, classname);
        //
        const documents = mongoose.model(classname, modelschema);
        return documents
    }
    //新增
    static async create(form={}) {
        const documents  = this.getDocument()
        const models = new documents(form)
        //form的key覆盖默认值
        Object.keys(form).forEach((k)=>{
            const c = form[k]
            models[`${c[0]}`] = c[2]
        })
        const ts = Date.now()
        models.created_time = ts
        models.updated_time = ts
        // //
        // log('dudu', models)
        await models.save()
        return models
    }

    static queryall(con) {
        const documents  = this.getDocument()
        let promise = new Promise(function(resolve, reject) {
            var query=documents.find({});
            // query.where(con.where || {});
            // query.sort(con.sort || {});
            // query.or(con.or || []);
            // query.and(con.and || {});
            if(con.pageNum != undefined && con.pageid != undefined ){
                query.limit(con.pageNum); //限制条数
                query.skip(con.pageid)   //开始数 ，通过计算可是实现分页
            }
            query.exec(function(err,docs){
                if (err === null){
                    resolve(docs);
                } else {
                    reject(err);
                }
            })
        });
        return promise
    }

    static all() {
        const documents  = this.getDocument()
        let promise = new Promise(function(resolve, reject) {
            documents.find({}, function(err, docs) {
                if (err === null){
                    resolve(docs);
                } else {
                    reject(err);
                }
            });
        });
        return promise
    }

    static findOne(query) {
        const documents  = this.getDocument()
        let promise = new Promise(function(resolve, reject) {
            documents.findOne(query, function(err, docs) {
                if (err === null){
                    resolve(docs);
                } else {
                    reject(err);
                }
            });
        });
        return promise
    }

    static find(query) {
        const documents  = this.getDocument()
        let promise = new Promise(function(resolve, reject) {
            documents.find(query, function(err, docs) {
                if (err === null){
                    resolve(docs);
                } else {
                    reject(err);
                }
            });
        });
        return promise
    }

    static async get(formid) {
        const data = await this.findOne({_id: formid})
        return data
    }

    //更新
    static save(query , form) {
        const document = this.getDocument()
        document.update(query, form ,function (err) {
            if(err!=null){
                log(err)
            }else {
                log(`更新成功！`)
            }
        });
    }

    //更新
    static saveById(form) {
        const document = this.getDocument()
        document.update({_id: form.id}, form ,function (err) {
            if(err!=null){
                log(err)
            }else {
                log(`更新成功！`)
            }
        });
    }

    //批量更新
    static saveAll(qurey , form) {
        const document = this.getDocument()
        document.updateMany(qurey, form ,function (err) {
            if(err!=null){
                log(err)
            }else {
                log(`更新成功！`)
            }
        });
    }

    static remove(formid) {
        const document = this.getDocument()
        document.remove({ id: formid }, function (err) {
            if(err!=null){
                log(err)
            }else{
                log(`删除成功！`)
            }
        });
    }
}

class User extends Model {
    static _fields() {
        const p = Model._fields()
        const f = [
            ['username', 'String', 'a222'],
            ['password', 'String', 'a333'],
        ]
        const l = p.concat(f)
        return l
    }
}


const test = async ()=>{
    //增加
    //User.create()
    //删除
    //User.remove(13)
    //更新
    // const query = {
    //     'username' : '123'
    // }
    // const form = {
    //     "id" : 13,
    //     "deleted" : true,
    // }
    // User.save(query,form)

    //一堆查询
    //const aa =  await User.all()
    //const aa =  await User.get(2)
    // const aa =  await User.find({
    //     "password" : "333"
    // })
    //log('数据： ', aa)


    //add
    //const a = User.create()
}

if (require.main === module) {
    test()
}

module.exports = Model