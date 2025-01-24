const onload = async () => {
    const canvas = document.querySelector("#c");
    const width = 400;
    const height = 300;
    const block_size = 10;

    const constraints = {
        video: true,
        faceingMode: {exact: "user"},
        width: width,
        height: height,
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const video = document.querySelector("#v");
    video.srcObject = stream;
    video.play();

    const ctx = canvas.getContext("2d");

    const draw_rounded_rect = (row, col, color) => {
        const x = col * block_size + 1;
        const y = row * block_size + 1;
        const radius = 2;
        const width = block_size - 2;
        const height = block_size - 2;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(x, y + radius);
        ctx.arcTo(x, y + height, x + radius, y + height, radius);
        ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
        ctx.arcTo(x + width, y, x + width - radius, y, radius);
        ctx.arcTo(x, y, x, y + radius, radius);
        ctx.fill();
    };

    const draw = () => {
        ctx.drawImage(video, 0, 0, width, height);
        const data = ctx.getImageData(0, 0, width, height).data;

        ctx.fillStyle = "#1D2125";
        ctx.fillRect(0, 0, width, height);

        for (let row = 0; row < height / block_size; row++) {
            for (let col = 0; col < width / block_size; col++) {
                let total = 0;
                const index = (row * 4 * width * block_size) + col * (width / block_size);
                for (let i = 0; i < block_size; i++) {
                    /*
                       col0     col1      col2
                       =======, ========, ========, 
                     i
                    |0 0......, 40......, 80......, ...
                  r |1 1600..., 1640...., 1680...., ...
                  o |2 
                  w |.
                  0 |.
                    |.
                    
                    |0 16000.., 16040.., 16080.., ...
                  r |1 17600.., 17640.., 17680.., ...
                  o |2
                  w |.
                  1 |.
                    |.
                    */
                    const start = index + i * 4 * width;
                    const slice = data.slice(start, start + 4 * block_size);
                    for (let i = 0; i < slice.length; i += 4) {
                        const pixel = slice.slice(i, i + 4);
                        // convert to grayscale
                        total += ((19 * pixel[0]) >> 8) + ((183 * pixel[1]) >> 8) + ((53 * pixel[2]) >> 8);
                    }
                }
                // calculate the average grayscale values in a 10 x 10 block
                const avg = total / (block_size * block_size);
                let color;
                if (avg < 52) {
                    color = "#252A2F";
                } else if (53 <= avg && avg < 103) {
                    color = "#1E4A35";
                } else if (103 <= avg && avg < 154) {
                    color = "#136C3C";
                } else if (154 <= avg && avg < 205) {
                    color = "#329B48";
                } else {
                    color = "#36B768";
                }
                draw_rounded_rect(row, col, color);
            }
        }
        requestAnimationFrame(draw);
    };
    draw();
};

window.addEventListener("DOMContentLoaded", onload);
