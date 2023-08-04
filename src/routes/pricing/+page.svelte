<script lang="ts">
    import {onMount} from 'svelte';

    onMount(() =>{
        const stripeScript = document.createElement('script');
        stripeScript.src = "https://js.stripe.com/v3/pricing-table.js";
        stripeScript.async = true;
        document.head.appendChild(stripeScript);
    });
</script>

<svelte:head>
    <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
</svelte:head>

<main class="w-3/4 mx-auto">
    <h1 class="text-2xl font-semibold text-center mt-4 mb-4 border-2 w-fit mx-auto p-2 rounded-xl border-emerald-600 bg-emerald-500 text-gray-700">Subscribe to Pro Version of AresChat</h1>

        <stripe-pricing-table class="rounded-2xl"
                pricing-table-id="prctbl_1NEw6qCeOmHmmUSp1et4tEvt"
                publishable-key="pk_live_51MaJ2zCeOmHmmUSp1kz92q40YXmh6ZZrsqcQ1PjEyHMU8yAQzY8wEV7jT0Uoc9LMOMyyJT59ZAOiqAjMnLkxPHVm00gq2FTFfD"
        >

        </stripe-pricing-table>

</main>


<!--<style>-->
<!--    /* Appliquer le style pour centrer les éléments */-->
<!--    .container {-->
<!--        width: 75%;-->
<!--        display: flex;-->
<!--        flex-direction: column;-->
<!--        align-items: center;-->
<!--        justify-content: center;-->
<!--        min-height: 100vh; /* Assurez-vous que la hauteur de l'écran est couverte par le conteneur */-->
<!--    }-->

<!--    /* Appliquer le style pour le texte <h1> en gras */-->
<!--    .heading {-->
<!--        font-weight: bold;-->
<!--    }-->
<!--</style>-->