const c = [
	() => import("../runtime/components/layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/artists.svelte"),
	() => import("../../src/routes/bands-t.svelte"),
	() => import("../../src/routes/index0.svelte"),
	() => import("../../src/routes/band7.svelte"),
	() => import("../../src/routes/bands.svelte"),
	() => import("../../src/routes/band/id_copy.svelte"),
	() => import("../../src/routes/band/[id].svelte"),
	() => import("../../src/routes/3.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/artists.svelte
	[/^\/artists\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/bands-t.svelte
	[/^\/bands-t\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/index0.svelte
	[/^\/index0\/?$/, [c[0], c[5]], [c[1]]],

	// src/routes/band7.svelte
	[/^\/band7\/?$/, [c[0], c[6]], [c[1]]],

	// src/routes/bands.svelte
	[/^\/bands\/?$/, [c[0], c[7]], [c[1]]],

	// src/routes/band/id_copy.svelte
	[/^\/band\/id_copy\/?$/, [c[0], c[8]], [c[1]]],

	// src/routes/band/[id].svelte
	[/^\/band\/([^/]+?)\/?$/, [c[0], c[9]], [c[1]], (m) => ({ id: d(m[1])})],

	// src/routes/3.svelte
	[/^\/3\/?$/, [c[0], c[10]], [c[1]]]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];