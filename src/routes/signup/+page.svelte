<!-- Registration.svelte -->

<script lang="ts">
    import {base} from "$app/paths";
    import {createEventDispatcher} from "svelte";
    import { invalidateAll } from '$app/navigation';
	import { signIn, signOut, initialize } from 'svelte-google-auth/client';
	import type { PageData } from './$types.js';

    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';

    export let data: PageData;
	initialize(data, invalidateAll);
  
    async function handleSubmit() {
        console.log({username, password});
    }

    function register() {
      // Logique d'enregistrement de l'utilisateur ici
      console.log('Enregistré avec succès !');
      // Réinitialiser les champs de saisie
      username = '';
      email = '';
      password = '';
      confirmPassword = '';
    }
  </script>
  <main class="overflow-y-auto">
  <!-- component -->
<div class="min-h-screen p-6 bg-dark-100 flex items-center justify-center">
    <div class="container max-w-screen-lg mx-auto">
      <div>
        <div class="bg-white rounded border rounded shadow-lg p-4 px-4 md:p-8 mb-6">
          <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
            <div class="text-gray-600">
              <p class="font-medium text-lg">AresChat | Create A New Account</p>
              <p>Welcome,please complete all informations to signup</p>
              <p class="flex items-center justify-center mt-4 mb-4">OR</p>
              <a on:click={() => signIn() || `${base}/`} class="flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100">
                <div class="px-4 py-3">
                    <svg class="h-6 w-6" viewBox="0 0 40 40">
                        <path
                            d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                            fill="#FFC107" />
                        <path
                            d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                            fill="#FF3D00" />
                        <path
                            d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                            fill="#4CAF50" />
                        <path
                            d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                            fill="#1976D2" />
                    </svg>
                </div>
                <h1 class="px-4 py-3 w-5/6 text-center text-gray-600 font-bold">Sign up with Google</h1>
            </a>
            </div>
  
            <div class="lg:col-span-2">
              <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                <div class="md:col-span-5">
                  <label for="full_name" style="color: black;">Full Name</label>
                  <input type="text" name="full_name" id="full_name" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value="" />
                </div>
  
                <div class="md:col-span-5">
                  <label for="email" style="color: black;">Email Address</label>
                  <input type="email" name="email" id="email" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value="" placeholder="email@domain.com" required/>
                </div>
                <div class="md:col-span-5">
                  <label for="password" style="color: black;">Password</label>
                  <input type="password" name="password" id="password" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value="" placeholder="" required />
                </div>
  
                <div class="md:col-span-3">
                  <label for="address" style="color: black;">Tel (optional)</label>
                  <input type="text" name="address" id="address" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value="" placeholder="" />
                </div>
  
                <div class="md:col-span-2">
                  <label for="city" style="color: black;">Organization name (Optional)</label>
                  <input type="text" name="city" id="city" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value="" placeholder="" />
                </div>
                
                <div class="md:col-span-5">
                    <div class="inline-flex items-center">
                      <input type="checkbox" name="billing_same" id="billing_same" class="form-checkbox" required/>
                      <label for="billing_same" class="ml-2" style="color: black;">I accept the terms of service & Privacy policy</label>
                    </div>
                  </div>
                
  
                  <div class="md:col-span-5">
                    <label for="password" style="color: black;">Categories</label>
                  </div>
  
                <div class="md:col-span-5">
                  <div class="inline-flex items-center">
                    <input type="radio" name="billing_same" id="billing_same" class="form-checkbox" required />
                    <label for="billing_same" class="ml-2 mr-4" style="color: black;">Individual</label>
                    <input type="radio" name="billing_same" id="billing_same" class="form-checkbox" required/>
                    <label for="billing_same" class="ml-2" style="color: black;">Organization/Company</label>
                  </div>
                </div>
  
                
        
                <div class="md:col-span-5 text-right">
                  <div class="inline-flex items-end">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={handleSubmit}>Sign Up</button>
                  </div>
                </div>
                <div class="md:col-span-5 text-left">
                  <div class="inline-flex items-end">
                    <label style="color: black;">Already have an account?</label><a href={`${base}/signin`} style="color: blue;" >Login</a>
                  </div>
                </div>
  
              </div>
            </div>
          </div>
        </div>
      </div>
  
    </div>
  </div>
</main>
