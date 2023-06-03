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
let csrftoken = getCookie("csrftoken");
let active_item = null;

// SHOW all tasks from Data
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
        let title = `<div class="title">${list[i].title}</div>`
        if (list[i].completed == true){
            title = `<strike class="title">${list[i].title}</strike>`
        }
        const item = `
                <div id="data-row-${i}" class="task-wrapper flex wrapper">
                    <div class="d-flex align-items-center flex-grow-1">
                        ${title}
                    </div>
                    <div class="d-flex justify-content-end align-items-center">
                        <button class="btn btn-sm btn-outline-info edit mx-1">Edit</button>
                        <button class="btn btn-sm btn-outline-danger delete mx-1"><i class="bi bi-trash-fill"></i></button>
                    </div>
                </div>
                `;

        wrapper.innerHTML += item;
      }
      for (let i in list) {
        const edit_btn = document.getElementsByClassName("edit")[i];
        const delete_btn = document.getElementsByClassName("delete")[i];
        const title = document.getElementsByClassName("title")[i];

        edit_btn.addEventListener(
          "click",
          (function (item) {
            return function () {
              edit_item(item);
            };
          })(list[i])
        );
        delete_btn.addEventListener(
          "click",
          (function (item) {
            return function () {
              delete_item(item);
            };
          })(list[i])
        );
        title.addEventListener(
          "click",
          (function (item) {
            return function () {
              strike_unstrike(item);
            };
          })(list[i])
        );
      }
    });
}

// CREATE new task on form with 'add'
const form = document.getElementById("form-wrapper");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Form added");
  const title = document.getElementById("title").value;

  if (active_item === null) {
    // Create a new item
    const url = "http://127.0.0.1:8000/api/task-create/";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ title: title }),
    }).then(function (response) {
      show_list();
      document.getElementById("form").reset();
    });
  } else {
    // Update the existing item
    const url = `http://127.0.0.1:8000/api/task-update/${active_item.id}/`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ title: title }),
    }).then(function (response) {
      show_list();
      document.getElementById("form").reset();
      active_item = null; // Reset active_item after updating
    });
  }
});

// EDIT the item by clicking 'Edit'
function edit_item(item) {
  console.log("item edit clicked: ", item);
  active_item = item;
  document.getElementById("title").value = active_item.title;
}

// DETELE the item by clicking 'Trash Icon'
function delete_item(item) {
  console.log("Delete clicked: ", item);
  const url = `http://127.0.0.1:8000/api/task-delete/${item.id}/`;
  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  }).then(function (response) {
    show_list();
    document.getElementById("form").reset();
  });
}

// Cross out completed task
function strike_unstrike(item) {
  console.log("strike_unstrike clicked");
  item.completed = !item.completed;
  const url = `http://127.0.0.1:8000/api/task-update/${item.id}/`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ title: item.title, completed: item.completed }),
  }).then(function (response) {
    show_list();
  });
}
