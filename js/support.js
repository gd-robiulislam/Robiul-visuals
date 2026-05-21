document.addEventListener("DOMContentLoaded", () => {
  const ticketForm = document.getElementById("supportTicketForm");
  const formResponse = document.getElementById("formResponse");
  const submitBtn = ticketForm.querySelector(".btn-submit-ticket");

  // REPLACE THIS URL with your live Cloudflare Worker URL once deployed
  // e.g., "https://robiul-support-gateway.yoursubdomain.workers.dev"
  const WORKER_ENDPOINT = "https://studio-support-gateway.robiulislam66178.workers.dev/";

  ticketForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Extract and clean inputs
    const name = document.getElementById("clientName").value.trim();
    const email = document.getElementById("clientEmail").value.trim();
    const subject = document.getElementById("ticketSubject").value.trim();
    const message = document.getElementById("ticketMessage").value.trim();

    // 2. Visual Feedback: Freeze form to look like a secure process
    submitBtn.disabled = true;
    submitBtn.innerText = "Encrypting & Launching Ticket...";
    
    formResponse.classList.add("hidden");
    formResponse.className = "form-status-msg"; // Reset styles

    try {
      // 3. Send payload over to the Cloudflare Worker via modern fetch
      const response = await fetch(WORKER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // 4. Success State: Display the secure Ticket ID natively
        formResponse.classList.add("success");
        formResponse.innerHTML = `
          <strong>Ticket Securely Launched!</strong><br>
          Your Tracking ID is <strong>#${result.ticketId}</strong>. <br>
          A verification record has been sent. Our team will contact you from <em>pixelrobiul@gmail.com</em>.
        `;
        formResponse.classList.remove("hidden");
        
        // Clear out the form inputs on a successful log
        ticketForm.reset();
      } else {
        throw new Error(result.error || "Gateway response failed.");
      }

    } catch (error) {
      // 5. Error Fallback State
      console.error("Support Routing Error:", error);
      formResponse.classList.add("error");
      formResponse.innerHTML = `
        <strong>System Delay:</strong> Unable to route ticket automatically.<br>
        Please forward your brief directly to <strong>pixelrobiul@gmail.com</strong>.
      `;
      formResponse.classList.remove("hidden");
    } finally {
      // 6. Release button lock
      submitBtn.disabled = false;
      submitBtn.innerText = "Launch Support Ticket";
    }
  });
});