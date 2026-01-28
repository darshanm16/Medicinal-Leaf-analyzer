let stream = null;

function switchTab(tabName) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  event.target.classList.add("active");
  document.getElementById(`${tabName}-tab`).classList.add("active");
}

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });

    const video = document.getElementById("video");
    video.srcObject = stream;

    // document.getElementById('upload-area').classList.add('hidden');

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        const video = document.getElementById("video");
        const placeholder = document.getElementById("upload-placeholder");
        const preview = document.getElementById("preview-image");

        video.srcObject = stream;
        video.classList.remove("hidden");
        placeholder.classList.add("hidden");
        preview.classList.add("hidden");

        document.getElementById("capture-btn").classList.remove("hidden");
        document.getElementById("close-camera-btn").classList.remove("hidden");
      } catch (err) {
        alert("Camera access denied: " + err.message);
      }
    }

    document.getElementById("preview-image").classList.add("hidden");
    video.classList.remove("hidden");
    document.getElementById("capture-btn").classList.remove("hidden");
    document.getElementById("close-camera-btn").classList.remove("hidden");
  } catch (err) {
    alert("Camera access denied or not available: " + err.message);
  }
}

function capturePhoto() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  const imageData = canvas.toDataURL("image/jpeg");

  closeCamera();
  displayImage(imageData);

  canvas.toBlob((blob) => {
    const file = new File([blob], "leaf.jpg", { type: "image/jpeg" });
    predictLeaf(file);
  }, "image/jpeg");
}

function closeCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  document.getElementById("video").classList.add("hidden");
  document.getElementById("capture-btn").classList.add("hidden");
  document.getElementById("close-camera-btn").classList.add("hidden");
  document.getElementById("upload-area").classList.remove("hidden");
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      displayImage(e.target.result);
      predictLeaf(file);
    };
    reader.readAsDataURL(file);
  }
}

function displayImage(src) {
  const preview = document.getElementById("preview-image");
  const placeholder = document.getElementById("upload-placeholder");
  const video = document.getElementById("video");

  preview.src = src;
  preview.classList.remove("hidden");
  placeholder.classList.add("hidden");
  video.classList.add("hidden");
}

async function predictLeaf(file) {
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("results").classList.add("hidden");
  document.getElementById("empty-state").classList.add("hidden");

  // Simulate AI processing
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  // // Random prediction
  // const isMedicinal = Math.random() > 0.3;
  // const prediction = isMedicinal
  //     ? medicinalLeaves[Math.floor(Math.random() * medicinalLeaves.length)]
  //     : nonMedicinalLeaves[Math.floor(Math.random() * nonMedicinalLeaves.length)];

  // displayResults(prediction);

  const formData = new FormData();
  formData.append("image", file);

  fetch("https://saporous-subnacreous-gary.ngrok-free.dev/api/predict/", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      displayResults(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while processing the image.");
    })
    .finally(() => {
      document.getElementById("loading").classList.add("hidden");
    });

  // document.getElementById("loading").classList.add("hidden");
}

