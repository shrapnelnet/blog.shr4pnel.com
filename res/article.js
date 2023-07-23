async function main() {
    document.body.style.display = "none"
    const titleDiv = document.getElementById("title");
    const dateDiv = document.getElementById("date");
    const contentDiv = document.getElementById("content");
    const articleName = window.location.pathname.split("/").slice(-1);
    let article = await fetch(`https://storage.googleapis.com/blog.shr4pnel.com/posts/${articleName}.json`);
    article = await article.json();
    let title = document.createElement("h1");
    title.innerHTML = article.title;
    titleDiv.appendChild(title);
    const date = document.createElement("h3");
    const articleDate = new Date(article.date);
    date.innerHTML = articleDate.toUTCString();
    dateDiv.appendChild(date);
    const articleArray = article.content.split("\n");
    articleArray.forEach((paragraph) => {
        const content = document.createElement("p");
        content.innerHTML = paragraph;
        contentDiv.appendChild(content);
    });
    document.body.style.display = "unset";
}

main();