show_list();

function show_list() {
  const wrapper = document.getElementById("list-wrapper");
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
                        <button class="btn btn-sm btn-outline-info edit">Edit</button>
                        <button class="btn btn-sm btn-outline-danger delete"><i class="bi bi-trash-fill"></i></button>
                    </div>
                </div>
                `;

        wrapper.innerHTML += item;
      }
    });
}
