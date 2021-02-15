const postList = document.getElementById("post-list")

async function main() {
  const posts = await fetch("./posts.json").then(res => res.json())
  createPosts(posts)
}

function createPost(posts, i) {
  const postElement = document.createElement("div")
  postElement.classList = "post"
  const titleElement = document.createElement("h1")
  titleElement.classList = "title"
  titleElement.innerText = posts[i].title
  const dateElement = document.createElement("p")
  dateElement.classList = "date"
  dateElement.innerText = posts[i].date
  const contentsElement = document.createElement("p")
  contentsElement.classList = "content-post"
  contentsElement.innerHTML = "<p>" + posts[i].content.replace(/{{(\d)}}/g, `</p><img src="../images/blog/${i}_$1.jpg"><p>\n\n`) + "</p>"
  const backButton = document.createElement("button")
  backButton.innerHTML = "Back"
  backButton.addEventListener("click", () => {
    destroyPosts()
    createPosts(posts)
  })
  contentsElement.appendChild(backButton)
  postElement.appendChild(titleElement)
  postElement.appendChild(dateElement)
  postElement.appendChild(contentsElement)
  postList.appendChild(postElement)
  window.scrollTo(0, 0)
}

function createPosts(posts) {
  for (let i = posts.length-1; i >= 0; i--) {
    const postElement = document.createElement("div")
    postElement.classList = "post"
    const titleElement = document.createElement("h1")
    titleElement.classList = "title"
    titleElement.innerText = posts[i].title
    const dateElement = document.createElement("p")
    dateElement.classList = "date"
    dateElement.innerText = posts[i].date
    const contentElement = document.createElement("div")
    contentElement.classList = "content-list"
    if (posts[i].content.includes("{{0}}")) {
      const imageElement = document.createElement("img")
      imageElement.src = `../images/blog/${i}_0.jpg`
      contentElement.appendChild(imageElement)
    }
    const textElement = document.createElement("p")
    textElement.innerText = posts[i].content.replace(/(?<=.)({{\d}})/g, "\n\n").replace(/({{\d}})/g, "").slice(0, 247) + "..."
    contentElement.appendChild(textElement)
    postElement.appendChild(titleElement)
    postElement.appendChild(dateElement)
    postElement.appendChild(contentElement)
    postElement.addEventListener("click", () => {
      destroyPosts()
      createPost(posts, i)
    })
    postList.appendChild(postElement)
  }
}

function destroyPosts() {
  while (postList.firstChild) {
    postList.removeChild(postList.firstChild)
  }
}

main()