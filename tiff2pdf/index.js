/**
 * @param {Blob} blob - pdf
 * @returns {Promise<string>} - url
 **/
const to_dataurl = (blob) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });
};

/**
 * @param {string} filename - file name
 * @returns {string} - file stem
 **/
const removeExtension = (filename) => {
    if (typeof filename !== "string")
        throw new TypeError("Filename must be a string");

    const lastDotIndex = filename.lastIndexOf(".");
    // Keep hidden files like ".bashrc" intact, and handle no-dot cases
    return lastDotIndex > 0 ? filename.slice(0, lastDotIndex) : filename;
};

const onload = async () => {
    const dropArea = document.getElementById("dropArea");

    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropArea.classList.add("dragover");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("dragover");
    });

    dropArea.addEventListener("drop", async (e) => {
        e.preventDefault();
        dropArea.classList.remove("dragover");

        const files = e.dataTransfer.files;

        if (files.length === 0) {
            return;
        }

        const file = files[0];

        // TIFF 判定 (拡張子 + MIME)
        const isTiff =
            file.type === "image/tiff" ||
            file.name.toLowerCase().endsWith(".tif") ||
            file.name.toLowerCase().endsWith(".tiff");

        if (!isTiff) {
            alert("TIFFファイルのみ対応しています。");
            return;
        }

        try {
            // ArrayBuffer取得
            const buffer = await file.arrayBuffer();

            // Uint8Arrayへ変換
            const uint8Array = new Uint8Array(buffer);

            // console.log("Uint8Array:", uint8Array);
            // console.log("サイズ:", uint8Array.length, "bytes");

            // ✅ ここでPDF変換処理を呼び出し可能
            // convertToPDF(uint8Array);
            const pdf = await window.generate_pdf(uint8Array);
            // console.log(pdf);
            const blob = new Blob([pdf], { type: "application/pdf" });
            const url = await to_dataurl(blob);
            const a = document.createElement("a");
            a.download = `${removeExtension(file.name)}.pdf`;
            a.href = url;
            a.click();
            a.remove();
        } catch (err) {
            console.error("ファイル読み込みエラー:", err);
            alert("ファイル読み込みに失敗しました");
        }
    });
};

window.addEventListener("load", onload);
