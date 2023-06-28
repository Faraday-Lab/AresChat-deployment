<script lang="ts">
	import type { Message } from "$lib/types/Message";
	import { createEventDispatcher } from "svelte";

	import CarbonSendAltFilled from "~icons/carbon/send-alt-filled";
	import CarbonExport from "~icons/carbon/export";
	import CarbonStopFilledAlt from "~icons/carbon/stop-filled-alt";
	import EosIconsLoading from "~icons/eos-icons/loading";

	import ChatMessages from "./ChatMessages.svelte";
	import ChatInput from "./ChatInput.svelte";
	import StopGeneratingBtn from "../StopGeneratingBtn.svelte";
	import type { Model } from "$lib/types/Model";
	import type { LayoutData } from "../../../routes/$types";
	import WebSearchToggle from "../WebSearchToggle.svelte";
	import type { WebSearchMessage } from "$lib/types/WebSearch";
	import LoginModal from "../LoginModal.svelte";

	export let messages: Message[] = [];
	export let loading = false;
	export let pending = false;
	export let shared = false;
	export let currentModel: Model;
	export let models: Model[];
	export let settings: LayoutData["settings"];
	export let webSearchMessages: WebSearchMessage[] = [];
	export let searches: Record<string, WebSearchMessage[]> = {};

	export let loginRequired = false;
	$: isReadOnly = !models.some((model) => model.id === currentModel.id);

	let loginModalOpen = false;
	let message: string;

	const dispatch = createEventDispatcher<{
		message: string;
		share: void;
		stop: void;
		retry: { id: Message["id"]; content: string };
	}>();

	const handleSubmit = () => {
		if (loading) return;
		dispatch("message", message);
		message = "";
	};
</script>

