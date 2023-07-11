<script lang="ts">
    import { onMount } from "svelte";
    import {base} from "$app/paths";
    import {createEventDispatcher} from "svelte";
    import {GoogleAuth, FacebookAuth} from '@beyonk/svelte-social-auth';

    let username = "";
    let password = "";
    let isRegisterPage = false;

     let data;
    // let e;
    function postlogin(e: CustomEvent<any>) {
            data = e.detail.user
    }

    async function handleSubmit() {
      console.log({username, password});
        const url = 'https://auth-server-one.vercel.app/login'
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({username,password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message);
            localStorage.setItem('username', username);
            // @ts-ignore
            window.location.href = '/private'; 
        }else {
            const error = await response.json();
            console.log(error.error);
        }
      
        // Logic to handle form submission
      // e.g., send username and password to the server for authentication
    }
    onMount(()=>{

    })
  
    function toggleRegisterPage() {
      isRegisterPage = !isRegisterPage;
    }
  </script>
<style>
    /* * {
        box-sizing: border-box;
        border: 0 solid #e5e7eb;
    }
    div {
        display: block;
    } */
    
    

</style>
<!-- https://play.tailwindcss.com/MIwj5Sp9pw -->
<div class="py-16 overflow-y-auto">
    <div class="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div class="hidden lg:block lg:w-1/2 bg-cover"
            style="background-image:url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')">
        </div>
        <div class="w-full p-8 lg:w-1/2">
            <h2 class="text-2xl font-semibold text-gray-700 text-center">AresChat</h2>
            <p class="text-xl text-gray-600 text-center">Welcome back!</p>
            <GoogleAuth clientId="477497810640-em07a4lapu80tsdnnhd7km0ln4j3vc17.apps.googleusercontent.com" on:auth-success={e => postlogin(e)} />
            <div class="mt-4 flex items-center justify-between">
                <span class="border-b w-1/5 lg:w-1/4"></span>
                <a href="#" class="text-xs text-center text-gray-500 uppercase">or login with email</a>
                <span class="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <div class="mt-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                <input class="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="email" />
            </div>
            <div class="mt-4">
                <div class="flex justify-between">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <a href="#" class="text-xs text-gray-500">Forget Password?</a>
                </div>
                <input class="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="password" />
            </div>
            <div class="mt-8">
                <button class="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600">Login</button>
            </div>
            <div class="mt-4 flex items-center justify-between">
                <span class="border-b w-1/5 md:w-1/4"></span>
                <a href={`${base}/signup`} class="text-xs text-gray-500 uppercase">or sign up</a>
                <span class="border-b w-1/5 md:w-1/4"></span>
            </div>
        </div>
    </div>
</div>
