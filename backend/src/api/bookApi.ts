const API_BASE = 'https://openlibrary.org/search.json';

async function getBooks(title?: string, author?: string) {
  const params = new URLSearchParams();
  addParamIfNotEmpty(params, 'title', title);
  addParamIfNotEmpty(params, 'author', author);
  const response = await fetch(`${API_BASE}?${params.toString()}`);
  const data = response.json();
  console.log(response)
  return data;
}

function addParamIfNotEmpty(
  params: URLSearchParams,
  property: string,
  value: string | undefined,
) {
  if (value != undefined && value !== '') params.append(property, value);
}

export { getBooks };
