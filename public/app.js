async function loadEvents() {
  const response = await fetch("/api/events");
  const events = await response.json();
  const ul = document.getElementById("timeline");

  for (const event of events) {
    const li = document.createElement("li");
    li.textContent = `[${event.timestamp}] ${event.type} ${event.text ?? ""}`;
    ul.appendChild(li);
  }
}

loadEvents();
