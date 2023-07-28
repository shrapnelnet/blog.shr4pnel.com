import cors from "cors";
import express from "express";
import path from "path";
import fetch from "node-fetch";
import { Storage } from "@google-cloud/storage";
const storage = new Storage();
const app = express();
app.use(cors());
app.use(express.static("res"));
app.use(express.json());

app.get("/", (_req, res) => {
    return res.sendFile(path.resolve("./index.html"));
})

async function getPosts() {
    const [files] = await storage.bucket("blog.shr4pnel.com").getFiles();
    let fileNames = [];
    files.forEach((file) => {
        fileNames.push(file.name);
    })
    return fileNames;
}

app.get("/api/getposts", async (_req, res) => {
    const fileNames = await getPosts();
    return res.json(fileNames);
})

app.get("/posts/:postname", async (req, res) => {
    let article = await fetch(`https://storage.googleapis.com/blog.shr4pnel.com/posts/${req.params.postname}.json`)
    article = await article.json();
    return res.sendFile(path.resolve("article.html"));
})

app.listen(3000, () => {
    console.log("server started");  
})