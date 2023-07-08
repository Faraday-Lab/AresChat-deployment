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
