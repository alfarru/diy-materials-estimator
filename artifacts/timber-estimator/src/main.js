import { estimate, projects, sortProducts } from "./project-estimates.js";

const root = document.querySelector("#root");
const money = value => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[character]);

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
  const customDescription = projectSelect.value === "custom" ? `
    <div class="field custom-project-field">
      <label for="custom-project-description">What are you building?</label>
      <input id="custom-project-description" name="projectDescription" type="text" maxlength="80" placeholder="e.g. Wooden garden bench or shelving unit" autocomplete="off" required>
      <small>This name will appear in your estimate and copied shopping list.</small>
    </div>` : "";
  fieldsBox.innerHTML = `${customDescription}${project.fields.map(field => `
    <div class="field">
      <label for="measure-${field.key}">${field.label}</label>
      <div class="unit-input"><input id="measure-${field.key}" name="${field.key}" type="number" min="${field.min}" ${field.max ? `max="${field.max}"` : ""} step="${field.step}" value="${field.value}" required inputmode="decimal" data-testid="input-${field.key}"><span>${field.unit}</span></div>
      <small>${field.hint}</small>
    </div>`).join("")}`;
  resultsBox.classList.remove("show");
  document.querySelector("#welcome").style.display = "";
  errorBox.hidden = true;
  currentResult = null;
  currentEstimateInputs = null;
}

function inputs() {
  const values = Object.fromEntries(projects[projectSelect.value].fields.map(field => [field.key, parseFloat(measurementInput(field.key).value)]));
  if (projectSelect.value === "custom") values.projectDescription = document.querySelector("#custom-project-description").value.trim();
  return values;
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
    FloorCutter: {
      basic: ["Budget laminate flooring cutter", "Value hand cutter for straightforward flooring layouts."],
      pro: ["DeWalt jigsaw and flooring blade", "Quality-brand jigsaw for detailed cuts and notches."]
    },
    Screwdriver: {
      basic: ["Value manual screwdriver set", "Budget hand tools for removing and refitting hardware."],
      pro: ["Stanley screwdriver set", "Quality-brand hand tools for removing and refitting hardware."]
    }
  };
  const [productName, productDetail] = toolOptions[name]?.[budget] ?? [name, detail];
  return `<article class="product-card" data-testid="card-product-${index}"><span class="product-symbol" aria-hidden="true">${symbol}</span><div class="product-copy"><strong>${productName}</strong><span>${productDetail}</span></div><a class="amazon-btn" href="https://www.amazon.co.uk/dp/ASIN_HERE?tag=YOUR_TAG-21" target="_blank" rel="nofollow noopener">View on Amazon →</a></article>`;
}

