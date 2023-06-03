function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");

show_list();

function show_list() {
  const wrapper = document.getElementById("list-wrapper");
  wrapper.innerHTML = "";
  const url = "http://127.0.0.1:8000/api/task-list/";

  fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      console.log("Data:", data);

      const list = data;
      for (let i in list) {
        const item = `
                <div id="data-row-${i}" class="task-wrapper flex wrapper">
                    <div class="d-flex align-items-center flex-grow-1">
                        <div class="title">${list[i].title}</div>
                    </div>
                    <div class="d-flex justify-content-end align-items-center">
                        <button class="btn btn-sm btn-outline-info edit mx-1">Edit</button>
                        <button class="btn btn-sm btn-outline-danger delete mx-1"><i class="bi bi-trash-fill"></i></button>
                    </div>
                </div>
                `;

        wrapper.innerHTML += item;
      }
    });
}
const form = document.getElementById("form-wrapper");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Form added");
  const url = "http://127.0.0.1:8000/api/task-create/";
  const title = document.getElementById("title").value;
  fetch(url, {
    method: `POST`,
    headers: {
      "Content-type": "application/json",
      "X-CSRFTToken": csrftoken,
    },
    body: JSON.stringify({ title: title }),
  }).then(function (response) {
    show_list();
    document.getElementById("form").reset();
  });
});
