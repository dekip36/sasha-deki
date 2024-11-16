// method
function insert() {
  const form = $("#formMessage").serializeArray();
  let dataMessage = JSON.parse(localStorage.getItem("dataMessage")) || [];

  let newData = {};
  form.forEach(function (item, index) {
    let name = item["name"];
    let value = name === "id" || name === "" ? Number(item["value"]) : item["value"];
    newData[name] = value;
  });

  // Simpan ke localStorage
  localStorage.setItem("dataMessage", JSON.stringify([...dataMessage, newData]));
  
  // Kirim ke Google Sheets
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbz-aHZgV1d5fE8wW4YpYriY0CDcC9nOp9KxukjTA7x8Uw95zyrn49J2WdB8NNtKOHg/exec';
  
  fetch(scriptUrl, {
    method: 'POST',
    body: JSON.stringify(newData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  return newData;
}

function loadDataFromSheet() {
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbz-aHZgV1d5fE8wW4YpYriY0CDcC9nOp9KxukjTA7x8Uw95zyrn49J2WdB8NNtKOHg/exec';
  
  fetch(scriptUrl)
    .then(response => response.json())
    .then(data => {
      localStorage.setItem("dataMessage", JSON.stringify(data));
      dataMessage = data;
      $(".card-message").html(showData(dataMessage));
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function showData(dataMessage) {
  let row = "";

  if (dataMessage.length == 0) {
    return (row = `<h1 class="title" style="text-align : center">Belum Ada Pesan Masuk</h1>`);
  }

  dataMessage.forEach(function (item, index) {
    row += `<h1 class="title">${item["nama"]}</h1>`;
    row += `<h4>- ${item["hubungan"]}</h4>`;
    row += `<p>${item["pesan"]}</p>`;
  });
  return row;
}

$(function () {
  // initialize
  loadDataFromSheet(); // Load data dari spreadsheet saat halaman dimuat
  
  // events
  $("#formMessage").on("submit", function (e) {
    e.preventDefault();
    dataMessage.push(insert());
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Terima Kasih Atas Ucapan & Doanya ",
      showConfirmButton: false,
      timer: 2000,
    });
    $(".card-message").html(showData(dataMessage));
  });
});
