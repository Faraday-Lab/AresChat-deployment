<script lang="ts">
    import { onMount } from "svelte";
    import {base} from "$app/paths";

    let email: string | null = null; // initialisez avec null au lieu de ""
    let password = "";
    let confirm_password = "";

    // console.log(email)

    onMount(() => {
        // Récupérer l'email stocké dans le localStorage et l'assigner à la variable email
        email = localStorage.getItem('username');
        console.log(email)
    });

    async function handleSubmit() {
        if (password == confirm_password) {
            // console.log(localStorage);
            // console.log({email});
            // return;
            const url = 'https://auth-pearl-nine.vercel.app/api/reset-password'
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                },
                body: JSON.stringify({email, password}),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                // localStorage.setItem('username', email);
                // @ts-ignore
                window.location.href = '/signin';
            }else {
                const error = await response.json();
                console.log(error.error);
            }
        } else {
            alert('Wrong password confirmation. Please try again.')
        }
    }

</script>

<!-- https://play.tailwindcss.com/MIwj5Sp9pw -->
<div class="py-16 overflow-y-auto">
    <div class="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div class="w-full p-8 lg:w-1/2">
            <h2 class="text-2xl font-semibold text-gray-700 text-center">AresChat</h2>
            <p class="text-xl text-gray-600 text-center">Reset Your Password!</p>

            <div class="mt-4 flex items-center justify-between">
                <span class="border-b w-1/5 lg:w-1/4"></span>
                <span class="text-xs text-center text-gray-500 uppercase">Enter your personal Information</span>
                <span class="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <div class="mt-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                <input name="password" bind:value={password} class="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="password" required/>
            </div>
            <div class="mt-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                <input name="confirm_password" bind:value={confirm_password} class="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="password" required/>
            </div>

            <div class="mt-8">
                <button class="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600" on:click={handleSubmit}>Send</button>
            </div>
            <div class="mt-4 flex items-center justify-between">
                <span class="border-b w-1/5 md:w-1/4"></span>
                <a href={`${base}/signup`} class="text-xs text-gray-500 uppercase">or Login</a>
                <span class="border-b w-1/5 md:w-1/4"></span>
            </div>
        </div>
    </div>
</div>