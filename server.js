import cors from "cors";
import express from "express";
import path from "path";
import fs from "fs";
import compression from "compression";
import helmet from "helmet";
const app = express();
app.use(cors());
app.use(express.static("res"));
app.use(express.json());
app.use(compression());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'"],
            "script-src-attr": ["'self'"],
            "font-src": ["'self'", "fonts.googleapis.com", "fonts.gstatic.com"]
        }
    }
}));

app.get("/", (_req, res) => {
    return res.sendFile(path.resolve("./index.html"));
})

app.get("/api/getposts", async (_req, res) => {
    const JSONFiles = [];
    fs.readdir(path.resolve("./res/posts"), (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500);
        }
        files.forEach((fileName) => {
            const file = fs.readFileSync(path.resolve(`./res/posts/${fileName}`));
            let post = JSON.parse(file);
            JSONFiles.push(post);
        });
        return res.json(JSONFiles);
    })
})

app.get("/api/getpost", async (req, res) => {
    const postBuffer = fs.readFileSync(path.resolve(`./res/posts/${req.query.post}`));
    const postJSON = JSON.parse(postBuffer);
    return res.json(postJSON);
})

app.get("/posts/:postname", (_req, res) => {
    return res.sendFile(path.resolve("article.html"));
})

app.use((_req, res) => {
    res.status(404).sendFile(path.resolve("./404.html"));
})

app.listen(3000, () => {
    console.log("server started");  
})