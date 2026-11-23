async function loadEvents() {
  const response = await fetch("/api/events");
  const events = await response.json();
  const ul = document.getElementById("timeline");

  for (const event of events) {
    const li = document.createElement("li");
    li.textContent = `[${event.timestamp}] ${event.type} ${event.text ?? ""}`;
    ul.appendChild(li);
  }
  const squeezeCount = events.filter(
    (e) => e.type === "message" || e.type === "squeeze",
  ).length;
  const lastMessage =
    events.find((e) => e.type === "message")?.text ?? "No messages yet";
  document.getElementById("stats").textContent =
    `Squeeze Events: ${squeezeCount} -- Last Message: ${lastMessage}`;
}

loadEvents();
