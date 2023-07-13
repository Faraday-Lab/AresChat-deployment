<script lang="ts">
	import { page } from "$app/stores";
	import { PUBLIC_APP_ASSETS, PUBLIC_APP_NAME, PUBLIC_ORIGIN } from "$env/static/public";
	import { base } from "$app/paths";

	export let classNames = "";
</script>

{#if PUBLIC_APP_ASSETS === "chatui"}
	<svg id="Logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="mr-2 w-4 h-4">
		<defs>
			<style>
				.cls-1 {
					fill: #0e3d59;
				}

				.cls-2 {
					fill: #05f29b;
				}
			</style>
		</defs>
		<rect class="cls-2" width="16" height="16"/>
		<g id="Bleu_vert" data-name="Bleu/vert">
			<g>
				<path class="cls-1" d="m15.08,3c0,5.35-2.91,10.03-7.23,12.53-1.52-.88-2.87-2.03-3.98-3.38-.17-.21-.34-.43-.5-.65C1.65,9.11.62,6.18.62,3c1.64-.57,4.2-1.24,7.38-1.22,1.74.01,3.28.23,4.58.51.32.07.63.15.92.22.59.16,1.12.32,1.58.48Z"/>
				<path class="cls-2" d="m11.02,11.55s.55-3.43,1.02-4.96l-.72.25s-.98-1.83-3.53-1.83-2.95,2.6-2.95,3.27c0,.66-.75,1.19-.75,1.19h1.38s1.05.08,1.05,1.03c0,.53-.48.9-.48.9,0,0,1.92,2.35,3.19,3.07,0,0,.26-3.37.68-4.7l-.98-.85-.13-1.23,1.95,1.43s-.08,1.6.25,2.43Z"/>
				<path class="cls-2" d="m15.53,2.47v.33l-.44.33-3.17,2.34c-1.54-1.54-3.4-1.58-3.4-1.58,0,0-3.18-.45-4.43,2.58-.5,1.53-1.3,2.35-2.04,2.79-.65.38-1.26.47-1.57.49v-.13c.5-.32.89-.8,1.18-1.26.48-.76.69-1.5.69-1.5l.31.3c-.26-2.25,1.75-5.03,1.59-4.59-.16.43.17.56.17.56.23-.47.51-.86.82-1.18,1.4-1.44,3.37-1.47,3.37-1.47,0,0-.22.23-.29.52,2.2-1.23,6.25.55,5.77.58-.48.03-.8.6-.8.6,1.17-.25,1.92.09,2.26.31Z"/>
			</g>
		</g>
	</svg>
{:else}
	<object
		class={classNames}
		data="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/favicon.svg"
		title="{PUBLIC_APP_NAME} logo"
	/>
{/if}
