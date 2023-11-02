import init, {extract} from "./pkg/winmail.js";

(async () => {await init();})();

function clear_container() {
    const container = document.getElementById("container");
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }
}

function add_link(file_name, base64) {
    const container = document.getElementById("container");
    const div = document.createElement("div");
    const a = document.createElement("a");
    a.href = `data:;base64,${base64}`
    a.innerText = file_name;
    a.download = file_name;
    div.appendChild(a);
    container.appendChild(div);
}

function extract_(e) {
    const winmail = new Uint8Array(e.target.result);
    const map = extract(winmail);
    for (const [file_name, base64] of map) {
        add_link(file_name, base64);
    }
}

function onchange() {
    clear_container();
    const file = document.getElementById("winmail");
    const reader = new FileReader();
    reader.onload = extract_;
    reader.readAsArrayBuffer(file.files[0]);
}

function onload() {
    const file = document.getElementById("winmail");
    file.addEventListener("change", onchange, true);
}

window.addEventListener("DOMContentLoaded", onload, true);
