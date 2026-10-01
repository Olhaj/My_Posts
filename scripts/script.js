const postContainer = document.querySelector("#root");
const prevPostBnt = document.querySelector(".left");
const nextPostBnt = document.querySelector(".right");

const BASE_URL = "https://jsonplaceholder.typicode.com";

// Получаем номер поста из localStorage
// Если значения нет, используем 1
let postNumber = Number(localStorage.getItem("postNumber")) || 1;

const getPostById = async () => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postNumber}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// getPostById(1);

const renderPost = (post) => {
  postContainer.innerHTML = "";

  const title = document.createElement("p");
  const body = document.createElement("p");
  const id = document.createElement("h3");
  const container = document.createElement("div");

  title.textContent = post.title;
  body.textContent = post.body;
  id.textContent = post.id;

  container.classList.add("post");
  title.classList.add("subheader");

  container.append(id, title, body);
  postContainer.append(container);
};

// renderPost({ id: 1, title: "Post Title", body: "Post Body" });

const loadPost = async () => {
  const postData = await getPostById();
  renderPost(postData);

  // Сохраняем номер текущего поста
  localStorage.setItem("postNumber", postNumber);
};

loadPost();

nextPostBnt.addEventListener("click", () => {
  postNumber++;

  // Сохраняем новый номер поста
  localStorage.setItem("postNumber", postNumber);

  loadPost();
});

prevPostBnt.addEventListener("click", () => {
  if (postNumber > 1) {
    postNumber--;

    // Сохраняем новый номер поста
    localStorage.setItem("postNumber", postNumber);
    loadPost();
  }
});

//1.localStorage 2.LocalStorage 3.Валидация 4. Debounce(350ms - 1 click)
