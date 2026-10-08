import { estimate, projects, sortProducts } from "./project-estimates.js";
I;
const root = document.querySelector("#root");
const money = (value) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );

root.innerHTML = `
  <header class="topbar"><div class="topbar-inner">
    <a class="brand" href="#" aria-label="Benchmark DIY home"><span class="brand-mark" aria-hidden="true">B</span><span>Benchmark DIY<small>Plan it before you build it</small></span></a>
    <div class="top-note"><span class="live-dot" aria-hidden="true"></span>Practical estimates for UK projects</div>
  </div></header>
  <main class="page">
    <section class="intro" aria-labelledby="page-title">
      <div><p class="eyebrow">The practical project planner</p><h1 id="page-title">Know what to buy before you begin.</h1><p class="intro-copy">A clear, rough-cut list of materials and starter tools for the jobs that are easier when you measure twice.</p></div>
        <div class="intro-aside"><strong>14 popular DIY builds</strong>Set your measurements. Get a useful shopping plan.</div>
    </section>
    <div class="layout">
      <form class="panel form-panel" id="estimator-form" novalidate>
        <div class="section-heading"><span class="step">01</span><div><h2>Set up your project</h2><p>Choose a job and enter your measurements.</p></div></div>
        <div class="field"><label for="project">Project type</label><div class="select-wrap"><select id="project" name="project" data-testid="select-project">
          <optgroup label="Garden &amp; Outdoor Structures">
            <option value="logstore">Garden Log Store</option>
            <option value="raisedbed">Raised Veg Planter / Garden Bed</option>
            <option value="bin">Wheelie Bin Enclosure</option>
            <option value="decking">Timber Decking Module</option>
            <option value="pergola">Pergola / Lean-To</option>
            <option value="flyscreen">Window Fly Screen</option>
          </optgroup>
          <optgroup label="Indoor Storage &amp; Furniture">
            <option value="shelving">Alcove / Wall Shelving Unit</option>
            <option value="workbench">Timber Workbench / Garage Shelving</option>
            <option value="radiator">Radiator Cover Frame</option>
            <option value="lock">Door Cylinder Lock Change</option>
          </optgroup>
          <optgroup label="Trim &amp; Finishing">
            <option value="plywood">Plywood Surface Prep &amp; Painting</option>
            <option value="skirting">Skirting Board Fitting</option>
            <option value="laminate">Laminate Flooring Installation</option>
          </optgroup>
          <optgroup label="Custom">
            <option value="custom">Custom Timber Build (Other)</option>
          </optgroup>
        </select></div></div>
        <div id="project-fields" class="measure-grid" aria-live="polite"></div>
        <hr class="divider">
        <fieldset style="border:0;padding:0;margin:0">
          <legend class="group-label">Starter tool budget</legend>
          <div class="budget-options">
            <div class="budget-choice"><input type="radio" name="budget" id="budget-basic" value="basic" checked><label for="budget-basic"><span class="budget-name">I need basic/budget tools</span><span class="budget-detail">Value DIY tools for occasional use</span></label></div>
            <div class="budget-choice"><input type="radio" name="budget" id="budget-pro" value="pro"><label for="budget-pro"><span class="budget-name">Recommend quality brand tools (Stanley/DeWalt)</span><span class="budget-detail">More robust branded tool allowance</span></label></div>
          </div>
        </fieldset>
        <button class="calculate-btn" type="submit" data-testid="button-calculate">Calculate Project Kit</button>
        <p id="form-error" class="form-error" role="alert" hidden></p>
      </form>
      <section class="results-column" aria-label="Project estimate">
        <div class="panel welcome-panel" id="welcome">
          <p class="eyebrow">Your project, in focus</p><h2>A plan that starts with your measurements.</h2>
          <p>We’ll turn dimensions into a practical materials list, then add a starter-tool range that matches your budget choice.</p>
          <div class="mini-steps"><span>01 Measure</span><span>02 Estimate</span><span>03 Get building</span></div>
          <p class="empty-note">No estimate yet. Complete the form to get started.</p>
        </div>
        <div class="panel results-panel" id="results" aria-live="polite"></div>
      </section>
    </div>
    <section class="tips-section panel" aria-labelledby="tips-title">
      <div class="tips-heading"><p class="eyebrow">Measure well. Buy with confidence.</p><h2 id="tips-title">Project Tips &amp; FAQ</h2><p>A practical guide to measuring timber and choosing materials that suit the job.</p></div>
      <div class="tips-grid">
        <article class="tip-card"><h3>How do I measure before buying?</h3><p>Measure an opening at the top, middle, and bottom; use the smallest reading for a fitted screen. For a door cylinder, measure from the retaining-screw centre to each end. For timber, record whether dimensions are internal or external. Keep units consistent: one metre equals 1,000 millimetres.</p></article>
        <article class="tip-card"><h3>How much extra timber should I order?</h3><p>Sketch each piece and make a cut list to see how stock lengths can be shared. Allow for saw kerfs, joints, end trimming, knots, and unusable offcuts. The model’s waste allowance is modest; complex designs or uneven ground may need more. Check actual planed sizes too: finished boards are often smaller than nominal dimensions.</p></article>
        <article class="tip-card"><h3>Which fixings work outdoors?</h3><p>Choose exterior fixings compatible with the timber treatment. Hot-dip galvanised or quality-coated screws suit many garden builds; stainless steel can be preferable in coastal or persistently damp locations. Avoid ordinary indoor screws outdoors because moisture can cause corrosion and staining. Check manufacturer guidance for treated wood, and choose screw lengths to suit each joint.</p></article>
        <article class="tip-card"><h3>How do I protect timber and plywood?</h3><p>Treat cut ends, drilled holes, and end grain with a compatible outdoor product, and keep timber clear of standing water. For plywood, remove sanding dust, seal exposed edges if needed, and use primer and paint labelled for plywood. Check labelled coverage and drying instructions.</p></article>
        <article class="tip-card"><h3>Are these estimates a final cut list?</h3><p>No. These are planning estimates, not a structural design, lock-fit guarantee, live price check, or professional building advice. Verify dimensions and stock availability on site before buying. For work affecting structure, fire safety, or security, consult a qualified professional. Delivery, taxes, existing tools, material condition, and local prices can change the final budget.</p></article>
      </div>
    </section>
    <footer class="footer"><p><strong>Planning note</strong><br>Indicative DIY material estimates only — not structural or building advice. Delivery, tax, existing tools and local prices can vary.</p><p>As an Amazon Associate I earn from qualifying purchases.</p></footer>
  </main>`;

