function generate() {
  let lut = document.querySelector("#lut");
  if (lut.value.length < 62 || lut.value.length > 70) {
    alert("Invalid LUT!");
    return;
  }  

  let len = document.querySelector("#len");
  if (len.value > 32) {
    alert("Too large! Should be less than 32!");
    return;
  }
  
  let buf = [];
  for (let i = 0; i < len.value; i++) {
    let index = Math.floor(Math.random() * (lut.value.length + 1));
    console.log(index);
    buf.push(lut.value[index]);
  }
    
  let result = buf.join("");
  alert(result);
}