function displayResults(prediction) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.classList.remove("hidden");

  let html = `
                <div class="status-badge ${prediction.prediction == "Healthy_Leaf" ? "medicinal" : "non-medicinal"}">
                    <span style="font-size: 1.25rem;">${prediction.prediction == "Healthy_Leaf" ? "✓" : "⚠"}</span>
                    <span style="font-weight: 600;">${prediction.prediction == "Healthy_Leaf" ? "Healthy Leaf Detected" : "Diseased Leaf Detected"}</span>
                </div>

                <div>
                    <h3 style="font-size: 1.125rem; font-weight: 700;">${prediction.info.Name}</h3>
                    <p style="font-style: italic; color: #6b7280; font-size: 0.875rem;">${prediction.info.ScientificName}</p>
                    <div style="margin-top: 0.75rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; margin-bottom: 0.25rem;">
                            <span style="color: #6b7280;">Confidence:</span>
                            <span style="font-weight: 600;">${prediction.confidence}%</span>
                        </div>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${prediction.confidence}%"></div>
                        </div>
                    </div>
                </div>
            `;

  if (prediction.prediction == "Healthy_Leaf") {
    html += `
                    <div style="margin-top: 1rem;">
                        <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Medicinal Properties</h4>

                        <div class="properties">
                          ${prediction.info.MedicalProperties.split(",")
                            .map(
                              (prop) =>
                                `<span class="tag">${prop.trim()}</span>`,
                            )
                            .join("")}
                        </div>

                    </div>

                    <div style="margin-top: 1rem;">
                        <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Medical Uses</h4>

                        <ul>
                          ${prediction.info.Uses.split(",")
                            .map((use) => `<li>${use.trim()}</li>`)
                            .join("")}
                        </ul>

                    </div>

                    <div style="margin-top: 1rem;">
                        <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Leaf Features</h4>
                        <div class="feature-grid">
                            <div><strong>Overall Health:</strong> ${prediction.features.OverallHealth}</div>
                            <div><strong>Leaf Color:</strong> ${prediction.features.LeafColor}</div>
                            <div><strong>Chlorophyll Level:</strong> ${prediction.features.ChlorophyllLevel}</div>
                            <div><strong>Texture:</strong> ${prediction.features.SurfaceTexture}</div>
                            <div><strong>Vein Structure:</strong> ${prediction.features.VeinStructure}</div>
                        </div>
                    </div>

                    <div style="margin-top: 1rem;">
                        <div class="info-box blue">
                            <h4 style="font-weight: 600; margin-bottom: 0.25rem; font-size: 0.875rem;">Recommended Dosage</h4>

                            <div style="font-size: 0.75rem;">
                              ${prediction.info.Dosage.split(",")
                                .map((dose) => `<p>${dose.trim()}</p>`)
                                .join("")}
                            </div>

                        </div>
                        <div class="info-box red">
                            <h4 style="font-weight: 600; margin-bottom: 0.25rem; font-size: 0.875rem;">Precautions</h4>

                            <div style="font-size: 0.75rem;">
                              ${prediction.info.Precautions.split(",")
                                .map((p) => `<p>${p.trim()}</p>`)
                                .join("")}
                            </div>

                        </div>
                    </div>
                `;
  } else {
    html += `
                  <div style="margin-top: 1rem;">
                      <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Recommended Medicinal Alternatives</h4>

                      <ul style="list-style: none; padding: 0;">
                        ${prediction.info.Suggestions.split(",")
                          .map(
                            (suggestion) =>
                              `<li style="padding: 0.5rem; border-left: 4px solid #16a34a; margin: 0.5rem 0; border-radius: 0.25rem;">
                                  ${suggestion.trim()}
                                 </li>`,
                          )
                          .join("")}
                      </ul>

                  </div>
              `;
  }

  resultsDiv.innerHTML = html;
}