/* ------------------------------------------------------------------
   Blueprint-style assembly drawing
   Two views: A) side elevation (length × height) and
              B) exploded isometric frame (base → posts → top frame).
   All dimension labels are pulled live from sketch.length / width / height.
   The drawing itself is schematic: proportions are clamped so thin or
   very tall builds stay readable.
------------------------------------------------------------------ */
function renderAssemblySketch(sketch, projectTitle = "") {
  if (!sketch) return "";

  /* ---------- inputs ---------- */
  const toNumber = value => (Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : 0);
  const length = toNumber(sketch.length);
  const width = toNumber(sketch.width);
  const height = toNumber(sketch.height);
  const roofed = Boolean(sketch.roofed);
  const flat = height < .1;
  const topLabel = roofed ? "Rafters" : flat ? "Frame rails" : "Top supports";
  const metres = value => `${Number(value).toLocaleString("en-GB", { maximumFractionDigits: 2 })} m`;
  const millimetres = value => `${Math.round(value * 1000).toLocaleString("en-GB")} mm`;
  const plain = value => Number(value).toLocaleString("en-GB", { maximumFractionDigits: 2 });
  const rawTitle = String(projectTitle || "").trim();
  const shortTitle = rawTitle.length > 34 ? `${rawTitle.slice(0, 33)}…` : rawTitle;

  /* ---------- palette & drawing helpers ---------- */
  const cBg = "#0b1329", cBase = "#38bdf8", cPost = "#4ade80", cRoof = "#fb923c";
  const cSlat = "#94a3b8", cInk = "#e2e8f0", cBright = "#f8fafc";
  const mono = 'font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"';
  const sans = 'font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"';
  const halo = `stroke="${cBg}" stroke-width="4" stroke-linejoin="round" paint-order="stroke"`;
  const r1 = n => Math.round(n * 10) / 10;
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
  const line = (a, b, attrs = "") => `<line x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}" ${attrs}/>`;
  const dot = (p, radius = 2.8) => `<circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="${radius}" fill="${cInk}"/>`;
  // Timber member drawn as a double-line outline so overlaps read like a real framing plan.
  const member = (a, b, color, w) =>
    line(a, b, `stroke="${color}" stroke-width="${w}" stroke-linecap="square"`) +
    line(a, b, `stroke="${cBg}" stroke-width="${w - 3}" stroke-linecap="square"`);
  const dimLine = (a, b) => line(a, b, `stroke="${cInk}" stroke-width="1.3" marker-start="url(#bp-arrow)" marker-end="url(#bp-arrow)"`);
  const extLine = (a, b) => line(a, b, `stroke="${cInk}" stroke-width=".9" stroke-opacity=".6"`);
  const dimText = (x, y, content, attrs = "") => `<text x="${r1(x)}" y="${r1(y)}" fill="${cInk}" ${mono} font-size="12" ${halo} ${attrs}>${content}</text>`;
  const noteText = (x, y, content, attrs = "") => `<text x="${r1(x)}" y="${r1(y)}" fill="${cBright}" ${sans} font-size="12" ${halo} ${attrs}>${content}</text>`;

  /* ================================================================
     VIEW A — side elevation (length × height)
  ================================================================ */
  const ex = 70, ew = 220, gy = 300, clearance = 14, baseThick = 14;
  const baseTop = gy - clearance - baseThick;
  const postH = flat ? 28 : clamp(ew * height / Math.max(length, .01), 56, 120);
  const fall = roofed ? 22 : 8;
  const yHigh = baseTop - postH;
  const topAt = x => yHigh + fall * (x - ex) / ew;
  const postXs = [ex + 7, ex + ew / 2, ex + ew - 7];
  const theta = Math.atan2(fall, ew);

  const slatUsable = postH - fall - 10;
  const slatCount = flat || slatUsable < 12 ? 0 : Math.min(10, Math.floor(slatUsable / 14));
  const elevationSlats = Array.from({ length: slatCount }, (_, i) => {
    const y = baseTop - slatUsable * (i + 1) / (slatCount + 1);
    return line([ex + 8, y], [ex + ew - 8, y], `stroke="${cSlat}" stroke-width="1.6"`);
  }).join("");

  const slopeX = ex + ew * .62;
  const slopeTarget = [slopeX, topAt(slopeX) - 7];
  const gapX = (postXs[0] + postXs[1]) / 2;
  const lengthDimY = 346;
  const heightDimX = 40;
  const heightMidY = (yHigh + gy) / 2;

  const elevation = `
    <rect x="14" y="64" width="316" height="316" fill="none" stroke="${cBase}" stroke-opacity=".35"/>
    <text x="28" y="86" ${sans} font-size="14" font-weight="700" fill="${cBright}"><tspan fill="${cBase}">A</tspan><tspan dx="8">Side elevation</tspan></text>
    <text x="318" y="86" text-anchor="end" ${sans} font-size="11" fill="${cSlat}">Length × height</text>

    <rect x="30" y="${gy}" width="280" height="22" fill="url(#bp-hatch)"/>
    ${line([30, gy], [310, gy], `stroke="${cSlat}" stroke-width="1.8"`)}
    ${postXs.map(cx => `<rect x="${cx - 8}" y="${gy - clearance}" width="16" height="${clearance}" fill="#12304f" stroke="${cBase}" stroke-width="1.5"/>`).join("")}
    <rect x="${ex}" y="${baseTop}" width="${ew}" height="${baseThick}" fill="#12304f" stroke="${cBase}" stroke-width="2"/>
    ${elevationSlats}
    ${postXs.map(cx => {
      const top = topAt(cx);
      return `<rect x="${cx - 5}" y="${r1(top)}" width="10" height="${r1(baseTop - top)}" fill="#0f3a2a" stroke="${cPost}" stroke-width="2"/>`;
    }).join("")}
    ${line([ex - 14, yHigh], [ex + ew + 14, yHigh], `stroke="${cSlat}" stroke-width="1" stroke-dasharray="4 3"`)}
    ${member([ex - 14, topAt(ex - 14)], [ex + ew + 14, topAt(ex + ew + 14)], cRoof, 9)}
    <path d="M${r1(ex + 70)} ${r1(yHigh)} A70 70 0 0 1 ${r1(ex + 70 * Math.cos(theta))} ${r1(yHigh + 70 * Math.sin(theta))}" fill="none" stroke="${cInk}" stroke-width="1.2"/>
    ${dimText(ex + 78, yHigh - 5, "θ", `${sans} font-size="13"`)}

    ${line([slopeX, 133], slopeTarget, `stroke="${cInk}" stroke-width="1.1"`)}${dot(slopeTarget)}
    ${noteText(slopeX, 112, "Slope angle for runoff", 'text-anchor="middle" font-weight="700"')}
    ${noteText(slopeX, 127, roofed ? "fall rain away from wall" : "slight fall, never flat", `text-anchor="middle" fill="${cInk}" font-size="11"`)}

    ${line([gapX, gy + 8], [gapX, gy - clearance / 2], `stroke="${cInk}" stroke-width="1.1"`)}${dot([gapX, gy - clearance / 2])}
    ${noteText(gapX, gy + 19, "100 mm ground clearance", 'text-anchor="middle" font-weight="700"')}

    ${extLine([ex, gy + 24], [ex, lengthDimY + 6])}${extLine([ex + ew, gy + 24], [ex + ew, lengthDimY + 6])}
    ${dimLine([ex, lengthDimY], [ex + ew, lengthDimY])}
    ${dimText(ex + ew / 2, lengthDimY - 7, `Length ${metres(length)} (${millimetres(length)})`, 'text-anchor="middle"')}
    ${extLine([ex - 22, yHigh], [heightDimX - 6, yHigh])}${extLine([ex - 22, gy], [heightDimX - 6, gy])}
    ${dimLine([heightDimX, yHigh], [heightDimX, gy])}
    ${dimText(heightDimX - 8, heightMidY, `Height ${metres(height)}`, `text-anchor="middle" transform="rotate(-90 ${heightDimX - 8} ${r1(heightMidY)})"`)}`;

  /* ================================================================
     VIEW B — exploded isometric frame
     x = length, y = width, z = height (normalised, then projected)
  ================================================================ */
  const maxDim = Math.max(length, width, height, .01);
  const nl = clamp(length / maxDim, .35, 1);
  const nw = clamp(width / maxDim, .35, 1);
  const nh = clamp(height / maxDim, .07, 1);
  const gap = .16;                       // exploded separation between assemblies
  const rise = roofed ? .16 : .06;       // fall along the length for runoff
  const dimOffset = .18;
  const rafterOverhang = roofed ? .08 : 0;
  const zPost = x => gap + nh + rise * (1 - x / nl);
  const zTop = x => 2 * gap + nh + rise * (1 - x / nl);
  const zMax = 2 * gap + nh + rise;
  const c30 = Math.sqrt(3) / 2;
  const k = Math.min(260 / ((nl + nw) * c30), 195 / ((nl + nw) * .5 + zMax));
  const centreX = 530, topY = 116;
  const ox = centreX - ((nl - nw) * c30 * k) / 2;
  const oy = topY + zMax * k;
  const P = (x, y, z) => [ox + (x - y) * c30 * k, oy + (x + y) * .5 * k - z * k];

  const postList = [[0, 0], [nl, 0], [0, nw], [nl, nw]];
  if (nl >= .5) postList.push([nl / 2, 0], [nl / 2, nw]);
  postList.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));

  const groundPlane = [P(-.08, -.08, -.05), P(nl + .08, -.08, -.05), P(nl + .08, nw + .08, -.05), P(-.08, nw + .08, -.05)]
    .map(p => `${r1(p[0])},${r1(p[1])}`).join(" ");

  const alignment = postList.map(([x, y]) =>
    line(P(x, y, 0), P(x, y, gap), `stroke="${cSlat}" stroke-width="1" stroke-dasharray="3 3"`) +
    line(P(x, y, zPost(x)), P(x, y, zTop(x)), `stroke="${cSlat}" stroke-width="1" stroke-dasharray="3 3"`)
  ).join("");

  const baseBack = member(P(0, 0, 0), P(nl, 0, 0), cBase, 7) + member(P(0, 0, 0), P(0, nw, 0), cBase, 7);
  const baseJoists = [1 / 3, 2 / 3].map(t => member(P(nl * t, 0, 0), P(nl * t, nw, 0), cBase, 4)).join("");
  const baseFront = member(P(nl, 0, 0), P(nl, nw, 0), cBase, 7) + member(P(0, nw, 0), P(nl, nw, 0), cBase, 7);
  const postsIso = postList.map(([x, y]) => member(P(x, y, gap), P(x, y, zPost(x)), cPost, 7)).join("");

  const slatLevels = flat ? [] : [.25, .5, .75];
  const slatZ = (f, x) => gap + f * (zPost(x) - gap);
  const slatsIso = slatLevels.map(f =>
    line(P(0, nw, slatZ(f, 0)), P(nl, nw, slatZ(f, nl)), `stroke="${cSlat}" stroke-width="1.6"`) +
    line(P(nl, 0, slatZ(f, nl)), P(nl, nw, slatZ(f, nl)), `stroke="${cSlat}" stroke-width="1.6"`)
  ).join("");

  const topBack = member(P(0, 0, zTop(0)), P(nl, 0, zTop(nl)), cRoof, 7) + member(P(0, 0, zTop(0)), P(0, nw, zTop(0)), cRoof, 7);
  const topFront = member(P(nl, 0, zTop(nl)), P(nl, nw, zTop(nl)), cRoof, 7) + member(P(0, nw, zTop(0)), P(nl, nw, zTop(nl)), cRoof, 7);
  const crossMembers = [.25, .5, .75].map(t => {
    const x = nl * t;
    return member(P(x, -rafterOverhang, zTop(x)), P(x, nw + rafterOverhang, zTop(x)), cRoof, 5);
  }).join("");

  // Iso dimensions
  const lenA = P(0, nw + dimOffset, 0), lenB = P(nl, nw + dimOffset, 0);
  const lenMid = [(lenA[0] + lenB[0]) / 2, (lenA[1] + lenB[1]) / 2];
  const widA = P(nl + dimOffset, 0, 0), widB = P(nl + dimOffset, nw, 0);
  const widMid = [(widA[0] + widB[0]) / 2, (widA[1] + widB[1]) / 2];
  const hFoot = P(0, nw, gap), hHead = P(0, nw, zPost(0));
  const hx = hFoot[0] - 26;
  const hMidY = (hFoot[1] + hHead[1]) / 2;

  // Corner joint callout
  const joint = P(nl, 0, 0);
  const jointEnd = [758, joint[1] - 38];

  const isometric = `
    <rect x="342" y="64" width="564" height="316" fill="none" stroke="${cBase}" stroke-opacity=".35"/>
    <text x="356" y="86" ${sans} font-size="14" font-weight="700" fill="${cBright}"><tspan fill="${cBase}">B</tspan><tspan dx="8">Exploded isometric frame</tspan></text>
    <text x="894" y="86" text-anchor="end" ${sans} font-size="11" fill="${cSlat}">Length × width × height</text>

    <polygon points="${groundPlane}" fill="${cSlat}" fill-opacity=".07" stroke="${cSlat}" stroke-opacity=".6" stroke-dasharray="2 4"/>
    ${alignment}
    ${baseBack}${baseJoists}${baseFront}
    ${postsIso}
    ${slatsIso}
    ${topBack}${topFront}${crossMembers}

    ${extLine(P(0, nw + .03, 0), P(0, nw + dimOffset + .04, 0))}${extLine(P(nl, nw + .03, 0), P(nl, nw + dimOffset + .04, 0))}
    ${dimLine(lenA, lenB)}
    ${dimText(lenMid[0], lenMid[1] + 20, `Length ${metres(length)} (${millimetres(length)})`, 'text-anchor="middle"')}
    ${extLine(P(nl + .03, 0, 0), P(nl + dimOffset + .04, 0, 0))}${extLine(P(nl + .03, nw, 0), P(nl + dimOffset + .04, nw, 0))}
    ${dimLine(widA, widB)}
    ${dimText(widMid[0] + 12, widMid[1] + 2, `<tspan x="${r1(widMid[0] + 12)}">Width ${metres(width)}</tspan><tspan x="${r1(widMid[0] + 12)}" dy="14">(${millimetres(width)})</tspan>`)}
    ${extLine(hFoot, [hx - 6, hFoot[1]])}${extLine(hHead, [hx - 6, hHead[1]])}
    ${dimLine([hx, hFoot[1]], [hx, hHead[1]])}
    ${dimText(hx - 5, hMidY, `<tspan x="${r1(hx - 5)}" dy="0">Height ${metres(height)}</tspan><tspan x="${r1(hx - 5)}" dy="-13">(${millimetres(height)})</tspan>`, `text-anchor="middle" transform="rotate(-90 ${r1(hx - 5)} ${r1(hMidY)})"`)}

    <circle cx="${r1(joint[0])}" cy="${r1(joint[1])}" r="8" fill="none" stroke="${cInk}" stroke-width="1.3" stroke-dasharray="3 2"/>
    <polyline points="${r1(joint[0] + 6)},${r1(joint[1] - 5)} ${r1(jointEnd[0])},${r1(jointEnd[1])} ${r1(jointEnd[0] + 8)},${r1(jointEnd[1])}" fill="none" stroke="${cInk}" stroke-width="1.1"/>
    ${noteText(770, jointEnd[1] - 8, "Corner lap joint /", 'font-weight="700"')}
    ${noteText(770, jointEnd[1] + 6, "post anchor", 'font-weight="700"')}
    ${noteText(770, jointEnd[1] + 21, "Fix post foot to base", `fill="${cInk}" font-size="11"`)}`;

  /* ================================================================
     Key + title block
  ================================================================ */
  const keyRow = (y, swatch, text, x) => `${swatch}<text x="${x + 38}" y="${y + 4}" fill="${cInk}" ${sans} font-size="13">${text}</text>`;
  const legend = `
    <rect x="14" y="392" width="620" height="134" fill="none" stroke="${cBase}" stroke-opacity=".35"/>
    <text x="30" y="414" ${sans} font-size="13" font-weight="700" fill="${cBright}">Component key</text>
    ${keyRow(442, member([34, 442], [62, 442], cBase, 7), "Base frame (sole plate and joists)", 34)}
    ${keyRow(470, member([34, 470], [62, 470], cPost, 7), "Vertical posts / studs", 34)}
    ${keyRow(498, member([34, 498], [62, 498], cRoof, 7), `${topLabel}${roofed ? " and top plate" : " and cross members"}`, 34)}
    ${keyRow(442, line([334, 440], [362, 440], `stroke="${cSlat}" stroke-width="1.8"`) + line([334, 445], [362, 445], `stroke="${cSlat}" stroke-width="1.8"`), "Slat / infill detail", 334)}
    ${keyRow(470, dimLine([334, 470], [362, 470]), "Dimension line (metres and mm)", 334)}
    ${keyRow(498, line([334, 498], [358, 498], `stroke="${cInk}" stroke-width="1.1"`) + dot([361, 498]), "Callout leader", 334)}`;

  const titleBlock = `
    <rect x="646" y="392" width="260" height="134" fill="none" stroke="${cBase}" stroke-opacity=".35"/>
    <text x="662" y="414" ${sans} font-size="11" fill="${cSlat}">Project</text>
    <text x="662" y="431" ${sans} font-size="13" font-weight="700" fill="${cBright}">${escapeHTML(shortTitle || "Timber build")}</text>
    <text x="662" y="456" ${sans} font-size="11" fill="${cSlat}">Overall size (L × W × H)</text>
    <text x="662" y="473" ${mono} font-size="13" fill="${cBase}">${plain(length)} × ${plain(width)} × ${plain(height)} m</text>
    <text x="662" y="498" ${sans} font-size="11" fill="${cSlat}">Not to scale. Exploded view shows</text>
    <text x="662" y="512" ${sans} font-size="11" fill="${cSlat}">parts separated for clarity.</text>`;

  const description = `Blueprint with a side elevation and an exploded isometric frame showing the base frame, vertical posts and ${topLabel.toLowerCase()}. Overall size ${metres(length)} long, ${metres(width)} wide and ${metres(height)} high.`;

  return `
    <section class="assembly-panel" aria-labelledby="assembly-title">
      <div class="subhead"><h3 id="assembly-title">Assembly blueprint</h3><small>Schematic · not to scale</small></div>
      <div class="assembly-layout" style="display:grid;grid-template-columns:minmax(0,1fr);gap:18px">
        <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;border-radius:8px">
          <svg class="assembly-sketch" viewBox="0 0 920 540" style="display:block;width:100%;min-width:760px;max-height:none;height:auto" role="img" aria-labelledby="assembly-sketch-title assembly-sketch-desc">
            <title id="assembly-sketch-title">Blueprint assembly drawing</title>
            <desc id="assembly-sketch-desc">${escapeHTML(description)}</desc>
            <defs>
              <pattern id="bp-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M20 0V100M40 0V100M60 0V100M80 0V100M0 20H100M0 40H100M0 60H100M0 80H100" fill="none" stroke="${cBase}" stroke-opacity=".07" stroke-width="1"/>
                <path d="M0 0H100M0 0V100" fill="none" stroke="${cBase}" stroke-opacity=".16" stroke-width="1"/>
              </pattern>
              <pattern id="bp-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="7" stroke="${cSlat}" stroke-opacity=".5" stroke-width="1.2"/>
              </pattern>
              <marker id="bp-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
                <path d="M0 1.5 10 5 0 8.5z" fill="${cInk}"/>
              </marker>
            </defs>
            <rect width="920" height="540" fill="${cBg}"/>
            <rect width="920" height="540" fill="url(#bp-grid)"/>
            <rect x="4" y="4" width="912" height="532" fill="none" stroke="${cBase}" stroke-opacity=".6" stroke-width="1.5"/>
            <text x="28" y="36" ${sans} font-size="20" font-weight="700" fill="${cBright}">Assembly blueprint</text>
            <text x="896" y="36" text-anchor="end" ${sans} font-size="13" fill="${cSlat}">Side elevation and exploded isometric frame</text>
            ${line([14, 48], [906, 48], `stroke="${cBase}" stroke-opacity=".35"`)}
            ${elevation}
            ${isometric}
            ${legend}
            ${titleBlock}
          </svg>
        </div>
        <div class="assembly-guide">
          <p class="assembly-guide-title">4 assembly steps</p>
          <ol>${sketch.steps.map((step, index) => `<li><span class="assembly-step-number">${index + 1}</span><span>${escapeHTML(step)}</span></li>`).join("")}</ol>
        </div>
      </div>
    </section>`;
}

