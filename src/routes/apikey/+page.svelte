<script>
    function generateUUID()
    {
        var d = new Date().getTime();

        if( window.performance && typeof window.performance.now === "function" )
        {
            d += performance.now();
        }

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    /**
     * Generate new key and insert into output box value
     */


    // button.addEventListener('click', ()=>{
    //     let output = document.getElementById('apikey');
    //     let apiValue;
    //     apiValue = generateUUID();
    //     output.innerHTML = '' + apiValue;
    // })
    export let apiKey = '';
    function handleclick() {
        apiKey = generateUUID();
    }
</script>

<div class="wrapper flex flex-col items-center">
    <h1 class="text-3xl font-semibold mt-4 mb-4">API Key Generator</h1>

    <button class="mt-24 form-control border border-emerald-600 rounded-2xl p-2 bg-emerald-500 text-black hover:bg-emerald-700 hover:scale-110 transition" id="keygen" on:click={handleclick()}>Generate API Key</button>

    <div  class="form-control mt-2" id="apikey">{apiKey}</div>

    <!-- <div style="width: 500px;"><canvas id="dimensions"></canvas></div><br/> -->
    <div style="width: 800px;"><canvas id="acquisitions"></canvas></div>

</div>