<div class="relative min-h-0 min-w-0">
	{#if loginModalOpen}
		<LoginModal {settings} on:close={() => (loginModalOpen = false)} />
	{/if}
	<ChatMessages
		{loading}
		{pending}
		{settings}
		{currentModel}
		{models}
		{messages}
		readOnly={isReadOnly}
		isAuthor={!shared}
		{webSearchMessages}
		{searches}
		on:message
		on:vote
		on:retry={(ev) => {
			if (!loading) dispatch("retry", ev.detail);
		}}
	/>
	<div
		class="dark:via-gray-80 pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto flex w-full max-w-3xl flex-col items-center justify-center bg-gradient-to-t from-white via-white/80 to-white/0 px-3.5 py-4 dark:border-gray-800 dark:from-gray-900 dark:to-gray-900/0 max-md:border-t max-md:bg-white max-md:dark:bg-gray-900 sm:px-5 md:py-8 xl:max-w-4xl [&>*]:pointer-events-auto"
	>
		<div class="flex w-full pb-3 max-md:justify-between">
			<div class="display">
				<div class="controllers">

				</div>
			</div>
			{#if settings?.searchEnabled}
				<WebSearchToggle />
			{/if}
			{#if loading}
				<StopGeneratingBtn
					classNames={settings?.searchEnabled ? "md:-translate-x-1/2 md:mx-auto" : "mx-auto"}
					on:click={() => dispatch("stop")}
				/>
			{/if}
		</div>
		<form
			on:submit|preventDefault={handleSubmit}
			class="relative flex w-full max-w-4xl flex-1 items-center rounded-xl border bg-gray-100 focus-within:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:focus-within:border-gray-500 
			{isReadOnly ? 'opacity-30' : ''}"
		>
			<div class="flex w-full flex-1 border-none bg-transparent">
				<ChatInput
					placeholder="Ask anything"
					bind:value={message}
					on:submit={handleSubmit}
					on:keypress={() => {
						if (loginRequired) loginModalOpen = true;
					}}
					maxRows={4}
					disabled={isReadOnly}
				/>
				{#if loading}
					<button
						class="btn mx-1 my-1 inline-block h-[2.4rem] self-end rounded-lg bg-transparent p-1 px-[0.7rem] text-gray-400 disabled:opacity-60 enabled:hover:text-gray-700 dark:disabled:opacity-40 enabled:dark:hover:text-gray-100 md:hidden"
						on:click={() => dispatch("stop")}
					>
						<CarbonStopFilledAlt />
					</button>
					<div
						class="mx-1 my-1 hidden h-[2.4rem] items-center p-1 px-[0.7rem] text-gray-400 disabled:opacity-60 enabled:hover:text-gray-700 dark:disabled:opacity-40 enabled:dark:hover:text-gray-100 md:flex"
					>
						<EosIconsLoading />
					</div>
				{:else}
					<button
						class="btn mx-1 my-1 h-[2.4rem] self-end rounded-lg bg-transparent p-1 px-[0.7rem] text-gray-400 disabled:opacity-60 enabled:hover:text-gray-700 dark:disabled:opacity-40 enabled:dark:hover:text-gray-100"
						disabled={!message || isReadOnly}
						type="submit"
					>
						<CarbonSendAltFilled />
					</button>

				{/if}

			</div>
			<div class="flex space-x-3 mr-9 mt-1">
				<div>
					<form action="#" method="GET" enctype="multipart/form-data" id="fileUploadForm">
						<input type="file" name="fileUpload" id="fileUpload" style="display: none;">
						<button type="button" onclick="uploadFilePDF()">
    						<img class="h-4 w-4" src="../chatui/file.png" alt="upload a file">
						</button>
					</form>

					<script defer>
						function uploadFilePDF() {
							document.getElementById('fileUpload').click();
						}

						document.getElementById('fileUpload').addEventListener('change', function() {
							document.getElementById('fileUploadForm').submit(); // Automatically submit the form when file is selected
						});
					</script>
				</div>

				<div>
					<input style="display:none">
						<button type="button" onclick="vRecorder()">
							<img class="h-4 w-4" src="../chatui/mic.png" alt="open the mic">
						</button>

					<script defer>
						function vRecorder() {
							// collect DOMs
							const display = document.querySelector('.display')
							const controllerWrapper = document.querySelector('.controllers')

							const State = ['Initial', 'Record', 'Download']
							let stateIndex = 0
							let mediaRecorder, chunks = [], audioURL = ''

							// mediaRecorder setup for audio
							if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
								console.log('mediaDevices supported..')

								navigator.mediaDevices.getUserMedia({
									audio: true
								}).then(stream => {
									mediaRecorder = new MediaRecorder(stream)

									mediaRecorder.ondataavailable = (e) => {
										chunks.push(e.data)
									}

									mediaRecorder.onstop = () => {
										const blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'})
										chunks = []
										audioURL = window.URL.createObjectURL(blob)
										document.querySelector('audio').src = audioURL
										console.log(audioURL)

									}
								}).catch(error => {
									console.log('Following error has occured : ',error)
								})
							}else{
								stateIndex = ''
								application(stateIndex)
							}

							const clearDisplay = () => {
								display.textContent = ''
							}

							const clearControls = () => {
								controllerWrapper.textContent = ''
							}

							const record = () => {
								stateIndex = 1
								mediaRecorder.start()
								application(stateIndex)
							}

							const stopRecording = () => {
								stateIndex = 2
								mediaRecorder.stop()
								application(stateIndex)
							}

							const downloadAudio = () => {
								const downloadLink = document.createElement('a')
								downloadLink.href = audioURL
								downloadLink.setAttribute('download', 'audio')
								downloadLink.click()
							}

							const addButton = (id, funString, text) => {
								const btn = document.createElement('button')
								btn.id = id
								btn.setAttribute('onclick', funString)
								btn.textContent = text
								controllerWrapper.append(btn)
							}

							const addMessage = (text) => {
								const msg = document.createElement('p')
								msg.textContent = text
								display.append(msg)
							}


							const addAudio = () => {
								const audio = document.createElement('audio')
								audio.controls = true
								audio.src = audioURL
								display.append(audio)
							}

							const application = (index) => {
								switch (State[index]) {
									case 'Initial':
										clearDisplay()
										clearControls()

										addButton('record', 'record()', 'Start Recording')
										break;

									case 'Record':
										clearDisplay()
										clearControls()

										addMessage('Recording...')
										addButton('stop', 'stopRecording()', 'Stop Recording')
										break

									case 'Download':
										clearControls()
										clearDisplay()

										addAudio()
										addButton('record', 'record()', 'Record Again')
										break

									default:
										clearControls()
										clearDisplay()

										addMessage('Your browser does not support mediaDevices')
										break;
								}

							}

							application(stateIndex)
						}
					</script>
				</div>
			</div>
		</form>
		
		<div class="mt-2 flex justify-between self-stretch px-1 text-xs text-gray-400/90 max-sm:gap-2">
			<p>
				Model: <a
					href="https://huggingface.co/{currentModel.name}"
					target="_blank"
					rel="noreferrer"
					class="hover:underline">{currentModel.displayName}</a
				> <span class="max-sm:hidden">·</span><br class="sm:hidden" /> Generated content may be inaccurate
				or false.
			</p>
			{#if messages.length}
				<button
					class="flex flex-none items-center hover:text-gray-400 hover:underline max-sm:rounded-lg max-sm:bg-gray-50 max-sm:px-2.5 dark:max-sm:bg-gray-800"
					type="button"
					on:click={() => dispatch("share")}
				>
					<CarbonExport class="text-[.6rem] sm:mr-1.5 sm:text-primary-500" />
					<div class="max-sm:hidden">Share this conversation</div>
				</button>
			{/if}
		</div>
	</div>
</div>
