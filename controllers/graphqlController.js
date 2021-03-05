var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const mongo = require('../db')
const mongodb = require('mongodb')

var schema = buildSchema(`
type Query {
    hello: String
    service: [Servico]!
}
type Mutation {
    addService (servico: ServicoInput): Servico!
    removeService (id: ID!): ID!
}
input ServicoInput {
    nome: String
    data: String
    kilometragem: Int
    prestadorServico: String
    preco: String
    automovel: String
}
type Servico {
    id: ID
    nome: String
    data: String
    kilometragem: Int
    prestadorServico: String
    preco: String
    automovel: String
}
`);

// mutation {
//   addService(
//     servico: {
//     	nome:"teste", 
//     	data: "08-09-2020", 
//     	prestadorServico: "Douglas", 
//     	preco: "50", 
//     	kilometragem: 50000
//   	}
//   ) {
//     nome
//   }
// }



// The root provides a resolver function for each API endpoint
var root = {
    hello: () => {
        return 'Hello world!';
    },
    service: async() => {
        const db = await mongo.execute()
        const cursor = await db.collection('servico').find({})
        const arr = []

        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            doc['id'] = doc['_id']
            arr.push(doc)
        }

        return arr
    },
    addService: async(data) => {
        const db = await mongo.execute()
        const result = await db.collection('servico').insertOne(data.servico)
        console.log(result.ops[0])
        return result.ops[0]
    },
    removeService: async(data) => {
        const db = await mongo.execute()
        console.log('delete')
        const result = await db.collection('servico').deleteOne({ _id: new mongodb.ObjectId(data.id) })
        console.log(result.ops[0])
        return result.ops[0]
    }
};

exports.graphql = graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
})