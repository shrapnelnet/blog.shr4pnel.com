import XMLWriter from "xml-writer";
import fs from "fs";
let builder = new XMLWriter(true);

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
    const timezone = date.toString().includes("Mean") ? "GMT": "BST";
    return `${RFC822Day}, ${dayOfMonth} ${month} ${year} ${hours}:${minutes}:${seconds} ${timezone}`;
}

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
builder.writeElement("webMaster", "shrapnelnet@protonmail.com (big tyler)")
builder.writeElement("lastBuildDate", dateToRFC822(new Date()));
builder.writeElement("pubDate", "Sun, 23 Jul 2023 15:37:28 BST")
builder.writeElement("generator", "shrapnelnet RSS servant v1.0");
builder.writeElement("docs", "https://cyber.harvard.edu/rss/rss.html");
builder.writeRaw(`\n        <atom:link href="https://blog.shr4pnel.com/rss.xml" rel="self" type="application/rss+xml" />`)
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
    builder.writeElement("author", "shrapnelnet@protonmail.com (big tyler)");
    builder.writeElement("pubDate", dateToRFC822(new Date(post.date)));
    builder.writeElement("guid", post.name);
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
