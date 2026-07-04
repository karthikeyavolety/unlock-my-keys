const postInput = document.querySelector(".post-box input");
const postButton = document.querySelector(".tweet-btn");
const postsContainer = document.querySelector(".posts");

let posts = [
    {
        user: "OpenAI",
        content: "Welcome to X (Twitter Clone)!",
        likes: 0
    },
    {
        user: "Google",
        content: "Start posting your thoughts!",
        likes: 0
    }
];

// Display Posts
function displayPosts() {
    postsContainer.innerHTML = "";

    posts.forEach((post, index) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        postElement.innerHTML = `
            <h4>${post.user}</h4>
            <p>${post.content}</p>

            <div class="post-actions">
                <button onclick="likePost(${index})">
                    ❤️ ${post.likes}
                </button>

                <button onclick="deletePost(${index})">
                    🗑 Delete
                </button>
            </div>
        `;

        postsContainer.appendChild(postElement);
    });
}

// Create Post
function createPost() {

    const text = postInput.value.trim();

    if (text === "") {
        alert("Please write something!");
        return;
    }

    posts.unshift({
        user: "You",
        content: text,
        likes: 0
    });

    postInput.value = "";

    displayPosts();
}

// Like Post
function likePost(index) {
    posts[index].likes++;
    displayPosts();
}

// Delete Post
function deletePost(index) {
    posts.splice(index, 1);
    displayPosts();
}

// Post Button
postButton.addEventListener("click", createPost);

// Enter Key
postInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        createPost();
    }
});

// Initial Load
displayPosts();