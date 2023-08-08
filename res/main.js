function downloadPosts() {
    fetch("/api/getposts")
        .then((res) => res.json())
        .then((postArray) => {
            postArray.sort((a, b) => {
                if (a.date < b.date) {
                    return 1;
                } else {
                    return -1;
                }
            });
            const articles = document.getElementById("articles");
            // create content, dynamically link it to article.html
            postArray.forEach((post, index) => {
                const card = document.createElement("div");
                card.classList.add("card");
                const image = document.createElement("img");
                image.src = post.thumb === "default" ? "/anon.png": post.thumb;
                image.style.width = "90px";
                image.style.height = "90px";
                const title = document.createElement("a");
                title.innerHTML = post.title;
                title.id = "wrap";
                title.href = "/posts/" + post.name;
                const date = document.createElement("p");
                const dateContent = new Date(post.date);
                date.innerHTML = dateContent.toLocaleString();
                card.appendChild(image);
                card.appendChild(title);
                card.appendChild(date);
                if (index === 0)
                    articles.innerHTML = "";
                articles.appendChild(card);
            })

        })
        .catch((err) => {
            console.error(err);
        })
}

downloadPosts();