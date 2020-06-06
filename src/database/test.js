const db = require("./db")

function listFromDb() {
    db.all(`SELECT * FROM places`, function(err, rows) {
        if(err) {
            return console.log(err)
        }
        console.log("Aqui estão seus registros")
        console.log(rows)
    })
}

function deleteFromDb(id) {
    db.run(` DELETE FROM places WHERE id = ?`, [id], function(err) {
        if(err) {
            return console.log(err)
        }
        console.log("Registro deletado com sucesso!")
    })
}

db.serialize(() => {
    //listFromDb()
    //deleteFromDb(5)
})
