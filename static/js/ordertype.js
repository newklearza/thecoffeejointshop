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
    } else if (type === "store") {
      data.queue_number = Math.floor(100 + Math.random() * 900); // Generate random 3-digit number
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

  function displayOrderStatus() {
    const context = JSON.parse(sessionStorage.getItem("order_context"));
    const statusDiv = document.getElementById("order-status");

    if (!context || !statusDiv) return;

    let statusText = "";

    if (context.type === "store") {
      statusText = `🧾 In-Store Order • Ticket #${context.queue_number || "?"}`;
    } else if (context.type === "home") {
      statusText = `🏠 At Home Order for ${context.name || "?"}`;
    }

    statusDiv.textContent = statusText;
  }
});
