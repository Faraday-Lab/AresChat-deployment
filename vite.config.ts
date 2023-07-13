import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import Icons from "unplugin-icons/vite";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: "svelte",
		}),
	],
	define: {
		"import.meta.env": JSON.stringify(process.env),
	},
});
