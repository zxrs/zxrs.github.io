const MAX_IMG_SIZE = 120;

const append = (dataurl, name, size) => {
    const container = document.querySelector("#container");
    const img = new Image();
    img.onload = () => {
        let css = [];
        css.push(`height: ${MAX_IMG_SIZE}px;`);
        css.push("padding: 1px 2px 1px 0px;");
        img.style.cssText = css.join("");

        const a = document.createElement("a");
        a.href = dataurl;
        a.download = name;
        a.title = `${name} (${size} KB, ${img.width}px x ${img.height}px)`;
        a.appendChild(img);
        container.appendChild(a);
    };
    img.src = dataurl;
};

const read = (file) => {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(new Uint8Array(e.target.result));
        };
        reader.readAsArrayBuffer(file)
    });
};

const onchange = async () => {
    const file = document.querySelector("#file");
    for (const f of file.files) {
        const name = f.name;
        const jpg = await read(f);
        const compressed_jpg = await window.generate_jpg(jpg, 70.0, 1600, true, 1.0);
        const size = Math.trunc(compressed_jpg.length / 1024);
        const blob = new Blob([compressed_jpg], {type: "image/jpeg"});
        const dataurl = URL.createObjectURL(blob);;
        append(dataurl, name, size);
    }
};

const onload = () => {
    const file = document.querySelector("#file");
    file.addEventListener("change", onchange, true);
};

window.addEventListener("DOMContentLoaded", onload);
