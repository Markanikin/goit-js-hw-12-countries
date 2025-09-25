const BASE = 'https://restcountries.com/v2/name';

export default function fetchCountries(searchQuery) {
  const fields = 'name,capital,population,flags,languages';
  const url = `${BASE}/${encodeURIComponent(searchQuery)}?fields=${fields}`;

  return fetch(url).then(response => {
    if (!response.ok) {
      const err = new Error('Not found');
      err.status = response.status;
      throw err;
    }
    return response.json();
  });
}