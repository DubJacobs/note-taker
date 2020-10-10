const path = require('path')
const fs = require('fs')
const express = require('express')
const { v4: uuidv4 } = require('uuid');
const app = express()

const port = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, "public")))

app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
        if (err) {
            res.send("you have an error")
            return
        }
        res.json(JSON.parse(data))
    })
})

app.post("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
        if (err) {
            res.send("you have an error")
            return
        }
        const notes = JSON.parse(data)
        req.body.id = uuidv4()
        console.log(req.body)
        notes.push(req.body)
        fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes), "utf8", (err1) => {
            if (err1) {
                res.send("you have an error")
                return
            }
            res.json(notes)
        })
    })
})

app.delete("/api/notes/:id", (req, res) => {
    console.log(req.params)
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
        if (err) {
            res.send("you have an error")
            return
        }
        const notes = JSON.parse(data)
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === req.params.id) {
                notes.splice(i, 1)
            }
        }
        fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes), "utf8", (err1) => {
            if (err1) {
                res.send("you have an error")
                return
            }
            res.json(notes)
        })
    })
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"))
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
})

app.listen(port, () => {
    console.log(port)
})
