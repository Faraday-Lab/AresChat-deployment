<script lang="ts">
    import type { Message } from "$lib/types/Message";
    import { createEventDispatcher } from "svelte";

    import {CHATPDF_API_KEY} from "$lib/actions/CHATPDF_API_KEY";
    import CarbonSendAltFilled from "~icons/carbon/send-alt-filled";
    import CarbonExport from "~icons/carbon/export";
    import CarbonStopFilledAlt from "~icons/carbon/stop-filled-alt";
    import EosIconsLoading from "~icons/eos-icons/loading";
    import Swal from 'sweetalert2';

    import ChatMessages from "./ChatMessages.svelte";
    import ChatInput from "./ChatInput.svelte";
    import StopGeneratingBtn from "../StopGeneratingBtn.svelte";
    import type { Model } from "$lib/types/Model";
    import type { LayoutData } from "../../../routes/$types";
    import WebSearchToggle from "../WebSearchToggle.svelte";
    import type { WebSearchMessage } from "$lib/types/WebSearch";
    import LoginModal from "../LoginModal.svelte";
    import axios from "axios";

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

    function textImage(){
        getImages()
    }

    function getImages() {
        Swal.fire({
            title: 'Generate images!',
            input: 'text',
            inputPlaceholder: 'Type your prompt here...',
            showCancelButton: true,
            confirmButtonText: 'Send',
            showLoaderOnConfirm: true,
            background: '#1f2937',
            color: 'white',
            confirmButtonColor: '#059669',
            customClass: {
                title: 'swal-white-title',
                loader: 'swal-loading-spinner',
            },
            preConfirm: (prompt) => {
                Swal.fire({
                    didOpen: () => {
                        Swal.showLoading(Swal.getConfirmButton());
                    }
                });
                fetch(
                    `https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v0-9/text-to-image`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            Authorization: 'sk-bMhuMy55knbw133npsyeXP78HOe2TKMArEGlbueyxiAxaWED',
                        },
                        body: JSON.stringify({
                            text_prompts: [
                                {
                                    text: prompt
                                },
                            ],
                            cfg_scale: 7,
                            clip_guidance_preset: 'FAST_BLUE',
                            height: 512,
                            width: 512,
                            samples: 3,
                            steps: 30,
                        }),
                    }
                )
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Non-200 response: ${response.text()}`);
                        }
                        return response.json();
                    })
                    .then((responseJSON) => {

                        interface ImageArtifact {
                            base64: string;
                            seed: number;
                            finishReason: string;
                        }

                        interface GenerationResponse {
                            artifacts: ImageArtifact[];
                        }

                        const images = responseJSON.artifacts.map((image: ImageArtifact) =>
                            `data:image/png;base64,${image.base64}`
                        );

                        const imageContainer = document.createElement('div');
                        imageContainer.style.display = 'flex';
                        imageContainer.style.justifyContent = 'center';

                        images.forEach((imageUrl) => {
                            const imageElement = document.createElement('img');
                            imageElement.src = imageUrl;
                            imageElement.style.width = '400px';
                            imageElement.style.height = 'auto';
                            imageElement.style.borderRadius = '10px';
                            imageElement.style.marginRight = '15px';
                            imageContainer.appendChild(imageElement);
                        });

                        Swal.fire({
                            title: 'Images',
                            width: 1300,
                            height: 600,
                            html: imageContainer,
                            confirmButtonText: 'Télécharger',
                            showLoaderOnConfirm: true,
                            preConfirm: () => {
                                return downloadImages(images);
                            }
                        })
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        })
    }

    function downloadImages(images) {
        return new Promise((resolve, reject) => {
            const downloadPromises = images.map((imageUrl) => {
                return new Promise((resolve, reject) => {
                    const link = document.createElement('a');
                    link.href = imageUrl;
                    link.download = 'image.png';
                    link.target = '_blank';
                    link.addEventListener('click', () => {
                        link.parentNode.removeChild(link);
                        resolve();
                    }, { once: true });

                    document.body.appendChild(link);
                    link.click();
                });
            });

            Promise.all(downloadPromises)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

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
                <div class="flex flex-row items-center justify-center space-x-3 mr-9 mt-1">
                    <div>

                        <form enctype="multipart/form-data" id="fileUploadForm">
                            <input type="file" name="fileUpload" id="fileUpload" style="display: none;">
                            <button
                                    type="button"
                                    title="Upload a PDF!">
                                <img class="h-4 w-4" src="../chatui/file.png" alt="upload a file">
                            </button>
                        </form>
                    </div>
                    <div>
                        <button
                                on:click={textImage}
                                type="button"
                                title="Generate images!">
                            <img class="h-4 w-4 popup-img" src="../chatui/Paint.png" alt="Pinceau" >
                        </button>
                    </div>
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