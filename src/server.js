
const express = require('express');
const server = express();

// pegar o banco de dados
const db = require("./database/db")

// configurar pasta publica
server.use(express.static("public"));

// habilitar o uso do req.nody
server.use(express.urlencoded({ extended: true }))

// utilizando template engine
const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
    express: server,
    noCache: true
});

// configurar caminhos da aplicação
// Página Inicial
// req: Requisição; res: Resposta
server.get("/", (req, res) => {
    return res.render("index.html", { title: "OI"})
})

server.get("/create-point", (req, res) => {
    //req.query: Query Strings da url
    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    //req.body: O corpo do formulário
    //inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            //Fazer retornar uma página de erro
            return res.send("Erro no cadastro!")

        }
        return res.render("create-point.html", { saved: true })
    }
    db.run(query, values, afterInsertData)
})

server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        // pesquisa vazia
        return res.render("search-results.html", { total: 0 })
    }

    // pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }
        const total = rows.length
        return res.render("search-results.html", { places: rows, total })
    })
})

// Ligar o servidor
server.listen(3000);
