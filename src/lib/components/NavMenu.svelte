<script lang="ts">
    import { base } from "$app/paths";
    import { createEventDispatcher, onMount } from "svelte";

    import Logo from "$lib/components/icons/Logo.svelte";
    import { switchTheme } from "$lib/switchTheme";
    import { PUBLIC_APP_NAME, PUBLIC_ORIGIN } from "$env/static/public";
    import NavConversationItem from "./NavConversationItem.svelte";
    import type { LayoutData } from "../../routes/$types";

    export let isPro = false;

    const dispatch = createEventDispatcher<{
        shareConversation: { id: string; title: string };
        clickSettings: void;
        clickLogout: void;
    }>();

    export let conversations: Array<{
        id: string;
        title: string;
    }> = [];
    export let user: LayoutData["user"];

    async function removeValueFromLocalStorage() {
        localStorage.removeItem('username');
    }
    let username = '';
    onMount(()=>{
        username = localStorage.getItem('username') || '';
    });

</script>

<div class="sticky top-0 flex flex-none items-center justify-between px-3 py-3.5 max-sm:pt-0">
    <a class="flex items-center rounded-xl text-lg font-semibold" href="{PUBLIC_ORIGIN}{base}/">
        <Logo classNames="mr-1" />
        {PUBLIC_APP_NAME}
    </a>
    <a
            href={`${base}/`}
            class="flex rounded-lg border bg-white px-2 py-0.5 text-center shadow-sm hover:shadow-none dark:border-gray-600 dark:bg-gray-700"
    >
        New Chat
    </a>
</div>
<div
        class="scrollbar-custom flex flex-col gap-1 overflow-y-auto rounded-r-xl bg-gradient-to-l from-gray-50 px-3 pb-3 pt-2 dark:from-gray-800/30"
>
    {#each conversations as conv (conv.id)}
        <NavConversationItem on:editConversationTitle on:deleteConversation {conv} />
    {/each}
</div>
<div
        class="mt-0.5 flex flex-col gap-1 rounded-r-xl bg-gradient-to-l from-gray-50 p-3 text-sm dark:from-gray-800/30"
>
    {#if username }
        <form
                action="{base}/logout"
                method="post"
                class="group flex items-center gap-1.5 rounded-lg pl-3 pr-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
			<span
                    class="flex h-9 flex-none shrink items-center gap-1.5 truncate pr-2 text-gray-500 dark:text-gray-400"
            >{username}</span
            >
            <button
                    on:click={localStorage.removeItem('username')}
                    type="submit"
                    class="ml-auto h-6 flex-none items-center gap-1.5 rounded-md border bg-white px-2 text-gray-700 shadow-sm group-hover:flex hover:shadow-none dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400 dark:hover:text-gray-300 md:hidden"
            >
                Sign Out
            </button>
        </form>
    {:else}
        <div class="flex flex-row">
            <a
                    href="{base}/signin"
                    rel="noreferrer"
                    class="flex h-9 flex-1 items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >Login
            </a>
            <a
                    href="{base}/signup"
                    class="flex h-9 flex-1 items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >Sign up
            </a></div>
    {/if}
    <div class="flex flex-row font-bold">

            {#if isPro}
                <button
                        rel="noreferrer"
                        class="flex h-9 flex-1 items-center gap-1.5 rounded-lg pl-3 pr-2 text-emerald-500 hover:bg-gray-100 dark:text-emerald-600 dark:hover:bg-gray-700"
                >
            🌟 AresChat Pro
                </button>
                {:else}
                    {#if username}
                <a
                        href="{base}/pricing"
                        rel="noreferrer"
                        class="flex h-9 flex-1 items-center gap-1.5 rounded-lg pl-3 pr-2 text-emerald-500 hover:bg-gray-100 dark:text-emerald-600 dark:hover:bg-gray-700"
                >
                    Subscribe to AresChat Pro!
                </a>
                        {:else}
                        <a
                                href="{base}/signin"
                                rel="noreferrer"
                                class="flex h-9 flex-1 items-center gap-1.5 rounded-lg pl-3 pr-2 text-emerald-500 hover:bg-gray-100 dark:text-emerald-600 dark:hover:bg-gray-700"
                        >
                            Subscribe to AresChat Pro!
                        </a>
                        {/if}
                {/if}

    </div>
    {#if username}
    <a
            href="{base}/apikey"
            rel="noreferrer"
            class="flex h-9 flex-1 items-center gap-1.5 rounded-lg pl-3 pr-2 text-emerald-500 hover:bg-gray-100 dark:text-emerald-600 dark:hover:bg-gray-700"
    >
        Get AresChat API
    </a>
        {:else}
        <a
                href="{base}/signin"
                rel="noreferrer"
                class="flex h-9 flex-1 items-center gap-1.5 rounded-lg pl-3 pr-2 text-emerald-500 hover:bg-gray-100 dark:text-emerald-600 dark:hover:bg-gray-700"
        >
            Get AresChat API
        </a>
        {/if}
    <div class="flex flex-row">
        <button
                on:click={switchTheme}
                type="button"
                class="flex flex-1 h-9 items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
            Theme
        </button>

        <button
                on:click={() => dispatch("clickSettings")}
                type="button"
                class="flex flex-1 h-9 items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
            Settings
        </button>
    </div>
    <div class="flex flex-row">
        <a
                href="https://huggingface.co/spaces/Faradaylab/areschat/discussions"
                target="_blank"
                rel="noreferrer"
                class="flex h-9 flex-1 items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >Feedback
        </a>
        <a
                href="{base}/about"
                class="flex h-9 flex-1 items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >About
        </a></div>
    <div class="flex flex-row">
        <a
                href="{base}/privacy"
                class="flex flex-1 h-9 items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >Privacy
        </a>
        <a
                href="{base}/terms"
                class="flex h-9 flex-1 items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >Terms of Service
        </a>
    </div>
    <div class="flex flex-row">
        <a
                href="https://huggingface.co/Faradaylab"
                title="Our HuggingFace Space!"
                target="_blank"
                class="flex flex-1 h-9 items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 justify-center"
        ><img src="../chatui/socials/hf.svg" alt="HuggingFace Space" class="h-4 w-4">
        </a>
        <a
                href="https://twitter.com/areschatlab"
                title="Follow us on Twitter!"
                target="_blank"
                class="flex h-9 flex-1 items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 justify-center"
        ><img src="../chatui/socials/twitter.svg" alt="Twitter" class="h-4 w-4">
        </a>
        <a
                href="https://discord.gg/j4cvbAsm"
                title="Join our Discord!"
                target="_blank"
                class="flex h-9 flex-1 items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 justify-center"
        ><img src="../chatui/socials/discord.svg" alt="Discord" class="h-4 w-4">
        </a>
        <a
                href="https://github.com/Faraday-Lab"
                title="Follow us on GitHub!"
                target="_blank"
                class="flex h-9 flex-1 items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 justify-center"
        ><img src="../chatui/socials/github.svg" alt="GitHub" class="h-4 w-4">
        </a>
        <a
                href="https://groups.google.com/g/ares-community"
                title="Join our Community Group on Google!"
                target="_blank"
                class="flex h-9 flex-1 items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 justify-center"
        ><img src="../chatui/socials/google.svg" alt="Google Group" class="h-4 w-4">
        </a>
    </div>
</div>