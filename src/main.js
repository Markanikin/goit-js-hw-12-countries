import "./style.css";
import debounce from "lodash.debounce";
import fetchCountries from "./fetchCountries";
import { error, notice } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

const inputRef = document.querySelector("#search-box");
const resultsRef = document.querySelector("#results");

const DEBOUNCE_DELAY = 500;

inputRef.addEventListener("input", debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const query = e.target.value.trim();
  if (!query) {
    resultsRef.innerHTML = "";
    return;
  }

  fetchCountries(query)
    .then((data) => renderCountries(data))
    .catch(() => {
      error({ text: "Країну не знайдено" });
      resultsRef.innerHTML = "";
    });
}

function renderCountries(countries) {
  resultsRef.innerHTML = "";

  if (countries.length > 10) {
    notice({ text: "Знайдено більше 10 країн — уточніть запит!" });
    return;
  }

  if (countries.length >= 2 && countries.length <= 10) {
    const ul = document.createElement("ul");
    countries.forEach((c) => {
      const li = document.createElement("li");
      li.textContent = c.name;
      ul.appendChild(li);
    });
    resultsRef.appendChild(ul);
    return;
  }

  if (countries.length === 1) {
    const c = countries[0];
    resultsRef.innerHTML = `
      <div class="country-card">
        <div class="meta">
          <h2>${c.name}</h2>
          <p><b>Столиця:</b> ${c.capital}</p>
          <p><b>Населення:</b> ${c.population}</p>
          <p><b>Мови:</b> ${c.languages.map((l) => l.name).join(", ")}</p>
        </div>
        <div>
          <img src="${c.flag}" alt="Flag of ${c.name}" width="200">
        </div>
      </div>
    `;
  }
}
