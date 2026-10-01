const postContainer = document.querySelector("#root");
const prevPostBnt = document.querySelector(".left");
const nextPostBnt = document.querySelector(".right");

const BASE_URL = "https://jsonplaceholder.typicode.com";
const MAX_POST_NUMBER = 100;

// Получаем номер поста из localStorage
// Если значения нет, используем 1
let postNumber = Number(localStorage.getItem("postNumber")) || 1;

const getPostById = async () => {
  try {
    // Проверяем номер поста перед отправкой запроса
    if (
      !Number.isInteger(postNumber) ||
      postNumber < 1 ||
      postNumber > MAX_POST_NUMBER
    ) {
      throw new Error("Некорректный номер поста");
    }

    const response = await fetch(`${BASE_URL}/posts/${postNumber}`);

    // Проверяем, успешно ли выполнен запрос
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();

    // Проверяем полученные данные
    if (
      !data ||
      !Number.isInteger(data.id) ||
      typeof data.title !== "string" ||
      typeof data.body !== "string"
    ) {
      throw new Error("Получены некорректные данные поста");
    }

    return data;
  } catch (error) {
    console.log(error);
    // Показываем сообщение об ошибке пользователю
    postContainer.textContent = "Не удалось загрузить пост";
    return null; // Возвращаем null в случае ошибки
  }
};

// getPostById(1);

const renderPost = (post) => {
  // Если данные не получены, ничего не отображаем
  if (!post) {
    return;
  }

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
  // Показываем Loading перед запросом
  postContainer.textContent = "Loading...";

  const postData = await getPostById();
  // Отображаем пост только при успешном получении данных
  if (postData) {
    renderPost(postData);

    // Сохраняем номер поста
    localStorage.setItem("postNumber", postNumber);
  }
};

// Функция debounce
const debounce = (callback, delay) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

// Обработчик кнопки следующего поста
const handleNextPost = debounce(() => {
  if (postNumber < MAX_POST_NUMBER) {
    postNumber++;
    loadPost();
  }
}, 350);

// Обработчик кнопки предыдущего поста
const handlePrevPost = debounce(() => {
  if (postNumber > 1) {
    postNumber--;
    loadPost();
  }
}, 350);

loadPost();

nextPostBnt.addEventListener("click", handleNextPost);
prevPostBnt.addEventListener("click", handlePrevPost);

// 1.localStorage 2.Loading, 3.Валидация 4.Debounce (350ms - 1 click)
