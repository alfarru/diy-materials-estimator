const root = document.querySelector("#root");
const projects = {
  logstore: {
    title: "Garden Log Store",
    description: "Plan an open-front timber frame for a sheltered stack of logs.",
    fields: [
      { key: "length", label: "Length / span", unit: "m", min: 0.3, max: 10, value: 1.8, step: .01, hint: "Overall width along the front." },
      { key: "depth", label: "Depth / width", unit: "m", min: 0.3, max: 5, value: .65, step: .01, hint: "Front to back." },
      { key: "height", label: "Height", unit: "m", min: 0.3, max: 5, value: 1.5, step: .01, hint: "Overall frame height." }
    ]
  },
  flyscreen: {
    title: "Window Fly Screen",
    description: "Estimate a made-to-fit frame, mesh and fixing consumables.",
    fields: [
      { key: "width", label: "Window opening width", unit: "mm", min: 100, max: 5000, value: 900, step: 1, hint: "Measure the opening where the screen will sit." },
      { key: "height", label: "Window opening height", unit: "mm", min: 100, max: 5000, value: 1200, step: 1, hint: "Use the same units for width and height." }
    ]
  },
  lock: {
    title: "Door Cylinder Lock Change",
    description: "Work out an indicative euro-cylinder size before buying.",
    fields: [
      { key: "thickness", label: "Door thickness", unit: "mm", min: 20, max: 120, value: 44, step: 1, hint: "A useful check alongside the current cylinder." },
      { key: "sideA", label: "Cylinder side A", unit: "mm", min: 10, max: 100, value: 35, step: 1, hint: "Retaining-screw centre to one end." },
      { key: "sideB", label: "Cylinder side B", unit: "mm", min: 10, max: 100, value: 35, step: 1, hint: "Retaining-screw centre to the other end." }
    ]
  },
  plywood: {
    title: "Plywood Surface Prep & Painting",
    description: "Budget primer, top coat and sanding supplies for a panel.",
    fields: [
      { key: "length", label: "Panel length", unit: "m", min: .1, max: 10, value: 1.2, step: .01, hint: "Measure the panel face." },
      { key: "width", label: "Panel width", unit: "m", min: .1, max: 10, value: .8, step: .01, hint: "Area is estimated from one face." },
      { key: "coats", label: "Top-coat coats", unit: "coats", min: 1, max: 5, value: 2, step: 1, hint: "Primer is estimated separately as one coat." }
    ]
  }
};
const money = value => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
const ceil = Math.ceil;
const fmt = (n, digits = 1) => Number(n.toFixed(digits)).toLocaleString("en-GB");

