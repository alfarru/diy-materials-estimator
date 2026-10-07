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
    <footer class="footer"><p><strong>Planning note</strong><br>Indicative DIY material estimates only — not structural or building advice. Delivery, tax, existing tools and local prices can vary.</p><p>As an Amazon Associate I earn from qualifying purchases.</p></footer>
  </main>`;

const form = document.querySelector("#estimator-form");
const projectSelect = document.querySelector("#project");
const fieldsBox = document.querySelector("#project-fields");
const resultsBox = document.querySelector("#results");
const errorBox = document.querySelector("#form-error");
let currentResult = null;

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
      <section class="recommendations"><div class="subhead"><h3>Useful products for this job</h3><small>Optional picks</small></div><p class="rec-intro">Project-relevant supplies and tools to help complete the kit.</p><div class="product-list">${result.products.map((product, index) => productMarkup(product, index, budget)).join("")}</div><p class="placeholder-note">Affiliate product links currently use placeholder ASIN and tag values. Confirm product fit and current pricing before purchase.</p></section>
    <div class="assumption"><strong>Budget note</strong><br>Total includes estimated materials plus a ${budget === "pro" ? "Stanley / DeWalt" : "basic"} starter-tool allowance. Delivery, tax, existing tools and local retail prices can vary.</div>`;
  resultsBox.classList.add("show");
  document.querySelector("#welcome").style.display = "none";
}
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
  currentResult = estimate(projectSelect.value, inputs(), chosenBudget);
  renderResults(currentResult, chosenBudget);
  resultsBox.scrollIntoView({ behavior: "smooth", block: "start" });
});
form.addEventListener("input", event => {
  if (event.target.matches("input[type=number]")) errorBox.hidden = true;
});
renderFields();
