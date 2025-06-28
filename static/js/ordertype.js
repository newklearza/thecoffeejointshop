document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("order-context-modal");
  const orderType = document.getElementById("order-type");
  const confirmBtn = document.getElementById("confirm-order-context");
  const extraFields = document.getElementById("extra-fields");

  orderType.addEventListener("change", () => {
    const type = orderType.value;
    extraFields.innerHTML = "";
    extraFields.classList.remove("hidden");

    if (type === "home") {
      extraFields.innerHTML = `
        <label class="block text-left mb-1">Your Name:</label>
        <input type="text" id="customer-name" class="w-full border p-2 rounded">`;
    }
  });

  confirmBtn.addEventListener("click", () => {
    const type = orderType.value;
    const data = { type };

    if (type === "home") {
      data.name = document.getElementById("customer-name").value;
    }

    sessionStorage.setItem("order_context", JSON.stringify(data));
    modal.classList.add("hidden");
    displayOrderStatus();
  });

  if (!sessionStorage.getItem("order_context")) {
    modal.classList.remove("hidden");
  } else {
    displayOrderStatus();
  }

  // Optional: remove waiter button if it exists
  const waiterBtn = document.getElementById("call-waiter-btn");
  if (waiterBtn) waiterBtn.remove();

  function displayOrderStatus() {
    const context = JSON.parse(sessionStorage.getItem("order_context"));
    const statusDiv = document.getElementById("order-status");

    if (!context || !statusDiv) return;

    let statusText = "Order: ";

    if (context.type === "store") {
      statusText += "In-Store";
    } else if (context.type === "home") {
      statusText += `At Home for ${context.name || "?"}`;
    }

    statusDiv.textContent = statusText;
  }
});
