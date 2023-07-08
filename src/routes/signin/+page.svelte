<script>
	import { onMount } from "svelte";

    let username = "";
    let password = "";
    let isRegisterPage = false;
  
    async function handleSubmit() {
      console.log({username, password});
        const url = 'https://auth-server-one.vercel.app/login'
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
    main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: transparent;
  font-family: Arial, sans-serif;
}

.login-container {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 40px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  margin-bottom: 30px;
  color: #333333;
}

form input {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #cccccc;
  border-radius: 4px;
}

form button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

form button:hover {
  background-color: #45a049;
}

p a {
  color: #333333;
  text-decoration: none;
}

p a:hover {
  text-decoration: underline;
}

</style>

<main class="w-4/5 flex justify-center mx-auto">
    <div class="flex flex-col items-center">
        <img src="../chatui/vert_bleu.svg" class="h-32" alt="logo"/>
       <h1 class="text-5xl font-semibold text-emerald-600 mt-4">Best AI of the world</h1>
    </div>
    <div class="login-container">
        <h1 class="text-5xl font-semibold text-emerald-600 mt-4">Login Page</h1>
        <form on:submit|preventDefault={handleSubmit}>
          <input type="text" bind:value={username} placeholder="Username" required>
          <input type="password" bind:value={password} placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
        <p><a href="#">Mot de passe oublié ?</a></p>
        <p class="m-4">Don't have a account?  <a href="#">Register</a></p>
      </div>
</main>
