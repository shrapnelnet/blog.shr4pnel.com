import XMLWriter from "xml-writer";
import fs from "fs";
let builder = new XMLWriter(true);
let date = new Date();
// your public storage bucket here
const bucketURI = "https://storage.googleapis.com/blog.shr4pnel.com/";
// your site here
const blogURI = "https://blog.shr4pnel.com";
builder.startDocument();
// Channel level elements
builder.startElement("rss").writeAttribute("version", "2.0").startElement("channel");
builder.writeElement("title", "blog.shr4pnel.com");
builder.writeElement("link", "https://blog.shr4pnel.com");
builder.writeElement("description", "Ruminations on music, the world and whatever rubbish pops into my head delivered straight to you.");
builder.writeElement("language", "en");
builder.writeElement("webMaster", "shrapnelnet@protonmail.com")
builder.writeElement("lastBuildDate", date.toString());
builder.writeElement("generator", "shrapnelnet RSS servant v1.0");
builder.writeElement("docs", "https://cyber.harvard.edu/rss/rss.html");
// Item level elements (per blog post)
// fetch posts as array of items in storage bucket
let bucketFileArray = await fetch("https://blog.shr4pnel.com/api/getposts");
bucketFileArray = await bucketFileArray.json();
// get only the JSON files
let postNameArray = bucketFileArray.filter((post) => post.includes(".json"));
// GET all JSON files
let posts = await Promise.all(postNameArray.map(async (postName) => {
    let post = await fetch(`${bucketURI}${postName}`);
    return post.json();
}));
// sort descending by date
posts = posts.sort((a, b) => {
    if (a.date < b.date) {
        return 1;
    } else {
        return -1;
    }
});
// item level elements
posts.forEach((post) => {
    builder.startElement("item");
    builder.writeElement("title", post.title);
    builder.writeElement("link", `${blogURI}/posts/${post.name}`);
    builder.writeElement("author", "shrapnelnet@protonmail.com");
    builder.writeElement("pubDate", new Date(post.date).toString());
    builder.endElement("item");
});
builder.endElement("channel");
builder.endElement("rss");
fs.writeFile("./res/rss.xml", builder.toString(), (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("saved at ./res/rss.xml");
    }
})
