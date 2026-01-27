analyzeBtn.addEventListener("click", () => {
  loadingIndicator.classList.add("active");
  previewContainer.style.display = "none";

  setTimeout(() => {
    loadingIndicator.classList.remove("active");
    resultsSection.classList.add("active");
    previewContainer.style.display = "block";
    animatePropertyBars();
  }, 2500);
});

// /* =====================================================
//    SMALL HELPER (Safe Binding)
// ===================================================== */
// function bind(id, value) {
//   const el = document.getElementById(id);
//   if (el) el.textContent = value ?? "N/A";
// }

// /* =====================================================
//    MEDICINAL RESULT HANDLER
// ===================================================== */
// function populateAllResults(data) {

//   /* ---------- TOGGLE UI ---------- */
//   medicinalResult.style.display = "block";
//   nonMedicinalResult.style.display = "none";

//   /* ---------- IDENTIFICATION ---------- */
//   bind("scientificName", data.identification.scientific_name);
//   bind("commonName", data.identification.common_name);
//   bind("confidence", `${data.identification.confidence}%`);

//   /* ---------- AI MODEL INFO ---------- */
//   bind("featureExtractor", data.ai_model.feature_extractor);
//   bind("classifier", data.ai_model.classifier);
//   bind("featureVector", data.ai_model.feature_vector_size);
//   bind("inferenceTime", data.ai_model.inference_time);
//   bind("modelAccuracy", `${data.ai_model.accuracy}%`);

//   /* ---------- MORPHOLOGY ---------- */
//   bind("area", data.morphology.area);
//   bind("perimeter", data.morphology.perimeter);
//   bind("aspectRatio", data.morphology.aspect_ratio);
//   bind("circularity", data.morphology.circularity);
//   bind("symmetry", data.morphology.symmetry);

//   /* ---------- COLOR & TEXTURE ---------- */
//   bind("chlorophyll", data.color_texture.chlorophyll_index);
//   bind("healthScore", data.color_texture.health_score);
//   bind("smoothness", data.color_texture.smoothness);
//   bind("veinProminence", data.color_texture.vein_prominence);
//   bind("diseaseSpots", data.color_texture.disease_spots);

//   /* ---------- QUALITY ---------- */
//   bind("overallQuality", data.quality.overall);
//   bind("freshness", data.quality.freshness);
//   bind("contamination", data.quality.contamination);
//   bind("damage", data.quality.damage);

/* ---------- MEDICINAL PROPERTIES (DYNAMIC & SAFE) ---------- */
// renderMedicinalProperties(data.medicinal_properties);


// function renderMedicinalProperties(properties) {
//   const list = document.querySelector(".property-list");

//   // Clear previous data
//   list.innerHTML = "";

//   // Defensive check
//   if (!Array.isArray(properties) || properties.length === 0) {
//     list.innerHTML = `
//       <li class="property-item no-data">
//         <span class="property-name">No medicinal properties identified</span>
//       </li>
//     `;
//     return;
//   }

//   // Render n number of properties
//   properties.forEach(property => {
//     const li = document.createElement("li");
//     li.className = "property-item";

//     li.innerHTML = `
//       <span class="property-name">${property}</span>
//     `;

//     list.appendChild(li);
//   });
// }

// /* =====================================================
//    NON-MEDICINAL RESULT HANDLER
// ===================================================== */
// function showNonMedicinalResult(data) {
//   const nm = data.non_medicinal;

//   medicinalResult.style.display = "none";
//   nonMedicinalResult.style.display = "block";

//   /* ---------- ANALYSIS SUMMARY ---------- */
//   bind("nmClassification", nm.analysis_summary.classification);
//   bind("nmConfidenceLevel", nm.analysis_summary.confidence_level);
//   bind("nmModelDecision", nm.analysis_summary.model_decision);
//   bind("nmPossibleCause", nm.analysis_summary.possible_cause);

//   /* ---------- IMAGE QUALITY ---------- */
//   bind("nmLeafVisibility", nm.image_quality.leaf_visibility);
//   bind("nmBackgroundNoise", nm.image_quality.background_noise);
//   bind("nmLighting", nm.image_quality.lighting);
//   bind("nmBlur", nm.image_quality.blur);

