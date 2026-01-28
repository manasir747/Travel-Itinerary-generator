const WEBHOOK_URL =
  "https://manasir747.app.n8n.cloud/webhook/92cd20d7-c854-48da-b220-4d6e3236676a";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("itineraryForm");
  const submitBtn = document.getElementById("submitBtn");
  const statusBox = document.getElementById("statusBox");

  const errorMap = {
    fullName: "fullNameError",
    destination: "destinationError",
    days: "daysError",
    budget: "budgetError",
    travelMode: "travelModeError",
    travelers: "travelersError",
    email: "emailError",
    preferences: "preferencesError",
  };

  const fields = Object.keys(errorMap).map((id) =>
    document.getElementById(id)
  );

  fields.forEach((el) => {
    const eventName = el.tagName === "SELECT" ? "change" : "blur";
    el.addEventListener(eventName, () => validateField(el, errorMap));
  });

  form.addEventListener("reset", () => {
    clearAllErrors(errorMap);
    setStatus(statusBox, "", "info", true);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearAllErrors(errorMap);
    const isValid = validateAll(fields, errorMap);

    if (!isValid) {
      setStatus(statusBox, "Please fix the highlighted errors.", "error");
      focusFirstError(fields);
      return;
    }

    const payload = buildPayload(form);

    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    setStatus(statusBox, "Submitting your request…", "info");

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed");

      form.reset();
      setStatus(
        statusBox,
        "Success! Your itinerary request has been submitted. You will receive it soon on your e-mail.",
        "success"
      );
    } catch (err) {
      setStatus(
        statusBox,
        "Unable to submit right now. This is a demo using a placeholder endpoint.",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
    }
  });

  document.getElementById("fullName").focus();
});

function validateAll(fields, errorMap) {
  return fields.every((el) => validateField(el, errorMap));
}

function validateField(el, errorMap) {
  const id = el.id;
  const value = (el.value || "").trim();

  if (id === "preferences") return setFieldError(id, errorMap, "");

  if (id === "fullName") {
    if (!value) return setFieldError(id, errorMap, "Full name is required.");
    if (value.length < 2)
      return setFieldError(id, errorMap, "Please enter a valid name.");
    return setFieldError(id, errorMap, "");
  }

  if (id === "destination" && !value)
    return setFieldError(id, errorMap, "Destination is required.");

  if (id === "days" && (!value || Number(value) <= 0))
    return setFieldError(id, errorMap, "Enter a valid number of days.");

  if (id === "budget" && (!value || Number(value) <= 0))
    return setFieldError(id, errorMap, "Enter a valid budget.");

  if (id === "travelMode" && !value)
    return setFieldError(id, errorMap, "Select a travel mode.");

  if (id === "travelers" && (!value || Number(value) <= 0))
    return setFieldError(id, errorMap, "Enter number of travelers.");

  if (id === "email") {
    if (!value) return setFieldError(id, errorMap, "Email is required.");
    if (!EMAIL_REGEX.test(value))
      return setFieldError(id, errorMap, "Enter a valid email.");
  }

  return setFieldError(id, errorMap, "");
}

function setFieldError(fieldId, errorMap, message) {
  const errorEl = document.getElementById(errorMap[fieldId]);
  const fieldEl = document.getElementById(fieldId);
  const wrapper = fieldEl.closest(".field");

  if (message) {
    errorEl.textContent = message;
    wrapper.classList.add("has-error");
    return false;
  }

  errorEl.textContent = "";
  wrapper.classList.remove("has-error");
  return true;
}

function clearAllErrors(errorMap) {
  Object.keys(errorMap).forEach((id) =>
    setFieldError(id, errorMap, "")
  );
}

function focusFirstError(fields) {
  const el = fields.find((f) =>
    f.closest(".field")?.classList.contains("has-error")
  );
  if (el) el.focus();
}

function buildPayload(form) {
  const data = new FormData(form);
  return {
    fullName: data.get("fullName"),
    destination: data.get("destination"),
    days: Number(data.get("days")),
    budget: Number(data.get("budget")),
    travelMode: data.get("travelMode"),
    travelers: Number(data.get("travelers")),
    email: data.get("email"),
    preferences: data.get("preferences"),
    submittedAt: new Date().toISOString(),
  };
}

function setStatus(box, message, type, hide = false) {
  if (hide || !message) {
    box.textContent = "";
    box.className = "status";
    box.style.display = "none";
    return;
  }
  box.textContent = message;
  box.className = `status ${type}`;
  box.style.display = "block";
}
