import XMLWriter from "xml-writer";
import fs from "fs";
import { promisify } from "util";
let builder = new XMLWriter(true);
const readFile = promisify(fs.readFile)
const readdir = promisify(fs.readdir)

function dateToRFC822(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const RFC822Day = days[date.getUTCDay()];
    const dayOfMonth = date.getUTCDate() < 10 ? `0${date.getUTCDate()}`: date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours() < 10 ? `0${date.getUTCHours()}`: date.getUTCHours();
    const minutes = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}`: date.getUTCMinutes();
    const seconds = date.getUTCSeconds() < 10 ? `0${date.getUTCSeconds()}`: date.getUTCSeconds();
    const timezone = "GMT";
    return `${RFC822Day}, ${dayOfMonth} ${month} ${year} ${hours}:${minutes}:${seconds} ${timezone}`;
}

// your site here
const blogURI = "https://blog.shr4pnel.com";
builder.startDocument();
// Channel level elements
builder.startElement("rss").writeAttribute("version", "2.0").startElement("channel");
builder.writeElement("title", "blog.shr4pnel.com");
builder.writeElement("link", "https://blog.shr4pnel.com");
builder.writeElement("description", "Ruminations on music, the world and whatever rubbish pops into my head delivered straight to you.");
builder.writeElement("language", "en");
builder.writeElement("webMaster", "shrapnelnet@protonmail.com (big tyler)")
builder.writeElement("lastBuildDate", dateToRFC822(new Date()));
builder.writeElement("pubDate", "Sun, 23 Jul 2023 15:37:28 GMT")
builder.writeElement("generator", "shrapnelnet RSS servant v1.0");
builder.writeElement("docs", "https://cyber.harvard.edu/rss/rss.html");
// Item level elements (per blog post)
const posts = await readdir("./res/posts")
const fullPostArray = []
for (const post of posts) {
    const postJSONBuffer = await readFile(`./res/posts/${post}`)
    const postJSON = JSON.parse(postJSONBuffer.toString())
    fullPostArray.push(postJSON)
}
// sort descending by date
const sortedPosts = fullPostArray.sort((a, b) => {
    if (a.date < b.date) {
        return 1;
    } else {
        return -1;
    }
});
// item level elements
sortedPosts.forEach((post) => {
    builder.startElement("item");
    builder.writeElement("title", post.title);
    builder.writeElement("link", `${blogURI}/posts/${post.name}`);
    builder.writeElement("author", "admin@shr4pnel.com (big tyler)");
    builder.writeElement("pubDate", dateToRFC822(new Date(post.date)));
    builder.writeElement("guid", `${blogURI}/posts/${post.name}`);
    builder.writeElement("description", post.description)
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