// Initialize Charts
window.addEventListener("load", () => {
  // Accuracy Chart
  // new Chart(document.getElementById("accuracyChart"), {
  //   type: "line",
  //   data: {
  //     labels: [1, 5, 10, 15, 20, 25, 30],
  //     datasets: [
  //       {
  //         label: "Training",
  //         data: [65, 78, 85, 90, 93, 95, 96],
  //         borderColor: "#10b981",
  //         tension: 0.4,
  //       },
  //       {
  //         label: "Validation",
  //         data: [62, 75, 83, 88, 91, 93, 94],
  //         borderColor: "#3b82f6",
  //         tension: 0.4,
  //       },
  //     ],
  //   },
  //   options: {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     plugins: { legend: { position: "top" } },
  //   },
  // });
  new Chart(document.getElementById("accuracyChart"), {
    type: "line",
    data: {
      datasets: [
        {
          label: "Train",
          data: [
            { x: 0.0, y: 1.0 },
            { x: 0.053, y: 1.0 },
            { x: 0.105, y: 1.0 },
            { x: 0.158, y: 1.0 },
            { x: 0.211, y: 1.0 },
            { x: 0.263, y: 1.0 },
            { x: 0.316, y: 1.0 },
            { x: 0.368, y: 1.0 },
            { x: 0.421, y: 1.0 },
            { x: 0.474, y: 1.0 },
            { x: 0.526, y: 1.0 },
            { x: 0.579, y: 1.0 },
            { x: 0.632, y: 1.0 },
            { x: 0.684, y: 1.0 },
            { x: 0.737, y: 1.0 },
            { x: 0.789, y: 1.0 },
            { x: 0.842, y: 1.0 },
            { x: 0.895, y: 1.0 },
            { x: 0.947, y: 1.0 },
            { x: 1.0, y: 1.0 },
          ],
          borderColor: "#10b981",
          tension: 0.4,
          fill: false,
          showLine: true, // ensures points are connected
        },
        {
          label: "Validation",
          data: [
            { x: 0.0, y: 0.49 },
            { x: 0.053, y: 0.93 },
            { x: 0.105, y: 0.965 },
            { x: 0.158, y: 0.987 },
            { x: 0.211, y: 0.992 },
            { x: 0.263, y: 0.996 },
            { x: 0.316, y: 0.996 },
            { x: 0.368, y: 0.997 },
            { x: 0.421, y: 1.0 },
            { x: 0.474, y: 1.0 },
            { x: 0.526, y: 1.0 },
            { x: 0.579, y: 1.0 },
            { x: 0.632, y: 1.0 },
            { x: 0.684, y: 1.0 },
            { x: 0.737, y: 1.0 },
            { x: 0.789, y: 1.0 },
            { x: 0.842, y: 1.0 },
            { x: 0.895, y: 1.0 },
            { x: 0.947, y: 1.0 },
            { x: 1.0, y: 1.0 },
          ],
          borderColor: "#3b82f6",
          tension: 0.4,
          fill: false,
          showLine: true,
        },
        {
          label: "Test",
          data: [
            { x: 0.0, y: 0.335 },
            { x: 0.053, y: 0.937 },
            { x: 0.105, y: 0.978 },
            { x: 0.158, y: 0.983 },
            { x: 0.211, y: 0.99 },
            { x: 0.263, y: 0.994 },
            { x: 0.316, y: 0.996 },
            { x: 0.368, y: 0.997 },
            { x: 0.421, y: 0.997 },
            { x: 0.474, y: 0.997 },
            { x: 0.526, y: 0.997 },
            { x: 0.579, y: 1.0 },
            { x: 0.632, y: 1.0 },
            { x: 0.684, y: 1.0 },
            { x: 0.737, y: 1.0 },
            { x: 0.789, y: 1.0 },
            { x: 0.842, y: 1.0 },
            { x: 0.895, y: 1.0 },
            { x: 0.947, y: 1.0 },
            { x: 1.0, y: 1.0 },
          ],
          borderColor: "#f59e0b",
          tension: 0.4,
          fill: false,
          showLine: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "top" } },
      scales: {
        x: {
          type: "linear",
          title: { display: true, text: "False Positive Rate" },
        },
        y: {
          min: 0.2,
          max: 1.2,
          title: { display: true, text: "True Positive Rate" },
        },
      },
    },
  });

  // Class Performance Chart
  // new Chart(document.getElementById("classChart"), {
  //   type: "bar",
  //   data: {
  //     labels: ["Healthy Leaf", "Unhealthy Leaf"],
  //     datasets: [
  //       {
  //         label: "Precision",
  //         data: [98, 89],
  //         backgroundColor: "#10b981",
  //       },
  //       {
  //         label: "Recall",
  //         data: [89, 98],
  //         backgroundColor: "#3b82f6",
  //       },
  //       {
  //         label: "F1-Score",
  //         data: [93, 93],
  //         backgroundColor: "#8b5cf6",
  //       },
  //     ],
  //   },
  //   options: {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     plugins: { legend: { position: "top" } },
  //   },
  // });

  // Class Performance Chart
new Chart(document.getElementById("classChart"), {
  type: "bar",
  data: {
    labels: ["Healthy Leaf", "Unhealthy Leaf"],
    datasets: [
      {
        label: "Precision",
        data: [98, 89],
        backgroundColor: "#10b981",
      },
      {
        label: "Recall",
        data: [89, 98],
        backgroundColor: "#3b82f6",
      },
      {
        label: "F1-Score",
        data: [93, 93],
        backgroundColor: "#8b5cf6",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        min: 75,
        max: 100,
        ticks: {
          stepSize: 5,
          callback: (value) => value + "%"
        },
        title: {
          display: true,
          text: "Performance (%)",
        },
      },
    },
  },
});


  // Confusion Matrix Chart
  new Chart(document.getElementById("confusionChart"), {
    type: "doughnut",
    data: {
      labels: [
        "True Positive",
        "True Negative",
        "False Positive",
        "False Negative",
      ],
      datasets: [
        {
          data: [703, 729, 86, 16],
          backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
  });

  // Loss Chart
  new Chart(document.getElementById("lossChart"), {
    type: "bar",
    data: {
      labels: ["ResNet + SVM", "ResNet + XGBoost", "EfficientNet + XGBoost"],
      datasets: [
        {
          label: "Accuracy",
          data: [93.4, 87.6, 92],
          backgroundColor: "#f59e0b",
        },
        {
          label: "Precision",
          data: [94, 87, 92],
          backgroundColor: "#10b981",
        },
        {
          label: "Recall",
          data: [93, 87, 90],
          backgroundColor: "#3b82f6",
        },
        {
          label: "F1-Score",
          data: [93, 87, 91],
          backgroundColor: "#8b5cf6",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
      },
      scales: {
        y: {
          min: 75,
          max: 100,
          ticks: {
            stepSize: 5,
            callback: (value) => value + "%",
          },
          title: {
            display: true,
            text: "Performance (%)",
          },
        },
      },
    },
  });
});