root.innerHTML = `
  <header class="topbar"><div class="topbar-inner">
    <a class="brand" href="#" aria-label="Benchmark DIY home"><span class="brand-mark" aria-hidden="true">B</span><span>Benchmark DIY<small>Plan it before you build it</small></span></a>
    <div class="top-note"><span class="live-dot" aria-hidden="true"></span>Practical estimates for UK projects</div>
  </div></header>
  <main class="page">
    <section class="intro" aria-labelledby="page-title">
      <div><p class="eyebrow">The practical project planner</p><h1 id="page-title">Know what to buy before you begin.</h1><p class="intro-copy">A clear, rough-cut list of materials and starter tools for the jobs that are easier when you measure twice.</p></div>
      <div class="intro-aside"><strong>Four everyday projects</strong>Set your measurements. Get a useful shopping plan.</div>
    </section>
    <div class="layout">
      <form class="panel form-panel" id="estimator-form" novalidate>
        <div class="section-heading"><span class="step">01</span><div><h2>Set up your project</h2><p>Choose a job and enter your measurements.</p></div></div>
        <div class="field"><label for="project">Project type</label><div class="select-wrap"><select id="project" name="project" data-testid="select-project">
          <option value="logstore">Garden Log Store</option><option value="flyscreen">Window Fly Screen</option><option value="lock">Door Cylinder Lock Change</option><option value="plywood">Plywood Surface Prep &amp; Painting</option>
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

function renderFields() {
  const project = projects[projectSelect.value];
  fieldsBox.innerHTML = project.fields.map(field => `
    <div class="field">
      <label for="measure-${field.key}">${field.label}</label>
      <div class="unit-input"><input id="measure-${field.key}" name="${field.key}" type="number" min="${field.min}" ${field.max ? `max="${field.max}"` : ""} step="${field.step}" value="${field.value}" required inputmode="decimal" data-testid="input-${field.key}"><span>${field.unit}</span></div>
      <small>${field.hint}</small>
    </div>`).join("");
  resultsBox.classList.remove("show");
  document.querySelector("#welcome").style.display = "";
  errorBox.hidden = true;
  currentResult = null;
  currentEstimateInputs = null;
}

function inputs() {
  return Object.fromEntries(projects[projectSelect.value].fields.map(field => [field.key, Number(form.elements[field.key].value)]));
}
function containerPlan(litres) {
  const sizes = [5, 2.5, 1];
  let remaining = Math.max(.5, litres);
  let cans = [];
  for (const size of sizes) {
    const count = Math.floor((remaining + .00001) / size);
    if (count) { cans.push(`${count} × ${size} L`); remaining -= count * size; }
  }
  if (remaining > .00001) cans.push(`1 × ${remaining <= 1 ? "1" : "2.5"} L`);
  return cans.join(", ");
}
function estimate(key, x, budget) {
  let materials = [], assumptions = [], products = [], materialCost = 0, title = projects[key].title;
  if (key === "logstore") {
    const { length: l, depth: d, height: h } = x;
    const rafters = ceil(l / .6) + 1;
    const backSlats = ceil(l / .12) + 1;
    const floorSlats = ceil(l / .12) + 1;
    const frameRaw = 4 * h + 2 * 2 * (l + d) + rafters * d;
    const slatRaw = backSlats * h + floorSlats * d;
    const frameStock = ceil(frameRaw * 1.12 / 3);
    const slatStock = ceil(slatRaw * 1.12 / 3);
    const treatmentArea = l * h + (2 * d * h) + (l * d);
    const litres = treatmentArea * 2 / 10;
    const cans = containerPlan(litres);
    const screws = ceil((backSlats * 2 + floorSlats * 2 + rafters * 2) * 1.2);
    materialCost = frameStock * 8.5 + slatStock * 5.25 + Math.max(8, ceil(screws / 100) * 6) + Math.max(12, ceil(litres) * 8);
    materials = [
      [`Frame timber`, `${frameStock} × 3 m lengths`, `Uprights, perimeter rails and ${rafters} roof rafters; includes 12% cutting waste.`],
      [`Slats`, `${slatStock} × 3 m lengths`, `${backSlats} back slats at 120 mm spacing and ${floorSlats} floor slats; includes 12% waste.`],
      [`Exterior screws`, `About ${screws} screws`, `Approximate count tied to slat and frame fixing points.`],
      [`Wood treatment`, `${cans} (${fmt(litres, 2)} L required)`, `Two coats over an estimated ${fmt(treatmentArea, 1)} m² back, sides and roof.`]
    ];
    assumptions.push("Simple open-front frame; roof rafters spaced at no more than 600 mm. Stock lengths and timber sections should be chosen to suit your design.");
    products = [
      ["Screws", "Exterior wood screws · corrosion-resistant fixings", "FIX"],
      ["Treatment", "Exterior wood treatment · suitable for outdoor timber", "CARE"],
      ["Saw", "Compound mitre saw · repeatable cross-cuts", "CUT"],
      ["Measure", "Tape measure and combination square · accurate set-out", "MEAS"],
      ["Driver", "Drill/driver with wood bits and driver bits", "TOOL"]
    ];
  } else if (key === "flyscreen") {
    const w = x.width / 1000, h = x.height / 1000, perimeter = 2 * (w + h), area = w * h;
    const mesh = area * 1.1, fixes = ceil(perimeter / .3) + 4;
    materialCost = Math.max(26, 19 + perimeter * 5 + mesh * 13 + fixes * .18);
    materials = [
      ["Screen frame", `${fmt(perimeter * 1.1, 2)} m perimeter allowance`, "Frame perimeter plus 10% for joints and trimming."],
      ["Insect mesh", `${fmt(mesh, 2)} m²`, `Opening area ${fmt(area, 2)} m² plus 10% allowance.`],
      ["Spline", `${fmt(perimeter * 1.1, 2)} m`, "Allow a little extra for trimming at the corners."],
      ["Fixings & kit", `About ${fixes} fixing points`, "Fixings estimated at 300 mm spacing, plus corner allowance; includes basic screening consumables."]
    ];
    assumptions.push("Assumes a simple rectangular screen frame. Check opening clearance, frame profile and mesh type before buying a kit.");
    products = [
      ["Mesh", "Fine insect screen mesh · cut-to-size roll", "MESH"],
      ["Spline", "Screen spline and roller tool · for a neat mesh fit", "FIT"],
      ["Seal", "Removable window seal strip · close small edge gaps", "SEAL"],
      ["Measure", "Tape measure and small square · check the opening", "MEAS"],
      ["Driver", "Compact drill/driver and bit set · for frame fixings", "TOOL"]
    ];
  } else if (key === "lock") {
    const length = ceil((x.sideA + x.sideB) / 5) * 5;
    materialCost = 17 + 3.5;
    materials = [
      ["Replacement cylinder", `1 × approximately ${length} mm (${x.sideA} / ${x.sideB} mm measured)`, "Length rounded up to the nearest 5 mm."],
      ["Fitting fixings", "1 retaining screw + 2 spare screws", "Small allowance for suitable replacement fixings."]
    ];
    assumptions.push(`Door thickness recorded as ${x.thickness} mm. Check the actual cylinder against the current hardware, cam position, door furniture and your security needs before purchase; do not rely on this estimate alone.`);
    products = [
      ["Cylinder", "Euro-profile replacement cylinder · verify size and security rating", "LOCK"],
      ["Fixings", "Cylinder retaining screws · check length and thread", "FIX"],
      ["Measure", "Steel rule or tape measure · confirm both sides from screw centre", "MEAS"],
      ["Screwdriver", "Manual screwdriver set · remove and refit existing hardware", "TOOL"]
    ];
  } else {
    const area = x.length * x.width;
    const primerLitres = area / 10, topLitres = area * x.coats / 12;
    const primerPack = Math.max(1, ceil(primerLitres));
    const paintPack = Math.max(1, ceil(topLitres));
    const sheets = Math.max(1, ceil(area * 5));
    materialCost = primerPack * 14 + paintPack * 19 + Math.max(5, ceil(sheets / 5) * 5);
    materials = [
      ["Plywood primer", `${primerPack} L purchasable allowance (${fmt(primerLitres, 2)} L needed)`, `One coat at approximately 10 m²/L over ${fmt(area, 2)} m².`],
      ["Top-coat paint", `${paintPack} L purchasable allowance (${fmt(topLitres, 2)} L needed)`, `${x.coats} coat${x.coats === 1 ? "" : "s"} at approximately 12 m²/L.`],
      ["Sandpaper", `${ceil(sheets / 5) * 5} sheets`, `Rough allowance of 5 sheets per m²; practical pack rounded up.`]
    ];
    assumptions.push("One face of the panel is included. Coverage varies with plywood porosity, paint system and application; follow the product instructions and allow drying time.");
    products = [
      ["Primer", "Plywood / multi-surface primer · check compatibility", "PRIME"],
      ["Paint", "Durable water-based top-coat paint · chosen finish", "PAINT"],
      ["Sanding", "Mixed-grit sanding sheets · prep between coats", "SAND"],
      ["Seal", "Paintable edge sealer · help reduce thirsty plywood edges", "SEAL"],
      ["Sander", "Random-orbit sander and dust extraction bag", "TOOL"],
      ["Measure", "Tape measure and straightedge · mark panel edges", "MEAS"]
    ];
  }
  const ranges = budget === "pro" ? [85, 225] : [28, 76];
  if (key === "lock") { ranges[0] = budget === "pro" ? 55 : 12; ranges[1] = budget === "pro" ? 155 : 42; }
  if (key === "flyscreen") { ranges[0] = budget === "pro" ? 72 : 20; ranges[1] = budget === "pro" ? 190 : 58; }
  return { title, materials, assumptions, products, materialCost, tools: ranges };
}

function productMarkup([name, detail, symbol], index, budget) {
  const toolOptions = {
    Saw: {
      basic: ["Budget compound mitre saw", "Value saw for occasional DIY cross-cuts."],
      pro: ["DeWalt compound mitre saw", "Quality-brand option for repeatable cross-cuts."]
    },
    Measure: {
      basic: ["Value tape measure & square", "Budget measuring tools for everyday set-out."],
      pro: ["Stanley FatMax tape measure & square", "Quality-brand measuring tools for regular use."]
    },
    Driver: {
      basic: ["Budget drill/driver & bit set", "Value cordless drill/driver for occasional projects."],
      pro: ["DeWalt drill/driver & bit set", "Quality-brand drill/driver and bits for regular use."]
    },
    Sander: {
      basic: ["Budget random-orbit sander", "Value sander for occasional panel preparation."],
      pro: ["DeWalt random-orbit sander", "Quality-brand sander for repeat projects."]
    },
    Screwdriver: {
      basic: ["Value manual screwdriver set", "Budget hand tools for removing and refitting hardware."],
      pro: ["Stanley screwdriver set", "Quality-brand hand tools for removing and refitting hardware."]
    }
  };
  const [productName, productDetail] = toolOptions[name]?.[budget] ?? [name, detail];
  return `<article class="product-card" data-testid="card-product-${index}"><span class="product-symbol" aria-hidden="true">${symbol}</span><div class="product-copy"><strong>${productName}</strong><span>${productDetail}</span></div><a class="amazon-btn" href="https://www.amazon.co.uk/dp/ASIN_HERE?tag=YOUR_TAG-21" target="_blank" rel="nofollow noopener">View on Amazon →</a></article>`;
}
function renderResults(result, budget) {
  const toolLow = result.tools[0], toolHigh = result.tools[1], totalLow = result.materialCost + toolLow, totalHigh = result.materialCost + toolHigh;
  resultsBox.innerHTML = `
    <div class="result-top"><div><h2>${result.title}</h2><p>Indicative kit based on your measurements</p></div><span class="badge">${budget === "pro" ? "Stanley / DeWalt" : "Basic kit"}</span></div>
    <div class="total-box"><div><span>Estimated project range</span><strong>${money(totalLow)}–${money(totalHigh)}</strong></div><div class="range">${money(totalLow)}<br>to ${money(totalHigh)}</div></div>
    <div class="price-split"><div class="price-chip"><span>Materials subtotal</span><strong>${money(result.materialCost)}</strong></div><div class="price-chip"><span>Starter tools · estimated range</span><strong>${money(toolLow)}–${money(toolHigh)}</strong></div></div>
    <div class="subhead"><h3>Materials to plan for</h3><small>Rough quantity guide</small></div>
    <ul class="estimate-list">${result.materials.map(([name, quantity, detail]) => `<li><span><strong>${name}</strong><br><span class="qty">${detail}</span></span><span class="qty">${quantity}</span></li>`).join("")}</ul>
    <div class="assumption"><strong>Model assumptions</strong><br>${result.assumptions.join(" ")}</div>
       <div class="copy-list-wrap"><button class="copy-list-btn" id="copy-shopping-list" type="button"><svg aria-hidden="true" viewBox="0 0 20 20" width="17" height="17" fill="none"><rect x="7" y="6" width="9" height="11" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M12.5 6V4.5A1.5 1.5 0 0 0 11 3H5.5A1.5 1.5 0 0 0 4 4.5v9A1.5 1.5 0 0 0 5.5 15H7" stroke="currentColor" stroke-width="1.6"/></svg>Copy Shopping List to Clipboard</button><p class="copy-list-status" id="copy-shopping-status" role="status" aria-live="polite"></p></div>
      <section class="recommendations"><div class="subhead"><h3>Useful products for this job</h3><small>Optional picks</small></div><p class="rec-intro">Project-relevant supplies and tools to help complete the kit.</p><div class="product-list">${result.products.map((product, index) => productMarkup(product, index, budget)).join("")}</div><p class="placeholder-note">Affiliate product links currently use placeholder ASIN and tag values. Confirm product fit and current pricing before purchase.</p></section>
    <div class="assumption"><strong>Budget note</strong><br>Total includes estimated materials plus a ${budget === "pro" ? "Stanley / DeWalt" : "basic"} starter-tool allowance. Delivery, tax, existing tools and local retail prices can vary.</div>`;
  resultsBox.classList.add("show");
  document.querySelector("#welcome").style.display = "none";
}

function shoppingListText() {
  if (!currentResult || !currentEstimateInputs) return "";
  const projectFields = projects[projectSelect.value].fields;
  const measurements = projectFields.map(field => {
    const value = currentEstimateInputs[field.key];
    return `${field.label}: ${Number(value).toLocaleString("en-GB")} ${field.unit}`;
  });
  const toolLow = currentResult.tools[0];
  const toolHigh = currentResult.tools[1];
  const totalLow = currentResult.materialCost + toolLow;
  const totalHigh = currentResult.materialCost + toolHigh;
  const materials = currentResult.materials.map(([name, quantity, detail]) =>
    `- ${name}: ${quantity} (${detail})`
  );
  const assumptions = currentResult.assumptions.map(note => `- ${note}`);
  return [
    "DIY TIMBER & MATERIAL ESTIMATOR — SHOPPING LIST",
    `Project: ${currentResult.title}`,
    `Tool budget: ${currentBudget === "pro" ? "Quality brands (Stanley / DeWalt)" : "Basic / budget tools"}`,
    "",
    "MEASUREMENTS",
    ...measurements.map(measurement => `- ${measurement}`),
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
    "Planning estimate only; confirm sizes, product suitability, and local prices before buying."
  ].join("\n");
}

function syncShoppingListButton() {
  const button = document.querySelector("#copy-shopping-list");
  const status = document.querySelector("#copy-shopping-status");
  if (!button || !status || !currentEstimateInputs) return;
  const measurementsChanged = projects[projectSelect.value].fields.some(field =>
    Number(form.elements[field.key].value) !== currentEstimateInputs[field.key]
  );
  const budgetChanged = form.elements.budget.value !== currentBudget;
  const isStale = measurementsChanged || budgetChanged;
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

resultsBox.addEventListener("click", async event => {
  const button = event.target.closest("#copy-shopping-list");
  if (!button || button.disabled || !currentResult) return;
  const status = document.querySelector("#copy-shopping-status");
  try {
    await copyToClipboard(shoppingListText());
    status.textContent = "Shopping list copied. Paste it into your notes before you shop.";
    button.classList.add("copied");
  } catch {
    status.textContent = "Clipboard access was blocked. Check your browser permissions and try again.";
    button.classList.remove("copied");
  }
});

projectSelect.addEventListener("change", renderFields);
form.addEventListener("submit", event => {
  event.preventDefault();
  const definition = projects[projectSelect.value];
  for (const field of definition.fields) {
    const input = form.elements[field.key];
    const value = Number(input.value);
     if (!input.value || !Number.isFinite(value) || value < field.min || (field.max && value > field.max)) {
       errorBox.textContent = `${field.label} must be between ${field.min} and ${field.max} ${field.unit}.`;
      errorBox.hidden = false;
      input.focus();
      return;
    }
  }
  errorBox.hidden = true;
  const chosenBudget = form.elements.budget.value;
  currentBudget = chosenBudget;
  currentEstimateInputs = inputs();
  currentResult = estimate(projectSelect.value, currentEstimateInputs, chosenBudget);
  renderResults(currentResult, chosenBudget);
  resultsBox.scrollIntoView({ behavior: "smooth", block: "start" });
});
form.addEventListener("input", event => {
  if (event.target.matches("input[type=number]")) errorBox.hidden = true;
  syncShoppingListButton();
});
form.addEventListener("change", syncShoppingListButton);
renderFields();
