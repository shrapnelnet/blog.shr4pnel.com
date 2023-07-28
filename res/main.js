const bucketname = "blog.shr4pnel.com";
const bucketuri = "https://storage.googleapis.com/blog.shr4pnel.com/";

function sortPostArray(dateA, dateB) {
    dateA = new Date(dateA.date);
    dateB = new Date(dateB.date);
    console.log(dateA, dateB)
    if (dateA < dateB) {
        console.log("fired")
        return 1; 
    } else if (dateB > dateA) {
        return -1;
    }
}

function downloadPosts() {
    fetch("/api/getposts", {
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => res.json())
        .then((res) => {
            const posts = res.filter((post) => post.includes(".json"));
            return posts;
        })
        .then((posts) => {
            let postURLArray = []
            posts.forEach((post) => {
                const url = bucketuri + post;
                postURLArray.push(url);
            })
            return postURLArray;
        })
        .then((postURLArray) => {
            Promise.all(postURLArray.map(async (url) => {
                const post = await fetch(url, {headers: {"Content-Type": "application/json"}});
                return post.json();
            }))
                .then((postArray) => {
                    postArray.sort(sortPostArray);
                    console.log(postArray);
                    const articles = document.getElementById("articles");
                    // create content, dynamically link it to article.html
                    postArray.forEach((post, index) => {
                        const card = document.createElement("div");
                        card.classList.add("card");
                        const image = document.createElement("img");
                        image.src = post.thumb === "default" ? "/anon.png": post.thumb;
                        image.style.width = "100px"
                        const title = document.createElement("a");
                        title.innerHTML = post.title;
                        title.id = "wrap";
                        title.href = "/posts/" + post.name;
                        const date = document.createElement("p")
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
        })
        .catch((err) => {
            console.error(err);
        })
}

downloadPosts();