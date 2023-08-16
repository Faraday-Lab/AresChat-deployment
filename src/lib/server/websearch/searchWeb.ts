// import { SERPAPI_KEY, SERPER_API_KEY } from "$env/static/private";
//
// import { getJson } from "serpapi";
// import type { GoogleParameters } from "serpapi";

// Show result as JSON
export async function searchWeb(query: string) {
	return searchWebAPI(query);
}

export async function searchWebAPI(query: string) {
	// const params = {
	// 	q: query,
	// 	hl: "en",
	// 	gl: "us",
	// };

	try {
		const response = await fetch('https://openares.com/api/search', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query })
		});

		const data = await response.json();

		const fetchDetails = async (url: string) => {
			try {
				const detailedResponse = await fetch('https://openares.com/api/search/details', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ links: [url] })
				});
				const detailedData = await detailedResponse.json();
				return detailedData.detailedResults[0].description;
			} catch (error) {
				console.error('Error fetching details:', error);
				return '';
			}
		};

		for (const source of data.sources) {
			const title = source.title;
			const summary = source.summary;
			// const link = document.createElement('a');
			// link.href = source.url;
			// link.textContent = title;
			// const p = document.createElement('p');
			// p.textContent = summary;

			return await fetchDetails(source.url), title, summary;

		}

	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

// export async function searchWebSerpApi(query: string) {
// 	const params = {
// 		q: query,
// 		hl: "en",
// 		gl: "us",
// 		google_domain: "google.com"
// 		// api_key: SERPAPI_KEY,
// 	} satisfies GoogleParameters;

// 	// Show result as JSON
// 	const response = await getJson("google", params);

// 	return response;
// }

