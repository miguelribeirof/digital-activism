function Chat() {
    const form = document.getElementById("chatForm");
    const input = document.getElementById("chatInput");
    const messages = document.getElementById("chatMessages");

    const USER = "user1"; 

    function addMessage(text, from = USER) {
        const msg = document.createElement("div");
        msg.classList.add("message");
        msg.classList.add(from === USER ? "message-user" : "message-other");

        const time = new Date();
        const timestamp = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        msg.innerHTML = `
            <span>${text}</span>
            <span class="timestamp">${timestamp}</span>
        `;

        messages.appendChild(msg);
    }

    // form submit
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, USER);
        input.value = "";
        input.focus();
    });
}