const form = document.querySelector("#estimator-form");
const projectSelect = document.querySelector("#project");
const fieldsBox = document.querySelector("#project-fields");
const resultsBox = document.querySelector("#results");
const errorBox = document.querySelector("#form-error");
let currentResult = null;
let currentEstimateInputs = null;
let currentBudget = "basic";

function measurementInput(key) {
  return document.getElementById(`measure-${key}`);
}

function renderFields() {
  const project = projects[projectSelect.value];
  const customDescription =
    projectSelect.value === "custom"
      ? `
    <div class="field custom-project-field">
      <label for="custom-project-description">What are you building?</label>
      <input id="custom-project-description" name="projectDescription" type="text" maxlength="80" placeholder="e.g. Wooden garden bench or shelving unit" autocomplete="off" required>
      <small>This name will appear in your estimate and copied shopping list.</small>
    </div>`
      : "";
  fieldsBox.innerHTML = `${customDescription}${project.fields
    .map(
      (field) => `
    <div class="field">
      <label for="measure-${field.key}">${field.label}</label>
      <div class="unit-input"><input id="measure-${field.key}" name="${field.key}" type="number" min="${field.min}" ${field.max ? `max="${field.max}"` : ""} step="${field.step}" value="${field.value}" required inputmode="decimal" data-testid="input-${field.key}"><span>${field.unit}</span></div>
      <small>${field.hint}</small>
    </div>`,
    )
    .join("")}`;
  resultsBox.classList.remove("show");
  document.querySelector("#welcome").style.display = "";
  errorBox.hidden = true;
  currentResult = null;
  currentEstimateInputs = null;
}

