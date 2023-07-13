<script lang="ts">
    import type {Message} from "$lib/types/Message";
    import {createEventDispatcher, onMount} from "svelte";
    import {lock} from '$lib/lockStore';

    import {CHATPDF_API_KEY} from "$lib/actions/CHATPDF_API_KEY";
    import {NASA_API_KEY} from "$lib/actions/NASA_API_KEY";
    import Swal from 'sweetalert2';

    import CarbonSendAltFilled from "~icons/carbon/send-alt-filled";
    import CarbonExport from "~icons/carbon/export";
    import CarbonStopFilledAlt from "~icons/carbon/stop-filled-alt";
    import EosIconsLoading from "~icons/eos-icons/loading";

    import ChatMessages from "./ChatMessages.svelte";
    import ChatInput from "./ChatInput.svelte";
    import StopGeneratingBtn from "../StopGeneratingBtn.svelte";
    import type {Model} from "$lib/types/Model";
    import type {LayoutData} from "../../../routes/$types";
    import WebSearchToggle from "../WebSearchToggle.svelte";
    import type {WebSearchMessage} from "$lib/types/WebSearch";
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

    const options = {
        headers: {
            "x-api-key": CHATPDF_API_KEY,
            "Content-Type": "application/json",
        }
    };

    function chatWithPDF() {
        clickFileUpload();
        processFile();
    }

    function clickFileUpload() {
        document.getElementById('fileUpload')?.click();
    }

    function processFile() {
        document.getElementById('fileUpload')?.addEventListener('change', (event) => handleFileChange.call(event.target));
    }

    function handleFileChange(this: HTMLInputElement) {
        const file = this.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            let optionsUpload = {
                headers: {
                    "x-api-key": CHATPDF_API_KEY,
                },
            };

            alertBoxProcessing("Uploading");

            uploadFile(formData, optionsUpload);
        }
    }

    function uploadFile(formData, optns) {
        axios
            .post("https://api.chatpdf.com/v1/sources/add-file", formData, optns)
            .then((response) => {
                const sourceID = response.data.sourceId;
                console.log(sourceID);
                alertSuccess(sourceID);
            })
            .catch((error) => {
                console.log("Error:", error.message);
                console.log("Response:", error.response?.data.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    customClass: {
                        title: 'swal-white-title'
                    },
                    color: 'white',
                    html: error.response?.data.message + '.<br>Please update a valid PDF.',
                    background: '#1f2937',
                    confirmButtonColor: '#059669',
                    confirmButtonText: "Try again",
                    allowOutsideClick: true
                })
            })
    }


    function alertSuccess(sourceID) {
        Swal.fire({
            icon: 'success',
            html: 'File uploaded successfully!<br>You can now chat with your file!',
            showConfirmButton: true,
            background: '#1f2937',
            color: 'white',
            confirmButtonColor: '#059669',
            confirmButtonText: "Continue",
            showDenyButton: true,
            denyButtonText: 'Dismiss my file'
        }).then((result) => {
            if (result.isDenied) {
                isDenied(sourceID);
                // WIP();
            } else if (result.isConfirmed) {
                questionYourFile(sourceID);

            }
        });
    }

    function WIP() {
        Swal.fire({
            icon: 'info',
            title: 'Work in Progress',
            html: 'This feature is still in development.<br>Stay tuned for more updates!',
            showConfirmButton: true,
            background: '#1f2937',
            color: 'white',
            confirmButtonColor: '#059669',
            confirmButtonText: "Thank you!",
            allowOutsideClick: true,
            customClass: {
                title: 'swal-white-title'
            },
        })
    }

    function alertBoxProcessing(state: string, type = 'file') {
        Swal.fire({
            title: `${state} your ${type}...`,
            background: '#1f2937',
            allowOutsideClick: false,
            customClass: {
                popup: 'swal-loading-popup',
                title: 'swal-white-title',
                loader: 'swal-loading-spinner'
            },
            didOpen: () => {
                Swal.showLoading(Swal.getConfirmButton());
            }
        });
    }

    function isDenied(sourceID) {

        const data = {
            sources: [sourceID.toString()]
        };

        alertBoxProcessing("Deleting");

        axios
            .post("https://chatpdf.openares.com/api/proxy/delete", data, options)
            .then(() => {
                confirmDeletion();
            })
            .catch((error) => {
                console.log("Error:", error.message);
                console.log("Response:", error.response?.data);
            });
    }

    function confirmDeletion() {
        Swal.fire({
            icon: 'success',
            text: 'File deleted successfully!',
            showConfirmButton: true,
            background: '#1f2937',
            color: 'white',
            confirmButtonColor: '#059669',
            confirmButtonText: "Thank you!",
            allowOutsideClick: true
        });
    }

    function questionYourFile(sourceID) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let outerResult;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let qstn;

        Swal.fire({
            title: 'Question your file!',
            input: 'text',
            inputLabel: 'What is your question?',
            inputPlaceholder: 'Type your question here...',
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
            preConfirm: (question) => {
                qstn = question;
                console.log(question);
                const data = {
                    "referencesSources": true,
                    "sourceId": sourceID.toString(),
                    "messages": [
                        {
                            "role": 'user',
                            "content": question.toString(),
                        },
                    ],
                };

                return axios
                    .post('https://chatpdf.openares.com/api/proxy', data, options)
                    .then((response) => {
                        console.log(response.data.content);
                        return response.data;
                    })
                    .catch((error) => {
                        console.log(error);
                        Swal.showValidationMessage(`Request failed: ${error}`);

                        console.log('Error:', error.message);
                        console.log('Response:', error.response?.data);
                    });
            },
        }).then((result) => {
            console.log(result);
            if (result.isConfirmed) {
                Swal.fire({
                    title: qstn,
                    text: result.value.content,
                    background: '#1f2937',
                    color: 'white',
                    showConfirmButton: true,
                    confirmButtonColor: '#059669',
                    confirmButtonText: "I have another question...",
                    allowOutsideClick: true,
                    customClass: {
                        content: 'swal-answer',
                    },
                }).then((innerResult) => {
                    if (innerResult.isConfirmed) {
                        questionYourFile(sourceID);
                    }
                });
            }
            outerResult = result;
        });
    }

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




    onMount(() => {
        return () => {
            unsubscribe();
        };
    });

    function NASA() {
        const URL = 'https://api.nasa.gov/planetary/apod?api_key=';
        axios
            .get(URL + NASA_API_KEY)
            .then((response) => {
                console.log(response.data);
                Swal.fire({
                    title: response.data.title,
                    text: response.data.explanation,
                    imageUrl: response.data.url,
                    imageAlt: 'NASA image of the day',
                    background: '#1f2937',
                    color: 'white',
                    showConfirmButton: true,
                    confirmButtonColor: '#059669',
                    confirmButtonText: "Cool!",
                    allowOutsideClick: true,
                    customClass: {
                        title: 'nasa-title',
                        content: 'nasa',
                        container: 'nasa',
                        popup: 'nasa',
                        text: 'nasa',
                        htmlContainer: 'nasa',
                        header: 'nasa',
                    },
                    footer: '<a href="https://apod.nasa.gov/apod/astropix.html" target="_blank"><u>NASA\'s APOD</u></a>Each day, a new image from space with an astronomer\'s description'
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
</script>

<div class="relative min-h-0 min-w-0">
    <div class="absolute right-8 top-10 hover:animate-spin transition duration-700" on:click={NASA}>
        <img src="../chatui/rocket.svg" alt="rocket"
             class="h-10 w-10 hover:scale-125 transition-transform duration-700 cursor-pointer">
    </div>
    {#if loginModalOpen}
        <LoginModal {settings} on:close={() => (loginModalOpen = false)}/>
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
                <WebSearchToggle/>
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
                        <CarbonStopFilledAlt/>
                    </button>
                    <div
                            class="mx-1 my-1 hidden h-[2.4rem] items-center p-1 px-[0.7rem] text-gray-400 disabled:opacity-60 enabled:hover:text-gray-700 dark:disabled:opacity-40 enabled:dark:hover:text-gray-100 md:flex"
                    >
                        <EosIconsLoading/>
                    </div>
                {:else}
                    <button
                            class="btn mx-1 my-1 h-[2.4rem] self-end rounded-lg bg-transparent p-1 px-[0.7rem] text-gray-400 disabled:opacity-60 enabled:hover:text-gray-700 dark:disabled:opacity-40 enabled:dark:hover:text-gray-100"
                            disabled={!message || isReadOnly}
                            type="submit"
                    >
                        <CarbonSendAltFilled/>
                    </button>

                {/if}

            </div>
            <div class="flex flex-row items-center justify-center space-x-3 mr-9 mt-1">
                <div>

                    <form enctype="multipart/form-data" id="fileUploadForm">
                        <input type="file" name="fileUpload" id="fileUpload" style="display: none;">
                        <button
                                type="button"
                                on:click={chatWithPDF}
                                title="Upload a PDF!">
                            <img class="h-4 w-4" src="../chatui/file.png" alt="upload a file">
                        </button>
                    </form>
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
                            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
                                    console.log('Following error has occured : ', error)
                                })
                            } else {
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
                <div>
                    <button 
                        type="button"
                        on:click={textImage}
                        title="Generate images!">
                        <img class="h-4 w-4 popup-img" src="../chatui/Paint.png" alt="Pinceau" >
                    </button>
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
            > <span class="max-sm:hidden">·</span><br class="sm:hidden"/> Generated content may be inaccurate
                or false. This is a beta version.
            </p>
            {#if messages.length}
                <button
                        class="flex flex-none items-center hover:text-gray-400 hover:underline max-sm:rounded-lg max-sm:bg-gray-50 max-sm:px-2.5 dark:max-sm:bg-gray-800"
                        type="button"
                        on:click={() => dispatch("share")}
                >
                    <CarbonExport class="text-[.6rem] sm:mr-1.5 sm:text-primary-500"/>
                    <div class="max-sm:hidden">Share this conversation</div>
                </button>
            {/if}
        </div>
    </div>
</div>