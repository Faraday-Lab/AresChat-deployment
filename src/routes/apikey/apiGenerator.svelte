
<script>
    let randomApiValue = ""; // Default value, you can set any initial value you like
  
    function generateUUID()
    {
        var d = new Date().getTime();

        if( window.performance && typeof window.performance.now === "function" )
        {
            d += performance.now();
        }

        const randomApiKey = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

        randomApiValue = `${randomApiKey}`;
    }
</script>
  
<main class="flex-col w-full h-fit m-0  p-0 ">
  <div class="p-2 bg-gray-700 rounded-lg w-full h-fit mt-2">Api Key: {randomApiValue} </div>
  <div class="w-full flex justify-center mt-4"> <button class="text-center w-fit py-1  neon-green-btn" on:click={generateUUID}>Generate Api Key</button></div>
</main>

<style>
    .neon-green-btn {
      /* Neon green color */
      background-color: #39ff14;
      /* Other button styles (you can customize these as needed) */
      padding: 12px 20px;
      font-size: 16px;
      border: none;
      color: #ffffff;
      border-radius: 8px;
      cursor: pointer;
      /* Neon glow effect */
      box-shadow: 0 0 10px #39ff14, 0 0 10px #39ff14, 0 0 10px #39ff14, 0 0 10px #39ff14, 0 0 10px #39ff14, 0 0 10px #39ff14;
      /* Transition for smooth hover animation */
      transition: box-shadow 0.3s ease-in-out;
    }
  
    /* Hover state for the button */
    .neon-green-btn:hover {
      box-shadow: 0 0 10px #39ff14, 0 0 10px #39ff14, 0 0 10px #39ff14, 0 0 80px #39ff14, 0 0 10px #39ff14, 0 0 10px #39ff14;
    }
</style>

  
  
  
  
  