const id = "preview";
const cache = new Map();
const dpi = 60;

document.addEventListener("mouseover", onmouseover, true);
document.addEventListener("mouseout", onmouseout, true);

function onmouseover(e) {
    if (e.target.nodeName.toLowerCase() == "a" && e.target.hasAttribute("href")) {
        preview(e);
    }
}

function onmouseout() {
    close_preview();
}

async function preview(e) {
    close_preview();

    if (!mupdf_initialized)
        return;

    let url = e.target.getAttribute("href");

    {
        let data = cache.get(url);
        if (data) {
            show_preview(e, data);
            return;
        }
    }

    let res = await fetch(url);
    let pdf = await res.arrayBuffer();
    let doc = await mupdf.openDocument(pdf, url);
    let png = await mupdf.drawPageAsPNG(doc, 1, dpi * devicePixelRatio);
    await mupdf.freeDocument(doc);
    let data = URL.createObjectURL(new Blob([png], {type: "image/png"}));
    cache.set(url, data);
    show_preview(e, data);
}

function show_preview(e, data) {
    let image = new Image();
    image.id = id;
    image.src = data;
    image.onload = function () {
        if (document.getElementById(id))
            return;

        let css = [];
        css.push("width:" + image.width + "px;");
        css.push("height:" + image.height + "px;");
        css.push("border:1px solod gray;");
        css.push("box-shadow:0px 0px 8px 4px rgba(0,0,0,0.4);");
        css.push("position:fixed;");
        css.push("z-index:10001;");
        let top = e.clientY + 12;
        let left = e.clientX + 12;
        if (window.innerHeight - e.clientY - 24 < image.height) {
            top = window.innerHeight - image.height - 12;
        }
        css.push("top:" + top + "px;");
        css.push("left:" + left + "px;");
        image.style.cssText = css.join("");
        document.body.appendChild(image);
    };
}

function close_preview() {
    while (image = document.getElementById(id)) {
        document.body.removeChild(image);
    }
}