function inputs() {
  const values = Object.fromEntries(
    projects[projectSelect.value].fields.map((field) => [
      field.key,
      parseFloat(measurementInput(field.key).value),
    ]),
  );
  if (projectSelect.value === "custom")
    values.projectDescription = document
      .querySelector("#custom-project-description")
      .value.trim();
  return values;
}
function productMarkup([name, detail, symbol], index, budget) {
  const toolOptions = {
    Saw: {
      basic: [
        "Budget compound mitre saw",
        "Value saw for occasional DIY cross-cuts.",
      ],
      pro: [
        "DeWalt compound mitre saw",
        "Quality-brand option for repeatable cross-cuts.",
      ],
    },
    Measure: {
      basic: [
        "Value tape measure & square",
        "Budget measuring tools for everyday set-out.",
      ],
      pro: [
        "Stanley FatMax tape measure & square",
        "Quality-brand measuring tools for regular use.",
      ],
    },
    Driver: {
      basic: [
        "Budget drill/driver & bit set",
        "Value cordless drill/driver for occasional projects.",
      ],
      pro: [
        "DeWalt drill/driver & bit set",
        "Quality-brand drill/driver and bits for regular use.",
      ],
    },
    Sander: {
      basic: [
        "Budget random-orbit sander",
        "Value sander for occasional panel preparation.",
      ],
      pro: [
        "DeWalt random-orbit sander",
        "Quality-brand sander for repeat projects.",
      ],
    },
    FloorCutter: {
      basic: [
        "Budget laminate flooring cutter",
        "Value hand cutter for straightforward flooring layouts.",
      ],
      pro: [
        "DeWalt jigsaw and flooring blade",
        "Quality-brand jigsaw for detailed cuts and notches.",
      ],
    },
    Screwdriver: {
      basic: [
        "Value manual screwdriver set",
        "Budget hand tools for removing and refitting hardware.",
      ],
      pro: [
        "Stanley screwdriver set",
        "Quality-brand hand tools for removing and refitting hardware.",
      ],
    },
  };
  const [productName, productDetail] = toolOptions[name]?.[budget] ?? [
    name,
    detail,
  ];
  return `<article class="product-card" data-testid="card-product-${index}"><span class="product-symbol" aria-hidden="true">${symbol}</span><div class="product-copy"><strong>${productName}</strong><span>${productDetail}</span></div><a class="amazon-btn" href="https://www.amazon.co.uk/dp/ASIN_HERE?tag=YOUR_TAG-21" target="_blank" rel="nofollow noopener">View on Amazon →</a></article>`;
}

function renderAssemblySketch(sketch) {
  if (!sketch) return "";
  const dimension = (value) =>
    `${Number(value).toLocaleString("en-GB", { maximumFractionDigits: 2 })} m`;
  const topLabel = sketch.roofed
    ? "Rafters"
    : sketch.height < 0.1
      ? "Frame rails"
      : "Top supports";
  return `
    <section class="assembly-panel" aria-labelledby="assembly-title">
      <div class="subhead"><h3 id="assembly-title">2D assembly sketch</h3><small>Schematic · not to scale</small></div>
      <div class="assembly-layout">
        <svg class="assembly-sketch" viewBox="0 0 520 290" role="img" aria-labelledby="assembly-sketch-title assembly-sketch-desc">
          <title id="assembly-sketch-title">Indicative timber frame assembly layout</title>
          <desc id="assembly-sketch-desc">Line drawing showing the base, uprights, ${topLabel.toLowerCase()}, and entered overall dimensions.</desc>
          <g class="sketch-frame" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path class="sketch-heavy" d="M94 204 322 204 420 153 192 153Z M94 94 322 94 420 43 192 43Z"/>
            <path class="sketch-heavy" d="M94 204V94 M322 204V94 M420 153V43 M192 153V43"/>
            <path class="sketch-rafter" d="M145 94 243 43 M205 94 303 43 M265 94 363 43"/>
            <path class="sketch-dimension" d="M94 226H322 M332 225 430 174 M73 204V94"/>
            <path class="sketch-tick" d="M94 220v12 M322 220v12 M327 220l10 10 M425 169l10 10 M67 204h12 M67 94h12"/>
          </g>
          <g class="sketch-labels">
            <text x="205" y="190">Base</text>
            <text x="102" y="146">Uprights</text>
            <text x="268" y="57">${topLabel}</text>
            <text x="157" y="250">Length · ${dimension(sketch.length)}</text>
            <text x="354" y="216">Width · ${dimension(sketch.width)}</text>
            <text x="18" y="151" transform="rotate(-90 18 151)">Height · ${dimension(sketch.height)}</text>
          </g>
        </svg>
        <div class="assembly-guide">
          <p class="assembly-guide-title">4 assembly steps</p>
          <ol>${sketch.steps.map((step, index) => `<li><span class="assembly-step-number">${index + 1}</span><span>${escapeHTML(step)}</span></li>`).join("")}</ol>
        </div>
      </div>
    </section>`;
}

