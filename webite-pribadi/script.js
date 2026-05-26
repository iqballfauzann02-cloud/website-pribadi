
// =======================
// 1. DATA TUGAS
// =======================

let tugas = JSON.parse(localStorage.getItem("tugas")) || [];

// auto refresh tugas (hapus expired)
setInterval(() => {
    hapusOtomatis();
}, 1000);

// =======================
// TUGAS FUNCTIONS
// =======================

function tambahTugas(){

    const nama = document.getElementById("namaTugas")?.value;
    const deadline = document.getElementById("deadline")?.value;

    if(!nama || !deadline){
        alert("Isi semua data!");
        return;
    }

    tugas.push({
        id: Date.now(),
        nama,
        deadline
    });

    simpanTugas();
    tampilkanTugas();
}

function tampilkanTugas(){

    const list = document.getElementById("listTugas");
    if(!list) return;

    list.innerHTML = "";

    tugas.forEach((item) => {

        list.innerHTML += `
            <div class="card">

                <h3>${item.nama}</h3>

                <p class="deadline">
                    Deadline: ${new Date(item.deadline).toLocaleString("id-ID")}
                </p>

                <button onclick="editTugas(${item.id})">Edit</button>
                <button onclick="hapusTugas(${item.id})">Hapus</button>

            </div>
        `;
    });
}

function hapusTugas(id){

    tugas = tugas.filter(t => t.id !== id);
    simpanTugas();
    tampilkanTugas();
}

function editTugas(id){

    const data = tugas.find(t => t.id === id);

    const namaBaru = prompt("Edit tugas", data.nama);

    if(namaBaru){
        data.nama = namaBaru;
        simpanTugas();
        tampilkanTugas();
    }
}

function simpanTugas(){
    localStorage.setItem("tugas", JSON.stringify(tugas));
}

function hapusOtomatis(){

    const sekarang = new Date();

    tugas = tugas.filter(t => new Date(t.deadline) > sekarang);

    simpanTugas();
    tampilkanTugas();
}


// =======================
// 2. DATA PROGRESS
// =======================

let progressData = JSON.parse(localStorage.getItem("progress")) || {};

const kegiatan = [
    "Membuat program sederhana",
    "Editing video",
    "Desain poster/typography",
    "Mempelajari aplikasi editing",
    "Workout",
    "Melatih skill gitar",
    "Membaca buku",
    "Bermain Mobile Legends",
    "Mempelajari istilah IT"
];

// tanggal hari ini
const hariIni = new Date().toLocaleDateString("id-ID");

// kalau hari belum ada
if(!progressData[hariIni]){
    progressData[hariIni] = {};
}

// =======================
// PROGRESS FUNCTIONS
// =======================

function tampilkanProgress(){

    const list = document.getElementById("progressList");

    if(!list) return;

    list.innerHTML = "";

    const hari = new Date().getDay();

    kegiatan.forEach((item) => {

        // Workout hanya Senin - Kamis
        if(item === "Workout"){
            if(hari < 1 || hari > 4){
                return;
            }
        }

        const dataSelesai = progressData[hariIni][item];

        const sudah = !!dataSelesai;

        list.innerHTML += `
            <div class="card">

                <label style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                ">

                    <div style="
                        display:flex;
                        gap:10px;
                        align-items:flex-start;
                    ">

                        <input
                            type="checkbox"
                            onchange="toggleProgress('${item}')"
                            ${sudah ? "checked disabled" : ""}
                        >

                        <div>

                            <span>${item}</span>

                            ${
                                sudah
                                ? `
                                    <p style="
                                        font-size:12px;
                                        color:gray;
                                        margin-top:5px;
                                    ">
                                        Selesai:<br>
                                        ${dataSelesai}
                                    </p>
                                `
                                : ""
                            }

                        </div>

                    </div>

                    ${
                        sudah
                        ? '<span class="status-done">Selesai</span>'
                        : ''
                    }

                </label>

            </div>
        `;
    });
}

function toggleProgress(nama){

    // kalau sudah selesai hari ini
    if(progressData[hariIni][nama]){
        return;
    }

    const sekarang = new Date();

    const waktu = sekarang.toLocaleString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    progressData[hariIni][nama] = waktu;

    localStorage.setItem(
        "progress",
        JSON.stringify(progressData)
    );

    tampilkanProgress();
}

// =======================
// 3. AUTO INIT (SMART RUN)
// =======================

document.addEventListener("DOMContentLoaded", () => {

    tampilkanTugas();
    tampilkanProgress();

});