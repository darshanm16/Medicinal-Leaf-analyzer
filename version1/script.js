const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const cameraBtn = document.getElementById("cameraBtn");
const cameraInput = document.getElementById("cameraInput");
const previewContainer = document.getElementById("previewContainer");
const previewImage = document.getElementById("previewImage");
const analyzeBtn = document.getElementById("analyzeBtn");
const resetBtn = document.getElementById("resetBtn");
const loadingIndicator = document.getElementById("loadingIndicator");
const resultsSection = document.getElementById("resultsSection");

const medicinalResult = document.getElementById("medicinalResult");
const nonMedicinalResult = document.getElementById("nonMedicinalResult");


uploadArea.addEventListener("click", () => fileInput.click());

cameraBtn.addEventListener("click", () => cameraInput.click());

cameraInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    handleImageUpload(file);
  }
});

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    handleImageUpload(file);
  }
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    handleImageUpload(file);
  }
});

function handleImageUpload(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    try { localStorage.setItem('uploadedImage', e.target.result); } catch (err) { }
    previewContainer.classList.add("active");
    resultsSection.classList.remove("active");
  };
  reader.readAsDataURL(file);
}

resetBtn.addEventListener("click", () => {
  fileInput.value = "";
  cameraInput.value = "";
  previewContainer.classList.remove("active");
  resultsSection.classList.remove("active");
  previewImage.src = "";
  previewImage.removeAttribute('src');
  try { localStorage.removeItem('uploadedImage'); } catch (err) { }
  previewContainer.style.display = 'none';
});
