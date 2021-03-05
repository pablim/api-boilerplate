const MongoClient = require('mongodb').MongoClient;
const dbName = 'officina'
const url = 'mongodb://localhost:27017/' + dbName

exports.execute = async function () {
    const client = await MongoClient.connect(url, 
            { 
                useNewUrlParser: true, 
                useUnifiedTopology: true 
            }
        )
        .catch(err=>console.log(err))
    return client.db(dbName)
}

// exports.execute = function (callback) {
//     MongoClient.connect(url)
//         .then(client => {
//             const conn = client.db(dbName);
//             callback(conn)
//             client.close()
//         })
//         .catch(err=>console.log(err))
// }