//   /* ---------- AI MODEL DECISION ---------- */
//   bind("nmFeatureExtractor", nm.model_decision.feature_extractor);
//   bind("nmClassifier", nm.model_decision.classifier);
//   bind("nmDecisionStrategy", nm.model_decision.decision_strategy);
//   bind("nmThreshold", nm.model_decision.threshold);
// }

// /* =====================================================
//    ANALYZE BUTTON HANDLER
// ===================================================== */
// analyzeBtn.addEventListener("click", () => {
//   analyzeLeaf();
// });

// /* =====================================================
//    MAIN BACKEND CALL
// ===================================================== */
// async function analyzeLeaf() {
//   loadingIndicator.classList.add("active");
//   resultsSection.classList.remove("active");
//   previewContainer.style.display = "none";

//   try {
//     const response = await fetch("/api/analyze-leaf/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ image: previewImage.src })
//     });

//     const data = await response.json();

//     loadingIndicator.classList.remove("active");
//     resultsSection.classList.add("active");
//     previewContainer.style.display = "block";

//     if (!data.success || !data.is_medicinal) {
//       showNonMedicinalResult(data);
//       return;
//     }

//     populateAllResults(data);

//   } catch (error) {
//     console.error("Analysis error:", error);

//     loadingIndicator.classList.remove("active");
//     showNonMedicinalResult({
//       non_medicinal: {
//         analysis_summary: {
//           classification: "Error",
//           confidence_level: "N/A",
//           model_decision: "Failed",
//           possible_cause: "Server not reachable"
//         },
//         image_quality: {
//           leaf_visibility: "Unknown",
//           background_noise: "Unknown",
//           lighting: "Unknown",
//           blur: "Unknown"
//         },
//         model_decision: {
//           feature_extractor: "ResNet-50",
//           classifier: "SVM",
//           decision_strategy: "Unavailable",
//           threshold: "≥ 70%"
//         }
//       }
//     });
//   }
// }

// {
//   "success": true,
//   "is_medicinal": true,

//   "identification": {
//     "scientific_name": "Ocimum sanctum",
//     "common_name": "Holy Basil (Tulsi)",
//     "confidence": 94.2
//   },

//   "ai_model": {
//     "feature_extractor": "ResNet-50",
//     "classifier": "SVM",
//     "feature_vector_size": 2048,
//     "inference_time": "120 ms",
//     "accuracy": 92.4
//   },

//   "morphology": {
//     "area": "1578 px²",
//     "perimeter": "181 px",
//     "aspect_ratio": 1.65,
//     "circularity": 0.69,
//     "symmetry": 0.81
//   },

//   "color_texture": {
//     "chlorophyll_index": 0.87,
//     "health_score": "89%",
//     "smoothness": "70%",
//     "vein_prominence": "Moderate",
//     "disease_spots": "Not Detected"
//   },

//   "quality": {
//     "overall": "Excellent",
//     "freshness": "High",
//     "contamination": "None Detected",
//     "damage": "< 5%"
//   },

//   "medicinal_properties": [
//     "Anti-inflammatory",
//     "Antioxidant",
//     "Antimicrobial",
//     "Immunomodulatory"
//   ]
// }



// {
//   "success": true,
//   "is_medicinal": false,

//   "non_medicinal": {
//     "analysis_summary": {
//       "classification": "Non-Medicinal / Unknown",
//       "confidence_level": "Below Threshold (< 60%)",
//       "model_decision": "Rejected",
//       "possible_cause": "Out of trained classes"
//     },

//     "image_quality": {
//       "leaf_visibility": "Detected",
//       "background_noise": "High",
//       "lighting": "Uneven",
//       "blur": "Moderate"
//     },

//     "model_decision": {
//       "feature_extractor": "ResNet-50",
//       "classifier": "SVM",
//       "decision_strategy": "Confidence Thresholding",
//       "threshold": "≥ 70%"
//     }
//   }
// }