function renderResults(result, budget) {
  const toolLow = result.tools[0],
    toolHigh = result.tools[1],
    totalLow = result.materialCost + toolLow,
    totalHigh = result.materialCost + toolHigh;
  resultsBox.innerHTML = `
    <div class="result-top"><div><h2>${escapeHTML(result.title)}</h2><p>Indicative kit based on your measurements</p></div><span class="badge">${budget === "pro" ? "Stanley / DeWalt" : "Basic kit"}</span></div>
    <div class="total-box"><div><span>Estimated project range</span><strong>${money(totalLow)}–${money(totalHigh)}</strong></div><div class="range">${money(totalLow)}<br>to ${money(totalHigh)}</div></div>
    <div class="price-split"><div class="price-chip"><span>Materials subtotal</span><strong>${money(result.materialCost)}</strong></div><div class="price-chip"><span>Starter tools · estimated range</span><strong>${money(toolLow)}–${money(toolHigh)}</strong></div></div>
    <div class="subhead"><h3>Materials to plan for</h3><small>Rough quantity guide</small></div>
    <ul class="estimate-list">${result.materials.map(([name, quantity, detail, cost]) => `<li><span class="material-row-label"><strong>${escapeHTML(name)}</strong><br><span class="qty">${escapeHTML(detail)}</span></span><span class="material-row-meta"><span class="qty">${escapeHTML(quantity)}</span><strong class="material-cost">~${money(cost)}</strong></span></li>`).join("")}</ul>
    ${renderAssemblySketch(result.sketch)}
    <div class="assumption"><strong>Model assumptions</strong><br>${result.assumptions.join(" ")}</div>
       <div class="copy-list-wrap"><button class="copy-list-btn" id="copy-shopping-list" type="button"><svg aria-hidden="true" viewBox="0 0 20 20" width="17" height="17" fill="none"><rect x="7" y="6" width="9" height="11" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M12.5 6V4.5A1.5 1.5 0 0 0 11 3H5.5A1.5 1.5 0 0 0 4 4.5v9A1.5 1.5 0 0 0 5.5 15H7" stroke="currentColor" stroke-width="1.6"/></svg>Copy Shopping List to Clipboard</button><p class="copy-list-status" id="copy-shopping-status" role="status" aria-live="polite"></p></div>
      <section class="recommendations"><div class="subhead"><h3>Useful products for this job</h3><small>Optional picks</small></div><p class="rec-intro">Project-relevant supplies and tools to help complete the kit.</p><div class="product-list">${sortProducts(
        result.products,
      )
        .map((product, index) => productMarkup(product, index, budget))
        .join(
          "",
        )}</div><p class="placeholder-note">Affiliate product links currently use placeholder ASIN and tag values. Confirm product fit and current pricing before purchase.</p></section>
    <div class="assumption"><strong>Budget note</strong><br>Total includes estimated materials plus a ${budget === "pro" ? "Stanley / DeWalt" : "basic"} starter-tool allowance. Delivery, tax, existing tools and local retail prices can vary.</div>`;
  resultsBox.classList.add("show");
  document.querySelector("#welcome").style.display = "none";
}