function renderResults(result, budget) {
  const toolLow = result.tools[0], toolHigh = result.tools[1], totalLow = result.materialCost + toolLow, totalHigh = result.materialCost + toolHigh;
  resultsBox.innerHTML = `
    <div class="result-top"><div><h2>${escapeHTML(result.title)}</h2><p>Indicative kit based on your measurements</p></div><span class="badge">${budget === "pro" ? "Stanley / DeWalt" : "Basic kit"}</span></div>
    <div class="total-box"><div><span>Estimated project range</span><strong>${money(totalLow)}–${money(totalHigh)}</strong></div><div class="range">${money(totalLow)}<br>to ${money(totalHigh)}</div></div>
    <div class="price-split"><div class="price-chip"><span>Materials subtotal</span><strong>${money(result.materialCost)}</strong></div><div class="price-chip"><span>Starter tools · estimated range</span><strong>${money(toolLow)}–${money(toolHigh)}</strong></div></div>
    <div class="subhead"><h3>Materials to plan for</h3><small>Rough quantity guide</small></div>
    <ul class="estimate-list">${result.materials.map(([name, quantity, detail, cost]) => `<li><span class="material-row-label"><strong>${escapeHTML(name)}</strong><br><span class="qty">${escapeHTML(detail)}</span></span><span class="material-row-meta"><span class="qty">${escapeHTML(quantity)}</span><strong class="material-cost">~${money(cost)}</strong></span></li>`).join("")}</ul>
    ${renderAssemblySketch(result.sketch, result.title)}
    <div class="assumption"><strong>Model assumptions</strong><br>${result.assumptions.join(" ")}</div>
       <div class="copy-list-wrap"><button class="copy-list-btn" id="copy-shopping-list" type="button"><svg aria-hidden="true" viewBox="0 0 20 20" width="17" height="17" fill="none"><rect x="7" y="6" width="9" height="11" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M12.5 6V4.5A1.5 1.5 0 0 0 11 3H5.5A1.5 1.5 0 0 0 4 4.5v9A1.5 1.5 0 0 0 5.5 15H7" stroke="currentColor" stroke-width="1.6"/></svg>Copy Shopping List to Clipboard</button><p class="copy-list-status" id="copy-shopping-status" role="status" aria-live="polite"></p></div>
      <section class="recommendations"><div class="subhead"><h3>Useful products for this job</h3><small>Optional picks</small></div><p class="rec-intro">Project-relevant supplies and tools to help complete the kit.</p><div class="product-list">${sortProducts(result.products).map((product, index) => productMarkup(product, index, budget)).join("")}</div><p class="placeholder-note">Affiliate product links currently use placeholder ASIN and tag values. Confirm product fit and current pricing before purchase.</p></section>
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
  const materials = currentResult.materials.map(([name, quantity, detail, cost]) =>
    `- ${name}: ${quantity} — ~${money(cost)} (${detail})`
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
  const measurementsChanged = projects[projectSelect.value].fields.some(field => {
    const input = measurementInput(field.key);
    return !input || parseFloat(input.value) !== currentEstimateInputs[field.key];
  });
  const descriptionChanged = projectSelect.value === "custom"
    && document.querySelector("#custom-project-description")?.value.trim() !== currentEstimateInputs.projectDescription;
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
  if (projectSelect.value === "custom") {
    const descriptionInput = document.querySelector("#custom-project-description");
    if (!descriptionInput || descriptionInput.value.trim().length < 2) {
      errorBox.textContent = "Describe your custom project in at least 2 characters.";
      errorBox.hidden = false;
      if (typeof descriptionInput?.focus === "function") descriptionInput.focus();
      return;
    }
  }
  const definition = projects[projectSelect.value];
  for (const field of definition.fields) {
    const input = measurementInput(field.key);
    const value = parseFloat(input?.value);
    const inRange = value >= field.min && (field.max == null || value <= field.max);
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
  currentResult = estimate(projectSelect.value, currentEstimateInputs, chosenBudget);
  renderResults(currentResult, chosenBudget);
  resultsBox.scrollIntoView({ behavior: "smooth", block: "start" });
});
form.addEventListener("input", event => {
  if (event.target.matches('input[type="number"], #custom-project-description')) errorBox.hidden = true;
  syncShoppingListButton();
});
form.addEventListener("change", syncShoppingListButton);
renderFields();