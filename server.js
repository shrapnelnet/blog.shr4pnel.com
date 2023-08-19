import cors from "cors"
import express from "express"
import path from "path"
import fs from "fs"
import compression from "compression"
import helmet from "helmet"
import util from "util"
const app = express()
const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
app.use(cors())
app.use(express.static("res"))
app.use(express.json())
app.use(compression())
app.set("view engine", "pug")
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'"],
            "script-src-attr": ["'self'"],
            "font-src": ["'self'", "fonts.googleapis.com", "fonts.gstatic.com"],
            "img-src": ["'self'", "wallpapercave.com"]
        }
    }
}))

async function getFiles() {
    const posts = await readdir(path.resolve("./res/posts"))
    const parsedFiles = await Promise.all(posts.map(async (post) => {
        post = await readFile(path.resolve(`./res/posts/${post}`))
        return JSON.parse(post)
    }))
    return parsedFiles
}

app.get("/", async (req, res) => {
    if (req.headers.referer) {
        console.log(`I WAS REFERRED BY ${req.headers.referer}`)
    }
    const posts = await getFiles()
    return res.render("index.pug", {posts})
})

app.get("/posts/:postname", (_req, res) => {
    return res.sendFile(path.resolve("article.html"))
})

app.get("/links", (_req, res) => {
    return res.sendFile(path.resolve("links.html"))
})

app.use((_req, res) => {
    res.status(404).sendFile(path.resolve("./404.html"))
})

app.listen(3000, () => {
    console.log("server started")  
})