function shoppingListText() {
  if (!currentResult || !currentEstimateInputs) return "";
  const projectFields = projects[projectSelect.value].fields;
  const measurements = projectFields.map((field) => {
    const value = currentEstimateInputs[field.key];
    return `${field.label}: ${Number(value).toLocaleString("en-GB")} ${field.unit}`;
  });
  const toolLow = currentResult.tools[0];
  const toolHigh = currentResult.tools[1];
  const totalLow = currentResult.materialCost + toolLow;
  const totalHigh = currentResult.materialCost + toolHigh;
  const materials = currentResult.materials.map(
    ([name, quantity, detail, cost]) =>
      `- ${name}: ${quantity} — ~${money(cost)} (${detail})`,
  );
  const assumptions = currentResult.assumptions.map((note) => `- ${note}`);
  return [
    "DIY TIMBER & MATERIAL ESTIMATOR — SHOPPING LIST",
    `Project: ${currentResult.title}`,
    `Tool budget: ${currentBudget === "pro" ? "Quality brands (Stanley / DeWalt)" : "Basic / budget tools"}`,
    "",
    "MEASUREMENTS",
    ...measurements.map((measurement) => `- ${measurement}`),
    "",
    "MATERIALS",
    ...materials,
    "",
    `Estimated materials subtotal: ${money(currentResult.materialCost)}`,
    `Estimated starter tools: ${money(toolLow)}–${money(toolHigh)}`,
    `Estimated total project cost: ${money(totalLow)}–${money(totalHigh)}`,
    "",
    "NOTES",
    ...assumptions,
    "Planning estimate only; confirm sizes, product suitability, and local prices before buying.",
  ].join("\n");
}

function syncShoppingListButton() {
  const button = document.querySelector("#copy-shopping-list");
  const status = document.querySelector("#copy-shopping-status");
  if (!button || !status || !currentEstimateInputs) return;
  const measurementsChanged = projects[projectSelect.value].fields.some(
    (field) => {
      const input = measurementInput(field.key);
      return (
        !input || parseFloat(input.value) !== currentEstimateInputs[field.key]
      );
    },
  );
  const descriptionChanged =
    projectSelect.value === "custom" &&
    document.querySelector("#custom-project-description")?.value.trim() !==
      currentEstimateInputs.projectDescription;
  const budgetChanged = form.elements.budget.value !== currentBudget;
  const isStale = measurementsChanged || descriptionChanged || budgetChanged;
  button.disabled = isStale;
  button.classList.remove("copied");
  status.textContent = isStale
    ? "Your measurements or tool budget changed. Recalculate to copy an updated list."
    : "";
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the selection-based copy for browsers that deny clipboard access.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  let copied = false;
  try {
    textarea.select();
    copied = document.execCommand("copy");
  } finally {
    textarea.remove();
  }
  if (!copied) throw new Error("Clipboard copy was unavailable.");
}

resultsBox.addEventListener("click", async (event) => {
  const button = event.target.closest("#copy-shopping-list");
  if (!button || button.disabled || !currentResult) return;
  const status = document.querySelector("#copy-shopping-status");
  try {
    await copyToClipboard(shoppingListText());
    status.textContent =
      "Shopping list copied. Paste it into your notes before you shop.";
    button.classList.add("copied");
  } catch {
    status.textContent =
      "Clipboard access was blocked. Check your browser permissions and try again.";
    button.classList.remove("copied");
  }
});

projectSelect.addEventListener("change", renderFields);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (projectSelect.value === "custom") {
    const descriptionInput = document.querySelector(
      "#custom-project-description",
    );
    if (!descriptionInput || descriptionInput.value.trim().length < 2) {
      errorBox.textContent =
        "Describe your custom project in at least 2 characters.";
      errorBox.hidden = false;
      if (typeof descriptionInput?.focus === "function")
        descriptionInput.focus();
      return;
    }
  }
  const definition = projects[projectSelect.value];
  for (const field of definition.fields) {
    const input = measurementInput(field.key);
    const value = parseFloat(input?.value);
    const inRange =
      value >= field.min && (field.max == null || value <= field.max);
    if (!input || !input.value.trim() || !Number.isFinite(value) || !inRange) {
      errorBox.textContent = `${field.label} must be between ${field.min} and ${field.max} ${field.unit}.`;
      errorBox.hidden = false;
      if (typeof input?.focus === "function") input.focus();
      return;
    }
  }
  errorBox.hidden = true;
  const chosenBudget = form.elements.budget.value;
  currentBudget = chosenBudget;
  currentEstimateInputs = inputs();
  currentResult = estimate(
    projectSelect.value,
    currentEstimateInputs,
    chosenBudget,
  );
  renderResults(currentResult, chosenBudget);
  resultsBox.scrollIntoView({ behavior: "smooth", block: "start" });
});
form.addEventListener("input", (event) => {
  if (event.target.matches('input[type="number"], #custom-project-description'))
    errorBox.hidden = true;
  syncShoppingListButton();
});
form.addEventListener("change", syncShoppingListButton);
renderFields();
